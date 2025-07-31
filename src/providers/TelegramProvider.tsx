import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  isInTelegram: boolean;
  user: TelegramUser | null;
  initData: string;
  webApp: any;
  isLoading: boolean;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState('');
  const [webApp, setWebApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Development mode - set this to true to test visuals outside Telegram
  const DEV_MODE = import.meta.env.DEV && import.meta.env.VITE_ENABLE_NON_TELEGRAM === 'true';

  useEffect(() => {
    const checkTelegram = () => {
      console.log('🔍 Checking Telegram environment...', {
        hasTelegramWebApp: !!window.Telegram?.WebApp,
        hasInitData: !!window.Telegram?.WebApp?.initData,
        DEV_MODE
      });
      
      if (window.Telegram?.WebApp && window.Telegram.WebApp.initData) {
        const tg = window.Telegram.WebApp;
        console.log('✅ Telegram WebApp found with initData');
        setIsInTelegram(true);
        setWebApp(tg);
        setInitData(tg.initData);
        setUser(tg.initDataUnsafe.user || null);
        
        // Initialize Telegram WebApp
        tg.ready();
        tg.expand();
        
        // Set theme
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          tg.themeParams.bg_color || '#ffffff'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          tg.themeParams.text_color || '#000000'
        );
        console.log('✅ Telegram environment detected');
      } else if (DEV_MODE) {
        // Development mode - simulate Telegram environment
        console.log('🔧 DEV_MODE enabled, simulating Telegram');
        setIsInTelegram(true);
        setUser({
          id: 123456789,
          first_name: 'Dev',
          last_name: 'User',
          username: 'devuser'
        });
        setInitData('dev_mode_init_data');
        setWebApp(null);
        console.log('🔧 Development mode: Simulating Telegram environment');
      } else {
        console.log('❌ Not in Telegram environment - no WebApp or initData');
        setIsInTelegram(false);
      }
      setIsLoading(false);
    };

    // Check immediately
    checkTelegram();

    // Also check after a short delay in case script loads asynchronously
    const timer = setTimeout(checkTelegram, 100);

    return () => clearTimeout(timer);
  }, [DEV_MODE]);

  const value: TelegramContextType = {
    isInTelegram,
    user,
    initData,
    webApp,
    isLoading,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
