# Glow to Enhance Migration Plan

## Overview
Based on your feedback that the server-side enhanced overlays work better than client-side glow overlays, we need to:
1. Remove the glow overlay system (both client and server-side)
2. Implement the enhanced texture system client-side to match server-side rendering
3. Maintain client-server visual parity without glow dependencies

## Current System Analysis

### Server-Side Enhancement System (render-frames.ts) ✅ COMPLETED
- **enhanceOverlayTexture()** function with 5-step enhancement pipeline:
  - Step 1: Brightness boost (1.6x, tuned down from 2.0x)
  - Step 2: Color vibrance boost (1.3x, tuned down from 1.6x)
  - Step 3: Selective bloom for bright pixels (threshold: 200, strength: 1.15x)
  - Step 4: Gentle contrast enhancement (1.15x, tuned down from 1.25x)
  - Step 5: Selective color enhancement for warm/cool tones (1.08x, tuned down from 1.15x)
- Applied to: loadImageTexture(), createSpritesheetTexture()
- Works for: static images, animated GIFs, video spritesheets

### Client-Side Glow System (TO BE REMOVED)

#### Files to Modify:
1. **src/materials/GlowMapMaterial.ts** - DELETE entire file
2. **src/components/CoinEditor.tsx** - Remove glow mesh creation and management
3. **src/components/SettingsPanel.tsx** - Remove glow UI controls
4. **src/utils/exporter.ts** - Remove glow settings from server requests
5. **netlify/functions/render-frames.ts** - Remove server-side glow mesh system

#### Glow Components to Remove:

**CoinEditor.tsx:**
- Import: `import GlowMapMaterial from '../materials/GlowMapMaterial';`
- Interface properties: `bodyGlow`, `bodyGlowScale`, `bodyGlowIntensity`, `bodyGlowSharpness`, `overlayGlow`, `overlayGlowScale`, `overlayGlowIntensity`, `overlayGlowSharpness`
- Scene object references: `cylinderGlow`, `topGlow`, `bottomGlow`, `overlayTopGlow`, `overlayBotGlow` (lines ~178-182)
- Glow mesh creation code (lines ~499-566)
- Glow mesh management in coinGroup.add() calls
- Glow update logic in settings effects

**SettingsPanel.tsx:**
- Glow-related interface properties (same as CoinEditor)
- Body Glow Controls UI section (around line 871-880)
- Overlay Glow Controls UI section (need to find)
- All glow-related updateSetting() calls

**exporter.ts:**
- Glow settings in render request (lines ~396-402)
- Default glow settings (lines ~436-442)

**render-frames.ts (server-side):**
- Entire GlowMapMaterial class definition (~100 lines)
- All glow mesh creation and management code
- Glow-related debug logging

## Enhancement System Implementation Plan

### Phase 1: Create Client-Side Enhancement System
**Target:** Implement `enhanceOverlayTexture()` function in CoinEditor.tsx

#### New Function: `enhanceOverlayTexture(canvas, ctx, brightnessBoost = 1.6)`
```typescript
const enhanceOverlayTexture = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, brightnessBoost: number = 1.6) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // 5-step enhancement pipeline matching server-side
  for (let i = 0; i < data.length; i += 4) {
    // Step 1: Brightness boost
    // Step 2: Color vibrance
    // Step 3: Selective bloom
    // Step 4: Contrast enhancement  
    // Step 5: Selective color enhancement
  }
  
  ctx.putImageData(imageData, 0, 0);
};
```

#### Integration Points:
1. **Static Image Loading**: Apply enhancement after loading image to canvas
2. **GIF Animation**: Apply enhancement to each frame during canvas drawing
3. **Video Spritesheet**: Apply enhancement during frame extraction
4. **Settings Integration**: Add overlay enhancement toggle/intensity controls

### Phase 2: Remove Glow System Components

#### 2.1 Delete Files:
- `src/materials/GlowMapMaterial.ts` (entire file - 151 lines)

#### 2.2 CoinEditor.tsx Changes:
```typescript
// REMOVE these imports:
import GlowMapMaterial from '../materials/GlowMapMaterial';

// REMOVE these interface properties:
bodyGlow: boolean;
bodyGlowScale: number;          
bodyGlowIntensity: number;      
bodyGlowSharpness: number;      
overlayGlow: boolean;           
overlayGlowScale: number;       
overlayGlowIntensity: number;   
overlayGlowSharpness: number;   

// REMOVE these scene object references:
cylinderGlow: THREE.Mesh;
topGlow: THREE.Mesh;
bottomGlow: THREE.Mesh;
overlayTopGlow: THREE.Mesh;
overlayBotGlow: THREE.Mesh;

// REMOVE glow mesh creation code (~70 lines, lines 499-566)
// REMOVE glow meshes from coinGroup.add() calls  
// REMOVE all glow update logic in useEffect hooks
```

#### 2.3 SettingsPanel.tsx Changes:
```typescript
// REMOVE glow interface properties (same as CoinEditor)
// REMOVE "Body Glow Controls" UI section
// REMOVE "Overlay Glow Controls" UI section  
// REMOVE glow-related updateSetting() calls
```

#### 2.4 exporter.ts Changes:
```typescript
// REMOVE from render request:
bodyGlow: this.currentSettings.bodyGlow,
bodyGlowIntensity: this.currentSettings.bodyGlowIntensity,
bodyGlowSharpness: this.currentSettings.bodyGlowSharpness,
overlayGlow: this.currentSettings.overlayGlow,
overlayGlowIntensity: this.currentSettings.overlayGlowIntensity,
overlayGlowSharpness: this.currentSettings.overlayGlowSharpness

// REMOVE from default settings:
bodyGlow: false,
bodyGlowIntensity: 5.0,
bodyGlowSharpness: 0.6,
overlayGlow: false,
overlayGlowIntensity: 5.0,
overlayGlowSharpness: 0.6
```

#### 2.5 render-frames.ts Changes:
```typescript
// REMOVE GlowMapMaterial class definition (~100 lines)
// REMOVE all glow mesh creation code
// REMOVE glow mesh management from coinGroup
// REMOVE glow-related debug logging
```

### Phase 3: Add Enhancement Controls to UI

#### New Settings Properties:
```typescript
// Add to interface:
overlayEnhancement: boolean;        // Enable overlay enhancement
overlayBrightness: number;          // Brightness multiplier (1.0-3.0)
overlayContrast: number;            // Contrast multiplier (1.0-2.0)  
overlayVibrance: number;            // Color vibrance (1.0-2.0)
overlayBloom: boolean;              // Enable selective bloom
```

#### New UI Controls:
- **Overlay Enhancement** toggle (replaces overlay glow toggle)
- **Brightness** slider (1.0-3.0, default 1.6)
- **Contrast** slider (1.0-2.0, default 1.15)  
- **Vibrance** slider (1.0-2.0, default 1.3)
- **Bloom Effect** toggle (for bright pixels)

### Phase 4: Testing & Validation

#### Client-Server Parity Tests:
1. **Static Images**: Verify enhancement produces identical visual results
2. **Animated GIFs**: Test frame-by-frame enhancement consistency
3. **Video Spritesheets**: Validate spritesheet frame enhancement
4. **Performance**: Ensure client-side enhancement doesn't impact framerate

#### Visual Regression Tests:
1. Before/after comparison of overlay visibility
2. Metallic surface interaction with enhanced overlays
3. Different overlay types (logos, text, graphics)
4. Animation smoothness with enhancement applied

## Migration Steps Summary

### Step 1: Implement Client-Side Enhancement ✅ COMPLETED
- Create `enhanceOverlayTexture()` function in CoinEditor.tsx
- Integrate with existing texture loading pipeline  
- Add enhancement settings to interface

### Step 2: Remove Glow System ✅ COMPLETED
- Delete GlowMapMaterial.ts
- Remove glow meshes from CoinEditor.tsx
- Remove glow UI controls from SettingsPanel.tsx
- Remove glow settings from exporter.ts
- Remove glow system from render-frames.ts

### Step 3: Add Enhancement UI ✅ COMPLETED
- Replace glow controls with enhancement controls
- Add brightness/contrast/vibrance sliders
- Update settings interface and defaults

### Step 4: Fix Server-Side Enhancement Toggle ⏳ IN PROGRESS
- ✅ Add getEnhancementMultiplier() function to server-side
- ✅ Replace hardcoded 1.6x enhancement with dynamic user settings
- ✅ Update all loadImageTexture() and createSpritesheetTexture() calls
- 🔧 Address client-server visual parity issues
- 🔧 Fix MP4 back face animation speed synchronization

### Step 5: Test & Polish ⏳
- Validate client-server visual parity
- Performance testing
- UI/UX refinements

## Benefits of Migration

1. **Simplified Architecture**: Remove complex shader-based glow system
2. **Better Visual Results**: Enhanced textures provide superior overlay visibility
3. **Performance**: Canvas-based enhancement is more efficient than shader glow
4. **Client-Server Consistency**: Perfect visual parity between preview and export
5. **Maintainability**: Single enhancement system instead of dual glow/enhancement

## Risk Assessment

**Low Risk Items:**
- Server-side enhancement already working perfectly
- Client-side canvas operations are well-established
- No breaking changes to existing coin configurations

**Medium Risk Items:**  
- UI transition from glow controls to enhancement controls
- Potential performance impact of canvas operations on animations

**Mitigation Strategies:**
- Implement enhancement as optional feature initially
- Performance profiling during development
- Gradual rollout with feature flags

---

**Ready for Review and Implementation** ✅
