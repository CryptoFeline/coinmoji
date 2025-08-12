import React, { useState, useCallback, useRef, useEffect } from 'react';

// MUI Icons
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LayersIcon from '@mui/icons-material/Layers';
import LightModeIcon from '@mui/icons-material/LightMode';

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
  bodyGlow: boolean;              // NEW: Enable glow effect for body
  bodyGlowScale: number;          // NEW: Glow size/spread control (1.0 - 1.5)
  bodyGlowIntensity: number;      // NEW: Glow brightness control (0.5 - 5.0)
  bodyGlowSharpness: number;      // NEW: Glow edge sharpness (0.1 - 2.0)
  
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
  overlayGlow: boolean;           // NEW: Enable glow effect for overlays
  overlayGlowScale: number;       // NEW: Overlay glow size/spread control (1.0 - 1.5)
  overlayGlowIntensity: number;   // NEW: Overlay glow brightness control (0.5 - 5.0)
  overlayGlowSharpness: number;   // NEW: Overlay glow edge sharpness (0.1 - 2.0)
  overlayGifSpeed: 'slow' | 'normal' | 'fast';  // RENAMED: from gifAnimationSpeed
  overlayRotation: number;        // NEW: 0-360 degrees overlay rotation
  overlayScale: number;           // NEW: 0.1-5.0 overlay scale multiplier
  overlayOffsetX: number;         // NEW: -1 to 1 overlay offset X
  overlayOffsetY: number;         // NEW: -1 to 1 overlay offset Y
  
  // Dual Overlay Settings
  dualOverlay: boolean;
  overlayUrl2: string;
  overlayMode2: 'url' | 'upload';
  overlayFile2: File | null;
  overlayBlobUrl2: string;
  
  // Animation Settings (NEW SYSTEM)
  animationDirection: 'right' | 'left' | 'up' | 'down';  // NEW: Replace rotationSpeed
  animationPreset: 'smooth' | 'fast-slow' | 'bounce';  // NEW: Replace easing with presets
  animationDuration: number;      // NEW: Duration in seconds (default: 3)
  
  // Lighting Settings
  lightColor: string;
  lightStrength: 'low' | 'medium' | 'high';
  lightMode: 'studioLight' | 'naturalLight'; // NEW: Light position presets
  
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
  
  // Utility to truncate long filenames
  const truncateFilename = (filename: string, maxLength: number = 25): string => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.slice(0, maxLength - 3 - (extension?.length || 0));
    return `${truncatedName}...${extension ? '.' + extension : ''}`;
  };

  // Check if a file or URL is animated (GIF or WebM)
  const isAnimatedFile = (file: File | null, url: string): boolean => {
    if (file) {
      return file.type === 'image/gif' || file.type === 'video/webm';
    }
    if (url) {
      const lowercaseUrl = url.toLowerCase();
      return lowercaseUrl.includes('.gif') || lowercaseUrl.includes('.webm');
    }
    return false;
  };
  
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
        ${checked ? 'peer-checked:bg-gray-400' : ''} 
        ${disabled ? 'cursor-not-allowed' : ''}
      `} />
    </label>
  );

  // Upload file to server for processing
  const uploadFileToServer = useCallback(async (file: File): Promise<{
    tempId: string;
    base64Data: string;
    mimetype: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Uploading file to server:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const response = await fetch('/.netlify/functions/send-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed with status:', response.status, errorText);
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
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
      
      console.log('✅ File uploaded successfully:', {
        type,
        tempId,
        hasBase64: !!base64Data
      });
    } catch (error) {
      console.warn('⚠️ Background upload failed (preview still available):', error);
      // Don't show error notification - preview still works
      // User will see error only if they try to export/download
    }

    // Build updates object based on type
    const updates: Partial<CoinSettings> = {};
    
    if (type === 'bodyTexture') {
      updates.bodyTextureFile = file;
      updates.bodyTextureBlobUrl = blobUrl;
      if (tempId) updates.bodyTextureTempId = tempId;
      if (base64Data) updates.bodyTextureBase64 = base64Data;
    } else if (type === 'overlay') {
      updates.overlayFile = file;
      updates.overlayBlobUrl = blobUrl;
      if (tempId) updates.overlayTempId = tempId;
      if (base64Data) updates.overlayBase64 = base64Data;
    } else if (type === 'overlay2') {
      updates.overlayFile2 = file;
      updates.overlayBlobUrl2 = blobUrl;
      if (tempId) updates.overlayTempId2 = tempId;
      if (base64Data) updates.overlayBase64_2 = base64Data;
    }

    // Single state update for immediate preview
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
        // Clear file data for overlay 1
        if (settings.overlayBlobUrl && settings.overlayBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl);
          activeBlobUrls.current.delete(settings.overlayBlobUrl);
        }
        if (overlayFileRef.current) {
          overlayFileRef.current.value = '';
        }
        
        onSettingsChange({
          ...settings,
          overlayMode: mode,
          overlayFile: null,
          overlayBlobUrl: '',
          overlayTempId: undefined,
          overlayBase64: undefined
        });
      } else {
        // Clear URL for overlay 1
        setTempOverlayUrl('');
        updateSetting('overlayMode', mode);
      }
    } else {
      if (mode === 'url') {
        // Clear file data for overlay 2
        if (settings.overlayBlobUrl2 && settings.overlayBlobUrl2.startsWith('blob:')) {
          URL.revokeObjectURL(settings.overlayBlobUrl2);
          activeBlobUrls.current.delete(settings.overlayBlobUrl2);
        }
        if (overlayFileRef2.current) {
          overlayFileRef2.current.value = '';
        }
        
        onSettingsChange({
          ...settings,
          overlayMode2: mode,
          overlayFile2: null,
          overlayBlobUrl2: '',
          overlayTempId2: undefined,
          overlayBase64_2: undefined
        });
      } else {
        // Clear URL for overlay 2
        setTempOverlayUrl2('');
        updateSetting('overlayMode2', mode);
      }
    }
  };

  const handleApplyOverlay = () => {
    let hasApplied = false;
    let message = '';
    
    // Primary overlay
    if (settings.overlayMode === 'url' && tempOverlayUrl.trim()) {
      updateSetting('overlayUrl', tempOverlayUrl.trim());
      hasApplied = true;
      message = 'Face image applied successfully';
    } else if (settings.overlayMode === 'upload' && settings.overlayFile && settings.overlayBlobUrl) {
      updateSetting('overlayUrl', settings.overlayBlobUrl);
      hasApplied = true;
      message = 'Face image applied successfully';
    }
    
    // Secondary overlay (if dual overlay is enabled)
    if (settings.dualOverlay) {
      if (settings.overlayMode2 === 'url' && tempOverlayUrl2.trim()) {
        updateSetting('overlayUrl2', tempOverlayUrl2.trim());
        hasApplied = true;
        message = message.includes('applied') ? 'Face images applied successfully' : 'Back face image applied successfully';
      } else if (settings.overlayMode2 === 'upload' && settings.overlayFile2 && settings.overlayBlobUrl2) {
        updateSetting('overlayUrl2', settings.overlayBlobUrl2);
        hasApplied = true;
        message = message.includes('applied') ? 'Face images applied successfully' : 'Back face image applied successfully';
      }
    }
    
    if (hasApplied) {
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
                <CategoryIcon className="w-5 h-5 mr-2 text-amber-500" />
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
                        ? 'border-amber-500 bg-amber-50 text-amber-600'
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
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
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
              
              {/* Animation Presets */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Animation Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'smooth', label: 'Smooth' },
                    { key: 'fast-slow', label: 'Fast-Slow' },
                    { key: 'bounce', label: 'Bounce' }
                  ] as const).map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => updateSetting('animationPreset', preset.key)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        settings.animationPreset === preset.key
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== BODY MATERIAL SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ColorLensIcon className="w-5 h-5 mr-2 text-green-600" />
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
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Solid
                </button>
                <button
                  onClick={() => updateSetting('fillMode', 'gradient')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.fillMode === 'gradient'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => updateSetting('fillMode', 'texture')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.fillMode === 'texture'
                      ? 'border-green-500 bg-green-50 text-green-600'
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
                                ? 'bg-green-50 text-green-600 border-green-500'
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
                                ? 'bg-green-50 text-green-600 border-green-500'
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

            {/* Body Glow Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 font-medium text-sm">Body Glow Effect</span>
                  <p className="text-xs text-gray-500">Adds luminous rim glow to coin body</p>
                </div>
                <Toggle 
                  checked={settings.bodyGlow} 
                  onChange={(checked) => updateSetting('bodyGlow', checked)} 
                />
              </div>
              
              {/* Glow Parameters - Show when body glow is enabled */}
              {settings.bodyGlow && (
                <div className="space-y-3 pl-4 border-l-2 border-green-200 bg-green-50/30 p-3 rounded-r-lg">
                  {/* Glow Intensity Control */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-800 text-xs font-medium">Intensity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0.5"
                        max="5.0"
                        step="0.1"
                        value={settings.bodyGlowIntensity || 2.2}
                        onChange={(e) => updateSetting('bodyGlowIntensity', parseFloat(e.target.value))}
                        className="w-20 accent-green-400"
                      />
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {(settings.bodyGlowIntensity || 2.2).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Glow Sharpness Control */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-800 text-xs font-medium">Sharpness</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={settings.bodyGlowSharpness || 0.6}
                        onChange={(e) => updateSetting('bodyGlowSharpness', parseFloat(e.target.value))}
                        className="w-20 accent-green-400"
                      />
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {(settings.bodyGlowSharpness || 0.6).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Body Texture Section (Enhanced) */}
            {settings.fillMode === 'texture' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-gray-900">Body Texture</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleApplyBodyTexture}
                      className="bg-white border-2 border-green-500 text-green-600 font-medium py-1 px-3 rounded-lg transition-colors hover:bg-green-50 text-sm"
                    >
                      Apply
                    </button>
                    <button 
                      onClick={handleClearBodyTexture}
                      className="bg-white border-2 border-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors hover:bg-gray-50 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Texture Source Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBodyTextureModeChange('url')}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.bodyTextureMode === 'url'
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => handleBodyTextureModeChange('upload')}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.bodyTextureMode === 'upload'
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {settings.bodyTextureMode === 'url' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Texture URL</label>
                    <input
                      type="url"
                      value={tempBodyTextureUrl}
                      onChange={(e) => setTempBodyTextureUrl(e.target.value)}
                      placeholder="https://example.com/texture.png"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {settings.bodyTextureUrl && (
                      <p className="text-xs text-green-600">✓ Applied: {settings.bodyTextureUrl.substring(0, 50)}...</p>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {settings.bodyTextureMode === 'upload' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select File</label>
                    <input
                      ref={bodyTextureFileRef}
                      type="file"
                      accept="image/*,video/webm,video/mp4"
                      onChange={(e) => validateAndSelectFile(e, 'bodyTexture')}
                      disabled={isProcessingFile.bodyTexture}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {isProcessingFile.bodyTexture && (
                      <div className="flex items-center text-blue-500 text-xs">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent mr-2"></div>
                        Processing file...
                      </div>
                    )}
                    {settings.bodyTextureFile && (
                      <p className="text-xs text-green-600">✓ Selected: {truncateFilename(settings.bodyTextureFile.name)}</p>
                    )}
                  </div>
                )}

                {/* GIF Speed Control for Body Textures - Only show for animated files */}
                {isAnimatedFile(settings.bodyTextureFile, settings.bodyTextureUrl) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">GIF Speed</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['slow', 'normal', 'fast'] as const).map((speed) => (
                        <button
                          key={speed}
                          onClick={() => updateSetting('bodyGifSpeed', speed)}
                          className={`p-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                            settings.bodyGifSpeed === speed
                              ? 'border-green-500 bg-green-50 text-green-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                        {speed}
                      </button>
                    ))}
                  </div>
                  </div>
                )}

                {/* Texture Mapping Mode */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mapping Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['planar', 'cylindrical', 'spherical'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('bodyTextureMapping', mode)}
                        className={`p-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                          settings.bodyTextureMapping === mode
                            ? 'border-green-500 bg-green-50 text-green-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Texture Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {settings.bodyTextureRotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={settings.bodyTextureRotation}
                      onChange={(e) => updateSetting('bodyTextureRotation', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scale: {settings.bodyTextureScale}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={settings.bodyTextureScale}
                      onChange={(e) => updateSetting('bodyTextureScale', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offset X: {settings.bodyTextureOffsetX.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={settings.bodyTextureOffsetX}
                      onChange={(e) => updateSetting('bodyTextureOffsetX', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offset Y: {settings.bodyTextureOffsetY.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={settings.bodyTextureOffsetY}
                      onChange={(e) => updateSetting('bodyTextureOffsetY', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== FACE OVERLAYS SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <LayersIcon className="w-5 h-5 mr-2 text-purple-600" />
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

            {/* Overlay Input Sections */}
            <div className="space-y-4">
              {/* Primary Overlay */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-gray-900">
                    {settings.dualOverlay ? 'Front Face' : 'Face Image'}
                  </h3>
                </div>

                {/* Overlay Mode Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOverlayModeChange('url', 1)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.overlayMode === 'url'
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => handleOverlayModeChange('upload', 1)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.overlayMode === 'upload'
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {settings.overlayMode === 'url' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      value={tempOverlayUrl}
                      onChange={(e) => setTempOverlayUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    {settings.overlayUrl && (
                      <p className="text-xs text-green-600">✓ Applied: {settings.overlayUrl.substring(0, 50)}...</p>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {settings.overlayMode === 'upload' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select File</label>
                    <input
                      ref={overlayFileRef}
                      type="file"
                      accept="image/*,video/webm,video/mp4"
                      onChange={(e) => validateAndSelectFile(e, 'overlay')}
                      disabled={isProcessingFile.overlay}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
                    />
                    {isProcessingFile.overlay && (
                      <div className="flex items-center text-purple-500 text-xs">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-purple-500 border-t-transparent mr-2"></div>
                        Processing file...
                      </div>
                    )}
                    {settings.overlayFile && (
                      <p className="text-xs text-green-600">✓ Selected: {truncateFilename(settings.overlayFile.name)}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Secondary Overlay (only if dual overlay is enabled) */}
              {settings.dualOverlay && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-900">Back Face</h3>
                  </div>

                  {/* Overlay 2 Mode Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOverlayModeChange('url', 2)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        settings.overlayMode2 === 'url'
                          ? 'border-purple-500 bg-purple-50 text-purple-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => handleOverlayModeChange('upload', 2)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        settings.overlayMode2 === 'upload'
                          ? 'border-purple-500 bg-purple-50 text-purple-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  {/* URL Input for Overlay 2 */}
                  {settings.overlayMode2 === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        type="url"
                        value={tempOverlayUrl2}
                        onChange={(e) => setTempOverlayUrl2(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                      {settings.overlayUrl2 && (
                        <p className="text-xs text-green-600">✓ Applied: {settings.overlayUrl2.substring(0, 50)}...</p>
                      )}
                    </div>
                  )}

                  {/* File Upload for Overlay 2 */}
                  {settings.overlayMode2 === 'upload' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select File</label>
                      <input
                        ref={overlayFileRef2}
                        type="file"
                        accept="image/*,video/webm,video/mp4"
                        onChange={(e) => validateAndSelectFile(e, 'overlay2')}
                        disabled={isProcessingFile.overlay2}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
                      />
                      {isProcessingFile.overlay2 && (
                        <div className="flex items-center text-purple-500 text-xs">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-purple-500 border-t-transparent mr-2"></div>
                          Processing file...
                        </div>
                      )}
                      {settings.overlayFile2 && (
                        <p className="text-xs text-green-600">✓ Selected: {truncateFilename(settings.overlayFile2.name)}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Overlay GIF Speed Control - Only show for animated files */}
            {(isAnimatedFile(settings.overlayFile, settings.overlayUrl) || 
              (settings.dualOverlay && isAnimatedFile(settings.overlayFile2, settings.overlayUrl2))) && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">GIF Animation Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'normal', 'fast'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => updateSetting('overlayGifSpeed', speed)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all capitalize ${
                        settings.overlayGifSpeed === speed
                          ? 'border-blue-500 bg-blue-50 text-blue-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button 
                onClick={handleApplyOverlay}
                className="flex-1 bg-white border-2 border-purple-500 text-purple-600 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-purple-50 text-sm"
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
                                ? 'bg-purple-50 text-purple-600 border-purple-500'
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
                                ? 'bg-purple-50 text-purple-600 border-purple-500'
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

            {/* Overlay Glow Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 font-medium text-sm">Overlay Glow Effect</span>
                  <p className="text-xs text-gray-500">Adds luminous rim glow to overlays</p>
                </div>
                <Toggle 
                  checked={settings.overlayGlow} 
                  onChange={(checked) => updateSetting('overlayGlow', checked)} 
                />
              </div>
              
              {/* Overlay Glow Parameters - Show when overlay glow is enabled */}
              {settings.overlayGlow && (
                <div className="space-y-3 pl-4 border-l-2 border-purple-200 bg-purple-50/30 p-3 rounded-r-lg">
                  {/* Overlay Glow Intensity Control */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-800 text-xs font-medium">Intensity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0.5"
                        max="5.0"
                        step="0.1"
                        value={settings.overlayGlowIntensity || 2.8}
                        onChange={(e) => updateSetting('overlayGlowIntensity', parseFloat(e.target.value))}
                        className="w-20 accent-purple-500"
                      />
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {(settings.overlayGlowIntensity || 2.8).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Overlay Glow Sharpness Control */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-800 text-xs font-medium">Sharpness</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={settings.overlayGlowSharpness || 0.7}
                        onChange={(e) => updateSetting('overlayGlowSharpness', parseFloat(e.target.value))}
                        className="w-20 accent-purple-500"
                      />
                      <span className="text-xs text-gray-600 w-12 text-right">
                        {(settings.overlayGlowSharpness || 0.7).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== LIGHTING SECTION ===== */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                <LightModeIcon className="w-5 h-5 mr-2 text-red-500" />
                Lighting
              </h2>
              <p className="text-sm text-gray-500">Scene lighting and atmosphere</p>
            </div>
            
            <div className="space-y-3">
              {/* Light Position Presets */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Light Setup</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'studioLight', label: 'Studio' },
                    { key: 'naturalLight', label: 'Natural' }
                  ] as const).map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => {
                        updateSetting('lightMode', mode.key);
                        // Presets only change light positioning, not color/intensity
                      }}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        settings.lightMode === mode.key
                          ? 'border-red-500 bg-red-50 text-red-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

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
                          ? 'bg-red-50 text-red-500 border-red-500'
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
