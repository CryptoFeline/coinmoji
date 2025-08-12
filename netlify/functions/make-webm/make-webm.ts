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
  targetFileSize?: number;   // target file size in bytes (default: 64KB)
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
      targetFileSize: request.targetFileSize ? `${(request.targetFileSize / 1024).toFixed(1)}KB` : '64KB (default)',
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

      // Dynamic VP9 settings based on quality mode and target size
      const targetFileSize = request.targetFileSize || 64 * 1024; // Default 64KB
      const qualityMode = request.qualityMode || 'balanced';
      
      // Calculate optimal CRF for VP9 - BALANCED approach for size vs quality
      const bytesPerFrame = targetFileSize / request.frames.length;
      
      // Initial CRF range 15-30 for aggressive size control while maintaining acceptable quality
      let crf = qualityMode === 'high' ? 15 :          // High quality but smaller size
                qualityMode === 'balanced' ? 23 :      // Balanced quality/size  
                30;                                    // Maximum compression for <64KB
      
      console.log(`🔬 OPTIMIZED: Starting with CRF=${crf} for aggressive size control (bytes per frame: ${bytesPerFrame.toFixed(0)})`);
      
      // Bitrate targeting - More aggressive for size control
      const baseBitrate = Math.floor((targetFileSize * 8) / request.duration / 1000);
      const targetBitrate = Math.floor(baseBitrate * 1.2); // More aggressive bitrate reduction
      const maxBitrate = Math.floor(targetBitrate * 1.8); // Tighter peak control

      console.log('🎯 OPTIMIZED VP9 settings (CRF 15-30 for <64KB target):', {
        initialCrf: crf,
        targetBitrate: `${targetBitrate}kbps`,
        maxBitrate: `${maxBitrate}kbps`,
        bytesPerFrame: `${bytesPerFrame.toFixed(0)} bytes/frame`,
        qualityMode,
        aggressiveSizeControl: true,
        targetSizeKB: targetFileSize / 1024,
        avgWebPFrameSize: `${(avgWebPFrameSize/1024).toFixed(2)}KB`
      });

      // ITERATIVE ENCODING: Try different CRF values until we get under target size
      let finalWebmBuffer: Buffer | null = null;
      let attempts = 0;
      const maxAttempts = 20; // OPTIMIZED: Smart CRF jumping should converge in ~4-6 attempts
      const maxCrf = 50; // Maximum reasonable CRF for VP9
      
      while (attempts < maxAttempts && crf <= maxCrf) {
        attempts++;
        console.log(`🔄 Smart encoding attempt ${attempts}/${maxAttempts} with CRF=${crf} (target: ${(targetFileSize/1024).toFixed(1)}KB)`);

        // SPEED OPTIMIZATION: Use single-pass for first attempts, two-pass for final quality
        const useTwoPass = attempts >= 3; // Use two-pass only after finding ballpark CRF
        const passLogFile = join(tmpDir, `ffmpeg2pass_${crf}`); // Unique log file per attempt
        
        console.log(`🚀 Using ${useTwoPass ? 'two-pass' : 'single-pass'} encoding for ${useTwoPass ? 'final quality' : 'speed estimation'}`);

        // Prepare OPTIMIZED FFmpeg arguments for VP9 with alpha
        const outputPath = join(tmpDir, `out_crf${crf}.webm`);
        console.log(`🔧 Starting FFmpeg encoding with CRF=${crf}...`);

        if (useTwoPass) {
          // TWO-PASS ENCODING for final quality (attempts 3+)
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
            '-lag-in-frames', '0',       // No lookahead for alpha transparency
            '-deadline', 'good',         // BALANCED: Good quality (faster than 'best')
            '-cpu-used', '1',            // BALANCED: Good quality encoding (faster than 0)
            '-row-mt', '1',              // Safe multi-threading
            '-threads', '4',             // OPTIMIZED: Use 4 threads for faster encoding
            '-tile-columns', '1',        // OPTIMIZED: Enable minimal tiling for speed
            '-frame-parallel', '0',      // Disable frame parallelism for alpha
            '-aq-mode', '2',             // BALANCED: Good adaptive quantization (faster than 3)
            '-arnr-maxframes', '5',      // OPTIMIZED: Reduced noise reduction frames for speed
            '-arnr-strength', '3',       // BALANCED: Moderate noise reduction
            '-sharpness', '1',           // BALANCED: Moderate sharpness for speed
            '-tune-content', 'default',  // Default tuning for mixed content
            '-g', String(request.frames.length), // Keyframe interval = full loop
            '-pass', '1',                // Two-pass encoding for better quality
            '-passlogfile', passLogFile, // Specify log file location in /tmp
            '-f', 'null',                // First pass output to null
            '/dev/null'                  // Linux null device
          ];

          // PASS 1: Analysis
          await new Promise<void>((resolve, reject) => {
            const ffmpegProcess = spawn(ffmpegPath, pass1Args, {
              stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';

            ffmpegProcess.stderr?.on('data', (data) => {
              stderr += data.toString();
              if (data.toString().includes('frame=')) {
                console.log(`📊 FFmpeg Pass 1 (CRF=${crf}) progress:`, data.toString().trim());
              }
            });

            ffmpegProcess.on('close', (code) => {
              if (code === 0) {
                console.log(`✅ FFmpeg Pass 1 (CRF=${crf}) completed`);
                resolve();
              } else {
                console.error(`❌ FFmpeg Pass 1 (CRF=${crf}) failed with code:`, code);
                console.error('FFmpeg stderr:', stderr);
                reject(new Error(`FFmpeg Pass 1 exit code ${code}: ${stderr}`));
              }
            });

            ffmpegProcess.on('error', (error) => {
              console.error(`❌ FFmpeg Pass 1 (CRF=${crf}) spawn error:`, error);
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
            '-lag-in-frames', '0',       // No lookahead for alpha transparency
            '-deadline', 'good',         // BALANCED: Good quality (faster than 'best')
            '-cpu-used', '1',            // BALANCED: Good quality encoding (faster than 0)
            '-row-mt', '1',
            '-threads', '4',             // OPTIMIZED: Use 4 threads for faster encoding
            '-tile-columns', '1',        // OPTIMIZED: Enable minimal tiling for speed
            '-frame-parallel', '0',      // Disable frame parallelism for alpha
            '-aq-mode', '2',             // BALANCED: Good adaptive quantization (faster than 3)
            '-arnr-maxframes', '5',      // OPTIMIZED: Reduced noise reduction frames for speed
            '-arnr-strength', '3',       // BALANCED: Moderate noise reduction
            '-sharpness', '1',           // BALANCED: Moderate sharpness for speed
            '-tune-content', 'default',  // Default tuning for mixed content
            '-g', String(request.frames.length),
            '-pass', '2',                // Second pass
            '-passlogfile', passLogFile, // Use same log file location
            '-y',                        // Overwrite output
            outputPath
          ];

          // Spawn FFmpeg process for Pass 2
          await new Promise<void>((resolve, reject) => {
            const ffmpegProcess = spawn(ffmpegPath, pass2Args, {
              stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';

            ffmpegProcess.stderr?.on('data', (data) => {
              stderr += data.toString();
              if (data.toString().includes('frame=')) {
                console.log(`📊 FFmpeg Pass 2 (CRF=${crf}) progress:`, data.toString().trim());
              }
            });

            ffmpegProcess.on('close', (code) => {
              if (code === 0) {
                console.log(`✅ FFmpeg Pass 2 (CRF=${crf}) completed`);
                resolve();
              } else {
                console.error(`❌ FFmpeg Pass 2 (CRF=${crf}) failed with code:`, code);
                console.error('FFmpeg stderr:', stderr);
                reject(new Error(`FFmpeg Pass 2 exit code ${code}: ${stderr}`));
              }
            });

            ffmpegProcess.on('error', (error) => {
              console.error(`❌ FFmpeg Pass 2 (CRF=${crf}) spawn error:`, error);
              reject(error);
            });
          });
        } else {
          // SINGLE-PASS ENCODING for speed estimation (attempts 1-2)
          const singlePassArgs = [
            '-framerate', String(request.framerate),
            '-i', join(tmpDir, 'f%04d.webp'),
            '-pix_fmt', 'yuva420p',
            '-c:v', 'libvpx-vp9',
            '-crf', String(crf),
            '-b:v', `${targetBitrate}k`,
            '-maxrate', `${maxBitrate}k`,
            '-bufsize', `${targetBitrate * 2}k`,
            '-auto-alt-ref', '0',
            '-lag-in-frames', '0',
            '-deadline', 'realtime',     // SPEED: Fastest encoding for estimation
            '-cpu-used', '5',            // SPEED: Fast encoding (lower quality but much faster)
            '-row-mt', '1',
            '-threads', '4',
            '-tile-columns', '2',        // More tiling for speed
            '-frame-parallel', '0',
            '-aq-mode', '0',             // Disable adaptive quantization for speed
            '-tune-content', 'default',
            '-g', String(request.frames.length),
            '-y',                        // Overwrite output
            outputPath
          ];

          // Single-pass encoding
          await new Promise<void>((resolve, reject) => {
            const ffmpegProcess = spawn(ffmpegPath, singlePassArgs, {
              stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';

            ffmpegProcess.stderr?.on('data', (data) => {
              stderr += data.toString();
              if (data.toString().includes('frame=')) {
                console.log(`📊 FFmpeg Single-pass (CRF=${crf}) progress:`, data.toString().trim());
              }
            });

            ffmpegProcess.on('close', (code) => {
              if (code === 0) {
                console.log(`✅ FFmpeg Single-pass (CRF=${crf}) completed`);
                resolve();
              } else {
                console.error(`❌ FFmpeg Single-pass (CRF=${crf}) failed with code:`, code);
                console.error('FFmpeg stderr:', stderr);
                reject(new Error(`FFmpeg Single-pass exit code ${code}: ${stderr}`));
              }
            });

            ffmpegProcess.on('error', (error) => {
              console.error(`❌ FFmpeg Single-pass (CRF=${crf}) spawn error:`, error);
              reject(error);
            });
          });
        }

        // Read the generated WebM file and check size
        console.log(`📖 Reading generated WebM file (CRF=${crf})...`);
        const webmBuffer = await readFile(outputPath);
        
        if (webmBuffer.length === 0) {
          throw new Error(`Generated WebM file is empty (CRF=${crf})`);
        }

        const fileSizeKB = webmBuffer.length / 1024;
        const targetSizeKB = targetFileSize / 1024;
        console.log(`📏 WebM file size: ${fileSizeKB.toFixed(1)}KB (target: ${targetSizeKB.toFixed(1)}KB)`);

        // Check if file size is acceptable
        if (webmBuffer.length <= targetFileSize) {
          console.log(`✅ File size within target! Using CRF=${crf} (${fileSizeKB.toFixed(1)}KB <= ${targetSizeKB.toFixed(1)}KB)`);
          finalWebmBuffer = webmBuffer;
          break;
        } else if (crf >= maxCrf) {
          console.warn(`⚠️ Reached maximum CRF=${maxCrf}, using final result even though oversized (${fileSizeKB.toFixed(1)}KB > ${targetSizeKB.toFixed(1)}KB)`);
          finalWebmBuffer = webmBuffer;
          break;
        } else {
          // 🚀 ULTRA-SMART CRF ADJUSTMENT: More aggressive jumping for speed
          const sizeRatio = fileSizeKB / targetSizeKB; // How much larger we are
          let crfJump = 1; // Default increment
          
          if (sizeRatio > 2.5) {
            // Extremely large (2.5x+), jump by 10-8 CRF points
            crfJump = Math.min(15, Math.max(10, Math.floor(sizeRatio * 2)));
          } else if (sizeRatio > 1.8) {
            // Very large (1.8x+), jump by 6-4 CRF points
            crfJump = Math.min(10, Math.max(8, Math.floor(sizeRatio * 2)));
          } else if (sizeRatio > 1.3) {
            // Large (1.3x+), jump by 3-4 CRF points
            crfJump = Math.min(7, Math.max(5, Math.floor(sizeRatio * 2)));
          } else if (sizeRatio > 1.1) {
            // Slightly large (1.1x+), jump by 2 CRF points
            crfJump = 2;
          }
          // else: very close to target (< 1.1x), use default jump of 1
          
          const newCrf = crf + crfJump;
          console.log(`📈 File too large (${fileSizeKB.toFixed(1)}KB > ${targetSizeKB.toFixed(1)}KB), size ratio: ${sizeRatio.toFixed(2)}x, jumping CRF from ${crf} to ${newCrf} (+${crfJump}) for faster convergence...`);
          crf = newCrf;
        }
      }

      if (!finalWebmBuffer) {
        throw new Error('Failed to generate WebM within size constraints after all attempts');
      }

      console.log(`✅ ULTRA-OPTIMIZED WebM created: ${finalWebmBuffer.length} bytes (${(finalWebmBuffer.length/1024).toFixed(1)}KB) using CRF=${crf} after ${attempts} attempts with hybrid single/two-pass encoding`);

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
          webm_base64: finalWebmBuffer.toString('base64'),
          size_bytes: finalWebmBuffer.length,
          frames_processed: request.frames.length,
          framerate: request.framerate,
          duration: request.duration,
          crf_used: crf,
          encoding_attempts: attempts
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
