#!/usr/bin/env node

// Test script for the make-webm function
// This simulates the exact payload the client sends

const fs = require('fs').promises;
const path = require('path');

async function testWebMFunction() {
  console.log('🧪 Testing make-webm function...');
  
  try {
    // Create some dummy base64 WebP frames (1x1 pixel transparent WebP)
    const dummyWebP = 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAD8D+JaQAA3AAAAAA';
    
    const testPayload = {
      frames: [dummyWebP, dummyWebP, dummyWebP], // 3 frames
      framerate: 3,
      duration: 1.0
    };
    
    console.log('📤 Sending test payload:', {
      frames: testPayload.frames.length,
      framerate: testPayload.framerate,
      duration: testPayload.duration
    });
    
    const response = await fetch('http://localhost:8888/.netlify/functions/make-webm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Success response:', {
      success: result.success,
      size_bytes: result.size_bytes,
      frames_processed: result.frames_processed,
      framerate: result.framerate,
      duration: result.duration,
      webm_data_length: result.webm_base64?.length || 0
    });
    
    if (result.success && result.webm_base64) {
      // Save the WebM file for verification
      const webmBuffer = Buffer.from(result.webm_base64, 'base64');
      await fs.writeFile('test-output.webm', webmBuffer);
      console.log('💾 WebM saved as test-output.webm');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  testWebMFunction();
}

module.exports = { testWebMFunction };
