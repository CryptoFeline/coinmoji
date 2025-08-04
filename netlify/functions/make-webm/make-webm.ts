import { Handler } from '@netlify/functions';
import { spawn } from 'node:child_process';
import { writeFile, readFile, rm, mkdtemp, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// For Netlify functions, try multiple possible paths for the bundled FFmpeg binary
const possibleFFmpegPaths = [
  // Path relative to the function handler
  join(__dirname, 'ffmpeg'),
  // Path relative to the function directory
  join(__dirname, '..', 'make-webm', 'ffmpeg'),
  // Absolute path based on Netlify's structure
  '/var/task/netlify/functions/make-webm/ffmpeg',
  // Alternative path structure
  join(process.cwd(), 'netlify', 'functions', 'make-webm', 'ffmpeg')
];

let ffmpegPath: string = '';

// Verify that the bundled FFmpeg binary exists and find the correct path
async function ensureFFmpeg(): Promise<void> {
  console.log('🔍 Searching for bundled FFmpeg binary...');
  console.log('📁 Current working directory:', process.cwd());
  console.log('📁 Function __dirname:', __dirname);
  
  // Try each possible path
  for (const path of possibleFFmpegPaths) {
    try {
      await access(path);
      ffmpegPath = path;
      console.log('✅ Bundled FFmpeg binary found at:', ffmpegPath);
      return;
    } catch {
      console.log('❌ FFmpeg not found at:', path);
    }
  }
  
  // If not found, fall back to downloading to /tmp
  console.log('📥 Bundled binary not found, downloading to /tmp...');
  ffmpegPath = '/tmp/ffmpeg';
  
  try {
    await access(ffmpegPath);
    console.log('✅ FFmpeg already exists in /tmp');
    return;
  } catch {
    console.log('📦 Downloading FFmpeg binary...');
    const ffmpegUrl = 'https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/ffmpeg-linux-x64';
    
    const response = await fetch(ffmpegUrl);
    if (!response.ok) {
      throw new Error(`Failed to download FFmpeg: ${response.status} ${response.statusText}`);
    }
    
    const binaryData = await response.arrayBuffer();
    const { chmod } = await import('node:fs/promises');
    await writeFile(ffmpegPath, new Uint8Array(binaryData));
    await chmod(ffmpegPath, 0o755);
    
    console.log('✅ FFmpeg binary downloaded and made executable at:', ffmpegPath);
  }
}

interface MakeWebMRequest {
  frames: string[];          // base64 encoded WebP frames
  framerate: number;         // fps
  duration: number;          // total duration in seconds
  targetFileSize?: number;   // target file size in bytes (default: 60KB)
  qualityMode?: 'high' | 'balanced' | 'compact'; // quality preference
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Ensure FFmpeg binary is available
    await ensureFFmpeg();
    
    // Validate that FFmpeg path was found/set
    if (!ffmpegPath) {
      throw new Error('FFmpeg binary not available after setup attempt');
    }
    
    const request: MakeWebMRequest = JSON.parse(event.body || '{}');
    
    // Validate request
    if (!Array.isArray(request.frames) || request.frames.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No frames provided' }),
      };
    }

    if (!request.framerate || request.framerate <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid framerate' }),
      };
    }

    console.log('🎬 OPTIMIZED Native FFmpeg WebM creation:', {
      frames: request.frames.length,
      framerate: request.framerate,
      duration: request.duration,
      targetFileSize: request.targetFileSize ? `${(request.targetFileSize / 1024).toFixed(1)}KB` : '60KB (default)',
      qualityMode: request.qualityMode || 'balanced',
      ffmpegPath,
      workingDir: process.cwd(),
      functionDir: __dirname
    });

    // Create temporary directory
    const tmpDir = await mkdtemp(join(tmpdir(), 'ffframes-'));
    console.log('📁 Created temp directory:', tmpDir);

    try {
      // Write all WebP frames to temp directory
      console.log('📝 Writing WebP frames to temp directory...');
      await Promise.all(
        request.frames.map((base64Frame, i) => {
          const filename = `f${String(i).padStart(4, '0')}.webp`;
          const filepath = join(tmpDir, filename);
          const buffer = Buffer.from(base64Frame, 'base64');
          return writeFile(filepath, buffer);
        })
      );

      console.log(`✅ Written ${request.frames.length} WebP frames`);

      // Dynamic VP9 settings based on quality mode and target size
      const targetFileSize = request.targetFileSize || 60 * 1024; // Default 60KB
      const qualityMode = request.qualityMode || 'balanced';
      
      // Calculate optimal CRF based on target size and frame count
      const bytesPerFrame = targetFileSize / request.frames.length;
      const crfByQuality = {
        high: bytesPerFrame > 2000 ? 18 : bytesPerFrame > 1000 ? 22 : 25,   // 18-25 CRF for high quality
        balanced: bytesPerFrame > 2000 ? 25 : bytesPerFrame > 1000 ? 28 : 30, // 25-30 CRF for balanced
        compact: bytesPerFrame > 1000 ? 30 : 33                             // 30-33 CRF for compact
      };
      
      const crf = crfByQuality[qualityMode];
      
      // Bitrate targeting for size control
      const targetBitrate = Math.floor((targetFileSize * 8) / request.duration / 1000); // kbps
      const maxBitrate = Math.floor(targetBitrate * 1.5); // Allow 50% overhead
      
      console.log('🎯 Dynamic VP9 settings:', {
        crf,
        targetBitrate: `${targetBitrate}kbps`,
        maxBitrate: `${maxBitrate}kbps`,
        bytesPerFrame: `${bytesPerFrame.toFixed(0)} bytes/frame`,
        qualityMode
      });

      // Prepare OPTIMIZED FFmpeg arguments for VP9 with alpha
      const outputPath = join(tmpDir, 'out.webm');
      const passLogFile = join(tmpDir, 'ffmpeg2pass'); // Write log file to /tmp
      const pass1Args = [
        '-framerate', String(request.framerate),
        '-i', join(tmpDir, 'f%04d.webp'),
        '-pix_fmt', 'yuva420p',      // VP9 with alpha channel
        '-c:v', 'libvpx-vp9',        // VP9 codec
        '-crf', String(crf),         // Dynamic quality based on target size
        '-b:v', `${targetBitrate}k`, // Target bitrate for size control
        '-maxrate', `${maxBitrate}k`, // Maximum bitrate
        '-bufsize', `${targetBitrate * 2}k`, // Buffer size for rate control
        '-auto-alt-ref', '0',        // Preserve alpha channel
        '-lag-in-frames', qualityMode === 'high' ? '5' : '0', // Lookahead for quality
        '-deadline', qualityMode === 'high' ? 'best' : 'good', // Quality vs speed
        '-cpu-used', qualityMode === 'high' ? '0' : '2', // Encoding speed vs quality
        '-row-mt', '1',              // Safe multi-threading
        '-threads', '1',             // Single thread for predictable memory
        '-tile-columns', '0',        // Disable tiling
        '-frame-parallel', '0',      // Disable frame parallelism for alpha
        '-g', String(request.frames.length), // Keyframe interval = full loop
        '-pass', '1',                // Two-pass encoding for better quality
        '-passlogfile', passLogFile, // Specify log file location in /tmp
        '-f', 'null',                // First pass output to null
        '/dev/null'                  // Linux null device
      ];

      console.log('🔧 Starting OPTIMIZED two-pass FFmpeg encoding...');
      console.log('🔧 Pass 1 args:', pass1Args.join(' '));

      // PASS 1: Analysis
      await new Promise<void>((resolve, reject) => {
        const ffmpegProcess = spawn(ffmpegPath, pass1Args, {
          stdio: ['ignore', 'pipe', 'pipe']
        });

        let stderr = '';

        ffmpegProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
          if (data.toString().includes('frame=')) {
            console.log('📊 FFmpeg Pass 1 progress:', data.toString().trim());
          }
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ FFmpeg Pass 1 completed');
            resolve();
          } else {
            console.error('❌ FFmpeg Pass 1 failed with code:', code);
            console.error('FFmpeg stderr:', stderr);
            reject(new Error(`FFmpeg Pass 1 exit code ${code}: ${stderr}`));
          }
        });

        ffmpegProcess.on('error', (error) => {
          console.error('❌ FFmpeg Pass 1 spawn error:', error);
          reject(error);
        });
      });

      // PASS 2: Final encoding
      const pass2Args = [
        '-framerate', String(request.framerate),
        '-i', join(tmpDir, 'f%04d.webp'),
        '-pix_fmt', 'yuva420p',
        '-c:v', 'libvpx-vp9',
        '-crf', String(crf),
        '-b:v', `${targetBitrate}k`,
        '-maxrate', `${maxBitrate}k`,
        '-bufsize', `${targetBitrate * 2}k`,
        '-auto-alt-ref', '0',
        '-lag-in-frames', qualityMode === 'high' ? '5' : '0',
        '-deadline', qualityMode === 'high' ? 'best' : 'good',
        '-cpu-used', qualityMode === 'high' ? '0' : '2',
        '-row-mt', '1',
        '-threads', '1',
        '-tile-columns', '0',
        '-frame-parallel', '0',
        '-g', String(request.frames.length),
        '-pass', '2',                // Second pass
        '-passlogfile', passLogFile, // Use same log file location
        '-y',                        // Overwrite output
        outputPath
      ];

      console.log('🔧 Pass 2 args:', pass2Args.join(' '));

      // Spawn FFmpeg process for Pass 2
      await new Promise<void>((resolve, reject) => {
        const ffmpegProcess = spawn(ffmpegPath, pass2Args, {
          stdio: ['ignore', 'pipe', 'pipe']
        });

        let stderr = '';

        ffmpegProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
          if (data.toString().includes('frame=')) {
            console.log('📊 FFmpeg Pass 2 progress:', data.toString().trim());
          }
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ FFmpeg Pass 2 completed');
            resolve();
          } else {
            console.error('❌ FFmpeg Pass 2 failed with code:', code);
            console.error('FFmpeg stderr:', stderr);
            reject(new Error(`FFmpeg Pass 2 exit code ${code}: ${stderr}`));
          }
        });

        ffmpegProcess.on('error', (error) => {
          console.error('❌ FFmpeg Pass 2 spawn error:', error);
          reject(error);
        });
      });

      // Read the generated WebM file
      console.log('📖 Reading generated WebM file...');
      const webmBuffer = await readFile(outputPath);
      
      if (webmBuffer.length === 0) {
        throw new Error('Generated WebM file is empty');
      }

      console.log(`✅ WebM created: ${webmBuffer.length} bytes`);

      // Clean up temp directory
      await rm(tmpDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temp directory');

      // Return WebM as base64
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          webm_base64: webmBuffer.toString('base64'),
          size_bytes: webmBuffer.length,
          frames_processed: request.frames.length,
          framerate: request.framerate,
          duration: request.duration
        }),
      };

    } catch (processingError) {
      // Clean up temp directory on error
      try {
        await rm(tmpDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.warn('Failed to clean up temp directory:', cleanupError);
      }
      throw processingError;
    }

  } catch (error) {
    console.error('❌ Native FFmpeg WebM creation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Native FFmpeg WebM creation failed'
      }),
    };
  }
};
