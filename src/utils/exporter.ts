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

  private async exportFrames(settings: ExportSettings): Promise<Blob[]> {
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
        codec: 'V_VP8', // Use VP8 for better compatibility
        width: size,
        height: size,
        frameRate: fps,
      },
      firstTimestampBehavior: 'offset'
    });

    const encoder = new (window as any).VideoEncoder({
      output: (chunk: any, meta: any) => {
        muxer.addVideoChunk(chunk, meta);
        console.log(`📝 WebCodecs chunk: ${chunk.byteLength} bytes, type: ${chunk.type}, timestamp: ${chunk.timestamp}`);
      },
      error: (e: any) => {
        console.error('❌ VideoEncoder error:', e);
        throw e;
      }
    });

    // Use VP8 codec for better compatibility with Telegram
    encoder.configure({
      codec: 'vp8', // Simpler VP8 instead of VP9
      width: size,
      height: size,
      bitrate: 1_500_000, // Good quality for small files
      framerate: fps,
      alpha: 'discard' // Remove alpha channel for smaller files
    });

    console.log('🎬 Encoding frames with WebCodecs (VP8)...');

    // Encode frames with proper timing
    for (let i = 0; i < frames.length; i++) {
      const imageBitmap = await createImageBitmap(frames[i]);
      
      // Calculate precise timestamp in microseconds
      const timestamp = Math.floor((i * 1000000) / fps);
      const duration = Math.floor(1000000 / fps);
      
      // Create VideoFrame directly from ImageBitmap
      const videoFrame = new (window as any).VideoFrame(imageBitmap, {
        timestamp,
        duration
      });
      
      encoder.encode(videoFrame, { keyFrame: i % 30 === 0 }); // Keyframe every 30 frames
      videoFrame.close();
      imageBitmap.close();
      
      if (i % 10 === 0) {
        console.log(`🎞️ Encoded frame ${i + 1}/${frames.length}, timestamp: ${timestamp}μs`);
      }
    }

    console.log('⏳ Flushing encoder...');
    await encoder.flush();
    encoder.close();
    
    console.log('📦 Finalizing muxer...');
    muxer.finalize();

    const blob = new Blob([target.buffer], { type: 'video/webm; codecs="vp8"' });
    console.log('✅ WebCodecs+Muxer WebM complete:', { size: blob.size, type: blob.type });
    
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
