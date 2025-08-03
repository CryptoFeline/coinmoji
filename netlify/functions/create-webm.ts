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

    console.log('🎬 Creating WebM on server:', {
      frames: request.frames_base64.length,
      fps: request.fps,
      duration: request.duration,
      size: request.size,
      format: request.frame_format || 'webp'
    });

    // Use FFmpeg.wasm on server side - should have more memory than browser
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');

    console.log('📦 Initializing FFmpeg.wasm on server...');
    const ffmpeg = new FFmpeg();
    
    // Add comprehensive logging for debugging
    ffmpeg.on('log', ({ message }) => {
      console.log('🔧 FFmpeg server log:', message);
    });

    ffmpeg.on('progress', ({ progress, time }) => {
      console.log(`� FFmpeg progress: ${Math.round(progress * 100)}% (${time}s)`);
    });

    await ffmpeg.load();
    console.log('✅ FFmpeg.wasm loaded on server with more memory allocation');

    try {
      // Write frames to FFmpeg.wasm filesystem
      console.log('📝 Writing frames to FFmpeg.wasm filesystem...');
      for (let i = 0; i < request.frames_base64.length; i++) {
        const frameBuffer = Buffer.from(request.frames_base64[i], 'base64');
        const extension = request.frame_format || 'webp';
        const filename = `frame${String(i).padStart(4, '0')}.${extension}`;
        
        // Convert Buffer to Uint8Array for FFmpeg.wasm
        const frameData = new Uint8Array(frameBuffer);
        await ffmpeg.writeFile(filename, frameData);
      }

      console.log('🔧 Converting frames to WebM with VP9...');

      // Create WebM using FFmpeg.wasm with VP9 and alpha support 
      // Server-optimized settings: balance quality vs memory usage
      await ffmpeg.exec([
        '-framerate', request.fps.toString(),
        '-i', `frame%04d.${request.frame_format || 'webp'}`,
        '-pix_fmt', 'yuva420p',      // VP9 with alpha channel
        '-c:v', 'libvpx-vp9',        // VP9 codec supports alpha
        '-b:v', '0',                 // CRF mode
        '-crf', '30',                // Good quality balance
        '-auto-alt-ref', '0',        // Preserve alpha channel
        '-lag-in-frames', '0',       // Reduce memory usage
        '-deadline', 'good',         // Good quality/speed balance
        '-cpu-used', '2',            // Balanced encoding speed
        '-row-mt', '1',              // Enable multi-threading
        '-tile-columns', '0',        // Disable tiling to save memory
        '-frame-parallel', '0',      // Disable frame parallelism for alpha
        '-threads', '2',             // Conservative thread count
        '-g', request.frames_base64.length.toString(), // GOP size = frame count
        '-t', request.duration.toString(), // Set duration
        '-y',                        // Overwrite output file
        'output.webm'
      ]);

      // Read the generated WebM file from FFmpeg.wasm filesystem
      console.log('📖 Reading generated WebM file...');
      const webmData = await ffmpeg.readFile('output.webm');
      
      if (!webmData || webmData.length === 0) {
        throw new Error('Generated WebM file is empty');
      }

      console.log(`✅ WebM created successfully: ${webmData.length} bytes`);

      // Clean up FFmpeg.wasm filesystem
      try {
        for (let i = 0; i < request.frames_base64.length; i++) {
          const extension = request.frame_format || 'webp';
          const filename = `frame${String(i).padStart(4, '0')}.${extension}`;
          await ffmpeg.deleteFile(filename);
        }
        await ffmpeg.deleteFile('output.webm');
      } catch (cleanupError) {
        console.warn('Failed to clean up FFmpeg.wasm filesystem:', cleanupError);
      }

      // Convert Uint8Array to base64
      const webmBuffer = Buffer.from(webmData);
      const webmBase64 = webmBuffer.toString('base64');

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          webm_base64: webmBase64,
          size_bytes: webmData.length,
          frames_processed: request.frames_base64.length,
          fps: request.fps,
          duration: request.duration
        }),
      };

    } catch (processingError) {
      console.error('❌ FFmpeg.wasm processing error:', processingError);
      throw processingError;
    }

  } catch (error) {
    console.error('❌ WebM creation error:', error);
    
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
