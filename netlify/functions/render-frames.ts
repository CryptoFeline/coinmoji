import { Handler } from '@netlify/functions';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to parse multipart form data (same as upload-temp-file)
interface ParsedFile {
  filename: string;
  mimetype: string;
  data: Buffer;
}

function parseMultipartData(body: string, boundary: string): { fields: Record<string, string>, files: ParsedFile[] } {
  const parts = body.split(`--${boundary}`);
  const fields: Record<string, string> = {};
  const files: ParsedFile[] = [];

  for (const part of parts) {
    if (!part.trim() || part === '--') continue;

    const [headerSection, ...bodyParts] = part.split('\r\n\r\n');
    if (!headerSection || bodyParts.length === 0) continue;

    const headers = headerSection.split('\r\n').reduce((acc, line) => {
      const [key, value] = line.split(': ');
      if (key && value) acc[key.toLowerCase()] = value;
      return acc;
    }, {} as Record<string, string>);

    const contentDisposition = headers['content-disposition'];
    if (!contentDisposition) continue;

    const nameMatch = contentDisposition.match(/name="([^"]+)"/);
    if (!nameMatch) continue;

    const fieldName = nameMatch[1];
    const bodyContent = bodyParts.join('\r\n\r\n').replace(/\r\n--$/, '');

    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    if (filenameMatch) {
      // This is a file
      const filename = filenameMatch[1];
      const mimetype = headers['content-type'] || 'application/octet-stream';
      const data = Buffer.from(bodyContent, 'binary');
      files.push({ filename, mimetype, data });
    } else {
      // This is a regular field
      fields[fieldName] = bodyContent;
    }
  }

  return { fields, files };
}

interface RenderFramesRequest {
  settings: {
    // Coin Shape & Structure
    coinShape: 'thin' | 'normal' | 'thick';
    
    // Body Material Settings
    fillMode: 'solid' | 'gradient' | 'texture';
    bodyColor: string;
    gradientStart: string;
    gradientEnd: string;
    bodyMetallic: boolean;          // NEW: Separate from overlay metallic
    bodyMetalness: 'low' | 'normal' | 'high';  // NEW: Body metallic intensity
    bodyRoughness: 'low' | 'normal' | 'high';  // NEW: Body roughness control
    bodyGlow: boolean;              // NEW: Enable glow effect for body
    
    // Body Texture Settings
    bodyTextureUrl: string;
    bodyTextureMode: 'url' | 'upload';
    bodyTextureTempId?: string;
    bodyTextureFileIndex?: number; // Index of file in multipart data
    bodyTextureMapping: 'planar' | 'cylindrical' | 'spherical';  // NEW: Texture mapping options
    bodyTextureRotation: number;    // NEW: 0-360 degrees
    bodyTextureScale: number;       // NEW: 0.1-5.0 scale multiplier
    bodyTextureOffsetX: number;     // NEW: -1 to 1 offset
    bodyTextureOffsetY: number;     // NEW: -1 to 1 offset
    bodyGifSpeed: 'slow' | 'normal' | 'fast';  // NEW: GIF animation speed for body
    
  // Face Overlay Settings
  overlayUrl?: string;
  overlayMode?: 'url' | 'upload';
  overlayTempId?: string;
  overlayFileIndex?: number;
  overlayMetallic: boolean;       // NEW: Separate toggle for overlays
  overlayMetalness: 'low' | 'normal' | 'high';
  overlayRoughness: 'low' | 'normal' | 'high';
  overlayGlow: boolean;           // NEW: Enable glow effect for overlays
  overlayGifSpeed: 'slow' | 'normal' | 'fast';  // RENAMED: from gifAnimationSpeed
  overlayRotation: number;        // NEW: 0-360 degrees overlay rotation
  overlayScale: number;           // NEW: 0.1-5.0 overlay scale multiplier
  overlayOffsetX: number;         // NEW: -1 to 1 overlay offset X
  overlayOffsetY: number;         // NEW: -1 to 1 overlay offset Y    // Dual Overlay Settings
    dualOverlay?: boolean;
    overlayUrl2?: string;
    overlayMode2?: 'url' | 'upload';
    overlayTempId2?: string;
    overlayFileIndex2?: number;
    
    // Animation Settings (NEW SYSTEM)
    animationDirection: 'right' | 'left' | 'up' | 'down';  // NEW: Replace rotationSpeed
    animationPreset: 'smooth' | 'fast-slow' | 'bounce';  // NEW: Replace easing with presets
    animationDuration: number;      // NEW: Duration in seconds (default: 3)
    
    // Lighting Settings
    lightColor: string;
    lightStrength: 'low' | 'medium' | 'high';
    lightMode: 'studioLight' | 'naturalLight'; // NEW: Light position presets
    
    // DEPRECATED: Kept for backward compatibility
    metallic?: boolean;             // Will map to bodyMetallic
    rotationSpeed?: 'slow' | 'medium' | 'fast';  // Will map to animationDirection
    gifAnimationSpeed?: 'slow' | 'medium' | 'fast';  // Will map to overlayGifSpeed
  };
  exportSettings: {
    fps: number;
    duration: number;
    frames: number;
    qualityMode: 'high' | 'balanced' | 'compact';
  };
}

export const handler: Handler = async (event) => {
  // CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-InitData',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  console.log('🎬 Server-side Three.js frame rendering started');

  // 🔧 CRITICAL: Add early validation to catch large payload issues
  const payloadSize = event.body ? event.body.length : 0;
  console.log(`📦 Request payload size: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);
  
  if (payloadSize > 5 * 1024 * 1024) { // 5MB limit
    console.error('❌ Payload too large:', payloadSize, 'bytes');
    return {
      statusCode: 413,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: `Request too large: ${(payloadSize / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB`,
        details: 'Reduce file sizes or use external hosting for large assets'
      }),
    };
  }

  let browser;
  try {
    console.log('🔍 Parsing request data...');
    let request: RenderFramesRequest;
    let uploadedFiles: ParsedFile[] = [];
    
    // 🚀 NEW: Detect content type and parse accordingly
    const contentType = event.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      console.log('📡 Processing multipart form data (binary streaming)...');
      console.log('🔍 Request debug info:', {
        contentType,
        isBase64Encoded: event.isBase64Encoded,
        bodyLength: event.body?.length || 0,
        hasBody: !!event.body
      });
      
      // Extract boundary from content type
      const boundaryMatch = contentType.match(/boundary=(.+)/);
      if (!boundaryMatch) {
        throw new Error('Invalid multipart data: no boundary found');
      }
      
      const boundary = boundaryMatch[1];
      
      // Handle binary data properly - Netlify might base64-encode the body
      let bodyData = event.body || '';
      if (event.isBase64Encoded) {
        console.log('📦 Decoding base64-encoded binary body...');
        bodyData = Buffer.from(bodyData, 'base64').toString('binary');
      }
      
      const { fields, files } = parseMultipartData(bodyData, boundary);
      
      uploadedFiles = files;
      console.log(`📎 Parsed ${files.length} uploaded files:`, files.map(f => ({ name: f.filename, type: f.mimetype, size: `${(f.data.length/1024).toFixed(1)}KB` })));
      
      // Parse JSON fields
      try {
        const settings = JSON.parse(fields.settings || '{}');
        const exportSettings = JSON.parse(fields.exportSettings || '{}');
        request = { settings, exportSettings };
        console.log('✅ Multipart data parsed successfully');
      } catch (parseError) {
        throw new Error(`Invalid JSON in multipart fields: ${parseError}`);
      }
    } else {
      console.log('📡 Processing JSON data (URL-based assets)...');
      
      // Original JSON parsing
      try {
        request = JSON.parse(event.body || '{}');
        console.log('✅ JSON parsed successfully');
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown JSON error'}`,
            details: 'Request body must be valid JSON'
          }),
        };
      }
    }
    
    // CRITICAL: Cap FPS to 20 to prevent Chrome timeouts in serverless environment
    // High FPS (30+) causes 90+ frame processing which exceeds 30s Lambda timeout
    const maxSafeFPS = 20;
    if (request.exportSettings.fps > maxSafeFPS) {
      console.log(`⚠️ Capping FPS from ${request.exportSettings.fps} to ${maxSafeFPS} for serverless stability`);
      request.exportSettings.fps = maxSafeFPS;
    }
    
    // FIXED: Always use exactly 3 seconds for Telegram emoji standard
    request.exportSettings.duration = 3;
    request.exportSettings.frames = Math.round(maxSafeFPS * 3); // Always 60 frames at 20 FPS
    
    console.log('📋 Render request (after FPS cap):', {
      settings: request.settings,
      exportSettings: request.exportSettings
    });

    // All uploaded files are now sent as either data URLs (JSON) or binary files (multipart)
    const processedSettings = { ...request.settings };
    
    // 🚀 NEW: Convert uploaded binary files to data URLs for processing
    if (uploadedFiles.length > 0) {
      console.log('🔄 Converting uploaded binary files to data URLs...');
      
      // Handle body texture file
      if (typeof processedSettings.bodyTextureFileIndex === 'number') {
        const file = uploadedFiles[processedSettings.bodyTextureFileIndex];
        if (file) {
          const base64Data = file.data.toString('base64');
          // CRITICAL: Override body texture URL to ensure data URL is used
          processedSettings.bodyTextureUrl = `data:${file.mimetype};base64,${base64Data}`;
          // Clear temp ID that can't be accessed server-side
          delete processedSettings.bodyTextureTempId;
          console.log(`✅ Body texture: ${file.filename} (${file.mimetype}) → data URL (size: ${(base64Data.length / 1024).toFixed(1)}KB)`);
        }
      }
      
      // Handle overlay file
      if (typeof processedSettings.overlayFileIndex === 'number') {
        const file = uploadedFiles[processedSettings.overlayFileIndex];
        if (file) {
          const base64Data = file.data.toString('base64');
          // CRITICAL: Override overlay URL to ensure data URL is used
          processedSettings.overlayUrl = `data:${file.mimetype};base64,${base64Data}`;
          // Clear temp ID that can't be accessed server-side
          delete processedSettings.overlayTempId;
          console.log(`✅ Overlay: ${file.filename} (${file.mimetype}) → data URL (size: ${(base64Data.length / 1024).toFixed(1)}KB)`);
        }
      }
      
      // Handle overlay2 file
      if (typeof processedSettings.overlayFileIndex2 === 'number') {
        const file = uploadedFiles[processedSettings.overlayFileIndex2];
        if (file) {
          const base64Data = file.data.toString('base64');
          // CRITICAL: Override overlay2 URL to ensure data URL is used
          processedSettings.overlayUrl2 = `data:${file.mimetype};base64,${base64Data}`;
          // Clear temp ID that can't be accessed server-side
          delete processedSettings.overlayTempId2;
          console.log(`✅ Overlay2: ${file.filename} (${file.mimetype}) → data URL (size: ${(base64Data.length / 1024).toFixed(1)}KB)`);
        }
      }
    }

    console.log('🚀 Launching Chrome via @sparticuz/chromium...');
    console.log('🔍 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      AWS_LAMBDA_JS_RUNTIME: process.env.AWS_LAMBDA_JS_RUNTIME,
      chromeExecutable: 'from @sparticuz/chromium'
    });

    // Debug: Log final processed settings to ensure data URLs are being used
    console.log('🔧 Final processed settings preview:', {
      bodyTextureUrl: processedSettings.bodyTextureUrl ? 
        (processedSettings.bodyTextureUrl.startsWith('data:') ? 
          `data URL (${Math.round(processedSettings.bodyTextureUrl.length/1024)}KB)` : 
          processedSettings.bodyTextureUrl) : 'none',
      overlayUrl: processedSettings.overlayUrl || 'none',
      overlayUrl2: processedSettings.overlayUrl2 || 'none'
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
    let framesBase64: string[];
    try {
      console.log('🎬 Starting browser page evaluation...');
      framesBase64 = await page.evaluate(async (renderRequest) => {
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
      
      // FIXED: Add tone mapping to reduce harsh highlights and improve color balance
      renderer.toneMapping = THREE.LinearToneMapping;
      renderer.toneMappingExposure = 0.8; // Slightly reduce exposure to avoid washed-out appearance
      
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
      
      const radialSegments = 128; // FIXED: Match client-side geometry for smooth highlights
      const capSegments = 32;    // FIXED: Match client-side geometry for smooth highlights

      // Materials (identical to CoinEditor.tsx)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xcecece,
        metalness: 0.8, // Metalness 1 is too much
        roughness: 0.34, // FIXED: Match client-side default roughness for smooth highlights
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

      // CRITICAL FIX: Apply planar UV mapping to main faces when requested
      if (settings.bodyTextureMapping === 'planar') {
        console.log('🎯 Applying planar UV mapping to main coin faces');
        planarMapUVs(topFace.geometry);
        planarMapUVs(bottomFace.geometry);
      } else {
        console.log(`🔄 Using ${settings.bodyTextureMapping || 'default'} UV mapping for main coin faces`);
      }

      // Overlay creation with dynamic material properties (matching CoinEditor.tsx)
      // Metalness mapping: low=0.3, normal=0.6, high=0.8
      const metalnessMap = { low: 0.3, normal: 0.6, high: 0.8 };
      // Roughness mapping: low=0.3, normal=0.5, high=0.7  
      const roughnessMap = { low: 0.3, normal: 0.5, high: 0.7 };
      
      // Apply overlay metallic settings using new system  
      const overlayMetalness = settings.overlayMetallic ? 
        (settings.overlayMetalness ? metalnessMap[settings.overlayMetalness] : 0.6) : 0;
      const overlayRoughness = settings.overlayMetallic ? 
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
      
      // Add glow meshes - mirror client-side implementation
      console.log('✨ Adding glow meshes with server-side shader implementation...');
      
      // Define GlowMapMaterial in plain JS (matching GlowMapMaterial.ts)
      const GlowMapMaterial = class extends THREE.ShaderMaterial {
        constructor(params) {
          const p = params || {};
          super({
            uniforms: {
              glowColor: { value: new THREE.Color(p.color || 0xffffff) },
              map:       { value: p.map || null },
              useMap:    { value: !!p.map },
              intensity: { value: p.intensity !== undefined ? p.intensity : 1.0 },
              threshold: { value: p.threshold !== undefined ? p.threshold : 0.70 },
              sharpness: { value: p.sharpness !== undefined ? p.sharpness : 0.5 },
            },
            transparent: true,
            depthTest: true,        // Enable depth test to prevent z-fighting
            depthWrite: false,      // Don't write to depth buffer to allow proper layering
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,   // Render backfaces to create proper outward glow
            alphaTest: 0.01,        // Discard nearly transparent pixels
            vertexShader: [
              'varying vec3 vWorldPos;',
              'varying vec3 vWorldNormal;',
              'varying vec2 vUv;',
              'void main() {',
              '  vUv = uv;',
              '  vec4 wp = modelMatrix * vec4(position, 1.0);',
              '  vWorldPos = wp.xyz;',
              '  vWorldNormal = normalize(mat3(modelMatrix) * normal);',
              '  gl_Position = projectionMatrix * viewMatrix * wp;',
              '}'
            ].join('\\n'),
            fragmentShader: [
              'uniform vec3  glowColor;',
              'uniform sampler2D map;',
              'uniform bool  useMap;',
              'uniform float intensity;',
              'uniform float threshold;',
              'uniform float sharpness;',
              'varying vec3 vWorldPos;',
              'varying vec3 vWorldNormal;',
              'varying vec2 vUv;',
              'void main() {',
              '  vec3 base = useMap ? texture2D(map, vUv).rgb : glowColor;',
              '  float luma = dot(base, vec3(0.2126, 0.7152, 0.0722));',
              '  float gate = smoothstep(threshold, 1.0, luma);',
              '  vec3 V = normalize(cameraPosition - vWorldPos);',
              '  vec3 N = normalize(vWorldNormal);',
              '  float fresnel = 1.0 - abs(dot(N, V));',
              '  float rim = pow(fresnel, 0.5 + sharpness * 2.0);',
              '  float glowStrength = rim * gate * intensity;',
              '  float alpha = smoothstep(0.0, 1.0, glowStrength);',
              '  gl_FragColor = vec4(base * (1.0 + alpha), alpha * 0.8);',
              '  #include <tonemapping_fragment>',
              '  #include <colorspace_fragment>',
              '}'
            ].join('\\n')
          });
        }
        
        updateGlowSource(map, color) {
          this.uniforms.map.value = map;
          this.uniforms.useMap.value = !!map;
          this.uniforms.glowColor.value.copy(color);
          this.needsUpdate = true;
        }
      };

      // Create body glow meshes
      const cylinderGlow = new THREE.Mesh(
        cylinderGeometry,
        new GlowMapMaterial({
          map: rimMat.map ?? null,
          color: rimMat.color,
          threshold: 0.60,
          intensity: 1.5,                     // Increased intensity
          sharpness: 0.8,                     // Increased sharpness
        })
      );
      cylinderGlow.scale.setScalar(1.05);     // More visible scaling
      cylinderGlow.visible = !!settings.bodyGlow;
      cylinderGlow.renderOrder = 1;    // Render after main geometry

      const topGlow = new THREE.Mesh(
        topFace.geometry.clone(),
        new GlowMapMaterial({
          map: faceMat.map ?? null,
          color: faceMat.color,
          threshold: 0.60,
          intensity: 1.5,
          sharpness: 0.8,
        })
      );
      topGlow.scale.setScalar(1.05);
      topGlow.visible = !!settings.bodyGlow;
      topGlow.renderOrder = 1;

      const bottomGlow = new THREE.Mesh(
        bottomFace.geometry.clone(),
        new GlowMapMaterial({
          map: faceMat.map ?? null,
          color: faceMat.color,
          threshold: 0.60,
          intensity: 1.5,
          sharpness: 0.8,
        })
      );
      bottomGlow.scale.setScalar(1.05);
      bottomGlow.visible = !!settings.bodyGlow;
      bottomGlow.renderOrder = 1;

      // Create overlay glow meshes
      const overlayTopGlow = new THREE.Mesh(
        overlayTop.geometry,
        new GlowMapMaterial({ threshold: 0.70, intensity: 2.0, sharpness: 1.0 })
      );
      overlayTopGlow.scale.setScalar(1.03);   // Smaller scale for overlays
      overlayTopGlow.visible = !!settings.overlayGlow;
      overlayTopGlow.renderOrder = 2;    // Render after body glow

      const overlayBotGlow = new THREE.Mesh(
        overlayBot.geometry,
        new GlowMapMaterial({ threshold: 0.70, intensity: 2.0, sharpness: 1.0 })
      );
      overlayBotGlow.scale.setScalar(1.03);
      overlayBotGlow.visible = !!settings.overlayGlow;
      overlayBotGlow.renderOrder = 2;

      // Add glow meshes to coin group
      coinGroup.add(cylinderGlow, topGlow, bottomGlow, overlayTopGlow, overlayBotGlow);
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
      
      // 🎯 FIXED: Match client-side lighting EXACTLY for consistent color/brightness
      // Main directional light - increased from 0.5 to 0.8 to match client-side
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      scene.add(dirLight);
      
      // Add additional lights to compensate for missing environment map (matching client-side)
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6); // FIXED: Reduced from 0.8 to temper highlights
      scene.add(fillLight);
      
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
      scene.add(rimLight);
      
      // Apply light positioning based on lightMode setting
      const applyLightMode = (mode: 'studioLight' | 'naturalLight') => {
        if (mode === 'studioLight') {
          // Studio setup: Multiple controlled directional lights with defined shadows
          dirLight.position.set(3, 5, 2);        // Main key light (top-right)
          fillLight.position.set(-2, -3, -1);    // Fill light (bottom-left) 
          rimLight.position.set(-3, 1, 4);       // Rim light (back-left)
        } else if (mode === 'naturalLight') {
          // Natural setup: Softer, more ambient positioning
          dirLight.position.set(2, 4, 3);        // Softer main light
          fillLight.position.set(-1, -2, -2);    // Gentler fill
          rimLight.position.set(-2, 2, 3);       // Subtle rim light
        }
      };

      // Apply initial light mode from settings
      applyLightMode(settings.lightMode);
      
      // 🎯 FIXED: Reduced ambient light from 0.9 to 0.7 to avoid washed-out appearance
      const broadLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(broadLight);
      
      console.log('✅ Enhanced lighting setup complete (client-server parity achieved)');

      // Apply user lighting settings (EXACT match to CoinEditor.tsx)
      console.log('💡 Applying user lighting settings...');
      
      // Light strength mapping (identical to CoinEditor.tsx)
      const lightStrengthMap = {
        low: { hemi: 0.3, dir: 0.6 },
        medium: { hemi: 0.8, dir: 1.3 },
        strong: { hemi: 1.2, dir: 3.0 }
      };
      
      // CRITICAL FIX: Add robust fallback for invalid light strength values
      const validLightStrength = (settings.lightStrength && 
                                 typeof settings.lightStrength === 'string' &&
                                 lightStrengthMap[settings.lightStrength]) 
                                ? settings.lightStrength 
                                : 'medium';
      const strength = lightStrengthMap[validLightStrength] || lightStrengthMap.medium;
      
      // Additional safety check to ensure strength object exists and has required properties
      if (!strength || typeof strength.hemi !== 'number' || typeof strength.dir !== 'number') {
        console.warn('⚠️ Invalid strength object, using medium fallback:', strength);
        const fallbackStrength = lightStrengthMap.medium;
        hemiLight.intensity = fallbackStrength.hemi;
        dirLight.intensity = fallbackStrength.dir;
      } else {
        hemiLight.intensity = strength.hemi;
        dirLight.intensity = strength.dir;
      }
      
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
        
        // Update body glow materials for solid colors
        cylinderGlow.material.updateGlowSource(null, rimMat.color);
        topGlow.material.updateGlowSource(null, faceMat.color);
        bottomGlow.material.updateGlowSource(null, faceMat.color);
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
        
        // Update body glow materials for gradients
        cylinderGlow.material.updateGlowSource(rimTexture, new THREE.Color('#ffffff'));
        topGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
        bottomGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
      }

      // Update body metallic properties using new system (matching CoinEditor.tsx)
      const bodyMetalnessMap = { low: 0.3, normal: 0.6, high: 0.8 };
      const bodyRoughnessMap = { low: 0.3, normal: 0.5, high: 0.7 };
      
      const bodyMetalness = settings.bodyMetallic ? bodyMetalnessMap[settings.bodyMetalness || 'normal'] : 0;
      const bodyRoughness = settings.bodyMetallic ? bodyRoughnessMap[settings.bodyRoughness || 'normal'] : 0.8;
      
      rimMat.metalness = bodyMetalness;
      rimMat.roughness = bodyRoughness;
      faceMat.metalness = bodyMetalness;
      faceMat.roughness = bodyRoughness;
      console.log('⚡ Applied body metallic settings:', { 
        bodyMetallic: settings.bodyMetallic, 
        bodyMetalness: settings.bodyMetalness || 'normal',
        bodyRoughness: settings.bodyRoughness || 'normal',
        effectiveMetalness: bodyMetalness,
        effectiveRoughness: bodyRoughness
      });

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
      
      // Clear overlay glow materials
      overlayTopGlow.material.updateGlowSource(null, new THREE.Color(0xffffff));
      overlayBotGlow.material.updateGlowSource(null, new THREE.Color(0xffffff));
      overlayTopGlow.visible = false;
      overlayBotGlow.visible = false;
      
      // Helper function to process GIF with gifuct-js (MUST work - no fallbacks)
      const processGIF = async (url: string, gifSpeed: 'slow' | 'normal' | 'fast' = 'normal') => {
        // CRITICAL: gifuct-js MUST be available - fail if not
        const gifuct = (window as any).gifuct;
        if (!gifuct) {
          throw new Error('❌ gifuct-js not available - GIF processing cannot continue');
        }

        console.log('🎞️ Processing animated GIF with gifuct-js (matching client):', url);
        
        let buffer: ArrayBuffer;
        
        console.log('🌐 Fetching GIF:', url.startsWith('data:') ? 'data URL' : 'external URL');
        
        // All files are now URLs or data URLs (local files pre-converted)
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch GIF: ${response.status} ${response.statusText}`);
        }
        
        // Check Content-Length header if available (for external URLs)
        if (!url.startsWith('data:')) {
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
        }
        
        buffer = await response.arrayBuffer();
        
        const actualSizeInMB = buffer.byteLength / (1024 * 1024);
        console.log(`📏 Actual GIF size: ${actualSizeInMB.toFixed(2)}MB`);
        
        // 🔧 RELAXED: More permissive limits for uploaded files (base64 data URLs are more reliable)
        const isUploadedFile = url.startsWith('data:');
        const maxSizeMB = isUploadedFile ? 25 : 15; // Higher limit for uploaded files
        
        if (actualSizeInMB > maxSizeMB) {
          throw new Error(`GIF file is too large (${actualSizeInMB.toFixed(1)}MB > ${maxSizeMB}MB), please use a smaller file.`);
        }
        
        // Parse GIF using gifuct-js (identical to client-side)
        const gif = gifuct.parseGIF(buffer);
        const frames = gifuct.decompressFrames(gif, true);
        
        console.log('🎯 GIF parsed:', { 
          frameCount: frames.length,
          width: gif.lsd.width,
          height: gif.lsd.height,
          sizeInMB: actualSizeInMB.toFixed(2),
          isUploadedFile
        });
        
        // 🔧 RELAXED: Higher memory limits for uploaded files
        const totalPixels = gif.lsd.width * gif.lsd.height * frames.length;
        const estimatedMemoryMB = (totalPixels * 4) / (1024 * 1024); // 4 bytes per pixel (RGBA)
        const maxMemoryMB = isUploadedFile ? 400 : 200; // Higher memory limit for uploaded files
        
        if (estimatedMemoryMB > maxMemoryMB) {
          throw new Error(`GIF_TOO_COMPLEX: GIF is too complex (${frames.length} frames, ${gif.lsd.width}x${gif.lsd.height}). Estimated memory: ${estimatedMemoryMB.toFixed(1)}MB > ${maxMemoryMB}MB. Please use a simpler GIF.`);
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
        
        // Frame-rate-based speed mapping (adjusted for export FPS)
        const getFrameInterval = (speed: 'slow' | 'normal' | 'fast' = 'normal') => {
          // Base intervals for 60fps (client-side)
          const baseIntervals = {
            slow: 4,    // 15fps effective at 60fps
            normal: 2,  // 30fps effective at 60fps (added normal)
            medium: 2,  // 30fps effective at 60fps (legacy support)
            fast: 1     // 60fps effective at 60fps
          };
          
          // Scale interval based on export FPS vs 60fps
          const baseInterval = baseIntervals[speed];
          const fpsRatio = 60 / renderRequest.exportSettings.fps;
          const scaledInterval = Math.max(1, Math.round(baseInterval / fpsRatio));
          
          console.log(`🎞️ GIF animation: ${speed} speed, base interval: ${baseInterval}, export fps: ${renderRequest.exportSettings.fps}, scaled interval: ${scaledInterval}`);
          
          return scaledInterval;
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
            const frameInterval = getFrameInterval(gifSpeed);
            
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

      // Helper function to process WebM videos server-side (matching client implementation)
      const processWebM = async (url: string): Promise<{ texture: THREE.Texture, isAnimated: boolean }> => {
        console.log('🎥 Processing WebM video for server-side rendering:', url);
        
        try {
          // For server-side rendering, we'll treat WebM as a static image fallback
          // Since we can't play video in headless Chrome during frame capture,
          // we'll use the first frame or a static representation
          console.log('⚠️ WebM detected - using static fallback for server-side rendering');
          
          // Try to load as static image first (some WebM might have poster frames)
          try {
            const texture = await loadImageTexture(url);
            texture.flipY = false; // Match client-side for static images
            console.log('✅ WebM loaded as static image');
            return { texture, isAnimated: false };
          } catch (staticError) {
            console.warn('WebM static fallback failed, creating placeholder:', staticError);
            
            // Create a placeholder texture for WebM that can't be loaded statically
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = 256;
            canvas.height = 256;
            
            // Create a gradient placeholder
            const gradient = ctx.createLinearGradient(0, 0, 256, 256);
            gradient.addColorStop(0, '#4F46E5');
            gradient.addColorStop(1, '#7C3AED');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);
            
            // Add WebM indicator text
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('WebM', 128, 120);
            ctx.fillText('Video', 128, 150);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = true; // CanvasTexture uses flipY = true
            texture.needsUpdate = true;
            
            console.log('✅ WebM placeholder texture created');
            return { texture, isAnimated: false };
          }
        } catch (error) {
          console.error('❌ WebM processing failed:', error);
          throw new Error(`Failed to process WebM: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };

      // Helper to detect if URL is a GIF or WebM (supports both URLs and data URIs)
      const isGifUrl = (url: string): boolean => {
        return /\.gif$/i.test(url) || 
               /data:image\/gif/i.test(url) ||
               url.includes('gif');
      };

      const isWebMUrl = (url: string): boolean => {
        return /\.webm$/i.test(url) || 
               /data:video\/webm/i.test(url) ||
               url.includes('webm');
      };

      // Enhanced texture type detection that also considers MIME types
      const detectTextureType = (url: string): 'gif' | 'webm' | 'static' => {
        if (isGifUrl(url)) return 'gif';
        if (isWebMUrl(url)) return 'webm';
        return 'static';
      };

      // Helper function to apply texture transformations (rotation, scale, offset)
      const applyTextureTransformations = (
        texture: THREE.Texture, 
        rotation: number = 0, 
        scale: number = 1, 
        offsetX: number = 0, 
        offsetY: number = 0
      ) => {
        // Texture rotation
        if (rotation !== undefined && rotation !== 0) {
          const rotationRadians = (rotation * Math.PI) / 180;
          texture.center.set(0.5, 0.5);
          texture.rotation = rotationRadians;
        }
        
        // Texture scale
        if (scale !== undefined && scale !== 1) {
          texture.repeat.set(scale, scale);
        }
        
        // Texture offset
        if (offsetX !== undefined || offsetY !== undefined) {
          texture.offset.set(offsetX || 0, offsetY || 0);
        }
        
        texture.needsUpdate = true;
      };

      // Helper function to load images (URLs and data URLs - local files pre-converted)
      const loadImageTexture = async (urlOrDataUrl: string): Promise<THREE.Texture> => {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = urlOrDataUrl;
        
        console.log('🌐 Loading image:', urlOrDataUrl.startsWith('data:') ? 'data URL' : 'external URL');
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (error) => {
            console.error('❌ Failed to load image:', urlOrDataUrl.substring(0, 100) + '...', error);
            reject(new Error(`Failed to load image: ${urlOrDataUrl.substring(0, 50)}...`));
          };
        });
        
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false; // FIXED: Match client-side flipY = false for static images
        return texture;
      };

      // Apply front overlay (FIXED: use overlayUrl directly with enhanced type detection)
      if (settings.overlayUrl) {
        console.log('🖼️ Applying front overlay');
        
        let overlayTexture: THREE.Texture | null = null;
        const textureType = detectTextureType(settings.overlayUrl);
        
        console.log(`🔍 Detected overlay texture type: ${textureType} for URL: ${settings.overlayUrl.substring(0, 50)}...`);
        
        if (textureType === 'gif') {
          // Process GIF with gifuct-js (identical to client-side)
          const gifResult = await processGIF(settings.overlayUrl, settings.overlayGifSpeed || 'normal');
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            console.log('✅ Animated GIF overlay applied with gifuct-js');
          }
        } else if (textureType === 'webm') {
          // Process WebM video (with fallback handling)
          const webmResult = await processWebM(settings.overlayUrl);
          if (webmResult && webmResult.texture) {
            overlayTexture = webmResult.texture;
            console.log('✅ WebM overlay applied with fallback');
          }
        } else {
          // Process static image (URLs or local files)
          overlayTexture = await loadImageTexture(settings.overlayUrl);
          console.log('✅ Static overlay applied');
        }
        
        if (overlayTexture) {
          // FIXED: Top face needs flipY = true to appear right-side up
          overlayTexture.flipY = true;

          // Apply overlay transformations (matching client-side)
          applyTextureTransformations(
            overlayTexture,
            settings.overlayRotation || 0,
            settings.overlayScale || 1,
            settings.overlayOffsetX || 0,
            settings.overlayOffsetY || 0
          );
          
          console.log(`🔧 Applied overlay transformations: rotation=${settings.overlayRotation || 0}°, scale=${settings.overlayScale || 1}, offset=(${settings.overlayOffsetX || 0}, ${settings.overlayOffsetY || 0})`);
          
          
          if (settings.dualOverlay) {
            // DUAL MODE: Apply first overlay ONLY to top face
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
            console.log('✅ Front overlay applied to TOP face only (dual mode)');
            
            // Update top overlay glow for dual mode
            overlayTopGlow.material.updateGlowSource(overlayTexture, new THREE.Color(0xffffff));
            overlayTopGlow.visible = !!settings.overlayGlow;
          } else {
            // Apply to both faces in single mode - top face gets original
            overlayTop.material.map = overlayTexture;
            overlayTop.material.opacity = 1;
            overlayTop.material.needsUpdate = true;
            
            // Bottom face gets properly oriented version for single mode
            let bottomTexture;
            if (overlayTexture instanceof THREE.CanvasTexture) {
              // For animated GIFs, share the same canvas but create new texture 
              bottomTexture = new THREE.CanvasTexture(overlayTexture.image);
              bottomTexture.colorSpace = THREE.SRGBColorSpace;
              bottomTexture.flipY = true; // FIXED: Bottom face needs flipY = true + horizontal flip
              bottomTexture.wrapS = THREE.RepeatWrapping;
              bottomTexture.repeat.x = -1; // Horizontal flip for proper back face viewing
              bottomTexture.needsUpdate = true;
              // CRITICAL: Share the EXACT SAME userData object for synchronized animation (matching client-side)
              bottomTexture.userData = overlayTexture.userData;
            } else {
              // For static images, clone and set proper orientation 
              bottomTexture = overlayTexture.clone();
              bottomTexture.flipY = true; // FIXED: Bottom face needs flipY = true + horizontal flip
              bottomTexture.wrapS = THREE.RepeatWrapping;
              bottomTexture.repeat.x = -1; // Horizontal flip for proper back face viewing
              bottomTexture.needsUpdate = true;
            }
            
            // Apply same transformations to bottom texture (matching client-side)
            applyTextureTransformations(
              bottomTexture,
              settings.overlayRotation || 0,
              settings.overlayScale || 1,
              settings.overlayOffsetX || 0,
              settings.overlayOffsetY || 0
            );
            
            overlayBot.material.map = bottomTexture;
            overlayBot.material.opacity = 1;
            overlayBot.material.needsUpdate = true;
            console.log('✅ Front overlay applied to BOTH faces (single mode)');
            
            // Update overlay glows for single mode
            overlayTopGlow.material.updateGlowSource(overlayTexture, new THREE.Color(0xffffff));
            overlayBotGlow.material.updateGlowSource(bottomTexture, new THREE.Color(0xffffff));
            const overlayGlowEnabled = !!settings.overlayGlow;
            overlayTopGlow.visible = overlayGlowEnabled;
            overlayBotGlow.visible = overlayGlowEnabled;
          }
        }
      }

      // Apply back overlay (from overlayUrl2) in dual overlay mode
      if (settings.dualOverlay && settings.overlayUrl2) {
        console.log('🎨 Applying back overlay from URL2:', settings.overlayUrl2);
        
        let overlayTexture: THREE.Texture | null = null;
        const textureType = detectTextureType(settings.overlayUrl2);
        
        console.log(`🔍 Detected back overlay texture type: ${textureType} for URL: ${settings.overlayUrl2.substring(0, 50)}...`);
        
        if (textureType === 'gif') {
          // Process GIF with gifuct-js (identical to client-side)
          const gifResult = await processGIF(settings.overlayUrl2, settings.overlayGifSpeed || 'normal');
          if (gifResult && gifResult.texture) {
            overlayTexture = gifResult.texture;
            console.log('✅ Animated GIF back overlay applied with gifuct-js');
          }
        } else if (textureType === 'webm') {
          // Process WebM video (with fallback handling)
          const webmResult = await processWebM(settings.overlayUrl2);
          if (webmResult && webmResult.texture) {
            overlayTexture = webmResult.texture;
            console.log('✅ WebM back overlay applied with fallback');
          }
        } else {
          // Process static image (URLs or local files)
          overlayTexture = await loadImageTexture(settings.overlayUrl2);
          console.log('✅ Static back overlay applied');
        }
        
        if (overlayTexture) {
          // FIXED: Back face in dual mode should appear right-side up without vertical flip
          overlayTexture.flipY = false;

          // Apply overlay transformations to back overlay (matching client-side)
          applyTextureTransformations(
            overlayTexture,
            settings.overlayRotation || 0,
            settings.overlayScale || 1,
            settings.overlayOffsetX || 0,
            settings.overlayOffsetY || 0
          );
          
          console.log(`🔧 Applied back overlay transformations: rotation=${settings.overlayRotation || 0}°, scale=${settings.overlayScale || 1}, offset=(${settings.overlayOffsetX || 0}, ${settings.overlayOffsetY || 0})`);
          
          
          // DUAL MODE: Apply second overlay to bottom face with horizontal flip
          let bottomTexture;
          if (overlayTexture instanceof THREE.CanvasTexture) {
            // For animated GIFs, create new texture instance but share canvas for sync
            bottomTexture = new THREE.CanvasTexture(overlayTexture.image);
            bottomTexture.colorSpace = THREE.SRGBColorSpace;
            bottomTexture.flipY = false; // FIXED: Dual mode back face uses flipY = false
            bottomTexture.wrapS = THREE.RepeatWrapping;
            bottomTexture.repeat.x = -1; // FIXED: Add horizontal flip for dual mode back face
            bottomTexture.needsUpdate = true;
            // CRITICAL: Share the EXACT SAME userData object for synchronized animation
            bottomTexture.userData = overlayTexture.userData;
            console.log('✅ Back overlay (animated) applied to BOTTOM face with shared animation state');
          } else {
            // For static images, add horizontal flip for dual mode back face
            bottomTexture = overlayTexture.clone();
            bottomTexture.flipY = false; // Keep flipY = false for dual mode
            bottomTexture.wrapS = THREE.RepeatWrapping;
            bottomTexture.repeat.x = -1; // FIXED: Add horizontal flip for dual mode back face
            bottomTexture.needsUpdate = true;
            console.log('✅ Back overlay (static) applied to BOTTOM face with horizontal flip');
          }
          
          // Apply same transformations to bottom texture in dual mode (matching client-side)
          applyTextureTransformations(
            bottomTexture,
            settings.overlayRotation || 0,
            settings.overlayScale || 1,
            settings.overlayOffsetX || 0,
            settings.overlayOffsetY || 0
          );
          
          overlayBot.material.map = bottomTexture;
          
          overlayBot.material.opacity = 1;
          overlayBot.material.needsUpdate = true;
          
          // Update bottom overlay glow for dual mode
          overlayBotGlow.material.updateGlowSource(bottomTexture, new THREE.Color(0xffffff));
          overlayBotGlow.visible = !!settings.overlayGlow;
        }
      }

      // Apply body texture if provided (new feature - matching client-side)
      if (settings.bodyTextureUrl) {
        console.log('🎨 Applying body texture:', settings.bodyTextureUrl.substring(0, 100) + '...');
        console.log('🔍 Body texture URL type:', settings.bodyTextureUrl.startsWith('data:') ? 'data URL' : 'external URL');
        
        try {
          let bodyTexture: THREE.Texture | null = null;
          const textureType = detectTextureType(settings.bodyTextureUrl);
          
          console.log(`🔍 Detected body texture type: ${textureType} for URL`);
          
          if (textureType === 'gif') {
            // Process GIF body texture with animation speed compatibility
            console.log('🎞️ Processing GIF body texture...');
            
            // CRITICAL FIX: Map client animation speed settings to server expectations
            const gifSpeed = settings.bodyGifSpeed || 
                           settings.gifAnimationSpeed || 
                           settings.overlayGifSpeed || 
                           'normal';
            
            console.log(`🎬 Using GIF animation speed: ${gifSpeed} (from bodyGifSpeed: ${settings.bodyGifSpeed}, gifAnimationSpeed: ${settings.gifAnimationSpeed}, overlayGifSpeed: ${settings.overlayGifSpeed})`);
            
            const gifResult = await processGIF(settings.bodyTextureUrl, gifSpeed);
            if (gifResult && gifResult.texture) {
              bodyTexture = gifResult.texture;
              console.log('✅ Animated GIF body texture applied with speed:', gifSpeed);
            } else {
              console.warn('⚠️ GIF processing returned null result');
            }
          } else if (textureType === 'webm') {
            // Process WebM body texture (with fallback handling)
            console.log('🎥 Processing WebM body texture...');
            const webmResult = await processWebM(settings.bodyTextureUrl);
            if (webmResult && webmResult.texture) {
              bodyTexture = webmResult.texture;
              console.log('✅ WebM body texture applied with fallback');
            } else {
              console.warn('⚠️ WebM processing returned null result');
            }
          } else {
            // Process static body texture (URLs or local files)
            console.log('🖼️ Processing static body texture...');
            bodyTexture = await loadImageTexture(settings.bodyTextureUrl);
            console.log('✅ Static body texture applied');
          }
          
          if (bodyTexture) {
            // Apply texture transformations (matching client-side)
            const rimTexture = bodyTexture.clone();
            const faceTexture = bodyTexture.clone();
            
            // Preserve GIF animation userData from original texture
            if (bodyTexture.userData && bodyTexture.userData.update) {
              rimTexture.userData = { ...bodyTexture.userData };
              faceTexture.userData = { ...bodyTexture.userData };
            }
            
            // Apply texture transformations to both textures
            [rimTexture, faceTexture].forEach(texture => {
              // Texture rotation
              if (settings.bodyTextureRotation !== undefined && settings.bodyTextureRotation !== 0) {
                const rotationRadians = (settings.bodyTextureRotation * Math.PI) / 180;
                texture.center.set(0.5, 0.5);
                texture.rotation = rotationRadians;
              }
              
              // Texture scale
              if (settings.bodyTextureScale !== undefined && settings.bodyTextureScale !== 1) {
                texture.repeat.set(settings.bodyTextureScale, settings.bodyTextureScale);
              }
              
              // Texture offset
              if (settings.bodyTextureOffsetX !== undefined || settings.bodyTextureOffsetY !== undefined) {
                texture.offset.set(
                  settings.bodyTextureOffsetX || 0,
                  settings.bodyTextureOffsetY || 0
                );
              }
              
              // Texture mapping (basic implementation)
              if (settings.bodyTextureMapping) {
                // Note: Three.js UV mapping is handled by geometry, 
                // but we can adjust texture wrapping and filtering
                switch (settings.bodyTextureMapping) {
                  case 'planar':
                    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
                    break;
                  case 'cylindrical':
                  case 'spherical':
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    break;
                }
              }
              
              texture.needsUpdate = true;
            });
            
            // Apply transformed textures to materials
            rimMat.map = rimTexture;
            faceMat.map = faceTexture;
            rimMat.color.set('#ffffff'); // Base white for texture
            faceMat.color.set('#ffffff');
            rimMat.needsUpdate = true;
            faceMat.needsUpdate = true;
            
            // Update body glow materials to match body textures
            cylinderGlow.material.updateGlowSource(rimTexture, new THREE.Color('#ffffff'));
            topGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
            bottomGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
            
            console.log('✅ Body texture applied with transformations:', {
              rotation: settings.bodyTextureRotation || 0,
              scale: settings.bodyTextureScale || 1,
              offsetX: settings.bodyTextureOffsetX || 0,
              offsetY: settings.bodyTextureOffsetY || 0,
              mapping: settings.bodyTextureMapping || 'cylindrical'
            });
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
        
        // Animation configuration (matching client-side)
        const animationConfigs = {
          right: { axis: 'y' as const, direction: 1 },
          left: { axis: 'y' as const, direction: -1 },
          up: { axis: 'x' as const, direction: -1 }, // FIXED: was direction: 1
          down: { axis: 'x' as const, direction: 1 } // FIXED: was direction: -1
        };
        
        // Animation preset functions (matching client-side)
        const animationPresets = {
          smooth: (progress: number) => {
            // Smooth 360° rotation over full duration
            return progress;
          },
          'fast-slow': (progress: number) => {
            // Fast spin for first 1.5s, then slow static display for remaining 1.5s
            if (progress < 0.5) {
              // First half - complete full rotation
              return progress * 2;
            } else {
              // Second half - hold at full rotation (static)
              return 1;
            }
          },
          bounce: (progress: number) => {
            // Bounce effect: slight back rotation, fast flip, bounce, calm for 1s
            if (progress < 0.1) {
              // First 0.3s - slight back rotation (-10°)
              return -0.028 * Math.sin(progress * 10 * Math.PI); // Slight back movement
            } else if (progress < 0.4) {
              // Next 0.9s - fast forward rotation to 380° (overshoot)
              const fastProgress = (progress - 0.1) / 0.3;
              return fastProgress * 1.056; // 380° = 1.056 rotations
            } else if (progress < 0.6) {
              // Next 0.6s - bounce back to 360° with elastic effect
              const bounceProgress = (progress - 0.4) / 0.2;
              const elasticOut = 1 + Math.pow(2, -10 * bounceProgress) * Math.sin((bounceProgress * 10 - 0.75) * (2 * Math.PI) / 3);
              return 1.056 - (0.056 * elasticOut); // Settle to exactly 1 rotation
            } else {
              // Final 1.2s - stay calm at 360°
              return 1;
            }
          }
        };
        
        // Calculate frame progress and apply preset animation
        const frameProgress = i / (exportSettings.frames - 1);
        const preset = animationPresets[settings.animationPreset || 'smooth'];
        const animatedProgress = preset(frameProgress);
        const config = animationConfigs[settings.animationDirection || 'right'];
        
        // Calculate rotation from animated progress
        const totalRotation = animatedProgress * Math.PI * 2 * config.direction;
        
        // Apply rotation to the correct axis (matching client-side)
        if (config.axis === 'y') {
          turntable.rotation.y = totalRotation;
          turntable.rotation.x = 0; // Keep X axis stable for left/right animation
        } else {
          turntable.rotation.x = totalRotation;
          turntable.rotation.y = 0; // Keep Y axis stable for up/down animation
        }

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

    }, { ...request, settings: processedSettings });
      console.log('✅ Browser page evaluation completed successfully');
    } catch (evalError) {
      console.error('❌ Page evaluation failed:', evalError);
      throw new Error(`Frame rendering failed: ${evalError instanceof Error ? evalError.message : 'Unknown evaluation error'}`);
    }

    console.log(`✅ Server-side rendering complete: ${framesBase64.length} frames captured`);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
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
      headers: corsHeaders,
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
