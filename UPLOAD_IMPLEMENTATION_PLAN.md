# 📋 **File Upload Implementation Plan**

## **🎯 Overview**
Implement a hybrid texture system supporting both URL-based and file upload approaches for:
- **Body textures** (coin surface)
- **Face overlays** (single or dual overlay mode)
- **All supported formats** (JPG, PNG, GIF, WebM)

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
- **Toggle Switches**: URL ↔ Upload mode for each texture type
- **File Drop Zones**: Drag & drop with format validation
- **Preview Thumbnails**: Show selected files with clear/replace options
- **Progress Indicators**: Upload status and file size validation

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
      alert('Please select a valid image or video file (JPG, PNG, GIF, WebM)');
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
  
  // ... drag/drop implementation
};
```

**Blob URL Management:**
- **Create blob URLs** immediately for client-side preview
- **Cleanup old blob URLs** when files change to prevent memory leaks
- **Automatic disposal** when component unmounts

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

## **🖥️ Server-Side Implementation**

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
        // Auto-expire after 10 minutes
        expiresAt: Date.now() + 10 * 60 * 1000
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
- **Cache processing results** for identical files

### **2. Memory Management:**
- **Immediate blob URL cleanup** on client
- **Automatic temp file expiration** (10 minutes)
- **Garbage collection triggers** after large file processing
- **Stream processing** for large files (avoid loading entire file into memory)

### **3. Size Validation:**
- **Client-side validation** before upload (5MB limit)
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
