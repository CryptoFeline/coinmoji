import React, { useState } from 'react';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import NotInTelegram from './components/NotInTelegram';
import CoinEditor from './components/CoinEditor';
import SettingsPanel, { CoinSettings } from './components/SettingsPanel';

const AppContent: React.FC = () => {
  const { isInTelegram } = useTelegram();
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [coinSettings, setCoinSettings] = useState<CoinSettings>({
    fillMode: 'solid',
    bodyColor: '#979797ff',
    gradientStart: '#ffd700',
    gradientEnd: '#ff8c00',
    bodyTextureUrl: '',
    metallic: true,
    rotationSpeed: 'medium',
    overlayUrl: '',
    dualOverlay: false,
    overlayUrl2: '',
    lightColor: '#ffffff',
    lightStrength: 'medium',
  });

  if (!isInTelegram) {
    return <NotInTelegram />;
  }

  const handleExport = async () => {
    setIsExporting(true);
    // TODO: Implement export functionality
    setTimeout(() => setIsExporting(false), 2000);
  };

  const handleGetEmoji = async () => {
    // TODO: Implement emoji creation
    console.log('Creating emoji...');
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
