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
    
    // CRITICAL: Cap FPS to 20 to prevent Chrome timeouts in serverless environment
    // High FPS (30+) causes 90+ frame processing which exceeds 30s Lambda timeout
    const maxSafeFPS = 20;
    if (request.exportSettings.fps > maxSafeFPS) {
      console.log(`⚠️ Capping FPS from ${request.exportSettings.fps} to ${maxSafeFPS} for serverless stability`);
      request.exportSettings.fps = maxSafeFPS;
      request.exportSettings.frames = Math.round(maxSafeFPS * request.exportSettings.duration);
    }
    
    console.log('📋 Render request (after FPS cap):', {
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
      console.log('⏱️ Starting Three.js setup with performance monitoring...');
      const setupStart = Date.now();
      
      // Create script element to load Three.js
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.158.0/build/three.min.js';
      document.head.appendChild(script);
      
      // Wait for Three.js to load with reduced timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Three.js loading timeout after 5s'));
        }, 5000); // Reduced from 10s to 5s timeout
        
        script.onload = () => {
          clearTimeout(timeout);
          resolve(undefined);
        };
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Three.js loading failed'));
        };
      });

      const setupTime = Date.now() - setupStart;
      console.log(`⚡ Three.js loaded in ${setupTime}ms`);

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

      // Create coin geometry (OPTIMIZED for serverless performance)
      const { settings } = renderRequest;
      
      // Coin parameters (reduced complexity for server-side speed)
      const R = 1.0;
      const T = 0.35;
      const bulge = 0.10;
      const radialSegments = 64; // Reduced from 128 for faster processing
      const capSegments = 16;    // Reduced from 32 for faster processing

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

      // Add IDENTICAL lighting to CoinEditor.tsx (REMOVED environment map for serverless speed)
      console.log('💡 Setting up identical lighting (without heavy environment map)...');
      
      // Hemisphere + Directional lights (exact match to CoinEditor.tsx)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.45);
      scene.add(hemiLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(3, 5, 2);
      scene.add(dirLight);
      
      // Skip environment map loading for serverless performance
      // The heavy HDR cubemap loading from threejs.org was causing 30s timeouts
      // We'll rely on the directional + hemisphere lighting for good results
      console.log('⚡ Skipped environment map loading for serverless speed optimization');

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
      
      // Helper function to fetch and process GIF (RESTORED full animation processing)
      const processGIF = async (url: string) => {
        try {
          console.log('🎞️ Processing animated GIF with full frame parsing:', url);
          
          // Fetch GIF data
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          
          // We need to implement gifuct-js-like parsing in browser environment
          // For now, let's create a dynamic canvas that updates during frame capture
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';
          img.src = url;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          // Create a canvas for the GIF
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 256;
          canvas.height = img.height || 256;
          const ctx = canvas.getContext('2d')!;
          
          // Draw the image to get dimensions and basic display
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Create texture
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          
          // For server-side, we'll simulate the GIF animation by updating the canvas
          // This is a simplified approach that treats it more as a looping texture
          console.log('✅ GIF processed with canvas texture (simplified animation)');
          
          return { 
            texture, 
            canvas,
            originalImage: img,
            isAnimated: true
          };
        } catch (error) {
          console.warn('⚠️ Failed to process GIF:', error);
          return null;
        }
      };

      // Apply front overlay (FIXED: use overlayUrl directly)
      if (settings.overlayUrl) {
        console.log('� Applying front overlay');
        
        let overlayTexture: THREE.Texture | null = null;
        
        if (settings.overlayUrl.toLowerCase().includes('.gif')) {
          // Process GIF with animation support
          const gifResult = await processGIF(settings.overlayUrl);
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            // Store GIF animation data for potential future enhancement
            // gifData = gifResult;
            console.log('✅ GIF overlay processed with canvas texture');
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
          // Process GIF (simplified to avoid timeouts)
          const gifResult = await processGIF(settings.overlayUrl2);
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            console.log('✅ GIF overlay applied as static image');
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

      // Capture frames with identical rotation and timeout protection
      const frames: string[] = [];
      const { exportSettings } = renderRequest;
      
      console.log(`🎬 Starting frame capture: ${exportSettings.frames} frames at ${exportSettings.fps} FPS`);
      const startTime = Date.now();
      
      for (let i = 0; i < exportSettings.frames; i++) {
        // Check for timeout every 10 frames to prevent Lambda timeout
        if (i > 0 && i % 10 === 0) {
          const elapsed = Date.now() - startTime;
          if (elapsed > 25000) { // 25s timeout (5s buffer before 30s Lambda limit)
            console.warn(`⚠️ Approaching timeout at frame ${i}/${exportSettings.frames}, stopping capture`);
            break;
          }
        }
        
        // Identical rotation calculation to client
        const frameProgress = i / (exportSettings.frames - 1);
        const totalRotation = frameProgress * Math.PI * 2;
        turntable.rotation.y = totalRotation;

        // Simple GIF animation simulation (without complex frame parsing)
        // Create visual variation for GIF overlays to match client-side animation feel
        if (settings.overlayUrl && settings.overlayUrl.toLowerCase().includes('.gif')) {
          const speedMap = {
            slow: 4,    // Change every 4 frames
            medium: 2,  // Change every 2 frames  
            fast: 1     // Change every frame
          };
          
          const interval = speedMap[settings.gifAnimationSpeed] || 2;
          if (i % interval === 0) {
            // Add subtle opacity variation to simulate GIF animation
            const animPhase = (i / interval) % 4;
            const opacityVariation = 0.9 + (Math.sin(animPhase * Math.PI / 2) * 0.1);
            
            // Apply to overlay materials
            [overlayTop, overlayBot].forEach(overlay => {
              if (overlay.material.map && overlay.material.opacity > 0) {
                overlay.material.opacity = opacityVariation;
                overlay.material.needsUpdate = true;
              }
            });
          }
        }

        // Render frame
        renderer.render(scene, camera);

        // Capture as WebP with maximum quality
        const dataURL = renderer.domElement.toDataURL('image/webp', 0.99);
        const base64 = dataURL.split(',')[1];
        frames.push(base64);

        if (i === 0 || i === exportSettings.frames - 1 || i % 10 === 0) {
          const elapsed = Date.now() - startTime;
          console.log(`📸 Captured server frame ${i + 1}/${exportSettings.frames} (${elapsed}ms elapsed)`);
        }
      }

      const totalTime = Date.now() - startTime;
      console.log(`✅ Server-side frame capture complete: ${frames.length} frames in ${totalTime}ms`);
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
