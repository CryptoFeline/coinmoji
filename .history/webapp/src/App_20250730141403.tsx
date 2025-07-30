import React, { useState } from 'react';
import { TelegramProvider, useTelegram } from './providers/TelegramProvider';
import NotInTelegram from './components/NotInTelegram';
import CoinEditor from './components/CoinEditor';
import SettingsPanel, { CoinSettings } from './components/SettingsPanel';

const AppContent: React.FC = () => {
  const { isInTelegram, user } = useTelegram();
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [coinSettings, setCoinSettings] = useState<CoinSettings>({
    fillMode: 'solid',
    bodyColor: '#b87333',
    gradientStart: '#ffd700',
    gradientEnd: '#ff8c00',
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Editor Button */}
      <div className="p-4">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <span>Open Coin Editor</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content - Flexible Canvas */}
      <main className="flex-1 flex flex-col px-4">
        {/* 3D Editor - Takes all available space */}
        <div className="flex-1 mb-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl h-full">
            <CoinEditor 
              className="h-full" 
              settings={coinSettings}
              onSettingsChange={setCoinSettings}
            />
          </div>
        </div>

        {/* Action Buttons - Two columns */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-4 rounded-2xl shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-4 rounded-2xl shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium">Create Emoji</span>
            </button>
          </div>
        </div>

        {/* Safe area for iOS */}
        <div className="h-4" />
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
