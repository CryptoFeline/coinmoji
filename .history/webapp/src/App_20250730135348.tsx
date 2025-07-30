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
    <div className="min-h-screen bg-gradient-to-br from-telegram-bg to-telegram-secondary flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-lg">🪙</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Coinmoji</h1>
            {user && (
              <p className="text-white/70 text-sm">Welcome, {user.first_name}!</p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* 3D Editor */}
        <div className="flex-1 p-4">
          <div className="bg-black/20 backdrop-blur-sm rounded-ios-xl border border-white/10 h-full">
            <CoinEditor className="h-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-ios-blue to-blue-600 text-white font-semibold py-4 px-6 rounded-ios-lg shadow-ios-lg active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download WebM</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleGetEmoji}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-4 px-6 rounded-ios-lg shadow-ios-lg active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2"
          >
            <span className="text-lg">✨</span>
            <span>Create Custom Emoji</span>
          </button>
        </div>

        {/* Safe area for iOS */}
        <div className="h-4" />
      </main>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
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
