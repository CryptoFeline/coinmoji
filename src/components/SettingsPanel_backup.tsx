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

  // Upload file to server for server-side rendering
  const uploadFileToServer = useCallback(async (file: File): Promise<{tempId: string, base64Data: string, mimetype: string}> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${window.location.origin}/.netlify/functions/upload-temp-file`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(`Upload failed: ${errorResult.error || response.statusText}`);
    }

    const result = await response.json();
    if (!result.success || !result.tempId || !result.base64Data) {
      throw new Error(result.message || 'Upload response missing temp ID or base64 data');
    }

    return {
      tempId: result.tempId,
      base64Data: result.base64Data,
      mimetype: result.mimetype
    };
  }, []);

  // File size helper with progressive warnings
  const getFileSizeWarning = (size: number): string | null => {
    const mb = size / (1024 * 1024);
    if (mb >= 4) {
      return `⚠️ Large file (${mb.toFixed(1)}MB) - may slow down preview`;
    } else if (mb >= 2) {
      return `📊 Medium file (${mb.toFixed(1)}MB) - processing...`;
    } else if (mb >= 1) {
      return `📁 File size: ${mb.toFixed(1)}MB`;
    }
    return null;
  };

  // File upload handlers
  const handleFileSelect = useCallback(async (
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
      activeBlobUrls.current.delete(oldBlobUrl);
    }

    // Track new blob URL for cleanup
    activeBlobUrls.current.add(blobUrl);

    // Start server upload in the background (non-blocking)
    let tempId: string | undefined;
    let base64Data: string | undefined;
    try {
      const uploadResult = await uploadFileToServer(file);
      tempId = uploadResult.tempId;
      base64Data = uploadResult.base64Data;
      console.log(`✅ File uploaded to server with temp ID: ${tempId}`);
    } catch (error) {
      console.error('⚠️ Server upload failed (will fallback to client-side only):', error);
      showNotification('Server upload failed - using client-side only', 'warning');
    }

    // 🔧 UPDATED: Use blob URLs for client preview (memory efficient)
    // Base64 data is stored separately for server-side rendering
    // Client-side GIF processing can now handle both blob URLs and data URLs properly
    
    // Update settings with new file and blob URL for client preview
    const updates: Partial<CoinSettings> = {};
    
    if (type === 'bodyTexture') {
      updates.bodyTextureFile = file;
      updates.bodyTextureBlobUrl = blobUrl; // Always use blob URL for client preview
      updates.bodyTextureMode = 'upload';
      updates.bodyTextureTempId = tempId;
      updates.bodyTextureBase64 = base64Data; // Base64 for server rendering
    } else if (type === 'overlay') {
      updates.overlayFile = file;
      updates.overlayBlobUrl = blobUrl; // Always use blob URL for client preview
      updates.overlayMode = 'upload';
      updates.overlayTempId = tempId;
      updates.overlayBase64 = base64Data; // Base64 for server rendering
    } else {
      updates.overlayFile2 = file;
      updates.overlayBlobUrl2 = blobUrl; // Always use blob URL for client preview
      updates.overlayMode2 = 'upload';
      updates.overlayTempId2 = tempId;
      updates.overlayBase64_2 = base64Data; // Base64 for server rendering
    }

    onSettingsChange({
      ...settings,
      ...updates
    });
  }, [settings, onSettingsChange, uploadFileToServer, showNotification]);

  const validateAndSelectFile = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'bodyTexture' | 'overlay' | 'overlay2'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Set loading state
    setIsProcessingFile(prev => ({ ...prev, [type]: true }));

    // Enhanced format validation with specific error messages
    const validTypes = /^(image|video)\/(jpeg|jpg|png|gif|webm)$/;
    if (!file.type || !file.type.match(validTypes)) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let errorMessage = 'Please select a valid file (JPG, PNG, GIF, WebM)';
      
      if (fileExtension) {
        if (['jpg', 'jpeg', 'png', 'gif', 'webm'].includes(fileExtension)) {
          errorMessage = `File appears to be ${fileExtension.toUpperCase()} but has invalid MIME type. Try re-saving the file.`;
        } else {
          errorMessage = `${fileExtension.toUpperCase()} files are not supported. Please use JPG, PNG, GIF, or WebM.`;
        }
      }
      
      showNotification(errorMessage, 'error');
      event.target.value = '';
      setIsProcessingFile(prev => ({ ...prev, [type]: false }));
      return;
    }
    
    // Enhanced size validation with contextual messages
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const actualSizeMB = (file.size / 1024 / 1024).toFixed(1);
      showNotification(
        `File too large (${actualSizeMB}MB)! Maximum size is 5MB. Try compressing or resizing the file.`, 
        'error'
      );
      event.target.value = '';
      setIsProcessingFile(prev => ({ ...prev, [type]: false }));
      return;
    }
    
    // Check for empty or corrupted files
    if (file.size === 0) {
      showNotification('File appears to be empty or corrupted. Please try a different file.', 'error');
      event.target.value = '';
      setIsProcessingFile(prev => ({ ...prev, [type]: false }));
      return;
    }
    
    // Show file size warning if applicable
    const sizeWarning = getFileSizeWarning(file.size);
    if (sizeWarning) {
      showNotification(sizeWarning, file.size > 4 * 1024 * 1024 ? 'warning' : 'success');
    }
    
    try {
      // Create blob URL for immediate preview
      const blobUrl = URL.createObjectURL(file);
      handleFileSelect(file, blobUrl, type);
    } catch (error) {
      console.error('Failed to create blob URL:', error);
      showNotification('Failed to process file. Please try again.', 'error');
      event.target.value = '';
    } finally {
      // Clear loading state
      setIsProcessingFile(prev => ({ ...prev, [type]: false }));
    }
  }, [handleFileSelect, showNotification, getFileSizeWarning]);

  // Mode change handlers - use single state update to ensure re-render
  const handleBodyTextureModeChange = (mode: 'url' | 'upload') => {
    console.log('Body texture mode change:', mode, 'current:', settings.bodyTextureMode);
    
    if (mode === 'url') {
      // Switching to URL mode - clear file data
      if (settings.bodyTextureBlobUrl && settings.bodyTextureBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(settings.bodyTextureBlobUrl);
        activeBlobUrls.current.delete(settings.bodyTextureBlobUrl);
      }
      if (bodyTextureFileRef.current) {
        bodyTextureFileRef.current.value = '';
      }
      
      // Single state update with all changes
      onSettingsChange({
        ...settings,
        bodyTextureMode: mode,
        bodyTextureFile: null,
        bodyTextureBlobUrl: '',
        bodyTextureTempId: undefined,
        bodyTextureBase64: undefined
      });
    } else {
      // Switching to upload mode - clear URL
      setTempBodyTextureUrl('');
      
      // Single state update
      updateSetting('bodyTextureMode', mode);
    }
  };

  const handleOverlayModeChange = (mode: 'url' | 'upload', overlayNum: 1 | 2 = 1) => {
    console.log('Overlay mode change:', mode, 'overlay:', overlayNum);
    
    if (overlayNum === 1) {
      if (mode === 'url') {
        // Switching to URL mode - clear file data
        if (settings.overlayBlobUrl && settings.overlayBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl);
          activeBlobUrls.current.delete(settings.overlayBlobUrl);
        }
        if (overlayFileRef.current) {
          overlayFileRef.current.value = '';
        }
        
        // Single state update with all changes
        onSettingsChange({
          ...settings,
          overlayMode: mode,
          overlayFile: null,
          overlayBlobUrl: '',
          overlayTempId: undefined,
          overlayBase64: undefined
        });
      } else {
        // Switching to upload mode - clear URL
        setTempOverlayUrl('');
        updateSetting('overlayMode', mode);
      }
    } else {
      if (mode === 'url') {
        // Switching to URL mode - clear file data
        if (settings.overlayBlobUrl2 && settings.overlayBlobUrl2.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl2);
          activeBlobUrls.current.delete(settings.overlayBlobUrl2);
        }
        if (overlayFileRef2.current) {
          overlayFileRef2.current.value = '';
        }
        
        // Single state update with all changes
        onSettingsChange({
          ...settings,
          overlayMode2: mode,
          overlayFile2: null,
          overlayBlobUrl2: '',
          overlayTempId2: undefined,
          overlayBase64_2: undefined
        });
      } else {
        // Switching to upload mode - clear URL
        setTempOverlayUrl2('');
        updateSetting('overlayMode2', mode);
      }
    }
  };

  const handleApplyOverlay = () => {
    let appliedCount = 0;
    
    // Handle primary overlay
    if (settings.overlayMode === 'url' && tempOverlayUrl.trim()) {
      updateSetting('overlayUrl', tempOverlayUrl.trim());
      appliedCount++;
    } else if (settings.overlayMode === 'upload' && settings.overlayFile && settings.overlayBlobUrl) {
      updateSetting('overlayUrl', settings.overlayBlobUrl);
      appliedCount++;
    }
    
    // Handle secondary overlay if dual is enabled
    if (settings.dualOverlay) {
      if (settings.overlayMode2 === 'url' && tempOverlayUrl2.trim()) {
        updateSetting('overlayUrl2', tempOverlayUrl2.trim());
        appliedCount++;
      } else if (settings.overlayMode2 === 'upload' && settings.overlayFile2 && settings.overlayBlobUrl2) {
        updateSetting('overlayUrl2', settings.overlayBlobUrl2);
        appliedCount++;
      }
    }
    
    if (appliedCount > 0) {
      const message = settings.dualOverlay 
        ? `Applied ${appliedCount} face image${appliedCount > 1 ? 's' : ''}` 
        : 'Face image applied successfully';
      showNotification(message, 'success');
    } else {
      showNotification('No face images to apply. Please select an image first.', 'warning');
    }
  };

  const handleApplyBodyTexture = () => {
    if (settings.bodyTextureMode === 'url' && tempBodyTextureUrl.trim()) {
      updateSetting('bodyTextureUrl', tempBodyTextureUrl.trim());
      showNotification('Body texture applied successfully', 'success');
    } else if (settings.bodyTextureMode === 'upload' && settings.bodyTextureFile && settings.bodyTextureBlobUrl) {
      updateSetting('bodyTextureUrl', settings.bodyTextureBlobUrl);
      showNotification('Body texture applied successfully', 'success');
    } else {
      showNotification('No body texture to apply. Please select a texture first.', 'warning');
    }
  };

  const handleClearOverlay = () => {
    console.log('Clear button clicked - before clear:', {
      currentOverlayUrl: settings.overlayUrl,
      currentOverlayUrl2: settings.overlayUrl2,
      tempOverlayUrl,
      tempOverlayUrl2,
      overlayMode: settings.overlayMode,
      overlayMode2: settings.overlayMode2
    });
    
    // Clear temp fields
    setTempOverlayUrl('');
    setTempOverlayUrl2('');
    
    // Cleanup blob URLs to prevent memory leaks
    if (settings.overlayBlobUrl && settings.overlayBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(settings.overlayBlobUrl);
      activeBlobUrls.current.delete(settings.overlayBlobUrl);
    }
    if (settings.overlayBlobUrl2 && settings.overlayBlobUrl2.startsWith('blob:')) {
      URL.revokeObjectURL(settings.overlayBlobUrl2);
      activeBlobUrls.current.delete(settings.overlayBlobUrl2);
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
      overlayBlobUrl2: '',
      overlayTempId: undefined,
      overlayTempId2: undefined,
      overlayBase64: undefined,
      overlayBase64_2: undefined
      // Don't reset modes - keep current modes but clear content
    };
    
    onSettingsChange(clearedSettings);
    showNotification('Face images cleared successfully', 'success');
  };

  const handleClearBodyTexture = () => {
    console.log('Clearing body texture, current mode:', settings.bodyTextureMode);
    
    // Clear temp URL
    setTempBodyTextureUrl('');
    
    // Cleanup blob URL to prevent memory leaks
    if (settings.bodyTextureBlobUrl && settings.bodyTextureBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(settings.bodyTextureBlobUrl);
      activeBlobUrls.current.delete(settings.bodyTextureBlobUrl);
    }
    
    // Clear file input
    if (bodyTextureFileRef.current) {
      bodyTextureFileRef.current.value = '';
    }
    
    // Single state update to clear both applied texture and file data
    const clearedSettings = {
      ...settings,
      bodyTextureUrl: '',          // Clear the applied texture (this removes it from the coin)
      bodyTextureFile: null,       // Clear the uploaded file
      bodyTextureBlobUrl: '',      // Clear the blob URL
      bodyTextureTempId: undefined,// Clear the server temp ID
      bodyTextureBase64: undefined // Clear the base64 data
      // Keep the current mode - don't reset it
    };
    
    onSettingsChange(clearedSettings);
    showNotification('Body texture cleared successfully', 'success');
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
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
            {settings.fillMode === 'texture' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Body Texture</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleBodyTextureModeChange('url')}
                      className={`px-3 py-1 text-xs font-medium rounded-l-lg border-2 transition-all ${
                        settings.bodyTextureMode === 'url'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => handleBodyTextureModeChange('upload')}
                      className={`px-3 py-1 text-xs font-medium rounded-r-lg border-2 border-l-0 transition-all ${
                        settings.bodyTextureMode === 'upload'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
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
                      className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                        isProcessingFile.bodyTexture ? 'opacity-75 cursor-wait' : ''
                      }`}
                    >
                      {isProcessingFile.bodyTexture ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <p className="text-sm text-gray-600 mt-2">Processing file...</p>
                        </div>
                      ) : settings.bodyTextureFile ? (
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

                {/* NEW: Texture Mapping Options */}
                {(settings.bodyTextureUrl || settings.bodyTextureBlobUrl) && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Texture Mapping</h4>
                      <p className="text-xs text-gray-500">Control how texture is applied</p>
                    </div>
                    
                    {/* Mapping Type */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Type</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['planar', 'cylindrical', 'spherical'] as const).map((mapping) => (
                          <button
                            key={mapping}
                            onClick={() => updateSetting('bodyTextureMapping', mapping)}
                            className={`p-2 rounded-lg border text-xs font-medium transition-all capitalize ${
                              settings.bodyTextureMapping === mapping
                                ? 'border-blue-500 bg-blue-50 text-blue-500'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {mapping}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Texture Rotation */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Rotation: {settings.bodyTextureRotation}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={settings.bodyTextureRotation}
                        onChange={(e) => updateSetting('bodyTextureRotation', parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Texture Scale */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Scale: {settings.bodyTextureScale}x</label>
                      <input
                        type="range"
                        min="0.1"
                        max="5.0"
                        step="0.1"
                        value={settings.bodyTextureScale}
                        onChange={(e) => updateSetting('bodyTextureScale', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Texture Offset */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Offset X: {settings.bodyTextureOffsetX}</label>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.05"
                        value={settings.bodyTextureOffsetX}
                        onChange={(e) => updateSetting('bodyTextureOffsetX', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600">Offset Y: {settings.bodyTextureOffsetY}</label>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.05"
                        value={settings.bodyTextureOffsetY}
                        onChange={(e) => updateSetting('bodyTextureOffsetY', parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* NEW: Body GIF Speed Control */}
                {(settings.bodyTextureUrl?.includes('.gif') || settings.bodyTextureFile?.type === 'image/gif') && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">GIF Animation Speed</h4>
                      <p className="text-xs text-gray-500">Control texture animation speed</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['slow', 'normal', 'fast'] as const).map((speed) => (
                        <button
                          key={speed}
                          onClick={() => updateSetting('bodyGifSpeed', speed)}
                          className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                            settings.bodyGifSpeed === speed
                              ? 'bg-blue-50 text-blue-500 border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
            
            <div className="space-y-4">
              {/* Primary Overlay */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {settings.dualOverlay ? 'Front Image' : 'Face Image'}
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleOverlayModeChange('url', 1)}
                      className={`px-3 py-1 text-xs font-medium rounded-l-lg border-2 transition-all ${
                        settings.overlayMode === 'url'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => handleOverlayModeChange('upload', 1)}
                      className={`px-3 py-1 text-xs font-medium rounded-r-lg border-2 border-l-0 transition-all ${
                        settings.overlayMode === 'upload'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
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
                      className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                        isProcessingFile.overlay ? 'opacity-75 cursor-wait' : ''
                      }`}
                    >
                      {isProcessingFile.overlay ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <p className="text-sm text-gray-600 mt-2">Processing file...</p>
                        </div>
                      ) : settings.overlayFile ? (
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
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => handleOverlayModeChange('url', 2)}
                        className={`px-3 py-1 text-xs font-medium rounded-l-lg border-2 transition-all ${
                          settings.overlayMode2 === 'url'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        onClick={() => handleOverlayModeChange('upload', 2)}
                        className={`px-3 py-1 text-xs font-medium rounded-r-lg border-2 border-l-0 transition-all ${
                          settings.overlayMode2 === 'upload'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        Upload
                      </button>
                    </div>
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
                        className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                          isProcessingFile.overlay2 ? 'opacity-75 cursor-wait' : ''
                        }`}
                      >
                        {isProcessingFile.overlay2 ? (
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <p className="text-sm text-gray-600 mt-2">Processing file...</p>
                          </div>
                        ) : settings.overlayFile2 ? (
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

              {/* Overlay Metallic Intensity Controls */}
              {settings.overlayMetallic && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Overlay Metalness */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Metalness</h4>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        {(['low', 'normal', 'high'] as const).map((metalness) => (
                          <button
                            key={metalness}
                            onClick={() => updateSetting('overlayMetalness', metalness)}
                            className={`p-2 rounded-lg text-xs font-medium transition-all capitalize border ${
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

                    {/* Overlay Roughness */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Roughness</h4>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        {(['low', 'normal', 'high'] as const).map((roughness) => (
                          <button
                            key={roughness}
                            onClick={() => updateSetting('overlayRoughness', roughness)}
                            className={`p-2 rounded-lg text-xs font-medium transition-all capitalize border ${
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
                  </div>
                </div>
              )}
            </div>

            {/* Overlay GIF Speed Control */}
            {((settings.overlayUrl && settings.overlayUrl.includes('.gif')) || 
              settings.overlayFile?.type === 'image/gif' ||
              (settings.overlayUrl2 && settings.overlayUrl2.includes('.gif')) || 
              settings.overlayFile2?.type === 'image/gif') && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Overlay GIF Speed</h4>
                  <p className="text-xs text-gray-500">Control overlay animation speed</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'normal', 'fast'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateSetting('overlayGifSpeed', speed)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${
                        settings.overlayGifSpeed === speed
                          ? 'bg-blue-50 text-blue-500 border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
