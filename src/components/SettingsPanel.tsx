import React, { useState, useCallback, useRef } from 'react';

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
  // Enhanced texture handling for body
  bodyTextureMode: 'url' | 'upload';
  bodyTextureFile: File | null;
  bodyTextureBlobUrl: string;
  metallic: boolean;
  rotationSpeed: 'slow' | 'medium' | 'fast';
  overlayUrl: string;
  // Enhanced texture handling for overlays
  overlayMode: 'url' | 'upload';
  overlayFile: File | null;
  overlayBlobUrl: string;
  dualOverlay: boolean;
  overlayUrl2: string;
  overlayMode2: 'url' | 'upload';
  overlayFile2: File | null;
  overlayBlobUrl2: string;
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
  
  // File upload refs
  const bodyTextureFileRef = useRef<HTMLInputElement>(null);
  const overlayFileRef = useRef<HTMLInputElement>(null);
  const overlayFileRef2 = useRef<HTMLInputElement>(null);

  const updateSetting = (key: keyof CoinSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  // File upload handlers
  const handleFileSelect = useCallback((
    file: File,
    blobUrl: string,
    type: 'bodyTexture' | 'overlay' | 'overlay2'
  ) => {
    // Cleanup old blob URL to prevent memory leaks
    const oldBlobUrl = type === 'bodyTexture' 
      ? settings.bodyTextureBlobUrl
      : type === 'overlay' 
        ? settings.overlayBlobUrl 
        : settings.overlayBlobUrl2;
        
    if (oldBlobUrl && oldBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldBlobUrl);
    }

    // Update settings with new file and blob URL
    const updates: Partial<CoinSettings> = {};
    
    if (type === 'bodyTexture') {
      updates.bodyTextureFile = file;
      updates.bodyTextureBlobUrl = blobUrl;
      updates.bodyTextureMode = 'upload';
    } else if (type === 'overlay') {
      updates.overlayFile = file;
      updates.overlayBlobUrl = blobUrl;
      updates.overlayMode = 'upload';
    } else {
      updates.overlayFile2 = file;
      updates.overlayBlobUrl2 = blobUrl;
      updates.overlayMode2 = 'upload';
    }

    onSettingsChange({
      ...settings,
      ...updates
    });
  }, [settings, onSettingsChange]);

  const validateAndSelectFile = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'bodyTexture' | 'overlay' | 'overlay2'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate format
    if (!file.type.match(/^(image|video)\/(jpeg|jpg|png|gif|webm)$/)) {
      alert('Please select a valid file (JPG, PNG, GIF, WebM)');
      event.target.value = '';
      return;
    }
    
    // Validate size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large! Please select a file smaller than ${maxSize / 1024 / 1024}MB`);
      event.target.value = '';
      return;
    }
    
    // Create blob URL for immediate preview
    const blobUrl = URL.createObjectURL(file);
    handleFileSelect(file, blobUrl, type);
  }, [handleFileSelect]);

  // Mode toggle handlers
  const toggleTextureMode = (type: 'bodyTexture' | 'overlay' | 'overlay2') => {
    if (type === 'bodyTexture') {
      const newMode = settings.bodyTextureMode === 'url' ? 'upload' : 'url';
      updateSetting('bodyTextureMode', newMode);
      if (newMode === 'url') {
        // Clear file data when switching to URL mode
        if (settings.bodyTextureBlobUrl && settings.bodyTextureBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(settings.bodyTextureBlobUrl);
        }
        updateSetting('bodyTextureFile', null);
        updateSetting('bodyTextureBlobUrl', '');
        if (bodyTextureFileRef.current) {
          bodyTextureFileRef.current.value = '';
        }
      } else {
        // Clear URL when switching to upload mode
        setTempBodyTextureUrl('');
      }
    } else if (type === 'overlay') {
      const newMode = settings.overlayMode === 'url' ? 'upload' : 'url';
      updateSetting('overlayMode', newMode);
      if (newMode === 'url') {
        if (settings.overlayBlobUrl && settings.overlayBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl);
        }
        updateSetting('overlayFile', null);
        updateSetting('overlayBlobUrl', '');
        if (overlayFileRef.current) {
          overlayFileRef.current.value = '';
        }
      } else {
        // Clear URL when switching to upload mode
        setTempOverlayUrl('');
      }
    } else {
      const newMode = settings.overlayMode2 === 'url' ? 'upload' : 'url';
      updateSetting('overlayMode2', newMode);
      if (newMode === 'url') {
        if (settings.overlayBlobUrl2 && settings.overlayBlobUrl2.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl2);
        }
        updateSetting('overlayFile2', null);
        updateSetting('overlayBlobUrl2', '');
        if (overlayFileRef2.current) {
          overlayFileRef2.current.value = '';
        }
      } else {
        // Clear URL when switching to upload mode
        setTempOverlayUrl2('');
      }
    }
  };

  const handleApplyOverlay = () => {
    // Handle primary overlay
    if (settings.overlayMode === 'url' && tempOverlayUrl.trim()) {
      updateSetting('overlayUrl', tempOverlayUrl.trim());
    } else if (settings.overlayMode === 'upload' && settings.overlayFile && settings.overlayBlobUrl) {
      updateSetting('overlayUrl', settings.overlayBlobUrl);
    }
    
    // Handle secondary overlay if dual is enabled
    if (settings.dualOverlay) {
      if (settings.overlayMode2 === 'url' && tempOverlayUrl2.trim()) {
        updateSetting('overlayUrl2', tempOverlayUrl2.trim());
      } else if (settings.overlayMode2 === 'upload' && settings.overlayFile2 && settings.overlayBlobUrl2) {
        updateSetting('overlayUrl2', settings.overlayBlobUrl2);
      }
    }
  };

  const handleApplyBodyTexture = () => {
    if (settings.bodyTextureMode === 'url' && tempBodyTextureUrl.trim()) {
      updateSetting('bodyTextureUrl', tempBodyTextureUrl.trim());
    } else if (settings.bodyTextureMode === 'upload' && settings.bodyTextureFile && settings.bodyTextureBlobUrl) {
      updateSetting('bodyTextureUrl', settings.bodyTextureBlobUrl);
    }
  };

  const handleClearOverlay = () => {
    console.log('Clear button clicked - before clear:', {
      currentOverlayUrl: settings.overlayUrl,
      currentOverlayUrl2: settings.overlayUrl2,
      tempOverlayUrl,
      tempOverlayUrl2
    });
    
    // Clear temp fields
    setTempOverlayUrl('');
    setTempOverlayUrl2('');
    
    // Cleanup blob URLs to prevent memory leaks
    if (settings.overlayBlobUrl && settings.overlayBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(settings.overlayBlobUrl);
    }
    if (settings.overlayBlobUrl2 && settings.overlayBlobUrl2.startsWith('blob:')) {
      URL.revokeObjectURL(settings.overlayBlobUrl2);
    }
    
    // Clear file inputs
    if (overlayFileRef.current) {
      overlayFileRef.current.value = '';
    }
    if (overlayFileRef2.current) {
      overlayFileRef2.current.value = '';
    }
    
    // Create the updated settings object and call onSettingsChange directly
    const clearedSettings = {
      ...settings,
      overlayUrl: '',
      overlayUrl2: '',
      overlayFile: null,
      overlayBlobUrl: '',
      overlayFile2: null,
      overlayBlobUrl2: ''
    };
    
    onSettingsChange(clearedSettings);
  };

  const handleClearBodyTexture = () => {
    // Always clear the body texture URL - this will trigger the CoinEditor to remove the body texture
    updateSetting('bodyTextureUrl', '');
    
    // Clear temp URL
    setTempBodyTextureUrl('');
    
    // Cleanup blob URL and file if in upload mode
    if (settings.bodyTextureBlobUrl && settings.bodyTextureBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(settings.bodyTextureBlobUrl);
    }
    updateSetting('bodyTextureFile', null);
    updateSetting('bodyTextureBlobUrl', '');
    
    // Clear file input
    if (bodyTextureFileRef.current) {
      bodyTextureFileRef.current.value = '';
    }
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Body Texture (Optional)</label>
              <button
                onClick={() => toggleTextureMode('bodyTexture')}
                className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  settings.bodyTextureMode === 'url' 
                    ? 'bg-blue-50 text-blue-600 border-blue-200' 
                    : 'bg-green-50 text-green-600 border-green-200'
                }`}
              >
                {settings.bodyTextureMode === 'url' ? '🔗 URL' : '📁 Upload'}
              </button>
            </div>
            
            {settings.bodyTextureMode === 'url' ? (
              <input
                type="url"
                value={tempBodyTextureUrl}
                onChange={(e) => setTempBodyTextureUrl(e.target.value)}
                placeholder="https://example.com/texture.jpg/png/gif/webm"
                className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ) : (
              <div className="space-y-2">
                <input
                  ref={bodyTextureFileRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,video/webm"
                  onChange={(e) => validateAndSelectFile(e, 'bodyTexture')}
                  className="hidden"
                />
                <div 
                  onClick={() => bodyTextureFileRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {settings.bodyTextureFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-gray-700 truncate">
                          {settings.bodyTextureFile.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {(settings.bodyTextureFile.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-400 text-2xl">📁</span>
                      <p className="text-sm text-gray-600">Click to select file</p>
                      <p className="text-xs text-gray-400">JPG, PNG, GIF, WebM (max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
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
            
            <div className="space-y-4">
              {/* Primary Overlay */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {settings.dualOverlay ? 'Front Image' : 'Face Image'}
                  </label>
                  <button
                    onClick={() => toggleTextureMode('overlay')}
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      settings.overlayMode === 'url' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-green-50 text-green-600 border-green-200'
                    }`}
                  >
                    {settings.overlayMode === 'url' ? '🔗 URL' : '📁 Upload'}
                  </button>
                </div>
                
                {settings.overlayMode === 'url' ? (
                  <input
                    type="url"
                    value={tempOverlayUrl}
                    onChange={(e) => setTempOverlayUrl(e.target.value)}
                    placeholder="https://example.com/img.jpg/png/gif/webm"
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      ref={overlayFileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,video/webm"
                      onChange={(e) => validateAndSelectFile(e, 'overlay')}
                      className="hidden"
                    />
                    <div 
                      onClick={() => overlayFileRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {settings.overlayFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-sm text-gray-700 truncate">
                              {settings.overlayFile.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {(settings.overlayFile.size / 1024).toFixed(1)}KB
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-gray-400 text-2xl">📁</span>
                          <p className="text-sm text-gray-600">Click to select file</p>
                          <p className="text-xs text-gray-400">JPG, PNG, GIF, WebM (max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Secondary Overlay (if dual overlay enabled) */}
              {settings.dualOverlay && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Back Image</label>
                    <button
                      onClick={() => toggleTextureMode('overlay2')}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        settings.overlayMode2 === 'url' 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-green-50 text-green-600 border-green-200'
                      }`}
                    >
                      {settings.overlayMode2 === 'url' ? '🔗 URL' : '📁 Upload'}
                    </button>
                  </div>
                  
                  {settings.overlayMode2 === 'url' ? (
                    <input
                      type="url"
                      value={tempOverlayUrl2}
                      onChange={(e) => setTempOverlayUrl2(e.target.value)}
                      placeholder="https://example.com/img2.jpg/png/gif/webm"
                      className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <div className="space-y-2">
                      <input
                        ref={overlayFileRef2}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,video/webm"
                        onChange={(e) => validateAndSelectFile(e, 'overlay2')}
                        className="hidden"
                      />
                      <div 
                        onClick={() => overlayFileRef2.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        {settings.overlayFile2 ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">✅</span>
                              <span className="text-sm text-gray-700 truncate">
                                {settings.overlayFile2.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {(settings.overlayFile2.size / 1024).toFixed(1)}KB
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-gray-400 text-2xl">📁</span>
                            <p className="text-sm text-gray-600">Click to select file</p>
                            <p className="text-xs text-gray-400">JPG, PNG, GIF, WebM (max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
