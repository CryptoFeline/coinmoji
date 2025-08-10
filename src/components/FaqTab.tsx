import React from 'react';

interface FaqTabProps {
  isOpen: boolean;  
  isVisible: boolean;
  onClose: () => void;
}

const FaqTab: React.FC<FaqTabProps> = ({ isOpen, isVisible, onClose }) => {
  if (!isVisible) return null;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Help & FAQ</h1>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Welcome to Coinmoji!</h2>
          <p className="text-gray-700 leading-relaxed">
            Create your own custom 3D animated coin emojis with professional quality and share them 
            directly in Telegram. Perfect for crypto communities, gaming, and personal expression.
          </p>
        </div>

        {/* Getting Started */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">🚀 Getting Started</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-800">1. Choose Your Coin Shape</h3>
              <p className="text-sm text-gray-600">Select thin, normal, or thick coin profiles for different aesthetics.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">2. Design Your Coin</h3>
              <p className="text-sm text-gray-600">Pick colors, gradients, or upload custom textures for the coin body.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">3. Add Face Overlays</h3>
              <p className="text-sm text-gray-600">Upload images or GIFs to display on your coin faces.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">4. Set Animation</h3>
              <p className="text-sm text-gray-600">Choose rotation direction and animation style (smooth, fast-slow, bounce).</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">5. Export & Share</h3>
              <p className="text-sm text-gray-600">Download your creation or add it directly as a Telegram emoji.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">✨ Features</h2>
          <div className="grid gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium text-blue-900">3D Animation</h3>
              <p className="text-sm text-blue-700">High-quality 3D rendering with professional lighting.</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="font-medium text-green-900">Custom Textures</h3>
              <p className="text-sm text-green-700">Upload images, GIFs, or WebM videos as textures.</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h3 className="font-medium text-purple-900">Metallic Effects</h3>
              <p className="text-sm text-purple-700">Add metallic finishes with adjustable intensity.</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h3 className="font-medium text-orange-900">Telegram Integration</h3>
              <p className="text-sm text-orange-700">Direct emoji creation in your Telegram sticker sets.</p>
            </div>
          </div>
        </div>

        {/* Tips & Tricks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">💡 Tips & Tricks</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-800">Best Image Quality</h3>
              <p className="text-sm text-gray-600">Use square images (1:1 ratio) for best overlay results. PNG files with transparency work great!</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-800">Animation Performance</h3>
              <p className="text-sm text-gray-600">Smaller GIF files (under 1MB) will animate more smoothly.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-800">Lighting Presets</h3>
              <p className="text-sm text-gray-600">Try Studio lighting for sharp, dramatic effects or Natural for softer, ambient lighting.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-800">Dual Overlays</h3>
              <p className="text-sm text-gray-600">Use different images on front and back faces for more dynamic coins.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Need Help?</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              Having issues or want to suggest features? We're here to help!
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-800">Telegram:</span>
                <span className="text-gray-600 ml-2">@Coinmoji</span>
              </div>
              <div>
                <span className="font-medium text-gray-800">Version:</span>
                <span className="text-gray-600 ml-2">1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqTab;
