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
    const totalFrames = Math.floor(fps * duration);
    const frames: Blob[] = [];

    console.log('📹 Starting frame export:', { fps, duration, size, totalFrames });

    // Store original settings
    const originalSize = { 
      width: this.renderer.domElement.clientWidth, 
      height: this.renderer.domElement.clientHeight 
    };
    const originalAspect = this.camera.aspect;
    const originalRotation = this.turntable.rotation.y;
    const originalPosition = this.camera.position.clone();
    const originalFov = this.camera.fov;

    console.log('💾 Stored original settings:', { originalSize, originalAspect, originalRotation, originalPosition, originalFov });

    try {
      // Set high-resolution capture size for better quality
      const exportSize = Math.max(512, size * 2); // Use at least 512px for quality
      this.renderer.setSize(exportSize, exportSize);
      this.camera.aspect = 1;
      
      // Adjust camera for emoji framing - zoom in to fill the frame better
      if (size <= 100) {
        // For emoji export, zoom in closer and adjust FOV for tighter framing
        this.camera.fov = 35; // Tighter FOV to fill frame better
        this.camera.position.set(0, 0, 5.5); // Move closer
      }
      
      this.camera.updateProjectionMatrix();

      console.log('🎯 Set export size:', { 
        exportSize, 
        finalOutputSize: size,
        fov: this.camera.fov,
        position: this.camera.position.toArray()
      });

      for (let i = 0; i < totalFrames; i++) {
        // Set rotation for this frame
        const angle = (2 * Math.PI * i) / totalFrames;
        this.turntable.rotation.y = angle;

        // Render frame
        this.renderer.render(this.scene, this.camera);

        // Capture frame as blob with transparency preserved
        const blob = await this.captureFrame(size, exportSize);
        frames.push(blob);
        
        if (i === 0 || i === totalFrames - 1 || i % 10 === 0) {
          console.log(`📸 Captured frame ${i + 1}/${totalFrames}, size: ${blob.size} bytes, angle: ${angle.toFixed(2)}`);
        }
      }

      console.log('✅ Frame export complete:', { totalFrames: frames.length });
      return frames;
    } finally {
      // Restore original settings
      this.renderer.setSize(originalSize.width, originalSize.height);
      this.camera.aspect = originalAspect;
      this.camera.fov = originalFov;
      this.camera.position.copy(originalPosition);
      this.camera.updateProjectionMatrix();
      this.turntable.rotation.y = originalRotation;
      
      console.log('🔄 Restored original settings');
    }
  }

  private captureFrame(targetSize?: number, renderSize?: number): Promise<Blob> {
    return new Promise((resolve) => {
      if (targetSize && renderSize && targetSize !== renderSize) {
        // Need to resize the captured frame
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d')!;
        
        this.renderer.domElement.toBlob((blob) => {
          if (!blob) {
            resolve(blob!);
            return;
          }
          
          const img = new Image();
          img.onload = () => {
            // Clear with transparent background
            ctx.clearRect(0, 0, targetSize, targetSize);
            
            // Draw the high-res image scaled down with anti-aliasing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetSize, targetSize);
            
            canvas.toBlob((resizedBlob) => {
              resolve(resizedBlob!);
            }, 'image/png');
          };
          img.src = URL.createObjectURL(blob);
        }, 'image/png');
      } else {
        // Direct capture
        this.renderer.domElement.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      }
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
    
    const frames = await this.exportFrames(settings);
    
    if (!('VideoEncoder' in window)) {
      throw new Error('WebCodecs not supported in this browser');
    }

    const { fps, size } = settings;
    
    // Use WebCodecs with webm-muxer approach (more reliable than MediaRecorder)
    console.log('🎥 Using WebCodecs with webm-muxer approach...');
    return await this.exportWithWebCodecs(frames, fps, size);
  }

  private async exportWithWebCodecs(frames: Blob[], fps: number, size: number): Promise<Blob> {
    // Import webm-muxer dynamically
    const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
    
    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: {
        codec: 'V_VP9',
        width: size,
        height: size,
        frameRate: fps,
        alpha: true, // Enable alpha channel for transparency
      }
    });

    const encoder = new (window as any).VideoEncoder({
      output: (chunk: any, meta: any) => {
        muxer.addVideoChunk(chunk, meta);
        console.log(`📝 WebCodecs chunk: ${chunk.byteLength} bytes, type: ${chunk.type}, timestamp: ${chunk.timestamp}`);
      },
      error: (e: any) => {
        console.error('❌ VideoEncoder error:', e);
      }
    });

    // Use VP9 profile 1 with alpha support for transparency
    encoder.configure({
      codec: 'vp09.01.10.08', // VP9 Profile 1 with alpha support
      width: size,
      height: size,
      alpha: 'keep', // Preserve alpha channel
      bitrate: 1_500_000, // Balanced bitrate for good quality and file size
      framerate: fps,
      latencyMode: 'quality' // Prioritize quality over speed
    });

    console.log('🎬 Encoding frames with WebCodecs (VP9 + Alpha)...');

    // Encode frames
    for (let i = 0; i < frames.length; i++) {
      const imageBitmap = await createImageBitmap(frames[i]);
      
      // Create VideoFrame directly from ImageBitmap with alpha preservation
      const videoFrame = new (window as any).VideoFrame(imageBitmap, {
        timestamp: (i * 1000000) / fps, // microseconds
        duration: 1000000 / fps, // frame duration in microseconds
        alpha: 'keep' // Preserve transparency
      });
      
      encoder.encode(videoFrame, { keyFrame: i === 0 });
      videoFrame.close();
      imageBitmap.close();
      
      if (i % 10 === 0) {
        console.log(`🎞️ Encoded frame ${i + 1}/${frames.length}, timestamp: ${videoFrame.timestamp}`);
      }
    }

    console.log('⏳ Flushing encoder...');
    await encoder.flush();
    encoder.close();
    
    console.log('📦 Finalizing muxer...');
    muxer.finalize();

    const blob = new Blob([target.buffer], { type: 'video/webm' });
    console.log('✅ WebCodecs+Muxer WebM complete (with alpha):', { 
      size: blob.size, 
      type: blob.type,
      hasAlpha: true,
      targetSize: size
    });
    
    return blob;
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
