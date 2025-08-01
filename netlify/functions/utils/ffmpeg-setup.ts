import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

// FFmpeg binary management for Netlify Functions
// Since Netlify doesn't allow bundling large binaries, we need to download at runtime

const FFMPEG_VERSION = '6.1.1';
const FFMPEG_DOWNLOAD_URLS = {
  // Use johnvansickle static builds for better Linux compatibility in Lambda
  linux: `https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz`,
  darwin: `https://github.com/eugeneware/ffmpeg-static/releases/download/b${FFMPEG_VERSION}/darwin-x64`,
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
    console.log('🐧 Downloading Linux FFmpeg static build...');
    
    // Download the tar.xz file
    const tarPath = join(tempDir, 'ffmpeg.tar.xz');
    const response = await fetch(FFMPEG_DOWNLOAD_URLS.linux);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    // Write tar file
    const buffer = await response.arrayBuffer();
    await fs.writeFile(tarPath, new Uint8Array(buffer));
    
    console.log('📦 Extracting FFmpeg from tar.xz...');
    
    // Extract using tar (available in Lambda environment)
    try {
      execSync(`cd ${tempDir} && tar -xJf ffmpeg.tar.xz`, { timeout: 30000 });
      
      // Find the extracted ffmpeg binary (usually in ffmpeg-*-amd64-static/ffmpeg)
      const extractedDirs = await fs.readdir(tempDir);
      const ffmpegDir = extractedDirs.find(dir => dir.startsWith('ffmpeg-') && dir.includes('static'));
      
      if (!ffmpegDir) {
        throw new Error('Could not find extracted FFmpeg directory');
      }
      
      const extractedFFmpegPath = join(tempDir, ffmpegDir, 'ffmpeg');
      
      // Verify extracted binary exists
      await fs.access(extractedFFmpegPath);
      
      // Copy to expected location
      await fs.copyFile(extractedFFmpegPath, ffmpegBinaryPath);
      
      // Make executable
      await fs.chmod(ffmpegBinaryPath, 0o755);
      
      console.log('✅ Linux FFmpeg binary extracted and configured');
      
    } catch (extractError) {
      console.error('❌ Tar extraction failed:', extractError);
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
    settings: { fps: number; size: number }
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
      '-crf', '30',            // Good quality balance
      '-b:v', '200K',          // Target bitrate
      '-r', settings.fps.toString(),
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
    // Cleanup temp files (Netlify will clean /tmp automatically, but good practice)
    try {
      await fs.rm('/tmp/ffmpeg', { recursive: true, force: true });
      await fs.rm('/tmp/frames.txt', { force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

export default FFmpegManager;
