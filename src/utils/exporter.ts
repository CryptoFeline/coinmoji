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
    console.log('🎬 Creating WebM from WebP frames...');
    
    try {
      // First, get the WebP frames (same as ZIP export)
      const frames = await this.exportFrames(settings);
      
      if (frames.length === 0) {
        throw new Error('No frames captured for WebM creation');
      }
      
      console.log(`✅ Got ${frames.length} WebP frames for WebM creation`);
      
      // Convert WebP frames to WebM using client-side approach
      const webmBlob = await this.createWebMFromFrames(frames, settings);
      
      console.log('✅ WebM created successfully:', { size: webmBlob.size });
      return webmBlob;
      
    } catch (error) {
      console.error('❌ WebM creation failed:', error);
      throw error;
    }
  }

  private async createWebMFromFrames(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🔧 Converting WebP frames to WebM with transparency preservation...');
    
    try {
      // Method 1: Try server-side conversion with the improved pipeline
      console.log('🌐 Trying server-side animated WebP → WebM conversion...');
      return await this.createWebMViaServer(frames, settings);
    } catch (serverError) {
      console.log('⚠️ Server-side failed, trying client-side animated WebP → WebM conversion:', serverError);
      // Method 2: Client-side animated WebP → WebM conversion
      try {
        return await this.createWebMViaAnimatedWebP(frames, settings);
      } catch (animatedError) {
        console.log('⚠️ Animated WebP pipeline failed, trying simple canvas approach:', animatedError);
        // Method 3: Simple canvas approach as final fallback
        return await this.createWebMViaSimpleCanvas(frames, settings);
      }
    }
  }

  private async createWebMViaServer(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('📤 Sending WebP frames to server for FFmpeg conversion...');
    
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
    
    const payload = {
      frames_base64: framesBase64,
      frame_format: 'webp',
      settings: {
        fps: settings.fps,
        size: settings.size,
        duration: settings.duration
      }
    };
    
    const response = await fetch('/.netlify/functions/create-webm-from-frames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Server conversion failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.webm_base64) {
      throw new Error(result.error || 'Server response missing WebM data');
    }
    
    console.log('✅ Server FFmpeg conversion successful');
    
    // Convert base64 back to blob
    const webmBuffer = Uint8Array.from(atob(result.webm_base64), c => c.charCodeAt(0));
    return new Blob([webmBuffer], { type: 'video/webm' });
  }

  private async createWebMViaAnimatedWebP(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🎨 Creating WebM via Animated WebP → Resize → WebM pipeline...');
    
    try {
      // Step 1: Create animated WebP from individual WebP frames
      console.log('📸 Creating animated WebP from individual frames...');
      const animatedWebP = await this.createAnimatedWebPFromFrames(frames, settings);
      
      // Step 2: Resize animated WebP to target size (preserves transparency)
      console.log(`🔍 Resizing animated WebP to ${settings.size}x${settings.size}...`);
      const resizedAnimatedWebP = await this.resizeAnimatedWebP(animatedWebP, settings.size);
      
      // Step 3: Convert resized animated WebP to WebM
      console.log('🎬 Converting resized animated WebP to WebM...');
      const webmBlob = await this.convertAnimatedWebPToWebM(resizedAnimatedWebP, settings);
      
      console.log('✅ Animated WebP → WebM conversion completed:', { size: webmBlob.size });
      return webmBlob;
      
    } catch (error) {
      console.error('❌ Animated WebP conversion failed:', error);
      throw error;
    }
  }

  private async createAnimatedWebPFromFrames(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🔧 Creating animated WebP from individual WebP frames...');
    
    // Create a canvas to work with the frames
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Get dimensions from first frame
    const firstImg = await this.blobToImage(frames[0]);
    canvas.width = firstImg.width;
    canvas.height = firstImg.height;
    
    console.log(`📐 Canvas size: ${canvas.width}x${canvas.height}`);
    
    // For now, we'll use a simple approach: create frames as data URLs and use them with MediaRecorder
    // This creates an intermediate video that we can convert to WebM
    const stream = canvas.captureStream(settings.fps);
    
    // Use WebM with alpha support - try VP9 first, fallback to VP8
    let mimeType = 'video/webm;codecs=vp9';
    let videoBitsPerSecond = 2000000;
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.log('⚠️ VP9 not supported, trying VP8...');
      mimeType = 'video/webm;codecs=vp8';
      videoBitsPerSecond = 1500000; // Lower bitrate for VP8
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.log('⚠️ VP8 not supported, trying default WebM...');
        mimeType = 'video/webm';
        videoBitsPerSecond = 1000000; // Conservative bitrate
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          throw new Error('WebM not supported in this browser for animated WebP conversion');
        }
      }
    }
    
    console.log('✅ Using MediaRecorder with:', { mimeType, videoBitsPerSecond });
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    // Start recording
    recorder.start();
    console.log('🎬 Started animated WebP recording...');
    
    // Calculate frame timing
    const frameDuration = (settings.duration * 1000) / frames.length; // ms per frame
    
    // Render each frame with transparency preservation
    for (let i = 0; i < frames.length; i++) {
      // Clear canvas with full transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Load and draw the WebP frame
      const img = await this.blobToImage(frames[i]);
      ctx.drawImage(img, 0, 0);
      
      // Wait for frame duration
      await new Promise(resolve => setTimeout(resolve, frameDuration));
      
      if (i % 5 === 0) {
        console.log(`📸 Processed animated frame ${i + 1}/${frames.length}`);
      }
    }
    
    // Stop recording and return result
    return new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const animatedBlob = new Blob(chunks, { type: 'video/webm' });
        console.log('✅ Animated WebP (as WebM) created:', { size: animatedBlob.size });
        resolve(animatedBlob);
      };
      
      recorder.onerror = (event) => {
        console.error('❌ Animated WebP recording error:', event);
        reject(new Error('Animated WebP recording failed'));
      };
      
      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 100);
    });
  }

  private async resizeAnimatedWebP(animatedWebP: Blob, targetSize: number): Promise<Blob> {
    console.log(`🔍 Resizing animated WebP to ${targetSize}x${targetSize}...`);
    
    // Create video element to load the animated WebP (stored as WebM)
    const video = document.createElement('video');
    video.src = URL.createObjectURL(animatedWebP);
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Wait for video to be ready and have valid duration
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        console.log('📺 Video metadata loaded:', { 
          duration: video.duration, 
          videoWidth: video.videoWidth, 
          videoHeight: video.videoHeight 
        });
        
        if (video.duration && video.duration > 0) {
          resolve(video.duration);
        } else {
          console.log('⚠️ Video duration invalid, using default duration: 3 seconds');
          resolve(3); // Default 3 second duration
        }
      };
      video.onerror = (e) => {
        console.error('❌ Video load error:', e);
        reject(new Error('Video failed to load'));
      };
      video.load();
    });
    
    // Create canvas for resizing
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Set up recording for resized version with codec fallback
    const stream = canvas.captureStream(30); // Use 30fps for smooth resize
    
    let mimeType = 'video/webm;codecs=vp9';
    let videoBitsPerSecond = 1500000;
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.log('⚠️ VP9 not supported for resize, trying VP8...');
      mimeType = 'video/webm;codecs=vp8';
      videoBitsPerSecond = 1200000;
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.log('⚠️ VP8 not supported for resize, using default WebM...');
        mimeType = 'video/webm';
        videoBitsPerSecond = 1000000;
      }
    }
    
    console.log('✅ Resize recorder using:', { mimeType, videoBitsPerSecond });
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    // Start recording resized version
    recorder.start();
    await video.play();
    
    console.log('🎬 Recording resized animated WebP...');
    
    // Continuously draw video to canvas at target size to create resized version
    const drawFrame = () => {
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(video, 0, 0, targetSize, targetSize);
    };
    
    // Draw frames for the duration of the animation
    const interval = setInterval(drawFrame, 1000/30); // 30fps
    
    // Use the actual video duration or fallback to 3 seconds
    const recordDuration = (video.duration && video.duration > 0) ? video.duration * 1000 : 3000;
    console.log('🎬 Recording for duration:', recordDuration, 'ms');
    
    // Record for the duration of the animation  
    await new Promise(resolve => setTimeout(resolve, recordDuration));
    
    clearInterval(interval);
    
    // Stop recording
    return new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const resizedBlob = new Blob(chunks, { type: 'video/webm' });
        console.log('✅ Resized animated WebP created:', { size: resizedBlob.size });
        URL.revokeObjectURL(video.src);
        resolve(resizedBlob);
      };
      
      recorder.onerror = (event) => {
        console.error('❌ Resize recording error:', event);
        URL.revokeObjectURL(video.src);
        reject(new Error('Resize recording failed'));
      };
      
      recorder.stop();
      stream.getTracks().forEach(track => track.stop());
      video.pause();
    });
  }

  private async convertAnimatedWebPToWebM(animatedWebP: Blob, settings: ExportSettings): Promise<Blob> {
    console.log('🎬 Converting animated WebP to final WebM...');
    
    // The resized animated WebP is already in WebM format from our pipeline
    // But we want to ensure it meets Telegram emoji requirements
    
    // Create video element
    const video = document.createElement('video');
    video.src = URL.createObjectURL(animatedWebP);
    video.muted = true;
    video.loop = false; // Don't loop for final version
    video.playsInline = true;
    
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = reject;
      video.load();
    });
    
    // Create final canvas at exact target size
    const canvas = document.createElement('canvas');
    canvas.width = settings.size;
    canvas.height = settings.size;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Set up final recording with Telegram-compatible settings and codec fallback
    const stream = canvas.captureStream(settings.fps);
    
    let mimeType = 'video/webm;codecs=vp9';
    let videoBitsPerSecond = 800000; // Telegram emoji size limit friendly
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.log('⚠️ VP9 not supported for final, trying VP8...');
      mimeType = 'video/webm;codecs=vp8';
      videoBitsPerSecond = 600000;
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.log('⚠️ VP8 not supported for final, using default WebM...');
        mimeType = 'video/webm';
        videoBitsPerSecond = 500000;
      }
    }
    
    console.log('✅ Final recorder using:', { mimeType, videoBitsPerSecond });
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    // Start final recording
    recorder.start();
    await video.play();
    
    console.log('🎬 Recording final WebM for Telegram...');
    
    // Draw video frames to canvas for exact duration
    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };
    
    // Draw frames for the specified duration
    const frameInterval = 1000 / settings.fps;
    const totalFrames = Math.floor(settings.duration * settings.fps);
    
    for (let i = 0; i < totalFrames; i++) {
      drawFrame();
      await new Promise(resolve => setTimeout(resolve, frameInterval));
    }
    
    // Stop recording and return final WebM
    return new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const finalWebM = new Blob(chunks, { type: 'video/webm' });
        console.log('✅ Final WebM created for Telegram:', { 
          size: finalWebM.size,
          sizeKB: Math.round(finalWebM.size / 1024),
          underLimit: finalWebM.size < 256 * 1024
        });
        URL.revokeObjectURL(video.src);
        resolve(finalWebM);
      };
      
      recorder.onerror = (event) => {
        console.error('❌ Final WebM recording error:', event);
        URL.revokeObjectURL(video.src);
        reject(new Error('Final WebM recording failed'));
      };
      
      recorder.stop();
      stream.getTracks().forEach(track => track.stop());
      video.pause();
    });
  }

  private async createWebMViaSimpleCanvas(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🎨 Creating WebM via Simple Canvas approach (fallback)...');
    
    // Create a canvas directly at target size
    const canvas = document.createElement('canvas');
    canvas.width = settings.size;
    canvas.height = settings.size;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Set up recording with the most compatible settings
    const stream = canvas.captureStream(settings.fps);
    
    let mimeType = 'video/webm';
    let videoBitsPerSecond = 500000; // Conservative bitrate
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error('WebM not supported in this browser - cannot create video');
    }
    
    console.log('✅ Simple canvas using:', { mimeType, videoBitsPerSecond, targetSize: settings.size });
    
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond
    });
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    // Start recording
    recorder.start();
    console.log('🎬 Started simple canvas recording...');
    
    // Calculate frame timing
    const frameDuration = (settings.duration * 1000) / frames.length; // ms per frame
    
    // Render each frame directly to target size
    for (let i = 0; i < frames.length; i++) {
      // Clear canvas with transparency
      ctx.clearRect(0, 0, settings.size, settings.size);
      
      // Load and draw the WebP frame at target size
      const img = await this.blobToImage(frames[i]);
      ctx.drawImage(img, 0, 0, settings.size, settings.size);
      
      // Wait for frame duration
      await new Promise(resolve => setTimeout(resolve, frameDuration));
      
      if (i % 5 === 0) {
        console.log(`📸 Simple canvas frame ${i + 1}/${frames.length}`);
      }
    }
    
    // Stop recording and return result
    return new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const webmBlob = new Blob(chunks, { type: 'video/webm' });
        console.log('✅ Simple canvas WebM created:', { 
          size: webmBlob.size,
          sizeKB: Math.round(webmBlob.size / 1024),
          underLimit: webmBlob.size < 256 * 1024
        });
        resolve(webmBlob);
      };
      
      recorder.onerror = (event) => {
        console.error('❌ Simple canvas recording error:', event);
        reject(new Error('Simple canvas recording failed'));
      };
      
      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 100);
    });
  }

  private blobToImage(blob: Blob): Promise<HTMLImageElement> {
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
