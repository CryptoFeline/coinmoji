## Continuing rendering after the 30s time limit

### Problem
At present `render‑frames.ts` stops capturing frames when ~25s have elapsed and returns only those frames. If the scene is complex or if the user requests more frames, the animation is truncated. Netlify does not currently allow increasing the execution time of headless browsers.

### Proposed solution
Break the rendering process into segments. Instead of rendering all frames in a single invocation, allow the client to specify at which frame to start. A client‑side loop can then call the Netlify function repeatedly, accumulating frames until all `exportSettings.frames` have been captured. Because frame rotation is calculated from the frame index, restarting from a later frame produces identical results – there is no dependency on previous frames

### Required changes
1. Expose a `startFrame` parameter in the request. Extend the `RenderFramesRequest` interface in `render‑frames.ts` to include an optional `startFrame: number`. When parsing the request (both JSON and multipart), set `const startFrame = Number(request.exportSettings.startFrame) || 0;`.

2. Pass the `startFrame` into the page evaluation. Currently the page script starts the loop at `i = 0`. Modify the evaluation script to start from `i = startFrame`:

```ts
const { exportSettings, startFrame = 0 } = renderRequest;
const frames: string[] = [];
const startTime = Date.now();
for (let i = startFrame; i < exportSettings.frames; i++) {
  if (i > startFrame && (i - startFrame) % 10 === 0) {
    const elapsed = Date.now() - startTime;
    if (elapsed > 25000) {
      break;
    }
  }
  // compute rotation and capture frame as before…
  frames.push(base64);
}
return frames;
```

The rest of the frame computation (calculating progress, applying textures, etc.) stays unchanged.

3. Compute the next frame index on the Node side. After `framesBase64` is returned from the browser, compute

```ts
const nextStartFrame = startFrame + framesBase64.length;
```

Include `nextStartFrame` and the total expected frames in the response:

```javascript
return {
  statusCode: 200,
  headers: { … },
  body: JSON.stringify({
    success: true,
    frames: framesBase64,
    frames_count: framesBase64.length,
    total_frames: request.exportSettings.frames,
    nextStartFrame: nextStartFrame < request.exportSettings.frames ? nextStartFrame : null
  })
};
```

When `nextStartFrame` is `null`, the caller knows that all frames have been captured.

4. Modify the `exporter.ts` client to loop until all frames are obtained. In `renderFramesOnServer()` and `renderFramesOnServerWithStreaming()`, initialise `let startFrame = 0; const allFrames = [];` and perform a loop:

```ts 
do {
  const payload = { settings: serverSettings, exportSettings: { …, startFrame } };
  const res = await fetch('/.netlify/functions/render-frames', { … });
  const result = await res.json();
  allFrames.push(...result.frames);
  startFrame = result.nextStartFrame ?? result.total_frames;
} while (startFrame < result.total_frames);
return allFrames;
```

This approach re‑launches a headless Chromium instance for each segment. Because the most expensive part (loading Three.js and textures) happens in each invocation, the total render time will increase slightly, but it resolves the 30s limitation. You can choose a different segmentation strategy; for example, when the timeout occurs we check the last frame and after relaunching the headless Chromium we continue from the next frame (but still minding the original full rotation calculation).

### Considerations
- Because the scene is re‑initialised on each invocation, randomness (e.g., jitter in reflections) should be avoided or seeded deterministically to ensure consistent output. Three.js does not introduce randomness by default, so no changes are needed.

- For multipart requests (with uploaded files) you must include startFrame as a JSON field alongside exportSettings when creating the form data.

- If you adopt this approach, remove the time‑based early break inside the page evaluation (elapsed >25000) since segmentation will control the number of frames rendered.

## Change handling of WebM/MP4 overlays and body textures

We can do it **without** relying on Chromium's video codecs (we currently do this and fall back to static overlays). Pre-decode the `.webm`/`.mp4` to frames (or a single spritesheet) **server-side with FFmpeg** like we do GIFs, then feed those frames into the Three.js in Puppeteer as an animated `CanvasTexture`. That way, our Netlify function never needs to "play a video" at all, and we still get a fully animated overlay/body texture during server-side rendering.

Also, we can use preLoad for three.js to ensure the three.js texture/overlay files are ready before rendering starts and we save time, only launch the chromium when preLoad of the frames is done.

Below is a drop-in plan with code, but make sure it's fitting and adjust if to the existing logic if needed! I may be wrong, so verify my assumptions and adapt as necessary.

---

## What we will change (high level)

### 1. **New Netlify function `decode-video.ts`**
**Note:** The existing ffmpeg static binary is already bundled, so we can use it directly - but make sure if we really need a new function, or we can add this in an exsiting one.

   * Accepts a video file (upload) or URL - WebM or MP4.
   * Uses `ffmpeg` to fit and produce **60 frames** (20 fps × 3 s), scaled to render size, **as a single spritesheet** (10×6 grid) + metadata (rows/cols/fps/frame size).
   * Returns either:

     * a base64 data URL when the sheet is small (fits in our current 5 MB limit), or
     * a temporary URL if you upload it to object storage (S3/R2/etc.).

### 2. **Client (exporter.ts)**

   * If the user uses WebM/MP4 for `overlayUrl` / `bodyTextureUrl` (or uploaded one), call `/decode-video` first, before rendering.
   * Pass the returned `{ sheet, cols, rows, frameWidth, frameHeight, fps }` to `/render-frames` as `overlayVideoSheet` / `bodyVideoSheet`.

### 3. **Server render (`render-frames.ts`)**

   * If `overlayVideoSheet` (or `bodyVideoSheet`) is present, load the spritesheet image in the page, create a `CanvasTexture`, and implement `userData.update()` that blits the correct tile for the current frame index.
   * Everything else (animation timing, capturing frames, 30-second segmentation with new Chromium reload) stays the same.

This gives us **true animated video overlays** server-side, with no placeholders and no dependency on Chromium's MP4/WebM playback, and does not overburden the 30s timeout.

---

## 1. Netlify function: `netlify/functions/decode-video.ts`

**We already have installed deps** bundling a static ffmpeg binary, so we can use it directly in the function. This function will decode the video into a spritesheet.

- NOTE: Please check how are we currently using the FFmpeg binary in `render-frames.ts` so we can use the proven working method!

**`netlify/functions/decode-video.ts`** (unless we add it to an existing function for brevity):

```ts
import { Handler } from '@netlify/functions';
import ffmpegPath from 'ffmpeg-static';
import { execa } from 'execa';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

type DecodeResult = {
  success: true;
  type: 'data-url' | 'url';
  sheet: string;              // data URL or https URL
  cols: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
};

const COLS = 10;
const ROWS = 6;
const FRAME_COUNT = COLS * ROWS;   // 60
const FPS = 20;
const FRAME_W = 128;               // keep this small to stay under payload limits
const FRAME_H = 128;

export const handler: Handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  try {
    const contentType = event.headers['content-type'] || '';
    const tmpId = crypto.randomUUID();
    const tmpDir = `/tmp/${tmpId}`;
    fs.mkdirSync(tmpDir, { recursive: true });

    let inputPath = path.join(tmpDir, 'input.bin');

    // Input can be either JSON with { videoUrl } OR multipart with a file.
    if (contentType.includes('application/json')) {
      const { videoUrl } = JSON.parse(event.body || '{}');
      if (!videoUrl) throw new Error('Missing videoUrl');

      // Download to /tmp
      const res = await fetch(videoUrl);
      if (!res.ok) throw new Error(`Failed to fetch video: ${res.statusText}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(inputPath, buf);
    } else if (contentType.includes('multipart/form-data')) {
      // Very simple multipart parsing for a single file named "file"
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) throw new Error('No boundary');

      const body = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');
      const parts = body.toString('binary').split(`--${boundary}`);
      let fileBuf: Buffer | null = null;
      for (const part of parts) {
        if (part.includes('name="file"')) {
          const idx = part.indexOf('\r\n\r\n');
          if (idx !== -1) {
            const bin = part.substring(idx + 4, part.length - 2); // drop trailing \r\n
            fileBuf = Buffer.from(bin, 'binary');
            break;
          }
        }
      }
      if (!fileBuf) throw new Error('No file found');
      fs.writeFileSync(inputPath, fileBuf);
    } else {
      throw new Error('Unsupported Content-Type');
    }

    const sheetPath = path.join(tmpDir, 'sheet.png');

    // 1) Trim to 3s, scale to FRAME_W/H, sample 20fps, tile frames into 10x6 grid as a single PNG.
    // Tile makes 1 image; the ":padding=0:margin=0" keeps it tight.
    await execa(ffmpegPath as string, [
      '-y',
      '-ss', '0',
      '-t', '3',
      '-i', inputPath,
      '-vf', `fps=${FPS},scale=${FRAME_W}:${FRAME_H},tile=${COLS}x${ROWS}:padding=0:margin=0`,
      '-frames:v', '1',
      sheetPath
    ], { env: { ...process.env } });

    const sheetBuf = fs.readFileSync(sheetPath);
    // If small enough, return as data URL to avoid external storage.
    if (sheetBuf.length < 4_500_000) {
      const b64 = sheetBuf.toString('base64');
      const result: DecodeResult = {
        success: true,
        type: 'data-url',
        sheet: `data:image/png;base64,${b64}`,
        cols: COLS,
        rows: ROWS,
        frameWidth: FRAME_W,
        frameHeight: FRAME_H,
        frameCount: FRAME_COUNT,
        fps: FPS
      };
      return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
    }

    // Otherwise, you should upload to object storage and return a URL.
    // For brevity, we return 413 here with a hint.
    return {
      statusCode: 413,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'SPRITESHEET_TOO_LARGE', hint: 'Use S3/R2 upload and return URL.' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ success: false, error: (err as Error).message })
    };
  }
};
```

> We could do **individual frames** instead of a spritesheet, by emitting `/tmp/frames/%03d.webp` and zip them—but a **single spritesheet** is faster to load in Puppeteer (one decode, one image).

---

## 2. Client changes (`exporter.ts`)

When a video is chosen for overlay/body:

* Call `/decode-video` (multipart if it's an upload, JSON if it's a URL) or the existing script we add this new method to.
* Include the returned spritesheet + metadata in your `/render-frames` payload.

Add helper:

```ts
private async decodeVideoToSheet(input: {file?: File; url?: string}) {
  const endpoint = '/.netlify/functions/decode-video';
  let res: Response;
  if (input.file) {
    const f = new FormData();
    f.append('file', input.file);
    res = await fetch(endpoint, { method: 'POST', body: f });
  } else {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ videoUrl: input.url })
    });
  }
  if (!res.ok) throw new Error(`decode-video failed: ${await res.text()}`);
  return res.json(); // { sheet, cols, rows, frameWidth, frameHeight, frameCount, fps }
}
```

Then in `renderFramesOnServer()` (and the streaming variant):

```ts
// Before building the payload:
let overlayVideoSheet, bodyVideoSheet;

const isVideoUrl = (u: string) => /\.webm$/i.test(u) || /\.mp4$/i.test(u) || /data:video\//i.test(u);

// overlay
if (coinSettings.overlayMode === 'upload' && coinSettings.overlayFile && coinSettings.overlayFile.type.startsWith('video/')) {
  overlayVideoSheet = await this.decodeVideoToSheet({ file: coinSettings.overlayFile });
} else if (coinSettings.overlayUrl && isVideoUrl(coinSettings.overlayUrl)) {
  overlayVideoSheet = await this.decodeVideoToSheet({ url: coinSettings.overlayUrl });
}

// body texture
if (coinSettings.bodyTextureMode === 'upload' && coinSettings.bodyTextureFile && coinSettings.bodyTextureFile.type.startsWith('video/')) {
  bodyVideoSheet = await this.decodeVideoToSheet({ file: coinSettings.bodyTextureFile });
} else if (coinSettings.bodyTextureUrl && isVideoUrl(coinSettings.bodyTextureUrl)) {
  bodyVideoSheet = await this.decodeVideoToSheet({ url: coinSettings.bodyTextureUrl });
}

const payload = {
  settings: serverSettings,
  exportSettings: { fps: exportSettings.fps, duration: exportSettings.duration, frames: Math.round(exportSettings.fps * exportSettings.duration), qualityMode: exportSettings.qualityMode || 'balanced' },
  overlayVideoSheet,      // optional
  bodyVideoSheet          // optional
};
```

---

## 3 Server render changes (`netlify/functions/render-frames.ts`)

In the **Node** side (top of the handler) just allow these optional fields to pass through to `page.evaluate`. The real work is **inside** `page.evaluate`, where we already update GIFs via `userData.update()`. We'll add a similar path for video spritesheets.

Inside the `page.evaluate(async (renderRequest) => { … })` block, near where overlay textures are created, add **spritesheet loader**:

```ts
// Utility: build an animated CanvasTexture from a spritesheet
const createSpritesheetTexture = async (sheetSrc: string, cols: number, rows: number, frameW: number, frameH: number, fps: number) => {
  const sheetImg = new Image();
  sheetImg.crossOrigin = 'anonymous';
  sheetImg.src = sheetSrc;
  await new Promise((resolve, reject) => {
    sheetImg.onload = resolve;
    sheetImg.onerror = (e) => reject(new Error('Failed to load spritesheet'));
  });

  // This canvas holds the current frame (exactly frameW x frameH)
  const outCanvas = document.createElement('canvas');
  outCanvas.width = frameW;
  outCanvas.height = frameH;
  const outCtx = outCanvas.getContext('2d')!;

  const tex = new THREE.CanvasTexture(outCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = true;
  tex.needsUpdate = true;

  // State for animation
  const totalFrames = cols * rows;
  let currentFrame = 0;
  let lastTime = performance.now();
  const frameDuration = 1000 / fps;

  const drawFrame = (idx: number) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    outCtx.clearRect(0, 0, frameW, frameH);
    outCtx.drawImage(
      sheetImg,
      c * frameW, r * frameH, frameW, frameH,
      0, 0, frameW, frameH
    );
    tex.needsUpdate = true;
  };

  drawFrame(0);

  // Hook the same update mechanism you already use for GIFs
  tex.userData.update = () => {
    const now = performance.now();
    if (now - lastTime >= frameDuration) {
      currentFrame = (currentFrame + 1) % totalFrames;
      drawFrame(currentFrame);
      lastTime = now;
    }
  };

  return tex;
};
```

Now, where you apply overlays/textures (around our existing `detectTextureType()` logic), handle the presence of `overlayVideoSheet` / `bodyVideoSheet` **before** GIF/WebM/static branches:

```ts
// If overlayVideoSheet is present, prefer it over URL detection
if (renderRequest.overlayVideoSheet) {
  const s = renderRequest.overlayVideoSheet;
  const tex = await createSpritesheetTexture(s.sheet, s.cols, s.rows, s.frameWidth, s.frameHeight, s.fps);
  overlayTexture = tex;
  console.log('✅ Overlay video spritesheet applied');
} else {
  // ... your existing GIF/WebM/static detection for overlayUrl ...
}

// Same idea for body texture:
if (renderRequest.bodyVideoSheet) {
  const s = renderRequest.bodyVideoSheet;
  const tex = await createSpritesheetTexture(s.sheet, s.cols, s.rows, s.frameWidth, s.frameHeight, s.fps);
  bodyTexture = tex;
  console.log('✅ Body video spritesheet applied');
} else {
  // ... existing path for bodyTextureUrl ...
}
```

And keep our animation loop calling `map.userData?.update()` like you already do for GIFs:

```ts
if (overlayTop.material?.map?.userData?.update) overlayTop.material.map.userData.update();
if (overlayBot.material?.map?.userData?.update) overlayBot.material.map.userData.update();
if (rimMat.map?.userData?.update) rimMat.map.userData.update();
if (faceMat.map && faceMat.map !== rimMat.map && faceMat.map.userData?.update) faceMat.map.userData.update();
```

That's it: the spritesheet animates every server frame, no video element, no codec issues.

---

## Notes & best practices

* **Payload limits.** We currently reject requests >5 MB. A small spritesheet usually fits, but if you bump size, store the sheet in S3/R2 and pass a URL instead of a data URL. Loading **one image** is cheap and won't blow the 30s limit.
* **Consistency.** The decode step fixes `fps=20`, `duration=3s`, matching our `render-frames.ts` defaults, so the video animation stays in sync with the coin rotation.
* **Segmented rendering.** Keep the "resume from `startFrame`" approach for long renders (as we discussed earlier). The spritesheet remains in memory across frames in a single invocation, so there's no perf penalty there.
* **Quality.** If you want crisper overlays, decode at 200×200 (as we capture) and downscale to 100 at the end, but watch payload size.

---