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

    // Netlify Functions don't have FFmpeg available, so immediately return error
    // to force client-side webm-muxer with transparency-capable codecs
    console.log('⚠️ Server-side FFmpeg not available in Netlify environment');
    console.log('🔄 Directing client to use webm-muxer with VP9 alpha support...');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Server-side WebM creation not available',
        details: 'Netlify environment does not support FFmpeg. Use client-side approach with alpha-capable VP9 codecs.',
        fallback_required: true,
        recommendation: 'Use client-side webm-muxer with VP9 Profile 2 for transparency',
        frames_processed: frames_base64.length
      }),
    };

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