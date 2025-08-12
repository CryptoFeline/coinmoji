import * as THREE from 'three';
import { zip, zipSync } from 'fflate';

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
  private currentSettings: any; // Store current coin settings

  constructor(
    scene: THREE.Scene,
    _camera: THREE.PerspectiveCamera, // Keep for API compatibility but don't use
    _renderer: THREE.WebGLRenderer, // Keep for API compatibility but don't use
    turntable: THREE.Group,
    settings?: any // Accept current settings
  ) {
    this.scene = scene;
    this.turntable = turntable;
    this.currentSettings = settings;
  }

  // Update settings when they change
  updateSettings(settings: any) {
    this.currentSettings = settings;
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
    
    // 🔬 EXPERIMENT: Render directly at final resolution to eliminate downscaling artifacts
    // The graininess is NOT from VP9 (CRF=5 test proved this) but from canvas downscaling destroying metallic details
    const captureResolution = {
      high: 100,     // DIRECT rendering at emoji size - no downscaling
      balanced: 100, // DIRECT rendering at emoji size - no downscaling  
      compact: 100   // DIRECT rendering at emoji size - no downscaling
    };
    
    const captureSize = captureResolution[qualityMode];
    
    console.log(`🎯 DIRECT RENDERING EXPERIMENT: ${captureSize}px (no downscaling to preserve metallic surfaces)`);
    
    const frames: Blob[] = [];

    console.log('📹 Starting OPTIMIZED frame export:', { 
      fps, 
      duration, 
      size, 
      actualFrames,
      captureSize,
      targetFileSize: `${(targetFileSize / 1024).toFixed(1)}KB`,
      qualityMode,
      estimatedFrameSize: `${(targetFileSize / actualFrames / 1024).toFixed(1)}KB per frame`
    });

    // 🔧 CRITICAL: Wait for animated textures to be ready before starting frame export
    console.log('⏳ Checking texture readiness before frame export...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Give textures time to initialize
    
    console.log('🎬 All textures should be ready, starting frame capture...');

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

      // 🔬 EXPERIMENTAL: Auto-download frames as ZIP for quality inspection
      console.log('📦 Creating ZIP of captured frames for quality analysis...');
      await this.downloadFramesAsZip(frames);
      
      return frames;
    } catch (error) {
      console.error('❌ DETAILED EXPORT ERROR:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        currentSettings: this.currentSettings,
        sceneObjectsCount: this.scene.children.length,
        turntableRotation: this.turntable.rotation.y
      });
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
        
        // 🔬 DIRECT CAPTURE: Already rendering at 100px, no downscaling needed!
        console.log(`📸 DIRECT CAPTURE: ${canvas.width}x${canvas.height} (no downscaling artifacts)`);
        
        // Convert directly to WebP with maximum quality - no canvas copying needed
        const webpQuality = 0.99; // Maximum quality for testing
        
        canvas.toBlob((blob) => {
          if (!blob) {
            // If WebP fails, try PNG as fallback which definitely supports alpha
            console.log('⚠️ WebP capture failed, trying PNG with alpha...');
            canvas.toBlob((pngBlob) => {
              if (!pngBlob) {
                resolve(new Blob());
                return;
              }
              console.log('✅ PNG alpha capture successful:', { size: pngBlob.size });
              resolve(pngBlob);
            }, 'image/png');
            return;
          }

          console.log(`✅ Direct WebP capture: ${blob.size} bytes, quality: ${webpQuality}`);
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

  // 🔬 EXPERIMENTAL: Download frames as ZIP for quality inspection
  private async downloadFramesAsZip(frames: Blob[]): Promise<void> {
    try {
      const files: Record<string, Uint8Array> = {};
      
      for (let i = 0; i < frames.length; i++) {
        const frameNumber = String(i).padStart(4, '0');
        const frameBuffer = await frames[i].arrayBuffer();
        const uint8Array = new Uint8Array(frameBuffer);
        
        // Detect format and set appropriate extension
        let extension = 'webp'; // Default to WebP
        if (uint8Array.length >= 8 && 
            uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && 
            uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
          extension = 'png';
        }
        
        files[`frame_${frameNumber}.${extension}`] = uint8Array;
      }

      // Create ZIP using fflate
      const zipped = zipSync(files, { level: 6 });
      const zipBlob = new Blob([zipped], { type: 'application/zip' });
      
      // Auto-download the ZIP
      this.downloadBlob(zipBlob, `frames_direct_render_${Date.now()}.zip`);
      
      console.log(`📦 Frames ZIP downloaded: ${frames.length} frames, ${(zipBlob.size/1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('❌ Frame ZIP creation failed:', error);
    }
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
    console.log('🎬 Creating WebM via server-side Three.js rendering for perfect quality...');
    
    try {
      // NEW APPROACH: Server-side Three.js rendering for perfect quality
      console.log('🚀 Using server-side Three.js rendering (headless Chrome)...');
      
      // Get current coin settings from the scene
      const coinSettings = this.extractCoinSettings();
      
      // 🚀 NEW: Choose streaming method based on file uploads
      const hasUploadedFiles = (coinSettings.bodyTextureMode === 'upload' && coinSettings.bodyTextureFile) ||
                              (coinSettings.overlayMode === 'upload' && coinSettings.overlayFile) ||
                              (coinSettings.overlayMode2 === 'upload' && coinSettings.overlayFile2);
      
      let serverFrames: string[];
      if (hasUploadedFiles) {
        console.log('📡 Using binary streaming for uploaded files (eliminates base64 overhead)');
        serverFrames = await this.renderFramesOnServerWithStreaming(coinSettings, settings);
      } else {
        console.log('📡 Using JSON method for URL-based assets (no files to stream)');  
        serverFrames = await this.renderFramesOnServer(coinSettings, settings);
      }
      
      if (serverFrames.length === 0) {
        throw new Error('No frames rendered on server');
      }
      
      console.log(`✅ Got ${serverFrames.length} perfect quality frames from server`);
      
      // Convert base64 frames back to blobs
      console.log('🔄 Converting server frames to blobs for WebM creation...');
      const frameBlobs: Blob[] = [];
      for (let i = 0; i < serverFrames.length; i++) {
        const binaryString = atob(serverFrames[i]);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        frameBlobs.push(new Blob([bytes], { type: 'image/webp' }));
      }
      
      console.log('🔄 Converted server frames to blobs for WebM creation');
      
      // Create WebM using existing serverless pipeline
      console.log('📦 Creating WebM via serverless pipeline...');
      const webmBlob = await this.createWebMViaServerless(frameBlobs, settings);
      
      console.log('✅ Perfect quality WebM created via server-side rendering:', { size: webmBlob.size });
      
      // Optional download for explicit user request
      if (autoDownload) {
        this.downloadBlob(webmBlob, 'coinmoji-perfect-quality.webm');
        console.log('📦 Downloaded perfect quality WebM');
      }
      
      return webmBlob;
      
    } catch (error) {
      console.error('❌ Server-side rendering failed:', error);
      
      // CLIENT-SIDE FALLBACK DISABLED - Force server-only processing for testing
      // NOTE: Original client-side fallback method is preserved but disconnected
      // To re-enable fallback, uncomment the line below:
      // return this.exportAsWebMClientSide(settings, autoDownload);
      
      throw new Error(`Server-side rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}. Client-side fallback is temporarily disabled for server testing.`);
    }
  }

  // Extract current coin settings for server recreation
  private extractCoinSettings() {
    // Use stored settings if available, otherwise return defaults
    if (this.currentSettings) {
      console.log('📋 Using stored coin settings for server recreation');
      console.log('🔍 Current settings for server:', {
        bodyTextureMode: this.currentSettings.bodyTextureMode,
        bodyTextureMapping: this.currentSettings.bodyTextureMapping,
        overlayMode: this.currentSettings.overlayMode,
        overlayMode2: this.currentSettings.overlayMode2,
        overlayGifSpeed: this.currentSettings.overlayGifSpeed,
        gifAnimationSpeed: this.currentSettings.gifAnimationSpeed,
        hasBodyTextureFile: !!this.currentSettings.bodyTextureFile,
        hasOverlayFile: !!this.currentSettings.overlayFile,
        hasOverlayFile2: !!this.currentSettings.overlayFile2,
        // CRITICAL: Add glow settings debug
        bodyGlow: this.currentSettings.bodyGlow,
        bodyGlowIntensity: this.currentSettings.bodyGlowIntensity,
        bodyGlowSharpness: this.currentSettings.bodyGlowSharpness,
        overlayGlow: this.currentSettings.overlayGlow,
        overlayGlowIntensity: this.currentSettings.overlayGlowIntensity,
        overlayGlowSharpness: this.currentSettings.overlayGlowSharpness
      });
      return this.currentSettings;
    }
    
    console.log('⚠️ No stored settings, using defaults for server recreation');
    return {
      // Basic coin settings
      fillMode: 'solid' as const,
      bodyColor: '#cecece',
      gradientStart: '#00eaff',
      gradientEnd: '#ee00ff',
      metallic: true,
      rotationSpeed: 'medium' as const,
      lightColor: '#ffffff',
      lightStrength: 'medium' as const,
      
      // Texture settings - CRITICAL: Include all texture configuration
      bodyTextureUrl: '',
      bodyTextureMode: 'url' as const,
      bodyTextureMapping: 'cylindrical' as const, // FIX: Add missing texture mapping
      
      // Overlay settings - CRITICAL: Include all overlay configuration  
      overlayUrl: '',
      overlayMode: 'url' as const,
      dualOverlay: false,
      overlayUrl2: '',
      overlayMode2: 'url' as const,
      
      // Animation settings - CRITICAL: Include GIF animation controls
      gifAnimationSpeed: 'medium' as const, // Legacy setting name
      overlayGifSpeed: 'normal' as const,   // New setting name  
      bodyGifSpeed: 'normal' as const,      // Body texture GIF speed
      
      // Glow settings - CRITICAL: Include all glow parameters for server
      bodyGlow: false,
      bodyGlowIntensity: 5.0,
      bodyGlowSharpness: 0.6,
      overlayGlow: false,
      overlayGlowIntensity: 5.0,
      overlayGlowSharpness: 0.6
    };
  }

  // 🚀 NEW: Stream binary files directly to server (no base64 overhead)
  private async renderFramesOnServerWithStreaming(coinSettings: any, exportSettings: ExportSettings): Promise<string[]> {
    console.log('🎬 Server-side rendering with direct binary streaming...');
    
    // Declare variables in function scope so they're accessible in catch block
    let fileIndex = 0;
    let totalUploadSize = 0;
    
    try {
      // Create FormData for multipart streaming with error handling
      console.log('📦 Creating FormData for multipart upload...');
      const formData = new FormData();
      
      // Add settings as JSON (small, no base64 needed)
      const serverSettings = { ...coinSettings };
      
      // Handle uploaded files: add them as binary blobs, not base64
      // Variables already declared in function scope above
      
      if (coinSettings.bodyTextureMode === 'upload' && coinSettings.bodyTextureFile) {
        console.log(`📎 Adding body texture file: ${coinSettings.bodyTextureFile.name} (${coinSettings.bodyTextureFile.size} bytes)`);
        formData.append(`file_${fileIndex}`, coinSettings.bodyTextureFile);
        serverSettings.bodyTextureFileIndex = fileIndex;
        delete serverSettings.bodyTextureBase64; // Remove base64 data
        totalUploadSize += coinSettings.bodyTextureFile.size;
        fileIndex++;
        console.log('✅ Body texture file added to FormData successfully');
      }
      
      if (coinSettings.overlayMode === 'upload' && coinSettings.overlayFile) {
        console.log(`📎 Adding overlay file: ${coinSettings.overlayFile.name} (${coinSettings.overlayFile.size} bytes)`);
        formData.append(`file_${fileIndex}`, coinSettings.overlayFile);
        serverSettings.overlayFileIndex = fileIndex;
        delete serverSettings.overlayBase64; // Remove base64 data
        totalUploadSize += coinSettings.overlayFile.size;
        fileIndex++;
        console.log('✅ Overlay file added to FormData successfully');
      }
      
      if (coinSettings.overlayMode2 === 'upload' && coinSettings.overlayFile2) {
        console.log(`📎 Adding overlay2 file: ${coinSettings.overlayFile2.name} (${coinSettings.overlayFile2.size} bytes)`);
        formData.append(`file_${fileIndex}`, coinSettings.overlayFile2);
        serverSettings.overlayFileIndex2 = fileIndex;
        delete serverSettings.overlayBase64_2; // Remove base64 data
        totalUploadSize += coinSettings.overlayFile2.size;
        fileIndex++;
        console.log('✅ Overlay2 file added to FormData successfully');
      }
      
      // Add settings and export settings as JSON fields
      const settingsJson = JSON.stringify(serverSettings);
      const exportSettingsJson = JSON.stringify({
        fps: exportSettings.fps,
        duration: exportSettings.duration,
        frames: Math.round(exportSettings.fps * exportSettings.duration),
        qualityMode: exportSettings.qualityMode || 'balanced'
      });
      
      formData.append('settings', settingsJson);
      formData.append('exportSettings', exportSettingsJson);
      
      console.log(`🚀 FormData prepared: ${fileIndex} files, ${(totalUploadSize/1024/1024).toFixed(1)}MB total`);
      console.log('📋 Settings being sent to server:', {
        bodyTextureMode: serverSettings.bodyTextureMode,
        bodyTextureMapping: serverSettings.bodyTextureMapping,
        bodyTextureFileIndex: serverSettings.bodyTextureFileIndex,
        bodyGifSpeed: serverSettings.bodyGifSpeed,
        overlayMode: serverSettings.overlayMode,
        overlayMode2: serverSettings.overlayMode2,
        overlayFileIndex: serverSettings.overlayFileIndex,
        overlayFileIndex2: serverSettings.overlayFileIndex2,
        gifAnimationSpeed: serverSettings.gifAnimationSpeed,
        overlayGifSpeed: serverSettings.overlayGifSpeed,
        hasUploadedFiles: fileIndex > 0
      });
      console.log('⏱️ Starting server request with extended timeout for large files...');
    
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout after 60s');
        controller.abort();
      }, 60000); // 60 second timeout
      
      const response = await fetch(`${window.location.origin}/.netlify/functions/render-frames`, {
        method: 'POST',
        body: formData, // No Content-Type header - let browser set multipart boundary
        signal: controller.signal, // Add abort signal
      });
      
      clearTimeout(timeoutId); // Clear timeout on success
    
    if (!response.ok) {
      let errorResult;
      try {
        errorResult = await response.json();
      } catch {
        // If JSON parsing fails, get raw text
        const errorText = await response.text();
        throw new Error(`Server rendering failed (${response.status}): ${errorText}`);
      }
      throw new Error(`Server rendering failed: ${errorResult.error || response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.frames) {
      throw new Error(result.error || 'Server response missing frames');
    }
    
    console.log('✅ Server-side binary streaming successful:', {
      frames_count: result.frames_count,
      environment: result.rendering_environment,
      files_streamed: fileIndex,
      first_frame_length: result.frames[0]?.length,
      has_all_frames: result.frames.length === result.frames_count
    });
    
    console.log('🎞️ Starting client-side frame processing...');

    return result.frames;
    
    } catch (error) {
      console.error('❌ Server streaming failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        totalUploadSize: totalUploadSize ? `${(totalUploadSize/1024/1024).toFixed(1)}MB` : 'unknown',
        fileCount: fileIndex
      });
      
      // Re-throw with more context
      if (error instanceof Error) {
        if (error.message.includes('Body is disturbed') || error.message.includes('locked')) {
          throw new Error(`Large file upload interrupted (${(totalUploadSize/1024/1024).toFixed(1)}MB). This can happen with slow connections. Please try a smaller file or check your internet connection.`);
        }
        if (error.name === 'AbortError') {
          throw new Error(`Upload timeout after 60s. File too large (${(totalUploadSize/1024/1024).toFixed(1)}MB) or connection too slow.`);
        }
        throw new Error(`Server request failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Original method with base64 encoding (fallback for URLs)
  private async renderFramesOnServer(coinSettings: any, exportSettings: ExportSettings): Promise<string[]> {
    console.log('📡 Starting segmented server-side rendering...');
    
    // Prepare settings for server-side rendering
    // Use base64 data URLs for uploaded files instead of temp file paths
    const serverSettings = { ...coinSettings };
    
    // Handle body texture: use base64 data if available, otherwise keep URL
    if (coinSettings.bodyTextureMode === 'upload' && coinSettings.bodyTextureBase64) {
      const ext = this.getFileExtension(coinSettings.bodyTextureFile);
      const mimeType = this.getMimeType(ext);
      serverSettings.bodyTextureUrl = `data:${mimeType};base64,${coinSettings.bodyTextureBase64}`;
      console.log('🔄 Using base64 data URL for body texture');
    }
    
    // Handle primary overlay: use base64 data if available, otherwise keep URL
    if (coinSettings.overlayMode === 'upload' && coinSettings.overlayBase64) {
      const ext = this.getFileExtension(coinSettings.overlayFile);
      const mimeType = this.getMimeType(ext);
      serverSettings.overlayUrl = `data:${mimeType};base64,${coinSettings.overlayBase64}`;
      console.log('🔄 Using base64 data URL for overlay 1');
    }
    
    // Handle secondary overlay: use base64 data if available, otherwise keep URL
    if (coinSettings.overlayMode2 === 'upload' && coinSettings.overlayBase64_2) {
      const ext = this.getFileExtension(coinSettings.overlayFile2);
      const mimeType = this.getMimeType(ext);
      serverSettings.overlayUrl2 = `data:${mimeType};base64,${coinSettings.overlayBase64_2}`;
      console.log('🔄 Using base64 data URL for overlay 2');
    }
    
    // Calculate frames based on settings
    const frameCount = Math.round(exportSettings.fps * exportSettings.duration);
    
    // 🚀 NEW: Segmented rendering loop to handle 30s timeout
    let startFrame = 0;
    const allFrames: string[] = [];
    let segmentCount = 0;
    
    console.log(`🎬 Starting segmented rendering: ${frameCount} total frames`);
    
    do {
      segmentCount++;
      console.log(`📍 Rendering segment ${segmentCount}, starting from frame ${startFrame}`);
      
      const payload = {
        settings: serverSettings,
        exportSettings: {
          fps: exportSettings.fps,
          duration: exportSettings.duration,
          frames: frameCount,
          qualityMode: exportSettings.qualityMode || 'balanced',
          startFrame: startFrame // NEW: Pass start frame for segmentation
        }
      };

      const response = await fetch(`${window.location.origin}/.netlify/functions/render-frames`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(`Server rendering failed: ${errorResult.error || response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.frames) {
        throw new Error(result.error || 'Server response missing frames');
      }

      console.log(`✅ Segment ${segmentCount} complete:`, {
        frames_rendered: result.frames_count,
        total_frames: result.total_frames,
        current_start_frame: result.current_start_frame,
        nextStartFrame: result.nextStartFrame,
        is_complete: result.is_complete,
        environment: result.rendering_environment
      });

      // Add frames from this segment
      allFrames.push(...result.frames);
      
      // Update start frame for next segment
      startFrame = result.nextStartFrame;
      
    } while (startFrame !== null && startFrame < frameCount);
    
    console.log(`🎉 Segmented rendering complete: ${allFrames.length} total frames in ${segmentCount} segments`);
    console.log('🎞️ Starting client-side frame processing...');

    return allFrames;
  }
  
  // Helper to get file extension from File object
  private getFileExtension(file: File | null): string {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    return ext ? `.${ext}` : '';
  }

  // Helper to get MIME type from file extension
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webm': 'video/webm'
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }

  // Fallback to original client-side method (renamed)
  private async exportAsWebMClientSide(settings: ExportSettings, autoDownload: boolean = false): Promise<Blob> {
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
      
      const response = await fetch(`${window.location.origin}/.netlify/functions/make-webm`, {
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
    const response = await fetch(`${window.location.origin}/.netlify/functions/send-file?user_id=${userId}`, {
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
    const response = await fetch(`${window.location.origin}/.netlify/functions/send-message`, {
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
    const response = await fetch(`${window.location.origin}/.netlify/functions/create-emoji`, {
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

    // Handle rate limiting (HTTP 429) specifically
    if (response.status === 429) {
      const result = await response.json();
      console.log('⏰ Rate limited response:', result);
      
      // Return rate limit info without throwing an error
      return {
        success: false,
        error: 'rate_limit',
        message: result.message || 'Too many requests. Please try again later.',
        retry_after_seconds: result.retry_after_seconds,
        retry_after_minutes: result.retry_after_minutes,
        retry_after_hours: result.retry_after_hours,
        suggested_action: result.suggested_action
      };
    }

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
    
    // Add bot info to result for better user feedback
    if (result.success && result.bot_used) {
      console.log(`🤖 Emoji created successfully using: ${result.bot_used} (@${result.bot_username})`);
    }
    
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
    const response = await fetch(`${window.location.origin}/.netlify/functions/send-file`, {
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
