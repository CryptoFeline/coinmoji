import { Handler } from '@netlify/functions';

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

  try {
    // Parse the request body
    const { frames_base64, settings } = JSON.parse(event.body || '{}');
    
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

    console.log(`📊 Processing ${frames_base64.length} frames with settings:`, settings);

    // Try FFmpeg approach first for real WebM creation
    try {
      console.log('🎬 Attempting FFmpeg server-side WebM creation...');
      
      const fs = require('fs').promises;
      const path = require('path');
      const { spawn } = require('child_process');
      const os = require('os');
      
      // Use ffmpeg-static for Netlify compatibility
      let ffmpegPath: string;
      try {
        const ffmpegStaticPath = require('ffmpeg-static');
        if (!ffmpegStaticPath) {
          throw new Error('ffmpeg-static returned null/undefined path');
        }
        
        // On Netlify, the path might be relative, so check if file exists
        const fs = require('fs');
        
        // Debug: List what's actually available
        try {
          console.log('🔍 Debug - Current working directory:', process.cwd());
          console.log('🔍 Debug - __dirname:', __dirname);
          console.log('🔍 Debug - ffmpeg-static returned path:', ffmpegStaticPath);
          
          // Check if the returned path exists
          const pathExists = fs.existsSync(ffmpegStaticPath);
          console.log('🔍 Debug - ffmpeg-static path exists:', pathExists);
          
          if (pathExists) {
            const stats = fs.statSync(ffmpegStaticPath);
            console.log('🔍 Debug - is file:', stats.isFile(), 'is executable:', !!(stats.mode & parseInt('111', 8)));
          }
        } catch (debugError) {
          console.log('🔍 Debug failed:', debugError);
        }
        
        if (fs.existsSync(ffmpegStaticPath)) {
          ffmpegPath = ffmpegStaticPath;
          console.log('✅ Found ffmpeg-static binary:', ffmpegPath);
        } else {
          // Try alternative paths for Netlify
          const alternativePaths = [
            '/opt/nodejs/node_modules/ffmpeg-static/ffmpeg',
            '/var/task/node_modules/ffmpeg-static/ffmpeg',
            '/var/runtime/node_modules/ffmpeg-static/ffmpeg',
            './node_modules/ffmpeg-static/ffmpeg'
          ];
          
          let foundPath: string | null = null;
          for (const altPath of alternativePaths) {
            if (fs.existsSync(altPath)) {
              foundPath = altPath;
              break;
            }
          }
          
          if (foundPath) {
            ffmpegPath = foundPath;
            console.log('✅ Found ffmpeg-static binary at alternative path:', ffmpegPath);
          } else {
            console.log('❌ ffmpeg-static binary not found at any expected location');
            console.log('Tried paths:', [ffmpegStaticPath, ...alternativePaths]);
            throw new Error('FFmpeg binary file not found');
          }
        }
      } catch (ffmpegStaticError) {
        console.log('❌ ffmpeg-static not available:', ffmpegStaticError);
        throw new Error('FFmpeg binary not available');
      }
      
      // Create temporary directory for frame processing
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'webm-'));
      console.log(`📁 Created temp directory: ${tempDir}`);
      
      try {
        // Save frames as individual PNG files
        console.log(`💾 Saving ${frames_base64.length} frames to disk...`);
        for (let i = 0; i < frames_base64.length; i++) {
          const frameBuffer = Buffer.from(frames_base64[i], 'base64');
          const framePath = path.join(tempDir, `frame_${String(i).padStart(4, '0')}.png`);
          await fs.writeFile(framePath, frameBuffer);
          
          if (i === 0 || i === frames_base64.length - 1 || i % 10 === 0) {
            console.log(`💾 Saved frame ${i + 1}/${frames_base64.length}: ${frameBuffer.length} bytes`);
          }
        }
        
        // Use FFmpeg to create WebM with transparency
        const outputPath = path.join(tempDir, 'output.webm');
        const inputPattern = path.join(tempDir, 'frame_%04d.png');
        
        console.log('🎬 Running FFmpeg to create transparent WebM...');
        
        // FFmpeg command for transparent WebM with VP9 (optimized for alpha)
        const ffmpegArgs = [
          '-y', // Overwrite output file
          '-framerate', settings.fps.toString(),
          '-i', inputPattern,
          '-vf', 'scale=100:100:flags=lanczos', // Scale to emoji size with high-quality scaling
          '-c:v', 'libvpx-vp9',
          '-pix_fmt', 'yuva420p', // Enable alpha channel (CRITICAL)
          '-auto-alt-ref', '0', // Disable alt-ref frames that can break alpha in some decoders
          '-lag-in-frames', '0', // Disable lagged frames for better compatibility
          '-b:v', '0', // Use CRF mode instead of bitrate
          '-crf', '30', // Good quality/size balance (30-40 for ≤256 KB)
          '-t', settings.duration.toString(),
          outputPath
        ];
        
        console.log('📋 FFmpeg command:', [ffmpegPath, ...ffmpegArgs].join(' '));
        
        const ffmpegResult = await new Promise<{ success: boolean; error?: string }>((resolve) => {
          const ffmpeg = spawn(ffmpegPath, ffmpegArgs, {
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: tempDir
          });
          
          let stdout = '';
          let stderr = '';
          
          ffmpeg.stdout.on('data', (data) => {
            stdout += data.toString();
          });
          
          ffmpeg.stderr.on('data', (data) => {
            stderr += data.toString();
          });
          
          ffmpeg.on('close', (code) => {
            if (code === 0) {
              console.log('✅ FFmpeg completed successfully');
              resolve({ success: true });
            } else {
              console.log('❌ FFmpeg failed with code:', code);
              console.log('📄 FFmpeg stderr:', stderr);
              resolve({ success: false, error: `FFmpeg exit code ${code}: ${stderr}` });
            }
          });
          
          ffmpeg.on('error', (error) => {
            console.log('❌ FFmpeg spawn error:', error);
            resolve({ success: false, error: `FFmpeg spawn error: ${error.message}` });
          });
        });
        
        if (!ffmpegResult.success) {
          throw new Error(ffmpegResult.error || 'FFmpeg failed');
        }
        
        // Read the generated WebM file
        const webmBuffer = await fs.readFile(outputPath);
        console.log(`📊 FFmpeg WebM created: ${webmBuffer.length} bytes`);
        
        const webmBase64 = webmBuffer.toString('base64');
        
        // Clean up temp directory
        await fs.rmdir(tempDir, { recursive: true });
        console.log('🧹 Cleaned up temp directory');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            webm_base64: webmBase64,
            size: webmBuffer.length,
            codec: 'VP9 with alpha (FFmpeg)',
            transparency: true,
            method: 'FFmpeg server-side with yuva420p',
            mock: false,
            frames_processed: frames_base64.length,
            alpha_detected: true
          }),
        };
        
      } catch (tempError) {
        // Clean up temp directory on error
        try {
          await fs.rmdir(tempDir, { recursive: true });
        } catch (cleanupError) {
          console.log('⚠️ Temp cleanup failed:', cleanupError);
        }
        throw tempError;
      }
      
    } catch (ffmpegError) {
      console.log('❌ FFmpeg approach failed:', ffmpegError);
      console.log('🔄 Falling back to client-side approach (no server-side WebM)...');
      
      // Return error to force client-side webm-muxer with non-alpha codec
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server-side WebM creation failed',
          details: 'FFmpeg not available or failed. Use client-side approach without transparency.',
          fallback_required: true,
          frames_processed: frames_base64.length
        }),
      };
    }

  } catch (error) {
    console.error('❌ Server WebM creation failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server WebM creation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
};