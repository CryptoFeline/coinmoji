import * as THREE from 'three';

/**
 * A shader material that creates a glow effect by reading from textures or solid colors.
 * Uses additive blending and fresnel-based rim lighting for realistic glow appearance.
 * Optimized for geometry-based glow shells without requiring postprocessing.
 */
export class GlowMapMaterial extends THREE.ShaderMaterial {
  constructor(params: {
    map?: THREE.Texture | null;
    color?: THREE.Color | number | string;
    intensity?: number;       // overall alpha multiplier
    threshold?: number;       // only glow "bright" parts of the map (0-1 range)
    sharpness?: number;       // rim sharpness control
  } = {}) {
    super({
      uniforms: {
        glowColor: { value: new THREE.Color(params.color ?? 0xffffff) },
        map:       { value: params.map ?? null },
        useMap:    { value: !!params.map },
        intensity: { value: params.intensity ?? 1.0 },
        threshold: { value: params.threshold ?? 0.70 }, // 0..1 (sRGB-ish)
        sharpness: { value: params.sharpness ?? 0.5 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3  glowColor;
        uniform sampler2D map;
        uniform bool  useMap;
        uniform float intensity;
        uniform float threshold;
        uniform float sharpness;

        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        varying vec2 vUv;

        void main() {
          // Get base color from texture or uniform
          vec3 base = useMap ? texture2D(map, vUv).rgb : glowColor;
          
          // Brightness gate - only bright parts of the texture glow
          float luma = dot(base, vec3(0.2126, 0.7152, 0.0722));
          float gate = smoothstep(threshold, 1.0, luma);

          // Fresnel-like rim effect
          vec3 V = normalize(cameraPosition - vWorldPos);
          float rim = pow(1.0 - max(dot(normalize(vWorldNormal), V), 0.0),
                          1.0 + sharpness * 5.0);

          // Combine rim and brightness gate
          float a = clamp(rim * gate * intensity, 0.0, 1.0);
          gl_FragColor = vec4(base, a);

          // Apply tone mapping to match main renderer
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    });
  }

  /**
   * Update the glow material with new texture and color settings
   */
  updateGlowSource(map: THREE.Texture | null, color: THREE.Color) {
    this.uniforms.map.value = map;
    this.uniforms.useMap.value = !!map;
    this.uniforms.glowColor.value.copy(color);
    this.needsUpdate = true;
  }

  /**
   * Set glow parameters
   */
  setGlowParams(intensity: number, threshold: number, sharpness: number) {
    this.uniforms.intensity.value = intensity;
    this.uniforms.threshold.value = threshold;
    this.uniforms.sharpness.value = sharpness;
    this.needsUpdate = true;
  }
}

export default GlowMapMaterial;
