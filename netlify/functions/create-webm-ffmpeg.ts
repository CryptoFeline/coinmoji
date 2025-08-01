import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
  
  let tempDir: string | null = null;
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { frames, fps, width, height, format, codec, alpha } = body;
    
    console.log('🎭 FFmpeg WebM creation request:', {
      frameCount: frames.length,
      fps,
      dimensions: `${width}x${height}`,
      format,
      codec,
      alpha,
      telegramCompliant: {
        size: width === 100 && height === 100,
        duration: `${(frames.length / fps).toFixed(1)}s`,
        fps: fps <= 30
      }
    });

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

    // Create temporary directory for frame files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'webm-'));
    console.log(`📁 Created temp directory: ${tempDir}`);

    // Save all frames as PNG files
    console.log('💾 Saving frames to disk...');
    for (let i = 0; i < frames.length; i++) {
      const frameData = Buffer.from(frames[i], 'base64');
      const framePath = path.join(tempDir, `frame_${String(i).padStart(4, '0')}.png`);
      fs.writeFileSync(framePath, frameData);
      
      if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
        console.log(`💾 Saved frame ${i + 1}/${frames.length} (${frameData.length} bytes)`);
      }
    }

    // Create WebM using FFmpeg with VP9 and proper transparency
    const outputPath = path.join(tempDir, 'output.webm');
    const inputPattern = path.join(tempDir, 'frame_%04d.png');
    
    console.log('🎬 Running FFmpeg to create VP9 WebM...');
    
    const ffmpegCommand = [
      ffmpegPath,
      '-y', // Overwrite output file
      '-framerate', fps.toString(),
      '-i', inputPattern,
      '-c:v', 'libvpx-vp9', // VP9 codec
      '-pix_fmt', 'yuva420p', // Support transparency
      '-crf', '30', // Quality (lower = better, 0-63)
      '-b:v', '0', // Variable bitrate
      '-deadline', 'realtime', // Fast encoding
      '-cpu-used', '8', // Fastest preset
      '-auto-alt-ref', '0', // Disable alt-ref frames for transparency
      '-lag-in-frames', '0', // No lag for real-time
      '-error-resilient', '1', // Error resilience
      '-f', 'webm', // WebM format
      '-vf', `scale=${width}:${height}`, // Ensure exact dimensions
      '-t', durationSeconds.toString(), // Exact duration
      outputPath
    ].filter(Boolean);
    
    console.log(`🔧 FFmpeg command: ${ffmpegCommand.join(' ')}`);
    
    try {
      execSync(ffmpegCommand.join(' '), { 
        stdio: 'pipe',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      console.log('✅ FFmpeg completed successfully');
    } catch (ffmpegError: any) {
      console.error('❌ FFmpeg error:', ffmpegError.toString());
      throw new Error(`FFmpeg failed: ${ffmpegError.message}`);
    }

    // Read the generated WebM file
    if (!fs.existsSync(outputPath)) {
      throw new Error('FFmpeg did not create output file');
    }

    const webmBuffer = fs.readFileSync(outputPath);
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
    
    console.log('✅ Telegram-compliant WebM created:', {
      totalSize: webmBuffer.length,
      frames: frames.length,
      duration: `${(durationSeconds * 1000).toFixed(0)}ms`,
      fps,
      dimensions: `${width}x${height}`,
      withinLimits: telegramCompliant
    });

    // Convert to base64 for response
    const base64WebM = webmBuffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        webm_base64: base64WebM,
        size: webmBuffer.length,
        codec: 'vp9',
        frames_processed: frames.length,
        duration_ms: Math.round(durationSeconds * 1000),
        telegram_compliant: telegramCompliant
      }),
    };

  } catch (error) {
    console.error('❌ WebM creation failed:', error);
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
  } finally {
    // Clean up temporary files
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`🧹 Cleaned up temp directory: ${tempDir}`);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup temp directory:', cleanupError);
      }
    }
  }
};
