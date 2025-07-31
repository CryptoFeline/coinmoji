import { zip } from 'fflate';
import * as THREE from 'three';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
}

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
    // Max 30 frames (1 second at 30fps) for better animation quality
    const maxFrames = 30;
    const actualFrames = Math.min(totalFrames, maxFrames);
    const frames: Blob[] = [];

    console.log('📹 Starting frame export (optimized for smooth animation):', { 
      fps, 
      duration, 
      size, 
      requestedFrames: totalFrames, 
      actualFrames,
      maxAllowed: maxFrames
    });

    // Store original rotation (we don't touch the live renderer anymore)
    const originalRotation = this.turntable.rotation.y;

    console.log('💾 Stored original rotation:', originalRotation);

    try {
      // Create OFFSCREEN renderer for export (doesn't affect live view!)
      const captureSize = 512; // High resolution for better quality
      console.log('🎨 Creating offscreen renderer...');
      
      const offscreenRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true 
      });
      offscreenRenderer.setSize(captureSize, captureSize);
      offscreenRenderer.setClearColor(0x000000, 0); // Transparent background
      offscreenRenderer.outputColorSpace = THREE.SRGBColorSpace;

      // Create dedicated camera for export with perfect coin framing
      const exportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      // Position camera much closer to make coin fill more of the frame
      exportCamera.position.set(0, 0, 2.5); // Even closer for bigger coin in frame
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
          
          // Set rotation for this frame - slow rotation over intended duration
          // Calculate angle based on original requested duration, not actual frame count
          const totalRequestedFrames = Math.floor(fps * duration);
          const angle = (2 * Math.PI * i) / totalRequestedFrames; // Use original frame count for timing
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
      // Restore original rotation only
      this.turntable.rotation.y = originalRotation;
      
      console.log('🔄 Restored original rotation');
    }
  }

  private captureFrameFromRenderer(renderer: THREE.WebGLRenderer, _sourceSize: number, _targetSize: number): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        // Capture at high resolution with PNG format to preserve transparency
        renderer.domElement.toBlob((highResBlob) => {
          if (!highResBlob) {
            console.warn('⚠️ Failed to capture frame blob');
            resolve(new Blob());
            return;
          }

          console.log(`📸 Captured PNG frame: ${highResBlob.size} bytes`);
          resolve(highResBlob);
        }, 'image/png'); // Explicitly use PNG for transparency
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
    console.log('🎬 Starting WebM export with settings:', settings);
    
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
      
      console.log('✅ Scene objects validated');
      
      if (!('VideoEncoder' in window)) {
        const error = 'WebCodecs not supported in this browser';
        console.error('❌ Browser compatibility:', error);
        alert(`Export failed: ${error}`);
        throw new Error(error);
      }
      
      console.log('✅ WebCodecs support confirmed');

      const { fps, duration, size } = settings;
      
      console.log('📹 Exporting frames at high resolution...');
      // Export frames at HIGH RESOLUTION for quality (always 512px)
      const highResFrames = await this.exportFrames({
        fps,
        duration,
        size: 512 // Always capture at 512px for quality
      });
      
      console.log(`✅ Got ${highResFrames.length} high-res frames`);
      
      // Create WebM directly at target size from high-res frames
      console.log('🎥 Creating WebM with WebCodecs at target size...');
      const result = await this.exportWithWebCodecs(highResFrames, fps, size);
      
      console.log('✅ WebM export completed successfully');
      return result;
    } catch (error) {
      console.error('❌ WebM export failed:', error);
      alert(`WebM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async exportWithWebCodecs(frames: Blob[], fps: number, size: number): Promise<Blob> {
    try {
      console.log(`🎬 Starting WebCodecs encoding: ${frames.length} frames, ${fps}fps, ${size}x${size}`);
      
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
        }
      });

      console.log('🎥 Creating VideoEncoder...');
      let chunksReceived = 0;
      const encoder = new (window as any).VideoEncoder({
        output: (chunk: any, meta: any) => {
          try {
            muxer.addVideoChunk(chunk, meta);
            chunksReceived++;
            console.log(`📝 WebCodecs chunk ${chunksReceived}: ${chunk.byteLength} bytes, type: ${chunk.type}`);
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

      try {
        // Use simpler VP9 codec without alpha flags (alpha in source frames should be preserved)
        encoder.configure({
          codec: 'vp09.00.10.08',
          width: size,
          height: size,
          bitrate: 1_500_000,
          framerate: fps,
          latencyMode: 'realtime'
          // Remove alpha: 'keep' as it seems to cause issues
        });
        console.log('✅ VideoEncoder configured (transparency from source frames)');
      } catch (configError) {
        console.error('❌ VideoEncoder configuration failed:', configError);
        alert(`VideoEncoder config failed: ${configError instanceof Error ? configError.message : 'Unknown config error'}`);
        throw configError;
      }

      console.log('🎬 Encoding frames with WebCodecs...');

      // Encode frames in small batches to prevent stack overflow
      const batchSize = 5; // Process only 5 frames at a time
      for (let batchStart = 0; batchStart < frames.length; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, frames.length);
        console.log(`🎬 Processing batch ${Math.floor(batchStart / batchSize) + 1}/${Math.ceil(frames.length / batchSize)}: frames ${batchStart}-${batchEnd - 1}`);
        
        // Process batch sequentially with delays
        for (let i = batchStart; i < batchEnd; i++) {
          try {
            // Add delay between every frame to prevent stack overflow
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 20));
            }
            
            // Create ImageBitmap from high-res frame
            const imageBitmap = await createImageBitmap(frames[i]);
            
            // If we need to scale, create a canvas at target size
            if (imageBitmap.width !== size || imageBitmap.height !== size) {
              const canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d', { alpha: true })!; // Ensure alpha context
              
              // Clear with full transparency (don't fill with any color)
              ctx.clearRect(0, 0, size, size);
              
              // Set compositing to preserve transparency
              ctx.globalCompositeOperation = 'source-over';
              
              // Draw scaled image with high quality and preserve alpha
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(imageBitmap, 0, 0, size, size);
              
              // Create VideoFrame from canvas (transparency should be preserved automatically)
              const videoFrame = new (window as any).VideoFrame(canvas, {
                timestamp: (i * 1000000) / fps, // microseconds
                duration: 1000000 / fps // frame duration in microseconds
                // Remove alpha: 'keep' as it may cause issues
              });
              
              encoder.encode(videoFrame, { keyFrame: i === 0 });
              videoFrame.close();
              imageBitmap.close();
            } else {
              // No scaling needed, use ImageBitmap directly
              const videoFrame = new (window as any).VideoFrame(imageBitmap, {
                timestamp: (i * 1000000) / fps, // microseconds
                duration: 1000000 / fps // frame duration in microseconds
                // Remove alpha: 'keep' as it may cause issues
              });
              
              encoder.encode(videoFrame, { keyFrame: i === 0 });
              videoFrame.close();
              imageBitmap.close();
            }
            
            console.log(`🎞️ Encoded frame ${i + 1}/${frames.length}, timestamp: ${(i * 1000000) / fps}`);
          } catch (frameError) {
            console.error(`❌ Error encoding frame ${i}:`, frameError);
            alert(`Frame encoding error at frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown frame error'}`);
            throw frameError;
          }
        }
        
        // Add longer delay between batches to let the call stack clear
        if (batchEnd < frames.length) {
          console.log('⏱️ Pausing between batches to prevent stack overflow...');
          await new Promise(resolve => setTimeout(resolve, 100));
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
        chunksProcessed: chunksReceived,
        framesEncoded: frames.length
      });
      
      // Force garbage collection hint (browser may ignore)
      if ('gc' in window) {
        (window as any).gc();
      }
      
      return blob;
    } catch (error) {
      console.error('❌ WebCodecs export failed:', error);
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
