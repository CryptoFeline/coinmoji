#!/bin/bash

# Download FFmpeg binary for bundling with Netlify function
echo "📦 Downloading FFmpeg static binary for function bundling..."

# Create the function directory if it doesn't exist
mkdir -p netlify/functions/make-webm

# Download the FFmpeg binary
echo "🌐 Downloading FFmpeg 6.0 Linux x64 static binary..."
curl -L -o netlify/functions/make-webm/ffmpeg https://github.com/eugeneware/ffmpeg-static/releases/download/b6.0/ffmpeg-linux-x64

# Make it executable
chmod +x netlify/functions/make-webm/ffmpeg

echo "✅ FFmpeg binary downloaded and bundled for deployment"
echo "📊 Binary size: $(du -h netlify/functions/make-webm/ffmpeg | cut -f1)"
echo "🎯 Ready for production deployment with bundled FFmpeg"
