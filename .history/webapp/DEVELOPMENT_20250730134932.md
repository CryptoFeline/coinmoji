# Coinmoji Development & Testing Guide

This guide helps you set up, test, and deploy the Coinmoji webapp.

## Quick Start

### 1. Setup Environment

```bash
cd webapp
npm install
cp .env.example .env
# Edit .env with your Telegram bot credentials
```

### 2. Test Visually (Outside Telegram)

Since the app is designed to only work in Telegram, we've included a development mode for testing visuals:

```bash
# This will show the app interface even outside Telegram
npm run dev
```

Visit http://localhost:3000 - you should see the full Coinmoji interface with:
- ✅ 3D coin editor with spinning animation
- ✅ Settings panel with mobile-friendly drawer
- ✅ Apple-style design with proper spacing and typography
- ✅ Responsive layout optimized for mobile

### 3. Test in Telegram

To test the full Telegram integration:

1. **Set up ngrok or similar tunnel:**
   ```bash
   npx ngrok http 3000
   ```

2. **Configure your Telegram bot:**
   - Go to @BotFather
   - Use `/setmenubutton` to set your ngrok URL
   - Test the WebApp in Telegram

## Development Workflow

### Code Structure

```
src/
├── components/
│   ├── CoinEditor.tsx      # Three.js 3D coin editor
│   ├── SettingsPanel.tsx   # Mobile settings drawer
│   └── NotInTelegram.tsx   # 404-style page for non-Telegram access
├── providers/
│   └── TelegramProvider.tsx # Telegram WebApp integration
├── utils/
│   └── exporter.ts         # WebM export utilities
└── types/
    └── telegram.d.ts       # Telegram WebApp type definitions
```

### Key Features Implemented

#### 🪙 3D Coin Editor
- Three.js-based 3D coin with realistic materials
- Configurable body colors (solid/gradient)
- Metallic finish toggle
- Variable rotation speeds
- Overlay image support
- Proper UV mapping for undistorted textures

#### 📱 Mobile-First UI
- iOS-style design system with custom Tailwind config
- Touch-friendly interactions with proper tap targets
- Slide-up settings panel with backdrop
- Responsive typography and spacing
- Safe area handling for iOS devices

#### 🔒 Telegram Integration
- WebApp SDK integration with proper type definitions
- initData verification for security
- User context and authentication
- Proper error handling for non-Telegram environments

#### ⚡ Export System
- PNG frame capture from Three.js scene
- ZIP compression for frame sequences
- WebM encoding pipeline ready for serverless
- Telegram-compliant emoji specifications

### Testing Checklist

#### Visual Testing (Local)
- [ ] App loads without errors at http://localhost:3000
- [ ] 3D coin renders and animates smoothly
- [ ] Settings panel slides up from bottom
- [ ] All UI elements are touch-friendly (≥44px tap targets)
- [ ] Typography is clear and readable on mobile
- [ ] Colors match the Apple/iOS design aesthetic
- [ ] Animations are smooth and performant

#### Responsive Testing
- [ ] Test on iPhone viewport (375x812)
- [ ] Test on Android viewport (360x640)
- [ ] Test landscape orientation
- [ ] Test with iOS safe areas
- [ ] Verify backdrop-blur effects work

#### Functionality Testing
- [ ] Settings persist when panel is closed/reopened
- [ ] Color pickers work correctly
- [ ] Radio buttons for speed/fill mode work
- [ ] Toggle switches for metallic/dual overlay work
- [ ] URL inputs for overlay images are functional

## Production Deployment

### Netlify Setup

1. **Connect Repository:**
   - Link your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables:**
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   BOT_USERNAME=your_bot_username
   NODE_ENV=production
   ```

3. **Function Configuration:**
   - Functions directory: `netlify/functions`
   - Node.js version: 18+

### Bot Configuration

1. **Create Bot:**
   ```
   /newbot
   Your Bot Name
   your_bot_username_bot
   ```

2. **Set Commands:**
   ```
   /setcommands
   start - Create custom emoji from 3D coins
   ```

3. **Set Menu Button:**
   ```
   /setmenubutton
   @your_bot_username_bot
   {
     "type": "web_app",
     "text": "Open Coinmoji",
     "web_app": {
       "url": "https://your-site.netlify.app"
     }
   }
   ```

### Security Considerations

- ✅ Telegram WebApp data verification (HMAC-SHA256)
- ✅ User authentication via initData
- ✅ CORS protection with proper headers
- ✅ Input validation for all user data
- ✅ Rate limiting considerations for API endpoints

## Performance Optimization

### Current Optimizations
- Three.js scene optimization with proper disposal
- Texture compression and reuse
- Code splitting with Vite
- Asset optimization for mobile
- Memory management for long-running sessions

### Bundle Analysis
```bash
npm run build
# Check dist/assets/ for bundle sizes
# Main bundle should be <1MB gzipped
```

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all TypeScript types are properly imported
- Check for unused variables (comment out for development)
- Verify Three.js version compatibility

**3D Rendering Issues:**
- Check WebGL support in target browsers
- Verify texture loading with CORS headers
- Monitor console for Three.js warnings

**Telegram Integration:**
- Verify bot token and username are correct
- Check initData format and verification
- Test webhook endpoints with proper SSL

**Mobile Performance:**
- Monitor frame rates on older devices
- Test with reduced quality settings
- Check memory usage during long sessions

## Advanced Features (Future)

- [ ] Video texture support for animated overlays
- [ ] Advanced lighting controls
- [ ] Custom coin shapes and geometries
- [ ] Batch export functionality
- [ ] Real-time collaboration features
- [ ] Crypto payment integration

## Support

For development questions or issues:
1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Test in multiple browsers/devices
4. Review Telegram WebApp documentation
5. Check Three.js documentation for 3D issues
