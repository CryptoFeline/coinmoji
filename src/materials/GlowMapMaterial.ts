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
        threshold: { value: params.threshold ?? 0.0 }, // Changed default to 0
        sharpness: { value: params.sharpness ?? 0.5 },
      },
      transparent: true,
      depthTest: true,        // Always enabled to prevent transparency issues
      depthWrite: false,      // Don't write to depth buffer to allow proper layering
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,  // FIXED: Use FrontSide for proper outward glow
      alphaTest: 0.01,        // Discard nearly transparent pixels
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

        // Improved edge detection function
        float getEdgeStrength(vec2 uv) {
          if (!useMap) return 1.0;
          
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec3 center = texture2D(map, uv).rgb;
          
          // Sample neighboring pixels for edge detection
          vec3 right = texture2D(map, uv + vec2(texelSize.x, 0.0)).rgb;
          vec3 left = texture2D(map, uv - vec2(texelSize.x, 0.0)).rgb;
          vec3 up = texture2D(map, uv + vec2(0.0, texelSize.y)).rgb;
          vec3 down = texture2D(map, uv - vec2(0.0, texelSize.y)).rgb;
          
          // Calculate gradient magnitude
          vec3 gradX = right - left;
          vec3 gradY = up - down;
          float grad = length(gradX) + length(gradY);
          
          return smoothstep(0.1, 0.5, grad);
        }

        void main() {
          // Get base color from texture or uniform
          vec3 base = useMap ? texture2D(map, vUv).rgb : glowColor;
          
          // Enhanced brightness gate with perceptual weighting
          float luma = dot(base, vec3(0.299, 0.587, 0.114)); // More accurate perceptual weights
          float brightGate = smoothstep(threshold * 0.8, threshold + 0.2, luma);
          
          // Edge detection for texture detail enhancement
          float edgeStrength = getEdgeStrength(vUv);
          
          // Improved multi-layer fresnel calculation
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 N = normalize(vWorldNormal);
          
          // Fixed fresnel for FrontSide outward glow (removed abs())
          float NdotV = dot(N, V);
          float fresnel1 = 1.0 - max(0.2, NdotV); // FIXED: Use 0.2 minimum to prevent dead spots at side angles
          float rim1 = pow(fresnel1, 0.3 + sharpness * 1.5);
          
          // Secondary fresnel for edge enhancement
          float fresnel2 = 1.0 - pow(max(0.15, NdotV), 0.5); // Also use minimum to maintain consistent glow
          float rim2 = pow(fresnel2, 1.0 + sharpness * 2.0);
          
          // Combine multiple glow components
          float primaryGlow = rim1 * brightGate;
          float edgeGlow = rim2 * edgeStrength * 0.6;
          float combinedGlow = primaryGlow + edgeGlow;
          
          // Apply intensity with improved falloff
          float glowStrength = combinedGlow * intensity;
          float alpha = smoothstep(0.0, 1.2, glowStrength);
          
          // Enhanced color mixing with saturation boost for bright areas
          vec3 finalColor = base * (1.0 + alpha * 0.5);
          if (brightGate > 0.5) {
            // Boost saturation for bright glowing areas
            float satBoost = (brightGate - 0.5) * 0.4;
            vec3 gray = vec3(luma);
            finalColor = mix(finalColor, finalColor + (finalColor - gray) * satBoost, satBoost);
          }
          
          gl_FragColor = vec4(finalColor, alpha * 0.9);

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
