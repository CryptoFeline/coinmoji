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

    // Use webpmux-bin which provides the actual webpmux binary
    const webpmuxBin = (await import('webpmux-bin' as any)).default;
    const { execSync } = await import('child_process');
    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    
    try {
      console.log('Using webpmux-bin for animated WebP creation');
      console.log('webpmux path:', webpmuxBin);
      
      // Create temporary directory
      const tempDir = join(tmpdir(), `animated-webp-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
      
      try {
        // Write frames to temporary files
        console.log('Writing frames to temporary files...');
        for (let i = 0; i < frames_base64.length; i++) {
          const frameNumber = String(i).padStart(4, '0');
          const frameData = Buffer.from(frames_base64[i], 'base64');
          const frameFile = join(tempDir, `frame${frameNumber}.webp`);
          await fs.writeFile(frameFile, frameData);
        }
        
        // Build webpmux command for animated WebP with transparency
        const outputFile = join(tempDir, 'animation.webp');
        
        // Build frame arguments: -frame file.webp +duration+0+0+1+b
        // +duration = frame duration in ms
        // +0+0 = no spatial offset (X=0, Y=0) 
        // +1 = dispose method 1 (restore to background) for transparency
        // +b = alpha blending (preserve transparency)
        const frameArgs: string[] = [];
        for (let i = 0; i < frames_base64.length; i++) {
          const frameNumber = String(i).padStart(4, '0');
          const frameFile = join(tempDir, `frame${frameNumber}.webp`);
          frameArgs.push('-frame', `"${frameFile}"`, `+${frame_duration_ms}+0+0+1+b`);
        }
        
        // Complete webpmux command with proper transparency settings
        const webpmuxArgs = [
          ...frameArgs,
          '-loop', '0', // Infinite loop
          '-bgcolor', '0,0,0,0', // Transparent background (A,R,G,B format)
          '-o', `"${outputFile}"`
        ];
        
        console.log('Running webpmux with', frames_base64.length, 'frames...');
        console.log('Frame settings: duration=' + frame_duration_ms + 'ms, dispose=1 (restore to background), blend=b (alpha blend)');
        
        // Execute webpmux
        execSync(`"${webpmuxBin}" ${webpmuxArgs.join(' ')}`, { 
          cwd: tempDir,
          stdio: 'pipe',
          timeout: 30000 // 30 second timeout
        });
        
        // Check if output file was created
        const outputStats = await fs.stat(outputFile);
        if (!outputStats.isFile() || outputStats.size === 0) {
          throw new Error('webpmux failed to create animated WebP file');
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
            method: 'server-side-webpmux-bin'
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
      
    } catch (webpmuxError) {
      console.error('webpmux-bin error:', webpmuxError);
      throw new Error(`webpmux failed: ${webpmuxError instanceof Error ? webpmuxError.message : 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('Animated WebP creation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during animated WebP creation',
        method: 'server-side-webpmux-bin'
      }),
    };
  }
};

export { handler };
