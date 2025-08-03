// Test webp-converter
import webp from 'webp-converter';

console.log('webp-converter structure:', webp);
console.log('Available methods:', Object.keys(webp));

// Check webpmux_animate specifically
if (webp.webpmux_animate) {
  console.log('✓ webpmux_animate method available:', typeof webp.webpmux_animate);
  
  // Let's check what parameters it expects
  console.log('webpmux_animate function:', webp.webpmux_animate.toString().substring(0, 200));
}

console.log('Testing...');
