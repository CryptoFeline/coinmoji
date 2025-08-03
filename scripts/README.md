# Coinmoji Animation Scripts

This directory contains helper scripts for creating animated WebP files from Coinmoji frame exports.

## Scripts

### `create-animated-webp.sh`
Creates transparent animated WebP from exported Coinmoji frames using ImageMagick.

**Prerequisites:**
- ImageMagick with WebP support: `brew install imagemagick`
- Exported frames ZIP from Coinmoji

**Usage:**
1. Export frames from Coinmoji webapp and download the ZIP
2. Extract ZIP to get individual WebP frames 
3. Run script in the extracted frames directory:
   ```bash
   ./create-animated-webp.sh
   ```
4. Get `coinmoji-animated.webp` with perfect transparency!

**Alternative Tools:**

- **EZGIF.com**: Web-based, no installation required
  - Upload frames to https://ezgif.com/webp-maker
  - Set delay to 100ms (for 3 second animation with 30 frames)
  - Enable transparency options
  - Download result

- **FFmpeg**: For advanced users
  ```bash
  ffmpeg -i frame%04d.webp -c:v libwebp -lossless 0 -compression_level 6 -q:v 80 -loop 0 animation.webp
  ```

## Why These Scripts Exist

Serverless environments (like Netlify Functions) have limitations with system tools like ImageMagick and webpmux. These scripts provide local alternatives that give you full control and perfect results.

The Coinmoji webapp focuses on what it does best: creating perfect transparent frame sequences. These scripts handle the animation assembly step with professional-grade tools.
