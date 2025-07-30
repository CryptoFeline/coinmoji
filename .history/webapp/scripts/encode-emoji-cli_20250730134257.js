#!/usr/bin/env node

/**
 * CLI tool to encode PNG frames to Telegram Custom Emoji WebM
 * 
 * Usage:
 *   node encode-emoji-cli.js --input "frames/frame_%04d.png" --fps 24 --output coin.webm
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function getArg(name, defaultValue) {
  const index = process.argv.indexOf(name);
  return index > -1 && process.argv[index + 1] ? process.argv[index + 1] : defaultValue;
}

const inputPattern = getArg('--input') || getArg('-i');
const fps = parseInt(getArg('--fps') || getArg('-f', '24'), 10);
const output = getArg('--output') || getArg('-o', 'emoji.webm');
const crf = getArg('--crf', '32');
const bitrate = getArg('--bitrate') || getArg('-b');

if (!inputPattern) {
  console.error('❌ Error: Missing input pattern');
  console.log('Usage: node encode-emoji-cli.js --input "frames/frame_%04d.png" --fps 24 --output coin.webm');
  process.exit(1);
}

if (fps > 30) {
  console.error('❌ Error: FPS must be ≤30 for Telegram custom emoji');
  process.exit(1);
}

console.log('🎬 Encoding emoji WebM...');
console.log(`   Input: ${inputPattern}`);
console.log(`   FPS: ${fps}`);
console.log(`   Output: ${output}`);

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args, { stdio: 'inherit' });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg: ${err.message}`));
    });
  });
}

async function encode() {
  try {
    if (bitrate) {
      // Two-pass encoding for size control
      console.log('🔄 Pass 1/2...');
      await runFFmpeg([
        '-y',
        '-framerate', String(fps),
        '-i', inputPattern,
        '-vf', 'scale=100:100:flags=lanczos',
        '-an',
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-b:v', bitrate,
        '-pass', '1',
        '-f', 'webm',
        '/dev/null'
      ]);
      
      console.log('🔄 Pass 2/2...');
      await runFFmpeg([
        '-framerate', String(fps),
        '-i', inputPattern,
        '-vf', 'scale=100:100:flags=lanczos',
        '-an',
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-b:v', bitrate,
        '-pass', '2',
        output
      ]);
    } else {
      // Single-pass CRF encoding
      console.log('🔄 Encoding...');
      await runFFmpeg([
        '-y',
        '-framerate', String(fps),
        '-i', inputPattern,
        '-vf', 'scale=100:100:flags=lanczos',
        '-an',
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p',
        '-b:v', '0',
        '-crf', crf,
        output
      ]);
    }
    
    // Check file size
    const stats = fs.statSync(output);
    const sizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ Encoded successfully!`);
    console.log(`   File: ${output}`);
    console.log(`   Size: ${sizeKB} KB`);
    
    if (sizeKB > 256) {
      console.log('⚠️  Warning: File size exceeds 256 KB limit for Telegram custom emoji');
      console.log('   Try reducing FPS, duration, or using a higher CRF value');
    } else {
      console.log('✅ File size is within Telegram limits');
    }
    
  } catch (error) {
    console.error('❌ Encoding failed:', error.message);
    process.exit(1);
  }
}

encode();
