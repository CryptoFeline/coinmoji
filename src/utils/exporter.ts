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
        // Try WebP first, but fallback to PNG if WebP is not supported
        renderer.domElement.toBlob((blob) => {
          if (!blob) {
            // If WebP fails, try PNG as fallback
            console.log('⚠️ WebP capture failed, trying PNG fallback...');
            renderer.domElement.toBlob((pngBlob) => {
              if (!pngBlob) {
                resolve(new Blob());
                return;
              }
              console.log('✅ PNG fallback successful');
              resolve(pngBlob);
            }, 'image/png');
            return;
          }

          // Verify this is actually WebP by checking the blob type
          if (blob.type === 'image/webp') {
            console.log('✅ WebP capture successful');
            resolve(blob);
          } else {
            // Browser gave us a different format, fallback to PNG
            console.log('⚠️ Browser did not support WebP, using PNG fallback...');
            renderer.domElement.toBlob((pngBlob) => {
              resolve(pngBlob || new Blob());
            }, 'image/png');
          }
        }, 'image/webp', 0.9); // Try WebP first with high quality
      } catch (error) {
        console.error('Frame capture error:', error);
        // Final fallback to PNG
        try {
          renderer.domElement.toBlob((pngBlob) => {
            resolve(pngBlob || new Blob());
          }, 'image/png');
        } catch (pngError) {
          console.error('PNG fallback also failed:', pngError);
          resolve(new Blob());
        }
      }
    });
  }

  async exportAsZip(settings: ExportSettings): Promise<Blob> {
    const frames = await this.exportFrames(settings);
    
    const files: Record<string, Uint8Array> = {};
    
    for (let i = 0; i < frames.length; i++) {
      const frameNumber = String(i).padStart(4, '0');
      // Detect the actual format of the frame
      const frameBuffer = await frames[i].arrayBuffer();
      const uint8Array = new Uint8Array(frameBuffer);
      
      // Check format based on magic bytes
      let extension = 'bin'; // fallback
      if (uint8Array.length >= 8 && 
          uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && 
          uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        extension = 'png';
      } else if (uint8Array.length >= 12 && 
                 String.fromCharCode(...uint8Array.slice(0, 4)) === 'RIFF' &&
                 String.fromCharCode(...uint8Array.slice(8, 12)) === 'WEBP') {
        extension = 'webp';
      }
      
      const fileName = `frame_${frameNumber}.${extension}`;
      files[fileName] = uint8Array;
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
    await debugLog('🎬 Starting WebM export:', settings);
    
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

      // Try native MediaRecorder first, fallback to client-side webm-muxer
      try {
        if ('MediaRecorder' in window) {
          await debugLog('🎥 Attempting native MediaRecorder...');
          const webmBlob = await this.recordCanvasToWebM(settings);
          await debugLog('✅ Native WebM recording completed:', { size: webmBlob.size });
          return webmBlob;
        } else {
          throw new Error('MediaRecorder not available');
        }
      } catch (mediaRecorderError) {
        await debugLog('⚠️ MediaRecorder failed, trying client-side webm-muxer:', { 
          error: mediaRecorderError instanceof Error ? mediaRecorderError.message : 'Unknown error' 
        });
        
        // Fallback to client-side WebM creation with webm-muxer
        try {
          const webmBlob = await this.createWebMViaWebMuxer(settings);
          await debugLog('✅ Client-side webm-muxer completed:', { size: webmBlob.size });
          return webmBlob;
        } catch (webMuxerError) {
          await debugLog('❌ Client-side webm-muxer also failed:', { 
            error: webMuxerError instanceof Error ? webMuxerError.message : 'Unknown error' 
          });
          throw webMuxerError;
        }
      }
    } catch (error) {
      await debugLog('❌ WebM export failed at top level:', { error: error instanceof Error ? error.message : 'Unknown error' });
      alert(`WebM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async recordCanvasToWebM(settings: ExportSettings): Promise<Blob> {
    const { fps, duration, size } = settings;
    
    await debugLog('🎥 Setting up canvas recording...', { fps, duration, size });
    
    // Create offscreen renderer for recording
    const captureSize = size; // Use target size directly
    const offscreenRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false
    });
    offscreenRenderer.setSize(captureSize, captureSize);
    offscreenRenderer.setClearColor(0x000000, 0); // Transparent background
    offscreenRenderer.outputColorSpace = THREE.SRGBColorSpace;
    offscreenRenderer.shadowMap.enabled = false;
    offscreenRenderer.autoClear = true;

    // Create dedicated camera for recording
    const exportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    exportCamera.position.set(0, 0, 2.8);
    exportCamera.lookAt(0, 0, 0);

    const canvas = offscreenRenderer.domElement;
    
    // Store original rotation and scene background
    const originalRotation = this.turntable.rotation.y;
    const prevBackground = this.scene.background;
    this.scene.background = null; // Ensure transparency

    try {
      // Check MediaRecorder support
      if (!('MediaRecorder' in window)) {
        throw new Error('MediaRecorder not supported in this browser');
      }

      // Setup MediaRecorder with WebM VP9 codec
      const stream = canvas.captureStream(fps);
      const mimeType = 'video/webm;codecs=vp9';
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        await debugLog('⚠️ VP9 not supported, trying VP8...');
        const fallbackMimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(fallbackMimeType)) {
          throw new Error('WebM not supported in this browser');
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'video/webm;codecs=vp8',
        videoBitsPerSecond: 1000000 // 1Mbps for good quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Start recording
      recorder.start();
      await debugLog('🎬 Recording started...');

      // Animate the coin for the specified duration
      const totalFrames = 30; // Always use 30 frames for 3 seconds
      const frameDelay = (duration * 1000) / totalFrames; // Delay between frames in ms

      for (let i = 0; i < totalFrames; i++) {
        const angle = (2 * Math.PI * i) / totalFrames;
        this.turntable.rotation.y = angle;
        
        // Render frame
        offscreenRenderer.render(this.scene, exportCamera);
        
        // Wait for next frame
        if (i < totalFrames - 1) {
          await new Promise(resolve => setTimeout(resolve, frameDelay));
        }
        
        if (i % 10 === 0) {
          await debugLog(`📹 Recording frame ${i + 1}/${totalFrames}`);
        }
      }

      // Stop recording and wait for result
      return new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const webmBlob = new Blob(chunks, { type: 'video/webm' });
          debugLog('✅ Native recording completed:', { 
            size: webmBlob.size,
            chunks: chunks.length 
          });
          resolve(webmBlob);
        };

        recorder.onerror = (event) => {
          debugLog('❌ Recording error:', event);
          reject(new Error('Recording failed'));
        };

        // Stop after a small delay to ensure last frame is captured
        setTimeout(() => {
          recorder.stop();
          stream.getTracks().forEach(track => track.stop());
        }, 100);
      });

    } finally {
      // Cleanup
      this.scene.background = prevBackground;
      this.turntable.rotation.y = originalRotation;
      offscreenRenderer.dispose();
      await debugLog('🔄 Cleaned up recording resources');
    }
  }

  private async createWebMViaWebMuxer(settings: ExportSettings): Promise<Blob> {
    await debugLog('🔧 Creating WebM via client-side webm-muxer...');
    
    // Check if WebCodecs is available
    if (!('VideoEncoder' in window) || !('VideoFrame' in window)) {
      throw new Error('WebCodecs not supported in this browser');
    }
    
    try {
      // Import webm-muxer dynamically
      const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
      
      // First export frames as high-quality PNGs
      await debugLog('📸 Capturing PNG frames for webm-muxer...');
      const frames = await this.exportFrames(settings);
      
      if (frames.length === 0) {
        throw new Error('No frames captured for WebM creation');
      }
      
      await debugLog(`✅ Captured ${frames.length} PNG frames for webm-muxer`);
      
      // Create WebM using webm-muxer with WebCodecs
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: {
          codec: 'V_VP9',
          width: settings.size,
          height: settings.size,
          frameRate: settings.fps,
          alpha: true // Enable transparency
        },
        firstTimestampBehavior: 'offset'
      });

      // Create VideoEncoder
      const chunks: { chunk: any; meta: any }[] = [];
      const videoEncoder = new (window as any).VideoEncoder({
        output: (chunk: any, meta: any) => {
          chunks.push({ chunk, meta });
        },
        error: (e: any) => {
          console.error('VideoEncoder error:', e);
          throw e;
        }
      });

      // Configure VP9 encoder with alpha support
      await videoEncoder.configure({
        codec: 'vp09.00.10.08', // VP9 Profile 0, Level 1.0, 8-bit with alpha
        width: settings.size,
        height: settings.size,
        bitrate: 200000, // 200kbps for small file size
        framerate: settings.fps,
        alpha: 'keep'
      });

      await debugLog('🎥 VideoEncoder configured for VP9 with alpha');

      // Process each frame
      for (let i = 0; i < frames.length; i++) {
        try {
          // Create ImageBitmap from blob
          const imageBitmap = await createImageBitmap(frames[i]);

          // Create VideoFrame with timestamp
          const timestamp = (i * 1000000) / settings.fps; // microseconds
          const videoFrame = new (window as any).VideoFrame(imageBitmap, {
            timestamp: timestamp,
            duration: 1000000 / settings.fps // microseconds
          });

          // Encode frame
          videoEncoder.encode(videoFrame, { keyFrame: i === 0 });
          
          // Clean up
          videoFrame.close();
          imageBitmap.close();
          
          if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
            await debugLog(`🎬 Encoded frame ${i + 1}/${frames.length} with webm-muxer`);
          }
        } catch (frameError) {
          await debugLog(`❌ Error processing frame ${i} with webm-muxer:`, frameError);
          throw new Error(`Failed to process frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown error'}`);
        }
      }

      // Finish encoding
      await videoEncoder.flush();
      videoEncoder.close();
      
      // Add all chunks to muxer
      for (const { chunk, meta } of chunks) {
        muxer.addVideoChunk(chunk, meta);
      }
      
      muxer.finalize();

      const webmBuffer = target.buffer;
      await debugLog(`📊 WebM created with webm-muxer: ${webmBuffer.byteLength} bytes`);
      
      const webmBlob = new Blob([webmBuffer], { type: 'video/webm' });
      await debugLog('🎬 WebM blob created from webm-muxer:', { size: webmBlob.size });
      
      return webmBlob;
      
    } catch (error) {
      await debugLog('❌ Client-side webm-muxer failed:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
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
