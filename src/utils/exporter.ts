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

    console.log('💾 Stored original settings:', { originalSize, originalAspect, originalRotation });

    try {
      // Set capture size
      this.renderer.setSize(size, size);
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();

      console.log('🎯 Set export size:', { width: size, height: size });

      for (let i = 0; i < totalFrames; i++) {
        // Set rotation for this frame
        const angle = (2 * Math.PI * i) / totalFrames;
        this.turntable.rotation.y = angle;

        // Render frame
        this.renderer.render(this.scene, this.camera);

        // Capture frame as blob
        const blob = await this.captureFrame();
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
      this.camera.updateProjectionMatrix();
      this.turntable.rotation.y = originalRotation;
      
      console.log('🔄 Restored original settings');
    }
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
    
    const frames = await this.exportFrames(settings);
    
    if (!('VideoEncoder' in window)) {
      throw new Error('WebCodecs not supported in this browser');
    }

    const { fps, size } = settings;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    console.log('🎥 Setting up VideoEncoder...');

    // Setup WebM encoder
    const chunks: any[] = [];
    const encoder = new (window as any).VideoEncoder({
      output: (chunk: any) => {
        chunks.push(chunk);
        console.log(`📝 Encoded chunk ${chunks.length}, size: ${chunk.byteLength} bytes`);
      },
      error: (e: any) => {
        console.error('❌ VideoEncoder error:', e);
      }
    });

    encoder.configure({
      codec: 'vp09.00.10.08',
      width: size,
      height: size,
      bitrate: 1_000_000,
      framerate: fps,
      latencyMode: 'realtime'
    });

    console.log('🎬 Encoding frames...');

    // Encode frames
    for (let i = 0; i < frames.length; i++) {
      // Convert blob to ImageBitmap
      const imageBitmap = await createImageBitmap(frames[i]);
      
      // Draw to canvas to get consistent format
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(imageBitmap, 0, 0);
      
      // Create VideoFrame from canvas
      const videoFrame = new (window as any).VideoFrame(canvas, {
        timestamp: (i * 1000000) / fps // microseconds
      });
      
      encoder.encode(videoFrame, { keyFrame: i === 0 });
      videoFrame.close();
      imageBitmap.close();
      
      if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
        console.log(`🎞️ Encoded frame ${i + 1}/${frames.length}`);
      }
    }

    console.log('⏳ Flushing encoder...');
    await encoder.flush();
    encoder.close();

    console.log('📦 Combining chunks:', { totalChunks: chunks.length });

    // Combine chunks into WebM blob
    const webmData = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.byteLength, 0));
    let offset = 0;
    for (const chunk of chunks) {
      webmData.set(new Uint8Array(chunk.data), offset);
      offset += chunk.byteLength;
    }

    const blob = new Blob([webmData], { type: 'video/webm' });
    console.log('✅ WebM export complete:', { size: blob.size, type: blob.type });
    
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
