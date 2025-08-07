import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { CoinExporter } from '../utils/exporter';
// @ts-ignore - gifuct-js doesn't have types
import { parseGIF, decompressFrames } from 'gifuct-js';

interface CoinEditorProps {
  className?: string;
  onSettingsChange?: (settings: CoinSettings) => void;
  settings?: CoinSettings;
}

export interface CoinSettings {
  fillMode: 'solid' | 'gradient';
  bodyColor: string;
  gradientStart: string;
  gradientEnd: string;
  bodyTextureUrl: string;
  // Enhanced texture handling for body
  bodyTextureMode: 'url' | 'upload';
  bodyTextureFile: File | null;
  bodyTextureBlobUrl: string;
  metallic: boolean;
  rotationSpeed: 'slow' | 'medium' | 'fast';
  overlayUrl: string;
  // Enhanced texture handling for overlays
  overlayMode: 'url' | 'upload';
  overlayFile: File | null;
  overlayBlobUrl: string;
  dualOverlay: boolean;
  overlayUrl2: string;
  overlayMode2: 'url' | 'upload';
  overlayFile2: File | null;
  overlayBlobUrl2: string;
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'strong';
  gifAnimationSpeed: 'slow' | 'medium' | 'fast';
  // New customization settings
  coinShape: 'thin' | 'normal' | 'thick';
  overlayMetalness: 'low' | 'normal' | 'high';
  overlayRoughness: 'low' | 'normal' | 'high';
}

export interface CoinEditorRef {
  exportFrames: (settings: any) => Promise<Blob[]>;
  getScene: () => THREE.Scene | null;
  getCamera: () => THREE.PerspectiveCamera | null;
  getRenderer: () => THREE.WebGLRenderer | null;
  getTurntable: () => THREE.Group | null;
}

const CoinEditor = forwardRef<CoinEditorRef, CoinEditorProps>(({ className = '', settings: externalSettings }, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress] = useState(100); // No environment map loading needed
  
  // Refs to track current settings for animation loop
  const rotationSpeedRef = useRef<'slow' | 'medium' | 'fast'>('medium');
  // Guards async overlay loads so clears can't be "undone" by late promises
  const overlayReqIdRef = useRef(0);
  
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    coinGroup: THREE.Group;
    turntable: THREE.Group;
    rimMat: THREE.MeshStandardMaterial;
    faceMat: THREE.MeshStandardMaterial;
    overlayTop: THREE.Mesh;
    overlayBot: THREE.Mesh;
    animationId?: number;
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
  }>();

  const [internalSettings] = useState<CoinSettings>({
    fillMode: 'solid',
    bodyColor: '#b87333',
    gradientStart: '#ffd700',
    gradientEnd: '#ff8c00',
    bodyTextureUrl: '',
    // Enhanced texture handling for body
    bodyTextureMode: 'url',
    bodyTextureFile: null,
    bodyTextureBlobUrl: '',
    metallic: true,
    rotationSpeed: 'medium',
    overlayUrl: '',
    // Enhanced texture handling for overlays
    overlayMode: 'url',
    overlayFile: null,
    overlayBlobUrl: '',
    dualOverlay: false,
    overlayUrl2: '',
    overlayMode2: 'url',
    overlayFile2: null,
    overlayBlobUrl2: '',
    lightColor: '#ffffff',
    lightStrength: 'medium',
    gifAnimationSpeed: 'medium',
    // Default values for new settings
    coinShape: 'normal',         // 0.15 (default)
    overlayMetalness: 'normal',  // 0.6 (default)
    overlayRoughness: 'low',     // 0.3 (default)
  });

  // Use external settings if provided, otherwise use internal
  const currentSettings = externalSettings || internalSettings;

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    exportFrames: async (settings: any) => {
      if (!sceneRef.current) return [];
      
      // Enhanced settings with quality optimization
      const enhancedSettings = {
        fps: settings.fps || 20,
        duration: settings.duration || 3,
        size: settings.size || 100,
        targetFileSize: 64 * 1024, // 64KB target (96% of 64KB limit - maximize quality)
        qualityMode: 'high' as const, // Use high quality for better results
        ...settings
      };
      
      console.log('🎬 Starting export with OPTIMIZED settings:', enhancedSettings);
      
      const exporter = new CoinExporter(
        sceneRef.current.scene,
        sceneRef.current.camera,
        sceneRef.current.renderer,
        sceneRef.current.turntable
      );
      return await exporter.exportFrames(enhancedSettings);
    },
    getScene: () => sceneRef.current?.scene || null,
    getCamera: () => sceneRef.current?.camera || null,
    getRenderer: () => sceneRef.current?.renderer || null,
    getTurntable: () => sceneRef.current?.turntable || null,
  }), []);

  // Update rotation speed ref when settings change
  useEffect(() => {
    rotationSpeedRef.current = currentSettings.rotationSpeed;
  }, [currentSettings.rotationSpeed]);

  const speedMap = {
    slow: 0.01,
    medium: 0.02,
    fast: 0.035,
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true // For capturing frames
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // Transparent background

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup (IDENTICAL to server-side for perfect visual parity)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.45);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    // Add additional lights to compensate for missing environment map
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-2, -3, -1);
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-3, 1, 4);
    scene.add(rimLight);

    // Add stronger broad ambient light to brighten overall appearance
    const broadLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(broadLight);

    // Skip environment map for performance and visual parity with server-side
    console.log('⚡ Using enhanced lighting setup for optimal performance and server parity');
    
    // Set loading complete immediately since no async resources are loaded
    setTimeout(() => setIsLoading(false), 100);

    // Coin parameters - will be used in rebuilding function
    const R = 1.0;
    const T = 0.35;
    const radialSegments = 128;
    const capSegments = 32;

    // Initial shape value - thin/normal/thick mapping
    const shapeMap = { thin: 0.01, normal: 0.15, thick: 0.25 };
    let currentBulge = shapeMap[currentSettings.coinShape];

    // Materials
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      metalness: 0.8, // Metalness 1 is too much
      roughness: 0.34,
      envMapIntensity: 1
    });
    const faceMat = rimMat.clone();

    // Coin geometry
    const cylinderGeometry = new THREE.CylinderGeometry(R, R, T, radialSegments, 1, true);
    const cylinder = new THREE.Mesh(cylinderGeometry, rimMat);

    // Face creation function
    const createFace = (isTop: boolean) => {
      const geometry = new THREE.SphereGeometry(
        R,
        radialSegments,
        capSegments,
        0,
        Math.PI * 2,
        isTop ? 0 : Math.PI / 2,
        Math.PI / 2
      );
      geometry.scale(1, currentBulge / R, 1);
      geometry.translate(0, isTop ? T / 2 : -T / 2, 0);
      return new THREE.Mesh(geometry, faceMat);
    };

    const topFace = createFace(true);
    topFace.userData = { type: 'face' };
    const bottomFace = createFace(false);
    bottomFace.userData = { type: 'face' };

    // Overlay creation with dynamic material properties
    // Metalness mapping: low=0.3, normal=0.6, high=0.8
    const metalnessMap = { low: 0.3, normal: 0.6, high: 0.8 };
    // Roughness mapping: low=0.3, normal=0.5, high=0.7  
    const roughnessMap = { low: 0.3, normal: 0.5, high: 0.7 };
    
    const overlayMetalness = currentSettings.metallic ? metalnessMap[currentSettings.overlayMetalness] : 0;
    const overlayRoughness = currentSettings.metallic ? roughnessMap[currentSettings.overlayRoughness] : 0.5;
    
    const overlayMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      metalness: overlayMetalness,
      roughness: overlayRoughness,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      opacity: 0
    });

    const createOverlay = (isTop: boolean) => {
      const mesh = createFace(isTop);
      mesh.material = overlayMaterial.clone();
      // Remove the rotation that was causing horizontal flipping
      // if (!isTop) {
      //   mesh.geometry.rotateY(Math.PI);
      // }
      // Apply planar UV mapping
      planarMapUVs(mesh.geometry);
      return mesh;
    };

    const overlayTop = createOverlay(true);
    const overlayBot = createOverlay(false);

    // Coin assembly
    const coinGroup = new THREE.Group();
    coinGroup.add(cylinder, topFace, bottomFace, overlayTop, overlayBot);
    coinGroup.rotation.x = Math.PI / 2; // Stand on edge

    const turntable = new THREE.Group();
    turntable.add(coinGroup);
    scene.add(turntable);

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      coinGroup,
      turntable,
      rimMat,
      faceMat,
      overlayTop,
      overlayBot,
      hemiLight,
      dirLight
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);
      sceneRef.current.turntable.rotation.y += speedMap[rotationSpeedRef.current];
      
      // Update animated textures
      const updateAnimatedTexture = (material: THREE.MeshStandardMaterial) => {
        const map = material.map as any;
        if (!map) return;
        if (map instanceof THREE.VideoTexture) {
          // Video frames advance on their own; we just mark dirty
          map.needsUpdate = true;
        } else if (map instanceof THREE.CanvasTexture) {
          // Our GIF driver exposes userData.update()
          if (typeof map.userData?.update === 'function') {
            map.userData.update();
          }
        }
      };
      
      // Update overlay textures (both top and bottom for GIF animations)
      if (sceneRef.current.overlayTop.material) {
        updateAnimatedTexture(sceneRef.current.overlayTop.material as THREE.MeshStandardMaterial);
      }
      if (sceneRef.current.overlayBot.material) {
        updateAnimatedTexture(sceneRef.current.overlayBot.material as THREE.MeshStandardMaterial);
      }
      
      // Update textures on coin faces and rim
      sceneRef.current.coinGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial) {
              updateAnimatedTexture(material);
            }
          });
        }
      });
      
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    
    // Call handleResize immediately to fix initial aspect ratio
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Planar UV mapping helper
  const planarMapUVs = (geometry: THREE.BufferGeometry) => {
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const r = Math.max(
      Math.abs(bb.max.x),
      Math.abs(bb.min.x),
      Math.abs(bb.max.z),
      Math.abs(bb.min.z)
    );

    const position = geometry.attributes.position;
    const uvArray = new Float32Array(position.count * 2);

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const u = 0.5 + (x / r) * 0.48;
      const v = 1 - (0.5 + (z / r) * 0.48);
      uvArray[i * 2] = u;
      uvArray[i * 2 + 1] = v;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  };

  // ---- GIF Animation Support with Proper Frame Extraction ----
  const gifUrlToVideoTexture = async (url: string): Promise<THREE.Texture> => {
    console.log('🎞️ Loading animated GIF texture:', url);
    
    try {
      let buffer: ArrayBuffer;
      
      // 🔧 FIX: Handle data URLs directly to avoid fetch size limitations
      if (url.startsWith('data:')) {
        console.log('📦 Processing data URL (uploaded GIF)...');
        // Extract base64 data from data URL and convert to ArrayBuffer
        const base64Data = url.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        buffer = bytes.buffer;
        console.log(`✅ Data URL converted to buffer: ${buffer.byteLength} bytes`);
      } else {
        console.log('🌐 Fetching GIF from URL...');
        // Fetch the GIF as a buffer (for regular URLs)
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch GIF: ${response.status}`);
        }
        buffer = await response.arrayBuffer();
        console.log(`✅ GIF fetched: ${buffer.byteLength} bytes`);
      }
      
      // Parse GIF using gifuct-js
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);
      
      console.log('🎯 GIF parsed:', { 
        frameCount: frames.length,
        width: gif.lsd.width,
        height: gif.lsd.height
      });
      
      if (frames.length === 0) {
        throw new Error('No frames found in GIF');
      }
      
      // Create canvas for rendering frames
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = gif.lsd.width;
      canvas.height = gif.lsd.height;
      
      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;
      if (sceneRef.current) {
        texture.anisotropy = sceneRef.current.renderer.capabilities.getMaxAnisotropy();
      }
      
      // Animation state
      let currentFrame = 0;
      let frameCounter = 0;
      
      // Frame-rate-based speed mapping to sync with Three.js 60fps rendering
      const getFrameInterval = () => {
        const intervalMap = {
          slow: 4,      // Change frame every 4 renders (15fps effective)
          medium: 2,    // Change frame every 2 renders (30fps effective)  
          fast: 1       // Change frame every render (60fps effective)
        };
        return intervalMap[currentSettings.gifAnimationSpeed];
      };
      
      // Helper to draw frame to canvas
      const drawFrame = (frameIndex: number) => {
        const frame = frames[frameIndex];
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );
        
        // Clear canvas (handle disposal method)
        if (frame.disposalType === 2) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Create temporary canvas for the frame
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw frame at correct position
        ctx.drawImage(
          tempCanvas,
          frame.dims.left,
          frame.dims.top,
          frame.dims.width,
          frame.dims.height
        );
      };
      
      // Draw initial frame
      drawFrame(0);
      
      // Store cleanup function
      texture.userData.dispose = () => {
        // No special cleanup needed for this implementation
      };
      
      // Store update function called by main animation loop
      texture.userData.update = () => {
        if (frames.length <= 1) return; // Static image
        
        frameCounter++;
        const frameInterval = getFrameInterval();
        
        // Only advance frame when we hit the interval
        if (frameCounter >= frameInterval) {
          // Advance to next frame
          currentFrame = (currentFrame + 1) % frames.length;
          
          // Draw new frame
          drawFrame(currentFrame);
          
          // Mark texture as needing update
          texture.needsUpdate = true;
          
          // Reset counter
          frameCounter = 0;
        }
      };
      
      console.log('✅ Animated GIF texture created successfully');
      return texture;
      
    } catch (error) {
      console.error('Failed to create animated GIF texture:', error);
      throw error;
    }
  };

  // Helper to create texture from URL with proper GIF animation support
  const createTextureFromUrl = (url: string, fileType?: string): Promise<THREE.Texture | THREE.VideoTexture | THREE.CanvasTexture> => {
    return new Promise((resolve, reject) => {
      // 🔧 ENHANCED: Smart GIF detection using URL patterns, data URL MIME types, and file type info
      const isGif = /\.gif$/i.test(url) || // Traditional URL ending in .gif
                    /data:image\/gif/i.test(url) || // Data URL with GIF MIME type
                    fileType === 'image/gif'; // File type from uploaded File object
                    
      const isWebM = /\.webm$/i.test(url) || 
                     /data:video\/webm/i.test(url) ||
                     fileType === 'video/webm';
      
      if (isGif) {
        // Use proper GIF frame parsing
        (async () => {
          try {
            console.log('🎞️ Detected animated GIF, using gifUrlToVideoTexture:', {
              url: url.substring(0, 50) + '...',
              fileType,
              detectedVia: fileType === 'image/gif' ? 'fileType' : 
                          /data:image\/gif/i.test(url) ? 'dataURL' : 'urlPattern'
            });
            const tex = await gifUrlToVideoTexture(url);
            resolve(tex);
          } catch (e) {
            console.warn('GIF parsing failed, falling back to static image:', e);
            // Fallback: treat as static image
            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            loader.load(
              url,
              (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.flipY = false;
                if (sceneRef.current) {
                  texture.anisotropy = sceneRef.current.renderer.capabilities.getMaxAnisotropy();
                }
                resolve(texture);
              },
              undefined,
              (error) => {
                console.error('Failed to load static image texture:', error);
                // Show user-friendly CORS error message
                const errorMsg = error instanceof Error ? error.message : String(error);
                if (errorMsg.includes('CORS') || 
                    errorMsg.includes('cross-origin') ||
                    errorMsg.includes('NetworkError') ||
                    errorMsg.includes('Failed to fetch')) {
                  alert("We can't access that URL! Please try a different URL or host.");
                }
                reject(error);
              }
            );
          }
        })();

      } else if (isWebM) {
        // Handle WebM as video texture
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.autoplay = true;
        
        const handleVideoSuccess = () => {
          try {
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.colorSpace = THREE.SRGBColorSpace;
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBAFormat;
            videoTexture.flipY = true; // Video textures need flipY=true (opposite of images)
            resolve(videoTexture);
          } catch (error) {
            console.warn('VideoTexture creation failed, falling back to image:', error);
            fallbackToImage();
          }
        };
        
        const fallbackToImage = () => {
          const loader = new THREE.TextureLoader();
          loader.setCrossOrigin('anonymous');
          loader.load(
            url,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.flipY = false;
              if (sceneRef.current) {
                texture.anisotropy = sceneRef.current.renderer.capabilities.getMaxAnisotropy();
              }
              resolve(texture);
            },
            undefined,
            (error) => {
              console.error('Failed to load WebM fallback texture:', error);
              // Show user-friendly CORS error message
              const errorMsg = error instanceof Error ? error.message : String(error);
              if (errorMsg.includes('CORS') || 
                  errorMsg.includes('cross-origin') ||
                  errorMsg.includes('NetworkError') ||
                  errorMsg.includes('Failed to fetch')) {
                alert("We can't access that URL! Please try a different image URL or use a direct image link.");
              }
              reject(error);
            }
          );
        };
        
        video.addEventListener('canplay', () => {
          video.play().then(handleVideoSuccess).catch(fallbackToImage);
        });
        
        video.addEventListener('loadeddata', () => {
          if (video.readyState >= 2) {
            video.play().then(handleVideoSuccess).catch(fallbackToImage);
          }
        });
        
        video.addEventListener('error', fallbackToImage);
        video.src = url;
        
        setTimeout(() => {
          if (video.readyState < 2) {
            fallbackToImage();
          }
        }, 3000);
        
      } else {
        // Use standard texture loader for static images (JPG, PNG, etc.)
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false;
            if (sceneRef.current) {
              texture.anisotropy = sceneRef.current.renderer.capabilities.getMaxAnisotropy();
            }
            resolve(texture);
          },
          undefined,
          reject
        );
      }
    });
  };

  // Gradient texture creation
  const createGradientTexture = (color1: string, color2: string, isRim = false) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    if (isRim) {
      canvas.width = 512;
      canvas.height = 16;
      
      // Left half: color1 -> color2
      const grad1 = ctx.createLinearGradient(0, 0, canvas.width / 2, 0);
      grad1.addColorStop(0, color1);
      grad1.addColorStop(1, color2);
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height)

      // Right half: color2 -> color1
      const grad2 = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width, 0);
      grad2.addColorStop(0, color2);
      grad2.addColorStop(1, color1);
      ctx.fillStyle = grad2;
      ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
    } else {
      canvas.width = 256;
      canvas.height = 256;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // Update coin geometry when shape changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const { coinGroup, overlayTop, overlayBot } = sceneRef.current;
    const shapeMap = { thin: 0.01, normal: 0.15, thick: 0.25 };
    const newBulge = shapeMap[currentSettings.coinShape];

    // Find and remove existing faces
    const facesToRemove = coinGroup.children.filter(child => 
      child.userData?.type === 'face'
    );
    facesToRemove.forEach(face => {
      coinGroup.remove(face);
      (face as THREE.Mesh).geometry?.dispose();
    });

    // Create new faces with updated bulge
    const R = 1.0;
    const T = 0.35;
    const radialSegments = 128;
    const capSegments = 32;

    // Create top face
    const topGeometry = new THREE.SphereGeometry(
      R, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2
    );
    topGeometry.scale(1, newBulge / R, 1);
    topGeometry.translate(0, T / 2, 0);
    const newTopFace = new THREE.Mesh(topGeometry, sceneRef.current.faceMat);
    newTopFace.userData = { type: 'face' };

    // Create bottom face  
    const bottomGeometry = new THREE.SphereGeometry(
      R, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2
    );
    bottomGeometry.scale(1, newBulge / R, 1);
    bottomGeometry.translate(0, -T / 2, 0);
    const newBottomFace = new THREE.Mesh(bottomGeometry, sceneRef.current.faceMat);
    newBottomFace.userData = { type: 'face' };

    // Add new faces to coin group
    coinGroup.add(newTopFace, newBottomFace);

    // Update overlay geometries to match new bulge
    // Dispose old overlay geometries
    overlayTop.geometry?.dispose();
    overlayBot.geometry?.dispose();

    // Create new overlay geometries with updated bulge
    const newTopOverlayGeometry = new THREE.SphereGeometry(
      R, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2
    );
    newTopOverlayGeometry.scale(1, newBulge / R, 1);
    newTopOverlayGeometry.translate(0, T / 2, 0);
    planarMapUVs(newTopOverlayGeometry);
    overlayTop.geometry = newTopOverlayGeometry;

    const newBotOverlayGeometry = new THREE.SphereGeometry(
      R, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2
    );
    newBotOverlayGeometry.scale(1, newBulge / R, 1);
    newBotOverlayGeometry.translate(0, -T / 2, 0);
    planarMapUVs(newBotOverlayGeometry);
    overlayBot.geometry = newBotOverlayGeometry;

    console.log('🔄 Updated coin and overlay geometry for shape:', currentSettings.coinShape, 'value:', newBulge);

  }, [currentSettings.coinShape]);

    // Update materials based on settings
  useEffect(() => {
    if (!sceneRef.current) return;

    const { rimMat, faceMat } = sceneRef.current;

    if (currentSettings.bodyTextureUrl && currentSettings.bodyTextureUrl.trim() !== '') {
      // Apply body texture with proper face UV mapping
      // Pass file type for uploaded files to enable proper GIF detection
      const fileType = currentSettings.bodyTextureMode === 'upload' && currentSettings.bodyTextureFile ? 
                      currentSettings.bodyTextureFile.type : undefined;
      createTextureFromUrl(currentSettings.bodyTextureUrl, fileType)
        .then((texture) => {
          // Dispose of previous textures first
          (rimMat.map as any)?.userData?.dispose?.();
          (faceMat.map as any)?.userData?.dispose?.();
          rimMat.map?.dispose();
          faceMat.map?.dispose();
          
          // For body textures on faces, apply planar UV mapping like overlays
          const { coinGroup } = sceneRef.current!;
          const faces = coinGroup.children.filter(child => 
            child instanceof THREE.Mesh && 
            (child.material === faceMat || child.material.uuid === faceMat.uuid)
          ) as THREE.Mesh[];
          
          faces.forEach(face => {
            // Apply planar UV mapping to face geometry for texture
            planarMapUVs(face.geometry);
          });
          
          // Apply texture to both rim and face materials
          rimMat.map = texture;
          faceMat.map = texture;
          rimMat.color.set('#ffffff');
          faceMat.color.set('#ffffff');
          rimMat.needsUpdate = true;
          faceMat.needsUpdate = true;
        })
        .catch((error) => {
          console.error('Failed to load body texture:', error);
          
          // Show user-friendly CORS error message
          if (error.message?.includes('CORS') || 
              error.message?.includes('cross-origin') ||
              error.message?.includes('NetworkError') ||
              error.toString().includes('Failed to fetch')) {
            // TODO: Replace with proper toast/notification system
            alert("We can't access that URL! Please try a different image URL or host.");
          }
          
          // Fallback to color mode
          (rimMat.map as any)?.userData?.dispose?.();
          (faceMat.map as any)?.userData?.dispose?.();
          rimMat.map?.dispose();
          faceMat.map?.dispose();
          rimMat.map = null;
          faceMat.map = null;
          if (currentSettings.fillMode === 'solid') {
            rimMat.color.set(currentSettings.bodyColor);
            faceMat.color.set(currentSettings.bodyColor);
          } else {
            const faceTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd);
            const rimTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd, true);
            rimMat.map = rimTexture;
            faceMat.map = faceTexture;
            rimMat.color.set('#ffffff');
            faceMat.color.set('#ffffff');
          }
          rimMat.needsUpdate = true;
          faceMat.needsUpdate = true;
        });
    } else if (currentSettings.fillMode === 'solid') {
      // Clear texture and apply solid color (this handles the "clear" case)
      (rimMat.map as any)?.userData?.dispose?.();
      (faceMat.map as any)?.userData?.dispose?.();
      rimMat.map?.dispose();
      faceMat.map?.dispose();
      rimMat.map = null;
      faceMat.map = null;
      rimMat.color.set(currentSettings.bodyColor);
      faceMat.color.set(currentSettings.bodyColor);
      rimMat.needsUpdate = true;
      faceMat.needsUpdate = true;
    } else {
      // Clear texture and apply gradient (this handles the "clear" case)
      (rimMat.map as any)?.userData?.dispose?.();
      (faceMat.map as any)?.userData?.dispose?.();
      rimMat.map?.dispose();
      faceMat.map?.dispose();
      rimMat.map = null;
      faceMat.map = null;
      const faceTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd);
      const rimTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd, true);
      
      rimMat.map = rimTexture;
      faceMat.map = faceTexture;
      rimMat.color.set('#ffffff');
      faceMat.color.set('#ffffff');
      rimMat.needsUpdate = true;
      faceMat.needsUpdate = true;
    }

    // Update metallic property
    rimMat.metalness = faceMat.metalness = currentSettings.metallic ? 1 : 0.1;
  }, [currentSettings.fillMode, currentSettings.bodyColor, currentSettings.gradientStart, currentSettings.gradientEnd, currentSettings.metallic, currentSettings.bodyTextureUrl]);

  // Update overlay material properties when metalness/roughness settings change
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const { overlayTop, overlayBot } = sceneRef.current;
    
    // Metalness mapping: low=0.3, normal=0.6, high=0.8
    const metalnessMap = { low: 0.3, normal: 0.6, high: 0.8 };
    // Roughness mapping: low=0.3, normal=0.5, high=0.7  
    const roughnessMap = { low: 0.3, normal: 0.5, high: 0.7 };
    
    const overlayMetalness = currentSettings.metallic ? metalnessMap[currentSettings.overlayMetalness] : 0;
    const overlayRoughness = currentSettings.metallic ? roughnessMap[currentSettings.overlayRoughness] : 0.5;
    
    // Update overlay materials
    if (overlayTop.material instanceof THREE.MeshStandardMaterial) {
      overlayTop.material.metalness = overlayMetalness;
      overlayTop.material.roughness = overlayRoughness;
      overlayTop.material.needsUpdate = true;
    }
    
    if (overlayBot.material instanceof THREE.MeshStandardMaterial) {
      overlayBot.material.metalness = overlayMetalness;
      overlayBot.material.roughness = overlayRoughness;
      overlayBot.material.needsUpdate = true;
    }
    
    console.log('🎨 Updated overlay materials:', {
      metalness: overlayMetalness,
      roughness: overlayRoughness,
      metalnessEnabled: currentSettings.metallic
    });
  }, [currentSettings.metallic, currentSettings.overlayMetalness, currentSettings.overlayRoughness]);

  // Note: Coin shape changes require rebuilding geometry, so we handle this in the initial setup
  // The shape setting is applied during the createFace function using dynamic bulge value

  // Update lighting based on settings
  useEffect(() => {
    if (!sceneRef.current) return;

    const { hemiLight, dirLight } = sceneRef.current;
    const lightStrengthMap = {
      low: { hemi: 0.3, dir: 0.6 },
      medium: { hemi: 0.8, dir: 1.3 },
      strong: { hemi: 1.2, dir: 3.0 }
    };

    const strength = lightStrengthMap[currentSettings.lightStrength];
    hemiLight.intensity = strength.hemi;
    dirLight.intensity = strength.dir;
    
    hemiLight.color.set(currentSettings.lightColor);
    dirLight.color.set(currentSettings.lightColor);
  }, [currentSettings.lightColor, currentSettings.lightStrength]);

  // Apply overlay textures with animation support
  const applyOverlay = (url: string, isSecond = false, requestId = overlayReqIdRef.current, fileType?: string) => {
    if (!sceneRef.current || !url) return;

    createTextureFromUrl(url, fileType)
      .then((texture) => {
        // Bail if a newer request superseded this one
        if (requestId !== overlayReqIdRef.current) {
          // Dispose just-created texture to avoid leaks
          (texture as any).userData?.dispose?.();
          texture.dispose?.();
          return;
        }
        // Ensure consistent texture orientation
        // Videos need flipY=true, static images need flipY=false
        if (texture instanceof THREE.VideoTexture || texture instanceof THREE.CanvasTexture) {
          texture.flipY = true;
        } else {
          texture.flipY = true;
        }
        
        if (currentSettings.dualOverlay && isSecond) {
          // Apply to bottom face - flip horizontally for video textures
          const material = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          
          if (texture instanceof THREE.VideoTexture) {
            // For video textures on bottom face in dual mode, we need horizontal flipping
            // Create a new VideoTexture with the same video element but flipped
            const video = (texture as any).image;
            const flippedTexture = new THREE.VideoTexture(video);
            flippedTexture.colorSpace = THREE.SRGBColorSpace;
            flippedTexture.minFilter = THREE.LinearFilter;
            flippedTexture.magFilter = THREE.LinearFilter;
            flippedTexture.format = THREE.RGBAFormat;
            flippedTexture.flipY = true;
            flippedTexture.wrapS = THREE.RepeatWrapping;
            flippedTexture.repeat.x = -1; // Horizontal flip
            flippedTexture.needsUpdate = true;
            // Copy dispose function if it exists
            if ((texture as any).userData?.dispose) {
              flippedTexture.userData.dispose = (texture as any).userData.dispose;
            }
            material.map = flippedTexture;
          } else {
            // For static images, no special handling needed
            material.map = texture;
          }
          
          material.opacity = 1;
          material.transparent = true;
          material.needsUpdate = true;
          sceneRef.current!.overlayBot.visible = true;
        } else if (currentSettings.dualOverlay && !isSecond) {
          // Apply to top only
          const material = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          material.map = texture;
          material.opacity = 1;
          material.transparent = true;
          material.needsUpdate = true;
          sceneRef.current!.overlayTop.visible = true;
        } else {
          // Apply to both faces - single image mode
          const topMaterial = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          const botMaterial = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          
          // Top face gets original texture
          topMaterial.map = texture;
          topMaterial.opacity = 1;
          topMaterial.transparent = true;
          topMaterial.needsUpdate = true;
          sceneRef.current!.overlayTop.visible = true;
          
          // Bottom face handling - special case for animated textures
          if (texture instanceof THREE.VideoTexture) {
            // For video textures, we can't clone them safely, so we reuse the same video element
            // but create a new VideoTexture with corrected orientation
            const video = (texture as any).image; // Get the underlying video element
            const bottomTexture = new THREE.VideoTexture(video);
            bottomTexture.colorSpace = THREE.SRGBColorSpace;
            bottomTexture.minFilter = THREE.LinearFilter;
            bottomTexture.magFilter = THREE.LinearFilter;
            bottomTexture.format = THREE.RGBAFormat;
            bottomTexture.flipY = false; // Bottom face uses different flip
            bottomTexture.needsUpdate = true;
            // Copy dispose function if it exists
            if ((texture as any).userData?.dispose) {
              bottomTexture.userData.dispose = (texture as any).userData.dispose;
            }
            botMaterial.map = bottomTexture;
          } else if (texture instanceof THREE.CanvasTexture) {
            // For CanvasTextures (like animated GIFs), share the same canvas AND animation state
            const bottomTexture = new THREE.CanvasTexture((texture as any).image);
            bottomTexture.colorSpace = THREE.SRGBColorSpace;
            bottomTexture.flipY = true;
            bottomTexture.wrapS = THREE.RepeatWrapping;
            bottomTexture.repeat.x = -1; // Horizontal flip to fix mirroring
            bottomTexture.needsUpdate = true;
            // CRITICAL: Share the EXACT SAME userData object for synchronized animation
            bottomTexture.userData = (texture as any).userData;
            botMaterial.map = bottomTexture;
          } else {
            // For static textures, clone and fix orientation
            const bottomTexture = texture.clone();
            bottomTexture.flipY = true;
            bottomTexture.wrapS = THREE.RepeatWrapping;
            bottomTexture.repeat.x = -1; // Horizontal flip to fix mirroring
            bottomTexture.needsUpdate = true;
            botMaterial.map = bottomTexture;
          }
          botMaterial.opacity = 1;
          botMaterial.transparent = true;
          botMaterial.needsUpdate = true;
          sceneRef.current!.overlayBot.visible = true;
        }
      })
      .catch((error) => {
        console.error('Failed to load overlay texture:', error);
        
        // Show user-friendly CORS error message
        if (error.message?.includes('CORS') || 
            error.message?.includes('cross-origin') ||
            error.message?.includes('NetworkError') ||
            error.toString().includes('Failed to fetch')) {
          // TODO: Replace with proper toast/notification system
          alert("We can't access that URL! Please try a different image URL or host.");
        }
      });
  };

  const clearOverlays = (invalidate: boolean = true) => {
    if (!sceneRef.current) return;
    if (invalidate) overlayReqIdRef.current++;

    const topMaterial = sceneRef.current.overlayTop.material as THREE.MeshStandardMaterial;
    const botMaterial = sceneRef.current.overlayBot.material as THREE.MeshStandardMaterial;
    
    // Dispose of existing overlay textures to prevent memory leaks
    if (topMaterial.map) {
      // If it was a GIF CanvasTexture, call its cleanup
      (topMaterial.map as any).userData?.dispose?.();
      topMaterial.map.dispose();
      topMaterial.map = null;
    }
    if (botMaterial.map) {
      (botMaterial.map as any).userData?.dispose?.();
      botMaterial.map.dispose();
      botMaterial.map = null;
    }
    
    // Reset overlay material properties and make overlays invisible
    topMaterial.opacity = 0;
    topMaterial.transparent = true;
    topMaterial.needsUpdate = true;
    
    botMaterial.opacity = 0;
    botMaterial.transparent = true;
    botMaterial.needsUpdate = true;
    
    // Hide overlay meshes completely
    sceneRef.current.overlayTop.visible = false;
    sceneRef.current.overlayBot.visible = false;
    
    // NOTE: Do NOT touch rimMat/faceMat here! They are the coin body materials,
    // not the overlays. The overlays are separate transparent layers on top.
    // The coin body should remain visible with its current appearance
    // (color/gradient/body texture) when overlays are cleared.
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    
    const nothingToShow = (!currentSettings.overlayUrl || currentSettings.overlayUrl.trim() === '') && 
                         (!currentSettings.overlayUrl2 || currentSettings.overlayUrl2.trim() === '');
    
    if (nothingToShow) {
      clearOverlays(true); // also invalidates any in‑flight loads
      return;
    }
    // New batch: allocate request ID, clear once (but don't bump again)
    const reqId = ++overlayReqIdRef.current;
    clearOverlays(false);
    // Apply overlays for this request
    if (currentSettings.overlayUrl && currentSettings.overlayUrl.trim() !== '') {
      // Pass file type for uploaded files to enable proper GIF detection
      const fileType = currentSettings.overlayMode === 'upload' && currentSettings.overlayFile ? 
                      currentSettings.overlayFile.type : undefined;
      applyOverlay(currentSettings.overlayUrl, false, reqId, fileType);
    }
    if (currentSettings.dualOverlay && currentSettings.overlayUrl2 && currentSettings.overlayUrl2.trim() !== '') {
      // Pass file type for uploaded files to enable proper GIF detection  
      const fileType2 = currentSettings.overlayMode2 === 'upload' && currentSettings.overlayFile2 ? 
                       currentSettings.overlayFile2.type : undefined;
      applyOverlay(currentSettings.overlayUrl2, true, reqId, fileType2);
    }
  }, [currentSettings.overlayUrl, currentSettings.overlayUrl2, currentSettings.dualOverlay]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 font-medium mb-2">Loading Editor</p>
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}
      
      {/* 3D Canvas */}
      <div 
        ref={mountRef} 
        className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
        style={{ minHeight: '400px' }}
      />
    </div>
  );
});

CoinEditor.displayName = 'CoinEditor';

export default CoinEditor;
