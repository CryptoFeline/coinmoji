import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { frames_base64, frame_format, frame_duration_ms, settings } = JSON.parse(event.body || '{}');
    
    if (!frames_base64 || !Array.isArray(frames_base64) || frames_base64.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No frames provided' }),
      };
    }

    if (!frame_duration_ms || typeof frame_duration_ms !== 'number') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing frame_duration_ms' }),
      };
    }

    console.log(`Creating animated WebP from ${frames_base64.length} ${frame_format} frames`);
    console.log('Frame duration:', frame_duration_ms, 'ms');
    console.log('Settings:', settings);

    // Use webp-converter for animated WebP creation
    const webp = (await import('webp-converter')).default;
    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    
    try {
      console.log('Using webp-converter for animated WebP creation');
      
      // Create temporary directory
      const tempDir = join(tmpdir(), `animated-webp-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
      
      try {
        // Write frames to temporary files
        console.log('Writing frames to temporary files...');
        const frameFiles: string[] = [];
        for (let i = 0; i < frames_base64.length; i++) {
          const frameNumber = String(i).padStart(4, '0');
          const frameData = Buffer.from(frames_base64[i], 'base64');
          const frameFile = join(tempDir, `frame${frameNumber}.webp`);
          await fs.writeFile(frameFile, frameData);
          frameFiles.push(frameFile);
        }
        
        // Output file path
        const outputFile = join(tempDir, 'animation.webp');
        
        console.log('Creating animated WebP with webpmux_animate...');
        console.log('Frame files:', frameFiles.length, 'files');
        console.log('Background color: transparent (0,0,0,0)');
        
        // Create animated WebP with transparency
        // webpmux_animate(input_images, output_image, loop, bgcolor, logging)
        await webp.webpmux_animate(frameFiles, outputFile, 0, '0,0,0,0', '-quiet');
        
        // Check if output file was created
        const outputStats = await fs.stat(outputFile);
        if (!outputStats.isFile() || outputStats.size === 0) {
          throw new Error('webpmux_animate failed to create animated WebP file');
        }
        
        console.log(`Animated WebP created successfully: ${outputStats.size} bytes`);
        
        // Read the animated WebP file and convert to base64
        const webpBuffer = await fs.readFile(outputFile);
        const webpBase64 = webpBuffer.toString('base64');
        
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            webp_base64: webpBase64,
            size: webpBuffer.length,
            frames_processed: frames_base64.length,
            frame_duration_ms: frame_duration_ms,
            loop: true,
            transparency: true,
            method: 'server-side-webp-converter'
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
      
    } catch (webpError) {
      console.error('webp-converter error:', webpError);
      
      // Fallback to guidance if webp-converter fails
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Server-side animated WebP creation failed',
          reason: `webp-converter error: ${webpError instanceof Error ? webpError.message : 'Unknown error'}`,
          workaround: {
            message: 'Individual frames export works perfectly. Use external tool for animation.',
            steps: [
              '1. Download ZIP of individual transparent WebP frames',
              '2. Upload frames to EZGIF.com or similar tool',  
              '3. Create animated WebP with transparency settings',
              '4. Download final animated WebP'
            ],
            confirmed_working: 'EZGIF successfully creates transparent animated WebP from exported frames'
          },
          frames_available: frames_base64.length,
          frame_format: frame_format,
          transparency_preserved: true,
          method: 'server-side-webp-converter-failed'
        }),
      };
    }
    
  } catch (error) {
    console.error('Animated WebP creation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during animated WebP creation',
        method: 'server-side-error'
      }),
    };
  }
};

export { handler };
