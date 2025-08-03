import * as THREE from 'three';
import { zip } from 'fflate';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
  rotationSpeed?: number; // radians per frame at 60fps (optional, defaults to medium speed)
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
    const { fps, duration, size } = settings;
    const totalFrames = Math.floor(fps * duration);
    
    // Limit frames more aggressively to prevent stack overflow
    // Max 30 frames but keep the SAME DURATION for proper timing
    const maxFrames = 30;
    const actualFrames = Math.min(totalFrames, maxFrames);
    
    const frames: Blob[] = [];

    console.log('📹 Starting frame export:', { 
      fps, 
      duration, 
      size, 
      requestedFrames: totalFrames, 
      actualFrames,
      maxAllowed: maxFrames
    });

    // Store original rotation
    const originalRotation = this.turntable.rotation.y;
    console.log('💾 Stored original rotation:', originalRotation);

    const prevBackground = this.scene.background;
    try {
      // Set scene background to null for transparency
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
      
      // Ensure renderer actually uses alpha
      offscreenRenderer.shadowMap.enabled = false; // Disable shadows that can interfere
      offscreenRenderer.autoClear = true;

      // Create dedicated camera for export with perfect coin framing
      const exportCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      exportCamera.position.set(0, 0, 2.8); // Position for proper coin framing
      exportCamera.lookAt(0, 0, 0);

      console.log('🎯 Created offscreen renderer:', { 
        size: captureSize, 
        transparent: true,
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
          const blob = await this.captureFrameFromRenderer(offscreenRenderer);
          
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

  private captureFrameFromRenderer(renderer: THREE.WebGLRenderer): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        const canvas = renderer.domElement;
        
        // Create a temporary canvas with explicit alpha support
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        const tempCtx = tempCanvas.getContext('2d', { 
          alpha: true,
          willReadFrequently: false 
        })!;
        
        // Clear with transparent background
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the rendered frame - this should preserve alpha from WebGL
        tempCtx.drawImage(canvas, 0, 0);

        // Convert to WebP with alpha preservation and higher quality
        tempCanvas.toBlob((blob) => {
          if (!blob) {
            // If WebP fails, try PNG as fallback which definitely supports alpha
            console.log('⚠️ WebP capture failed, trying PNG with alpha...');
            tempCanvas.toBlob((pngBlob) => {
              if (!pngBlob) {
                resolve(new Blob());
                return;
              }
              console.log('✅ PNG alpha capture successful:', { size: pngBlob.size });
              resolve(pngBlob);
            }, 'image/png');
            return;
          }

          console.log('✅ WebP alpha capture successful:', { size: blob.size });
          resolve(blob);
        }, 'image/webp', 0.95); // Higher quality for better alpha preservation
        
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
    console.log('🎬 Creating animated WebP from transparent frames...');
    
    try {
      // Step 1: Get the transparent WebP frames (512x512)
      const frames = await this.exportFrames(settings);
      
      if (frames.length === 0) {
        throw new Error('No frames captured for animated WebP creation');
      }
      
      console.log(`✅ Got ${frames.length} transparent WebP frames`);
      
      // Download ZIP of frames for inspection
      const zipBlob = await this.exportAsZip(settings);
      this.downloadBlob(zipBlob, 'coinmoji-frames.zip');
      console.log('📦 Downloaded ZIP of transparent frames');
      
      // Step 2: Stack frames into animated WebP
      const animatedWebPBlob = await this.createAnimatedWebP(frames, settings);
      
      console.log('✅ Animated WebP created:', { size: animatedWebPBlob.size });
      
      // Download with correct extension based on actual file type
      const isWebM = animatedWebPBlob.type.includes('video/webm');
      const filename = isWebM ? 'coinmoji-animated.webm' : 'coinmoji-animated.webp';
      const fileDescription = isWebM ? 'animated WebM (client-side fallback)' : 'animated WebP (server-side)';
      
      this.downloadBlob(animatedWebPBlob, filename);
      console.log(`📦 Downloaded ${fileDescription}: ${filename}`);
      
      return animatedWebPBlob;
      
    } catch (error) {
      console.error('❌ Animated WebP creation failed:', error);
      throw error;
    }
  }

  private async createAnimatedWebP(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🔧 Creating animated WebP by stacking transparent frames...');
    
    try {
      // First try FFmpeg.wasm for client-side animated WebP with transparency
      return await this.createAnimatedWebPViaFFmpeg(frames, settings);
    } catch (ffmpegError) {
      console.error('❌ FFmpeg.wasm animated WebP creation failed:', ffmpegError);
      console.log('🔄 Falling back to server guidance...');
      
      try {
        return await this.createAnimatedWebPViaServer(frames, settings);
      } catch (serverError) {
        console.error('❌ Server-side animated WebP creation failed:', serverError);
        console.log('� For transparent animated WebP: Download ZIP and use EZGIF.com or ImageMagick');
        console.log('�📦 Falling back to client-side WebM (transparency will be lost)');
        // Since browsers can't create animated WebP, create WebM as last resort (but loses transparency)
        return await this.createAnimatedPngViaCanvas(frames, settings);
      }
    }
  }

  private async createAnimatedPngViaCanvas(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🎨 Creating animated PNG with transparency (client-side fallback)...');
    console.log('📝 Note: Creating series of PNG frames in a WebM container with transparency');
    
    // Load all frames as images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frames.length; i++) {
      const img = await this.blobToImage(frames[i]);
      images.push(img);
    }
    
    console.log(`📸 Loaded ${images.length} images for PNG animation`);
    
    // Create canvas with maximum transparency support
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      colorSpace: 'srgb',
      desynchronized: false,
      willReadFrequently: false
    })!;
    
    // ALTERNATIVE APPROACH: Instead of trying to preserve alpha in WebM (which doesn't work),
    // let's create a data structure that can be used to recreate the animation elsewhere
    console.log('🔄 Creating frame-by-frame PNG sequence...');
    
    const animatedFrames: Blob[] = [];
    
    // Convert each frame to PNG with transparency preserved
    for (let i = 0; i < images.length; i++) {
      // Clear canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the frame
      ctx.drawImage(images[i], 0, 0);
      
      // Convert to PNG blob (preserves transparency)
      const pngBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob || new Blob());
        }, 'image/png', 1.0); // PNG at full quality
      });
      
      animatedFrames.push(pngBlob);
      
      if (i === 0 || i === images.length - 1) {
        console.log(`🖼️ Frame ${i} converted to PNG: ${pngBlob.size} bytes`);
      }
    }
    
    console.log('✅ All frames converted to PNG with transparency');
    
    // Since we can't create a true animated format that browsers support with transparency,
    // let's create a WebM but with a clear note that it won't have transparency
    // The user can use the individual PNG frames from the ZIP to create proper animated WebP elsewhere
    
    const stream = canvas.captureStream(settings.fps);
    
    let recorder: MediaRecorder;
    let mimeType = 'video/webm;codecs=vp9';
    
    try {
      recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 1500000
      });
    } catch (vp9Error) {
      try {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 1500000
        });
        mimeType = 'video/webm;codecs=vp8';
      } catch (vp8Error) {
        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 1500000
        });
        mimeType = 'video/webm';
      }
    }
    
    console.log(`🎥 Creating WebM animation (transparency not preserved): ${mimeType}`);
    console.log('💡 For transparency, use the individual frames from the ZIP file');
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    recorder.start(100);
    
    // Animate through the frames
    const frameDuration = (settings.duration * 1000) / frames.length;
    let currentFrame = 0;
    let frameCount = 0;
    
    const animateFrame = () => {
      // Clear and draw frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[currentFrame], 0, 0);
      
      currentFrame = (currentFrame + 1) % images.length;
      frameCount++;
    };
    
    const frameInterval = setInterval(animateFrame, frameDuration);
    animateFrame();
    
    const recordingDuration = settings.duration * 1000 * 2; // 2 loops
    
    return new Promise<Blob>((resolve, reject) => {
      setTimeout(() => {
        clearInterval(frameInterval);
        
        recorder.onstop = () => {
          const webmBlob = new Blob(chunks, { type: 'video/webm' });
          
          console.log('✅ WebM animation created (without transparency):', { 
            size: webmBlob.size,
            codec: mimeType,
            framesProcessed: frameCount,
            note: 'Use ZIP frames for transparency - WebM cannot preserve alpha in browsers'
          });
          
          resolve(webmBlob);
        };
        
        recorder.onerror = reject;
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, recordingDuration);
    });
  }

  private async createAnimatedWebPViaFFmpeg(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🎬 Creating animated WebP using FFmpeg.wasm...');
    
    // Dynamic import for code splitting and lazy loading
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile } = await import('@ffmpeg/util');
    
    console.log('📦 Initializing FFmpeg.wasm...');
    const ffmpeg = new FFmpeg();
    
    await ffmpeg.load();
    console.log('✅ FFmpeg.wasm loaded successfully');
    
    try {
      // Convert blobs to Uint8Array and write to FFmpeg filesystem
      console.log(`📝 Writing ${frames.length} WebP frames to FFmpeg filesystem...`);
      for (let i = 0; i < frames.length; i++) {
        const frameData = await fetchFile(frames[i]);
        await ffmpeg.writeFile(`frame${String(i).padStart(4, '0')}.webp`, frameData);
      }
      
      // Calculate framerate from settings
      const framerate = Math.round(frames.length / settings.duration);
      console.log(`🎯 Creating animated WebP: ${frames.length} frames, ${framerate} fps, ${settings.duration}s duration`);
      
      // Create animated WebP with transparency and frame replacement (not stacking)
      await ffmpeg.exec([
        '-framerate', framerate.toString(),
        '-i', 'frame%04d.webp',
        '-c:v', 'libwebp',
        '-pix_fmt', 'yuva420p', // Enable alpha channel
        '-loop', '0', // Loop forever
        '-q:v', '80', // Quality (0-100, higher = better quality)
        '-compression_level', '1', // Compression level (0-6, higher = smaller file)
        '-vf', 'scale=512:512', // Ensure consistent frame size
        '-dispose', 'background', // Clear frame before next (prevents stacking)
        'animated.webp'
      ]);
      
      console.log('📖 Reading animated WebP from FFmpeg filesystem...');
      const animatedWebPData = await ffmpeg.readFile('animated.webp');
      
      // Clean up FFmpeg filesystem (optional, but good practice)
      try {
        for (let i = 0; i < frames.length; i++) {
          await ffmpeg.deleteFile(`frame${String(i).padStart(4, '0')}.webp`);
        }
        await ffmpeg.deleteFile('animated.webp');
      } catch (cleanupError) {
        console.warn('Failed to clean up FFmpeg filesystem:', cleanupError);
      }
      
      // Convert Uint8Array to Blob
      const webpBlob = new Blob([animatedWebPData], { type: 'image/webp' });
      
      console.log(`✅ Animated WebP created with FFmpeg.wasm: ${webpBlob.size} bytes`);
      console.log('🎯 Transparency preserved in animated WebP!');
      
      return webpBlob;
      
    } catch (error) {
      console.error('FFmpeg.wasm processing error:', error);
      throw new Error(`FFmpeg.wasm failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image from blob'));
      };
      
      img.src = url;
    });
  }

  private async createAnimatedWebPViaServer(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('📤 Sending WebP frames to server for webpmux animation...');
    
    // Convert frames to base64 for server transmission
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
    }
    
    // Calculate frame duration in milliseconds
    // Total duration / number of frames = duration per frame
    const frameDurationMs = Math.round((settings.duration * 1000) / frames.length);
    
    const payload = {
      frames_base64: framesBase64,
      frame_format: 'webp',
      frame_duration_ms: frameDurationMs,
      settings: {
        fps: settings.fps,
        duration: settings.duration,
        loop: true, // Infinite loop
        transparent_bg: true // Ensure transparency
      }
    };
    
    console.log(`📊 Animated WebP settings: ${frames.length} frames, ${frameDurationMs}ms per frame`);
    
    const response = await fetch('/.netlify/functions/create-animated-webp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    // Handle the new server response format
    if (response.ok && result.serverless_limitation) {
      console.log('📋 Server provided detailed animation guidance:', result);
      console.log('🎯 Animation specs:', result.animation_specs);
      console.log('🛠️ Recommended tools:', result.recommended_workflow.tools);
      
      // Create a helpful error message with the guidance
      const toolInfo = result.recommended_workflow.tools[0]; // EZGIF as primary recommendation
      throw new Error(`Server-side animation requires external processing. Use ${toolInfo.name} (${toolInfo.description}) - ${toolInfo.url || 'verified working'}`);
    }
    
    if (!response.ok) {
      let errorMessage = `Server animated WebP creation failed: ${response.status} ${response.statusText}`;
      
      // Try to get more detailed error information
      try {
        if (result.reason || result.workaround) {
          console.log('💡 Server provided workaround information:', result);
          
          if (result.workaround && result.workaround.steps) {
            console.log('🔧 Workaround steps:', result.workaround.steps);
            errorMessage = `${result.error}. Workaround: ${result.workaround.message}`;
          } else {
            errorMessage = result.error || errorMessage;
          }
        }
      } catch (parseError) {
        // If JSON parsing fails, use the original error message
      }
      
      throw new Error(errorMessage);
    }
    
    if (!result.success || !result.webp_base64) {
      throw new Error(result.error || 'Server response missing animated WebP data');
    }
    
    console.log('✅ Server webpmux animation successful');
    
    // Convert base64 back to blob
    const webpBuffer = Uint8Array.from(atob(result.webp_base64), c => c.charCodeAt(0));
    return new Blob([webpBuffer], { type: 'image/webp' });
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
