import React, { useState, useRef } from 'react';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
// import NotInTelegram from './components/NotInTelegram';
import CoinEditor, { CoinEditorRef } from './components/CoinEditor';
import SettingsPanel, { CoinSettings } from './components/SettingsPanel';
import FaqTab from './components/FaqTab';
import { CoinExporter, createCustomEmoji, sendWebMFile } from './utils/exporter';

// MUI Icons
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const AppContent: React.FC = () => {
  const { isInTelegram, initData, isLoading } = useTelegram();
  const [showSettings, setShowSettings] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const coinEditorRef = useRef<CoinEditorRef>(null);
  
  const [coinSettings, setCoinSettings] = useState<CoinSettings>({
    // Coin Shape & Structure
    coinShape: 'normal',
    
    // Body Material Settings
    fillMode: 'solid',
    bodyColor: '#cecece',
    gradientStart: '#00eaff',
    gradientEnd: '#ee00ff',
    bodyMetallic: true,          // NEW: Separate from overlay metallic
    bodyMetalness: 'normal',     // NEW: Body metallic intensity
    bodyRoughness: 'normal',     // NEW: Body roughness control
    
    // Body Texture Settings
    bodyTextureUrl: '',
    bodyTextureMode: 'url',
    bodyTextureFile: null,
    bodyTextureBlobUrl: '',
    bodyTextureMapping: 'surface',  // NEW: Texture mapping options
    bodyTextureRimMapping: 'surface',  // NEW: Rim texture mapping
    bodyTextureRotation: 0,      // NEW: 0-360 degrees
    bodyTextureScale: 1.0,       // NEW: 0.1-5.0 scale multiplier
    bodyTextureOffsetX: 0,       // NEW: -1 to 1 offset
    bodyTextureOffsetY: 0,       // NEW: -1 to 1 offset
    bodyGifSpeed: 'normal',      // NEW: GIF animation speed for body
    
    // Face Overlay Settings
    overlayUrl: '',
    overlayMode: 'url',
    overlayFile: null,
    overlayBlobUrl: '',
    overlayMetallic: false,      // NEW: Separate toggle for overlays
    overlayMetalness: 'normal',  // Body metallic intensity
    overlayRoughness: 'low',     // Body roughness control
    overlayGifSpeed: 'normal',   // RENAMED: from gifAnimationSpeed
    overlayRotation: 0,          // NEW: Overlay transformation controls
    overlayScale: 1.0,           // NEW: Overlay scale multiplier
    overlayOffsetX: 0,           // NEW: Overlay offset X
    overlayOffsetY: 0,           // NEW: Overlay offset Y
    
    // Body Enhancement Settings (for body textures/materials)
    bodyEnhancement: false,           // Enable body enhancement
    bodyBrightness: 1.2,              // Body brightness multiplier
    bodyContrast: 1.05,               // Body contrast multiplier
    bodyVibrance: 1.1,                // Body vibrance multiplier
    bodyBloom: true,                  // Enable body selective bloom
    
    // Overlay Enhancement Settings (replaces glow system)
    overlayEnhancement: false,        // Enable overlay enhancement
    overlayBrightness: 1.6,           // Brightness multiplier
    overlayContrast: 1.15,            // Contrast multiplier
    overlayVibrance: 1.3,             // Color vibrance
    overlayBloom: true,               // Enable selective bloom effect
    
    // Dual Overlay Settings
    dualOverlay: false,
    overlayUrl2: '',
    overlayMode2: 'url',
    overlayFile2: null,
    overlayBlobUrl2: '',
    
  // Animation Settings (NEW SYSTEM)
    animationDirection: 'right', 
    animationPreset: 'smooth',   
    animationDuration: 3,        // FIXED: Always 3 seconds for Telegram emoji standard
    
    // Lighting Settings
    lightColor: '#cecece',
    lightStrength: 'medium',
    lightMode: 'studioLight',    // NEW: Light position presets
    
    // DEPRECATED: Kept for backward compatibility
    metallic: true,             // Will map to bodyMetallic
    rotationSpeed: 'medium',    // Will map to animationDirection
    gifAnimationSpeed: 'medium' // Will map to overlayGifSpeed
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔬 DEBUG MODE: Allow non-Telegram access for quality testing
  // if (!isInTelegram) {
  //   return <NotInTelegram />;
  // }

  const handleExport = async () => {
    if (!coinEditorRef.current) return;
    
    setIsExporting(true);
    try {
      const scene = coinEditorRef.current.getScene();
      const camera = coinEditorRef.current.getCamera();
      const renderer = coinEditorRef.current.getRenderer();
      const turntable = coinEditorRef.current.getTurntable();
      
      if (!scene || !camera || !renderer || !turntable) {
        throw new Error('Scene not ready');
      }

      const exporter = new CoinExporter(scene, camera, renderer, turntable, coinSettings);
      
      // Calculate perfect rotation timing based on current rotation speed
      const speedMap = {
        slow: 0.01,
        medium: 0.02,
        fast: 0.035,
      };
      
      const rotationSpeed = speedMap[coinSettings.rotationSpeed || 'medium'];
      
      // FIXED: Always use 3 seconds and calculate the appropriate rotation amount
      const targetDuration = 3; // Always 3 seconds for emoji
      const rotationAmount = rotationSpeed * 60 * targetDuration; // How much rotation in 3 seconds
      
      console.log('🎬 Export settings:', {
        rotationSpeed: coinSettings.rotationSpeed,
        speedValue: rotationSpeed,
        targetDuration,
        rotationAmount: `${(rotationAmount / (2 * Math.PI)).toFixed(2)} full rotations`,
        radiansAmount: rotationAmount.toFixed(3),
        fps: 20
      });
      
      // Export as WebM for download
      const webmBlob = await exporter.exportAsWebM({
        fps: 20,
        duration: targetDuration, // Always 3 seconds
        size: 100,
        rotationSpeed: rotationSpeed // Pass the actual rotation speed to match live animation
      }, false); // Don't auto-download, we'll handle it based on environment
      
      // Send via Telegram if in Telegram, otherwise download directly
      if (isInTelegram && initData) {
        console.log('📱 Sending WebM file via Telegram...');
        try {
          await sendWebMFile(webmBlob, initData, 'coinmoji.webm');
          alert('✅ Your Coinmoji WebM has been sent to this chat! You can save and share it from there.');
        } catch (telegramError) {
          console.warn('⚠️ Telegram send failed, falling back to direct download:', telegramError);
          // Fallback to direct download
          exporter.downloadBlob(webmBlob, 'coinmoji-fallback.webm');
          alert('⚠️ Could not send via Telegram, but your WebM has been downloaded instead!');
        }
      } else {
        // Direct download for non-Telegram environment
        console.log('💾 Direct download for non-Telegram environment');
        exporter.downloadBlob(webmBlob, 'coinmoji.webm');
        alert('✅ WebM downloaded! Check your downloads folder.');
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      // Don't override the detailed error message from exporter
      const errorMessage = error instanceof Error ? error.message : 'Export failed. Please try again.';
      alert(`Export failed: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGetEmoji = async () => {
    if (!coinEditorRef.current || !initData) return;
    
    setIsExporting(true);
    console.log('🚀 Starting emoji creation process...');
    try {
      const scene = coinEditorRef.current.getScene();
      const camera = coinEditorRef.current.getCamera();
      const renderer = coinEditorRef.current.getRenderer();
      const turntable = coinEditorRef.current.getTurntable();
      
      if (!scene || !camera || !renderer || !turntable) {
        throw new Error('Scene not ready');
      }

      const exporter = new CoinExporter(scene, camera, renderer, turntable, coinSettings);
      
      // Calculate perfect rotation timing based on current rotation speed (same as download)
      const speedMap = {
        slow: 0.01,
        medium: 0.02,
        fast: 0.035,
      };
      
      const rotationSpeed = speedMap[coinSettings.rotationSpeed || 'medium'];
      // Calculate time for one full rotation (2π radians)
      const timeForFullRotation = (2 * Math.PI) / rotationSpeed / 60; // Convert to seconds (assuming 60fps)
      
      console.log('🎭 Emoji export settings:', {
        rotationSpeed: coinSettings.rotationSpeed,
        speedValue: rotationSpeed,
        timeForFullRotation: timeForFullRotation,
        fps: 20
      });
      
      // Export as WebM for Telegram emoji (no auto-download)
      const webmBlob = await exporter.exportAsWebM({
        fps: 20,
        duration: Math.max(1, Math.min(3, timeForFullRotation)), // Clamp between 1-3 seconds
        size: 100,
        rotationSpeed: rotationSpeed // Pass the actual rotation speed to match live animation
      }, false); // No auto-download for emoji creation
      
      // Create custom emoji in Telegram
      const result = await createCustomEmoji(
        webmBlob,
        initData,
        ['🪙'],
        'Coinmoji'
      );
      
      if (result.success) {
        const botInfo = result.bot_used ? `\n\n🤖 Created using: ${result.bot_used}` : '';
        alert(`✅ Emoji created successfully! Check your custom emojis in Telegram.${botInfo}`);
      } else if (result.error === 'rate_limit') {
        // Handle rate limiting with user-friendly message
        const botInfo = result.total_bots && result.rate_limited_bots ? 
          `\n\n📊 ${result.rate_limited_bots}/${result.total_bots} bots are currently rate limited.` : '';
        const message = `⏰ ${result.message}${botInfo}\n\n💡 ${result.suggested_action}`;
        alert(message);
      } else {
        throw new Error(result.error || 'Failed to create emoji');
      }
      
    } catch (error) {
      console.error('Frame export failed:', error);
      // Enable detailed error message to debug server/client issues
      const errorMessage = error instanceof Error ? error.message : 'Failed to export frames. Please try again.';
      alert(`Frame export failed: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Editor Button */}
      <div className="p-4 flex space-x-4 mb-2">
        {/* infoIcon button */}
        <button
          onClick={() => setShowFaq(true)}
          className="bg-white border-2 text-gray-700 font-medium py-3 px-6 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm"
        >
          <HelpOutlineIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="w-full bg-white border-2 text-gray-700 font-medium py-3 px-6 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {/* walletButton */}
        <button
          onClick={() => alert('Wallet feature coming soon!')}
          className="bg-white border-2 text-gray-700 font-medium py-3 px-6 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm"
        >
          <AccountBalanceWalletIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content - Flexible Canvas */}
      <main className="flex flex-col px-4">
        {/* 3D Editor - Takes all available space */}
        <div className="flex-1 mb-4">
          <div className="bg-white border-2 rounded-lg h-full shadow-sm">
            <CoinEditor 
              ref={coinEditorRef}
              className="h-full" 
              settings={coinSettings}
              onSettingsChange={setCoinSettings}
            />
          </div>
        </div>

        {/* Action Buttons - Two columns */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-sm font-medium">Download</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleGetEmoji}
            className="bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border-2 hover:border-blue-500 active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm"
          >
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium">Create Emoji</span>
          </button>
        </div>

        {/* Safe area for iOS */}
        <div className="pb-4" />
      </main>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={coinSettings}
        onSettingsChange={setCoinSettings}
      />

      {/* FAQ Panel */}
      <FaqTab 
        isOpen={showFaq}
        isVisible={showFaq}
        onClose={() => setShowFaq(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  );
};

export default App;
