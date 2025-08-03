// Quick test of node-webpmux API
import WebP from 'node-webpmux';

console.log('Testing WebP.Image animation features...');

try {
  const webp = new WebP.Image();
  console.log('WebP.Image instance created:', webp);
  
  // Check animation-related methods
  console.log('hasAnim method:', typeof webp.hasAnim);
  console.log('anim property:', webp.anim);
  console.log('frames method:', typeof webp.frames);
  console.log('convertToAnim method:', typeof webp.convertToAnim);
  console.log('replaceFrame method:', typeof webp.replaceFrame);
  console.log('setFrameData method:', typeof webp.setFrameData);
  
  // Try to check anim property
  console.log('Current anim value:', webp.anim);
  
  // Try convertToAnim
  if (typeof webp.convertToAnim === 'function') {
    console.log('Trying convertToAnim...');
    try {
      webp.convertToAnim();
      console.log('convertToAnim succeeded');
      console.log('anim after conversion:', webp.anim);
    } catch (animError) {
      console.log('convertToAnim failed:', animError.message);
    }
  }
  
} catch (error) {
  console.error('Error testing animation features:', error);
}
