import { Handler } from '@netlify/functions';

interface CreateWebMRequest {
  frames_base64: string[];
  frame_format: 'webp' | 'png';
  fps: number;
  duration: number;
  size: number;
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const request: CreateWebMRequest = JSON.parse(event.body || '{}');
    
    // Validate request
    if (!request.frames_base64 || !Array.isArray(request.frames_base64) || request.frames_base64.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid frames_base64 array' }),
      };
    }

    if (!request.fps || !request.duration || !request.size) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fps, duration, or size parameters' }),
      };
    }

    console.log('🎬 Creating WebM on server with Node.js approach:', {
      frames: request.frames_base64.length,
      fps: request.fps,
      duration: request.duration,
      size: request.size,
      format: request.frame_format || 'webp'
    });

    // Use fluent-ffmpeg with system FFmpeg (if available) or fallback approach
    const ffmpeg = require('fluent-ffmpeg');
    const fs = require('fs').promises;
    const path = require('path');
    const { v4: uuidv4 } = require('uuid');

    // Create temporary directory for processing
    const tempDir = `/tmp/webm-${uuidv4()}`;
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Write frames to temporary files
      console.log('📝 Writing frames to temporary directory...');
      for (let i = 0; i < request.frames_base64.length; i++) {
        const frameBuffer = Buffer.from(request.frames_base64[i], 'base64');
        const extension = request.frame_format || 'webp';
        const framePath = path.join(tempDir, `frame${String(i).padStart(4, '0')}.${extension}`);
        await fs.writeFile(framePath, frameBuffer);
      }

      // Output file path
      const outputPath = path.join(tempDir, 'output.webm');

      console.log('🔧 Converting frames to WebM with native FFmpeg...');

      // Create WebM using native FFmpeg with VP9 and alpha support
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(path.join(tempDir, `frame%04d.${request.frame_format || 'webp'}`))
          .inputFPS(request.fps)
          .videoCodec('libvpx-vp9')
          .outputOptions([
            '-pix_fmt yuva420p',      // VP9 with alpha channel
            '-crf 30',                // Good quality
            '-b:v 0',                 // CRF mode
            '-auto-alt-ref 0',        // Preserve alpha
            '-lag-in-frames 0',       // Reduce latency
            '-deadline good',         // Good quality/speed balance
            '-cpu-used 2',            // Good quality encoding
            '-row-mt 1',              // Multi-threading
            '-tile-columns 0',        // No tiling for small frames
            '-frame-parallel 0',      // Disable frame parallelism for alpha
            `-t ${request.duration}`, // Set duration
            '-y'                      // Overwrite output file
          ])
          .output(outputPath)
          .on('start', (commandLine) => {
            console.log('🚀 FFmpeg command:', commandLine);
          })
          .on('progress', (progress) => {
            if (progress.percent) {
              console.log(`📊 Progress: ${Math.round(progress.percent)}%`);
            }
          })
          .on('end', () => {
            console.log('✅ WebM conversion completed');
            resolve(true);
          })
          .on('error', (err) => {
            console.error('❌ FFmpeg error:', err);
            reject(err);
          })
          .run();
      });

      // Read the generated WebM file
      console.log('📖 Reading generated WebM file...');
      const webmBuffer = await fs.readFile(outputPath);
      
      if (webmBuffer.length === 0) {
        throw new Error('Generated WebM file is empty');
      }

      console.log(`✅ WebM created successfully: ${webmBuffer.length} bytes`);

      // Clean up temporary files
      await fs.rmdir(tempDir, { recursive: true });

      // Return the WebM as base64
      const webmBase64 = webmBuffer.toString('base64');

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          webm_base64: webmBase64,
          size_bytes: webmBuffer.length,
          frames_processed: request.frames_base64.length,
          fps: request.fps,
          duration: request.duration
        }),
      };

    } catch (processingError) {
      // Clean up on error
      try {
        await fs.rmdir(tempDir, { recursive: true });
      } catch (cleanupError) {
        console.warn('Failed to clean up temp directory:', cleanupError);
      }
      throw processingError;
    }

  } catch (error) {
    console.error('❌ WebM creation error:', error);
    
    // If native FFmpeg is not available, provide fallback guidance
    if (error instanceof Error && (error.message.includes('Cannot find ffmpeg') || error.message.includes('ffmpeg'))) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'FFmpeg not available in serverless environment',
          details: 'Server-side WebM creation requires FFmpeg installation',
          fallback_suggestion: 'Consider using browser-based WebM creation with reduced frames or external conversion tools'
        }),
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Server-side WebM creation failed'
      }),
    };
  }
};
