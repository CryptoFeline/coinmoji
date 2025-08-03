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
    console.log('🎬 Creating WebM via animated WebP workflow...');
    
    try {
      // Step 1: Get the WebP frames (512x512 with transparency)
      const frames = await this.exportFrames(settings);
      
      if (frames.length === 0) {
        throw new Error('No frames captured for WebM creation');
      }
      
      console.log(`✅ Got ${frames.length} WebP frames for animated WebP creation`);
      
      // For testing: Download ZIP of frames
      const zipBlob = await this.exportAsZip(settings);
      this.downloadBlob(zipBlob, 'coinmoji-frames.zip');
      console.log('📦 Downloaded ZIP of frames for inspection');
      
      // Step 2: Create animated WebP using webpmux (server-side)
      const animatedWebPBlob = await this.createAnimatedWebP(frames, settings);
      
      console.log('✅ Animated WebP created:', { size: animatedWebPBlob.size });
      
      // For testing: Download original animated WebP (512x512)
      this.downloadBlob(animatedWebPBlob, 'coinmoji-animated-512px.webp');
      console.log('📦 Downloaded 512px animated WebP for inspection');
      
      // Step 3: Resize animated WebP to 100x100 (preserving transparency)
      const resizedWebPBlob = await this.resizeAnimatedWebP(animatedWebPBlob, settings.size);
      
      console.log('✅ Animated WebP resized to 100x100:', { size: resizedWebPBlob.size });
      
      // For testing: Download resized animated WebP (100x100)
      this.downloadBlob(resizedWebPBlob, 'coinmoji-animated-100px.webp');
      console.log('📦 Downloaded 100px animated WebP for inspection');
      
      // Step 4: Convert resized animated WebP to WebM
      const webmBlob = await this.convertAnimatedWebPToWebM(resizedWebPBlob, settings);
      
      console.log('✅ WebM created successfully:', { size: webmBlob.size });
      
      // For testing: Download final WebM
      this.downloadBlob(webmBlob, 'coinmoji-final.webm');
      console.log('📦 Downloaded final WebM for inspection');
      
      return webmBlob;
      
    } catch (error) {
      console.error('❌ WebM creation failed:', error);
      throw error;
    }
  }

  private async createAnimatedWebP(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🔧 Creating animated WebP using webpmux...');
    
    try {
      return await this.createAnimatedWebPViaServer(frames, settings);
    } catch (serverError) {
      console.log('⚠️ Server-side webpmux failed, trying client-side fallback:', serverError);
      // Fallback to client-side approach if server fails
      return await this.createAnimatedWebPViaCanvas(frames, settings);
    }
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
    
    if (!response.ok) {
      throw new Error(`Server animated WebP creation failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.webp_base64) {
      throw new Error(result.error || 'Server response missing animated WebP data');
    }
    
    console.log('✅ Server webpmux animation successful');
    
    // Convert base64 back to blob
    const webpBuffer = Uint8Array.from(atob(result.webp_base64), c => c.charCodeAt(0));
    return new Blob([webpBuffer], { type: 'image/webp' });
  }

  private async createAnimatedWebPViaCanvas(frames: Blob[], settings: ExportSettings): Promise<Blob> {
    console.log('🎨 Creating animated WebP via Canvas (client-side fallback)...');
    console.log('⚠️ Client-side animated WebP creation: Browser limitations prevent true animated WebP creation');
    console.log('🎯 Fallback strategy: Creating WebM with transparency that can be converted later');
    
    // Create a canvas to composite the frames
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Use original frame size
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Load all frames as images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frames.length; i++) {
      const img = await this.blobToImage(frames[i]);
      images.push(img);
    }
    
    console.log(`📸 Loaded ${images.length} images for animation`);
    
    // Create a video stream from the canvas with alpha support
    const stream = canvas.captureStream(settings.fps);
    
    // Try different codecs for better transparency support
    let mimeType = 'video/webm;codecs=vp9';
    let recorder: MediaRecorder;
    
    try {
      // Try VP9 with alpha support first
      recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 3000000 // Higher bitrate for quality and transparency
      });
    } catch (vp9Error) {
      console.log('⚠️ VP9 codec not supported, trying VP8...');
      try {
        // Fallback to VP8
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 3000000
        });
        mimeType = 'video/webm;codecs=vp8';
      } catch (vp8Error) {
        console.log('⚠️ VP8 codec not supported, using default...');
        // Final fallback to default
        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: 3000000
        });
        mimeType = 'video/webm';
      }
    }
    
    console.log(`🎥 Using codec for WebM fallback: ${mimeType}`);
    
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log(`📊 Canvas recording chunk received: ${event.data.size} bytes`);
        chunks.push(event.data);
      }
    };
    
    // Start recording
    recorder.start(1000); // Request data every 1000ms to ensure we get chunks
    
    // Animate through the frames with precise timing
    const frameDuration = (settings.duration * 1000) / frames.length; // ms per frame
    let currentFrame = 0;
    let frameCount = 0;
    
    const animateFrame = () => {
      // CRITICAL: Clear canvas completely including alpha channel
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set composite operation for proper transparency
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw the current frame
      ctx.drawImage(images[currentFrame], 0, 0);
      
      currentFrame = (currentFrame + 1) % images.length;
      frameCount++;
    };
    
    // Start animation loop with precise timing
    const frameInterval = setInterval(animateFrame, frameDuration);
    
    // Initial frame
    animateFrame();
    
    // Record for the specified duration (ensure we get at least one full loop)
    const recordingDuration = Math.max(settings.duration * 1000, frames.length * frameDuration);
    
    return new Promise<Blob>((resolve, reject) => {
      const stopRecording = () => {
        clearInterval(frameInterval);
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.onstop = () => {
        if (chunks.length === 0) {
          console.error('❌ No data recorded - Canvas MediaRecorder produced empty chunks');
          reject(new Error('No data recorded during canvas animation'));
          return;
        }
        
        // Create a WebM blob with proper type (this will be treated as animated WebP substitute)
        const webmBlob = new Blob(chunks, { type: 'video/webm' });
        
        if (webmBlob.size === 0) {
          console.error('❌ Empty WebM blob created from canvas');
          reject(new Error('Empty WebM blob created during canvas animation'));
          return;
        }
        
        console.log('✅ Canvas WebM (animated WebP substitute) creation completed:', { 
          size: webmBlob.size,
          codec: mimeType,
          framesProcessed: frameCount,
          chunksCount: chunks.length,
          duration: recordingDuration,
          note: 'This WebM will be handled as animated WebP in the workflow'
        });
        resolve(webmBlob);
      };
      
      recorder.onerror = (error) => {
        console.error('❌ Canvas recording failed:', error);
        stopRecording();
        reject(new Error('Canvas recording failed'));
      };
      
      // Stop recording after the duration
      setTimeout(() => {
        console.log('⏱️ Stopping canvas recording...');
        stopRecording();
      }, recordingDuration + 200); // Extra buffer
    });
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

  private async resizeAnimatedWebP(animatedWebPBlob: Blob, targetSize: number): Promise<Blob> {
    console.log(`🔧 Resizing animated WebP to ${targetSize}x${targetSize}...`);
    
    try {
      return await this.resizeAnimatedWebPViaServer(animatedWebPBlob, targetSize);
    } catch (serverError) {
      console.log('⚠️ Server-side resize failed, trying client-side fallback:', serverError);
      // Client-side resize fallback using canvas
      return await this.resizeAnimatedWebPViaCanvas(animatedWebPBlob, targetSize);
    }
  }

  private async resizeAnimatedWebPViaServer(animatedWebPBlob: Blob, targetSize: number): Promise<Blob> {
    console.log('📤 Sending animated WebP to server for resizing...');
    
    // Convert blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to convert animated WebP to base64'));
      reader.readAsDataURL(animatedWebPBlob);
    });
    
    const payload = {
      webp_base64: base64,
      target_width: targetSize,
      target_height: targetSize
    };
    
    const response = await fetch('/.netlify/functions/resize-animated-webp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Server animated WebP resize failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.webp_base64) {
      throw new Error(result.error || 'Server response missing resized animated WebP data');
    }
    
    console.log('✅ Server animated WebP resize successful');
    
    // Convert base64 back to blob
    const webpBuffer = Uint8Array.from(atob(result.webp_base64), c => c.charCodeAt(0));
    return new Blob([webpBuffer], { type: 'image/webp' });
  }

  private async resizeAnimatedWebPViaCanvas(animatedWebPBlob: Blob, targetSize: number): Promise<Blob> {
    console.log(`🎨 Resizing animated WebP to ${targetSize}x${targetSize} via Canvas (client-side fallback)...`);
    
    // For client-side fallback, since we can't actually resize an animated WebP,
    // we'll just pass it through. The browser's MediaRecorder will handle the sizing.
    // This is a simplified approach that works for download testing.
    console.log('⚠️ Client-side resize: passing through original size (browser will handle final sizing)');
    return animatedWebPBlob;
  }

  private async convertAnimatedWebPToWebM(animatedWebPBlob: Blob, settings: ExportSettings): Promise<Blob> {
    console.log('🔧 Converting animated WebP to WebM...');
    
    // Check if we already have a WebM (from client-side canvas approach)
    if (animatedWebPBlob.type === 'video/webm' || animatedWebPBlob.size > 50000) {
      console.log('🎯 Detected WebM from canvas fallback, resizing to target dimensions...');
      // Create a resized WebM with proper dimensions
      return await this.resizeWebMToTarget(animatedWebPBlob, settings.size);
    }
    
    try {
      return await this.convertAnimatedWebPToWebMViaServer(animatedWebPBlob, settings);
    } catch (serverError) {
      console.log('⚠️ Server-side conversion failed, trying client-side fallback:', serverError);
      // Fallback to client-side approach if server fails
      return await this.convertAnimatedWebPToWebMViaCanvas(animatedWebPBlob, settings);
    }
  }

  private async resizeWebMToTarget(webmBlob: Blob, targetSize: number): Promise<Blob> {
    console.log(`🎨 Resizing WebM to ${targetSize}x${targetSize} using canvas...`);
    
    // Create video element to load the WebM
    const video = document.createElement('video');
    const url = URL.createObjectURL(webmBlob);
    
    try {
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('crossorigin', 'anonymous');
      
      // Wait for video to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error('Failed to load WebM video'));
        video.load();
      });
      
      console.log(`📹 Video loaded: ${video.videoWidth}x${video.videoHeight}, duration: ${video.duration}s`);
      
      // Create canvas for resizing with transparency support
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d', { 
        alpha: true,
        willReadFrequently: false 
      })!;
      
      // Setup MediaRecorder for resized output with transparency
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Try VP9 first for better transparency support
      let recorder: MediaRecorder;
      let codecUsed = 'vp9';
      
      try {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 800000 // Moderate bitrate for emoji
        });
      } catch (vp9Error) {
        console.log('⚠️ VP9 not available, trying VP8...');
        try {
          recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8',
            videoBitsPerSecond: 800000
          });
          codecUsed = 'vp8';
        } catch (vp8Error) {
          console.log('⚠️ VP8 not available, using default...');
          recorder = new MediaRecorder(stream, {
            videoBitsPerSecond: 800000
          });
          codecUsed = 'default';
        }
      }
      
      console.log(`🎥 Resizing with codec: ${codecUsed}`);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(`📊 WebM resize chunk received: ${event.data.size} bytes`);
          chunks.push(event.data);
        }
      };
      
      // Start recording and play video
      recorder.start(1000); // Request data every 1000ms to ensure we get chunks
      await video.play();
      
      // Handle infinite duration videos from MediaRecorder by using fixed 3-second duration
      const videoDuration = isFinite(video.duration) ? video.duration : 3;
      const recordingDuration = Math.max(3000, videoDuration * 1000);
      
      console.log(`🎬 Recording for ${recordingDuration}ms (video duration: ${video.duration}s, isFinite: ${isFinite(video.duration)})`);
      
      const startTime = Date.now();
      const drawFrame = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < recordingDuration && !video.paused && !video.ended) {
          // Clear with full transparency
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set composite operation for proper transparency handling
          ctx.globalCompositeOperation = 'source-over';
          
          // Draw video frame scaled to target size
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
      
      // Stop recording after duration
      await new Promise(resolve => setTimeout(resolve, recordingDuration + 500)); // Longer buffer
      
      return new Promise<Blob>((resolve, reject) => {
        const stopRecording = () => {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          stream.getTracks().forEach(track => track.stop());
        };
        
        recorder.onstop = () => {
          if (chunks.length === 0) {
            console.error('❌ No data recorded - MediaRecorder produced empty chunks');
            reject(new Error('No data recorded during WebM resizing'));
            return;
          }
          
          const resizedWebmBlob = new Blob(chunks, { type: 'video/webm' });
          
          if (resizedWebmBlob.size === 0) {
            console.error('❌ Empty WebM blob created');
            reject(new Error('Empty WebM blob created during resizing'));
            return;
          }
          
          console.log('✅ WebM resizing completed:', { 
            originalSize: webmBlob.size,
            resizedSize: resizedWebmBlob.size,
            targetDimensions: `${targetSize}x${targetSize}`,
            codec: codecUsed,
            chunksCount: chunks.length,
            duration: recordingDuration
          });
          resolve(resizedWebmBlob);
        };
        
        recorder.onerror = (error) => {
          console.error('❌ WebM resizing failed:', error);
          stopRecording();
          reject(new Error('WebM resizing failed'));
        };
        
        // Stop recording after the determined duration
        setTimeout(() => {
          console.log('⏱️ Stopping WebM resize recording...');
          stopRecording();
        }, recordingDuration + 500);
      });
      
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private async convertAnimatedWebPToWebMViaServer(animatedWebPBlob: Blob, settings: ExportSettings): Promise<Blob> {
    console.log('📤 Sending animated WebP to server for WebM conversion...');
    
    // Convert blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to convert animated WebP to base64'));
      reader.readAsDataURL(animatedWebPBlob);
    });
    
    const payload = {
      webp_base64: base64,
      quality: 80, // Good quality for emojis
      fps: settings.fps
    };
    
    const response = await fetch('/.netlify/functions/convert-webp-to-webm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Server WebP to WebM conversion failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.webm_base64) {
      throw new Error(result.error || 'Server response missing WebM data');
    }
    
    console.log('✅ Server WebP to WebM conversion successful');
    
    // Convert base64 back to blob
    const webmBuffer = Uint8Array.from(atob(result.webm_base64), c => c.charCodeAt(0));
    return new Blob([webmBuffer], { type: 'video/webm' });
  }

  private async convertAnimatedWebPToWebMViaCanvas(animatedWebPBlob: Blob, settings: ExportSettings): Promise<Blob> {
    console.log('🎨 Converting animated WebP to WebM via Canvas...');
    
    // Create video element to load the animated WebP
    const video = document.createElement('video');
    const url = URL.createObjectURL(animatedWebPBlob);
    
    try {
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      
      // Wait for video to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error('Failed to load animated WebP as video'));
        video.load();
      });
      
      // Create canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = settings.size;
      canvas.height = settings.size;
      const ctx = canvas.getContext('2d', { alpha: true })!;
      
      // Setup MediaRecorder
      const stream = canvas.captureStream(settings.fps);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 1000000
      });
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      // Start recording and play video
      recorder.start();
      await video.play();
      
      // Record for the specified duration
      const recordingDuration = settings.duration * 1000; // Convert to ms
      
      const startTime = Date.now();
      const drawFrame = () => {
        if (Date.now() - startTime < recordingDuration) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
      
      // Stop recording after duration
      await new Promise(resolve => setTimeout(resolve, recordingDuration + 100));
      
      return new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const webmBlob = new Blob(chunks, { type: 'video/webm' });
          console.log('✅ Canvas WebM conversion completed:', { size: webmBlob.size });
          resolve(webmBlob);
        };
        
        recorder.onerror = () => reject(new Error('Canvas recording failed'));
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      });
      
    } finally {
      URL.revokeObjectURL(url);
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
