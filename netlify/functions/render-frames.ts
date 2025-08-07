import { Handler } from '@netlify/functions';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to create data URLs from local files for server-side rendering
const createDataUrlFromFile = async (filePath: string): Promise<string> => {
  const fileBuffer = await fs.promises.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  // Map file extensions to MIME types
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', 
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webm': 'video/webm'
  };
  
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  const base64Data = fileBuffer.toString('base64');
  
  return `data:${mimeType};base64,${base64Data}`;
};

// Helper to check if a path is a local file vs URL
const isLocalFile = (pathOrUrl: string): boolean => {
  return pathOrUrl.startsWith('/') || pathOrUrl.includes('\\');
};

interface RenderFramesRequest {
  settings: {
    fillMode: 'solid' | 'gradient';
    bodyColor: string;
    gradientStart?: string;
    gradientEnd?: string;
    bodyTextureUrl?: string;
    bodyTextureMode?: 'url' | 'upload';
    bodyTextureTempId?: string; // Server-side temp file ID for uploaded body texture
    metallic: boolean;
    rotationSpeed: 'slow' | 'medium' | 'fast';
    overlayUrl?: string;
    overlayMode?: 'url' | 'upload';
    overlayTempId?: string; // Server-side temp file ID for uploaded overlay
    dualOverlay?: boolean;
    overlayUrl2?: string;
    overlayMode2?: 'url' | 'upload';
    overlayTempId2?: string; // Server-side temp file ID for uploaded overlay2
    gifAnimationSpeed: 'slow' | 'medium' | 'fast';
    lightColor: string;
    lightStrength: 'low' | 'medium' | 'high';
    // New customization settings
    coinShape?: 'thin' | 'normal' | 'thick';
    overlayMetalness?: 'low' | 'normal' | 'high';
    overlayRoughness?: 'low' | 'normal' | 'high';
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

    // Load browser-bundled gifuct-js (IIFE format for browser compatibility)
    console.log('📦 Loading browser-bundled gifuct-js...');
    const vendorGifuctPath = path.join(__dirname, 'vendor', 'gifuct.browser.js');
    
    if (!fs.existsSync(vendorGifuctPath)) {
      throw new Error('Browser-bundled gifuct-js not found - run "npm run build:gifuct" first');
    }
    
    console.log('✅ Browser-bundled gifuct-js found at:', vendorGifuctPath);

    // Inject browser-bundled gifuct-js into the page BEFORE page.evaluate
    await page.addScriptTag({ path: vendorGifuctPath });
    console.log('✅ Browser-bundled gifuct-js injected into page');

    // Inject Three.js and create identical scene with browser-bundled gifuct-js
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

      // Inject gifuct-js locally (bundled with function)
      console.log('📦 Verifying browser-bundled gifuct-js is available...');
      
      // Verify gifuct-js is available (injected via page.addScriptTag before page.evaluate)
      const gifuct = (window as any).gifuct;
      if (!gifuct) {
        throw new Error('Browser-bundled gifuct-js not available - check IIFE injection');
      }
      
      console.log('✅ Browser-bundled gifuct-js successfully verified:', typeof gifuct);

      const setupTime = Date.now() - setupStart;
      console.log(`⚡ Three.js and gifuct-js loaded in ${setupTime}ms`);

      const THREE = (window as any).THREE;
      if (!THREE) {
        throw new Error('Failed to load Three.js - THREE is undefined');
      }

      console.log('✅ Three.js loaded in headless Chrome:', THREE.REVISION);

      // Create identical scene to client-side
      const scene = new THREE.Scene();
      scene.background = null; // Transparent

      // Create identical camera (FIXED: match client-side position)
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 2.8); // KEEP at 2.8
      camera.lookAt(0, 0, 0);

      // Create identical renderer with optimized resolution
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(200, 200); // Optimized 200px rendering (downscaled to 100px later)
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
      
      // Dynamic shape based on settings (with fallback for backwards compatibility)
      const shapeMap = { thin: 0.01, normal: 0.15, thick: 0.25 }; // Fixed: 0.0 -> 0.01 to prevent geometry issues
      const bulge = settings.coinShape ? shapeMap[settings.coinShape] : 0.15; // Default fallback
      
      const radialSegments = 64; // Reduced from 128 for faster processing
      const capSegments = 16;    // Reduced from 32 for faster processing

      // Materials (identical to CoinEditor.tsx)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xcecece,
        metalness: 0.8, // Metalness 1 is too much
        roughness: 0.5,
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

      // Overlay creation with dynamic material properties (matching CoinEditor.tsx)
      // Metalness mapping: low=0.3, normal=0.6, high=0.8
      const metalnessMap = { low: 0.3, normal: 0.6, high: 0.8 };
      // Roughness mapping: low=0.3, normal=0.5, high=0.7  
      const roughnessMap = { low: 0.3, normal: 0.5, high: 0.7 };
      
      // Apply settings with fallbacks for backwards compatibility
      const overlayMetalness = settings.metallic ? 
        (settings.overlayMetalness ? metalnessMap[settings.overlayMetalness] : 0.6) : 0;
      const overlayRoughness = settings.metallic ? 
        (settings.overlayRoughness ? roughnessMap[settings.overlayRoughness] : 0.3) : 0.5;
      
      const overlayMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        metalness: overlayMetalness,
        roughness: overlayRoughness,
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

      // Add IDENTICAL lighting to CoinEditor.tsx (enhanced setup for visual parity)
      console.log('💡 Setting up enhanced lighting (matching client-side exactly)...');
      
      // Hemisphere + Directional lights (exact match to CoinEditor.tsx)
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.45);
      scene.add(hemiLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(3, 5, 2);
      scene.add(dirLight);
      
      // Add additional lights to compensate for missing environment map (matching client-side)
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight.position.set(-2, -3, -1);
      scene.add(fillLight);
      
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
      rimLight.position.set(-3, 1, 4);
      scene.add(rimLight);
      
      // Add stronger broad ambient light to brighten overall appearance (matching client-side)
      const broadLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(broadLight);
      
      console.log('✅ Enhanced lighting setup complete (client-server parity achieved)');

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
        // Create gradient textures (FIXED: separate rim and face textures like client-side)
        console.log('🌈 Creating separate rim and face gradient textures...');
        
        // Helper function to create gradient texture (matching client-side createGradientTexture)
        const createGradientTexture = (color1: string, color2: string, isRim = false) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          if (isRim) {
            canvas.width = 512;
            canvas.height = 16;
            
            // Left half: color1 -> color2
            const grad1 = ctx.createLinearGradient(0, 0, canvas.width / 2, 0);
            grad1.addColorStop(0, color1);
            grad1.addColorStop(1, color2);
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

            // Right half: color2 -> color1
            const grad2 = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width, 0);
            grad2.addColorStop(0, color2);
            grad2.addColorStop(1, color1);
            ctx.fillStyle = grad2;
            ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
          } else {
            canvas.width = 256;
            canvas.height = 256;
            
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          return texture;
        };
        
        // Create separate textures for rim and faces (matching client-side logic exactly)
        const faceTexture = createGradientTexture(settings.gradientStart || '#00eaff', settings.gradientEnd || '#ee00ff');
        const rimTexture = createGradientTexture(settings.gradientStart || '#00eaff', settings.gradientEnd || '#ee00ff', true);
        
        rimMat.map = rimTexture;
        faceMat.map = faceTexture;
        rimMat.color.set('#ffffff'); // Base white for texture
        faceMat.color.set('#ffffff');
        console.log('✅ Applied separate gradient textures (rim + face):', settings.gradientStart, '->', settings.gradientEnd);
      }

      // Update metallic properties (identical to CoinEditor.tsx)
      rimMat.metalness = settings.metallic ? 0.8 : 0.5;
      rimMat.roughness = settings.metallic ? 0.34 : 0.7;
      faceMat.metalness = settings.metallic ? 0.8 : 0.5;
      faceMat.roughness = settings.metallic ? 0.34 : 0.7;
      console.log('⚡ Applied metallic settings:', settings.metallic);

      // Process overlays directly from settings URLs (FIXED: proper dual overlay logic)
      console.log('🎨 Processing overlay URLs:', {
        overlayUrl: settings.overlayUrl,
        overlayUrl2: settings.overlayUrl2,
        dualOverlay: settings.dualOverlay
      });
      
      // IMPORTANT: Clear overlay materials first to prevent interference
      overlayTop.material.map = null;
      overlayTop.material.opacity = 0;
      overlayTop.material.needsUpdate = true;
      overlayBot.material.map = null;
      overlayBot.material.opacity = 0;
      overlayBot.material.needsUpdate = true;
      
      // Helper function to process GIF with gifuct-js (MUST work - no fallbacks)
      const processGIF = async (url: string) => {
        // CRITICAL: gifuct-js MUST be available - fail if not
        const gifuct = (window as any).gifuct;
        if (!gifuct) {
          throw new Error('❌ gifuct-js not available - GIF processing cannot continue');
        }

        console.log('🎞️ Processing animated GIF with gifuct-js (matching client):', url);
        
        let buffer: ArrayBuffer;
        
        // Check if this is a local file or URL
        if (isLocalFile(url)) {
          console.log('📁 Loading GIF from local file:', url);
          // Load from local filesystem
          const fileBuffer = await fs.promises.readFile(url);
          buffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
        } else {
          console.log('🌐 Fetching GIF from URL:', url);
          // Fetch the GIF and check size FIRST to prevent memory crashes
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch GIF: ${response.status} ${response.statusText}`);
          }
          
          // Check Content-Length header if available
          const contentLength = response.headers.get('Content-Length');
          if (contentLength) {
            const sizeInMB = parseInt(contentLength) / (1024 * 1024);
            console.log(`📏 GIF size from headers: ${sizeInMB.toFixed(2)}MB`);
            
            // CRITICAL: Reject large GIFs to prevent Lambda memory crashes
            if (sizeInMB > 15) { // 15MB limit for safety (Lambda has 1GB total)
              throw new Error(`GIF file is too large, please use a smaller file.`);
              console.log(`❌ GIF too large: ${sizeInMB.toFixed(2)}MB exceeds 15MB limit`);
            }
          }
          
          buffer = await response.arrayBuffer();
        }
        
        const actualSizeInMB = buffer.byteLength / (1024 * 1024);
        console.log(`📏 Actual GIF size: ${actualSizeInMB.toFixed(2)}MB`);
        
        // Double-check actual size after download
        if (actualSizeInMB > 15) {
          throw new Error(`GIF file is too large, please use a smaller file.`);
        }
        
        // Parse GIF using gifuct-js (identical to client-side)
        const gif = gifuct.parseGIF(buffer);
        const frames = gifuct.decompressFrames(gif, true);
        
        console.log('🎯 GIF parsed:', { 
          frameCount: frames.length,
          width: gif.lsd.width,
          height: gif.lsd.height,
          sizeInMB: actualSizeInMB.toFixed(2)
        });
        
        // Additional safety check for frame count and dimensions
        const totalPixels = gif.lsd.width * gif.lsd.height * frames.length;
        const estimatedMemoryMB = (totalPixels * 4) / (1024 * 1024); // 4 bytes per pixel (RGBA)
        
        if (estimatedMemoryMB > 200) { // Prevent excessive memory usage
          throw new Error(`GIF_TOO_COMPLEX: GIF is too complex (${frames.length} frames, ${gif.lsd.width}x${gif.lsd.height}). Estimated memory: ${estimatedMemoryMB.toFixed(1)}MB. Please use a simpler GIF.`);
        }
        
        if (frames.length === 0) {
          throw new Error('No frames found in GIF');
        }
        
        // Create canvas for rendering frames (identical to client-side)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = gif.lsd.width;
        canvas.height = gif.lsd.height;
        
        // Create texture (MATCHING client-side: flipY = true for CanvasTexture)
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true; // FIXED: Match client-side flipY = true for GIF CanvasTextures
        
        // Animation state (identical to client-side)
        let currentFrame = 0;
        let frameCounter = 0;
        
        // Frame-rate-based speed mapping (identical to client-side)
        const getFrameInterval = () => {
          const intervalMap = {
            slow: 4,    // Change frame every 4 renders (15fps effective)
            medium: 2,  // Change frame every 2 renders (30fps effective)  
            fast: 1     // Change frame every render (60fps effective)
          };
          return intervalMap[renderRequest.settings.gifAnimationSpeed];
        };
        
        // Helper to draw frame to canvas (identical to client-side)
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
        
        // Draw initial frame (identical to client-side)
        drawFrame(0);
        
        // Store update function called by main animation loop (identical to client-side)
        texture.userData = {
          update: () => {
            if (frames.length <= 1) return; // Static image
            
            frameCounter++;
            const frameInterval = getFrameInterval();
            
            // Only advance frame when we hit the interval
            if (frameCounter >= frameInterval) {
              // Advance to next frame
              currentFrame = (currentFrame + 1) % frames.length;
              
              // Draw new frame
              drawFrame(currentFrame);
              
              // Mark texture as needing update
              texture.needsUpdate = true;
              
              // Reset counter
              frameCounter = 0;
            }
          }
        };
        
        console.log('✅ Animated GIF texture created with gifuct-js (matching client)');
        return { texture, isAnimated: true, frames: frames.length };
      };

      // Helper function to load images from URLs or local files
      const loadImageTexture = async (pathOrUrl: string): Promise<THREE.Texture> => {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        
        if (isLocalFile(pathOrUrl)) {
          console.log('📁 Loading static image from local file:', pathOrUrl);
          // Convert local file to data URL
          const dataUrl = await createDataUrlFromFile(pathOrUrl);
          img.src = dataUrl;
        } else {
          console.log('🌐 Loading static image from URL:', pathOrUrl);
          img.src = pathOrUrl;
        }
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (error) => {
            console.error('❌ Failed to load image:', pathOrUrl, error);
            reject(new Error(`Failed to load image: ${pathOrUrl}`));
          };
        });
        
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        texture.flipY = true; // FIXED: Match client-side flipY = false for static images
        return texture;
      };

      // Apply front overlay (FIXED: use overlayUrl directly)
      if (settings.overlayUrl) {
        console.log('� Applying front overlay');
        
        let overlayTexture: THREE.Texture | null = null;
        
        if (settings.overlayUrl.toLowerCase().includes('.gif')) {
          // Process GIF with gifuct-js (identical to client-side)
          const gifResult = await processGIF(settings.overlayUrl);
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            console.log('✅ Animated GIF overlay applied with gifuct-js');
          }
        } else {
          // Process static image (URLs or local files)
          overlayTexture = await loadImageTexture(settings.overlayUrl);
        }
        
        if (overlayTexture) {
          // Ensure correct flipY setting based on texture type (matching client-side)
          if (overlayTexture instanceof THREE.CanvasTexture) {
            overlayTexture.flipY = true; // FIXED: CanvasTexture should use flipY = true
          } else {
            overlayTexture.flipY = true; // FIXED: Regular Texture should use flipY = false
          }
          
          if (settings.dualOverlay) {
            // DUAL MODE: Apply first overlay ONLY to top face
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
            console.log('✅ Front overlay applied to TOP face only (dual mode)');
          } else {
            // Apply to both faces in single mode - top face gets original
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
            
            // Bottom face gets horizontally flipped version (matching client-side fix)
            let bottomTexture;
            if (overlayTexture instanceof THREE.CanvasTexture) {
              // For animated GIFs, share the same canvas but create new texture with flip
              bottomTexture = new THREE.CanvasTexture(overlayTexture.image);
              bottomTexture.colorSpace = THREE.SRGBColorSpace;
              bottomTexture.flipY = true; // FIXED: Match client-side flipY = true for CanvasTextures
              bottomTexture.wrapS = THREE.RepeatWrapping;
              bottomTexture.repeat.x = -1; // Horizontal flip to fix mirroring
              bottomTexture.needsUpdate = true;
              // CRITICAL: Share the EXACT SAME userData object for synchronized animation (matching client-side)
              bottomTexture.userData = overlayTexture.userData;
            } else {
              // For static images, clone and flip (FIXED: match client-side flipY = true)
              bottomTexture = overlayTexture.clone();
              bottomTexture.flipY = true; // FIXED: Match client-side flipY = true for static images on bottom face
              bottomTexture.wrapS = THREE.RepeatWrapping;
              bottomTexture.repeat.x = -1; // Horizontal flip to fix mirroring
              bottomTexture.needsUpdate = true;
            }
            
            overlayBot.material.map = bottomTexture;
            overlayBot.material.opacity = 1;
            overlayBot.material.needsUpdate = true;
            console.log('✅ Front overlay applied to BOTH faces (single mode)');
          }
        }
      }

      // Apply back overlay (from overlayUrl2) in dual overlay mode
      if (settings.dualOverlay && settings.overlayUrl2) {
        console.log('🎨 Applying back overlay from URL2:', settings.overlayUrl2);
        
        let overlayTexture: THREE.Texture | null = null;
        
        if (settings.overlayUrl2.toLowerCase().includes('.gif')) {
          // Process GIF with gifuct-js (identical to client-side)
          const gifResult = await processGIF(settings.overlayUrl2);
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            console.log('✅ Animated GIF overlay applied with gifuct-js');
          }
        } else {
          // Process static image (URLs or local files)
          overlayTexture = await loadImageTexture(settings.overlayUrl2);
        }
        
        if (overlayTexture) {
          // Ensure correct flipY setting based on texture type (matching client-side)
          if (overlayTexture instanceof THREE.CanvasTexture) {
            overlayTexture.flipY = true; // FIXED: CanvasTexture should use flipY = true
          } else {
            overlayTexture.flipY = false; // FIXED: Regular Texture should use flipY = false
          }
          
          // DUAL MODE: Apply second overlay to bottom face (matching client-side logic exactly)
          // Client-side only applies horizontal flip for VideoTextures, not CanvasTextures
          overlayBot.material.map = overlayTexture;
          console.log('✅ Back overlay applied to BOTTOM face without flip (dual mode - matches client-side)');
          
          overlayBot.material.opacity = 1;
          overlayBot.material.needsUpdate = true;
        }
      }

      // Apply body texture if provided (new feature - matching client-side)
      if (settings.bodyTextureUrl) {
        console.log('🎨 Applying body texture:', settings.bodyTextureUrl);
        
        try {
          let bodyTexture: THREE.Texture | null = null;
          
          if (settings.bodyTextureUrl.toLowerCase().includes('.gif')) {
            // Process GIF body texture
            const gifResult = await processGIF(settings.bodyTextureUrl);
            if (gifResult && gifResult.texture) {
              bodyTexture = gifResult.texture;
              console.log('✅ Animated GIF body texture applied');
            }
          } else {
            // Process static body texture (URLs or local files)
            bodyTexture = await loadImageTexture(settings.bodyTextureUrl);
            console.log('✅ Static body texture applied');
          }
          
          if (bodyTexture) {
            // Apply texture to both rim and face materials (overriding previous colors/gradients)
            rimMat.map = bodyTexture.clone();
            faceMat.map = bodyTexture.clone();
            rimMat.color.set('#ffffff'); // Base white for texture
            faceMat.color.set('#ffffff');
            rimMat.needsUpdate = true;
            faceMat.needsUpdate = true;
            console.log('✅ Body texture applied to rim and face materials');
          }
        } catch (error) {
          console.error('❌ Failed to load body texture:', error);
          // Continue without body texture
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

        // Update animated GIF textures (identical to client-side animation loop)
        if (overlayTop.material && overlayTop.material.map && overlayTop.material.map.userData?.update) {
          overlayTop.material.map.userData.update();
        }
        if (overlayBot.material && overlayBot.material.map && overlayBot.material.map.userData?.update) {
          overlayBot.material.map.userData.update();
        }
        
        // Update animated body texture (if any)
        if (rimMat.map && rimMat.map.userData?.update) {
          rimMat.map.userData.update();
        }
        if (faceMat.map && faceMat.map.userData?.update && faceMat.map !== rimMat.map) {
          faceMat.map.userData.update();
        }

        // Render frame
        renderer.render(scene, camera);

        // Capture as WebP blob (IDENTICAL to exporter.ts)
        const frameBlob = await new Promise<Blob>((resolve) => {
          const canvas = renderer.domElement;
          
          // Capture at 200px first (matching server-side renderer size)
          canvas.toBlob((blob) => {
            if (!blob) {
              // PNG fallback for compatibility
              canvas.toBlob((pngBlob) => {
                resolve(pngBlob || new Blob());
              }, 'image/png');
              return;
            }
            resolve(blob);
          }, 'image/webp', 0.99);
        });
        
        // Downscale from 200px to 100px using canvas (same as before)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        
        // Load the WebP blob into an image
        const frameUrl = URL.createObjectURL(frameBlob);
        const img = new Image();
        img.src = frameUrl;
        
        await new Promise(resolve => {
          img.onload = () => {
            tempCtx.drawImage(img, 0, 0, 100, 100);
            URL.revokeObjectURL(frameUrl); // Clean up
            resolve(undefined);
          };
        });
        
        // Convert downscaled canvas to WebP blob (IDENTICAL to exporter.ts)
        const downscaledBlob = await new Promise<Blob>((resolve) => {
          tempCanvas.toBlob((blob) => {
            if (!blob) {
              tempCanvas.toBlob((pngBlob) => {
                resolve(pngBlob || new Blob());
              }, 'image/png');
              return;
            }
            resolve(blob);
          }, 'image/webp', 0.99);
        });
        
        // Convert blob to base64 for return (temporary until we can return blobs directly)
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.readAsDataURL(downscaledBlob);
        });
        
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
