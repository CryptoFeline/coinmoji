import React from 'react';

const NotInTelegram: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-gray-50 to-ios-gray-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-ios-blue to-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ios-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-ios-gray-600 mb-6">
            Coinmoji is only available inside Telegram. This app allows you to create custom emoji from 3D coin designs.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-ios-gray-50 rounded-ios">
            <h3 className="font-semibold text-ios-gray-900 mb-2">How to access:</h3>
            <ol className="text-sm text-ios-gray-700 text-left space-y-1">
              <li>1. Open Telegram</li>
              <li>2. Search for @CoinmojiBot</li>
              <li>3. Start the bot and tap "Open App"</li>
            </ol>
          </div>
          
          <a
            href="https://t.me/CoinmojiBot"
            className="btn-primary w-full inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Telegram
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-ios-gray-200">
          <p className="text-xs text-ios-gray-500">
            Create stunning 3D animated emoji for your Telegram chats
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotInTelegram;
