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
  const [webApp, setWebApp] = useState<typeof window.Telegram?.WebApp | null>(null);

  useEffect(() => {
    const checkTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
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
      } else {
        setIsInTelegram(false);
      }
    };

    // Check immediately
    checkTelegram();

    // Also check after a short delay in case script loads asynchronously
    const timer = setTimeout(checkTelegram, 100);

    return () => clearTimeout(timer);
  }, []);

  const value: TelegramContextType = {
    isInTelegram,
    user,
    initData,
    webApp,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
