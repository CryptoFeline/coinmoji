import { zip } from 'fflate';
import * as THREE from 'three';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
}

export class CoinExporter {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private turntable: THREE.Group;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    turntable: THREE.Group
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.turntable = turntable;
  }

  async exportFrames(settings: ExportSettings): Promise<Blob[]> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.round(fps * duration);
    const rotationsPerSecond = 1; // One full rotation per second
    const frames: Blob[] = [];
    
    console.log(`🎬 Exporting ${totalFrames} frames at ${size}x${size}...`);
    
    // Create high-resolution canvas for better quality
    const hiResSize = Math.min(512, size * 2); // 2x resolution, max 512px
    const canvas = document.createElement('canvas');
    canvas.width = hiResSize;
    canvas.height = hiResSize;
    const ctx = canvas.getContext('2d')!;
    
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Store original turntable rotation
    const originalRotation = this.turntable.rotation.y;
    
    for (let frame = 0; frame < totalFrames; frame++) {
      // Calculate rotation for this frame
      const progress = frame / totalFrames;
      const rotation = progress * rotationsPerSecond * 2 * Math.PI;
      
      // Set turntable rotation
      this.turntable.rotation.y = rotation;
      
      // Render the scene
      this.renderer.setSize(hiResSize, hiResSize, false);
      this.renderer.render(this.scene, this.camera);
      
      // Get the rendered image
      const coinCanvas = this.renderer.domElement;
      
      // Clear with transparent background (not black!)
      ctx.clearRect(0, 0, hiResSize, hiResSize);
      
      // Draw the rendered coin
      ctx.drawImage(coinCanvas, 0, 0);
      
      // Convert to blob with high quality
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/png', // Use PNG to preserve transparency
          1.0 // Maximum quality
        );
      });
      
      frames.push(blob);
      
      if (frame % 10 === 0) {
        console.log(`📸 Exported frame ${frame + 1}/${totalFrames}, rotation: ${(rotation * 180 / Math.PI).toFixed(1)}°`);
      }
    }
    
    // Restore original rotation
    this.turntable.rotation.y = originalRotation;
    
    console.log(`✅ Exported ${frames.length} high-res frames`);
    return frames;
  }

  private captureFrame(): Promise<Blob> {
    return new Promise((resolve) => {
      this.renderer.domElement.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  async exportAsZip(settings: ExportSettings): Promise<Blob> {
    const frames = await this.exportFrames(settings);
    
    const files: Record<string, Uint8Array> = {};
    
    for (let i = 0; i < frames.length; i++) {
      const frameNumber = String(i).padStart(4, '0');
      const fileName = `frame_${frameNumber}.png`;
      files[fileName] = new Uint8Array(await frames[i].arrayBuffer());
    }

    return new Promise((resolve, reject) => {
      zip(files, { level: 6 }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(new Blob([data], { type: 'application/zip' }));
        }
      });
    });
  }

  async exportAsWebM(settings: ExportSettings): Promise<Blob> {
    console.log('🎬 Starting WebM export with settings:', settings);
    
    // Create animated WebM using simpler canvas-to-WebM approach
    return await this.createSimpleWebM(settings);
  }

  private async createSimpleWebM(settings: ExportSettings): Promise<Blob> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.round(fps * duration);
    
    console.log(`🎬 Creating WebM: ${totalFrames} frames at ${fps}fps for ${duration}s`);
    
    // Create a single canvas for the entire animation
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Check if MediaRecorder is available and supports WebM
    if (!('MediaRecorder' in window)) {
      throw new Error('MediaRecorder not supported');
    }
    
    const stream = canvas.captureStream(fps);
    
    // Find supported WebM codec
    const mimeTypes = [
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9',
      'video/webm'
    ];
    
    let mimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        console.log(`✅ Using supported codec: ${type}`);
        break;
      }
    }
    
    if (!mimeType) {
      throw new Error('No supported WebM codec found');
    }
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 500000 // 500kbps for small files
    });
    
    const chunks: BlobPart[] = [];
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error('❌ WebM recording timeout');
        reject(new Error('Recording timeout'));
      }, (duration + 5) * 1000);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log(`📹 Recorded chunk: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        clearTimeout(timeout);
        const blob = new Blob(chunks, { type: mimeType });
        console.log(`✅ WebM created: ${blob.size} bytes, type: ${blob.type}`);
        resolve(blob);
      };
      
      mediaRecorder.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ MediaRecorder error:', error);
        reject(error);
      };
      
      // Store original rotation
      const originalRotation = this.turntable.rotation.y;
      
      // Start recording
      mediaRecorder.start();
      console.log('🎬 Recording started...');
      
      let frameCount = 0;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        if (progress < 1) {
          // Calculate rotation based on time elapsed
          const rotation = progress * 2 * Math.PI; // One full rotation
          this.turntable.rotation.y = rotation;
          
          // Clear canvas with white background (important for stickers!)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);
          
          // Render THREE.js scene to temporary canvas
          this.renderer.setSize(size, size, false);
          this.renderer.render(this.scene, this.camera);
          
          // Draw the rendered scene onto our recording canvas
          ctx.drawImage(this.renderer.domElement, 0, 0);
          
          frameCount++;
          if (frameCount % 10 === 0) {
            console.log(`🎞️ Frame ${frameCount}, progress: ${(progress * 100).toFixed(1)}%`);
          }
          
          // Continue animation
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          console.log(`🛑 Animation complete after ${frameCount} frames`);
          this.turntable.rotation.y = originalRotation;
          
          // Stop recording after a short delay to ensure last frames are captured
          setTimeout(() => {
            mediaRecorder.stop();
          }, 100);
        }
      };
      
      // Start the animation
      animate();
    });
  }

  private async exportFramesAsWebM(settings: ExportSettings): Promise<Blob> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.round(fps * duration);
    
    console.log(`📸 Frame-based export: ${totalFrames} frames`);
    
    // Create canvas for individual frames
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Store original turntable rotation
    const originalRotation = this.turntable.rotation.y;
    
    const frames: string[] = [];
    
    for (let frame = 0; frame < totalFrames; frame++) {
      // Calculate rotation for this frame
      const progress = frame / totalFrames;
      const rotation = progress * 2 * Math.PI; // One full rotation
      
      // Set turntable rotation
      this.turntable.rotation.y = rotation;
      
      // Render the scene
      this.renderer.setSize(size, size, false);
      this.renderer.render(this.scene, this.camera);
      
      // Draw to canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(this.renderer.domElement, 0, 0, size, size);
      
      // Convert to base64
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      frames.push(dataUrl);
      
      if (frame % 10 === 0) {
        console.log(`📸 Captured frame ${frame + 1}/${totalFrames}`);
      }
    }
    
    // Restore original rotation
    this.turntable.rotation.y = originalRotation;
    
    // Create a simple WebM-like file (actually will be a series of PNGs)
    // For now, let's just return the last frame as PNG since WebM creation is complex
    const lastFrameData = frames[frames.length - 1];
    const response = await fetch(lastFrameData);
    const blob = await response.blob();
    
    console.log('✅ Frame-based export complete (PNG fallback):', blob.size);
    return blob;
  }

  private async exportWithDirectCanvas(settings: ExportSettings): Promise<Blob> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.round(fps * duration);
    
    console.log(`🎬 Direct canvas recording: ${totalFrames} frames at ${fps}fps for ${duration}s`);
    
    // Create high-resolution canvas
    const canvas = document.createElement('canvas');
    canvas.width = size * 2; // 2x for quality
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d')!;
    
    // Get canvas stream
    const stream = canvas.captureStream(fps);
    
    // Check MediaRecorder support for different codecs
    const supportedTypes = [
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9', 
      'video/webm'
    ];
    
    let mimeType = '';
    for (const type of supportedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        console.log(`✅ Using supported MIME type: ${type}`);
        break;
      }
    }
    
    if (!mimeType) {
      throw new Error('No supported WebM codec found');
    }
    
    // Set up MediaRecorder with Telegram-compatible settings
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 800000 // Lower bitrate for smaller files
    });

    const chunks: BlobPart[] = [];
    
    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        console.error('❌ MediaRecorder timeout after', (duration + 3), 'seconds');
        reject(new Error('MediaRecorder timeout'));
      }, (duration + 3) * 1000); // duration + 3 seconds buffer
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log(`📝 MediaRecorder chunk: ${event.data.size} bytes`);
        }
      };

      mediaRecorder.onstop = () => {
        clearTimeout(timeout);
        const blob = new Blob(chunks, { type: mimeType });
        console.log('✅ Direct canvas WebM complete:', { size: blob.size, type: blob.type, mimeType });
        resolve(blob);
      };

      mediaRecorder.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ MediaRecorder error:', error);
        reject(error);
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      console.log('� MediaRecorder started, animating coin...');

      // Store original turntable rotation
      const originalRotation = this.turntable.rotation.y;
      
      // Animate the turntable and draw frames
      let frameIndex = 0;
      const frameDuration = 1000 / fps; // ms per frame
      
      const animate = () => {
        if (frameIndex < totalFrames) {
          // Calculate rotation for this frame
          const progress = frameIndex / totalFrames;
          const rotation = progress * 2 * Math.PI; // One full rotation
          
          // Set turntable rotation
          this.turntable.rotation.y = rotation;
          
          // Render the scene to offscreen canvas
          this.renderer.setSize(size * 2, size * 2, false);
          this.renderer.render(this.scene, this.camera);
          
          // Draw to our recording canvas with WHITE background (no transparency!)
          ctx.fillStyle = '#ffffff'; // White background for sticker compatibility
          ctx.fillRect(0, 0, size * 2, size * 2);
          ctx.drawImage(this.renderer.domElement, 0, 0);
          
          if (frameIndex % 10 === 0) {
            console.log(`🎞️ Frame ${frameIndex + 1}/${totalFrames}, rotation: ${(rotation * 180 / Math.PI).toFixed(1)}°`);
          }
          
          frameIndex++;
          setTimeout(animate, frameDuration);
        } else {
          console.log('🛑 Animation complete, stopping recording...');
          // Restore original rotation
          this.turntable.rotation.y = originalRotation;
          mediaRecorder.stop();
        }
      };

      // Start animation
      animate();
    });
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Telegram WebApp API helpers
export const sendToTelegram = async (blob: Blob, initData: string) => {
  console.log('📤 Sending to Telegram:', { blobSize: blob.size, blobType: blob.type });
  
  // Extract user ID from initData
  const userId = getTelegramUserId(initData);
  console.log('👤 User ID extracted:', userId);
  
  // Convert blob to base64
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  console.log('🔄 Converted to base64:', { originalSize: blob.size, base64Length: base64.length });

  try {
    const response = await fetch(`/.netlify/functions/send-file?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Telegram-InitData': initData,
      },
      body: base64,
    });

    console.log('📡 Response received:', { status: response.status, statusText: response.statusText });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Send to Telegram failed:', errorText);
      throw new Error('Failed to send file to Telegram');
    }

    const result = await response.json();
    console.log('✅ Send to Telegram success:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending to Telegram:', error);
    throw error;
  }
};

export const createCustomEmoji = async (
  blob: Blob, 
  initData: string, 
  emojiList: string[] = ['🪙'],
  setTitle: string = 'Custom Coinmoji'
) => {
  console.log('🎭 Creating custom emoji:', { 
    blobSize: blob.size, 
    blobType: blob.type, 
    emojiList, 
    setTitle,
    initDataLength: initData.length 
  });

  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  console.log('🔄 Converted to base64 for emoji:', { 
    originalSize: blob.size, 
    base64Length: base64.length,
    base64Sample: base64.substring(0, 50) + '...'
  });

  const userId = getTelegramUserId(initData);
  console.log('👤 User ID for emoji:', userId);

  const payload = {
    initData,
    user_id: userId,
    set_title: setTitle,
    emoji_list: emojiList,
    webm_base64: base64,
  };

  console.log('📝 Emoji creation payload:', {
    user_id: payload.user_id,
    set_title: payload.set_title,
    emoji_list: payload.emoji_list,
    webm_base64_length: payload.webm_base64.length,
    initData_length: payload.initData.length
  });

  try {
    console.log('📡 Sending emoji creation request...');
    const response = await fetch('/.netlify/functions/create-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Emoji creation response:', { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Emoji creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error('Failed to create custom emoji');
    }

    const result = await response.json();
    console.log('✅ Emoji creation success:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating custom emoji:', error);
    throw error;
  }
};

// Helper to extract user ID from Telegram initData
const getTelegramUserId = (initData: string): number => {
  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get('user') || '{}');
  return user.id;
};
