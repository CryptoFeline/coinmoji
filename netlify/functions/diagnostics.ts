import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { execSync } = await import('child_process');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      tools: {}
    };

    // Test each required tool
    const tools = ['webpmux', 'magick', 'ffmpeg'];
    
    for (const tool of tools) {
      try {
        const versionCommand = tool === 'magick' ? 'magick -version' : `${tool} -version`;
        const output = execSync(versionCommand, { 
          stdio: 'pipe', 
          timeout: 5000,
          encoding: 'utf8'
        });
        
        diagnostics.tools[tool] = {
          available: true,
          version: output.split('\n')[0] || 'version info not parsed'
        };
      } catch (error) {
        diagnostics.tools[tool] = {
          available: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagnostics, null, 2),
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Diagnostic check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
