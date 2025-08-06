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
  bodyTextureUrl: string;
  metallic: boolean;
  rotationSpeed: 'slow' | 'medium' | 'fast';
  overlayUrl: string;
  dualOverlay: boolean;
  overlayUrl2: string;
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'strong';
  gifAnimationSpeed: 'slow' | 'medium' | 'fast';
  // New customization settings
  coinShape: 'thin' | 'normal' | 'thick';
  overlayMetalness: 'low' | 'normal' | 'high';
  overlayRoughness: 'low' | 'normal' | 'high';
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempOverlayUrl, setTempOverlayUrl] = useState('');
  const [tempOverlayUrl2, setTempOverlayUrl2] = useState('');
  const [tempBodyTextureUrl, setTempBodyTextureUrl] = useState('');

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

  const handleApplyBodyTexture = () => {
    if (tempBodyTextureUrl.trim()) {
      updateSetting('bodyTextureUrl', tempBodyTextureUrl.trim());
    }
  };

  const handleClearOverlay = () => {
    console.log('Clear button clicked - before clear:', {
      currentOverlayUrl: settings.overlayUrl,
      currentOverlayUrl2: settings.overlayUrl2,
      tempOverlayUrl,
      tempOverlayUrl2
    });
    
    // Clear both temp fields and actual settings immediately
    setTempOverlayUrl('');
    setTempOverlayUrl2('');
    
    // Create the updated settings object and call onSettingsChange directly
    const clearedSettings = {
      ...settings,
      overlayUrl: '',
      overlayUrl2: ''
    };
    
    onSettingsChange(clearedSettings);
  };

  const handleClearBodyTexture = () => {
    // Always clear the body texture URL - this will trigger the CoinEditor to remove the body texture
    updateSetting('bodyTextureUrl', '');
    setTempBodyTextureUrl('');
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
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors border
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked 
          ? 'bg-blue-500 border-blue-500' 
          : disabled 
            ? 'bg-gray-200 border-gray-200 cursor-not-allowed' 
            : 'bg-gray-200 border-gray-300'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
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
      <div className="fixed top-20 left-4 right-4 bg-white border-2 border-blue-500 rounded-lg shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Editor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-300"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Fill Mode */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">Body Design</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSetting('fillMode', 'solid')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  settings.fillMode === 'solid'
                    ? 'border-blue-500 bg-blue-50 text-blue-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Solid Color
              </button>
              <button
                onClick={() => updateSetting('fillMode', 'gradient')}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  settings.fillMode === 'gradient'
                    ? 'border-blue-500 bg-blue-50 text-blue-500'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Gradient
              </button>
            </div>
          </div>
          
          {/* Color Settings */}
          {settings.fillMode === 'solid' ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Body Color</label>
              <input
                type="color"
                value={settings.bodyColor}
                onChange={(e) => updateSetting('bodyColor', e.target.value)}
                className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Body Colors</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="color"
                    value={settings.gradientStart}
                    onChange={(e) => updateSetting('gradientStart', e.target.value)}
                    className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <input
                    type="color"
                    value={settings.gradientEnd}
                    onChange={(e) => updateSetting('gradientEnd', e.target.value)}
                    className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Body Texture Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Body Texture (Optional)</label>
            <div className="space-y-2">
              <input
                type="url"
                value={tempBodyTextureUrl}
                onChange={(e) => setTempBodyTextureUrl(e.target.value)}
                placeholder="https://example.com/txtr.jpg/png/gif/webm"
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={handleApplyBodyTexture}
                  className="flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-blue-50 text-sm"
                >
                  Apply Texture
                </button>
                <button 
                  onClick={handleClearBodyTexture}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          {/* Coin Shape */}
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-medium text-gray-900">Coin Shape</h3>
              <p className="text-xs text-gray-500">Adjust coin thickness</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['thin', 'normal', 'thick'] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => updateSetting('coinShape', shape)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.coinShape === shape
                      ? 'border-blue-500 bg-blue-50 text-blue-500'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Metallic Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-medium text-sm">Metallic Finish</span>
              <p className="text-xs text-gray-500">Adds reflective surface</p>
            </div>
            <Toggle 
              checked={settings.metallic} 
              onChange={(checked) => updateSetting('metallic', checked)} 
            />
          </div>

          {/* Overlay Metalness - Only show when metallic is enabled */}
          {settings.metallic && (
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Image Metalness</h3>
                <p className="text-xs text-gray-500">Set metallic intensity</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'normal', 'high'] as const).map((metalness) => (
                  <button
                    key={metalness}
                    onClick={() => updateSetting('overlayMetalness', metalness)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                      settings.overlayMetalness === metalness
                        ? 'bg-blue-50 text-blue-500 border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {metalness}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Overlay Roughness - Only show when metallic is enabled */}
          {settings.metallic && (
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Image Roughness</h3>
                <p className="text-xs text-gray-500">Set surface roughness</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'normal', 'high'] as const).map((roughness) => (
                  <button
                    key={roughness}
                    onClick={() => updateSetting('overlayRoughness', roughness)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                      settings.overlayRoughness === roughness
                        ? 'bg-blue-50 text-blue-500 border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {roughness}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rotation Speed */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">Coin Rotation Speed</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'medium', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSetting('rotationSpeed', speed)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                    settings.rotationSpeed === speed
                      ? 'bg-blue-50 text-blue-500 border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
          
          {/* Overlay Images */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">Face Images</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-900 font-medium text-sm">Different Images</span>
                <p className="text-xs text-gray-500">Use different images for front/back</p>
              </div>
              <Toggle 
                checked={settings.dualOverlay} 
                onChange={(checked) => updateSetting('dualOverlay', checked)} 
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.dualOverlay ? 'Front Image URL' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={tempOverlayUrl}
                  onChange={(e) => setTempOverlayUrl(e.target.value)}
                  placeholder="https://example.com/img.jpg/png/gif/webm"
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {settings.dualOverlay && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Back Image URL</label>
                  <input
                    type="url"
                    value={tempOverlayUrl2}
                    onChange={(e) => setTempOverlayUrl2(e.target.value)}
                    placeholder="https://example.com/img2.jpg/png/gif/webm"
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleApplyOverlay}
                className="flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-blue-50 text-sm"
              >
                Apply Images
              </button>
              <button 
                onClick={handleClearOverlay}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* GIF Animation Speed */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">GIF Animation Speed</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'medium', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSetting('gifAnimationSpeed', speed)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                    settings.gifAnimationSpeed === speed
                      ? 'bg-blue-50 text-blue-500 border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
          
          {/* Lighting */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900">Lighting</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Light Color</label>
                <input
                  type="color"
                  value={settings.lightColor}
                  onChange={(e) => updateSetting('lightColor', e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'strong'] as const).map((strength) => (
                    <button
                      key={strength}
                      onClick={() => updateSetting('lightStrength', strength)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                        settings.lightStrength === strength
                          ? 'bg-blue-50 text-blue-500 border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
