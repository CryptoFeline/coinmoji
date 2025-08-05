import { Handler } from '@netlify/functions';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

interface RenderFramesRequest {
  settings: {
    fillMode: 'solid' | 'gradient';
    bodyColor: string;
    gradientStart?: string;
    gradientEnd?: string;
    bodyTextureUrl?: string;
    metallic: boolean;
    rotationSpeed: 'slow' | 'medium' | 'fast';
    overlayUrl?: string;
    dualOverlay?: boolean;
    overlayUrl2?: string;
    gifAnimationSpeed: 'slow' | 'medium' | 'fast';
    lightColor: string;
    lightStrength: 'low' | 'medium' | 'high';
  };
  exportSettings: {
    fps: number;
    duration: number;
    frames: number;
    qualityMode: 'high' | 'balanced' | 'compact';
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  console.log('🎬 Server-side Three.js frame rendering started');

  let browser;
  try {
    const request: RenderFramesRequest = JSON.parse(event.body || '{}');
    
    console.log('📋 Render request:', {
      settings: request.settings,
      exportSettings: request.exportSettings
    });

    console.log('🚀 Launching Chrome via @sparticuz/chromium...');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      AWS_LAMBDA_JS_RUNTIME: process.env.AWS_LAMBDA_JS_RUNTIME,
      chromeExecutable: 'from @sparticuz/chromium'
    });

    console.log('✅ Using @sparticuz/chromium for serverless Chrome');

    // Launch Chrome with @sparticuz/chromium
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: 'shell'
    });

    console.log('✅ Chrome launched successfully');

    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 400 });

    console.log('🎨 Injecting Three.js and creating scene...');

    // Inject Three.js and create identical scene
    const framesBase64 = await page.evaluate(async (renderRequest) => {
      // Create script element to load Three.js
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.158.0/build/three.min.js';
      document.head.appendChild(script);
      
      // Wait for Three.js to load with timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Three.js loading timeout'));
        }, 10000); // 10 second timeout
        
        script.onload = () => {
          clearTimeout(timeout);
          resolve(undefined);
        };
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Three.js loading failed'));
        };
      });

      const THREE = (window as any).THREE;
      if (!THREE) {
        throw new Error('Failed to load Three.js - THREE is undefined');
      }

      console.log('✅ Three.js loaded in headless Chrome:', THREE.REVISION);

      // Create identical scene to client-side
      const scene = new THREE.Scene();
      scene.background = null; // Transparent

      // Create identical camera
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 2.8);
      camera.lookAt(0, 0, 0);

      // Create identical renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(100, 100); // Direct 100px rendering
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(1);
      
      // Append to DOM (required for WebGL context)
      document.body.appendChild(renderer.domElement);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      renderer.domElement.style.left = '0px';
      renderer.domElement.style.zIndex = '-1';

      console.log('🎯 Created identical Three.js setup');

      // Planar UV mapping helper (identical to CoinEditor.tsx)
      const planarMapUVs = (geometry) => {
        geometry.computeBoundingBox();
        const bb = geometry.boundingBox;
        const r = Math.max(
          Math.abs(bb.max.x),
          Math.abs(bb.min.x),
          Math.abs(bb.max.z),
          Math.abs(bb.min.z)
        );

        const position = geometry.attributes.position;
        const uvArray = new Float32Array(position.count * 2);

        for (let i = 0; i < position.count; i++) {
          const x = position.getX(i);
          const z = position.getZ(i);
          const u = 0.5 + (x / r) * 0.48;
          const v = 1 - (0.5 + (z / r) * 0.48);
          uvArray[i * 2] = u;
          uvArray[i * 2 + 1] = v;
        }

        geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
      };

      // Create coin geometry (EXACT COPY from CoinEditor.tsx)
      const { settings } = renderRequest;
      
      // Coin parameters (identical to CoinEditor.tsx)
      const R = 1.0;
      const T = 0.35;
      const bulge = 0.10;
      const radialSegments = 128;
      const capSegments = 32;

      // Materials (identical to CoinEditor.tsx)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 1,
        roughness: 0.34,
        envMapIntensity: 1
      });
      const faceMat = rimMat.clone();

      // Coin geometry (identical to CoinEditor.tsx)
      const cylinderGeometry = new THREE.CylinderGeometry(R, R, T, radialSegments, 1, true);
      const cylinder = new THREE.Mesh(cylinderGeometry, rimMat);

      // Face creation function (identical to CoinEditor.tsx)
      const createFace = (isTop) => {
        const geometry = new THREE.SphereGeometry(
          R,
          radialSegments,
          capSegments,
          0,
          Math.PI * 2,
          isTop ? 0 : Math.PI / 2,
          Math.PI / 2
        );
        geometry.scale(1, bulge / R, 1);
        geometry.translate(0, isTop ? T / 2 : -T / 2, 0);
        return new THREE.Mesh(geometry, faceMat);
      };

      const topFace = createFace(true);
      const bottomFace = createFace(false);

      // Overlay creation (identical to CoinEditor.tsx)
      const overlayMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        metalness: 0,
        roughness: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        opacity: 0
      });

      const createOverlay = (isTop) => {
        const mesh = createFace(isTop);
        mesh.material = overlayMaterial.clone();
        planarMapUVs(mesh.geometry);
        return mesh;
      };

      const overlayTop = createOverlay(true);
      const overlayBot = createOverlay(false);

      // Coin assembly (identical to CoinEditor.tsx)
      const coinGroup = new THREE.Group();
      coinGroup.add(cylinder, topFace, bottomFace, overlayTop, overlayBot);
      coinGroup.rotation.x = Math.PI / 2; // Stand on edge

      // Turntable (identical to CoinEditor.tsx)
      const turntable = new THREE.Group();
      turntable.add(coinGroup);
      scene.add(turntable);

      // Add IDENTICAL lighting and environment to CoinEditor.tsx
      console.log('💡 Setting up identical lighting and environment...');
      
      // Hemisphere + Directional lights (exact match to CoinEditor.tsx)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.45);
      scene.add(hemiLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(3, 5, 2);
      scene.add(dirLight);
      
      // Environment map (identical to CoinEditor.tsx for realistic reflections)
      console.log('🌍 Loading environment map for metallic reflections...');
      const loader = new THREE.CubeTextureLoader();
      const envMap = await new Promise((resolve, reject) => {
        loader.load([
          'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
          'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
          'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
          'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
          'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
          'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
        ], resolve, undefined, reject);
      });
      scene.environment = envMap;
      
      console.log('✅ Environment map loaded - metallic reflections ready');

      // Apply user lighting settings (EXACT match to CoinEditor.tsx)
      console.log('💡 Applying user lighting settings...');
      
      // Light strength mapping (identical to CoinEditor.tsx)
      const lightStrengthMap = {
        low: { hemi: 0.3, dir: 0.5 },
        medium: { hemi: 0.45, dir: 0.8 },
        strong: { hemi: 1.2, dir: 3.0 }
      };
      
      const strength = lightStrengthMap[settings.lightStrength];
      hemiLight.intensity = strength.hemi;
      dirLight.intensity = strength.dir;
      
      hemiLight.color.set(settings.lightColor);
      dirLight.color.set(settings.lightColor);
      
      console.log('✅ Applied lighting:', {
        color: settings.lightColor,
        strength: settings.lightStrength,
        hemiIntensity: strength.hemi,
        dirIntensity: strength.dir
      });

      // Apply material settings (EXACT match to CoinEditor.tsx)
      console.log('🎨 Applying user material settings...');
      if (settings.fillMode === 'solid') {
        rimMat.color.set(settings.bodyColor);
        faceMat.color.set(settings.bodyColor);
        console.log('🎯 Applied solid color:', settings.bodyColor);
      } else {
        // Create gradient texture (identical to CoinEditor.tsx)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, settings.gradientStart || '#00eaff');
        gradient.addColorStop(1, settings.gradientEnd || '#ee00ff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        rimMat.map = texture;
        faceMat.map = texture;
        rimMat.color.set('#ffffff'); // Base white for texture
        faceMat.color.set('#ffffff');
        console.log('🌈 Applied gradient texture:', settings.gradientStart, '->', settings.gradientEnd);
      }

      // Update metallic properties (identical to CoinEditor.tsx)
      rimMat.metalness = settings.metallic ? 1 : 0.1;
      rimMat.roughness = settings.metallic ? 0.34 : 0.7;
      faceMat.metalness = settings.metallic ? 1 : 0.1;
      faceMat.roughness = settings.metallic ? 0.34 : 0.7;
      console.log('⚡ Applied metallic settings:', settings.metallic);

      // Process overlays directly from settings URLs (FIX: use overlayUrl, not overlayFront)
      console.log('🎨 Processing overlay URLs directly from settings...');
      
      // Helper function to fetch and process GIF
      const processGIF = async (url: string) => {
        try {
          console.log('🎞️ Fetching GIF:', url);
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          
          // Parse GIF (we need to import gifuct-js in the page context)
          const gifData = await page.evaluate(async (buffer) => {
            // Load gifuct-js in browser context
            const script = document.createElement('script');
            script.src = 'https://cdn.skypack.dev/gifuct-js';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = reject;
            });
            
            const { parseGIF, decompressFrames } = (window as any).gifuct;
            const gif = parseGIF(buffer);
            const frames = decompressFrames(gif, true);
            
            return {
              frames: frames.map(frame => ({
                dims: frame.dims,
                patch: Array.from(frame.patch) // Convert Uint8ClampedArray to regular array
              })),
              width: gif.lsd.width,
              height: gif.lsd.height
            };
          }, Array.from(new Uint8Array(buffer)));
          
          console.log('✅ GIF processed:', { frameCount: gifData.frames.length, size: `${gifData.width}x${gifData.height}` });
          return gifData;
        } catch (error) {
          console.warn('⚠️ Failed to process GIF:', error);
          return null;
        }
      };

      let gifAnimationState: any = null;
      
      // Apply front overlay (FIXED: use overlayUrl directly)
      if (settings.overlayUrl) {
        console.log('� Applying front overlay');
        
        let overlayTexture: THREE.Texture | null = null;
        
        if (settings.overlayUrl.toLowerCase().includes('.gif')) {
          // Process GIF
          const gifData = await processGIF(settings.overlayUrl);
          if (gifData && gifData.frames.length > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = gifData.width;
            canvas.height = gifData.height;
            const ctx = canvas.getContext('2d')!;
            
            // Draw first frame
            const frame = gifData.frames[0];
            const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
            imageData.data.set(new Uint8ClampedArray(frame.patch));
            ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            overlayTexture = texture;
            
            // Set up GIF animation state
            gifAnimationState = {
              type: 'front',
              frames: gifData.frames,
              currentFrame: 0,
              frameCounter: 0,
              frameInterval: 2,
              canvas,
              ctx,
              texture: texture
            };
          }
        } else {
          // Process static image
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';
          img.src = settings.overlayUrl;
          await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          overlayTexture = texture;
        }
        
        if (overlayTexture) {
          overlayTexture.flipY = false;
          
          if (settings.dualOverlay) {
            // Apply only to top face in dual mode
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
          } else {
            // Apply to both faces in single mode
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
            
            overlayBot.material.map = overlayTexture;
            overlayBot.material.opacity = 1;
            overlayBot.material.needsUpdate = true;
          }
          console.log('✅ Front overlay applied');
        }
      }

      // Apply back overlay (from overlayUrl2) in dual overlay mode
      if (settings.dualOverlay && settings.overlayUrl2) {
        console.log('🎨 Applying back overlay from URL2:', settings.overlayUrl2);
        
        let overlayTexture: THREE.Texture | null = null;
        
        if (settings.overlayUrl2.toLowerCase().includes('.gif')) {
          // Process GIF
          const gifData = await processGIF(settings.overlayUrl2);
          if (gifData && gifData.frames.length > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = gifData.width;
            canvas.height = gifData.height;
            const ctx = canvas.getContext('2d')!;
            
            // Draw first frame
            const frame = gifData.frames[0];
            const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
            imageData.data.set(new Uint8ClampedArray(frame.patch));
            ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            overlayTexture = texture;
          }
        } else {
          // Process static image
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';
          img.src = settings.overlayUrl2;
          await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          overlayTexture = texture;
        }
        
        if (overlayTexture) {
          overlayTexture.flipY = false;
          overlayBot.material.map = overlayTexture;
          overlayBot.material.opacity = 1;
          overlayBot.material.needsUpdate = true;
          console.log('✅ Back overlay applied');
        }
      }

      console.log('🪙 Created identical coin geometry and materials');

      // Capture frames with identical rotation
      const frames: string[] = [];
      const { exportSettings } = renderRequest;
      
      for (let i = 0; i < exportSettings.frames; i++) {
        // Update animated GIF texture if present (identical to client)
        if (gifAnimationState && gifAnimationState.frames.length > 1) {
          gifAnimationState.frameCounter++;
          
          // Only advance frame when we hit the interval
          if (gifAnimationState.frameCounter >= gifAnimationState.frameInterval) {
            // Advance to next frame
            gifAnimationState.currentFrame = (gifAnimationState.currentFrame + 1) % gifAnimationState.frames.length;
            
            // Draw new frame (identical to client logic)
            const frame = gifAnimationState.frames[gifAnimationState.currentFrame];
            const imageData = new ImageData(
              new Uint8ClampedArray(frame.patch),
              frame.dims.width,
              frame.dims.height
            );
            
            // Clear canvas (handle disposal method)
            if (frame.disposalType === 2) {
              gifAnimationState.ctx.clearRect(0, 0, gifAnimationState.canvas.width, gifAnimationState.canvas.height);
            }
            
            // Create temporary canvas for the frame
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCanvas.width = frame.dims.width;
            tempCanvas.height = frame.dims.height;
            tempCtx.putImageData(imageData, 0, 0);
            
            // Draw frame at correct position
            gifAnimationState.ctx.drawImage(
              tempCanvas,
              frame.dims.left,
              frame.dims.top,
              frame.dims.width,
              frame.dims.height
            );
            
            // Mark texture as needing update
            if (gifAnimationState.texture) {
              gifAnimationState.texture.needsUpdate = true;
            }
            
            // Reset counter
            gifAnimationState.frameCounter = 0;
          }
        }
        
        // Identical rotation calculation to client
        const frameProgress = i / (exportSettings.frames - 1);
        const totalRotation = frameProgress * Math.PI * 2;
        turntable.rotation.y = totalRotation;

        // Render frame
        renderer.render(scene, camera);

        // Capture as WebP with maximum quality
        const dataURL = renderer.domElement.toDataURL('image/webp', 0.99);
        const base64 = dataURL.split(',')[1];
        frames.push(base64);

        if (i === 0 || i === exportSettings.frames - 1 || i % 10 === 0) {
          console.log(`📸 Captured server frame ${i + 1}/${exportSettings.frames}`);
        }
      }

      console.log(`✅ Server-side frame capture complete: ${frames.length} frames`);
      return frames;

    }, request);

    console.log(`✅ Server-side rendering complete: ${framesBase64.length} frames captured`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        frames: framesBase64,
        frames_count: framesBase64.length,
        rendering_environment: 'headless_chrome_threejs'
      }),
    };

  } catch (error) {
    console.error('❌ Server-side rendering error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown rendering error',
        details: 'Server-side Three.js rendering failed'
      }),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
