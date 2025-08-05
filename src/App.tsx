import React, { useState, useRef } from 'react';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import NotInTelegram from './components/NotInTelegram';
import CoinEditor, { CoinEditorRef } from './components/CoinEditor';
import SettingsPanel, { CoinSettings } from './components/SettingsPanel';
import { CoinExporter, createCustomEmoji, sendWebMFile } from './utils/exporter';

const AppContent: React.FC = () => {
  const { isInTelegram, initData, isLoading } = useTelegram();
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const coinEditorRef = useRef<CoinEditorRef>(null);
  
  const [coinSettings, setCoinSettings] = useState<CoinSettings>({
    fillMode: 'solid',
    bodyColor: '#cecece',
    gradientStart: '#00eaff',
    gradientEnd: '#ee00ff',
    bodyTextureUrl: '',
    metallic: true,
    rotationSpeed: 'medium',
    overlayUrl: '',
    dualOverlay: false,
    overlayUrl2: '',
    gifAnimationSpeed: 'medium',
    lightColor: '#cecece',
    lightStrength: 'medium',
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
      
      const rotationSpeed = speedMap[coinSettings.rotationSpeed];
      
      // FIXED: Always use 3 seconds and calculate the appropriate rotation amount
      const targetDuration = 3; // Always 3 seconds for emoji
      const rotationAmount = rotationSpeed * 60 * targetDuration; // How much rotation in 3 seconds
      
      console.log('🎬 Export settings:', {
        rotationSpeed: coinSettings.rotationSpeed,
        speedValue: rotationSpeed,
        targetDuration,
        rotationAmount: `${(rotationAmount / (2 * Math.PI)).toFixed(2)} full rotations`,
        radiansAmount: rotationAmount.toFixed(3),
        fps: 30
      });
      
      // Export as WebM for download
      const webmBlob = await exporter.exportAsWebM({
        fps: 30,
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
      
      const rotationSpeed = speedMap[coinSettings.rotationSpeed];
      // Calculate time for one full rotation (2π radians)
      const timeForFullRotation = (2 * Math.PI) / rotationSpeed / 60; // Convert to seconds (assuming 60fps)
      
      console.log('🎭 Emoji export settings:', {
        rotationSpeed: coinSettings.rotationSpeed,
        speedValue: rotationSpeed,
        timeForFullRotation: timeForFullRotation,
        fps: 30
      });
      
      // Export as WebM for Telegram emoji (no auto-download)
      const webmBlob = await exporter.exportAsWebM({
        fps: 30,
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
        alert('✅ Emoji created successfully! Check your custom emojis in Telegram.');
      } else {
        throw new Error(result.error || 'Failed to create emoji');
      }
      
    } catch (error) {
      console.error('Frame export failed:', error);
      // Don't override the detailed error message from exporter
      const errorMessage = error instanceof Error ? error.message : 'Failed to export frames. Please try again.';
      alert(`Frame export failed: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Editor Button */}
      <div className="p-4">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full bg-white border-2 text-gray-700 font-medium py-3 px-6 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Coin</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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
