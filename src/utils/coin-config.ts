// Configuration constants for coin animation and export
// This centralizes all the magic numbers mentioned in technical debt

export const COIN_CONFIG = {
  // Rotation speeds (radians per frame at 60fps - same as CoinEditor)
  ROTATION_SPEEDS: {
    slow: 0.01,
    medium: 0.02,
    fast: 0.035,
  },
  
  // Export timing constraints
  EXPORT: {
    // Telegram emoji constraints
    MAX_DURATION_SECONDS: 3,
    MAX_FILE_SIZE_BYTES: 64 * 1024, // 64KB
    
    // Frame capture settings
    CAPTURE_SIZE_PIXELS: 512, // High-res capture before downscaling
    OUTPUT_SIZE_PIXELS: 100,  // Final emoji size
    
    // Framerate optimization
    MIN_FPS: 15,   // Minimum acceptable framerate
    MAX_FPS: 60,   // Maximum framerate for quality
    TARGET_FPS: 30, // Default/preferred framerate
    
    // Frame limits for memory management
    MAX_FRAMES: 180, // 60fps * 3s = 180 max frames
    
    // Rotation timing
    FULL_ROTATION_RADIANS: Math.PI * 2, // 360 degrees
  },
  
  // Preview animation (60fps assumed)
  PREVIEW: {
    TARGET_FPS: 60,
  },
  
  // Quality thresholds for dynamic adjustment
  QUALITY: {
    // Size prediction thresholds (estimated bytes per frame)
    BYTES_PER_FRAME_ESTIMATE: 350, // Conservative estimate for 100x100 WebP
    SIZE_SAFETY_MARGIN: 0.85, // Use 85% of limit for safety
  }
} as const;

// Helper function to calculate optimal export settings based on user preferences
export function calculateOptimalExportSettings(
  userRotationSpeed: 'slow' | 'medium' | 'fast',
  preferredFps: number = COIN_CONFIG.EXPORT.TARGET_FPS
): {
  fps: number;
  duration: number;
  totalFrames: number;
  rotationPerFrame: number;
  rotationSpeedMultiplier: number;
  estimatedFileSize: number;
} {
  const rotationSpeed = COIN_CONFIG.ROTATION_SPEEDS[userRotationSpeed];
  
  // Calculate how long it takes for one full rotation at user's preferred speed
  const timeFor360AtPreviewFps = COIN_CONFIG.EXPORT.FULL_ROTATION_RADIANS / rotationSpeed;
  const timeFor360InSeconds = timeFor360AtPreviewFps / COIN_CONFIG.PREVIEW.TARGET_FPS;
  
  // Determine the optimal duration and framerate
  let duration = Math.min(timeFor360InSeconds, COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS);
  let fps = preferredFps;
  
  // If the natural rotation time is longer than 3s, we'll speed up the playback
  // to fit within Telegram's 3-second limit
  if (timeFor360InSeconds > COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS) {
    duration = COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS;
    // The rotation will be sped up to fit in 3 seconds
  }
  
  let totalFrames = Math.floor(fps * duration);
  
  // Estimate file size and adjust framerate if needed
  let estimatedFileSize = totalFrames * COIN_CONFIG.QUALITY.BYTES_PER_FRAME_ESTIMATE;
  const maxAllowedSize = COIN_CONFIG.EXPORT.MAX_FILE_SIZE_BYTES * COIN_CONFIG.QUALITY.SIZE_SAFETY_MARGIN;
  
  // Reduce framerate if estimated size is too large
  while (estimatedFileSize > maxAllowedSize && fps > COIN_CONFIG.EXPORT.MIN_FPS) {
    fps = Math.max(fps - 5, COIN_CONFIG.EXPORT.MIN_FPS);
    totalFrames = Math.floor(fps * duration);
    estimatedFileSize = totalFrames * COIN_CONFIG.QUALITY.BYTES_PER_FRAME_ESTIMATE;
  }
  
  // Limit total frames for memory management
  if (totalFrames > COIN_CONFIG.EXPORT.MAX_FRAMES) {
    totalFrames = COIN_CONFIG.EXPORT.MAX_FRAMES;
    fps = totalFrames / duration;
  }
  
  // Calculate rotation per frame to match the user's preview experience
  // This ensures the export looks the same as what the user sees
  const rotationPerFrame = COIN_CONFIG.EXPORT.FULL_ROTATION_RADIANS / totalFrames;
  
  // Calculate speed multiplier for cases where we need to fit rotation in 3s
  const rotationSpeedMultiplier = timeFor360InSeconds > COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS 
    ? timeFor360InSeconds / COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS 
    : 1.0;
  
  return {
    fps: Math.round(fps),
    duration,
    totalFrames,
    rotationPerFrame,
    rotationSpeedMultiplier,
    estimatedFileSize
  };
}

// Helper to validate export settings
export function validateExportSettings(settings: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!settings.fps || settings.fps < COIN_CONFIG.EXPORT.MIN_FPS || settings.fps > COIN_CONFIG.EXPORT.MAX_FPS) {
    errors.push(`FPS must be between ${COIN_CONFIG.EXPORT.MIN_FPS} and ${COIN_CONFIG.EXPORT.MAX_FPS}`);
  }
  
  if (!settings.duration || settings.duration <= 0 || settings.duration > COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS) {
    errors.push(`Duration must be between 0 and ${COIN_CONFIG.EXPORT.MAX_DURATION_SECONDS} seconds`);
  }
  
  const totalFrames = Math.floor(settings.fps * settings.duration);
  if (totalFrames > COIN_CONFIG.EXPORT.MAX_FRAMES) {
    errors.push(`Total frames (${totalFrames}) exceeds maximum (${COIN_CONFIG.EXPORT.MAX_FRAMES})`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
