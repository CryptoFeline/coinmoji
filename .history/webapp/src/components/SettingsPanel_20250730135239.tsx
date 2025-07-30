import React, { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CoinSettings;
  onSettingsChange: (settings: CoinSettings) => void;
}

export interface CoinSettings {
  fillMode: 'solid' | 'gradient';
  bodyColor: string;
  gradientStart: string;
  gradientEnd: string;
  metallic: boolean;
  rotationSpeed: 'slow' | 'medium' | 'fast';
  overlayUrl: string;
  dualOverlay: boolean;
  overlayUrl2: string;
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'strong';
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempOverlayUrl, setTempOverlayUrl] = useState('');
  const [tempOverlayUrl2, setTempOverlayUrl2] = useState('');

  const updateSetting = (key: keyof CoinSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleApplyOverlay = () => {
    if (tempOverlayUrl.trim()) {
      updateSetting('overlayUrl', tempOverlayUrl.trim());
    }
    if (settings.dualOverlay && tempOverlayUrl2.trim()) {
      updateSetting('overlayUrl2', tempOverlayUrl2.trim());
    }
  };

  const handleClearOverlay = () => {
    updateSetting('overlayUrl', '');
    updateSetting('overlayUrl2', '');
    setTempOverlayUrl('');
    setTempOverlayUrl2('');
  };

  const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ 
    checked, 
    onChange, 
    disabled = false 
  }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked 
          ? 'bg-blue-500' 
          : disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'bg-gray-300'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Panel - Dropdown style */}
      <div className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Coin Editor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fill Mode */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ios-gray-900">Body Design</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="fillMode"
                  value="solid"
                  className="w-4 h-4 text-ios-blue"
                  defaultChecked
                />
                <span className="text-ios-gray-800">Solid Color</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="fillMode"
                  value="gradient"
                  className="w-4 h-4 text-ios-blue"
                />
                <span className="text-ios-gray-800">Gradient</span>
              </label>
            </div>
          </div>
          
          {/* Solid Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-ios-gray-700">
              Body Color
            </label>
            <input
              type="color"
              defaultValue="#b87333"
              className="w-full h-12 rounded-ios border border-ios-gray-200"
            />
          </div>
          
          {/* Gradient Colors */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-ios-gray-700">
              Gradient Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-ios-gray-600 mb-1">Start</label>
                <input
                  type="color"
                  defaultValue="#ffd700"
                  className="w-full h-10 rounded-ios border border-ios-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs text-ios-gray-600 mb-1">End</label>
                <input
                  type="color"
                  defaultValue="#ff8c00"
                  className="w-full h-10 rounded-ios border border-ios-gray-200"
                />
              </div>
            </div>
          </div>
          
          {/* Metallic Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-ios-gray-800 font-medium">Metallic Finish</span>
            <button className="switch switch-enabled">
              <span className="switch-thumb switch-thumb-enabled" />
            </button>
          </div>
          
          {/* Rotation Speed */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ios-gray-900">Animation</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="rotationSpeed"
                  value="slow"
                  className="w-4 h-4 text-ios-blue"
                />
                <span className="text-ios-gray-800">Slow</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="rotationSpeed"
                  value="medium"
                  className="w-4 h-4 text-ios-blue"
                  defaultChecked
                />
                <span className="text-ios-gray-800">Medium</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="rotationSpeed"
                  value="fast"
                  className="w-4 h-4 text-ios-blue"
                />
                <span className="text-ios-gray-800">Fast</span>
              </label>
            </div>
          </div>
          
          {/* Overlay Images */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ios-gray-900">Face Overlays</h3>
            
            {/* Dual mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-ios-gray-800">Dual Images</span>
              <button className="switch switch-disabled">
                <span className="switch-thumb switch-thumb-disabled" />
              </button>
            </div>
            
            {/* Image URL inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">
                  Image URL (Front)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">
                  Image URL (Back)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image2.png"
                  className="input"
                  disabled
                />
              </div>
            </div>
            
            {/* Apply/Clear buttons */}
            <div className="flex space-x-3">
              <button className="btn-primary flex-1">Apply</button>
              <button className="btn-secondary flex-1">Clear</button>
            </div>
          </div>
          
          {/* Lighting */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-ios-gray-900">Lighting</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">
                  Light Color
                </label>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="w-full h-12 rounded-ios border border-ios-gray-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">
                  Strength
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="lightStrength"
                      value="low"
                      className="w-4 h-4 text-ios-blue"
                    />
                    <span className="text-ios-gray-800">Low</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="lightStrength"
                      value="medium"
                      className="w-4 h-4 text-ios-blue"
                      defaultChecked
                    />
                    <span className="text-ios-gray-800">Medium</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="lightStrength"
                      value="strong"
                      className="w-4 h-4 text-ios-blue"
                    />
                    <span className="text-ios-gray-800">Strong</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Safe area at bottom */}
        <div className="h-8" />
      </div>
    </>
  );
};

export default SettingsPanel;
