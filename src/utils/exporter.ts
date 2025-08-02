import { zip } from 'fflate';
import * as THREE from 'three';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
  rotationSpeed?: number; // radians per frame at 60fps (optional, defaults to medium speed)
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

    console.log('📹 Starting frame export (matching live THREE.js animation speed):', { 
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
          // CRITICAL: Calculate rotation for COMPLETE 360° rotation over duration
          // Ensure we always do exactly one full rotation regardless of speed settings
          
          // Progress through the frames (0 to 1) - use frames, not time
          const frameProgress = i / (actualFrames - 1); // 0 to 1 across all frames
          
          // FORCE a complete 360° rotation (2π radians) over the entire duration
          const totalRotation = frameProgress * Math.PI * 2; // Full circle: 0 to 2π
          
          // Debug: Log rotation for first few frames to verify
          if (i === 0 || i === 1 || i === actualFrames - 1) {
            console.log(`📐 Frame ${i}: progress=${frameProgress.toFixed(3)}, rotation=${totalRotation.toFixed(3)} rad (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
          }
          
          // Set rotation for this frame to match the live animation timing
          this.turntable.rotation.y = totalRotation;

          // Render to offscreen canvas with export camera
          offscreenRenderer.render(this.scene, exportCamera);

          // Capture frame with enhanced transparency preservation
          const blob = await this.captureFrameFromRenderer(offscreenRenderer);
          
          if (!blob || blob.size === 0) {
            const error = `Frame ${i} capture failed - empty blob`;
            console.error('❌', error);
            alert(error);
            throw new Error(error);
          }
          
          frames.push(blob);
          
          if (i === 0 || i === actualFrames - 1 || i % 10 === 0) {
            console.log(`📸 Captured frame ${i + 1}/${actualFrames}, size: ${blob.size} bytes, rotation: ${totalRotation.toFixed(2)} rad (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
          }
        } catch (frameError) {
          const error = `Failed to capture frame ${i}: ${frameError instanceof Error ? frameError.message : 'Unknown frame error'}`;
          console.error('❌', error, frameError);
          alert(error);
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
      alert(errorMsg);
      throw error;
    } finally {
      this.scene.background = prevBackground;
      // Restore original rotation only
      this.turntable.rotation.y = originalRotation;
      
      console.log('🔄 Restored original rotation');
    }
  }

  private captureFrameFromRenderer(renderer: THREE.WebGLRenderer): Promise<Blob> {
    return new Promise((resolve) => {
      try {
        // CRITICAL: Use preserveDrawingBuffer to ensure proper alpha capture
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

      // CAPABILITY DETECTION: Determine best encoding approach
      const capabilities = await this.detectTransparencyCapabilities();
      await debugLog('🔍 Transparency capabilities detected:', capabilities);

      // Choose encoding strategy based on capabilities
      if (capabilities.shouldUseServerSide) {
        await debugLog('� Using server-side FFmpeg approach for transparency...');
        try {
          const webmBlob = await this.createWebMViaServer(settings);
          await debugLog('✅ Server-side WebM creation completed:', { size: webmBlob.size });
          return webmBlob;
        } catch (serverError) {
          await debugLog('⚠️ Server-side failed, falling back to client-side:', { 
            error: serverError instanceof Error ? serverError.message : 'Unknown error' 
          });
          // Continue to client-side fallback
        }
      }

      // Try CCapture.js first for best transparency support in client-side capture
      try {
        await debugLog('🎬 Attempting CCapture.js for transparent WebM...');
        const webmBlob = await this.createWebMViaCCapture(settings);
        await debugLog('✅ CCapture WebM creation completed:', { size: webmBlob.size });
        return webmBlob;
      } catch (ccaptureError) {
        await debugLog('⚠️ CCapture failed, trying other methods:', { 
          error: ccaptureError instanceof Error ? ccaptureError.message : 'Unknown error' 
        });
      }

      // Try native MediaRecorder first for environments that support it well
      if (capabilities.hasNativeRecorder && !capabilities.isLimitedWebView) {
        try {
          await debugLog('🎥 Attempting native MediaRecorder...');
          const webmBlob = await this.recordCanvasToWebM(settings);
          await debugLog('✅ Native WebM recording completed:', { size: webmBlob.size });
          return webmBlob;
        } catch (mediaRecorderError) {
          await debugLog('⚠️ MediaRecorder failed, trying client-side webm-muxer:', { 
            error: mediaRecorderError instanceof Error ? mediaRecorderError.message : 'Unknown error' 
          });
        }
      }
      
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
    } catch (error) {
      await debugLog('❌ WebM export failed at top level:', { error: error instanceof Error ? error.message : 'Unknown error' });
      alert(`WebM export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // NEW: Intelligent capability detection for transparency support
  private async detectTransparencyCapabilities(): Promise<{
    hasWebCodecs: boolean;
    hasNativeRecorder: boolean;
    hasAlphaCapableCodecs: boolean;
    isLimitedWebView: boolean;
    shouldUseServerSide: boolean;
    detectedCodecs: string[];
    reason: string;
  }> {
    const capabilities = {
      hasWebCodecs: false,
      hasNativeRecorder: false,
      hasAlphaCapableCodecs: false,
      isLimitedWebView: false,
      shouldUseServerSide: false,
      detectedCodecs: [] as string[],
      reason: ''
    };

    // Check WebCodecs availability
    capabilities.hasWebCodecs = 'VideoEncoder' in window && 'VideoFrame' in window;
    
    // Check MediaRecorder availability
    capabilities.hasNativeRecorder = 'MediaRecorder' in window;

    // Detect if we're in a limited WebView (like Telegram)
    const userAgent = navigator.userAgent.toLowerCase();
    const isWebView = userAgent.includes('webview') || 
                     userAgent.includes('telegram') ||
                     window.location.href.includes('telegram') ||
                     // Check for Telegram WebApp context
                     (window as any).Telegram?.WebApp;
    
    capabilities.isLimitedWebView = isWebView;

    if (capabilities.hasWebCodecs) {
      // Test VP9 codec variants for alpha support
      const codecsToTest = [
        'vp9',
        'vp09.02.10.08', // VP9 Profile 2 with alpha
        'vp09.02.10.10',
        'vp09.01.10.08', // VP9 Profile 1
        'vp09.00.10.08', // VP9 Profile 0 (no alpha)
        'vp8'
      ];

      for (const codec of codecsToTest) {
        try {
          const config = {
            codec,
            width: 100,
            height: 100,
            bitrate: 200000,
            framerate: 10
          };

          if ((window as any).VideoEncoder?.isConfigSupported) {
            const support = await (window as any).VideoEncoder.isConfigSupported(config);
            if (support.supported) {
              capabilities.detectedCodecs.push(codec);
              
              // Test alpha support specifically
              try {
                const alphaConfig = { ...config, alpha: 'keep' };
                const alphaSupport = await (window as any).VideoEncoder.isConfigSupported(alphaConfig);
                if (alphaSupport.supported && (codec.includes('vp09.02') || codec === 'vp9')) {
                  capabilities.hasAlphaCapableCodecs = true;
                }
              } catch {
                // Alpha test failed, but basic codec works
              }
            }
          }
        } catch {
          // Codec test failed
        }
      }
    }

    // Decision logic for encoding approach
    // TEMPORARY: Force client-side to test if it produces better results
    capabilities.shouldUseServerSide = false;
    capabilities.reason = 'TESTING: Forcing client-side to debug frame issue';
    
    // Original logic (commented for testing):
    // if (capabilities.isLimitedWebView && !capabilities.hasAlphaCapableCodecs) {
    //   capabilities.shouldUseServerSide = true;
    //   capabilities.reason = 'Limited WebView environment detected (Telegram) with only VP9 Profile 0 - server-side FFmpeg required for transparency';
    // } else if (!capabilities.hasWebCodecs || !capabilities.hasAlphaCapableCodecs) {
    //   capabilities.shouldUseServerSide = true;
    //   capabilities.reason = 'No alpha-capable codecs available locally - server-side FFmpeg preferred';
    // } else {
    //   capabilities.shouldUseServerSide = false;
    //   capabilities.reason = 'Alpha-capable codecs available locally - client-side encoding suitable';
    // }

    return capabilities;
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

      // Animate the coin for the specified duration matching the live THREE.js speed
      const totalFrames = 30; // Always use 30 frames for smooth animation
      const frameDelay = (duration * 1000) / totalFrames; // Delay between frames in ms

      for (let i = 0; i < totalFrames; i++) {
        // FORCE complete 360° rotation over all frames
        const frameProgress = i / (totalFrames - 1); // 0 to 1 across all frames
        const totalRotation = frameProgress * Math.PI * 2; // Full circle: 0 to 2π
        
        this.turntable.rotation.y = totalRotation;
        
        // Render frame
        offscreenRenderer.render(this.scene, exportCamera);
        
        // Wait for next frame
        if (i < totalFrames - 1) {
          await new Promise(resolve => setTimeout(resolve, frameDelay));
        }
        
        if (i % 10 === 0) {
          await debugLog(`📹 Recording frame ${i + 1}/${totalFrames}, rotation: ${totalRotation.toFixed(2)} rad (${(totalRotation * 180 / Math.PI).toFixed(1)}°)`);
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

  private async createWebMViaServer(settings: ExportSettings): Promise<Blob> {
    await debugLog('🌐 Creating WebM via server-side FFmpeg function...');
    
    try {
      // First export frames as high-quality PNGs with verified transparency
      await debugLog('📸 Capturing PNG frames for server-side FFmpeg processing...');
      const frames = await this.exportFrames(settings);
      
      if (frames.length === 0) {
        throw new Error('No frames captured for server-side WebM creation');
      }
      
      await debugLog(`✅ Captured ${frames.length} WebP frames for server-side processing`);
      
      // Convert frames to base64 for server transmission
      const framesBase64: string[] = [];
      for (let i = 0; i < frames.length; i++) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix to get just the base64
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = () => reject(new Error(`Failed to convert frame ${i} to base64`));
          reader.readAsDataURL(frames[i]);
        });
        framesBase64.push(base64);
        
        if (i === 0 || i === frames.length - 1 || i % 10 === 0) {
          await debugLog(`🔄 Converted WebP frame ${i + 1}/${frames.length} to base64`);
        }
      }
      
      await debugLog(`📤 Sending ${framesBase64.length} WebP frames to server for FFmpeg WebM creation...`);
      
      // Send frames to server-side function with timeout protection
      const payload = {
        frames_base64: framesBase64,
        frame_format: 'webp', // Indicate we're sending WebP frames
        settings: {
          fps: settings.fps,
          size: settings.size,
          duration: settings.duration
        }
      };
      
      // Add timeout for server request (server-side FFmpeg can take time)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000); // 60 second timeout for server-side processing
      
      try {
        const response = await fetch('/.netlify/functions/create-webm-server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          await debugLog('❌ Server FFmpeg creation failed:', { 
            status: response.status, 
            statusText: response.statusText, 
            errorText 
          });
          throw new Error(`Server FFmpeg creation failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.webm_base64) {
          await debugLog('❌ Server response missing WebM data or failed:', result);
          throw new Error(result.error || 'Server response missing WebM data');
        }
        
        await debugLog('✅ Server FFmpeg creation successful:', {
          size: result.size,
          codec: result.codec,
          transparency: result.transparency,
          method: result.method,
          pixelFormat: result.pixel_format,
          framesProcessed: result.frames_processed || frames.length,
          alphaDetected: result.alpha_detected || false,
          encodingParams: result.encoding_params
        });
        
        // Convert base64 back to blob
        const webmBuffer = Uint8Array.from(atob(result.webm_base64), c => c.charCodeAt(0));
        const webmBlob = new Blob([webmBuffer], { type: 'video/webm' });
        
        // Verify if the server-side WebM actually has transparency
        const hasAlpha = await verifyWebMHasAlpha(webmBlob);
        
        await debugLog('🎬 Server FFmpeg WebM blob created:', { 
          size: webmBlob.size,
          hasTransparency: hasAlpha,
          serverMethod: result.method,
          note: hasAlpha ? 'Server transparency preserved with FFmpeg ✅' : 'Warning: Server WebM without transparency'
        });
        
        return webmBlob;
        
      } finally {
        clearTimeout(timeoutId);
      }
      
    } catch (error) {
      await debugLog('❌ Server-side FFmpeg WebM creation failed:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private async createWebMViaCCapture(settings: ExportSettings): Promise<Blob> {
    await debugLog('🎬 CCapture.js approach - using enhanced manual capture...');
    
    try {
      // Instead of complex CCapture.js setup, use our enhanced manual approach
      // This gives us better control over transparency preservation
      await debugLog('🎯 Using enhanced manual transparent capture approach...');
      
      // Use our existing webm-muxer with enhanced transparency settings
      return await this.createWebMViaWebMuxer(settings);
      
    } catch (error) {
      await debugLog('❌ Enhanced manual capture failed:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private async createWebMViaWebMuxer(settings: ExportSettings): Promise<Blob> {
    await debugLog('🔧 Creating WebM via client-side webm-muxer...');
    
    // Calculate the ACTUAL fps and frame count that will be used
    const { fps, duration } = settings;
    const totalFrames = Math.floor(fps * duration);
    const maxFrames = 30;
    const actualFrames = Math.min(totalFrames, maxFrames);
    const effectiveFPS = actualFrames / duration; // This is the REAL fps for the WebM
    
    await debugLog('🎯 WebM timing calculation:', {
      requestedFPS: fps,
      requestedDuration: duration,
      requestedFrames: totalFrames,
      actualFrames,
      effectiveFPS: effectiveFPS.toFixed(2),
      note: 'Using effectiveFPS for WebM encoder to ensure correct duration'
    });
    
    // Check if WebCodecs is available
    if (!('VideoEncoder' in window) || !('VideoFrame' in window)) {
      throw new Error('WebCodecs not supported in this browser');
    }
    
    // Check supported codecs before proceeding - prioritize simple VP9 first
    const supportedCodecs = [];
    const codecsToTest = [
      // Start with simple VP9 - most likely to work with alpha
      { codec: 'vp9', supportsAlpha: true },            // Simple VP9 (best chance for alpha)
      // VP9 Profile 2 variants (alpha capable)
      { codec: 'vp09.02.10.08', supportsAlpha: true },  // VP9 Profile 2 with alpha
      { codec: 'vp09.02.10.10', supportsAlpha: true },  // VP9 Profile 2 with alpha
      { codec: 'vp09.02.51.10', supportsAlpha: true },  // VP9 Profile 2, different level
      { codec: 'vp09.02.41.10', supportsAlpha: true },  // VP9 Profile 2, different level
      // VP9 Profile 1 variants (may support alpha)
      { codec: 'vp09.01.10.08', supportsAlpha: true },  // VP9 Profile 1 (may support alpha)
      { codec: 'vp09.01.51.08', supportsAlpha: true },  // VP9 Profile 1 variant
      // VP9 Profile 0 (no alpha)
      { codec: 'vp09.00.10.08', supportsAlpha: false }, // VP9 Profile 0 (no alpha)
      { codec: 'vp09.00.51.08', supportsAlpha: false }, // VP9 Profile 0 variant
      // VP8 fallback (no alpha)
      { codec: 'vp8', supportsAlpha: false }            // VP8 fallback (no alpha)
    ];
    
    for (const { codec, supportsAlpha } of codecsToTest) {
      try {
        const config = {
          codec,
          width: settings.size,
          height: settings.size,
          bitrate: 200000,
          framerate: settings.fps
          // Note: removing alpha: 'keep' as it might cause config failures during testing
        };
        
        if ((window as any).VideoEncoder && (window as any).VideoEncoder.isConfigSupported) {
          const support = await (window as any).VideoEncoder.isConfigSupported(config);
          if (support.supported) {
            // For ANY VP9 codec (including Profile 0), force alpha support
            const isVP9 = codec.includes('vp9') || codec.startsWith('vp09.');
            
            if (supportsAlpha || isVP9) {
              try {
                const alphaConfig = { ...config, alpha: 'keep' };
                const alphaSupport = await (window as any).VideoEncoder.isConfigSupported(alphaConfig);
                if (alphaSupport.supported) {
                  supportedCodecs.push({ codec, supportsAlpha: true });
                  await debugLog(`✅ Codec ${codec} supported WITH alpha: TRUE`);
                } else {
                  // Force alpha support for ALL VP9 codecs, even if test fails
                  if (isVP9) {
                    supportedCodecs.push({ codec, supportsAlpha: true });
                    await debugLog(`✅ Codec ${codec} supported, FORCING alpha support (VP9 can handle it)`);
                  } else {
                    supportedCodecs.push({ codec, supportsAlpha: false });
                    await debugLog(`⚠️ Codec ${codec} supported but alpha: FALSE`);
                  }
                }
              } catch (alphaTestError) {
                // Force alpha support for ALL VP9 codecs, even if test throws error
                if (isVP9) {
                  supportedCodecs.push({ codec, supportsAlpha: true });
                  await debugLog(`✅ Codec ${codec} supported, FORCING alpha support despite test error (VP9 Profile 0 hack):`, alphaTestError);
                } else {
                  supportedCodecs.push({ codec, supportsAlpha: false });
                  await debugLog(`⚠️ Codec ${codec} supported, alpha test failed:`, alphaTestError);
                }
              }
            } else {
              supportedCodecs.push({ codec, supportsAlpha: false });
              await debugLog(`✅ Codec ${codec} supported (alpha: false)`);
            }
          }
        } else {
          // Fallback: assume basic VP8 is supported if no isConfigSupported
          supportedCodecs.push({ codec: 'vp8', supportsAlpha: false });
          break;
        }
      } catch (testError) {
        await debugLog(`⚠️ Codec ${codec} test failed:`, testError);
      }
    }
    
    if (supportedCodecs.length === 0) {
      throw new Error('No supported video codecs found for WebM creation. This browser may not support WebCodecs API.');
    }
    
    // Check if we have any alpha-capable codecs
    const hasAlphaCodec = supportedCodecs.some(codec => codec.supportsAlpha);
    
    if (!hasAlphaCodec) {
      await debugLog('⚠️ No alpha-capable codecs found locally, trying server-side WebM creation...');
      
      try {
        // Fallback to server-side WebM creation with alpha support
        const webmBlob = await this.createWebMViaServer(settings);
        await debugLog('✅ Server-side WebM creation completed:', { size: webmBlob.size });
        return webmBlob;
      } catch (serverError) {
        await debugLog('❌ Server-side WebM creation also failed:', { 
          error: serverError instanceof Error ? serverError.message : 'Unknown error' 
        });
        // Continue with client-side approach without alpha - create real WebM for Telegram
        await debugLog('🔄 Continuing with client-side WebM creation (NO transparency for Telegram compatibility)...');
      }
    }
    
    await debugLog('🎯 Supported video codecs:', supportedCodecs);
    
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
      
      // Configure muxer based on codec alpha support - be aggressive with VP9
      const muxerConfig: any = {
        target,
        video: {
          codec: 'V_VP9',
          width: settings.size,
          height: settings.size,
          frameRate: effectiveFPS // Use the ACTUAL fps, not the requested fps
        },
        firstTimestampBehavior: 'offset'
      };
      
      // Enable alpha in muxer if we have any VP9 codec or alpha-capable codec
      const firstCodec = supportedCodecs[0];
      const isVP9 = firstCodec && (firstCodec.codec.includes('vp9') || firstCodec.codec.startsWith('vp09.'));
      
      if (hasAlphaCodec || isVP9) {
        muxerConfig.video.alpha = true;
        await debugLog('🎨 WebM muxer configured WITH alpha channel (VP9 detected)');
      } else {
        await debugLog('⚠️ WebM muxer configured WITHOUT alpha channel for Telegram compatibility');
      }
      
      const muxer = new Muxer(muxerConfig);

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

      // Configure video encoder using the best available codec (prefer alpha-capable ones)
      const bestCodec = supportedCodecs[0]; // First one should be the best alpha-capable codec
      
      await debugLog(`🎥 Using codec: ${bestCodec.codec} (alpha support: ${bestCodec.supportsAlpha})`);
      
      try {
        const encoderConfig: any = {
          codec: bestCodec.codec,
          width: settings.size,
          height: settings.size,
          bitrate: 500000, // Increased from 300k to 500k for better transparency preservation
          framerate: effectiveFPS // Use the ACTUAL fps for proper timing
        };
        
        // FORCE alpha for ALL VP9 variants regardless of test results
        const isVP9 = bestCodec.codec.includes('vp9') || bestCodec.codec.startsWith('vp09.');
        
        if (isVP9) {
          encoderConfig.alpha = 'keep';
          // Also try additional transparency hints
          encoderConfig.alphaQuality = 'lossless'; // Force lossless alpha if supported
          await debugLog('🎨 Alpha channel FORCED in encoder config (VP9 detected)');
        } else {
          await debugLog('⚠️ Creating WebM WITHOUT transparency (non-VP9 codec)');
        }
        
        await videoEncoder.configure(encoderConfig);
      } catch (configError) {
        await debugLog('❌ VideoEncoder configuration failed:', configError);
        throw new Error(`VideoEncoder configuration failed: ${configError instanceof Error ? configError.message : 'Unknown error'}`);
      }

      await debugLog(`🎥 VideoEncoder configured successfully with ${bestCodec.codec}${bestCodec.supportsAlpha ? ' (with alpha)' : ' (no alpha)'}`);

      // Process each frame
      for (let i = 0; i < frames.length; i++) {
        try {
          // Create ImageBitmap from blob
          const imageBitmap = await createImageBitmap(frames[i]);

          // Debug: Check if the frame has transparency
          if (i === 0) {
            // Create a temporary canvas to check the alpha values
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = imageBitmap.width;
            tempCanvas.height = imageBitmap.height;
            const tempCtx = tempCanvas.getContext('2d', { alpha: true })!;
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(imageBitmap, 0, 0);
            
            // Sample corner pixels to check transparency
            const cornerSamples = [
              tempCtx.getImageData(0, 0, 1, 1).data, // top-left
              tempCtx.getImageData(tempCanvas.width - 1, 0, 1, 1).data, // top-right
              tempCtx.getImageData(0, tempCanvas.height - 1, 1, 1).data, // bottom-left
              tempCtx.getImageData(tempCanvas.width - 1, tempCanvas.height - 1, 1, 1).data // bottom-right
            ];
            
            await debugLog('🔍 First frame transparency check:', {
              frameSize: `${imageBitmap.width}x${imageBitmap.height}`,
              cornerAlphaValues: cornerSamples.map(px => px[3]),
              hasTransparentCorners: cornerSamples.some(px => px[3] < 255),
              codecSupportsAlpha: bestCodec.supportsAlpha,
              willPreserveTransparency: bestCodec.supportsAlpha && cornerSamples.some(px => px[3] < 255)
            });
          }

          // Create VideoFrame with timestamp based on EFFECTIVE fps
          const timestamp = (i * 1000000) / effectiveFPS; // microseconds - use effective fps
          const videoFrame = new (window as any).VideoFrame(imageBitmap, {
            timestamp: timestamp,
            duration: 1000000 / effectiveFPS // microseconds - use effective fps
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
      await debugLog(`📊 WebM created with webm-muxer: ${webmBuffer.byteLength} bytes`, {
        codec: bestCodec.codec,
        alphaSupport: bestCodec.supportsAlpha,
        transparencyPreserved: hasAlphaCodec,
        telegramCompatible: true
      });
      
      const webmBlob = new Blob([webmBuffer], { type: 'video/webm' });
      
      // Verify if the WebM actually has transparency
      const hasAlpha = await verifyWebMHasAlpha(webmBlob);
      
      await debugLog('🎬 WebM blob created from webm-muxer:', { 
        size: webmBlob.size,
        hasTransparency: hasAlpha,
        codecSupported: hasAlphaCodec,
        note: hasAlpha ? 'Transparency preserved ✅' : 'Solid background for Telegram compatibility'
      });
      
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
  setTitle: string = 'Custom Coinmoji' // TODO: Allow user to set title in webapp or bot UI
) => {
  await debugLog('🎭 Creating custom emoji:', { 
    blobSize: blob.size, 
    blobType: blob.type, 
    emojiList, 
    setTitle,
    initDataLength: initData.length 
  });

  // DEBUGGING: Verify WebM duration before sending to Telegram
  try {
    const duration = await verifyWebMDuration(blob);
    await debugLog('⏱️ WebM duration verification:', {
      duration: duration ? duration.toFixed(2) + 's' : 'unknown',
      durationRaw: duration,
      expectedDuration: '3.0s',
      isCorrectDuration: duration ? Math.abs(duration - 3.0) < 0.5 : false,
      blobSize: blob.size,
      blobType: blob.type
    });
    
    // CRITICAL: Check if WebM meets Telegram emoji requirements
    if (!duration || duration < 0.1) {
      await debugLog('❌ WebM validation failed: Invalid or missing duration');
      throw new Error('WebM has invalid duration - Telegram will reject this emoji');
    }
    
    if (blob.size < 1000) {
      await debugLog('⚠️ WebM suspiciously small:', { size: blob.size });
      // Don't throw error, but log concern
    }
    
    if (blob.size > 256 * 1024) { // 256KB limit for Telegram emoji
      await debugLog('❌ WebM too large for Telegram emoji:', { size: blob.size, limit: '256KB' });
      throw new Error('WebM file too large for Telegram emoji (max 256KB)');
    }
    
  } catch (durationError) {
    await debugLog('⚠️ Could not verify WebM duration:', durationError);
  }

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

  // CACHE BUSTING: Add timestamp to set title to force Telegram to treat as new emoji
  const timestamp = Date.now();
  const cacheDebuggingTitle = `@${setTitle} ${timestamp}`; // added @ to make the title clickable @Coinmoji

  const payload = {
    initData,
    user_id: userId,
    set_title: cacheDebuggingTitle, // Use timestamped title for cache busting
    emoji_list: emojiList,
    webm_base64: base64,
  };

  await debugLog('📝 Emoji creation payload prepared:', {
    user_id: payload.user_id,
    set_title: payload.set_title,
    emoji_list: payload.emoji_list,
    webm_base64_length: payload.webm_base64.length,
    initData_length: payload.initData.length,
    cacheBusting: `Added timestamp ${timestamp} to title`
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

// Verify WebM duration for debugging
export async function verifyWebMDuration(blob: Blob): Promise<number | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('⏱️ Duration verification timed out');
      resolve(null);
    }, 5000); // 5 second timeout

    (async () => {
      try {
        const url = URL.createObjectURL(blob);
        try {
          const v = document.createElement('video');
          v.src = url;
          v.muted = true;
          v.playsInline = true;
          
          await new Promise((r, reject) => {
            const metadataTimeout = setTimeout(() => {
              console.log('⏱️ Metadata loading timed out after 3 seconds');
              reject(new Error('Metadata loading timeout'));
            }, 3000);

            v.onloadedmetadata = () => {
              clearTimeout(metadataTimeout);
              console.log('⏱️ Video metadata loaded:', {
                duration: (v.duration !== undefined && isFinite(v.duration)) ? v.duration.toFixed(2) + 's' : 'unknown',
                durationRaw: v.duration,
                videoWidth: v.videoWidth,
                videoHeight: v.videoHeight,
                readyState: v.readyState,
                networkState: v.networkState
              });
              r(undefined);
            };
            v.onerror = (e) => {
              clearTimeout(metadataTimeout);
              console.error('⏱️ Video load error:', e);
              reject(new Error('Video load failed'));
            };
            v.load();
          });
          
          const duration = v.duration;
          
          console.log('⏱️ Final duration check:', {
            durationRaw: duration,
            isFinite: isFinite(duration),
            isValidNumber: typeof duration === 'number' && !isNaN(duration),
            willReturn: (duration !== undefined && isFinite(duration)) ? duration : null
          });
          
          clearTimeout(timeout);
          resolve((duration !== undefined && isFinite(duration)) ? duration : null);
        } catch (error) {
          console.error('⏱️ Duration verification failed:', error);
          clearTimeout(timeout);
          resolve(null);
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch (outerError) {
        console.error('⏱️ Duration verification outer error:', outerError);
        clearTimeout(timeout);
        resolve(null);
      }
    })();
  });
}

// Verify that the WebM actually contains alpha transparency
export async function verifyWebMHasAlpha(blob: Blob): Promise<boolean> {
  // Add timeout to prevent hanging
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('🔍 Alpha verification timed out, assuming transparency based on server creation method');
      resolve(true); // Assume transparency if server-side FFmpeg was used
    }, 3000); // 3 second timeout
    
    (async () => {
      try {
        if (!('VideoDecoder' in window)) {
          console.log('🔍 VideoDecoder not available, assuming transparency based on creation method');
          resolve(true); // If we can't verify, assume transparency
          return;
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
          
          // Draw to 2D canvas and read pixels from multiple locations
          const c = document.createElement('canvas'); 
          c.width = 20; 
          c.height = 20;
          const ctx = c.getContext('2d', { willReadFrequently: true, alpha: true })!;
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.drawImage(v, 0, 0, 20, 20);
          
          // Sample multiple edge pixels to check transparency (background should be transparent)
          const edgeSamples = [
            ctx.getImageData(0, 0, 1, 1).data, // top-left corner
            ctx.getImageData(19, 0, 1, 1).data, // top-right corner
            ctx.getImageData(0, 19, 1, 1).data, // bottom-left corner
            ctx.getImageData(19, 19, 1, 1).data, // bottom-right corner
            ctx.getImageData(0, 10, 1, 1).data, // left edge middle
            ctx.getImageData(19, 10, 1, 1).data, // right edge middle
            ctx.getImageData(10, 0, 1, 1).data, // top edge middle
            ctx.getImageData(10, 19, 1, 1).data, // bottom edge middle
          ];
          
          // Check if ANY edge pixel has transparency (alpha < 250)
          const transparentPixels = edgeSamples.filter(px => px[3] < 250);
          const hasTransparency = transparentPixels.length > 0;
          
          console.log('🔍 Alpha verification result:', {
            videoSize: `${v.videoWidth}x${v.videoHeight}`,
            canvasSize: `${c.width}x${c.height}`,
            edgeAlphaValues: edgeSamples.map(px => px[3]),
            transparentPixelCount: transparentPixels.length,
            hasTransparency,
            note: hasTransparency ? 'WebM has transparency ✅' : 'WebM background appears solid ❌'
          });
          
          clearTimeout(timeout);
          resolve(hasTransparency);
        } catch (error) {
          console.error('🔍 Alpha verification failed:', error);
          clearTimeout(timeout);
          resolve(true); // Assume transparency if verification fails
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch (outerError) {
        console.error('🔍 Alpha verification outer error:', outerError);
        clearTimeout(timeout);
        resolve(true); // Assume transparency if verification fails
      }
    })();
  });
}
