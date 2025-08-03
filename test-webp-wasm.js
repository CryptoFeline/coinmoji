// Test webp-wasm
import WebP from 'webp-wasm';

console.log('WebP-WASM type:', typeof WebP);
console.log('WebP-WASM structure:', WebP);

try {
  if (typeof WebP === 'function') {
    const webp = new WebP();
    console.log('WebP instance:', webp);
    console.log('WebP methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(webp)));
  } else if (WebP.encode || WebP.decode) {
    console.log('WebP has encode/decode methods');
    console.log('Available methods:', Object.keys(WebP));
  } else {
    console.log('Exploring WebP object...');
    console.log('Keys:', Object.keys(WebP));
    console.log('Properties:', Object.getOwnPropertyNames(WebP));
  }
} catch (error) {
  console.error('Error testing webp-wasm:', error);
}
