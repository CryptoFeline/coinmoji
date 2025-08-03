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

    console.log(`Attempting animated WebP creation from ${frames_base64.length} ${frame_format} frames`);
    console.log('Frame duration:', frame_duration_ms, 'ms');
    console.log('Settings:', settings);

    // For now, return error with clear guidance until we find a working solution
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Server-side animated WebP creation temporarily unavailable',
        reason: 'Dependency issues with WebP libraries in serverless environment',
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
        method: 'server-side-unavailable'
      }),
    };
    
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
