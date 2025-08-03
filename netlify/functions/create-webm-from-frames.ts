import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { frames_base64, frame_format, settings } = JSON.parse(event.body || '{}');
    
    if (!frames_base64 || !Array.isArray(frames_base64) || frames_base64.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No frames provided' }),
      };
    }

    if (!settings || !settings.fps || !settings.duration) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing settings (fps, duration required)' }),
      };
    }

    console.log(`Creating WebM from ${frames_base64.length} ${frame_format} frames`);
    console.log('Settings:', settings);

    // Create temporary directory for frame files
    const { execSync } = await import('child_process');
    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    
    // Check if FFmpeg is available
    try {
      execSync('ffmpeg -version', { stdio: 'pipe', timeout: 5000 });
      console.log('FFmpeg is available');
    } catch (ffmpegError) {
      console.error('FFmpeg not available:', ffmpegError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'FFmpeg not available in serverless environment. Try client-side conversion.',
          method: 'server-side-ffmpeg',
          suggestion: 'Use client-side MediaRecorder fallback'
        }),
      };
    }
    
    const tempDir = join(tmpdir(), `webm-creation-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    try {
      // Write frames to temporary files
      console.log('Writing frames to temporary files...');
      for (let i = 0; i < frames_base64.length; i++) {
        const frameNumber = String(i).padStart(4, '0');
        const frameData = Buffer.from(frames_base64[i], 'base64');
        const frameFile = join(tempDir, `frame_${frameNumber}.${frame_format}`);
        await fs.writeFile(frameFile, frameData);
      }
      
      // Use FFmpeg to create WebM from frames
      const outputFile = join(tempDir, 'output.webm');
      const inputPattern = join(tempDir, `frame_%04d.${frame_format}`);
      
      // FFmpeg command for WebM creation with transparency
      // Using VP9 codec with alpha support and proper frame rate
      const ffmpegCmd = [
        'ffmpeg',
        '-y', // Overwrite output
        '-framerate', settings.fps.toString(),
        '-i', inputPattern,
        '-c:v', 'libvpx-vp9', // VP9 codec
        '-pix_fmt', 'yuva420p', // Pixel format with alpha support
        '-crf', '30', // Quality setting (lower = better quality)
        '-b:v', '1M', // Bitrate
        '-auto-alt-ref', '0', // Disable alt-ref frames for better emoji compatibility
        '-lag-in-frames', '0', // Reduce encoding delay
        '-deadline', 'good', // Encoding speed vs quality
        '-cpu-used', '2', // Speed setting
        '-t', settings.duration.toString(), // Duration
        outputFile
      ].join(' ');
      
      console.log('Running FFmpeg command:', ffmpegCmd);
      
      // Execute FFmpeg
      execSync(ffmpegCmd, { 
        cwd: tempDir,
        stdio: 'pipe',
        timeout: 30000 // 30 second timeout
      });
      
      // Check if output file was created
      const outputStats = await fs.stat(outputFile);
      if (!outputStats.isFile() || outputStats.size === 0) {
        throw new Error('FFmpeg failed to create WebM file');
      }
      
      console.log(`WebM created successfully: ${outputStats.size} bytes`);
      
      // Read the WebM file and convert to base64
      const webmBuffer = await fs.readFile(outputFile);
      const webmBase64 = webmBuffer.toString('base64');
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          webm_base64: webmBase64,
          size: webmBuffer.length,
          frames_processed: frames_base64.length,
          codec: 'libvpx-vp9',
          pixel_format: 'yuva420p',
          transparency: true,
          method: 'server-side-ffmpeg'
        }),
      };
      
    } finally {
      // Clean up temporary files
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log('Cleaned up temporary directory');
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary directory:', cleanupError);
      }
    }
    
  } catch (error) {
    console.error('WebM creation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during WebM creation',
        method: 'server-side-ffmpeg'
      }),
    };
  }
};

export { handler };
