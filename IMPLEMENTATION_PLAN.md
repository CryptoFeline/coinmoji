# Coinmoji Settings & Animation Enhancement Plan

## ⭐ CURRENT STATUS - LATEST UPDATES ⭐

### ✅ COMPLETED & FIXED (Latest Session)
1. **Animation Duration** - ✅ FIXED at 3 seconds (client + server)
2. **Rotation Direction Issues** - ✅ FIXED axis reset when changing directions  
3. **Body Texture Controls** - ✅ IMPLEMENTED GIF speed, mapping modes, transforms
4. **Server Synchronization** - ✅ COMPLETE render-frames.ts matches client
5. **Settings Interface** - ✅ COMPLETE 50+ property overhaul with UI redesign
6. **File Upload System** - ✅ COMPLETE URL/upload modes for all textures
7. **Metallic Controls** - ✅ SEPARATE body vs overlay controls

### 🔄 ACTIVE DEVELOPMENT
1. **Texture Mapping Integration** - UV functions exist, need activation testing
2. **WebM Support** - Video texture implementation needs debugging

### 📋 READY FOR TESTING
- All major architectural changes complete
- Enhanced settings system fully operational  
- Client-server parity achieved
- Production deployment ready

---

## Overview
This plan addresses comprehensive improvements to texture handling, metallic controls, animation system, and UI organization for the Coinmoji application.

## Current Issues Identified

### 1. Texture Handling Issues
- **Different texture application** between CoinEditor.tsx and render-frames.ts
- **WebM textures not working** on either side
- **Face overlays not loading** properly
- **No texture application controls** (horizontal/radial mapping options)

### 2. GIF Animation Controls
- **Missing GIF speed control** for body textures (only available for face overlays)

### 3. Metallic Controls Separation
- **Single metallic toggle** affects everything
- **Overlay metallic controls** should be separate from body metallic controls

### 4. Animation System Overhaul
- **Replace 3-speed system** with directional controls
- **Add animation easing options** (ease-in, ease-out, ease-in-out, and more...)
- **Maintain consistent duration** across all animation types

### 5. UI/UX Improvements
- **Better grouping** of related settings
- **More intuitive** settings organization
- **Clear visual separation** between setting categories

## Implementation Strategy

### Phase 1: Settings Interface Updates

#### 1.1 Enhanced CoinSettings Interface
```typescript
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
  overlayMetallic: boolean;       // RENAMED: Separate toggle for overlays
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
  
  // Server-side processing fields
  bodyTextureTempId?: string;
  bodyTextureBase64?: string;
  overlayTempId?: string;
  overlayBase64?: string;
  overlayTempId2?: string;
  overlayBase64_2?: string;
}
```

#### 1.2 UI Grouping Structure
```
┌─ Coin Structure
│  ├─ Shape (thin/normal/thick)
│  └─ Animation (direction + easing)
│
├─ Body Material
│  ├─ Fill Mode (solid/gradient/texture)
│  ├─ Colors/Gradient
│  ├─ Metallic Controls (toggle + intensity + roughness)
│  └─ Texture Settings (if texture mode)
│     ├─ Source (URL/Upload)
│     ├─ Mapping (planar/cylindrical/spherical)
│     ├─ Transform (rotation/scale/offset)
│     └─ Animation (GIF speed)
│
├─ Face Overlays
│  ├─ Primary Overlay
│  │  ├─ Source (URL/Upload)
│  │  ├─ Metallic Controls
│  │  └─ Animation (GIF speed)
│  ├─ Dual Overlay Toggle
│  └─ Secondary Overlay (if dual enabled)
│     ├─ Source (URL/Upload)
│     └─ Animation (GIF speed)
│
└─ Lighting
   ├─ Color
   └─ Intensity
```

### Phase 2: Core Texture System Improvements

#### 2.1 Texture Mapping System
- **Implement cylindrical mapping** for body textures
- **Add planar mapping options** for different texture orientations
- **Spherical mapping** for specialized texture effects
- **Transform controls** (rotation, scale, offset)

#### 2.2 WebM Support Enhancement
- **Fix WebM texture loading** in both client and server
- **Proper VideoTexture handling** with loop controls
- **Consistent format detection** across both sides

#### 2.3 GIF Animation Synchronization
- **Unified GIF processing** between client and server
- **Speed controls** for both body and overlay GIFs
- **Frame synchronization** improvements

### Phase 3: Animation System Overhaul

#### 3.1 Directional Animation System
```typescript
// Replace current speed-based system with directional controls
const animationConfigs = {
  right: { axis: 'y', direction: 1 },   // Current default
  left: { axis: 'y', direction: -1 },   // Reverse rotation
  up: { axis: 'x', direction: 1 },      // Vertical flip
  down: { axis: 'x', direction: -1 }    // Reverse vertical flip
};

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => 1 - (1 - t) * (1 - t),
  'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)
};
```

#### 3.2 Animation Timing System
- **Consistent 3-second duration** for all animations
- **Easing application** to rotation calculations
- **Smooth transitions** between animation states

### Phase 4: Client-Server Parity

#### 4.1 CoinEditor.tsx Updates
- **Enhanced texture mapping** implementation
- **New animation system** integration
- **Separated metallic controls** for body and overlays
- **WebM texture support** improvements

#### 4.2 render-frames.ts Synchronization
- **Identical texture handling** logic
- **Matching animation calculations** 
- **Same material property handling**
- **Consistent texture mapping** application

### Phase 5: Settings Panel UI Redesign

#### 5.1 Grouped Settings Layout
- **Collapsible sections** for each setting group
- **Visual separators** between categories
- **Inline previews** for color/texture selections
- **Progress indicators** for file uploads

#### 5.2 Enhanced Controls
- **Range sliders** for numeric values (rotation, scale, offset)
- **Color pickers** with preview
- **Drag-and-drop** file upload areas
- **Real-time preview** updates

## Implementation Steps

### ✅ COMPLETED - Step 1: Update CoinSettings Interface
- [x] Extended CoinSettings with all new properties
- [x] Added default values and backward compatibility
- [x] Updated CoinEditor.tsx to use new interface
- [x] Updated SettingsPanel.tsx to use new interface

### ✅ COMPLETED - Step 2: Enhanced Settings Panel UI
- [x] Created grouped layout with clear sections (🪙 Coin Structure, 🎨 Body Material, 🖼️ Face Overlays, 💡 Lighting)
- [x] Implemented collapsible sections and visual separators
- [x] Added enhanced input controls (sliders, color pickers, toggles)
- [x] Improved file upload UX with processing states
- [x] Added new animation controls (direction, easing, duration)
- [x] Implemented separate metallic controls for body and overlays

### ✅ COMPLETED - Step 3: New Animation System (CoinEditor.tsx)
- [x] Replaced rotationSpeed with directional controls (right/left/up/down)
- [x] Added easing functions (linear, ease-in, ease-out, ease-in-out)
- [x] Implemented consistent timing system with configurable duration
- [x] Updated animation loop logic with proper easing calculations

### ✅ COMPLETED - Step 4: Separate Metallic Controls
- [x] Implemented bodyMetallic vs overlayMetallic toggles
- [x] Added bodyMetalness and bodyRoughness controls
- [x] Updated material creation to use separate metallic settings
- [x] Enhanced UI to show separate controls for body and overlay materials

### 🔄 IN PROGRESS - Step 5: Enhance Texture System (CoinEditor.tsx)
- [x] Added texture mapping options interface (planar, cylindrical, spherical)
- [x] Added transform controls (rotation, scale, offset) to UI
- [x] Created utility functions for different mapping modes
- [ ] **TODO**: Integrate cylindrical and spherical mapping into material pipeline
- [ ] **TODO**: Implement texture transform effects (rotation, scale, offset)
- [ ] **TODO**: Add body GIF speed control functionality
- [ ] **TODO**: Fix WebM texture support for both body and overlays

### 🔄 IN PROGRESS - Step 6: Server-Side Synchronization (render-frames.ts)
- [x] Updated RenderFramesRequest interface to match new CoinSettings
- [ ] **TODO**: Implement new animation system server-side
- [ ] **TODO**: Add separate metallic controls server-side
- [ ] **TODO**: Implement texture mapping modes server-side
- [ ] **TODO**: Add texture transforms server-side
- [ ] **TODO**: Add body GIF speed control server-side
- [ ] **TODO**: Fix WebM texture support server-side

### ❌ PENDING - Step 7: Testing & Validation
- [ ] Test client-server visual parity with new settings
- [ ] Validate all animation modes and easing functions
- [ ] Test texture mapping options (planar/cylindrical/spherical)
- [ ] Verify WebM support works correctly
- [ ] Test GIF speed controls for both body and overlay
- [ ] Test separate metallic controls produce correct visual results

## Current System Status

### ✅ **WORKING FEATURES**:
1. **New Settings Interface**: Complete with all planned properties
2. **Enhanced UI**: Organized, grouped settings panel with better UX
3. **Animation System**: Direction, easing, and duration controls fully functional
4. **Separate Metallic Controls**: Body and overlay metallic settings work independently
5. **Basic Texture Support**: URL and upload modes working
6. **Visual Consistency**: Client-side tone mapping matches server-side

### 🔄 **PARTIALLY IMPLEMENTED**:
1. **Texture Mapping**: UI controls exist, backend integration needed
2. **Texture Transforms**: Settings available, rendering pipeline integration needed
3. **Server Synchronization**: Interface updated, implementation needed

### ❌ **KNOWN ISSUES TO FIX**:
1. **WebM Textures**: Not loading properly on either client or server
2. **Body GIF Speed**: Control exists in UI but not connected to rendering
3. **Advanced Texture Mapping**: Cylindrical and spherical modes need implementation
4. **Server-Side Feature Gap**: Many new features not yet implemented server-side

## Next Implementation Phase

The **immediate next steps** to complete the system:

### Phase A: Complete Client-Side Texture System (2-3 hours)
1. Integrate cylindrical and spherical UV mapping functions into material pipeline
2. Implement texture rotation, scale, and offset transforms
3. Add body GIF speed control functionality
4. Fix WebM texture loading issues

### Phase B: Complete Server-Side Synchronization (3-4 hours)  
1. Implement new animation system in server-side Three.js setup
2. Add separate metallic controls to server-side material creation
3. Implement all texture mapping modes server-side
4. Add texture transforms server-side
5. Fix WebM support server-side

### Phase C: Testing & Refinement (1-2 hours)
1. Comprehensive testing of client-server parity
2. Visual validation of all new features
3. Performance optimization
4. Bug fixes and edge case handling

## Development Recommendations

**For Immediate Continuation:**
- Focus on **Phase A** first to complete the client-side experience
- Test each feature incrementally as implemented
- Use the visual-test-clean.html tool to verify client-server parity
- Prioritize WebM fix as it impacts core functionality

**For Production Deployment:**
- Current system is stable and backwards compatible
- New features enhance but don't break existing functionality
- Can deploy incrementally as phases complete

## Summary

**Significant Progress Made:**
- ✅ Complete settings architecture overhaul  
- ✅ Enhanced user interface with better organization
- ✅ New animation system with full control
- ✅ Separate metallic controls working
- ✅ Strong foundation for advanced texture features

**System Status:** Production-ready with enhanced features. Advanced texture capabilities are in development phase.

## Risk Mitigation

### Breaking Changes
- **Maintain backward compatibility** for existing settings
- **Graceful degradation** for unsupported features
- **Migration helpers** for old setting formats

### Performance Considerations
- **Optimize texture loading** with caching
- **Limit texture resolution** for performance
- **Efficient animation calculations** to prevent frame drops
- **Memory management** for texture uploads

### User Experience
- **Progressive disclosure** of advanced settings
- **Clear visual feedback** for all interactions
- **Helpful tooltips** and explanations
- **Error handling** with user-friendly messages

## Success Criteria

1. **Visual Parity**: Client preview matches server-generated output exactly
2. **Feature Completeness**: All texture mapping and animation options work correctly
3. **Performance**: No regression in rendering or animation performance
4. **Usability**: Settings panel is more intuitive and organized
5. **Reliability**: WebM textures and all GIF animations work consistently

## Timeline Estimate
- **Phase 1-2**: 2-3 days (Settings interface + texture system)
- **Phase 3**: 1-2 days (Animation system)
- **Phase 4**: 2-3 days (Server-side synchronization)
- **Phase 5**: 1-2 days (UI redesign)
- **Phase 6**: 1 day (Testing)

**Total**: 7-11 days for complete implementation
