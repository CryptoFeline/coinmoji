import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { webp_base64, quality, fps } = JSON.parse(event.body || '{}');
    
    if (!webp_base64 || typeof webp_base64 !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No WebP data provided' }),
      };
    }
    
    const videoQuality = quality || 80; // Default quality
    const videoFps = fps || 30; // Default FPS

    console.log(`Converting animated WebP to WebM (quality: ${videoQuality}, fps: ${videoFps})`);

    // Check if FFmpeg is available
    const { execSync } = await import('child_process');
    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    
    try {
      execSync('ffmpeg -version', { stdio: 'pipe', timeout: 5000 });
      console.log('FFmpeg is available');
    } catch (ffmpegError) {
      console.error('FFmpeg not available:', ffmpegError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'FFmpeg not available in serverless environment. Install ffmpeg.',
          method: 'server-side-ffmpeg',
          suggestion: 'Install FFmpeg package or use client-side fallback'
        }),
      };
    }
    
    const tempDir = join(tmpdir(), `webp-to-webm-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    try {
      // Write input WebP to temporary file
      const inputFile = join(tempDir, 'input.webp');
      const outputFile = join(tempDir, 'output.webm');
      
      console.log('Writing input WebP file...');
      const webpBuffer = Buffer.from(webp_base64, 'base64');
      await fs.writeFile(inputFile, webpBuffer);
      
      console.log(`Input file size: ${webpBuffer.length} bytes`);
      
      // Build FFmpeg command for WebP to WebM conversion
      // -i: input file
      // -c:v libvpx-vp9: VP9 codec for better quality and transparency support
      // -pix_fmt yuva420p: Pixel format with alpha channel for transparency
      // -crf: Constant Rate Factor (0-63, lower = better quality)
      // -b:v 0: Use CRF instead of target bitrate
      // -r: output frame rate
      // -an: no audio
      // -f webm: force WebM container format
      const crf = Math.max(0, Math.min(63, Math.round((100 - videoQuality) * 0.63))); // Convert quality % to CRF
      
      const ffmpegArgs = [
        'ffmpeg',
        '-i', inputFile,
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-crf', crf.toString(),
        '-b:v', '0',
        '-r', videoFps.toString(),
        '-an',
        '-f', 'webm',
        '-y', // Overwrite output file
        outputFile
      ];
      
      console.log('Running FFmpeg conversion command...');
      console.log('Command:', ffmpegArgs.join(' '));
      console.log(`CRF: ${crf} (from quality ${videoQuality}%)`);
      
      // Execute FFmpeg
      execSync(ffmpegArgs.join(' '), { 
        cwd: tempDir,
        stdio: 'pipe',
        timeout: 60000 // 60 second timeout for video conversion
      });
      
      // Check if output file was created
      const outputStats = await fs.stat(outputFile);
      if (!outputStats.isFile() || outputStats.size === 0) {
        throw new Error('FFmpeg failed to convert WebP to WebM');
      }
      
      console.log(`WebM created successfully: ${outputStats.size} bytes`);
      
      // Read the WebM file and convert to base64
      const webmBuffer = await fs.readFile(outputFile);
      const webmBase64 = webmBuffer.toString('base64');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          webm_base64: webmBase64,
          original_size: webpBuffer.length,
          webm_size: webmBuffer.length,
          quality: videoQuality,
          fps: videoFps,
          crf: crf,
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
    console.error('WebM conversion error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during WebM conversion',
        method: 'server-side-ffmpeg'
      }),
    };
  }
};

export { handler };
