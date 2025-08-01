import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createCanvas, loadImage } from 'canvas';
const WebMWriter = require('webm-writer');

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { frames, fps, width, height, format, codec, alpha } = body;
    
    console.log('🎭 WebM Writer creation request:', {
      frameCount: frames?.length,
      fps,
      dimensions: `${width}x${height}`,
      format,
      codec,
      alpha,
      telegramCompliant: {
        size: width === 100 && height === 100,
        duration: frames && fps ? `${(frames.length / fps).toFixed(1)}s` : 'unknown',
        fps: fps <= 30
      }
    });

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No frames provided' })
      };
    }

    // Telegram requirements validation
    if (width !== 100 || height !== 100) {
      console.warn(`⚠️ Telegram emoji requires 100x100px, got ${width}x${height}`);
    }
    
    const durationSeconds = frames.length / fps;
    if (durationSeconds > 3) {
      console.warn(`⚠️ Telegram emoji max 3 seconds, got ${durationSeconds.toFixed(2)}s`);
    }
    
    if (fps > 30) {
      console.warn(`⚠️ Telegram emoji max 30 FPS, got ${fps}`);
    }

    console.log('🎬 Creating WebM using webm-writer...');

    // Create WebM writer with Telegram-optimized settings
    const videoWriter = new WebMWriter({
      quality: 0.8, // Good quality but small file size
      fileWriter: null, // Write to memory
      fd: null,
      frameDuration: Math.round(1000 / fps), // Frame duration in ms
      transparent: true // Enable transparency for emoji
    });

    console.log('📸 Processing frames...');
    
    for (let i = 0; i < frames.length; i++) {
      try {
        // Convert base64 to buffer
        const frameBuffer = Buffer.from(frames[i], 'base64');
        
        // Create canvas and load image
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, width, height);
        
        // Load and draw the PNG image
        const img = await loadImage(frameBuffer);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Add frame to WebM writer
        videoWriter.addFrame(canvas);
        
        if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
          console.log(`✅ Added frame ${i + 1}/${frames.length} to WebM`);
        }
        
      } catch (frameError) {
        console.error(`❌ Error processing frame ${i}:`, frameError);
        // Continue with other frames
      }
    }

    console.log('🎬 Finalizing WebM...');
    
    // Complete the WebM and get the data
    const webmBlob = await new Promise((resolve, reject) => {
      videoWriter.complete()
        .then((webmBlob: Blob) => {
          resolve(webmBlob);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });

    // Convert blob to buffer and then to base64
    const webmBuffer = Buffer.from(await (webmBlob as Blob).arrayBuffer());
    const base64WebM = webmBuffer.toString('base64');
    
    console.log(`📊 WebM created: ${webmBuffer.length} bytes`);
    
    // Validate Telegram requirements
    const telegramCompliant = {
      size: webmBuffer.length <= 256 * 1024, // 256KB limit
      duration: durationSeconds <= 3,
      dimensions: width === 100 && height === 100,
      fps: fps <= 30
    };
    
    if (!telegramCompliant.size) {
      console.warn(`⚠️ WebM size ${webmBuffer.length} bytes exceeds Telegram limit of 256KB`);
    }
    
    console.log('✅ WebM Writer completed:', {
      totalSize: webmBuffer.length,
      frames: frames.length,
      duration: `${(durationSeconds * 1000).toFixed(0)}ms`,
      fps,
      dimensions: `${width}x${height}`,
      withinLimits: telegramCompliant
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        webm_base64: base64WebM,
        size: webmBuffer.length,
        codec: 'vp8', // webm-writer uses VP8
        frames_processed: frames.length,
        duration_ms: Math.round(durationSeconds * 1000),
        telegram_compliant: telegramCompliant,
        message: 'WebM created using webm-writer with proper VP8 encoding'
      }),
    };

  } catch (error) {
    console.error('❌ WebM Writer creation failed:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
