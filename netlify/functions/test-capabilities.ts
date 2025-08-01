import { Handler } from '@netlify/functions';

// Quick test to verify transparency capability detection
export const handler: Handler = async (event) => {
  console.log('🧪 Testing transparency capabilities');
  
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

  try {
    // Simulate the capability detection logic from client
    const userAgent = event.headers['user-agent'] || '';
    const isWebView = userAgent.toLowerCase().includes('webview') || 
                     userAgent.toLowerCase().includes('telegram') ||
                     // Also check if it looks like a mobile webview
                     (userAgent.includes('Mobile') && userAgent.includes('Safari') && userAgent.includes('Version'));
    
    const capabilities = {
      server_side_available: true, // Now we have FFmpeg
      user_agent: userAgent,
      is_webview_detected: isWebView,
      recommendation: isWebView ? 'server-side-ffmpeg' : 'client-side-preferred',
      transparency_approach: isWebView ? 'yuva420p + auto-alt-ref 0' : 'VP9 Profile 2 codec',
      environment: {
        platform: process.platform,
        node_version: process.version,
        lambda_runtime: process.env.AWS_LAMBDA_JS_RUNTIME || 'unknown'
      }
    };

    console.log('✅ Capabilities detected:', capabilities);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        capabilities,
        message: isWebView 
          ? 'WebView detected - server-side FFmpeg recommended for transparency'
          : 'Standard browser - client-side encoding should work'
      }),
    };

  } catch (error) {
    console.error('❌ Capability test failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Capability test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
};
