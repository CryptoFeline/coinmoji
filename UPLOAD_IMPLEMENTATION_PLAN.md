# 📋 **File Upload Implementation Plan**

## **✅ PHASE 1: COMPLETE** *(Implemented & Tested)*

### **🎯 Core Upload System**
**Status:** ✅ **COMPLETED** - All func---

## **✅ PHASE 2: COMPLETE** *(Implemented & Tested)*

### **🎯 Enhanced File Processing & UI Improvements**
**Status:** ✅ **COMPLETED** - All functionality working perfectly

**What was implemented:**
- ✅ **Loading States & Progress Indicators** - Visual feedback during file operations
  - Added loading state management for all file upload types (body, overlay, overlay2)
  - Implemented spinning loading indicators during file processing
  - Added visual feedback to prevent user confusion during file operations

- ✅ **Toast Notification System** - Replaced alert() with proper notifications
  - Success, error, and warning notification types with color-coded styling
  - Auto-hide after 4 seconds with manual close option
  - Positioned as floating toast in top-right corner (z-index 60)
  - User-friendly messages for all file operations

- ✅ **Progressive File Size Warnings** - Smart feedback based on file size
  - 1MB+: Basic file size info notification
  - 2MB+: Medium file processing notification
  - 4MB+: Large file warning about potential slowdown
  - 5MB: Hard limit with error notification

- ✅ **Enhanced Error Handling** - Better user experience
  - Format validation with clear error messages
  - Size validation with helpful suggestions
  - Loading state management prevents duplicate uploads
  - Contextual feedback for all file operations

**Technical Implementation:**
```typescript
// Loading state management
const [isProcessingFile, setIsProcessingFile] = useState<{
  bodyTexture: boolean;
  overlay: boolean;
  overlay2: boolean;
}>({ bodyTexture: false, overlay: false, overlay2: false });

// Toast notification system
const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  setNotification({ message, type, visible: true });
  setTimeout(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, 4000);
}, []);

// Progressive file size warnings
const getFileSizeWarning = (size: number): string | null => {
  const mb = size / (1024 * 1024);
  if (mb >= 4) return `⚠️ Large file (${mb.toFixed(1)}MB) - may slow down preview`;
  else if (mb >= 2) return `📊 Medium file (${mb.toFixed(1)}MB) - processing...`;
  else if (mb >= 1) return `📁 File size: ${mb.toFixed(1)}MB`;
  return null;
};
```

**UI Enhancements:**
- ✅ **Loading Spinners** - Animated indicators during file processing
- ✅ **Visual States** - Clear distinction between loading, success, and empty states  
- ✅ **File Size Display** - Real-time file size information in KB
- ✅ **Toast Notifications** - Color-coded success/error/warning messages
- ✅ **Progressive Feedback** - Different notification types based on file size

---

## **🔄 PHASE 3: Memory Optimization & User Experience**
**Status:** 🔄 **READY TO IMPLEMENT** - Final phase for production polish

### **🎯 Core Objectives**
- **Memory Optimization** - Better handling of large files and blob URL cleanup
- **Chrome Timeout Prevention** - Optimizations for export process with uploaded files
- **User Experience Polish** - Final touches for production readiness
- **Edge Case Handling** - Robust handling of unusual file types and scenarios

### **Implementation Priority**
1. 🔄 **Blob URL Lifecycle Management** - Automatic cleanup and memory optimization
2. 🔄 **Export Process Integration** - Ensure uploaded files work seamlessly with WebM export
3. 🔄 **Edge Case Handling** - Better handling of corrupted files, network issues
4. 🔄 **Performance Monitoring** - Track memory usage and processing times

---as expected

**What was implemented:**
- ✅ **Server-side upload handler** - `netlify/functions/upload-temp-file.ts`
  - Multipart form data parsing with proper Buffer handling
  - File validation (JPG, PNG, GIF, WebM, 5MB limit)
  - Temporary file storage in `/tmp` with 5-minute expiry
  - UUID-based file naming and secure cleanup

- ✅ **Enhanced Settings Interface** - `src/components/SettingsPanel.tsx`
  - Added 9 new upload-related fields to CoinSettings interface
  - URL/Upload mode switching with proper two-button toggle UI
  - File upload handlers with client-side validation
  - Blob URL management with memory leak prevention

- ✅ **Consistent Apply/Clear System**
  - Single Apply/Clear button pair for all texture types (body, overlay 1, overlay 2)
  - Apply handles both URL and Upload modes automatically
  - Clear properly removes applied textures AND clears UI state
  - Mode switching preserves user data appropriately

**Technical Implementation Details:**
```typescript
// Enhanced CoinSettings interface
interface CoinSettings {
  // Body texture upload support
  bodyTextureMode: 'url' | 'upload';
  bodyTextureFile: File | null;
  bodyTextureBlobUrl: string;
  
  // Face overlay upload support
  overlayMode: 'url' | 'upload';
  overlayFile: File | null;
  overlayBlobUrl: string;
  overlayMode2: 'url' | 'upload';
  overlayFile2: File | null;
  overlayBlobUrl2: string;
  
  // ... existing settings preserved
}

// Mode change handlers with single state updates
const handleBodyTextureModeChange = (mode: 'url' | 'upload') => {
  // Single state update prevents React batching issues
  onSettingsChange({
    ...settings,
    bodyTextureMode: mode,
    // Clear opposite mode's data
  });
};
```

**UI Components Implemented:**
- ✅ **Two-button toggle system** (URL | Upload) matching existing UI patterns
- ✅ **Drag-and-drop file zones** with visual feedback and file info display
- ✅ **File validation** with user-friendly error messages
- ✅ **Blob URL preview system** for immediate visual feedback
- ✅ **Memory management** with automatic blob URL cleanup

**Issues Resolved:**
- ✅ Upload to URL toggle not working (fixed with single state updates)
- ✅ Duplicate clear buttons (consolidated to single Apply/Clear pair)
- ✅ Clear not removing applied textures (fixed state update logic)
- ✅ File input cleanup when switching modes

---

## **📱 Client-Side Implementation**

### **1. Settings Interface Redesign**

**SettingsPanel.tsx Changes:**
```typescript
interface CoinSettings {
  // ... existing settings ...
  
  // Enhanced texture handling
  bodyTextureMode: 'url' | 'upload';
  bodyTextureUrl: string;
  bodyTextureFile: File | null;
  bodyTextureBlobUrl: string; // For preview
  
  overlayMode: 'url' | 'upload';
  overlayUrl: string;
  overlayFile: File | null;
  overlayBlobUrl: string;
  
  overlayMode2: 'url' | 'upload'; // For dual overlay
  overlayUrl2: string;
  overlayFile2: File | null;
  overlayBlobUrl2: string;
}
```

**UI Components:**
- ✅ **Toggle Switches**: URL ↔ Upload mode for each texture type (implemented as two-button system)
- ✅ **File Upload Button**: Upload file with format validation
- ✅ **Preview Filenames**: Show selected files with clear/replace options [using icons]
- 🔄 **Progress Indicators**: Upload status and file size validation (spinner icon) - Phase 2

### **2. File Handling & Preview System**

**File Upload Component:**
```typescript
const FileUploadZone = ({ 
  accept, 
  onFileSelect, 
  currentFile, 
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const handleFileSelect = useCallback((file: File) => {
    // Validate format
    if (!file.type.match(/^(image|video)\/(jpeg|jpg|png|gif|webm)$/)) {
      alert('Please select a valid file (JPG, PNG, GIF, WebM)');
      return;
    }
    
    // Validate size
    if (file.size > maxSize) {
      alert(`File too large! Please select a file smaller than ${maxSize / 1024 / 1024}MB`);
      return;
    }
    
    // Create blob URL for immediate preview
    const blobUrl = URL.createObjectURL(file);
    onFileSelect(file, blobUrl);
  }, [onFileSelect, maxSize]);
  
  // ... upload button implementation
};
```

**Blob URL Management:**
- ✅ **Create blob URLs** immediately for client-side render preview
- ✅ **Cleanup old blob URLs** when files change to prevent memory leaks
- ✅ **Automatic disposal** when component unmounts

### **3. CoinEditor.tsx Integration**

**Enhanced Texture Loading:**
```typescript
const createTextureFromSource = async (
  mode: 'url' | 'upload',
  url?: string,
  file?: File,
  blobUrl?: string
): Promise<THREE.Texture> => {
  if (mode === 'upload' && blobUrl) {
    // Use blob URL for immediate preview
    return createTextureFromUrl(blobUrl);
  } else if (mode === 'url' && url) {
    // Use URL with CORS handling
    return createTextureFromUrl(url);
  }
  throw new Error('Invalid texture source');
};
```

---

## **� PHASE 2: Enhanced File Processing & UI Improvements**
**Status:** 🔄 **IN PROGRESS** - Ready to implement

### **🎯 Core Objectives**
- **Progress Indicators & Loading States** - Visual feedback for file operations and mode switching
- **Enhanced Error Handling** - Better user feedback with toast notifications
- **File Processing Optimization** - Better handling of large files and edge cases
- **UI Polish** - Loading spinners, file size warnings, and improved user experience

### **Implementation Priority**
1. 🔄 **Loading States & Progress Indicators** - Show feedback during file selection and mode changes
2. 🔄 **Enhanced Error Handling** - Replace alert() with proper toast notifications
3. 🔄 **File Size Warnings** - Progressive warnings for large files (1MB+, 3MB+, 5MB)
4. 🔄 **UI Polish** - Loading spinners, better visual feedback, edge case handling

---

## **�🖥️ Server-Side Implementation**

### **1. Temporary File Upload Handler**

**New Function: `netlify/functions/upload-temp-file.ts`**
```typescript
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // Parse multipart form data
    const contentType = event.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    
    if (!boundary) {
      throw new Error('No boundary found in Content-Type');
    }

    // Parse file from multipart data
    const { file, filename, mimetype } = parseMultipartData(event.body, boundary);
    
    // Validate file type
    if (!mimetype.match(/^(image|video)\/(jpeg|jpg|png|gif|webm)$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported file type' })
      };
    }

    // Generate unique temporary filename
    const tempId = crypto.randomUUID();
    const extension = path.extname(filename);
    const tempFilename = `temp_${tempId}${extension}`;
    const tempPath = path.join('/tmp', tempFilename);

    // Write file to /tmp
    await writeFile(tempPath, file);

    // Return temporary file info
    return {
      statusCode: 200,
      body: JSON.stringify({
        tempId,
        tempPath,
        filename: tempFilename,
        originalName: filename,
        mimetype,
        size: file.length,
        // Auto-expire after 5 minutes
        expiresAt: Date.now() + 5 * 60 * 1000 // Add expiry log when happens and if user process is still ongoing
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Upload failed' })
    };
  }
};
```

### **2. Enhanced render-frames.ts**

**File Resolution Strategy:**
```typescript
interface FileSource {
  mode: 'url' | 'upload';
  url?: string;
  tempId?: string;
  tempPath?: string;
}

interface EnhancedRenderRequest {
  settings: {
    // ... existing settings ...
    bodyTexture?: FileSource;
    overlay?: FileSource;
    overlay2?: FileSource;
  };
  // ... existing fields
}

// Pre-load all textures before rendering starts
const preloadTextures = async (settings: RenderSettings) => {
  const texturesToLoad: Array<{name: string, source: FileSource}> = [];
  
  if (settings.bodyTexture) {
    texturesToLoad.push({ name: 'bodyTexture', source: settings.bodyTexture });
  }
  if (settings.overlay) {
    texturesToLoad.push({ name: 'overlay', source: settings.overlay });
  }
  if (settings.overlay2) {
    texturesToLoad.push({ name: 'overlay2', source: settings.overlay2 });
  }

  console.log(`🎯 Pre-loading ${texturesToLoad.length} textures to prevent Chrome timeout...`);
  
  const loadedTextures: Record<string, string> = {};
  
  for (const texture of texturesToLoad) {
    if (texture.source.mode === 'upload' && texture.source.tempPath) {
      // Convert temp file to data URL for browser injection
      const fileBuffer = await readFile(texture.source.tempPath);
      const mimetype = getMimetype(texture.source.tempPath);
      const dataUrl = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
      loadedTextures[texture.name] = dataUrl;
      
      console.log(`✅ Pre-loaded temp file ${texture.name}: ${(fileBuffer.length/1024).toFixed(1)}KB`);
    } else if (texture.source.mode === 'url' && texture.source.url) {
      // For URLs, we'll let the browser handle them directly
      loadedTextures[texture.name] = texture.source.url;
      
      console.log(`✅ Pre-loaded URL ${texture.name}: ${texture.source.url}`);
    }
  }
  
  return loadedTextures;
};
```

**GIF Pre-processing Strategy:**
```typescript
const preProcessGIFs = async (textures: Record<string, string>) => {
  const processedTextures: Record<string, any> = {};
  
  for (const [name, source] of Object.entries(textures)) {
    if (source.startsWith('data:image/gif') || source.endsWith('.gif')) {
      console.log(`🎞️ Pre-processing GIF: ${name}`);
      
      // Extract GIF frames before rendering starts
      const frames = await extractGIFFrames(source);
      processedTextures[name] = {
        type: 'gif',
        frames,
        source
      };
      
      console.log(`✅ GIF pre-processed: ${frames.length} frames`);
    } else {
      processedTextures[name] = {
        type: 'static',
        source
      };
    }
  }
  
  return processedTextures;
};
```

### **3. File Cleanup System**

**Post-Render Cleanup:**
```typescript
const cleanupTempFiles = async (sources: FileSource[]) => {
  console.log('🧹 Cleaning up temporary files...');
  
  for (const source of sources) {
    if (source.mode === 'upload' && source.tempPath) {
      try {
        await rm(source.tempPath);
        console.log(`✅ Cleaned up: ${source.tempPath}`);
      } catch (error) {
        console.warn(`⚠️ Failed to cleanup ${source.tempPath}:`, error);
      }
    }
  }
};

// In main handler:
try {
  // ... render frames ...
  
  return {
    statusCode: 200,
    body: JSON.stringify({ frames })
  };
} finally {
  // Always cleanup, regardless of success/failure
  const sources = [
    request.settings.bodyTexture,
    request.settings.overlay,
    request.settings.overlay2
  ].filter(Boolean) as FileSource[];
  
  await cleanupTempFiles(sources);
}
```

---

## **🔄 Integration Flow**

### **Client-Side Upload Flow:**
1. **User selects file** → Immediate blob URL preview
2. **User initiates export** → Upload files to temp storage
3. **Get temp IDs** → Pass to render-frames function
4. **Render completes** → Server auto-cleans temp files

### **Server-Side Processing Flow:**
1. **Receive render request** with mixed URL/upload sources
2. **Pre-load all textures** (convert uploads to data URLs)
3. **Pre-process GIFs** (extract frames to prevent timeout)
4. **Inject textures into browser** before scene creation
5. **Render frames** with pre-loaded content
6. **Cleanup temp files** in finally block

---

## **⚡ Performance Optimizations**

### **1. Chrome Timeout Prevention:**
- **Pre-load all textures** before browser scene creation
- **Convert GIFs to frame arrays** server-side
- **Use data URLs** instead of file system access in browser

### **2. Memory Management:**
- **Immediate blob URL cleanup** on client
- **Automatic temp file expiration** (5 minutes)
- **Garbage collection triggers** after large file processing
- **Stream processing** for large files (avoid loading entire file into memory)

### **3. Size Validation:**
- **Client-side validation** before upload (5MB limit - suggest WebM instead of GIF if too large)
- **Server-side validation** as backup
- **Progressive upload** with progress indicators
- **Automatic compression** for oversized images

---

## **🛡️ Error Handling & Fallbacks**

### **1. Upload Failures:**
- **Retry mechanism** with exponential backoff
- **Fallback to URL mode** if upload fails
- **Clear error messages** with actionable suggestions
- **Automatic cleanup** of partial uploads

### **2. CORS Issues:**
- **Enhanced CORS detection** with specific error messages
- **Suggest upload mode** when URL fails
- **Provide CORS troubleshooting** tips
- **Graceful degradation** to supported sources

### **3. File Format Issues:**
- **Format validation** before processing
- **Automatic format conversion** when possible
- **Clear format requirements** in UI
- **Fallback suggestions** for unsupported formats

---

## **📊 Implementation Priority**

### **Phase 1: Core Upload System**
1. ✅ Temporary file upload handler
2. ✅ Settings panel mode switching UI
3. ✅ Client-side file validation
4. ✅ Basic server-side integration

### **Phase 2: Advanced Features**
1. ✅ GIF pre-processing optimization
2. ✅ Dual overlay upload support
3. ✅ Progress indicators and status
4. ✅ Comprehensive error handling

### **Phase 3: Performance & Polish**
1. ✅ Memory optimization
2. ✅ Chrome timeout prevention
3. ✅ User experience improvements
4. ✅ Edge case handling

---

**Status**: Plan documented - ready for implementation when file upload feature is prioritized.
