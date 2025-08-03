import { Handler } from '@netlify/functions';
import { writeFile, access, chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

export const handler: Handler = async (event) => {
  try {
    console.log('🔧 Setting up FFmpeg binary for WebM creation...');
    
    // Get function directory
    let __dirname: string;
    try {
      if (typeof __filename !== 'undefined') {
        __dirname = require('path').dirname(__filename);
      } else {
        __dirname = process.cwd();
      }
    } catch {
      __dirname = process.cwd();
    }
    
    const ffmpegPath = join(__dirname, 'ffmpeg');
    
    console.log('📁 Function directory:', __dirname);
    console.log('📁 FFmpeg path:', ffmpegPath);
    
    // Check if FFmpeg already exists
    try {
      await access(ffmpegPath);
      console.log('✅ FFmpeg binary already exists at:', ffmpegPath);
      
      // Test the existing binary
      const testResult = await testFFmpeg(ffmpegPath);
      if (testResult.success) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'FFmpeg binary already exists and is working',
            ffmpeg_path: ffmpegPath,
            version: testResult.version
          }),
        };
      } else {
        console.log('⚠️ Existing FFmpeg binary is not working, re-downloading...');
      }
    } catch {
      console.log('📥 FFmpeg binary not found, downloading...');
    }
    
    // Download FFmpeg static binary directly (no extraction needed)
    console.log('📦 Downloading FFmpeg static binary...');
    
    // Use the correct URL for eugeneware ffmpeg-static Linux x64 binary
    const ffmpegUrl = 'https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/ffmpeg-linux-x64';
    
    console.log('🌐 Downloading from:', ffmpegUrl);
    const response = await fetch(ffmpegUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download FFmpeg: ${response.status} ${response.statusText}`);
    }
    
    console.log('💾 FFmpeg download completed');
    
    const binaryData = await response.arrayBuffer();
    await writeFile(ffmpegPath, new Uint8Array(binaryData));
    await chmod(ffmpegPath, 0o755);
    
    console.log('✅ FFmpeg binary downloaded and made executable');
    
    // Test the installed binary
    const testResult = await testFFmpeg(ffmpegPath);
    
    if (testResult.success) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'FFmpeg binary downloaded and verified successfully',
          ffmpeg_path: ffmpegPath,
          version: testResult.version,
          size_bytes: binaryData.byteLength
        }),
      };
    } else {
      throw new Error(`FFmpeg binary test failed: ${testResult.error}`);
    }
    
  } catch (error) {
    console.error('❌ FFmpeg setup error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'FFmpeg setup failed'
      }),
    };
  }
};

// Test FFmpeg binary to ensure it works
async function testFFmpeg(ffmpegPath: string): Promise<{ success: boolean; version?: string; error?: string }> {
  return new Promise((resolve) => {
    console.log('🧪 Testing FFmpeg binary...');
    
    const testProcess = spawn(ffmpegPath, ['-version'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    testProcess.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    testProcess.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    testProcess.on('close', (code) => {
      if (code === 0 && stdout.includes('ffmpeg version')) {
        const versionMatch = stdout.match(/ffmpeg version ([^\s]+)/);
        const version = versionMatch ? versionMatch[1] : 'unknown';
        console.log('✅ FFmpeg test successful:', version);
        resolve({ success: true, version });
      } else {
        console.log('❌ FFmpeg test failed:', { code, stderr });
        resolve({ success: false, error: `Exit code ${code}: ${stderr}` });
      }
    });
    
    testProcess.on('error', (error) => {
      console.log('❌ FFmpeg test spawn error:', error);
      resolve({ success: false, error: error.message });
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      testProcess.kill();
      resolve({ success: false, error: 'Test timeout' });
    }, 10000);
  });
}
