import { Handler } from '@netlify/functions';
import { writeFile, access, chmod, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const handler: Handler = async (event) => {
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
    
    // Download FFmpeg static build from BtbN releases
    const ffmpegUrl = 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-lgpl.tar.xz';
    
    console.log('📦 Downloading FFmpeg from:', ffmpegUrl);
    
    const response = await fetch(ffmpegUrl);
    if (!response.ok) {
      throw new Error(`Failed to download FFmpeg: ${response.status} ${response.statusText}`);
    }
    
    console.log('💾 FFmpeg download completed, size:', response.headers.get('content-length') || 'unknown');
    
    // Save the tar.xz file to temp directory
    const tmpDir = tmpdir();
    const tarPath = join(tmpDir, 'ffmpeg.tar.xz');
    
    const buffer = await response.arrayBuffer();
    await writeFile(tarPath, new Uint8Array(buffer));
    
    console.log('📦 Extracting FFmpeg from tar.xz...');
    
    // Extract the tar.xz file using tar command
    await new Promise<void>((resolve, reject) => {
      const tarProcess = spawn('tar', ['-xf', tarPath, '-C', tmpDir], {
        stdio: 'pipe'
      });
      
      let stderr = '';
      
      tarProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      tarProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`tar extraction failed with code ${code}: ${stderr}`));
        }
      });
      
      tarProcess.on('error', (error) => {
        reject(error);
      });
    });
    
    // Find the extracted ffmpeg binary
    const extractedDir = join(tmpDir, 'ffmpeg-master-latest-linux64-lgpl');
    const extractedBinary = join(extractedDir, 'bin', 'ffmpeg');
    
    console.log('📋 Looking for extracted binary at:', extractedBinary);
    
    try {
      await access(extractedBinary);
      console.log('✅ Found extracted FFmpeg binary');
    } catch {
      throw new Error('Extracted FFmpeg binary not found at expected location');
    }
    
    // Copy the binary to the function directory
    const binaryData = await readFile(extractedBinary);
    await writeFile(ffmpegPath, binaryData);
    await chmod(ffmpegPath, 0o755);
    
    console.log('✅ FFmpeg binary copied and made executable');
    
    // Clean up temp files
    try {
      await rm(tarPath);
      await rm(extractedDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary files');
    } catch (cleanupError) {
      console.warn('⚠️ Failed to clean up temp files:', cleanupError);
    }
    
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
          size_bytes: binaryData.length
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

// Test FFmpeg binary
async function testFFmpeg(ffmpegPath: string): Promise<{ success: boolean; version?: string; error?: string }> {
  try {
    console.log('🧪 Testing FFmpeg binary...');
    
    return await new Promise((resolve) => {
      const testProcess = spawn(ffmpegPath, ['-version'], {
        stdio: 'pipe'
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
          console.log('✅ FFmpeg test successful, version:', version);
          resolve({ success: true, version });
        } else {
          console.error('❌ FFmpeg test failed with code:', code);
          console.error('stderr:', stderr);
          resolve({ success: false, error: `Exit code ${code}: ${stderr}` });
        }
      });
      
      testProcess.on('error', (error) => {
        console.error('❌ FFmpeg test spawn error:', error);
        resolve({ success: false, error: error.message });
      });
    });
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export { handler };
