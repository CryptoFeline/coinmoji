# Coinmoji 🪙

A Telegram WebApp for creating custom animated coin emojis with 3D editor, GIF/WebM support, and direct Telegram integration.

## Features

- **3D Coin Editor**: Real-time coin customization with texture mapping
- **Animation Support**: GIF→WebM transcoding for animated face textures  
- **Telegram Integration**: Direct custom emoji creation in Telegram
- **Export Options**: Download WebM files or create Telegram emojis
- **Responsive Design**: Optimized for mobile and desktop

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Engine**: THREE.js 0.158.0
- **Video Processing**: WebCodecs API + webm-muxer  
- **Deployment**: Netlify with serverless functions
- **Telegram**: WebApp API + Bot API integration

## Quick Start

### Development

```bash
cd webapp
npm install
npm run dev
```

Visit `http://localhost:5173` to test locally.

### Production Build

```bash
npm run build
```

### CLI Encoder (Optional)

Encode PNG frame sequences to emoji-compliant WebM:

```bash
node scripts/encode-emoji-cli.js --input "frames/frame_%04d.png" --fps 30 --output coin.webm
```

## Deployment

### Netlify

1. Connect to GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `NODE_ENV`: `production`

### Environment Variables

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
NODE_ENV=production
VITE_ENABLE_NON_TELEGRAM=false
```

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set webhook URL to your Netlify domain
4. Configure WebApp URL in bot settings

## File Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── CoinEditor.tsx      # Main 3D editor
│   │   ├── SettingsPanel.tsx   # UI controls
│   │   └── NotInTelegram.tsx   # Fallback UI
│   ├── providers/
│   │   └── TelegramProvider.tsx # Telegram WebApp integration
│   ├── utils/
│   │   └── exporter.ts         # Export/encoding utilities
│   └── types/
│       └── telegram.d.ts       # Type definitions
├── netlify/functions/
│   ├── create-emoji.js         # Telegram emoji creation
│   └── send-file.js           # File upload handler
├── scripts/
│   └── encode-emoji-cli.js     # CLI encoder
└── public/                     # Static assets
```

## API Endpoints

- `POST /api/create-emoji` - Create Telegram custom emoji
- `POST /api/send-file` - Upload file to Telegram

## Browser Support

- **WebCodecs**: Chrome 94+, Edge 94+ (for GIF transcoding)
- **WebGL**: All modern browsers (for 3D rendering)
- **Fallback**: Canvas-based GIF animation for older browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test locally and in Telegram
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details
