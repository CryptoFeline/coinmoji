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

// Helper function to detect if URL is a GIF or WebM (supports both URLs and data URIs)
const isGifUrl = (url: string): boolean => {
  return /\.gif$/i.test(url) || 
         /data:image\/gif/i.test(url);
  // REMOVED: || url.includes('gif') - this was too broad and caught static images
};

const isWebMUrl = (url: string): boolean => {
  return /\.webm$/i.test(url) || 
         /data:video\/webm/i.test(url);
  // REMOVED: || url.includes('webm') - this was too broad and caught static images
};

const isMP4Url = (url: string): boolean => {
  return /\.mp4$/i.test(url) || 
         /data:video\/mp4/i.test(url);
};

const isVideoUrl = (url: string): boolean => {
  return isWebMUrl(url) || isMP4Url(url);
};

// Enhanced texture type detection that also considers MIME types
const detectTextureType = (url: string): 'gif' | 'webm' | 'mp4' | 'video' | 'static' => {
  if (isGifUrl(url)) return 'gif';
  if (isWebMUrl(url)) return 'webm';
  if (isMP4Url(url)) return 'mp4';
  if (isVideoUrl(url)) return 'video'; // Generic video fallback
  return 'static';
};

// Pre-process GIFs to prevent Chrome timeout during page evaluation
async function preprocessGifs(settings: any): Promise<any> {
  const processedSettings = { ...settings };
  const urlsToProcess: string[] = [];
  
  // Collect all GIF URLs that need preprocessing
  if (processedSettings.bodyTextureUrl && detectTextureType(processedSettings.bodyTextureUrl) === 'gif') {
    urlsToProcess.push(processedSettings.bodyTextureUrl);
  }
  if (processedSettings.overlayUrl && detectTextureType(processedSettings.overlayUrl) === 'gif') {
    urlsToProcess.push(processedSettings.overlayUrl);
  }
  if (processedSettings.overlayUrl2 && detectTextureType(processedSettings.overlayUrl2) === 'gif') {
    urlsToProcess.push(processedSettings.overlayUrl2);
  }
  
  if (urlsToProcess.length === 0) {
    console.log('📝 No GIFs found for preprocessing');
    return processedSettings;
  }
  
  console.log(`🎞️ Found ${urlsToProcess.length} GIFs to preprocess:`, urlsToProcess.map(url => 
    url.startsWith('data:') ? 'data URL' : url
  ));
  
  // Load gifuct for server-side processing
  const gifuctPath = path.join(__dirname, 'vendor', 'gifuct.browser.js');
  if (!fs.existsSync(gifuctPath)) {
    console.warn('⚠️ gifuct-js not found, skipping GIF preprocessing');
    return processedSettings;
  }
  
  console.log('🔍 Validating GIF sizes and removing problematic ones...');
  
  // Track which URLs need to be removed
  const problematicUrls: string[] = [];
  
  for (const url of urlsToProcess) {
    try {
      if (url.startsWith('data:')) {
        // For data URLs, we can calculate the size
        const base64Data = url.split(',')[1];
        if (base64Data) {
          const sizeInBytes = (base64Data.length * 3) / 4; // Approximate size from base64
          const sizeInMB = sizeInBytes / (1024 * 1024);
          console.log(`📏 Data URL GIF size: ~${sizeInMB.toFixed(2)}MB`);
          
          if (sizeInMB > 8) { // Conservative limit for data URLs
            console.error(`❌ Data URL GIF is too large: ${sizeInMB.toFixed(2)}MB > 8MB`);
            problematicUrls.push(url);
          }
        }
      } else {
        // For external URLs, fetch headers to check size
        const response = await fetch(url, { method: 'HEAD' });
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
          const sizeInMB = parseInt(contentLength) / (1024 * 1024);
          console.log(`📏 External GIF size: ${sizeInMB.toFixed(2)}MB (${url})`);
          
          if (sizeInMB > 5) {
            console.error(`❌ External GIF is too large: ${sizeInMB.toFixed(2)}MB > 5MB`);
            problematicUrls.push(url);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Failed to validate GIF: ${url.substring(0, 50)}...`, error);
      // If we can't validate it, assume it might be problematic
      problematicUrls.push(url);
    }
  }
  
  // Remove problematic URLs from settings and notify about the removal
  if (problematicUrls.length > 0) {
    console.log(`🚫 Removing ${problematicUrls.length} problematic GIF(s) from settings...`);
    
    for (const problemUrl of problematicUrls) {
      if (processedSettings.bodyTextureUrl === problemUrl) {
        console.log('🚫 Removing body texture GIF (too large) - switching to solid color');
        processedSettings.bodyTextureUrl = '';
        processedSettings.fillMode = 'solid'; // Fallback to solid color
      }
      if (processedSettings.overlayUrl === problemUrl) {
        console.log('🚫 Removing overlay GIF (too large)');
        processedSettings.overlayUrl = '';
      }
      if (processedSettings.overlayUrl2 === problemUrl) {
        console.log('🚫 Removing overlay2 GIF (too large)');
        processedSettings.overlayUrl2 = '';
      }
    }
    
    // This will be visible to the user in the error message
    // ${problematicUrls.length === 1 ? 'The large GIF has' : 'Large GIFs have'} been automatically removed to prevent timeout. Please use smaller GIF files.
    const errorMessage = `GIF file(s) too large for processing. Maximum size is 5MB for external URLs, 8MB for uploaded files.

Tip: Compress GIFs or use WebM!`;
    
    throw new Error(errorMessage);
  }
  
  console.log('✅ GIF preprocessing complete - all GIFs validated');
  return processedSettings;
}

// Video decoding function using the same FFmpeg setup as make-webm.ts
async function decodeVideoToSpritesheet(videoData: Buffer | string, isDataUrl: boolean = false): Promise<{
  sheet: string; // base64 data URL
  cols: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
} | null> {
  
  // Import FFmpeg setup from make-webm (reuse the same logic)
  const { spawn } = await import('node:child_process');
  const { writeFile, readFile, rm, mkdtemp, access } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  
  // Reuse the same FFmpeg path resolution as make-webm.ts
  const possibleFFmpegPaths = [
    join(__dirname, '..', 'make-webm', 'ffmpeg'),
    '/var/task/netlify/functions/make-webm/ffmpeg',
    join(process.cwd(), 'netlify', 'functions', 'make-webm', 'ffmpeg')
  ];
  
  let ffmpegPath = '';
  for (const path of possibleFFmpegPaths) {
    try {
      await access(path);
      ffmpegPath = path;
      console.log('✅ Found FFmpeg binary for video decoding:', ffmpegPath);
      break;
    } catch {}
  }
  
  if (!ffmpegPath) {
    console.warn('⚠️ FFmpeg binary not found, skipping video decode');
    return null;
  }
  
  const tmpDir = await mkdtemp(join(tmpdir(), 'video-decode-'));
  console.log('📁 Created temp directory for video decode:', tmpDir);
  
  try {
    // Spritesheet configuration (conservative for payload size)
    const COLS = 10;
    const ROWS = 6;
    const FRAME_COUNT = COLS * ROWS; // 60 frames
    const FPS = 20;
    const FRAME_W = 100; // Small frames to keep payload under 5MB
    const FRAME_H = 100;
    
    // Write video data to temp file
    const videoPath = join(tmpDir, 'input.video');
    if (isDataUrl && typeof videoData === 'string') {
      // Extract base64 data from data URL
      const base64Data = videoData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      await writeFile(videoPath, buffer);
    } else if (Buffer.isBuffer(videoData)) {
      await writeFile(videoPath, videoData);
    } else {
      throw new Error('Invalid video data format');
    }
    
    const sheetPath = join(tmpDir, 'spritesheet.png');
    
    console.log(`🎞️ Decoding video to ${COLS}x${ROWS} spritesheet (${FRAME_W}x${FRAME_H} frames)...`);
    
    // FFmpeg command to create spritesheet (similar to your plan)
    const ffmpegArgs = [
      '-i', videoPath,
      '-vf', [
        `fps=${FPS}`, // Extract at 20 FPS
        `scale=${FRAME_W}:${FRAME_H}:flags=lanczos`, // Scale each frame
        `tile=${COLS}x${ROWS}:padding=0:margin=0` // Create spritesheet
      ].join(','),
      '-frames:v', '1', // Output single spritesheet image
      '-y',
      sheetPath
    ];
    
    await new Promise<void>((resolve, reject) => {
      const process = spawn(ffmpegPath, ffmpegArgs);
      let stderr = '';
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg video decode failed: ${stderr}`));
        }
      });
      
      process.on('error', reject);
    });
    
    // Read spritesheet and convert to base64
    const sheetBuffer = await readFile(sheetPath);
    const sheetBase64 = sheetBuffer.toString('base64');
    const sheetDataUrl = `data:image/png;base64,${sheetBase64}`;
    
    console.log(`✅ Video spritesheet created: ${(sheetBuffer.length/1024).toFixed(1)}KB`);
    
    // Check payload size (conservative limit)
    if (sheetBuffer.length > 3 * 1024 * 1024) { // 3MB limit for spritesheet
      console.warn(`⚠️ Spritesheet too large: ${(sheetBuffer.length/1024/1024).toFixed(1)}MB > 3MB`);
      return null;
    }
    
    return {
      sheet: sheetDataUrl,
      cols: COLS,
      rows: ROWS,
      frameWidth: FRAME_W,
      frameHeight: FRAME_H,
      frameCount: FRAME_COUNT,
      fps: FPS
    };
    
  } catch (error) {
    console.error('❌ Video decoding failed:', error);
    return null;
  } finally {
    // Clean up temp directory
    try {
      await rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn('⚠️ Failed to clean up video decode temp directory:', cleanupError);
    }
  }
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
    bodyGlowScale?: number;         // NEW: Body glow scale (1.0 - 1.5)
    bodyGlowIntensity?: number;     // NEW: Body glow brightness control (0.5 - 5.0)
    bodyGlowSharpness?: number;     // NEW: Body glow edge sharpness (0.1 - 2.0)
    
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
  overlayGlowScale?: number;      // NEW: Overlay glow scale (1.0 - 1.5)
  overlayGlowIntensity?: number;  // NEW: Overlay glow brightness control (0.5 - 5.0)
  overlayGlowSharpness?: number;  // NEW: Overlay glow edge sharpness (0.1 - 2.0)
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
    startFrame?: number; // NEW: For segmented rendering
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
    
    // NEW: Extract startFrame for segmented rendering
    const startFrame = Number(request.exportSettings.startFrame) || 0;
    console.log(`📋 Segmented rendering: starting from frame ${startFrame} of ${request.exportSettings.frames} total frames`);
    
    console.log('📋 Render request (after FPS cap):', {
      settings: request.settings,
      exportSettings: request.exportSettings,
      startFrame: startFrame
    });

    // All uploaded files are now sent as either data URLs (JSON) or binary files (multipart)
    let processedSettings = { ...request.settings };
    
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
      overlayUrl2: processedSettings.overlayUrl2 || 'none',
      // CRITICAL: Log glow settings to verify they're reaching the server
      bodyGlow: processedSettings.bodyGlow,
      bodyGlowIntensity: processedSettings.bodyGlowIntensity,
      bodyGlowSharpness: processedSettings.bodyGlowSharpness,
      overlayGlow: processedSettings.overlayGlow,
      overlayGlowIntensity: processedSettings.overlayGlowIntensity,
      overlayGlowSharpness: processedSettings.overlayGlowSharpness
    });

    // 🚀 NEW: Pre-process GIFs to prevent Chrome timeout
    console.log('🎞️ Pre-processing GIFs before Chrome launch...');
    processedSettings = await preprocessGifs(processedSettings);

    // 🚀 NEW: Pre-process videos to spritesheets
    console.log('🎞️ Pre-processing videos to spritesheets...');
    
    // Process main body texture
    if (processedSettings.bodyTextureUrl && isVideoUrl(processedSettings.bodyTextureUrl)) {
      console.log('🎞️ Detecting video body texture, decoding to spritesheet...');
      const videoResult = await decodeVideoToSpritesheet(processedSettings.bodyTextureUrl, true);
      if (videoResult) {
        // Replace video URL with spritesheet data
        processedSettings.bodyTextureUrl = videoResult.sheet;
        // Store spritesheet metadata using type casting
        (processedSettings as any).bodyTextureSpritesheet = {
          cols: videoResult.cols,
          rows: videoResult.rows,
          frameWidth: videoResult.frameWidth,
          frameHeight: videoResult.frameHeight,
          frameCount: videoResult.frameCount,
          fps: videoResult.fps
        };
        console.log(`✅ Video body texture converted to spritesheet: ${videoResult.cols}x${videoResult.rows}`);
      } else {
        console.warn('⚠️ Video body texture decode failed, falling back to first frame');
        // Keep original URL as fallback
      }
    }
    
    // Process overlay textures
    if (processedSettings.overlayUrl && isVideoUrl(processedSettings.overlayUrl)) {
      console.log('🎞️ Detecting video overlay texture, decoding to spritesheet...');
      const videoResult = await decodeVideoToSpritesheet(processedSettings.overlayUrl, true);
      if (videoResult) {
        processedSettings.overlayUrl = videoResult.sheet;
        (processedSettings as any).overlaySpritesheet = {
          cols: videoResult.cols,
          rows: videoResult.rows,
          frameWidth: videoResult.frameWidth,
          frameHeight: videoResult.frameHeight,
          frameCount: videoResult.frameCount,
          fps: videoResult.fps
        };
        console.log(`✅ Video overlay texture converted to spritesheet: ${videoResult.cols}x${videoResult.rows}`);
      } else {
        console.warn('⚠️ Video overlay texture decode failed, falling back to first frame');
      }
    }
    
    // Process second overlay texture
    if (processedSettings.overlayUrl2 && isVideoUrl(processedSettings.overlayUrl2)) {
      console.log('🎞️ Detecting video overlay2 texture, decoding to spritesheet...');
      const videoResult = await decodeVideoToSpritesheet(processedSettings.overlayUrl2, true);
      if (videoResult) {
        processedSettings.overlayUrl2 = videoResult.sheet;
        (processedSettings as any).overlaySpritesheet2 = {
          cols: videoResult.cols,
          rows: videoResult.rows,
          frameWidth: videoResult.frameWidth,
          frameHeight: videoResult.frameHeight,
          frameCount: videoResult.frameCount,
          fps: videoResult.fps
        };
        console.log(`✅ Video overlay2 texture converted to spritesheet: ${videoResult.cols}x${videoResult.rows}`);
      } else {
        console.warn('⚠️ Video overlay2 texture decode failed, falling back to first frame');
      }
    }

    // NEW: Adaptive segment sizing based on asset complexity
    const hasLargeAssets = uploadedFiles.some(f => f.data.length > 1024 * 1024); // 1MB+
    const hasAnimatedAssets = [
      processedSettings.bodyTextureUrl,
      processedSettings.overlayUrl,
      processedSettings.overlayUrl2
    ].some(url => url && (isGifUrl(url) || isVideoUrl(url)));
    
    // Reduce segment size for complex scenes to prevent timeouts
    let segmentSize = 60; // Default: render all frames
    if (hasLargeAssets && hasAnimatedAssets) {
      segmentSize = 15; // Very conservative for large GIFs/videos
      console.log(`⚠️ Large animated assets detected - using small segments of ${segmentSize} frames`);
    } else if (hasLargeAssets || hasAnimatedAssets) {
      segmentSize = 30; // Medium segments for moderate complexity
      console.log(`⚠️ Complex assets detected - using medium segments of ${segmentSize} frames`);
    }
    
    // Calculate actual frame range for this segment
    const endFrame = Math.min(startFrame + segmentSize, request.exportSettings.frames);
    const framesToRender = endFrame - startFrame;
    
    console.log(`🎬 This segment will render ${framesToRender} frames: ${startFrame} to ${endFrame - 1}`);

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
      
      // Set page evaluation timeout to prevent Chrome hanging
      const pageTimeout = 25000; // 25 seconds (5s buffer before Lambda timeout)
      console.log(`⏱️ Setting page evaluation timeout: ${pageTimeout}ms`);
      
      framesBase64 = await Promise.race([
        page.evaluate(async (renderRequest, startFrame, endFrame) => {
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
      renderer.setSize(200, 200); // FIXED: Render at 200px for better quality, downscale later
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
      
      // Define GlowMapMaterial in plain JS (EXACTLY matching client-side GlowMapMaterial.ts)
      const GlowMapMaterial = class extends THREE.ShaderMaterial {
        constructor(params) {
          const p = params || {};
          super({
            uniforms: {
              glowColor: { value: new THREE.Color(p.color || 0xffffff) },
              map:       { value: p.map || null },
              useMap:    { value: !!p.map },
              intensity: { value: p.intensity !== undefined ? p.intensity : 1.0 },
              threshold: { value: p.threshold !== undefined ? p.threshold : 0.0 }, // Changed default to 0
              sharpness: { value: p.sharpness !== undefined ? p.sharpness : 0.5 },
            },
            transparent: true,
            depthTest: true,        // Always enabled to prevent transparency issues
            depthWrite: false,      // Don't write to depth buffer to allow proper layering
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,  // FIXED: Use FrontSide for proper outward glow
            alphaTest: 0.01,        // Discard nearly transparent pixels
            vertexShader: [
              'varying vec3 vWorldPos;',
              'varying vec3 vWorldNormal;',
              'varying vec2 vUv;',
              '',
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
              '',
              'varying vec3 vWorldPos;',
              'varying vec3 vWorldNormal;',
              'varying vec2 vUv;',
              '',
              '// Improved edge detection function',
              'float getEdgeStrength(vec2 uv) {',
              '  if (!useMap) return 1.0;',
              '  ',
              '  vec2 texelSize = 1.0 / vec2(textureSize(map, 0));',
              '  vec3 center = texture2D(map, uv).rgb;',
              '  ',
              '  // Sample neighboring pixels for edge detection',
              '  vec3 right = texture2D(map, uv + vec2(texelSize.x, 0.0)).rgb;',
              '  vec3 left = texture2D(map, uv - vec2(texelSize.x, 0.0)).rgb;',
              '  vec3 up = texture2D(map, uv + vec2(0.0, texelSize.y)).rgb;',
              '  vec3 down = texture2D(map, uv - vec2(0.0, texelSize.y)).rgb;',
              '  ',
              '  // Calculate gradient magnitude',
              '  vec3 gradX = right - left;',
              '  vec3 gradY = up - down;',
              '  float grad = length(gradX) + length(gradY);',
              '  ',
              '  return smoothstep(0.1, 0.5, grad);',
              '}',
              '',
              'void main() {',
              '  // Get base color from texture or uniform',
              '  vec3 base = useMap ? texture2D(map, vUv).rgb : glowColor;',
              '  ',
              '  // Enhanced brightness gate with perceptual weighting',
              '  float luma = dot(base, vec3(0.299, 0.587, 0.114)); // More accurate perceptual weights',
              '  float brightGate = smoothstep(threshold * 0.8, threshold + 0.2, luma);',
              '  ',
              '  // Edge detection for texture detail enhancement',
              '  float edgeStrength = getEdgeStrength(vUv);',
              '  ',
              '  // Improved multi-layer fresnel calculation',
              '  vec3 V = normalize(cameraPosition - vWorldPos);',
              '  vec3 N = normalize(vWorldNormal);',
              '  ',
              '  // Fixed fresnel for FrontSide outward glow (removed abs())',
              '  float NdotV = dot(N, V);',
              '  float fresnel1 = 1.0 - max(0.2, NdotV); // FIXED: Use 0.2 minimum to prevent dead spots at side angles',
              '  float rim1 = pow(fresnel1, 0.3 + sharpness * 1.5);',
              '  ',
              '  // Secondary fresnel for edge enhancement',
              '  float fresnel2 = 1.0 - pow(max(0.15, NdotV), 0.5); // Also use minimum to maintain consistent glow',
              '  float rim2 = pow(fresnel2, 1.0 + sharpness * 2.0);',
              '  ',
              '  // Combine multiple glow components',
              '  float primaryGlow = rim1 * brightGate;',
              '  float edgeGlow = rim2 * edgeStrength * 0.6;',
              '  float combinedGlow = primaryGlow + edgeGlow;',
              '  ',
              '  // Apply intensity with improved falloff',
              '  float glowStrength = combinedGlow * intensity;',
              '  float alpha = smoothstep(0.0, 1.2, glowStrength);',
              '  ',
              '  // Enhanced color mixing with saturation boost for bright areas',
              '  vec3 finalColor = base * (1.0 + alpha * 0.5);',
              '  if (brightGate > 0.5) {',
              '    // Boost saturation for bright glowing areas',
              '    float satBoost = (brightGate - 0.5) * 0.4;',
              '    vec3 gray = vec3(luma);',
              '    finalColor = mix(finalColor, finalColor + (finalColor - gray) * satBoost, satBoost);',
              '  }',
              '  ',
              '  gl_FragColor = vec4(finalColor, alpha * 0.9);',
              '',
              '  // Apply tone mapping to match main renderer',
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
        
        setGlowParams(intensity, threshold, sharpness) {
          this.uniforms.intensity.value = intensity;
          this.uniforms.threshold.value = threshold;
          this.uniforms.sharpness.value = sharpness;
          this.needsUpdate = true;
        }
      };

      // Create body glow meshes
      const cylinderGlow = new THREE.Mesh(
        cylinderGeometry,
        new GlowMapMaterial({
          map: rimMat.map ?? null,
          color: rimMat.color,
          threshold: 0.0,                     // Fixed: Always 0, not user-adjustable
          intensity: 2.2,                     // Higher intensity for better visibility
          sharpness: 0.6,                     // Balanced sharpness for smooth edges
        })
      );
      cylinderGlow.scale.setScalar(1.01);     // Fixed scale for consistent glow appearance
      cylinderGlow.visible = !!settings.bodyGlow;
      cylinderGlow.renderOrder = 1;    // Render after main geometry

      const topGlow = new THREE.Mesh(
        topFace.geometry.clone(),
        new GlowMapMaterial({
          map: faceMat.map ?? null,
          color: faceMat.color,
          threshold: 0.0,                     // Fixed: Always 0, not user-adjustable
          intensity: 2.2,
          sharpness: 0.6,
        })
      );
      topGlow.scale.setScalar(1.01);          // Fixed scale for consistent glow appearance
      topGlow.visible = !!settings.bodyGlow;
      topGlow.renderOrder = 1;

      const bottomGlow = new THREE.Mesh(
        bottomFace.geometry.clone(),
        new GlowMapMaterial({
          map: faceMat.map ?? null,
          color: faceMat.color,
          threshold: 0.0,                     // Fixed: Always 0, not user-adjustable
          intensity: 2.2,
          sharpness: 0.6,
        })
      );
      bottomGlow.scale.setScalar(1.01);       // Fixed scale for consistent glow appearance
      bottomGlow.visible = !!settings.bodyGlow;
      bottomGlow.renderOrder = 1;

      // Create overlay glow meshes
      const overlayTopGlow = new THREE.Mesh(
        overlayTop.geometry,
        new GlowMapMaterial({ 
          threshold: 0.0,                     // Fixed: Always 0, not user-adjustable
          intensity: 2.8,                     // Higher intensity for overlay visibility
          sharpness: 0.7                      // Sharper for detailed overlays
        })
      );
      overlayTopGlow.scale.setScalar(1.01);   // Fixed scale for consistent glow appearance
      overlayTopGlow.visible = !!settings.overlayGlow;
      overlayTopGlow.renderOrder = 2;    // Render after body glow

      const overlayBotGlow = new THREE.Mesh(
        overlayBot.geometry,
        new GlowMapMaterial({ 
          threshold: 0.0,                     // Fixed: Always 0, not user-adjustable
          intensity: 2.8, 
          sharpness: 0.7 
        })
      );
      overlayBotGlow.scale.setScalar(1.01);   // Fixed scale for consistent glow appearance
      overlayBotGlow.visible = !!settings.overlayGlow;
      overlayBotGlow.renderOrder = 2;
      // Apply geometric rotation to fix glow orientation on back face (matching client-side fix)
      overlayBotGlow.rotation.y = Math.PI; // 180 degree rotation to match proper back face orientation

      // Add glow meshes to coin group
      coinGroup.add(cylinderGlow, topGlow, bottomGlow, overlayTopGlow, overlayBotGlow);
      coinGroup.rotation.x = Math.PI / 2; // Stand on edge

      // 🔍 DEBUG: Glow mesh creation and settings
      console.log('🌟 Glow mesh creation debug:', {
        bodyGlow: settings.bodyGlow,
        bodyGlowIntensity: settings.bodyGlowIntensity,
        bodyGlowSharpness: settings.bodyGlowSharpness,
        overlayGlow: settings.overlayGlow,
        overlayGlowIntensity: settings.overlayGlowIntensity,
        overlayGlowSharpness: settings.overlayGlowSharpness,
        cylinderGlowVisible: cylinderGlow.visible,
        topGlowVisible: topGlow.visible,
        bottomGlowVisible: bottomGlow.visible,
        overlayTopGlowVisible: overlayTopGlow.visible,
        overlayBotGlowVisible: overlayBotGlow.visible,
        glowMeshesInScene: [cylinderGlow, topGlow, bottomGlow, overlayTopGlow, overlayBotGlow].length
      });

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

      console.log('🎨 Applying user material settings...');
      console.log('🔍 CRITICAL: Glow debug - bodyGlow:', settings.bodyGlow, 'intensity:', settings.bodyGlowIntensity);
      
      if (settings.fillMode === 'solid') {
        rimMat.color.set(settings.bodyColor);
        faceMat.color.set(settings.bodyColor);
        console.log('🎯 Applied solid color:', settings.bodyColor);
        
        // Update body glow materials for solid colors
        const bodyGlowIntensity = settings.bodyGlowIntensity || 2.2;
        const bodyGlowSharpness = settings.bodyGlowSharpness || 0.6;
        
        // CRITICAL: Set glow visibility BEFORE applying parameters
        cylinderGlow.visible = !!settings.bodyGlow;
        topGlow.visible = !!settings.bodyGlow;
        bottomGlow.visible = !!settings.bodyGlow;
        
        console.log('🔍 DEBUG: Applying body glow params:', { 
          intensity: bodyGlowIntensity, 
          sharpness: bodyGlowSharpness,
          bodyGlowEnabled: !!settings.bodyGlow,
          cylinderGlowVisible: cylinderGlow.visible,
          topGlowVisible: topGlow.visible,
          bottomGlowVisible: bottomGlow.visible,
          glowScale: cylinderGlow.scale.x
        });
        
        cylinderGlow.material.updateGlowSource(null, rimMat.color);
        cylinderGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
        
        topGlow.material.updateGlowSource(null, faceMat.color);
        topGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
        
        bottomGlow.material.updateGlowSource(null, faceMat.color);
        bottomGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
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
        const bodyGlowIntensity = settings.bodyGlowIntensity || 2.2;
        const bodyGlowSharpness = settings.bodyGlowSharpness || 0.6;
        
        // CRITICAL: Set glow visibility BEFORE applying parameters (gradient mode)
        cylinderGlow.visible = !!settings.bodyGlow;
        topGlow.visible = !!settings.bodyGlow;
        bottomGlow.visible = !!settings.bodyGlow;
        
        console.log('🔍 DEBUG: Applying body glow params (gradient):', { 
          intensity: bodyGlowIntensity, 
          sharpness: bodyGlowSharpness,
          bodyGlowEnabled: !!settings.bodyGlow,
          cylinderGlowVisible: cylinderGlow.visible,
          topGlowVisible: topGlow.visible,
          bottomGlowVisible: bottomGlow.visible
        });
        
        cylinderGlow.material.updateGlowSource(rimTexture, new THREE.Color('#ffffff'));
        cylinderGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
        
        topGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
        topGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
        
        bottomGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
        bottomGlow.material.setGlowParams(bodyGlowIntensity, 0.0, bodyGlowSharpness);
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
            
            // CRITICAL: Stricter limits to prevent Chrome timeouts during page evaluation
            if (sizeInMB > 5) { // Reduced from 15MB to 5MB to prevent Chrome hanging
              throw new Error(`GIF file is too large (${sizeInMB.toFixed(1)}MB > 5MB). Please use a smaller file to prevent timeout.`);
            }
          }
        }
        
        buffer = await response.arrayBuffer();
        
        const actualSizeInMB = buffer.byteLength / (1024 * 1024);
        console.log(`📏 Actual GIF size: ${actualSizeInMB.toFixed(2)}MB`);
        
        // STRICTER: Reduced limits to prevent Chrome timeout during page evaluation
        const isUploadedFile = url.startsWith('data:');
        const maxSizeMB = isUploadedFile ? 8 : 5; // Much more conservative limits
        
        if (actualSizeInMB > maxSizeMB) {
          throw new Error(`GIF file is too large (${actualSizeInMB.toFixed(1)}MB > ${maxSizeMB}MB). Please use a smaller file to prevent timeout.`);
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
        
        // STRICTER: More conservative memory limits to prevent Chrome timeouts
        const totalPixels = gif.lsd.width * gif.lsd.height * frames.length;
        const estimatedMemoryMB = (totalPixels * 4) / (1024 * 1024); // 4 bytes per pixel (RGBA)
        const maxMemoryMB = isUploadedFile ? 150 : 100; // Much more conservative memory limits
        
        if (estimatedMemoryMB > maxMemoryMB) {
          throw new Error(`GIF_TOO_COMPLEX: GIF is too complex (${frames.length} frames, ${gif.lsd.width}x${gif.lsd.height}). Estimated memory: ${estimatedMemoryMB.toFixed(1)}MB > ${maxMemoryMB}MB. Please use a simpler GIF to prevent timeout.`);
        }
        
        // Additional frame count limit to prevent excessive processing time
        if (frames.length > 200) {
          throw new Error(`GIF_TOO_MANY_FRAMES: GIF has too many frames (${frames.length} > 200). Please use a GIF with fewer frames to prevent timeout.`);
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
               /data:image\/gif/i.test(url);
        // REMOVED: || url.includes('gif') - this was too broad and caught static images
      };

      const isWebMUrl = (url: string): boolean => {
        return /\.webm$/i.test(url) || 
               /data:video\/webm/i.test(url);
        // REMOVED: || url.includes('webm') - this was too broad and caught static images
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

      // 🚀 NEW: Helper function to create animated spritesheet textures for videos
      const createSpritesheetTexture = async (spritesheetUrl: string, metadata: {
        cols: number; rows: number; frameWidth: number; frameHeight: number; frameCount: number; fps: number;
      }): Promise<THREE.Texture | null> => {
        console.log('🎞️ Creating spritesheet texture:', metadata);
        
        try {
          // Load the spritesheet image
          const spritesheetImg = document.createElement('img');
          spritesheetImg.crossOrigin = 'anonymous';
          spritesheetImg.src = spritesheetUrl;
          
          await new Promise((resolve, reject) => {
            spritesheetImg.onload = resolve;
            spritesheetImg.onerror = (error) => {
              console.error('❌ Failed to load spritesheet:', error);
              reject(new Error('Failed to load spritesheet image'));
            };
          });
          
          // Create canvas for extracting individual frames
          const canvas = document.createElement('canvas');
          canvas.width = metadata.frameWidth;
          canvas.height = metadata.frameHeight;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Failed to get canvas 2D context');
          }
          
          // Create CanvasTexture
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = false;
          
          // Add animation metadata to userData
          texture.userData = {
            isSpritesheetVideo: true,
            spritesheet: spritesheetImg,
            metadata: metadata,
            currentFrame: 0,
            update: (frame?: number) => {
              const totalFrames = metadata.frameCount;
              const currentFrame = (frame !== undefined ? frame : texture.userData.currentFrame) % totalFrames;
              
              // Update internal frame counter if using internal animation
              if (frame === undefined) {
                texture.userData.currentFrame = (texture.userData.currentFrame + 1) % totalFrames;
              }
              
              // Calculate spritesheet position
              const col = currentFrame % metadata.cols;
              const row = Math.floor(currentFrame / metadata.cols);
              
              const sourceX = col * metadata.frameWidth;
              const sourceY = row * metadata.frameHeight;
              
              // Clear canvas and draw the current frame
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(
                spritesheetImg,
                sourceX, sourceY, metadata.frameWidth, metadata.frameHeight,
                0, 0, canvas.width, canvas.height
              );
              
              texture.needsUpdate = true;
            }
          };
          
          // Initialize with first frame
          texture.userData.update(0);
          
          console.log('✅ Spritesheet texture created successfully');
          return texture;
          
        } catch (error) {
          console.error('❌ Failed to create spritesheet texture:', error);
          return null;
        }
      };

      // Apply front overlay (FIXED: use overlayUrl directly with enhanced type detection)
      if (settings.overlayUrl) {
        console.log('🖼️ Applying front overlay');
        
        let overlayTexture: THREE.Texture | null = null;
        const textureType = detectTextureType(settings.overlayUrl);
        
        console.log(`🔍 Detected overlay texture type: ${textureType} for URL: ${settings.overlayUrl.substring(0, 50)}...`);
        
        // 🚀 NEW: Check for video spritesheet metadata
        if ((settings as any).overlaySpritesheet) {
          console.log('🎞️ Processing video overlay spritesheet...');
          const spritesheetData = (settings as any).overlaySpritesheet;
          console.log('📊 Overlay spritesheet metadata:', spritesheetData);
          
          overlayTexture = await createSpritesheetTexture(
            settings.overlayUrl, // This is now the spritesheet data URL
            spritesheetData
          );
          
          if (overlayTexture) {
            console.log('✅ Video spritesheet overlay applied');
          } else {
            console.warn('⚠️ Video spritesheet overlay processing failed, using static fallback');
            overlayTexture = await loadImageTexture(settings.overlayUrl);
          }
        } else if (textureType === 'gif') {
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
            overlayTopGlow.material.setGlowParams(
              settings.overlayGlowIntensity || 3.2, // ENHANCED: Boost from 2.8 to 3.2 for better visibility
              0.0, // Threshold always 0 as requested
              settings.overlayGlowSharpness || 0.7
            );
            overlayTopGlow.visible = !!settings.overlayGlow;
            
            console.log('🔍 DEBUG: Overlay glow (dual mode):', { 
              overlayGlowEnabled: !!settings.overlayGlow,
              intensity: settings.overlayGlowIntensity || 3.2, // Updated debug message
              sharpness: settings.overlayGlowSharpness || 0.7,
              overlayTopGlowVisible: overlayTopGlow.visible
            });
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
            overlayTopGlow.material.setGlowParams(
              settings.overlayGlowIntensity || 3.2, // ENHANCED: Boost from 2.8 to 3.2 for better visibility
              0.0, // Threshold always 0 as requested
              settings.overlayGlowSharpness || 0.7
            );
            
            // FIXED: Create separate non-flipped texture for bottom glow
            let bottomGlowTexture;
            if (overlayTexture instanceof THREE.CanvasTexture) {
              bottomGlowTexture = new THREE.CanvasTexture(overlayTexture.image);
              bottomGlowTexture.colorSpace = THREE.SRGBColorSpace;
              bottomGlowTexture.flipY = true; // Keep flipY for proper orientation
              bottomGlowTexture.wrapS = THREE.ClampToEdgeWrapping; // FIXED: Don't flip glow texture
              bottomGlowTexture.needsUpdate = true;
              bottomGlowTexture.userData = overlayTexture.userData; // Share animation state
            } else {
              bottomGlowTexture = overlayTexture.clone();
              bottomGlowTexture.flipY = true; // Keep flipY for proper orientation  
              bottomGlowTexture.wrapS = THREE.ClampToEdgeWrapping; // FIXED: Don't flip glow texture
              bottomGlowTexture.needsUpdate = true;
            }
            
            // Apply transformations to glow texture
            applyTextureTransformations(
              bottomGlowTexture,
              settings.overlayRotation || 0,
              settings.overlayScale || 1,
              settings.overlayOffsetX || 0,
              settings.overlayOffsetY || 0
            );
            
            overlayBotGlow.material.updateGlowSource(bottomGlowTexture, new THREE.Color(0xffffff));
            overlayBotGlow.material.setGlowParams(
              settings.overlayGlowIntensity || 3.2, // ENHANCED: Boost from 2.8 to 3.2 for better visibility
              0.0, // Threshold always 0 as requested
              settings.overlayGlowSharpness || 0.7
            );
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
        
        // 🚀 NEW: Check for video spritesheet metadata
        if ((settings as any).overlaySpritesheet2) {
          console.log('🎞️ Processing video back overlay spritesheet...');
          const spritesheetData = (settings as any).overlaySpritesheet2;
          console.log('📊 Back overlay spritesheet metadata:', spritesheetData);
          
          overlayTexture = await createSpritesheetTexture(
            settings.overlayUrl2, // This is now the spritesheet data URL
            spritesheetData
          );
          
          if (overlayTexture) {
            console.log('✅ Video spritesheet back overlay applied');
          } else {
            console.warn('⚠️ Video spritesheet back overlay processing failed, using static fallback');
            overlayTexture = await loadImageTexture(settings.overlayUrl2);
          }
        } else if (textureType === 'gif') {
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
          
          // FIXED: Create separate non-flipped texture for bottom glow in dual mode
          let bottomGlowTexture;
          if (overlayTexture instanceof THREE.CanvasTexture) {
            bottomGlowTexture = new THREE.CanvasTexture(overlayTexture.image);
            bottomGlowTexture.colorSpace = THREE.SRGBColorSpace;
            bottomGlowTexture.flipY = false; // Match dual mode orientation
            bottomGlowTexture.wrapS = THREE.ClampToEdgeWrapping; // FIXED: Don't flip glow texture
            bottomGlowTexture.needsUpdate = true;
            bottomGlowTexture.userData = overlayTexture.userData; // Share animation state
          } else {
            bottomGlowTexture = overlayTexture.clone();
            bottomGlowTexture.flipY = false; // Match dual mode orientation
            bottomGlowTexture.wrapS = THREE.ClampToEdgeWrapping; // FIXED: Don't flip glow texture  
            bottomGlowTexture.needsUpdate = true;
          }
          
          // Apply transformations to glow texture
          applyTextureTransformations(
            bottomGlowTexture,
            settings.overlayRotation || 0,
            settings.overlayScale || 1,
            settings.overlayOffsetX || 0,
            settings.overlayOffsetY || 0
          );
          
          // Update bottom overlay glow for dual mode
          overlayBotGlow.material.updateGlowSource(bottomGlowTexture, new THREE.Color(0xffffff));
          overlayBotGlow.material.setGlowParams(
            settings.overlayGlowIntensity || 3.2, // ENHANCED: Boost from 2.8 to 3.2 for better visibility
            0.0, // Threshold always 0 as requested
            settings.overlayGlowSharpness || 0.7
          );
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
          
          // 🚀 NEW: Check for video spritesheet metadata
          if ((settings as any).bodyTextureSpritesheet) {
            console.log('🎞️ Processing video body texture spritesheet...');
            const spritesheetData = (settings as any).bodyTextureSpritesheet;
            console.log('📊 Spritesheet metadata:', spritesheetData);
            
            bodyTexture = await createSpritesheetTexture(
              settings.bodyTextureUrl, // This is now the spritesheet data URL
              spritesheetData
            );
            
            if (bodyTexture) {
              console.log('✅ Video spritesheet body texture applied');
            } else {
              console.warn('⚠️ Video spritesheet processing failed, using static fallback');
              bodyTexture = await loadImageTexture(settings.bodyTextureUrl);
            }
          } else if (textureType === 'gif') {
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
            // CRITICAL: Set glow visibility BEFORE applying parameters (texture mode)
            cylinderGlow.visible = !!settings.bodyGlow;
            topGlow.visible = !!settings.bodyGlow;
            bottomGlow.visible = !!settings.bodyGlow;
            
            console.log('🔍 DEBUG: Applying body glow params (texture):', { 
              bodyGlowEnabled: !!settings.bodyGlow,
              intensity: settings.bodyGlowIntensity || 2.2,
              sharpness: settings.bodyGlowSharpness || 0.6,
              cylinderGlowVisible: cylinderGlow.visible,
              topGlowVisible: topGlow.visible,
              bottomGlowVisible: bottomGlow.visible
            });
            
            cylinderGlow.material.updateGlowSource(rimTexture, new THREE.Color('#ffffff'));
            cylinderGlow.material.setGlowParams(
              settings.bodyGlowIntensity || 2.2, 
              0.0, // Threshold always 0 as requested
              settings.bodyGlowSharpness || 0.6
            );
            topGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
            topGlow.material.setGlowParams(
              settings.bodyGlowIntensity || 2.2, 
              0.0, // Threshold always 0 as requested
              settings.bodyGlowSharpness || 0.6
            );
            bottomGlow.material.updateGlowSource(faceTexture, new THREE.Color('#ffffff'));
            bottomGlow.material.setGlowParams(
              settings.bodyGlowIntensity || 2.2, 
              0.0, // Threshold always 0 as requested
              settings.bodyGlowSharpness || 0.6
            );
            
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
      
      console.log(`🎬 Starting segmented frame capture: frames ${startFrame} to ${endFrame} (${endFrame - startFrame} frames to render)`);
      const startTime = Date.now();
      
      for (let i = startFrame; i < endFrame; i++) {
        // Check for timeout every 10 frames to prevent Lambda timeout (only after rendering some frames)
        if (i > startFrame && (i - startFrame) % 10 === 0) {
          const elapsed = Date.now() - startTime;
          if (elapsed > 22000) { // 22s timeout (8s buffer before 30s Lambda limit) - reduced for smaller segments
            console.warn(`⚠️ Approaching timeout at frame ${i}/${endFrame}, stopping capture`);
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

        // Update animated GIF textures and video spritesheets (identical to client-side animation loop)
        if (overlayTop.material && overlayTop.material.map && overlayTop.material.map.userData?.update) {
          // Pass current frame for spritesheet animation
          if (overlayTop.material.map.userData.isSpritesheetVideo) {
            overlayTop.material.map.userData.update(i); // Pass frame index for video animation
          } else {
            overlayTop.material.map.userData.update();
          }
        }
        if (overlayBot.material && overlayBot.material.map && overlayBot.material.map.userData?.update) {
          // Pass current frame for spritesheet animation
          if (overlayBot.material.map.userData.isSpritesheetVideo) {
            overlayBot.material.map.userData.update(i); // Pass frame index for video animation
          } else {
            overlayBot.material.map.userData.update();
          }
        }
        
        // Update animated body texture and video spritesheets (if any)
        if (rimMat.map && rimMat.map.userData?.update) {
          // Pass current frame for spritesheet animation
          if (rimMat.map.userData.isSpritesheetVideo) {
            rimMat.map.userData.update(i); // Pass frame index for video animation
          } else {
            rimMat.map.userData.update();
          }
        }
        if (faceMat.map && faceMat.map.userData?.update && faceMat.map !== rimMat.map) {
          // Pass current frame for spritesheet animation
          if (faceMat.map.userData.isSpritesheetVideo) {
            faceMat.map.userData.update(i); // Pass frame index for video animation
          } else {
            faceMat.map.userData.update();
          }
        }

        // Render frame
        renderer.render(scene, camera);

        // Capture as WebP blob (High quality with proper downscaling)
        const frameBlob = await new Promise<Blob>((resolve) => {
          const canvas = renderer.domElement;
          
          // Capture at 200px for high quality
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
        
        // High-quality downscaling from 200px to 100px using canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        
        // Enable high-quality image smoothing
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
        // Load the WebP blob into an image
        const frameUrl = URL.createObjectURL(frameBlob);
        const img = new Image();
        img.src = frameUrl;
        
        await new Promise(resolve => {
          img.onload = () => {
            // High-quality downscaling
            tempCtx.drawImage(img, 0, 0, 200, 200, 0, 0, 100, 100);
            URL.revokeObjectURL(frameUrl); // Clean up
            resolve(undefined);
          };
        });
        
        // Convert downscaled canvas to WebP blob
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
        
        // Convert blob to base64 for return
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

    }, { ...request, settings: processedSettings }, startFrame, endFrame),
    
    // Timeout promise to prevent hanging
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Page evaluation timeout after ${pageTimeout}ms`)), pageTimeout)
    )
  ]);
  
      console.log('✅ Browser page evaluation completed successfully');
    } catch (evalError) {
      console.error('❌ Page evaluation failed:', evalError);
      throw new Error(`Frame rendering failed: ${evalError instanceof Error ? evalError.message : 'Unknown evaluation error'}`);
    }

    console.log(`✅ Server-side rendering complete: ${framesBase64.length} frames captured`);

    // Calculate next start frame for segmented rendering
    const nextStartFrame = startFrame + framesBase64.length;
    const isComplete = nextStartFrame >= request.exportSettings.frames;

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
        total_frames: request.exportSettings.frames,
        current_start_frame: startFrame,
        nextStartFrame: isComplete ? null : nextStartFrame,
        is_complete: isComplete,
        rendering_environment: 'headless_chrome_threejs_segmented'
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
