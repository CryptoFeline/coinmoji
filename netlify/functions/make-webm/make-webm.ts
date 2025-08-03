import { Handler } from '@netlify/functions';
import { spawn } from 'node:child_process';
import { writeFile, readFile, rm, mkdtemp, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// For Netlify functions, the binary should be in the same directory as this handler
// Use a simple approach that works in the serverless environment
const ffmpegPath = join(__dirname, 'ffmpeg');

// Verify that the bundled FFmpeg binary exists
async function ensureFFmpeg(): Promise<void> {
  try {
    await access(ffmpegPath);
    console.log('✅ Bundled FFmpeg binary found at:', ffmpegPath);
  } catch {
    throw new Error(`Bundled FFmpeg binary not found at ${ffmpegPath}. Please run: ./scripts/bundle-ffmpeg.sh`);
  }
}

interface MakeWebMRequest {
  frames: string[];          // base64 encoded WebP frames
  framerate: number;         // fps
  duration: number;          // total duration in seconds
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

    console.log('🎬 Native FFmpeg WebM creation:', {
      frames: request.frames.length,
      framerate: request.framerate,
      duration: request.duration,
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

      // Prepare FFmpeg arguments for VP9 with alpha
      const outputPath = join(tmpDir, 'out.webm');
      const args = [
        '-framerate', String(request.framerate),
        '-i', join(tmpDir, 'f%04d.webp'),
        '-pix_fmt', 'yuva420p',      // VP9 with alpha channel
        '-c:v', 'libvpx-vp9',        // VP9 codec
        '-b:v', '0',                 // CRF mode
        '-crf', '30',                // Good quality (0-63, lower = better)
        '-auto-alt-ref', '0',        // Preserve alpha channel
        '-lag-in-frames', '0',       // Reduce memory usage
        '-deadline', 'good',         // Good quality/speed balance
        '-cpu-used', '2',            // Balanced encoding speed
        '-row-mt', '1',              // Safe multi-threading
        '-threads', '1',             // Single thread for predictable memory
        '-tile-columns', '0',        // Disable tiling
        '-frame-parallel', '0',      // Disable frame parallelism for alpha
        '-y',                        // Overwrite output
        outputPath
      ];

      console.log('🔧 Starting FFmpeg with args:', args.join(' '));

      // Spawn FFmpeg process
      await new Promise<void>((resolve, reject) => {
        const ffmpegProcess = spawn(ffmpegPath, args, {
          stdio: ['ignore', 'pipe', 'pipe'] // capture stdout/stderr
        });

        let stdout = '';
        let stderr = '';

        ffmpegProcess.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        ffmpegProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
          // Log FFmpeg progress
          if (data.toString().includes('frame=')) {
            console.log('📊 FFmpeg progress:', data.toString().trim());
          }
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ FFmpeg completed successfully');
            resolve();
          } else {
            console.error('❌ FFmpeg failed with code:', code);
            console.error('FFmpeg stderr:', stderr);
            reject(new Error(`FFmpeg exit code ${code}: ${stderr}`));
          }
        });

        ffmpegProcess.on('error', (error) => {
          console.error('❌ FFmpeg spawn error:', error);
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
