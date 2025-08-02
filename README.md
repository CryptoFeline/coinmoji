# Coinmoji WebApp

A modern, mobile-first React application for creating custom emoji from 3D coin designs. Built specifically for Telegram Mini Apps with a clean design.

## Features

- 🪙 **3D Coin Editor**: Interactive Three.js-based coin designer
- 🎨 **Customization Options**: 
  - Solid colors and gradients
  - Metallic finishes
  - Custom overlay images
  - Adjustable rotation speeds
  - Dynamic lighting
- 📱 **Mobile-First Design**: Optimized for mobile devices with iOS-style UI
- 🚀 **Telegram Integration**: Only works within Telegram WebApp environment
- ⚡ **WebM Export**: Exports VP9 WebM files compliant with Telegram's custom emoji specs
- 🎯 **Custom Emoji Creation**: Direct integration with Telegram's sticker API

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Build**: Vite with optimized production builds
- **Deployment**: Netlify with serverless functions
- **File Processing**: fflate for ZIP compression

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Telegram Bot Token (from @BotFather)

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd webapp
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your Telegram bot credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - For testing: http://localhost:3000 (will show "Not in Telegram" page)
   - For Telegram testing: Set up ngrok or similar tunnel and configure webhook

### Testing Outside Telegram

To test the visual design outside Telegram environment, you can temporarily modify the `TelegramProvider.tsx` to force `isInTelegram: true` for development.

## Deployment

### Netlify Deployment

1. **Connect repository to Netlify**
2. **Set environment variables in Netlify dashboard:**
   - `TELEGRAM_BOT_TOKEN`
   - `BOT_USERNAME`
   - `NODE_ENV=production`

3. **Deploy settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### Telegram Bot Setup

1. **Create bot with @BotFather**
2. **Set commands:**
   ```
   /start - Start using Coinmoji
   ```

3. **Set menu button (optional):**
   ```
   /setmenubutton
   Your Bot Name
   {
     "type": "web_app",
     "text": "Open Coinmoji",
     "web_app": {
       "url": "https://your-netlify-domain.netlify.app"
     }
   }
   ```

## API Endpoints

### `/api/send-file`
Sends the generated WebM file to the user via Telegram bot.

**Method:** POST  
**Headers:** `X-Telegram-InitData: <initData>`  
**Body:** WebM file (binary)  
**Query:** `user_id=<telegram_user_id>`

### `/api/create-emoji`
Creates a custom emoji sticker set in Telegram.

**Method:** POST  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "initData": "telegram_init_data",
  "user_id": 123456789,
  "set_title": "My Coinmoji Set",
  "emoji_list": ["🪙"],
  "webm_base64": "base64_encoded_webm"
}
```

## Architecture

### Frontend Components

- `App.tsx` - Main application component with Telegram integration
- `TelegramProvider.tsx` - Telegram WebApp SDK integration and user context
- `NotInTelegram.tsx` - 404-style page for non-Telegram access
- `CoinEditor.tsx` - Three.js 3D coin editor component
- `SettingsPanel.tsx` - Mobile-friendly settings drawer

### Serverless Functions

- `send-file.ts` - Handles file sending to Telegram
- `create-emoji.ts` - Manages custom emoji sticker set creation
- `utils/telegram-auth.ts` - Telegram WebApp data verification

### 3D Coin Model

The coin model consists of:
- **Cylinder**: Main rim/edge of the coin
- **Hemispheres**: Top and bottom faces with configurable bulge
- **Materials**: PBR materials with metallic/roughness workflow
- **Overlays**: Transparent overlay meshes for custom images
- **Lighting**: Hemisphere + directional light setup with environment mapping

## Security

- **Telegram WebApp Verification**: All API calls verify Telegram initData using HMAC-SHA256
- **User Gating**: App only functions within legitimate Telegram WebApp environment
- **CORS Protection**: Appropriate headers and origin validation
- **Input Validation**: Sanitized inputs for all user-provided data

## Performance

- **Code Splitting**: Vite automatically splits code for optimal loading
- **Asset Optimization**: Images and 3D textures optimized for mobile
- **Memory Management**: Proper Three.js resource disposal
- **Mobile Optimization**: Responsive design with touch-friendly interactions

## Browser Support

- **Modern Browsers**: Chrome 88+, Safari 14+, Firefox 85+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **WebGL**: Required for 3D functionality
- **Canvas**: Required for texture generation and export

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test on mobile devices
5. Submit a pull request

## License

This project is part of the Coinmoji application suite. See the main repository for licensing information.
