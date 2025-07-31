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
    const originalRotation = this.turntable.rotation.y;
    const originalClearColor = this.renderer.getClearColor(new THREE.Color());
    const originalClearAlpha = this.renderer.getClearAlpha();

    console.log('💾 Stored original settings:', { 
      originalRotation,
      originalClearColor: originalClearColor.getHex(),
      originalClearAlpha
    });

    try {
      // DON'T change camera or renderer size - capture exactly what user sees
      // Just ensure transparent background for capture
      this.renderer.setClearColor(0x000000, 0); // Transparent background

      console.log('🎯 Export settings:', { 
        currentRendererSize: {
          width: this.renderer.domElement.width,
          height: this.renderer.domElement.height
        },
        targetSize: size,
        cameraPosition: this.camera.position,
        aspect: this.camera.aspect 
      });

      for (let i = 0; i < totalFrames; i++) {
        // Set rotation for this frame
        const angle = (2 * Math.PI * i) / totalFrames;
        this.turntable.rotation.y = angle;

        // Force transparent background for this frame
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.clear();
        
        // Render frame exactly as user sees it
        this.renderer.render(this.scene, this.camera);

        // Capture frame as blob with alpha preserved
        const blob = await this.captureFrame();
        frames.push(blob);
        
        // For the first frame, let's debug what we captured
        if (i === 0) {
          const debugBitmap = await createImageBitmap(blob);
          console.log(`🔍 First captured frame analysis:`, {
            size: `${debugBitmap.width}x${debugBitmap.height}`,
            blobSize: blob.size,
            rendererSize: `${this.renderer.domElement.width}x${this.renderer.domElement.height}`,
            cameraPosition: this.camera.position,
            turntableRotation: this.turntable.rotation.y
          });
          
          // Create a test canvas to check if we actually have content
          const testCanvas = document.createElement('canvas');
          testCanvas.width = Math.min(debugBitmap.width, 100);
          testCanvas.height = Math.min(debugBitmap.height, 100);
          const testCtx = testCanvas.getContext('2d')!;
          testCtx.drawImage(debugBitmap, 0, 0, testCanvas.width, testCanvas.height);
          
          // Sample some pixels to see if we have actual content
          const imageData = testCtx.getImageData(0, 0, testCanvas.width, testCanvas.height);
          const pixels = imageData.data;
          let nonTransparentPixels = 0;
          let totalPixels = pixels.length / 4;
          
          for (let j = 0; j < pixels.length; j += 4) {
            const alpha = pixels[j + 3];
            if (alpha > 0) nonTransparentPixels++;
          }
          
          console.log(`🎨 Frame content analysis:`, {
            totalPixels,
            nonTransparentPixels,
            hasContent: nonTransparentPixels > 0,
            contentPercentage: ((nonTransparentPixels / totalPixels) * 100).toFixed(1) + '%'
          });
          
          debugBitmap.close();
        }
        
        if (i === 0 || i === totalFrames - 1 || i % 10 === 0) {
          console.log(`📸 Captured frame ${i + 1}/${totalFrames}, size: ${blob.size} bytes, angle: ${angle.toFixed(2)}`);
        }
      }

      console.log('✅ Frame export complete:', { totalFrames: frames.length });
      return frames;
    } finally {
      // Restore original settings
      this.turntable.rotation.y = originalRotation;
      this.renderer.setClearColor(originalClearColor, originalClearAlpha);
      
      console.log('🔄 Restored original settings');
    }
  }

  private captureFrame(): Promise<Blob> {
    return new Promise((resolve) => {
      // Make sure we render again to ensure frame is up to date
      this.renderer.render(this.scene, this.camera);
      
      // Capture the entire canvas as it currently appears
      this.renderer.domElement.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png'); // PNG preserves alpha
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
    
    console.log('🔍 Setting up muxer with alpha support...');
    
    const muxer = new Muxer({
      target,
      video: {
        codec: 'V_VP9',
        width: size,
        height: size,
        frameRate: fps,
        alpha: true // Force alpha channel
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

    // Try VP9 with alpha first, fallback if needed
    let encoderConfigured = false;
    
    // Try VP9 Profile 1 with alpha support
    try {
      const config = {
        codec: 'vp09.01.10.08', // VP9 Profile 1 supports alpha
        width: size,
        height: size,
        bitrate: 1_000_000, // Higher bitrate for quality
        framerate: fps,
        alpha: 'keep',
        latencyMode: 'quality'
      };
      
      encoder.configure(config);
      encoderConfigured = true;
      console.log('🎬 Encoding with VP9 Profile 1 + alpha...');
    } catch (error) {
      console.warn('⚠️ VP9 Profile 1 with alpha failed:', error);
    }

    // Fallback to VP9 Profile 0 without explicit alpha
    if (!encoderConfigured) {
      try {
        const config = {
          codec: 'vp09.00.10.08',
          width: size,
          height: size,
          bitrate: 1_000_000,
          framerate: fps,
          latencyMode: 'quality'
        };
        
        encoder.configure(config);
        encoderConfigured = true;
        console.log('🎬 Encoding with VP9 Profile 0 (fallback)...');
      } catch (error) {
        throw new Error('Failed to configure VP9 encoder: ' + error);
      }
    }

    // Encode frames with simple, direct scaling (no 4x upsampling)
    for (let i = 0; i < frames.length; i++) {
      // Get the source frame
      const sourceBitmap = await createImageBitmap(frames[i]);
      
      console.log(`🖼️ Frame ${i + 1} source:`, {
        width: sourceBitmap.width,
        height: sourceBitmap.height
      });
      
      // Create target canvas at exact output size
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { alpha: true })!; // Force alpha context
      
      // CRITICAL: Clear canvas to fully transparent
      ctx.clearRect(0, 0, size, size);
      
      // Calculate scaling to fit the coin nicely (80% of frame)
      const coinFillRatio = 0.8;
      const targetCoinSize = size * coinFillRatio;
      const scale = Math.min(targetCoinSize / sourceBitmap.width, targetCoinSize / sourceBitmap.height);
      
      const scaledWidth = sourceBitmap.width * scale;
      const scaledHeight = sourceBitmap.height * scale;
      const offsetX = (size - scaledWidth) / 2;
      const offsetY = (size - scaledHeight) / 2;
      
      console.log(`📐 Scaling frame ${i + 1}:`, {
        scale: scale.toFixed(3),
        scaledSize: `${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`,
        offset: `${offsetX.toFixed(1)}, ${offsetY.toFixed(1)}`,
        targetSize: `${size}x${size}`,
        coinFillRatio
      });
      
      // Draw with high quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(sourceBitmap, offsetX, offsetY, scaledWidth, scaledHeight);
      sourceBitmap.close();
      
      // Debug first frame transparency
      if (i === 0) {
        // Check if we have transparency
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        let transparentPixels = 0;
        let opaquePixels = 0;
        
        for (let j = 0; j < pixels.length; j += 4) {
          const alpha = pixels[j + 3];
          if (alpha === 0) transparentPixels++;
          else if (alpha === 255) opaquePixels++;
        }
        
        console.log('🔍 First frame transparency check:', {
          totalPixels: pixels.length / 4,
          transparentPixels,
          opaquePixels,
          hasTransparency: transparentPixels > 0
        });
        
        // Create preview
        canvas.toBlob((testBlob) => {
          const url = URL.createObjectURL(testBlob!);
          console.log('🔍 First frame preview URL:', url);
        }, 'image/png');
      }
      
      // Create VideoFrame with alpha support
      const videoFrame = new (window as any).VideoFrame(canvas, {
        timestamp: (i * 1000000) / fps,
        duration: 1000000 / fps,
        alpha: 'keep' // Preserve alpha channel
      });
      
      encoder.encode(videoFrame, { keyFrame: i === 0 });
      videoFrame.close();
      
      if (i % 10 === 0) {
        console.log(`🎞️ Encoded frame ${i + 1}/${frames.length}, scale: ${scale.toFixed(2)}`);
      }
    }

    console.log('⏳ Flushing encoder...');
    await encoder.flush();
    encoder.close();
    
    console.log('📦 Finalizing muxer...');
    muxer.finalize();

    const blob = new Blob([target.buffer], { type: 'video/webm' });
    console.log('✅ WebCodecs+Muxer WebM complete:', { 
      size: blob.size, 
      type: blob.type,
      alphaEnabled: true,
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
