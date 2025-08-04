# Coinmoji - Telegram Mini App

**A production-grade Telegram Mini App for creating custom 3D animated coin emojis with native VP9 WebM encoding and full Telegram Bot API integration.**

## System Architecture Overview

### Core Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Three.js + Tailwind CSS
- **3D Engine**: Three.js with WebGL renderer, PBR materials, environment mapping
- **Video Processing**: Native FFmpeg 6.0 (Linux x64 static binary) + VP9 codec
- **Deployment**: Netlify serverless functions with 1GB RAM containers
- **Telegram Integration**: Full Bot API integration with WebApp SDK
- **File Processing**: fflate (ZIP), native Canvas API, WebP/WebM formats

### Project Structure

```
├── src/
│   ├── components/
│   │   ├── CoinEditor.tsx          # Main 3D editor with Three.js scene
│   │   ├── SettingsPanel.tsx       # Mobile-first settings UI  
│   │   └── NotInTelegram.tsx       # Landing page for non-Telegram access
│   ├── providers/
│   │   └── TelegramProvider.tsx    # Telegram WebApp SDK integration
│   ├── utils/
│   │   ├── exporter.ts            # Frame capture & WebM export logic
│   │   └── exporter-clean.ts      # Alternative exporter implementation
│   └── App.tsx                    # Main app with environment detection
├── netlify/functions/
│   ├── make-webm/
│   │   ├── make-webm.ts           # Native FFmpeg WebM creation
│   │   └── ffmpeg                 # Bundled 75MB static binary
│   ├── create-emoji.ts            # Telegram emoji/sticker creation
│   ├── send-file.ts               # File sending via Telegram
│   ├── send-message.ts            # Message sending via Telegram
│   └── utils/telegram-auth.ts     # Telegram WebApp data verification
├── scripts/
│   └── bundle-ffmpeg.sh           # FFmpeg binary bundling automation
└── netlify.toml                   # Deployment & function configuration
```

## Core Functionality Flow

### 3D Coin Generation Pipeline

**1. Three.js Scene Setup (CoinEditor.tsx)**
- **Coin Geometry**: Cylinder (rim) + 2x Hemisphere (faces) with bulge scaling
- **Materials**: PBR with metallic/roughness workflow, environment mapping
- **Overlays**: Transparent mesh layers for custom textures/images
- **Animation**: Real-time rotation with configurable speed (0.01-0.035 rad/frame)
- **Lighting**: Hemisphere + Directional lights with HDR environment map

**2. Frame Capture System (exporter.ts)**
- **Resolution Pipeline**: 512x512 → 100x100 downscaling for optimization
- **Format**: WebP with alpha transparency preservation
- **Timing**: Fixed 3-second duration, 30fps (90 frames total)
- **Memory Management**: Immediate frame disposal, garbage collection triggers

**3. WebM Video Encoding (make-webm.ts)**
- **Codec**: VP9 with yuva420p pixel format (alpha channel support)
- **Settings**: CRF 30, good deadline, single-threaded for serverless
- **Binary**: Static FFmpeg 6.0 (75MB) with download fallback
- **Performance**: 0.75s processing time (cached binary), 2.9s (first-time download)

### Telegram Integration Architecture

**1. Authentication Flow**
- **WebApp SDK**: Real-time initData extraction and user context
- **HMAC Verification**: Cryptographic validation using bot token
- **User Extraction**: ID, username, language from verified initData

**2. Emoji Creation Pipeline**
- **File Upload**: Binary WebM → Telegram uploadStickerFile API
- **Sticker Set**: Creates/updates custom emoji sticker sets
- **Set Naming**: Auto-slugification with bot username suffix
- **Response Handling**: Success messages with embedded emoji links

**3. File Distribution System**
- **In-Telegram**: Direct file sending via sendDocument API
- **External Access**: Direct download with fallback handling
- **Message Integration**: HTML-formatted success messages with action links

## Current Technical Performance

### WebM Output Specifications
- **File Size**: ~22-30KB (significant room for 64KB Telegram limit)
- **Resolution**: 100x100px (Telegram emoji standard)
- **Duration**: 3 seconds fixed (Telegram emoji limit)
- **Quality**: VP9 encoding with alpha transparency
- **Compression**: 55% muxing overhead (room for optimization)

### Serverless Function Performance
- **Cold Start**: ~2.9s (includes FFmpeg download)
- **Warm Execution**: ~0.75s (4x performance improvement)
- **Memory Usage**: 441-451MB (within 1GB limit)
- **Binary Caching**: /tmp persistence across warm invocations

### 3D Rendering Capabilities
- **Real-time Animation**: 60fps viewport with configurable rotation
- **Texture Support**: Static images, animated GIFs, WebM videos
- **Material System**: Solid colors, gradients, custom textures
- **Overlay System**: Dual-layer support with proper UV mapping
- **Quality**: Anti-aliasing, environment reflections, PBR materials

## Development & Deployment

### Environment Configuration
```bash
# Required Environment Variables
TELEGRAM_BOT_TOKEN=        # From @BotFather
BOT_USERNAME=              # Bot username (without @)
NETLIFY_SITE_URL=          # For internal API calls
NODE_ENV=production        # Environment setting
```

### Build Process
```bash
# Automated build pipeline
1. npm ci                      # Clean dependency install
2. ./scripts/bundle-ffmpeg.sh  # Download 75MB FFmpeg binary
3. npm run build               # Vite production build with optimization
4. Deploy to Netlify           # Serverless functions + static assets
```

### Local Development Setup
```bash
npm install
npm run dev                # Vite dev server
# Note: Telegram features require tunnel (ngrok) for WebApp testing
```

## Known Technical Limitations & Issues

### Current Quality Problems
1. **GIF Animation Sync**: Fast coin rotation doesn't match GIF overlay framerates (GIFs have their own framerates)
2. **Frame Timing**: Fixed 3s duration ignores overlay animation timing (The 3 rotation speed setting is applied in render to offer longer animation space)
3. **Quality vs Size**: Only using 22KB of 64KB limit (66% underutilized - must be kept under 64KB)
4. **Compression**: Sub-optimal VP9 settings for emoji use case
5. **Overlay Desync**: Coin rotation has 3 custom speeds, GIF overlays have their own framerates, leading to desynchronization
6. **WebM Quality**: Metallic surfaces show compression artifacts (We want to eliminate these artifacts and produce high-quality metallic surfaces)

### WebM Generation Issues
- **Overlay Desync**: Spinning coin at fixed speed to capture frames while GIF Overlays may play at different rate, resulting in different outcome from the preview simulation.
- **Frame Capture**: No synchronization with animated texture/overlay framerates - Capturing simulation rotation needs to have the same duration as the simulation rotation.
- **Quality Loss**: Conservative encoding settings vs available bitrate budget - We are not using the full 64KB limit, so we can improve quality.

## Next Phase Development Plan

### Phase 1: Intelligent Frame Synchronization
**Objective**: Sync coin rotation with overlay animation framerates - The user designs the coin with a real-time preview, so when we record the frames, we need to ensure that the capturing of the coin rotation duration matches the preview rotation duration.

**Technical Requirements**:
1. **Dynamic Timing**: Adjust coin frame capture rotation speed to match preview rotation speed (we capture the same visual as the preview)
2. **Framerate**: Try to record a high framerate (max 60fps) based on predicted final size, decrease framerate if predicted final result is too large (over 64KB)

**Implementation Strategy**:
- Dynamic rotation speed calculation, the preview rotation speed is set by the user, so we need to capture the coin in the same speed.
- WebM duration optimization: If a full 360 rotation webm result is longer than 3 seconds, speed it up to fit the 3-second limit.

### Phase 2: Quality Optimization & Compression
**Objective**: Maximize quality within 64KB limit, ensure metallic surfaces are artifact-free, and optimize VP9 encoding settings to produce high quality WebM files.
**Notes**: The phase 1 improvements will help us understand the final size better, so we can optimize the VP9 encoding settings accordingly. Phase 2 will need to be adjusted based on Phase 1 findings.

**Technical Improvements**:
1. **VP9 Optimization**: Two-pass encoding - make sure the 512px to 100px WebP downscale is lossless, and the 100px WebP to WebM stacking is losing the minimum to fit the 64KB final cap - + variable bitrate targeting
2. **Advanced Encoding**: Custom VP9 parameters for coin animation characteristics, to ensure high quality metallic surfaces
3. **Compression Analysis**: Analyze current 55% overhead reduction opportunities (this may be more after the first phase is done, as we will have a better understanding of the final size)

**Target Metrics**:
- **File Size**: 45-63KB (utilizing 70-99% of limit)
- **Quality**: Eliminate compression artifacts in metallic/glowing surfaces

## Codebase Health & Maintenance

### Technical Debt
- **Multiple Exporters**: Consolidate exporter.ts and exporter-clean.ts - use exporter.ts as the main one, and remove exporter-clean.ts
- **Hardcoded Values**: Extract rotation speeds, timing constants, and other magic numbers to configuration files
- **Error Handling**: Improve fallback chains and user feedback, especially for Telegram API interactions

### Security Considerations
- **Private Repository**: Prevent code exposure, naked endpoints and bot token leaks
- **Input Validation**: Sanitize all user URLs and texture inputs

---

**Internal Use Only** - This documentation contains proprietary technical details and deployment configurations. Do not share externally.
