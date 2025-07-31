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
      this.scene.background = null; // ensure transparent renders
      // Create OFFSCREEN renderer for export (doesn't affect live view!)
      const captureSize = 512; // High resolution for better quality
      console.log('🎨 Creating offscreen renderer...');
      
      const offscreenRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false
      });
      offscreenRenderer.setSize(captureSize, captureSize);
      offscreenRenderer.setClearColor(0x000000, 0); // Completely transparent background
      offscreenRenderer.outputColorSpace = THREE.SRGBColorSpace;

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
          // Add small delay every few frames to prevent stack overflow
          if (i > 0 && i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 5));
          }
          
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
      
      if (!('VideoEncoder' in window)) {
        const error = 'WebCodecs not supported in this browser';
        console.error('❌ Browser compatibility:', error);
        alert(`Export failed: ${error}`);
        throw new Error(error);
      }
      
      await debugLog('✅ WebCodecs support confirmed');

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
      
      // Create WebM directly at target size from high-res frames
      await debugLog('🎥 Starting WebCodecs encoding phase...');
      const result = await this.exportWithWebCodecs(highResFrames, effectiveFPS, size);
      
      await debugLog('✅ WebCodecs encoding completed');
      
      // Verify the WebM actually contains alpha transparency
      await debugLog('🔍 Starting alpha verification phase...');
      const hasAlpha = await verifyWebMHasAlpha(result);
      if (hasAlpha) {
        await debugLog('✅ WebM contains alpha transparency (may look black in video preview but will work as emoji)');
      } else {
        await debugLog('⚠️ WebM may not contain alpha transparency - check browser compatibility');
      }
      
      await debugLog('✅ WebM export completed successfully - total size:', { size: result.size });
      return result;
    } catch (error) {
      await debugLog('❌ WebM export failed at top level:', { error: error instanceof Error ? error.message : 'Unknown error' });
      alert(`WebM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async exportWithWebCodecs(frames: Blob[], fps: number, size: number): Promise<Blob> {
    try {
      await debugLog(`🎬 Starting WebCodecs encoding:`, { 
        frameCount: frames.length, 
        fps, 
        size: `${size}x${size}` 
      });
      
      // Import webm-muxer dynamically
      await debugLog('📦 Importing webm-muxer...');
      const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
      await debugLog('✅ webm-muxer imported successfully');
      
      await debugLog('🎯 Creating muxer target...');
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: {
          codec: 'V_VP9',
          width: size,
          height: size,
          frameRate: fps,
        }
      });
      await debugLog('✅ Muxer created successfully');

      await debugLog('🎥 Creating VideoEncoder...');
      let chunksReceived = 0;
      const encoder = new (window as any).VideoEncoder({
        output: (chunk: any, meta: any) => {
          try {
            muxer.addVideoChunk(chunk, meta);
            chunksReceived++;
            if (chunksReceived <= 5 || chunksReceived % 5 === 0) {
              console.log(`📝 WebCodecs chunk ${chunksReceived}: ${chunk.byteLength} bytes, type: ${chunk.type}`);
            }
          } catch (chunkError) {
            console.error('❌ Error processing chunk:', chunkError);
            alert(`Chunk processing error: ${chunkError instanceof Error ? chunkError.message : 'Unknown chunk error'}`);
          }
        },
        error: (e: any) => {
          console.error('❌ VideoEncoder error:', e);
          alert(`VideoEncoder error: ${e.message || e}`);
        }
      });
      await debugLog('✅ VideoEncoder created successfully');

      await debugLog('⚙️ Configuring VideoEncoder with alpha support...');
      try {
        // Try with alpha support first for transparency
        encoder.configure({
          codec: 'vp09.00.10.08',
          width: size,
          height: size,
          bitrate: 1_200_000, // Lower bitrate for better stability
          framerate: fps,
          latencyMode: 'realtime',
          alpha: 'keep' // Try to preserve alpha channel
        });
        await debugLog('✅ VideoEncoder configured with alpha support for transparency');
      } catch (alphaError) {
        await debugLog('❌ Alpha not supported by this browser build of WebCodecs/VP9.', { error: alphaError });
        alert('This browser cannot encode VP9 with alpha. Please switch to Chrome 115+ (or desktop Chromium) and try again.');
        throw alphaError;
      }

      await debugLog('🎬 Starting frame encoding process...');

      // Encode frames in small batches to prevent stack overflow
      const batchSize = 3; // Reduce to 3 frames at a time for stability
      for (let batchStart = 0; batchStart < frames.length; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, frames.length);
        await debugLog(`🎬 Processing batch ${Math.floor(batchStart / batchSize) + 1}/${Math.ceil(frames.length / batchSize)}: frames ${batchStart}-${batchEnd - 1}`);
        
        // Process batch sequentially with delays
        for (let i = batchStart; i < batchEnd; i++) {
          try {
            await debugLog(`🖼️ Processing frame ${i + 1}/${frames.length}...`);
            
            // Add delay between every frame to prevent stack overflow
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 50)); // Increased delay
            }
            
            // Create ImageBitmap from high-res frame
            const imageBitmap = await createImageBitmap(frames[i]);
            await debugLog(`✅ ImageBitmap created: ${imageBitmap.width}x${imageBitmap.height}`);
            
            // Always scale through canvas for consistent processing
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d', { alpha: true })!;
            
            // Keep transparent background - don't fill with any color
            ctx.clearRect(0, 0, size, size);
            
            // Draw scaled image with high quality, preserving transparency
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(imageBitmap, 0, 0, size, size);
            
            // Create VideoFrame from canvas
            const videoFrame = new (window as any).VideoFrame(canvas, {
              timestamp: (i * 1000000) / fps, // microseconds
              duration: 1000000 / fps // frame duration in microseconds
            });
            
            encoder.encode(videoFrame, { keyFrame: i === 0 });
            videoFrame.close();
            imageBitmap.close();
            
            await debugLog(`✅ Frame ${i + 1}/${frames.length} encoded successfully`);
          } catch (frameError) {
            await debugLog(`❌ Error encoding frame ${i}:`, { error: frameError instanceof Error ? frameError.message : 'Unknown frame error' });
            alert(`Frame encoding error at frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown frame error'}`);
            throw frameError;
          }
        }
        
        // Add longer delay between batches to let the call stack clear
        if (batchEnd < frames.length) {
          await debugLog('⏱️ Pausing between batches...');
          await new Promise(resolve => setTimeout(resolve, 200)); // Increased pause
        }
      }

      await debugLog('⏳ Flushing encoder...');
      await encoder.flush();
      await debugLog('✅ Encoder flushed successfully');
      
      await debugLog('🔒 Closing encoder...');
      encoder.close();
      await debugLog('✅ Encoder closed successfully');
      
      await debugLog('📦 Finalizing muxer...');
      muxer.finalize();
      await debugLog('✅ Muxer finalized successfully');

      const blob = new Blob([target.buffer], { type: 'video/webm' });
      await debugLog('✅ WebCodecs+Muxer WebM complete:', { 
        size: blob.size, 
        type: blob.type,
        chunksProcessed: chunksReceived,
        framesEncoded: frames.length
      });
      
      return blob;
    } catch (error) {
      await debugLog('❌ WebCodecs export failed:', { error: error instanceof Error ? error.message : 'Unknown WebCodecs error' });
      alert(`WebCodecs encoding failed: ${error instanceof Error ? error.message : 'Unknown WebCodecs error'}`);
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
