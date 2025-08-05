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
      let totalWebPSize = 0;
      await Promise.all(
        request.frames.map(async (base64Frame, i) => {
          const filename = `f${String(i).padStart(4, '0')}.webp`;
          const filepath = join(tmpDir, filename);
          const buffer = Buffer.from(base64Frame, 'base64');
          totalWebPSize += buffer.length;
          return writeFile(filepath, buffer);
        })
      );

      const avgWebPFrameSize = totalWebPSize / request.frames.length;
      console.log(`✅ Written ${request.frames.length} WebP frames, total: ${(totalWebPSize/1024).toFixed(1)}KB, avg: ${(avgWebPFrameSize/1024).toFixed(2)}KB per frame`);

      // Dynamic VP9 settings with iterative CRF optimization to achieve target size
      const targetFileSize = request.targetFileSize || 60 * 1024; // Default 60KB
      const qualityMode = request.qualityMode || 'balanced';
      
      console.log(`🎯 Target WebM size: ${(targetFileSize/1024).toFixed(1)}KB`);
      
      // ITERATIVE CRF OPTIMIZATION: Start with good quality, increase CRF until under target size
      let bestCrf = 15;  // Start with reasonable quality
      let bestWebmBuffer: Buffer | null = null;
      const maxCrfAttempts = 8; // Limit attempts to prevent timeout
      const outputPath = join(tmpDir, 'out.webm');
      
      console.log('🔄 Starting iterative CRF optimization to achieve target size...');
      
      for (let attempt = 0; attempt < maxCrfAttempts; attempt++) {
        const currentCrf = bestCrf + (attempt * 5); // Increase CRF by 5 each time (15, 20, 25, 30, 35, 40, 45, 50)
        
        console.log(`🎬 Attempt ${attempt + 1}/${maxCrfAttempts}: Testing CRF=${currentCrf}`);
        
        // Calculate bitrate for this CRF attempt
        const baseBitrate = Math.floor((targetFileSize * 8) / request.duration / 1000);
        const targetBitrate = Math.max(50, Math.floor(baseBitrate * 1.2)); // Minimum 50kbps
        const maxBitrate = Math.floor(targetBitrate * 1.8);
        
        console.log(`📊 CRF=${currentCrf} settings:`, {
          targetBitrate: `${targetBitrate}kbps`,
          maxBitrate: `${maxBitrate}kbps`,
          qualityMode
        });

        // Use single-pass encoding for speed in iterative testing
        const ffmpegArgs = [
          '-framerate', String(request.framerate),
          '-i', join(tmpDir, 'f%04d.webp'),
          '-pix_fmt', 'yuva420p',      // VP9 with alpha channel
          '-c:v', 'libvpx-vp9',        // VP9 codec
          '-crf', String(currentCrf),  // Current CRF being tested
          '-b:v', `${targetBitrate}k`, // Target bitrate for size control
          '-maxrate', `${maxBitrate}k`, // Maximum bitrate
          '-bufsize', `${targetBitrate * 2}k`, // Buffer size for rate control
          '-auto-alt-ref', '0',        // Preserve alpha channel
          '-lag-in-frames', '0',       // No lookahead for alpha transparency
          '-deadline', 'good',         // Good quality/speed balance for iteration
          '-cpu-used', '1',            // Faster encoding for iteration
          '-row-mt', '1',              // Safe multi-threading
          '-threads', '1',             // Single thread for predictable memory
          '-tile-columns', '0',        // Disable tiling for small content
          '-frame-parallel', '0',      // Disable frame parallelism for alpha
          '-aq-mode', '2',             // Good adaptive quantization
          '-tune-content', 'default',  // Default tuning for mixed content
          '-g', String(request.frames.length), // Keyframe interval = full loop
          '-y',                        // Overwrite output
          outputPath
        ];

        console.log(`🔧 Encoding with CRF=${currentCrf}...`);

        // Spawn FFmpeg process
        try {
          await new Promise<void>((resolve, reject) => {
            const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
              stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';

            ffmpegProcess.stderr?.on('data', (data) => {
              stderr += data.toString();
              // Less verbose logging during iteration
              if (data.toString().includes('frame=') && attempt === 0) {
                console.log('📊 FFmpeg progress:', data.toString().trim());
              }
            });

            ffmpegProcess.on('close', (code) => {
              if (code === 0) {
                resolve();
              } else {
                reject(new Error(`FFmpeg exit code ${code}: ${stderr}`));
              }
            });

            ffmpegProcess.on('error', (error) => {
              reject(error);
            });
          });

          // Read the generated WebM file and check size
          const webmBuffer = await readFile(outputPath);
          
          if (webmBuffer.length === 0) {
            console.warn(`⚠️ CRF=${currentCrf} produced empty file, trying next CRF`);
            continue;
          }

          const sizeMB = webmBuffer.length / 1024;
          console.log(`📊 CRF=${currentCrf} result: ${webmBuffer.length} bytes (${sizeMB.toFixed(1)}KB)`);

          // Check if this size meets our target
          if (webmBuffer.length <= targetFileSize) {
            console.log(`✅ SUCCESS! CRF=${currentCrf} achieved target size: ${sizeMB.toFixed(1)}KB <= ${(targetFileSize/1024).toFixed(1)}KB`);
            bestWebmBuffer = webmBuffer;
            bestCrf = currentCrf;
            break; // Found acceptable size, stop iteration
          } else {
            console.log(`❌ CRF=${currentCrf} too large: ${sizeMB.toFixed(1)}KB > ${(targetFileSize/1024).toFixed(1)}KB, trying higher CRF`);
            // Keep this as backup in case we don't find anything smaller
            if (!bestWebmBuffer) {
              bestWebmBuffer = webmBuffer;
              bestCrf = currentCrf;
            }
          }

        } catch (error) {
          console.error(`❌ CRF=${currentCrf} encoding failed:`, error);
          // Continue to next CRF value
          continue;
        }
      }

      // Use the best result we found
      if (!bestWebmBuffer) {
        throw new Error('All CRF attempts failed to produce valid WebM');
      }

      const finalSizeKB = bestWebmBuffer.length / 1024;
      console.log(`🎯 FINAL RESULT: CRF=${bestCrf}, Size=${finalSizeKB.toFixed(1)}KB`);
      
      if (bestWebmBuffer.length > targetFileSize) {
        console.warn(`⚠️ Final size ${finalSizeKB.toFixed(1)}KB exceeds target ${(targetFileSize/1024).toFixed(1)}KB - this was the best we could achieve`);
      }

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
          webm_base64: bestWebmBuffer.toString('base64'),
          size_bytes: bestWebmBuffer.length,
          frames_processed: request.frames.length,
          framerate: request.framerate,
          duration: request.duration,
          final_crf: bestCrf,
          target_size_kb: (targetFileSize/1024).toFixed(1),
          actual_size_kb: finalSizeKB.toFixed(1)
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
