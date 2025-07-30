import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

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
  metallic: boolean;
  rotationSpeed: 'slow' | 'medium' | 'fast';
  overlayUrl: string;
  dualOverlay: boolean;
  overlayUrl2: string;
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'strong';
}

export interface CoinEditorRef {
  exportFrames: (settings: any) => Promise<Blob[]>;
  getScene: () => THREE.Scene | null;
  getCamera: () => THREE.PerspectiveCamera | null;
  getRenderer: () => THREE.WebGLRenderer | null;
  getTurntable: () => THREE.Group | null;
}

const CoinEditor: React.FC<CoinEditorProps> = ({ className = '', settings: externalSettings }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Refs to track current settings for animation loop
  const rotationSpeedRef = useRef<'slow' | 'medium' | 'fast'>('medium');
  
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
    metallic: true,
    rotationSpeed: 'medium',
    overlayUrl: '',
    dualOverlay: false,
    overlayUrl2: '',
    lightColor: '#ffffff',
    lightStrength: 'medium',
  });

  // Use external settings if provided, otherwise use internal
  const currentSettings = externalSettings || internalSettings;

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
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);
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

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 0.45);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    // Environment map with loading progress
    const loader = new THREE.CubeTextureLoader();
    const envMap = loader.load([
      'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
      'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
    ], 
    () => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    },
    (progress) => {
      setLoadingProgress((progress.loaded / progress.total) * 100);
    },
    (error) => {
      console.error('Error loading environment map:', error);
      setIsLoading(false);
    }
    );
    scene.environment = envMap;

    // Coin parameters
    const R = 1.0;
    const T = 0.35;
    const bulge = 0.10;
    const radialSegments = 128;
    const capSegments = 32;

    // Materials
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      metalness: 1,
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
      geometry.scale(1, bulge / R, 1);
      geometry.translate(0, isTop ? T / 2 : -T / 2, 0);
      return new THREE.Mesh(geometry, faceMat);
    };

    const topFace = createFace(true);
    const bottomFace = createFace(false);

    // Overlay creation
    const overlayMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      metalness: 0,
      roughness: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      opacity: 0
    });

    const createOverlay = (isTop: boolean) => {
      const mesh = createFace(isTop);
      mesh.material = overlayMaterial.clone();
      if (!isTop) {
        mesh.geometry.rotateY(Math.PI);
      }
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

  // Helper to detect if URL is animated (GIF or WebM)
  const isAnimatedUrl = (url: string): boolean => {
    return /\.(gif|webm)$/i.test(url);
  };

  // Helper to create texture from URL (supports static and animated)
  const createTextureFromUrl = (url: string): Promise<THREE.Texture | THREE.VideoTexture> => {
    return new Promise((resolve, reject) => {
      if (isAnimatedUrl(url)) {
        // Create video element for animated content
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        
        video.onloadeddata = () => {
          video.play().then(() => {
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.colorSpace = THREE.SRGBColorSpace;
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            resolve(videoTexture);
          }).catch(reject);
        };
        
        video.onerror = () => {
          reject(new Error('Failed to load video'));
        };
        
        video.src = url;
      } else {
        // Use standard texture loader for static images
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
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
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

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

  // Update materials based on settings
  useEffect(() => {
    if (!sceneRef.current) return;

    const { rimMat, faceMat } = sceneRef.current;

    if (currentSettings.fillMode === 'solid') {
      // Clear existing maps
      if (rimMat.map) rimMat.map.dispose();
      if (faceMat.map) faceMat.map.dispose();
      
      rimMat.map = null;
      faceMat.map = null;
      rimMat.color.set(currentSettings.bodyColor);
      faceMat.color.set(currentSettings.bodyColor);
    } else {
      // Apply gradient
      const faceTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd);
      const rimTexture = createGradientTexture(currentSettings.gradientStart, currentSettings.gradientEnd, true);
      
      faceMat.map = faceTexture;
      rimMat.map = rimTexture;
      faceMat.color.set(0xffffff);
      rimMat.color.set(0xffffff);
    }

    rimMat.metalness = faceMat.metalness = currentSettings.metallic ? 1 : 0;
    rimMat.needsUpdate = true;
    faceMat.needsUpdate = true;
  }, [currentSettings.fillMode, currentSettings.bodyColor, currentSettings.gradientStart, currentSettings.gradientEnd, currentSettings.metallic]);

  // Update lighting based on settings
  useEffect(() => {
    if (!sceneRef.current) return;

    const { hemiLight, dirLight } = sceneRef.current;
    const lightStrengthMap = {
      low: { hemi: 0.3, dir: 0.6 },
      medium: { hemi: 0.5, dir: 0.9 },
      strong: { hemi: 0.8, dir: 1.3 }
    };

    const strength = lightStrengthMap[currentSettings.lightStrength];
    hemiLight.intensity = strength.hemi;
    dirLight.intensity = strength.dir;
    
    hemiLight.color.set(currentSettings.lightColor);
    dirLight.color.set(currentSettings.lightColor);
  }, [currentSettings.lightColor, currentSettings.lightStrength]);

  // Apply overlay textures
  const applyOverlay = (url: string, isSecond = false) => {
    if (!sceneRef.current || !url) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = sceneRef.current!.renderer.capabilities.getMaxAnisotropy();
        
        if (currentSettings.dualOverlay && isSecond) {
          // Apply to bottom only
          const material = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          material.map = texture;
          material.opacity = 1;
          material.needsUpdate = true;
        } else if (currentSettings.dualOverlay && !isSecond) {
          // Apply to top only
          const material = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          material.map = texture;
          material.opacity = 1;
          material.needsUpdate = true;
        } else {
          // Apply to both faces
          const topMaterial = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          const botMaterial = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          
          topMaterial.map = texture;
          topMaterial.opacity = 1;
          topMaterial.needsUpdate = true;
          
          // Create mirrored version for bottom
          const botTexture = texture.clone();
          botTexture.wrapS = THREE.RepeatWrapping;
          botTexture.center.set(0.5, 0.5);
          botTexture.repeat.set(-1, 1);
          botTexture.offset.set(1, 0);
          botTexture.needsUpdate = true;
          
          botMaterial.map = botTexture;
          botMaterial.opacity = 1;
          botMaterial.needsUpdate = true;
        }
      },
      undefined,
      (error) => {
        console.error('Failed to load overlay texture:', error);
      }
    );
  };

  const clearOverlays = () => {
    if (!sceneRef.current) return;
    
    const topMaterial = sceneRef.current.overlayTop.material as THREE.MeshStandardMaterial;
    const botMaterial = sceneRef.current.overlayBot.material as THREE.MeshStandardMaterial;
    
    topMaterial.map = null;
    topMaterial.opacity = 0;
    topMaterial.needsUpdate = true;
    
    botMaterial.map = null;
    botMaterial.opacity = 0;
    botMaterial.needsUpdate = true;
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    
    if (currentSettings.overlayUrl) {
      applyOverlay(currentSettings.overlayUrl, false);
    } else {
      clearOverlays();
    }
    
    if (currentSettings.dualOverlay && currentSettings.overlayUrl2) {
      applyOverlay(currentSettings.overlayUrl2, true);
    }
  }, [currentSettings.overlayUrl, currentSettings.overlayUrl2, currentSettings.dualOverlay]);

  // Apply overlay textures (function available for future use)
  /*
  const applyOverlay = (url: string, isSecond = false) => {
    if (!sceneRef.current || !url) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      url,
      (texture: any) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = sceneRef.current!.renderer.capabilities.getMaxAnisotropy();
        
        if (settings.dualOverlay && isSecond) {
          // Apply to bottom only
          const material = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          material.map = texture;
          material.opacity = 1;
          material.needsUpdate = true;
        } else if (settings.dualOverlay && !isSecond) {
          // Apply to top only
          const material = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          material.map = texture;
          material.opacity = 1;
          material.needsUpdate = true;
        } else {
          // Apply to both faces
          const topMaterial = sceneRef.current!.overlayTop.material as THREE.MeshStandardMaterial;
          const botMaterial = sceneRef.current!.overlayBot.material as THREE.MeshStandardMaterial;
          
          topMaterial.map = texture;
          topMaterial.opacity = 1;
          topMaterial.needsUpdate = true;
          
          // Create mirrored version for bottom
          const botTexture = texture.clone();
          botTexture.wrapS = THREE.RepeatWrapping;
          botTexture.center.set(0.5, 0.5);
          botTexture.repeat.set(-1, 1);
          botTexture.offset.set(1, 0);
          botTexture.needsUpdate = true;
          
          botMaterial.map = botTexture;
          botMaterial.opacity = 1;
          botMaterial.needsUpdate = true;
        }
      },
      undefined,
      (error: any) => {
        console.error('Failed to load overlay texture:', error);
      }
    );
  };

  // Clear overlay textures (function available for future use)
  const clearOverlays = () => {
    if (!sceneRef.current) return;
    
    const topMaterial = sceneRef.current.overlayTop.material as THREE.MeshStandardMaterial;
    const botMaterial = sceneRef.current.overlayBot.material as THREE.MeshStandardMaterial;
    
    topMaterial.map = null;
    topMaterial.opacity = 0;
    topMaterial.needsUpdate = true;
    
    botMaterial.map = null;
    botMaterial.opacity = 0;
    botMaterial.needsUpdate = true;
  };
  */

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-2xl z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🪙</span>
              </div>
            </div>
            <p className="text-white/80 font-medium mb-2">Loading 3D Editor</p>
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white/60 text-sm mt-2">{Math.round(loadingProgress)}%</p>
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
};

export default CoinEditor;
