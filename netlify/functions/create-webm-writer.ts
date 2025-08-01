import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createCanvas, loadImage, Image } from 'canvas';
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
      quality: 0.9, // Higher quality for better results
      fileWriter: null, // Write to memory
      fd: null,
      frameDuration: Math.round(1000 / fps), // Frame duration in ms
      transparent: true // Enable transparency for emoji
    });

    console.log('📸 Processing frames...');
    
    let successfulFrames = 0;
    
    for (let i = 0; i < frames.length; i++) {
      try {
        // Convert base64 to buffer - handle both PNG and WebP formats
        const frameBuffer = Buffer.from(frames[i], 'base64');
        
        // Detect format based on magic bytes
        let isValidFormat = false;
        let formatType = 'unknown';
        
        // Check for PNG format (magic bytes: 89504e470d0a1a0a)
        if (frameBuffer.length >= 8 && frameBuffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
          isValidFormat = true;
          formatType = 'PNG';
        }
        // Check for WebP format (RIFF...WEBP)
        else if (frameBuffer.length >= 12 && 
                 frameBuffer.toString('ascii', 0, 4) === 'RIFF' &&
                 frameBuffer.toString('ascii', 8, 12) === 'WEBP') {
          isValidFormat = true;
          formatType = 'WebP';
        }
        
        if (!isValidFormat) {
          console.error(`❌ Frame ${i} is not a valid PNG or WebP (buffer size: ${frameBuffer.length})`);
          continue;
        }
        
        console.log(`🖼️ Frame ${i}: ${formatType} format detected (${frameBuffer.length} bytes)`);
        
        // Load the image directly from buffer (supports both PNG and WebP)
        const img = await loadImage(frameBuffer);
        
        // Verify image loaded correctly
        if (!img || img.width === 0 || img.height === 0) {
          console.error(`❌ Frame ${i} failed to load properly`);
          continue;
        }
        
        console.log(`✅ Frame ${i}: ${img.width}x${img.height} ${formatType} loaded successfully`);
        
        // Create canvas with exact dimensions
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Set up canvas for transparency - critical for emoji
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw image scaled to exact dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // webm-writer expects Canvas directly
        videoWriter.addFrame(canvas);
        successfulFrames++;
        
        if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
          console.log(`✅ Added frame ${i + 1}/${frames.length} to WebM (${img.width}x${img.height} -> ${width}x${height})`);
        }
        
      } catch (frameError) {
        console.error(`❌ Error processing frame ${i}:`, frameError);
        // Continue with other frames instead of failing completely
      }
    }

    console.log(`📊 Processed ${successfulFrames}/${frames.length} frames successfully`);
    
    if (successfulFrames === 0) {
      throw new Error('No frames were successfully processed');
    }

    console.log('🎬 Finalizing WebM...');
    
    // Complete the WebM and get the data
    const webmBlob = await new Promise((resolve, reject) => {
      videoWriter.complete()
        .then((webmBlob: Blob) => {
          console.log(`📹 WebM blob created: ${webmBlob.size} bytes`);
          resolve(webmBlob);
        })
        .catch((error: Error) => {
          console.error('❌ WebM writer completion failed:', error);
          reject(error);
        });
    });

    // Convert blob to buffer and then to base64
    const webmBuffer = Buffer.from(await (webmBlob as Blob).arrayBuffer());
    const base64WebM = webmBuffer.toString('base64');
    
    console.log(`📊 WebM created: ${webmBuffer.length} bytes`);
    
    // Validate minimum WebM file size (should be much larger than 249 bytes)
    if (webmBuffer.length < 1000) {
      console.warn(`⚠️ WebM file suspiciously small: ${webmBuffer.length} bytes`);
    }
    
    // Validate Telegram requirements
    const telegramCompliant = {
      size: webmBuffer.length <= 256 * 1024, // 256KB limit
      duration: durationSeconds <= 3,
      dimensions: width === 100 && height === 100,
      fps: fps <= 30,
      hasFrames: successfulFrames > 0,
      minimumSize: webmBuffer.length >= 1000 // Should be at least 1KB for real video
    };
    
    if (!telegramCompliant.size) {
      console.warn(`⚠️ WebM size ${webmBuffer.length} bytes exceeds Telegram limit of 256KB`);
    }
    
    console.log('✅ WebM Writer completed:', {
      totalSize: webmBuffer.length,
      frames: frames.length,
      successfulFrames,
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
        frames_processed: successfulFrames,
        total_frames: frames.length,
        duration_ms: Math.round(durationSeconds * 1000),
        telegram_compliant: telegramCompliant,
        message: `WebM created using webm-writer: ${successfulFrames}/${frames.length} frames processed`
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
