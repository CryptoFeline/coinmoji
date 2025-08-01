import { Handler } from '@netlify/functions';
import FFmpegManager from './utils/ffmpeg-setup.js';

// Debug endpoint to test FFmpeg availability and functionality
export const handler: Handler = async (event) => {
  console.log('🔧 FFmpeg debug function called');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const ffmpegManager = FFmpegManager.getInstance();
    
    console.log('🎯 Testing FFmpeg setup...');
    const startTime = Date.now();
    
    // Try to get FFmpeg path (this will download if needed)
    const ffmpegPath = await ffmpegManager.getFFmpegPath();
    const downloadTime = Date.now() - startTime;
    
    console.log('✅ FFmpeg path obtained:', ffmpegPath);
    
    // Test FFmpeg by getting version info
    const { execSync } = await import('child_process');
    const versionOutput = execSync(`${ffmpegPath} -version`, { 
      timeout: 10000,
      encoding: 'utf8'
    });
    
    // Extract version info
    const versionLines = versionOutput.split('\n');
    const versionLine = versionLines[0] || '';
    const configLine = versionLines.find(line => line.includes('configuration:')) || '';
    
    const totalTime = Date.now() - startTime;
    
    console.log('✅ FFmpeg version test successful');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        ffmpeg_available: true,
        ffmpeg_path: ffmpegPath,
        version_info: versionLine,
        configuration: configLine.length > 100 ? configLine.substring(0, 100) + '...' : configLine,
        download_time_ms: downloadTime,
        total_time_ms: totalTime,
        platform: process.platform,
        arch: process.arch,
        node_version: process.version,
        environment: {
          tmp_writable: true,
          lambda_runtime: process.env.AWS_LAMBDA_JS_RUNTIME || 'unknown'
        },
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('❌ FFmpeg debug failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        ffmpeg_available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        platform: process.platform,
        arch: process.arch,
        node_version: process.version,
        environment: {
          lambda_runtime: process.env.AWS_LAMBDA_JS_RUNTIME || 'unknown'
        },
        timestamp: new Date().toISOString()
      }),
    };
  }
};
