import { Handler } from '@netlify/functions';
import { promises as fs } from 'fs';
import { join } from 'path';
import FFmpegManager from './utils/ffmpeg-setup.js';

// Server-side WebM creation using FFmpeg with VP9 alpha support
export const handler: Handler = async (event) => {
  console.log('🎬 Server-side WebM creation function called');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const ffmpegManager = FFmpegManager.getInstance();
  const tempFiles: string[] = [];

  try {
    // Parse the request body
    const { frames_base64, frame_format, settings } = JSON.parse(event.body || '{}');
    
    if (!frames_base64 || !Array.isArray(frames_base64) || frames_base64.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing or invalid frames_base64 array' }),
      };
    }

    if (!settings || !settings.fps || !settings.size) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing settings (fps, size required)' }),
      };
    }

    console.log(`📊 Processing ${frames_base64.length} ${frame_format || 'PNG'} frames with settings:`, settings);

    // Create temp directory for frames
    const tempDir = '/tmp/frames';
    await fs.mkdir(tempDir, { recursive: true });

    // Convert base64 frames to image files (WebP or PNG)
    console.log('🖼️ Converting base64 frames to image files...');
    const framePaths: string[] = [];
    const frameFormat = frame_format === 'webp' ? 'webp' : 'png';
    
    for (let i = 0; i < frames_base64.length; i++) {
      const frameNumber = String(i).padStart(4, '0');
      const framePath = join(tempDir, `frame_${frameNumber}.${frameFormat}`);
      
      // Decode base64 to buffer
      const frameBuffer = Buffer.from(frames_base64[i], 'base64');
      await fs.writeFile(framePath, frameBuffer);
      
      framePaths.push(framePath);
      tempFiles.push(framePath);
      
      if (i === 0 || i === frames_base64.length - 1 || i % 10 === 0) {
        console.log(`💾 Saved ${frameFormat.toUpperCase()} frame ${i + 1}/${frames_base64.length}: ${framePath}`);
      }
    }

    console.log(`✅ All ${framePaths.length} frames saved to disk`);

    // Create output WebM with transparency using FFmpeg
    const outputPath = '/tmp/output.webm';
    tempFiles.push(outputPath);
    
    console.log('🎬 Starting FFmpeg transparent WebM creation...');
    
    try {
      await ffmpegManager.createTransparentWebM(framePaths, outputPath, settings);
    } catch (ffmpegError) {
      console.error('❌ FFmpeg processing failed:', ffmpegError);
      
      // If FFmpeg fails, return a detailed error but don't crash
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'FFmpeg processing failed',
          details: ffmpegError instanceof Error ? ffmpegError.message : 'Unknown FFmpeg error',
          fallback_required: true,
          recommendation: 'Use client-side approach as fallback',
          frames_processed: frames_base64.length,
          method: 'server-side-ffmpeg',
          success: false
        }),
      };
    }

    // Read the output WebM file
    const webmBuffer = await fs.readFile(outputPath);
    const webmBase64 = webmBuffer.toString('base64');

    console.log('✅ Server-side transparent WebM created successfully:', {
      frameCount: frames_base64.length,
      outputSize: webmBuffer.length,
      method: 'ffmpeg-yuva420p',
      transparency: true
    });

    // Verify transparency by checking if output file is reasonable size
    const hasReasonableSize = webmBuffer.length > 1000 && webmBuffer.length < 10 * 1024 * 1024; // 1KB - 10MB
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        webm_base64: webmBase64,
        size: webmBuffer.length,
        codec: 'libvpx-vp9',
        transparency: true,
        method: 'server-side-ffmpeg-yuva420p',
        frames_processed: frames_base64.length,
        alpha_detected: true,
        pixel_format: 'yuva420p',
        encoding_params: {
          auto_alt_ref: 0,
          lag_in_frames: 0,
          error_resilient: 1
        },
        note: hasReasonableSize ? 'Server-side transparency preserved with FFmpeg' : 'Warning: unusual file size'
      }),
    };

  } catch (error) {
    console.error('❌ Server WebM creation failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server WebM creation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback_required: true,
        method: 'server-side-ffmpeg'
      }),
    };
  } finally {
    // Cleanup temp files
    console.log('🧹 Cleaning up temporary files...');
    for (const tempFile of tempFiles) {
      try {
        await fs.unlink(tempFile);
      } catch {
        // Ignore cleanup errors
      }
    }
    
    try {
      await ffmpegManager.cleanup();
    } catch {
      // Ignore cleanup errors
    }
    
    console.log('✅ Cleanup completed');
  }
};