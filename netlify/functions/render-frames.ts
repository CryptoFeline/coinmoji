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

      // Create coin geometry (identical to client)
      const coinGroup = new THREE.Group();
      const turntable = new THREE.Group();
      
      // Coin geometry
      const rimGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
      const faceGeometry = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      
      // Materials based on settings
      let material;
      const { settings } = renderRequest;
      
      if (settings.fillMode === 'solid') {
        material = new THREE.MeshStandardMaterial({
          color: settings.bodyColor,
          metalness: settings.metallic ? 0.8 : 0.1,
          roughness: settings.metallic ? 0.2 : 0.7,
          transparent: true,
          side: THREE.DoubleSide
        });
      } else {
        // Gradient material implementation
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
        
        material = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: settings.metallic ? 0.8 : 0.1,
          roughness: settings.metallic ? 0.2 : 0.7,
          transparent: true,
          side: THREE.DoubleSide
        });
      }

      // Create coin meshes
      const rim = new THREE.Mesh(rimGeometry, material);
      const frontFace = new THREE.Mesh(faceGeometry, material);
      const backFace = new THREE.Mesh(faceGeometry, material);
      
      frontFace.position.z = 0.05;
      backFace.position.z = -0.05;
      backFace.rotation.x = Math.PI;
      
      coinGroup.add(rim, frontFace, backFace);
      turntable.add(coinGroup);
      scene.add(turntable);

      // Add identical lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(settings.lightColor || '#ffffff', 1);
      directionalLight.position.set(2, 2, 2);
      scene.add(directionalLight);

      // Add overlay support with animated GIF handling
      let overlayTexture: THREE.Texture | null = null;
      let gifAnimationState: any = null;
      
      if (settings.overlayUrl) {
        console.log('🖼️ Loading overlay texture:', settings.overlayUrl);
        
        try {
          const isGif = /\.gif$/i.test(settings.overlayUrl);
          
          if (isGif) {
            console.log('🎞️ Processing animated GIF overlay...');
            
            // Load gifuct-js dynamically for server-side GIF parsing
            const { parseGIF, decompressFrames } = await import('gifuct-js');
            
            // Fetch and parse GIF
            const response = await fetch(settings.overlayUrl);
            const buffer = await response.arrayBuffer();
            const gif = parseGIF(buffer);
            const frames = decompressFrames(gif, true);
            
            console.log('🎯 GIF parsed on server:', { 
              frameCount: frames.length,
              width: gif.lsd.width,
              height: gif.lsd.height
            });
            
            // Create canvas for GIF frames
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = gif.lsd.width;
            canvas.height = gif.lsd.height;
            
            overlayTexture = new THREE.CanvasTexture(canvas);
            overlayTexture.colorSpace = THREE.SRGBColorSpace;
            overlayTexture.flipY = true;
            
            // Frame-rate-based speed mapping (identical to client)
            const getFrameInterval = () => {
              const intervalMap = {
                slow: 4,      // Change frame every 4 renders (15fps effective)
                medium: 2,    // Change frame every 2 renders (30fps effective)  
                fast: 1       // Change frame every render (60fps effective)
              };
              return intervalMap[settings.gifAnimationSpeed];
            };
            
            // GIF animation state
            gifAnimationState = {
              frames,
              currentFrame: 0,
              frameCounter: 0,
              frameInterval: getFrameInterval(),
              canvas,
              ctx
            };
            
            // Helper to draw frame to canvas (identical to client)
            const drawFrame = (frameIndex: number) => {
              const frame = frames[frameIndex];
              const imageData = new ImageData(
                new Uint8ClampedArray(frame.patch),
                frame.dims.width,
                frame.dims.height
              );
              
              // Clear canvas (handle disposal method)
              if (frame.disposalType === 2) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
              
              // Create temporary canvas for the frame
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d')!;
              tempCanvas.width = frame.dims.width;
              tempCanvas.height = frame.dims.height;
              tempCtx.putImageData(imageData, 0, 0);
              
              // Draw frame at correct position
              ctx.drawImage(
                tempCanvas,
                frame.dims.left,
                frame.dims.top,
                frame.dims.width,
                frame.dims.height
              );
            };
            
            // Draw initial frame
            drawFrame(0);
            
            console.log('✅ Animated GIF overlay loaded and ready');
          } else {
            // Static image loading (unchanged)
            const textureLoader = new THREE.TextureLoader();
            overlayTexture = await new Promise<THREE.Texture>((resolve, reject) => {
              textureLoader.load(
                settings.overlayUrl!,
                resolve,
                undefined,
                reject
              );
            });
            console.log('✅ Static overlay texture loaded');
          }
          
          // Create overlay material and mesh
          if (overlayTexture) {
            const overlayMaterial = new THREE.MeshBasicMaterial({
              map: overlayTexture,
              transparent: true,
              alphaTest: 0.1,
              side: THREE.DoubleSide
            });
            
            // Add overlay to front face
            const overlayGeometry = new THREE.PlaneGeometry(1.8, 1.8);
            const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
            overlay.position.z = 0.06; // Slightly in front of coin face
            coinGroup.add(overlay);
          }
          
        } catch (overlayError) {
          console.warn('⚠️ Failed to load overlay texture:', overlayError);
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
            if (overlayTexture) {
              overlayTexture.needsUpdate = true;
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
