import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { webp_base64, target_width, target_height } = JSON.parse(event.body || '{}');
    
    if (!webp_base64 || typeof webp_base64 !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No WebP data provided' }),
      };
    }
    
    if (!target_width || !target_height || target_width <= 0 || target_height <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid target dimensions' }),
      };
    }

    console.log(`Resizing animated WebP to ${target_width}x${target_height}`);

    // Check if ImageMagick is available
    const { execSync } = await import('child_process');
    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const { tmpdir } = await import('os');
    
    try {
      execSync('magick -version', { stdio: 'pipe', timeout: 5000 });
      console.log('ImageMagick is available');
    } catch (magickError) {
      console.error('ImageMagick not available:', magickError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'ImageMagick not available in serverless environment. Install imagemagick.',
          method: 'server-side-imagemagick',
          suggestion: 'Install ImageMagick package or use client-side fallback'
        }),
      };
    }
    
    const tempDir = join(tmpdir(), `resize-webp-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    try {
      // Write input WebP to temporary file
      const inputFile = join(tempDir, 'input.webp');
      const outputFile = join(tempDir, 'output.webp');
      
      console.log('Writing input WebP file...');
      const webpBuffer = Buffer.from(webp_base64, 'base64');
      await fs.writeFile(inputFile, webpBuffer);
      
      console.log(`Input file size: ${webpBuffer.length} bytes`);
      
      // Build ImageMagick command for resizing animated WebP
      // -coalesce: flatten animation layers for processing
      // -resize: resize to target dimensions 
      // -background transparent: preserve transparency
      // -alpha set: enable alpha channel
      // -dispose background: disposal method for animation
      const magickArgs = [
        'magick',
        inputFile,
        '-coalesce',
        '-background', 'transparent',
        '-alpha', 'set',
        '-resize', `${target_width}x${target_height}!`, // ! forces exact dimensions
        '-dispose', 'background',
        outputFile
      ];
      
      console.log('Running ImageMagick resize command...');
      console.log('Command:', magickArgs.join(' '));
      
      // Execute ImageMagick
      execSync(magickArgs.join(' '), { 
        cwd: tempDir,
        stdio: 'pipe',
        timeout: 30000 // 30 second timeout
      });
      
      // Check if output file was created
      const outputStats = await fs.stat(outputFile);
      if (!outputStats.isFile() || outputStats.size === 0) {
        throw new Error('ImageMagick failed to resize animated WebP file');
      }
      
      console.log(`Resized WebP created successfully: ${outputStats.size} bytes`);
      
      // Read the resized WebP file and convert to base64
      const resizedBuffer = await fs.readFile(outputFile);
      const resizedBase64 = resizedBuffer.toString('base64');
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          webp_base64: resizedBase64,
          original_size: webpBuffer.length,
          resized_size: resizedBuffer.length,
          dimensions: `${target_width}x${target_height}`,
          method: 'server-side-imagemagick'
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
    console.error('WebP resize error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during WebP resize',
        method: 'server-side-imagemagick'
      }),
    };
  }
};

export { handler };
