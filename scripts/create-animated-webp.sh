#!/bin/bash
# Local animated WebP creation script for Coinmoji frames
# 
# This script demonstrates how to create transparent animated WebP
# from the exported frames using ImageMagick locally.
#
# Prerequisites:
# - ImageMagick with WebP support: brew install imagemagick
# - Exported frames from Coinmoji (ZIP file extracted)
#
# Usage:
# 1. Export frames from Coinmoji and download ZIP
# 2. Extract ZIP to a folder with WebP frames (frame0000.webp, frame0001.webp, etc.)
# 3. Run this script in that folder
# 4. Get perfect transparent animated WebP!

set -e

echo "🎬 Creating animated WebP from Coinmoji frames..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "❌ ImageMagick not found. Install with: brew install imagemagick"
    exit 1
fi

# Check if WebP frames exist
if ! ls frame*.webp &> /dev/null; then
    echo "❌ No WebP frames found. Extract Coinmoji ZIP file here first."
    echo "Expected files: frame0000.webp, frame0001.webp, etc."
    exit 1
fi

# Count frames
FRAME_COUNT=$(ls frame*.webp | wc -l | tr -d ' ')
echo "📸 Found $FRAME_COUNT WebP frames"

# Create animated WebP with transparency
echo "🔧 Creating animated WebP with ImageMagick..."
magick \
    -delay 10 \
    frame*.webp \
    -loop 0 \
    -background transparent \
    coinmoji-animated.webp

# Check result
if [ -f "coinmoji-animated.webp" ]; then
    FILE_SIZE=$(du -h coinmoji-animated.webp | cut -f1)
    echo "✅ Success! Created coinmoji-animated.webp ($FILE_SIZE)"
    echo "🎯 Transparent animated WebP ready for use!"
else
    echo "❌ Failed to create animated WebP"
    exit 1
fi
