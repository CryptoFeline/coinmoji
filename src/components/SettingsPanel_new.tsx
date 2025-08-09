import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CoinSettings;
  onSettingsChange: (settings: CoinSettings) => void;
}

export interface CoinSettings {
  // Coin Shape & Structure
  coinShape: 'thin' | 'normal' | 'thick';
  
  // Body Material Settings
  fillMode: 'solid' | 'gradient' | 'texture';
  bodyColor: string;
  gradientStart: string;
  gradientEnd: string;
  bodyMetallic: boolean;          // NEW: Separate from overlay metallic
  bodyMetalness: 'low' | 'normal' | 'high';  // NEW: Body metallic intensity
  bodyRoughness: 'low' | 'normal' | 'high';  // NEW: Body roughness control
  
  // Body Texture Settings
  bodyTextureUrl: string;
  bodyTextureMode: 'url' | 'upload';
  bodyTextureFile: File | null;
  bodyTextureBlobUrl: string;
  bodyTextureMapping: 'planar' | 'cylindrical' | 'spherical';  // NEW: Texture mapping options
  bodyTextureRotation: number;    // NEW: 0-360 degrees
  bodyTextureScale: number;       // NEW: 0.1-5.0 scale multiplier
  bodyTextureOffsetX: number;     // NEW: -1 to 1 offset
  bodyTextureOffsetY: number;     // NEW: -1 to 1 offset
  bodyGifSpeed: 'slow' | 'normal' | 'fast';  // NEW: GIF animation speed for body
  
  // Face Overlay Settings
  overlayUrl: string;
  overlayMode: 'url' | 'upload';
  overlayFile: File | null;
  overlayBlobUrl: string;
  overlayMetallic: boolean;       // NEW: Separate toggle for overlays
  overlayMetalness: 'low' | 'normal' | 'high';
  overlayRoughness: 'low' | 'normal' | 'high';
  overlayGifSpeed: 'slow' | 'normal' | 'fast';  // RENAMED: from gifAnimationSpeed
  
  // Dual Overlay Settings
  dualOverlay: boolean;
  overlayUrl2: string;
  overlayMode2: 'url' | 'upload';
  overlayFile2: File | null;
  overlayBlobUrl2: string;
  
  // Animation Settings (NEW SYSTEM)
  animationDirection: 'right' | 'left' | 'up' | 'down';  // NEW: Replace rotationSpeed
  animationEasing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';  // NEW
  animationDuration: number;      // NEW: Duration in seconds (default: 3)
  
  // Lighting Settings
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'high';
  
  // Server-side processing fields (backward compatibility maintained)
  bodyTextureTempId?: string;
  bodyTextureBase64?: string;
  overlayTempId?: string;
  overlayBase64?: string;
  overlayTempId2?: string;
  overlayBase64_2?: string;
  
  // DEPRECATED: Kept for backward compatibility
  metallic?: boolean;             // Will map to bodyMetallic
  rotationSpeed?: 'slow' | 'medium' | 'fast';  // Will map to animationDirection
  gifAnimationSpeed?: 'slow' | 'medium' | 'fast';  // Will map to overlayGifSpeed
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempOverlayUrl, setTempOverlayUrl] = useState('');
  const [tempOverlayUrl2, setTempOverlayUrl2] = useState('');
  const [tempBodyTextureUrl, setTempBodyTextureUrl] = useState('');
  
  // Loading states for better UX
  const [isProcessingFile, setIsProcessingFile] = useState<{
    bodyTexture: boolean;
    overlay: boolean;
    overlay2: boolean;
  }>({
    bodyTexture: false,
    overlay: false,
    overlay2: false
  });
  
  // Toast notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  // File upload refs
  const bodyTextureFileRef = useRef<HTMLInputElement>(null);
  const overlayFileRef = useRef<HTMLInputElement>(null);
  const overlayFileRef2 = useRef<HTMLInputElement>(null);
  
  // Track blob URLs for cleanup on unmount
  const activeBlobUrls = useRef<Set<string>>(new Set());
  
  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      activeBlobUrls.current.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      activeBlobUrls.current.clear();
    };
  }, []);

  const updateSetting = (key: keyof CoinSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  // Toast notification helper
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000); // Auto-hide after 4 seconds
  }, []);

  // Toggle Component
  const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ 
    checked, 
    onChange, 
    disabled = false 
  }) => (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`
        w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all dark:border-gray-600 
        ${checked ? 'peer-checked:bg-blue-600' : ''} 
        ${disabled ? 'cursor-not-allowed' : ''}
      `} />
    </label>
  );

  // Placeholder functions - implement based on existing logic
  const handleApplyBodyTexture = () => {
    // Implementation from original file
  };
  
  const handleClearBodyTexture = () => {
    // Implementation from original file  
  };

  const handleApplyOverlay = () => {
    // Implementation from original file
  };
  
  const handleClearOverlay = () => {
    // Implementation from original file
  };

  const handleBodyTextureModeChange = (mode: 'url' | 'upload') => {
    // Implementation from original file
  };

  const handleOverlayModeChange = (mode: 'url' | 'upload', overlayNum: 1 | 2 = 1) => {
    // Implementation from original file
  };

  const validateAndSelectFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'bodyTexture' | 'overlay' | 'overlay2'
  ) => {
    // Implementation from original file
  };

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
        <div className="p-4 space-y-8">
          {/* ===== COIN STRUCTURE SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🪙</span>
                Coin Structure
              </h2>
              <p className="text-sm text-gray-500">Basic coin properties and animation</p>
            </div>
            
            {/* Coin Shape */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Shape</h3>
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

            {/* Animation Settings */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Animation</h3>
                <p className="text-xs text-gray-500">Control coin rotation and timing</p>
              </div>
              
              {/* Animation Direction */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['right', 'left', 'up', 'down'] as const).map((direction) => (
                    <button
                      key={direction}
                      onClick={() => updateSetting('animationDirection', direction)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                        settings.animationDirection === direction
                          ? 'border-blue-500 bg-blue-50 text-blue-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {direction === 'right' && '→ Right'}
                      {direction === 'left' && '← Left'}
                      {direction === 'up' && '↑ Up'}
                      {direction === 'down' && '↓ Down'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Animation Easing */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Easing</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['linear', 'ease-in', 'ease-out', 'ease-in-out'] as const).map((easing) => (
                    <button
                      key={easing}
                      onClick={() => updateSetting('animationEasing', easing)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        settings.animationEasing === easing
                          ? 'border-blue-500 bg-blue-50 text-blue-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {easing.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Animation Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Duration: {settings.animationDuration}s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={settings.animationDuration}
                  onChange={(e) => updateSetting('animationDuration', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== BODY MATERIAL SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🎨</span>
                Body Material
              </h2>
              <p className="text-sm text-gray-500">Coin body appearance and textures</p>
            </div>
            
            {/* Fill Mode */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">Fill Mode</h3>
                <p className="text-xs text-gray-500">Choose coin body appearance</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting('fillMode', 'solid')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.fillMode === 'solid'
                      ? 'border-blue-500 bg-blue-50 text-blue-500'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
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
                <button
                  onClick={() => updateSetting('fillMode', 'texture')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.fillMode === 'texture'
                      ? 'border-blue-500 bg-blue-50 text-blue-500'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Texture
                </button>
              </div>
            </div>
            
            {/* Color Settings */}
            {settings.fillMode === 'solid' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Body Color</label>
                <input
                  type="color"
                  value={settings.bodyColor}
                  onChange={(e) => updateSetting('bodyColor', e.target.value)}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>
            )}
            
            {settings.fillMode === 'gradient' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Gradient Colors</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="color"
                    value={settings.gradientStart}
                    onChange={(e) => updateSetting('gradientStart', e.target.value)}
                    className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="color"
                    value={settings.gradientEnd}
                    onChange={(e) => updateSetting('gradientEnd', e.target.value)}
                    className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Body Metallic Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 font-medium text-sm">Body Metallic Finish</span>
                  <p className="text-xs text-gray-500">Adds reflective surface to coin body</p>
                </div>
                <Toggle 
                  checked={settings.bodyMetallic} 
                  onChange={(checked) => updateSetting('bodyMetallic', checked)} 
                />
              </div>

              {/* Body Metallic Intensity Controls */}
              {settings.bodyMetallic && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Body Metalness */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Metalness</h4>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        {(['low', 'normal', 'high'] as const).map((metalness) => (
                          <button
                            key={metalness}
                            onClick={() => updateSetting('bodyMetalness', metalness)}
                            className={`p-2 rounded-lg text-xs font-medium transition-all capitalize border ${
                              settings.bodyMetalness === metalness
                                ? 'bg-blue-50 text-blue-500 border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {metalness}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Roughness */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Roughness</h4>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        {(['low', 'normal', 'high'] as const).map((roughness) => (
                          <button
                            key={roughness}
                            onClick={() => updateSetting('bodyRoughness', roughness)}
                            className={`p-2 rounded-lg text-xs font-medium transition-all capitalize border ${
                              settings.bodyRoughness === roughness
                                ? 'bg-blue-50 text-blue-500 border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {roughness}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== FACE OVERLAYS SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🖼️</span>
                Face Overlays
              </h2>
              <p className="text-sm text-gray-500">Images displayed on coin faces</p>
            </div>
            
            {/* Dual Overlay Toggle */}
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

            {/* Overlay Metallic Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 font-medium text-sm">Overlay Metallic Finish</span>
                  <p className="text-xs text-gray-500">Adds reflective surface to overlays</p>
                </div>
                <Toggle 
                  checked={settings.overlayMetallic} 
                  onChange={(checked) => updateSetting('overlayMetallic', checked)} 
                />
              </div>
            </div>
          </div>

          {/* ===== LIGHTING SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">💡</span>
                Lighting
              </h2>
              <p className="text-sm text-gray-500">Scene lighting and atmosphere</p>
            </div>
            
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
                  {(['low', 'medium', 'high'] as const).map((strength) => (
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
      
      {/* Toast Notification */}
      {notification.visible && (
        <div className="fixed top-4 right-4 z-60 max-w-sm">
          <div className={`
            p-4 rounded-lg shadow-lg border-l-4 
            ${notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : notification.type === 'error' 
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
            }
          `}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <span className="text-green-400">✓</span>}
                {notification.type === 'error' && <span className="text-red-400">✕</span>}
                {notification.type === 'warning' && <span className="text-yellow-400">⚠</span>}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
