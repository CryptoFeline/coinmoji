import { zip } from 'fflate';
import * as THREE from 'three';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
}

// Debug logging helper for Telegram environment
const debugLog = async (message: string, data?: any) => {
  try {
    console.log(message, data); // Still log to console for non-Telegram environments
    
    // Also send to Netlify function for Telegram debugging
    await fetch('/.netlify/functions/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        data,
        timestamp: Date.now()
      })
    }).catch(() => {}); // Silent fail if function not available
  } catch (error) {
    console.log(message, data); // Fallback to console only
  }
};

export class CoinExporter {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private turntable: THREE.Group;

  constructor(
    scene: THREE.Scene,
    _camera: THREE.PerspectiveCamera, // Keep for API compatibility but don't use
    renderer: THREE.WebGLRenderer,
    turntable: THREE.Group
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this.turntable = turntable;
  }

  async exportFrames(settings: ExportSettings): Promise<Blob[]> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.floor(fps * duration);
    
    // Limit frames more aggressively to prevent stack overflow
    // Max 30 frames but keep the SAME DURATION for proper timing
    const maxFrames = 30;
    const actualFrames = Math.min(totalFrames, maxFrames);
    
    // CRITICAL: Keep original duration even with fewer frames
    // This will slow down the animation to match the 3-second window
    const actualDuration = duration; // Always use full duration
    const effectiveFPS = actualFrames / actualDuration; // Slower effective FPS
    
    const frames: Blob[] = [];

    console.log('📹 Starting frame export (optimized timing for 3-second window):', { 
      fps, 
      duration, 
      size, 
      requestedFrames: totalFrames, 
      actualFrames,
      maxAllowed: maxFrames,
      effectiveFPS: effectiveFPS.toFixed(2),
      actualDuration
    });

    // Store original rotation (we don't touch the live renderer anymore)
    const originalRotation = this.turntable.rotation.y;

    console.log('💾 Stored original rotation:', originalRotation);

    const prevBackground = this.scene.background;
    try {
      // CRITICAL: Set scene background to null for transparency
      this.scene.background = null;
      
      // Create OFFSCREEN renderer for export (doesn't affect live view!)
      const captureSize = 512; // High resolution for better quality
      console.log('🎨 Creating offscreen renderer...');
      
      const offscreenRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false // CRITICAL for transparency
      });
      offscreenRenderer.setSize(captureSize, captureSize);
      offscreenRenderer.setClearColor(0x000000, 0); // Completely transparent background
      offscreenRenderer.outputColorSpace = THREE.SRGBColorSpace;
      
      // CRITICAL: Ensure renderer actually uses alpha
      offscreenRenderer.shadowMap.enabled = false; // Disable shadows that can interfere
      offscreenRenderer.autoClear = true;

      // Create dedicated camera for export with perfect coin framing
      const exportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      // Position camera much closer to make coin fill more of the frame
      exportCamera.position.set(0, 0, 2.8); // Even closer for bigger coin in frame
      exportCamera.lookAt(0, 0, 0);

      console.log('🎯 Created offscreen renderer:', { 
        size: captureSize, 
        transparent: true,
        cameraPosition: exportCamera.position.toArray()
      });

      for (let i = 0; i < actualFrames; i++) {
        try {
          // Set rotation for this frame
          const angle = (2 * Math.PI * i) / actualFrames;
          this.turntable.rotation.y = angle;

          // Render to offscreen canvas with export camera
          offscreenRenderer.render(this.scene, exportCamera);

          // Capture frame and resize to target size
          const blob = await this.captureFrameFromRenderer(offscreenRenderer, captureSize, captureSize); // Keep high res
          
          if (!blob || blob.size === 0) {
            const error = `Frame ${i} capture failed - empty blob`;
            console.error('❌', error);
            alert(error);
            throw new Error(error);
          }
          
          frames.push(blob);
          
          if (i === 0 || i === actualFrames - 1 || i % 10 === 0) {
            console.log(`📸 Captured frame ${i + 1}/${actualFrames}, size: ${blob.size} bytes, angle: ${angle.toFixed(2)}`);
          }
        } catch (frameError) {
          const error = `Failed to capture frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown frame error'}`;
          console.error('❌', error);
          alert(error);
          throw new Error(error);
        }
      }

      // Clean up offscreen renderer
      offscreenRenderer.dispose();

      console.log('✅ Frame export complete:', { totalFrames: frames.length });
      return frames;
    } catch (error) {
      const errorMsg = `Frame export failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌', errorMsg);
      alert(errorMsg);
      throw error;
    } finally {
      this.scene.background = prevBackground;
      // Restore original rotation only
      this.turntable.rotation.y = originalRotation;
      
      console.log('🔄 Restored original rotation');
    }
  }

  private captureFrameFromRenderer(renderer: THREE.WebGLRenderer, sourceSize: number, targetSize: number): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        // First capture at high resolution
        renderer.domElement.toBlob((highResBlob) => {
          if (!highResBlob) {
            resolve(new Blob());
            return;
          }

          // If target size equals source size, return directly (avoid unnecessary processing)
          if (sourceSize === targetSize) {
            resolve(highResBlob);
            return;
          }

          // For now, just return high res directly to avoid complex resizing
          // WebCodecs will handle the scaling
          resolve(highResBlob);
        }, 'image/png');
      } catch (error) {
        console.error('Frame capture error:', error);
        resolve(new Blob());
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
    await debugLog('🎬 Starting WebM export with settings:', settings);
    
    try {
      // Check if we have valid scene objects
      if (!this.scene) {
        const error = 'Scene is null or undefined';
        console.error('❌ Scene check:', error);
        alert(`Export failed: ${error}`);
        throw new Error(error);
      }
      
      if (!this.turntable) {
        const error = 'Turntable is null or undefined';
        console.error('❌ Turntable check:', error);
        alert(`Export failed: ${error}`);
        throw new Error(error);
      }
      
      await debugLog('✅ Scene objects validated');

      const { fps, duration, size } = settings;
      
      await debugLog('📹 Starting frame export phase...');
      // Export frames at HIGH RESOLUTION for quality (always 512px)
      const highResFrames = await this.exportFrames({
        fps,
        duration,
        size: 512 // Always capture at 512px for quality
      });
      
      await debugLog(`✅ Frame export completed - got ${highResFrames.length} high-res frames`);
      
      // Calculate effective FPS for the reduced frame count but same duration
      const effectiveFPS = highResFrames.length / duration;
      await debugLog(`🎯 Using effective FPS: ${effectiveFPS.toFixed(2)} (${highResFrames.length} frames over ${duration}s)`);
      
      // Send frames to server for WebM creation instead of client-side encoding
      await debugLog('� Sending frames to server for WebM creation...');
      const result = await this.createWebMOnServer(highResFrames, effectiveFPS, size);
      
      await debugLog('✅ Server-side WebM creation completed');
      
      await debugLog('✅ WebM export completed successfully - total size:', { size: result.size });
      return result;
    } catch (error) {
      await debugLog('❌ WebM export failed at top level:', { error: error instanceof Error ? error.message : 'Unknown error' });
      alert(`WebM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async createWebMOnServer(frames: Blob[], fps: number, size: number): Promise<Blob> {
    try {
      await debugLog(`� Preparing frames for server-side WebM creation:`, { 
        frameCount: frames.length, 
        fps, 
        targetSize: `${size}x${size}` 
      });
      
      // Convert frames to base64 for server transmission using FileReader to avoid stack overflow
      const framePromises = frames.map(async (frame, index) => {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix to get just the base64
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error('Failed to convert frame to base64'));
          reader.readAsDataURL(frame);
        });
        
        if (index === 0 || index === frames.length - 1 || index % 10 === 0) {
          await debugLog(`📤 Converted frame ${index + 1}/${frames.length} to base64 (${base64.length} chars)`);
        }
        
        return base64;
      });
      
      const base64Frames = await Promise.all(framePromises);
      await debugLog(`✅ All ${base64Frames.length} frames converted to base64`);
      
      const payload = {
        frames: base64Frames,
        fps,
        width: size,
        height: size,
        format: 'webm',
        codec: 'vp9',
        alpha: true
      };
      
      await debugLog('📡 Sending frames to server for WebM creation...');
      const response = await fetch('/.netlify/functions/create-webm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      await debugLog('📡 Server response received:', { 
        status: response.status, 
        statusText: response.statusText 
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await debugLog('❌ Server WebM creation failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Server WebM creation failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      await debugLog('✅ Server WebM creation success:', {
        size: result.size,
        codec: result.codec,
        frames_processed: result.frames_processed
      });
      
      // Convert base64 back to blob
      const webmData = atob(result.webm_base64);
      const webmArray = new Uint8Array(webmData.length);
      for (let i = 0; i < webmData.length; i++) {
        webmArray[i] = webmData.charCodeAt(i);
      }
      
      const webmBlob = new Blob([webmArray], { type: 'video/webm' });
      await debugLog('✅ Server-created WebM converted to blob:', { size: webmBlob.size });
      
      return webmBlob;
    } catch (error) {
      await debugLog('❌ Server WebM creation failed:', { error: error instanceof Error ? error.message : 'Unknown server error' });
      throw new Error(`Server-side WebM creation failed: ${error instanceof Error ? error.message : 'Unknown server error'}`);
    }
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
  
  // Convert blob to base64 using FileReader to avoid stack overflow
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
    reader.readAsDataURL(blob);
  });
  
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
  setTitle: string = 'Custom Coinmoji' // TODO: Allow user to set title in webapp or bot UI
) => {
  await debugLog('🎭 Creating custom emoji:', { 
    blobSize: blob.size, 
    blobType: blob.type, 
    emojiList, 
    setTitle,
    initDataLength: initData.length 
  });

  // Use FileReader for safe base64 conversion instead of btoa to avoid stack overflow
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to convert WebM to base64'));
    reader.readAsDataURL(blob);
  });
  
  await debugLog('🔄 Converted to base64 for emoji:', { 
    originalSize: blob.size, 
    base64Length: base64.length,
    base64Sample: base64.substring(0, 50) + '...'
  });

  const userId = getTelegramUserId(initData);
  await debugLog('👤 User ID for emoji:', userId);

  const payload = {
    initData,
    user_id: userId,
    set_title: setTitle,
    emoji_list: emojiList,
    webm_base64: base64,
  };

  await debugLog('📝 Emoji creation payload prepared:', {
    user_id: payload.user_id,
    set_title: payload.set_title,
    emoji_list: payload.emoji_list,
    webm_base64_length: payload.webm_base64.length,
    initData_length: payload.initData.length
  });

  try {
    await debugLog('📡 Sending emoji creation request...');
    const response = await fetch('/.netlify/functions/create-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await debugLog('📡 Emoji creation response received:', { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      await debugLog('❌ Emoji creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error('Failed to create custom emoji');
    }

    const result = await response.json();
    await debugLog('✅ Emoji creation success:', result);
    return result;
  } catch (error) {
    await debugLog('❌ Error creating custom emoji:', { error: error instanceof Error ? error.message : 'Unknown error' });
    throw error;
  }
};

// Helper to extract user ID from Telegram initData
const getTelegramUserId = (initData: string): number => {
  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get('user') || '{}');
  return user.id;
};

// Verify that the WebM actually contains alpha transparency
export async function verifyWebMHasAlpha(blob: Blob): Promise<boolean> {
  if (!('VideoDecoder' in window)) {
    console.log('🔍 VideoDecoder not available for alpha verification');
    return false;
  }

  const url = URL.createObjectURL(blob);
  try {
    console.log('🔍 Verifying WebM alpha channel...');
    const v = document.createElement('video');
    v.src = url; 
    v.muted = true; 
    v.loop = false; 
    v.playsInline = true;
    
    await v.play().catch(()=>{});
    await new Promise(r => v.addEventListener('loadeddata', r, { once: true }));
    
    // Draw to 2D canvas and read a pixel that should be transparent
    const c = document.createElement('canvas'); 
    c.width = v.videoWidth; 
    c.height = v.videoHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true, alpha: true })!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(v, 0, 0);
    
    // Sample multiple edge pixels that should be transparent
    const samples = [
      ctx.getImageData(0, 0, 1, 1).data, // top-left
      ctx.getImageData(c.width - 1, 0, 1, 1).data, // top-right
      ctx.getImageData(0, c.height - 1, 1, 1).data, // bottom-left
      ctx.getImageData(c.width - 1, c.height - 1, 1, 1).data // bottom-right
    ];
    
    // Check if any corner pixels have transparency (alpha < 255)
    const hasTransparency = samples.some(px => px[3] < 255);
    console.log('🔍 Alpha verification result:', {
      videoSize: `${v.videoWidth}x${v.videoHeight}`,
      cornerAlphaValues: samples.map(px => px[3]),
      hasTransparency
    });
    
    return hasTransparency;
  } catch (error) {
    console.error('🔍 Alpha verification failed:', error);
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}
