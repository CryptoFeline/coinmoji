import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

// FFmpeg binary management for Netlify Functions
// Since Netlify doesn't allow bundling large binaries, we need to download at runtime

const FFMPEG_VERSION = '4.4.1';
const FFMPEG_DOWNLOAD_URLS = {
  // Use ZIP files instead of tar.xz for better Netlify Functions compatibility
  linux: `https://github.com/vot/ffbinaries-prebuilt/releases/download/v${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}-linux-64.zip`,
  darwin: `https://github.com/vot/ffbinaries-prebuilt/releases/download/v${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}-osx-64.zip`,
};

export class FFmpegManager {
  private static instance: FFmpegManager;
  private ffmpegPath: string | null = null;
  private isDownloading = false;

  static getInstance(): FFmpegManager {
    if (!FFmpegManager.instance) {
      FFmpegManager.instance = new FFmpegManager();
    }
    return FFmpegManager.instance;
  }

  async getFFmpegPath(): Promise<string> {
    if (this.ffmpegPath) {
      return this.ffmpegPath;
    }

    if (this.isDownloading) {
      // Wait for download to complete
      while (this.isDownloading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.ffmpegPath) {
        return this.ffmpegPath;
      }
    }

    return await this.downloadFFmpeg();
  }

  private async downloadFFmpeg(): Promise<string> {
    this.isDownloading = true;
    
    try {
      console.log('📥 Downloading FFmpeg binary for Netlify Function...');
      
      // Determine platform
      const platform = process.platform;
      console.log('🖥️ Platform detected:', platform, process.arch);
      
      // Create temp directory in /tmp (Netlify Functions have access to /tmp)
      const tempDir = '/tmp/ffmpeg';
      await fs.mkdir(tempDir, { recursive: true });
      
      const ffmpegBinaryPath = join(tempDir, 'ffmpeg');
      
      // Check if already exists
      try {
        await fs.access(ffmpegBinaryPath);
        console.log('✅ FFmpeg binary already exists in /tmp');
        this.ffmpegPath = ffmpegBinaryPath;
        this.isDownloading = false;
        return ffmpegBinaryPath;
      } catch {
        // Binary doesn't exist, download it
      }

      if (platform === 'linux') {
        // Handle Linux (Netlify/Lambda environment)
        await this.downloadLinuxFFmpeg(tempDir, ffmpegBinaryPath);
      } else if (platform === 'darwin') {
        // Handle macOS (development)
        await this.downloadMacOSFFmpeg(ffmpegBinaryPath);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      // Verify it works
      try {
        const versionOutput = execSync(`${ffmpegBinaryPath} -version`, { 
          timeout: 5000,
          encoding: 'utf8'
        });
        console.log('✅ FFmpeg binary verified working:', versionOutput.split('\n')[0]);
      } catch (error) {
        throw new Error(`FFmpeg verification failed: ${error}`);
      }

      this.ffmpegPath = ffmpegBinaryPath;
      this.isDownloading = false;
      return ffmpegBinaryPath;
      
    } catch (error) {
      this.isDownloading = false;
      console.error('❌ FFmpeg download failed:', error);
      throw new Error(`FFmpeg setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async downloadLinuxFFmpeg(tempDir: string, ffmpegBinaryPath: string): Promise<void> {
    console.log('🐧 Downloading Linux FFmpeg ZIP binary...');
    
    // Download the ZIP file (no tar dependency needed)
    const zipPath = join(tempDir, 'ffmpeg.zip');
    const response = await fetch(FFMPEG_DOWNLOAD_URLS.linux);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    // Write ZIP file
    const buffer = await response.arrayBuffer();
    await fs.writeFile(zipPath, new Uint8Array(buffer));
    
    console.log('📦 Extracting FFmpeg from ZIP...');
    
    // Extract using built-in Node.js ZIP support (no external dependencies)
    try {
      // Import AdmZip dynamically to extract
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(zipPath);
      
      // Extract all files to temp directory
      zip.extractAllTo(tempDir, true);
      
      // Find the ffmpeg binary (should be directly in the ZIP)
      const extractedFiles = await fs.readdir(tempDir);
      const ffmpegFile = extractedFiles.find(file => file === 'ffmpeg' || file.startsWith('ffmpeg'));
      
      if (!ffmpegFile) {
        throw new Error('Could not find FFmpeg binary in extracted files');
      }
      
      const extractedFFmpegPath = join(tempDir, ffmpegFile);
      
      // Verify extracted binary exists
      await fs.access(extractedFFmpegPath);
      
      // Copy to expected location if different
      if (extractedFFmpegPath !== ffmpegBinaryPath) {
        await fs.copyFile(extractedFFmpegPath, ffmpegBinaryPath);
      }
      
      // Make executable
      await fs.chmod(ffmpegBinaryPath, 0o755);
      
      console.log('✅ Linux FFmpeg binary extracted and configured from ZIP');
      
      // Verify the binary works
      try {
        execSync(`${ffmpegBinaryPath} -version`, { stdio: 'pipe', timeout: 5000 });
        console.log('✅ FFmpeg binary verification successful');
      } catch (verifyError) {
        console.error('⚠️ FFmpeg binary verification failed:', verifyError);
        throw new Error(`FFmpeg binary verification failed: ${verifyError}`);
      }
      
    } catch (extractError) {
      console.error('❌ ZIP extraction failed:', extractError);
      throw new Error(`FFmpeg extraction failed: ${extractError}`);
    }
  }

  private async downloadMacOSFFmpeg(ffmpegBinaryPath: string): Promise<void> {
    console.log('🍎 Downloading macOS FFmpeg binary...');
    
    const response = await fetch(FFMPEG_DOWNLOAD_URLS.darwin);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    // Write binary directly
    const buffer = await response.arrayBuffer();
    await fs.writeFile(ffmpegBinaryPath, new Uint8Array(buffer));
    
    // Make executable
    await fs.chmod(ffmpegBinaryPath, 0o755);
    
    console.log('✅ macOS FFmpeg binary downloaded');
  }

  async createTransparentWebM(
    pngFramePaths: string[],
    outputPath: string,
    settings: { fps: number; size: number; duration?: number }
  ): Promise<void> {
    const ffmpegPath = await this.getFFmpegPath();
    
    console.log('🎬 Creating transparent WebM with FFmpeg...', {
      ffmpegPath,
      frameCount: pngFramePaths.length,
      settings
    });

    // Create frame list file for FFmpeg
    const frameListPath = '/tmp/frames.txt';
    const frameListContent = pngFramePaths
      .map(path => `file '${path}'`)
      .join('\n');
    
    await fs.writeFile(frameListPath, frameListContent);

    // CRITICAL: Calculate the correct frame rate for the desired duration
    // If we have 30 frames and want 3 seconds, we need 30/3 = 10 fps
    const frameCount = pngFramePaths.length;
    const targetDuration = settings.duration || 3; // Default to 3 seconds if not provided
    const effectiveFPS = frameCount / targetDuration;
    
    console.log('⏱️ Frame rate calculation:', {
      frameCount,
      targetDuration,
      effectiveFPS: effectiveFPS.toFixed(2),
      originalFPS: settings.fps
    });

    // Build FFmpeg command for transparent WebM with VP9
    // CRITICAL: Use yuva420p pixel format + auto-alt-ref 0 for alpha support
    const ffmpegArgs = [
      '-f', 'concat',
      '-safe', '0',
      '-i', frameListPath,
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuva420p',  // CRITICAL: yuva420p for alpha channel
      '-auto-alt-ref', '0',    // CRITICAL: Disable auto alt-ref for alpha
      '-lag-in-frames', '0',   // Reduce encoding delay
      '-error-resilient', '1', // Better for streaming
      '-crf', '30',            // Good quality balance for small files
      '-b:v', '200K',          // Target bitrate for Telegram emoji (balanced)
      '-r', effectiveFPS.toString(), // Use calculated effective FPS for correct duration
      '-s', `${settings.size}x${settings.size}`,
      '-y',                    // Overwrite output
      outputPath
    ];

    console.log('🔧 FFmpeg command:', `${ffmpegPath} ${ffmpegArgs.join(' ')}`);

    try {
      const command = `${ffmpegPath} ${ffmpegArgs.join(' ')}`;
      const output = execSync(command, { 
        timeout: 45000, // 45 second timeout (within Netlify's 60s limit)
        stdio: 'pipe',  // Capture output
        encoding: 'utf8'
      });
      
      console.log('✅ FFmpeg WebM creation completed');
      console.log('📋 FFmpeg output:', output.slice(-200)); // Last 200 chars of output
      
      // Verify output file exists and has content
      const stats = await fs.stat(outputPath);
      if (stats.size === 0) {
        throw new Error('Output WebM file is empty');
      }
      
      console.log('📊 WebM file created:', {
        path: outputPath,
        size: stats.size
      });
      
    } catch (error) {
      console.error('❌ FFmpeg command failed:', error);
      throw new Error(`FFmpeg encoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cleanup(): Promise<void> {
    // Cleanup only temporary frame files, preserve FFmpeg binary for reuse
    try {
      await fs.rm('/tmp/frames.txt', { force: true });
      // Note: Intentionally NOT deleting /tmp/ffmpeg to preserve binary for subsequent invocations
      // Netlify will clean /tmp automatically when the function container is recycled
    } catch {
      // Ignore cleanup errors
    }
  }
}

export default FFmpegManager;
