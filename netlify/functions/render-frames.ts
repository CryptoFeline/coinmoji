import { Handler } from '@netlify/functions';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

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

    console.log('🚀 Launching serverless Chrome...');

    // Launch headless Chrome with chrome-aws-lambda
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
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

      // Add overlay support if provided
      if (settings.overlayUrl) {
        console.log('🖼️ Loading overlay texture:', settings.overlayUrl);
        
        try {
          const textureLoader = new THREE.TextureLoader();
          const overlayTexture = await new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(
              settings.overlayUrl!,
              resolve,
              undefined,
              reject
            );
          });
          
          // Create overlay material
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
          
          console.log('✅ Overlay texture loaded and applied');
        } catch (overlayError) {
          console.warn('⚠️ Failed to load overlay texture:', overlayError);
        }
      }

      console.log('🪙 Created identical coin geometry and materials');

      // Capture frames with identical rotation
      const frames: string[] = [];
      const { exportSettings } = renderRequest;
      
      for (let i = 0; i < exportSettings.frames; i++) {
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
