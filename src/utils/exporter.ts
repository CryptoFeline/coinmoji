import * as THREE from 'three';
import { zip } from 'fflate';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
  rotationSpeed?: number; // radians per frame at 60fps (optional, defaults to medium speed)
  targetFileSize?: number; // Target file size in bytes (default: 60KB for 64KB limit with safety margin)
  qualityMode?: 'high' | 'balanced' | 'compact'; // Quality vs size preference
}

export class CoinExporter {
  private scene: THREE.Scene;
  private turntable: THREE.Group;

  constructor(
    scene: THREE.Scene,
    _camera: THREE.PerspectiveCamera, // Keep for API compatibility but don't use
    _renderer: THREE.WebGLRenderer, // Keep for API compatibility but don't use
    turntable: THREE.Group
  ) {
    this.scene = scene;
    this.turntable = turntable;
  }

  async exportFrames(settings: ExportSettings): Promise<Blob[]> {
    const { fps, duration, size, targetFileSize = 60 * 1024, qualityMode = 'balanced' } = settings;
    
    // Dynamic frame count based on quality mode and target size
    const maxFramesByQuality = {
      high: Math.min(60, Math.floor(fps * duration)), // Up to 60 frames for high quality
      balanced: Math.min(45, Math.floor(fps * duration)), // Up to 45 frames for balanced
      compact: Math.min(30, Math.floor(fps * duration))  // Up to 30 frames for compact
    };
    
    const actualFrames = maxFramesByQuality[qualityMode];
    
    // Dynamic capture resolution based on quality mode and target size
    const captureResolution = {
      high: targetFileSize > 50 * 1024 ? 100 : 100,    // Higher res if we have size budget
      balanced: 100,                                     // Standard resolution 
      compact: 100                                       // Lower res for smaller files
    };
    
    const captureSize = captureResolution[qualityMode];
    
    const frames: Blob[] = [];

    console.log('📹 Starting DIRECT 100PX frame export (NO DOWNSCALING):', { 
      fps, 
      duration, 
      size, 
      actualFrames,
      captureSize: `${captureSize}px (direct emoji resolution)`,
      targetFileSize: `${(targetFileSize / 1024).toFixed(1)}KB`,
      qualityMode,
      estimatedFrameSize: `${(targetFileSize / actualFrames / 1024).toFixed(1)}KB per frame`,
      breakthrough: 'Eliminated downscaling artifacts by rendering directly at 100px!'
    });

    // Store original rotation
    const originalRotation = this.turntable.rotation.y;
    console.log('💾 Stored original rotation:', originalRotation);

    const prevBackground = this.scene.background;
    try {
      // Set scene background to null for transparency
      this.scene.background = null;
      
      // Create OFFSCREEN renderer for export (doesn't affect live view!)
      console.log('🎨 Creating OPTIMIZED offscreen renderer...');
      
      const offscreenRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false, // CRITICAL for transparency
        powerPreference: 'high-performance' // Use dedicated GPU if available
      });
      offscreenRenderer.setSize(captureSize, captureSize);
      offscreenRenderer.setClearColor(0x000000, 0); // Completely transparent background
      offscreenRenderer.outputColorSpace = THREE.SRGBColorSpace;
      offscreenRenderer.setPixelRatio(1); // Force 1:1 for consistent quality
      
      // Optimize renderer settings for quality
      offscreenRenderer.shadowMap.enabled = false; // Disable shadows that can interfere
      offscreenRenderer.autoClear = true;
      offscreenRenderer.sortObjects = true; // Better transparency sorting

      // Create dedicated camera for export with perfect coin framing
      const exportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      exportCamera.position.set(0, 0, 2.8); // Position for proper coin framing
      exportCamera.lookAt(0, 0, 0);

      console.log('🎯 Created OPTIMIZED offscreen renderer:', { 
        captureSize, 
        transparent: true,
        qualityMode,
        estimatedQuality: qualityMode === 'high' ? 'Maximum' : qualityMode === 'balanced' ? 'High' : 'Good',
        cameraPosition: exportCamera.position.toArray()
      });

      for (let i = 0; i < actualFrames; i++) {
        try {
          // Calculate rotation for COMPLETE 360° rotation over duration
          const frameProgress = i / (actualFrames - 1); // 0 to 1 across all frames
          const totalRotation = frameProgress * Math.PI * 2; // Full circle: 0 to 2π
          
          // Debug: Log rotation for first few frames to verify
          if (i === 0 || i === 1 || i === actualFrames - 1) {
            console.log(`📐 Frame ${i}: progress=${frameProgress.toFixed(3)}, rotation=${totalRotation.toFixed(3)} rad (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
          }
          
          // Set rotation for this frame
          this.turntable.rotation.y = totalRotation;

          // Render to offscreen canvas with export camera
          offscreenRenderer.render(this.scene, exportCamera);

          // Capture frame with transparency preservation
          const blob = await this.captureFrameFromRenderer(offscreenRenderer, targetFileSize, actualFrames);
          
          if (!blob || blob.size === 0) {
            const error = `Frame ${i} capture failed - empty blob`;
            console.error('❌', error);
            throw new Error(error);
          }
          
          frames.push(blob);
          
          if (i === 0 || i === actualFrames - 1 || i % 10 === 0) {
            console.log(`📸 Captured frame ${i + 1}/${actualFrames}, size: ${blob.size} bytes, rotation: ${totalRotation.toFixed(2)} rad (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
          }
        } catch (frameError) {
          const error = `Failed to capture frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown frame error'}`;
          console.error('❌', error, frameError);
          throw new Error(error);
        }
      }

      // Clean up offscreen renderer
      offscreenRenderer.dispose();

      console.log('✅ Frame export complete:', { 
        totalFrames: frames.length,
        expectedFrames: actualFrames,
        success: frames.length === actualFrames
      });
      return frames;
    } catch (error) {
      const errorMsg = `Frame export failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('❌', errorMsg);
      throw error;
    } finally {
      this.scene.background = prevBackground;
      // Restore original rotation
      this.turntable.rotation.y = originalRotation;
      console.log('🔄 Restored original rotation');
    }
  }

  private captureFrameFromRenderer(
    renderer: THREE.WebGLRenderer, 
    targetFileSize: number, 
    totalFrames: number
  ): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        const canvas = renderer.domElement;
        const highResSize = Math.max(canvas.width, canvas.height);
        
        // Final output size for Telegram emoji standard
        const finalSize = 100;
        
        // Calculate WebP quality early for direct rendering path
        const estimatedFrameSize = targetFileSize / totalFrames;
        const webpQuality = 0.99; // MAXIMUM WebP quality for testing
        console.log(`EXPERIMENTAL Frame capture: ${highResSize}px → ${finalSize}px, WebP quality: ${webpQuality} (MAXIMUM for testing), budget: ${estimatedFrameSize.toFixed(0)} bytes/frame`);
        
        // Create a temporary canvas for high-res capture
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        const tempCtx = tempCanvas.getContext('2d', { 
          alpha: true,
          willReadFrequently: false 
        })!;
        
        // Clear with transparent background
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the rendered frame - this preserves alpha from WebGL
        tempCtx.drawImage(canvas, 0, 0);

        // 🎯 BREAKTHROUGH: Skip downscaling if we're already at target size!
        // This eliminates artifacts from downscaling metallic PBR materials
        if (canvas.width === finalSize && canvas.height === finalSize) {
          console.log(`✅ Already at target size ${finalSize}px - skipping downscaling for perfect quality!`);
          
          // Convert directly from temp canvas (no downscaling artifacts!)
          tempCanvas.toBlob((blob) => {
            if (!blob) {
              console.log('⚠️ WebP capture failed, trying PNG with alpha...');
              tempCanvas.toBlob((pngBlob) => {
                resolve(pngBlob || new Blob());
              }, 'image/png');
              return;
            }
            console.log(`✅ Direct WebP capture (no downscaling): ${blob.size} bytes`);
            resolve(blob);
          }, 'image/webp', webpQuality);
          return;
        }

        // Legacy downscaling path (only used if captureSize != 100)
        console.log(`🔄 Downscaling required: ${canvas.width}px → ${finalSize}px`);

        // Create final output canvas at 100px for Telegram emoji standard
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = finalSize;
        outputCanvas.height = finalSize;
        
        const outputCtx = outputCanvas.getContext('2d', { 
          alpha: true,
          willReadFrequently: false 
        })!;;
        
        // Enable high-quality downscaling with multiple passes
        outputCtx.imageSmoothingEnabled = true;
        outputCtx.imageSmoothingQuality = 'high';
        
        // Clear output canvas with transparent background
        outputCtx.clearRect(0, 0, finalSize, finalSize);
        
        // Multi-step downscaling for better quality (avoid large jumps)
        if (canvas.width > finalSize * 2) {
          // For large downscales, use intermediate step
          const intermediateSize = Math.floor(canvas.width / 2);
          const intermediateCanvas = document.createElement('canvas');
          intermediateCanvas.width = intermediateSize;
          intermediateCanvas.height = intermediateSize;
          
          const intermediateCtx = intermediateCanvas.getContext('2d', { 
            alpha: true,
            willReadFrequently: false 
          })!;
          
          intermediateCtx.imageSmoothingEnabled = true;
          intermediateCtx.imageSmoothingQuality = 'high';
          intermediateCtx.clearRect(0, 0, intermediateSize, intermediateSize);
          
          // First downscale: original → intermediate
          intermediateCtx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, 0, intermediateSize, intermediateSize);
          
          // Second downscale: intermediate → final
          outputCtx.drawImage(intermediateCanvas, 0, 0, intermediateSize, intermediateSize, 0, 0, finalSize, finalSize);
          
          console.log(`🔄 Multi-step downscale: ${canvas.width}px → ${intermediateSize}px → ${finalSize}px`);
        } else {
          // Direct downscale for smaller ratios
          outputCtx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, 0, finalSize, finalSize);
          console.log(`🔄 Direct downscale: ${canvas.width}px → ${finalSize}px`);
        }

        // Convert to WebP with quality already calculated above
        console.log(`🔬 Using pre-calculated WebP quality: ${webpQuality} for downscaled output`);
        
        outputCanvas.toBlob((blob) => {
          if (!blob) {
            // If WebP fails, try PNG as fallback which definitely supports alpha
            console.log('⚠️ WebP capture failed, trying PNG with alpha...');
            outputCanvas.toBlob((pngBlob) => {
              if (!pngBlob) {
                resolve(new Blob());
                return;
              }
              console.log('✅ PNG alpha capture successful:', { size: pngBlob.size });
              resolve(pngBlob);
            }, 'image/png');
            return;
          }

          resolve(blob);
        }, 'image/webp', webpQuality);
        
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

  async exportAsWebM(settings: ExportSettings, autoDownload: boolean = false): Promise<Blob> {
    console.log('🎬 Creating 100×100 WebM via serverless function (memory-optimized)...');
    
    try {
      // Step 1: Get the transparent WebP frames (512x512)
      const frames512 = await this.exportFrames(settings);
      
      if (frames512.length === 0) {
        throw new Error('No frames captured for WebM creation');
      }
      
      console.log(`✅ Got ${frames512.length} transparent WebP frames (512×512)`);
      
      // Step 2: Immediately downscale to 100×100 and free 512px frames
      console.log('🔽 Downscaling frames to 100×100 (memory-optimized)...');
      const frames100 = await this.downscaleFramesMemoryOptimized(frames512, 100);
      
      // Clear 512px frames from memory immediately
      frames512.length = 0;
      
      console.log(`✅ Downscaled ${frames100.length} frames to 100×100, freed 512px frames`);
      
      // Force garbage collection to free memory before WebM creation
      if (typeof global !== 'undefined' && global.gc) {
        global.gc();
      }
      
      // Step 3: Create 100×100 WebM via serverless function (no memory limits!)
      console.log('� Creating 100×100 WebM via serverless function...');
      
      try {
        const webmBlob = await this.createWebMViaServerless(frames100, settings);
        
        console.log('✅ WebM created via serverless function:', { size: webmBlob.size });
        
        // Optional download for explicit user request
        if (autoDownload) {
          this.downloadBlob(webmBlob, 'coinmoji-final-100px.webm');
          console.log('📦 Downloaded final WebM: coinmoji-final-100px.webm');
        }
        
        return webmBlob;
      } catch (serverError) {
        console.error('❌ Serverless WebM creation failed:', serverError);
        throw new Error(`Serverless WebM creation failed: ${serverError instanceof Error ? serverError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('❌ WebM export failed:', error);
      throw error;
    }
  }

  private async downscaleFramesMemoryOptimized(frames: Blob[], targetSize: number): Promise<Blob[]> {
    console.log(`🔽 Memory-optimized downscaling ${frames.length} frames to ${targetSize}×${targetSize}...`);
    
    // Dynamic import for code splitting and lazy loading
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');
    
    console.log('📦 Initializing FFmpeg.wasm for frame downscaling...');
    const ffmpeg = new FFmpeg();
    
    // Add logging to see FFmpeg output for debugging
    ffmpeg.on('log', ({ message }) => {
      if (message.includes('error') || message.includes('failed') || message.includes('invalid')) {
        console.log('🔧 FFmpeg downscale ERROR:', message);
      }
    });
    
    await ffmpeg.load();
    console.log('✅ FFmpeg.wasm loaded for frame downscaling');
    
    const scaledFrames: Blob[] = [];
    
    try {
      for (let i = 0; i < frames.length; i++) {
        const frameData = await fetchFile(frames[i]);
        const inputName = `input_${i}.webp`;
        const outputName = `output_${i}.webp`;
        
        console.log(`🔧 Processing frame ${i}: input size ${frameData.length} bytes`);
        
        await ffmpeg.writeFile(inputName, frameData);
        
        // Scale individual frame with proper WebP encoding
        await ffmpeg.exec([
          '-i', inputName,
          '-vf', `scale=${targetSize}:${targetSize}:flags=lanczos`,
          '-c:v', 'libwebp',           // Explicit WebP encoder
          '-quality', '90',            // Slightly lower quality for memory efficiency
          '-lossless', '0',            // Allow lossy compression for smaller size
          '-compression_level', '3',   // Faster compression for memory efficiency
          '-method', '4',              // Good quality but faster method
          outputName
        ]);
        
        const scaledData = await ffmpeg.readFile(outputName);
        
        if (scaledData.length === 0) {
          throw new Error(`Frame ${i} downscaling produced 0 bytes`);
        }
        
        const scaledBlob = new Blob([scaledData], { type: 'image/webp' });
        scaledFrames.push(scaledBlob);
        
        // Immediately clean up this frame's files and source frame
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
        
        // Clear source frame from memory immediately
        frames[i] = null as any;
        
        if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
          console.log(`📸 Downscaled frame ${i + 1}/${frames.length}: ${frameData.length} → ${scaledBlob.size} bytes`);
        }
      }
      
      console.log(`✅ Successfully downscaled ${scaledFrames.length} frames to ${targetSize}×${targetSize}`);
      
      // Validate all frames are properly sized
      const invalidFrames = scaledFrames.filter(frame => frame.size === 0);
      if (invalidFrames.length > 0) {
        throw new Error(`${invalidFrames.length} frames have 0 bytes after downscaling`);
      }
      
      return scaledFrames;
      
    } catch (error) {
      console.error('Frame downscaling error:', error);
      throw new Error(`Frame downscaling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createWebMViaServerless(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('� Creating WebM via serverless function...');
    console.log(`📊 Input: ${frames.length} frames for WebM animation`);
    
    try {
      // Convert frames to base64 for server transmission
      console.log('� Converting frames to base64 for server...');
      const framesBase64: string[] = [];
      
      for (let i = 0; i < frames.length; i++) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error(`Failed to convert frame ${i} to base64`));
          reader.readAsDataURL(frames[i]);
        });
        framesBase64.push(base64);
        
        if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
          console.log(`📋 Converted frame ${i + 1}/${frames.length} to base64`);
        }
      }
      
      const payload = {
        frames: framesBase64,
        framerate: Math.round(frames.length / settings.duration),
        duration: settings.duration
      };
      
      console.log('� Sending WebM creation request to serverless function...');
      console.log(`📊 Payload: ${framesBase64.length} frames, ${payload.framerate} fps, ${payload.duration}s duration`);
      
      const response = await fetch('/.netlify/functions/make-webm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('📡 Serverless function response:', { 
        status: response.status, 
        statusText: response.statusText 
      });
      
      if (!response.ok) {
        const errorResult = await response.json();
        console.error('❌ Serverless WebM creation failed:', errorResult);
        throw new Error(`Serverless function failed: ${errorResult.error || response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.webm_base64) {
        throw new Error(result.error || 'Server response missing WebM data');
      }
      
      console.log('✅ Native FFmpeg WebM creation successful:', {
        size_bytes: result.size_bytes,
        frames_processed: result.frames_processed,
        framerate: result.framerate,
        duration: result.duration
      });
      
      // Convert base64 back to blob
      const webmBuffer = Uint8Array.from(atob(result.webm_base64), c => c.charCodeAt(0));
      const webmBlob = new Blob([webmBuffer], { type: 'video/webm' });
      
      console.log(`✅ WebM blob created: ${webmBlob.size} bytes`);
      console.log('🎯 VP9 WebM with alpha channel created on server!');
      
      return webmBlob;
      
    } catch (error) {
      console.error('Serverless WebM creation error:', error);
      throw new Error(`Serverless WebM creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

export const sendInstallationMessage = async (installUrl: string, initData: string) => {
  console.log('📤 Sending installation message to Telegram:', { installUrl });
  
  // Extract user ID from initData
  const userId = getTelegramUserId(initData);
  console.log('👤 User ID extracted for message:', userId);
  
  const message = `🎉 Your Coinmoji emoji is ready!\n\nClick this link to install it:\n${installUrl}`;

  try {
    const response = await fetch('/.netlify/functions/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-InitData': initData,
      },
      body: JSON.stringify({
        user_id: userId,
        message: message
      }),
    });

    console.log('📡 Message response received:', { status: response.status, statusText: response.statusText });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Send message failed:', errorText);
      throw new Error('Failed to send installation message to Telegram');
    }

    const result = await response.json();
    console.log('✅ Installation message sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error sending installation message:', error);
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
  
  console.log('🔄 Converted to base64 for emoji:', { 
    originalSize: blob.size, 
    base64Length: base64.length,
    base64Sample: base64.substring(0, 50) + '...'
  });

  const userId = getTelegramUserId(initData);
  console.log('👤 User ID for emoji:', userId);

  // Cache busting: Add timestamp to set title to force Telegram to treat as new emoji
  const timestamp = Date.now();
  const cacheDebuggingTitle = `${setTitle} ${timestamp}`;

  const payload = {
    initData,
    user_id: userId,
    set_title: cacheDebuggingTitle,
    emoji_list: emojiList,
    webm_base64: base64,
  };

  console.log('📝 Emoji creation payload prepared:', {
    user_id: payload.user_id,
    set_title: payload.set_title,
    emoji_list: payload.emoji_list,
    webm_base64_length: payload.webm_base64.length,
    initData_length: payload.initData.length,
    cacheBusting: `Added timestamp ${timestamp} to title`
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

    console.log('📡 Emoji creation response received:', { 
      status: response.status, 
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Emoji creation failed:', {
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
    console.log('❌ Error creating custom emoji:', { error: error instanceof Error ? error.message : 'Unknown error' });
    throw error;
  }
};

// Helper to extract user ID from Telegram initData
const getTelegramUserId = (initData: string): number => {
  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get('user') || '{}');
  return user.id;
};

// Send WebM file via Telegram chat
export const sendWebMFile = async (
  blob: Blob,
  initData: string,
  filename: string = 'coinmoji.webm'
) => {
  console.log('📤 Sending WebM file via Telegram:', { 
    blobSize: blob.size, 
    filename,
    initDataLength: initData.length 
  });

  // Convert blob to base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to convert WebM to base64'));
    reader.readAsDataURL(blob);
  });

  const userId = getTelegramUserId(initData);
  console.log('👤 Sending to user ID:', userId);

  try {
    console.log('📡 Sending file via Telegram API...');
    const response = await fetch('/.netlify/functions/send-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'X-Telegram-InitData': initData,
      },
      body: base64,
    });

    const result = await response.json();
    console.log('📡 File send response:', result);

    if (!response.ok || !result.success) {
      throw new Error(result.error || `Failed to send file: ${response.status}`);
    }

    return { success: true, telegram_response: result.telegram_response };
  } catch (error) {
    console.error('❌ Error sending WebM file:', error);
    throw error;
  }
};
