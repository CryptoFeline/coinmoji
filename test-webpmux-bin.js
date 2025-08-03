// Test webpmux-bin
import { execSync } from 'child_process';

try {
  // Try to find webpmux via webpmux-bin
  const webpmuxBin = await import('webpmux-bin');
  console.log('webpmux-bin structure:', webpmuxBin);
  console.log('webpmux-bin keys:', Object.keys(webpmuxBin));
  
  // Try different exports
  if (webpmuxBin.default) {
    console.log('default export:', webpmuxBin.default);
  } else {
    console.log('No default export, checking named exports...');
    console.log('webpmuxBin directly:', webpmuxBin);
  }
  
} catch (error) {
  console.error('Error with webpmux-bin:', error);
}
