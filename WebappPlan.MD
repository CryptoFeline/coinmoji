# Overview

This document outlines a plan for creating a Telegram mini-app that allows users to design and export custom emoji from a three.js coin model. The webapp will run within Netlify and via Telegram, leveraging serverless functions on Netlify for backend processing, including custom emoji creation. Images are not uploaded but imported from URLs and the rendered three.js coin will be exported as a WebM video file compliant with Telegram's custom emoji specifications. No user authentication is required, as the app will use Telegram's WebApp initData for user identification and gating, the webapp will load only in telegram environment and display a 404-like page when loaded elsewhere. No database is needed, as all data will be ephemeral and handled in memory or through Telegram's API.

The answer has three parts:

1. **Architecture plan** for the mini‑app + bot + serverless (Netlify).
2. **Node CLI encoder**: PNG‑sequence → **VP9 WebM with alpha** at **100×100**, looped, spec‑compliant for the three.js animation.
3. **Bot/Serverless code** snippets to **send** the WebM as a file in telegram to the user and/or **create a custom‑emoji set** (or add to one).

---

## Architecture

### Goal

* A Telegram **mini‑app** that runs only inside Telegram (otherwise shows a 404‑style message informing how to access the app).
* Mobile‑first UI with a **coin editor** (the three.js scene), **export to WebM** and/or **create custom emoji**, optionally enable payment gate to create coins.
* A Netlify **serverless** backend that:

  * Validates Telegram **WebApp initData** (user gating to prevent bots and non-telegram access).
  * Accepts a **file upload** (looped WebM at 100×100) and:

    * either **returns the file** and/or **sends it to the user** in chat, or
    * **creates a custom‑emoji** (WebM based) set and adds the emoji there.

### Repo layout

```
/webapp
  index.html
  styles.css
  app.js                // the three.js editor (mobile-first UI)
  exporter.js           // PNG capture with transparent alpha, zipping; post to function

/functions
  verify-initdata.js    // validates Telegram WebApp initData HMAC
  encode-emoji.js       // (optional server-side) accepts PNG zip → returns webm
  send-file.js          // sends a webm back to user via bot (sendDocument/sendSticker)
  create-emoji.js       // uploadStickerFile + createNewStickerSet/addStickerToSet

/scripts
  encode-emoji-cli.js   // local/CI: PNG seq → 100x100 VP9 webm with alpha
  make-emoji-cli.js     // given webm + user id → creates/extends emoji set

.env                    // TELEGRAM_BOT_TOKEN, BOT_USERNAME, etc. - will be uploaded to Netlify env vars
netlify.toml            // function config
```

### WebApp gating & load logic

* **Only run inside Telegram**: in `index.html` check `window.Telegram?.WebApp`.

  * If **missing** → show a 404‑like friendly page, explain in a card that this tool is only available inside Telegram, and provide a link to the bot.
  * If **present**, call `Telegram.WebApp.ready()` and get `initData`, `initDataUnsafe.user.id`.
* **All POSTs** to serverless must include `initData` header/body → backend validates with `verify-initdata.js` per Telegram’s HMAC recipe (bot token secret).

### Editor UI (mobile)

* Header: app title (from bot), small “Help” icon.
* One wide **“Editor”** button that toggles the drawer with settings:

  * **Body design**

    * Fill mode: **Solid** / **Gradient**
    * Solid color picker (one)
    * Gradient colors (start/end) — **faces: linear vertical**, **rim: linear horizontal (ping‑pong)**
    * **Metallic** toggle (toggled by default)
    * **Rotation speed**: **Slow / Medium / Fast**
      (map to e.g. 0.01 / 0.02 / 0.035 rad/frame)
    * **Body texture**: upload **PNG** or **GIF/WebM** (looping) as body map from URL provided.
      – “Apply” / “Clear” buttons.
      – For GIF/WebM: use `<video loop muted playsinline>` → `THREE.VideoTexture`.
  * **Overlay (faces) design**

    * Mode: **Single image** or **Dual images**
    * Inputs: URL(1) and URL(2) (PNG or GIF/WebM)
      – Maintain existing **bottom‑face Y‑rotate 180°** + planar UV + `invertV` so both read upright/not mirrored.
      – “Apply” / “Clear” (keeps either 1 or 2; if single mode, only apply image where URL is provided).
  * **Lighting**

    * Light color (color input)
    * Strength: **Low / Medium / Strong**
      (map to `hemi.intensity`, `dir.intensity`; e.g. 0.3/0.5/0.8 and 0.6/0.9/1.3)
* Main canvas centered, responsive, fills viewport under header/drawer. Coin cam is fixed distance, 0 above ground.
* Footer buttons (always visible):

  * **Download** → produces **emoji‑spec WebM** (or triggers serverless encoding).
  * **Get Coin** → calls serverless to **create custom emoji** (see below).
* After action: show “Saved” state, a toast (“Sent to your chat” or “Coinmoji created”), and a **New design** button to reset scene replacing the original two footer buttons.

### Export flow (emoji)

* Emoji specs (custom emoji): **WebM (VP9), alpha allowed, 100×100 px, ≤30 fps, ≤3 s, ≤256 KB, no audio**.
* **Client‑side capture**: render **PNG sequence with alpha** (seamless loop):

  * Force **single turn** over duration (calculate based on final rotation speed).
  * Hide ground and background; transparent clear.
  * Capture N = seconds×fps frames, **omit the last duplicate**.
  * Option A (recommended): **ZIP frames** and POST to `/functions/encode-emoji.js` → returns `coin.webm`.
  * Option B: encode locally with WASM ffmpeg (heavier on mobile; skip for MVP - TBD).
* **Serverless encoding**: run ffmpeg (bundled binary or layer) → return **100×100 VP9/alpha webm**.

### Bot interactions

* Bot is configured with webhook = Netlify function endpoint.
* **/start**: bot replies with instructions + an **inline mini‑app button** (opens your WebApp).
* **send file**: after export, WebApp POSTs to `/functions/send-file.js` with `user_id`, `file` (webm or upload URL). Function validates `initData`, then calls Bot API `sendDocument` (or `sendSticker`) to that `user_id`.
* **create emoji**:

  1. WebApp POSTs `user_id`, `file`, `emoji_list` (e.g. “🪙”) and `requested_set_title`.
  2. Serverless:

     * `uploadStickerFile` (`sticker_format=video`) → get `file_id`.
     * Try `createNewStickerSet` (if set name unused) with `sticker_type="custom_emoji"` and `stickers=[{sticker:file_id, emoji_list:[…], format:"video"}]`. Name must end with `_by_<botusername>`.
     * If exists, call `addStickerToSet` instead.
  3. Respond with created emoji metadata and a link.

### 404‑like page rule

* If WebApp SDK isn’t detected, show a static page:
  “This tool is only available inside Telegram. Open the bot and tap ‘Open App’.” or similar.

### Payments (future TBD; pick one)

* **A Telegram native payments (Recomended)**

  * Gate actions (export/create) until paid. Maybe best route is to remove download/get emoji buttons and add a "back to bot" button that closes the webapp opens the bot with a message to pay with built in Telegram payments, then if successful_payment webhook is received, show the buttons "download" and "get emoji" in the telegram message.
  * Use `createInvoiceLink` / `sendInvoice`; handle `pre_checkout_query` + `successful_payment` webhook.
  * Store entitlements by `telegram_user_id` (KV store).

* **B Crypto payments (non‑Telegram)**

  * **ETH/SOL**: present a pay link (e.g., Coinbase Commerce for ETH/USDC, or Solana Pay link).
  * Netlify function **verifies** payment via provider webhook (preferred) or light RPC check (tx to your address, amount, confirmations).
  * **TON** is closest to Telegram ecosystem; if you pivot to TON later, you can verify via Toncenter API or a provider webhook.

---

## JS demo code for the WebApp's three.js editor

> File: `app.js`
> Requires: three.js, dat.gui, and a few HTML elements for UI controls.
> This code sets up a three.js scene with a coin model that can be customized and exported as a WebM video.

```js
/*****************************************************************
 * Composite-coin demo with:
 *  ▸ Solid or Gradient fill (full body)
 *     - Faces: linear vertical gradient
 *     - Rim:   linear horizontal ping‑pong gradient (c1→c2→c1)
 *  ▸ Metallic toggle
 *  ▸ Face overlay image
 *  ▸ Correct vertical-axis rotation
 *****************************************************************/

/* ------------ renderer / scene / camera ------------ */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0, 7);
camera.lookAt(0, 0, 0);

/* ---------------- lighting + env ------------------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.45));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(3, 5, 2);
scene.add(dir);

const cube = new THREE.CubeTextureLoader()
  .setPath("https://threejs.org/examples/textures/cube/Bridge2/")
  .load(["posx.jpg","negx.jpg","posy.jpg","negy.jpg","posz.jpg","negz.jpg"]);
scene.environment = cube;
scene.background  = null;

/* ---------------- ground disk ---------------------- */
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(20, 64),
  new THREE.MeshStandardMaterial({ color: 0x0e1012, roughness: 1, metalness: 0 })
);
ground.rotation.x = -Math.PI/2;
ground.position.y = -1;
scene.add(ground);

/* ------------------- params ------------------------ */
const R = 1.0;      // rim radius
const T = 0.35;     // cylinder height (rim-to-rim)
const bulge = 0.10; // dome height from rim
const radialSegments = 128, capSegments = 32;
const spinSpeed = 0.02;

/* -------------- materials (two) -------------------- */
const rimMat  = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1, roughness: 0.34, envMapIntensity: 1 });
const faceMat = rimMat.clone(); // separate so fill can differ if needed

/* ---- helpers: gradient textures ------------------- */
// Faces: LINEAR VERTICAL gradient (top -> bottom)
function makeFaceLinearV(c1, c2) {
  const size = 256;
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
  const tex = new THREE.CanvasTexture(cvs);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Rim: LINEAR HORIZONTAL "ping‑pong" gradient around circumference (seam-safe)
function makeRimLinearH(c1, c2) {
  const w = 512, h = 16;
  const cvs = document.createElement("canvas");
  cvs.width = w; cvs.height = h;
  const ctx = cvs.getContext("2d");

  // Left half: c1 -> c2
  const g1 = ctx.createLinearGradient(0, 0, w/2, 0);
  g1.addColorStop(0, c1);
  g1.addColorStop(1, c2);
  ctx.fillStyle = g1; ctx.fillRect(0, 0, w/2, h);

  // Right half: c2 -> c1
  const g2 = ctx.createLinearGradient(w/2, 0, w, 0);
  g2.addColorStop(0, c2);
  g2.addColorStop(1, c1);
  ctx.fillStyle = g2; ctx.fillRect(w/2, 0, w/2, h);

  const tex = new THREE.CanvasTexture(cvs);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping; // show exactly one loop
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/* ------------- composite-coin geometry ------------- */
function buildCylinderGeometry() {
  return new THREE.CylinderGeometry(R, R, T, radialSegments, 1, true);
}
const compCylinder = new THREE.Mesh(buildCylinderGeometry(), rimMat);

function buildFace(isTop) {
  const g = new THREE.SphereGeometry(
    R, radialSegments, capSegments,
    0, Math.PI*2,
    isTop ? 0 : Math.PI/2, Math.PI/2
  );
  g.scale(1, bulge/R, 1);
  g.translate(0, isTop ? T/2 : -T/2, 0);
  return new THREE.Mesh(g, faceMat);
}
const compTop = buildFace(true);
const compBot = buildFace(false);

/* ---------------- overlay domes -------------------- */
const overlayBase = new THREE.MeshStandardMaterial({
  transparent:true, metalness:0, roughness:0.6,
  polygonOffset:true, polygonOffsetFactor:-1, polygonOffsetUnits:-1
});
function buildOverlay(isTop) {
  const mesh = buildFace(isTop);
  mesh.material = overlayBase.clone();

  // Ensure bottom face isn't mirrored: rotate 180° around its normal (Y)
  if (!isTop) mesh.geometry.rotateY(Math.PI);

  // Planar UVs so the image appears undistorted
  planarMapHemisphereUVs(mesh.geometry, { invertV: true, pad: 0.02 });
  return mesh;
}

const compTopOverlay = buildOverlay(true);
const compBotOverlay = buildOverlay(false);

/* ---------------- coin assembly -------------------- */
const coinGroup = new THREE.Group();
coinGroup.add(compCylinder, compTop, compBot, compTopOverlay, compBotOverlay);
coinGroup.rotation.x = Math.PI / 2;   // stand coin on edge

// Parent stays unrotated; we spin around world-vertical (Y)
const turntable = new THREE.Group();
turntable.add(coinGroup);
scene.add(turntable);

/* ---------------- HTML elements -------------------- */
const fillSolidEl    = document.getElementById("fillSolid");
const fillGradientEl = document.getElementById("fillGradient");
const bodyColorEl    = document.getElementById("bodyColor");
const gradAEl        = document.getElementById("gradStart");
const gradBEl        = document.getElementById("gradEnd");
const metalEl        = document.getElementById("metalToggle");
const overlayUrlEl   = document.getElementById("overlayUrl");

/* --------------- Fill application ------------------ */
function clearMaps(mat){ if(mat.map){ mat.map.dispose(); mat.map = null; } }

function applySolidFill() {
  for (const m of [rimMat, faceMat]) {
    clearMaps(m);
    m.color.set(bodyColorEl.value);
    m.needsUpdate = true;
  }
}

function applyGradientFill() {
  const c1 = gradAEl.value, c2 = gradBEl.value;

  const faceTex = makeFaceLinearV(c1, c2);
  const rimTex  = makeRimLinearH(c1, c2);

  faceMat.map = faceTex;
  rimMat.map  = rimTex;
  faceMat.color.set(0xffffff);
  rimMat.color.set(0xffffff);
  faceMat.needsUpdate = true;
  rimMat.needsUpdate  = true;
}

function updateFillMode() {
  const gradientMode = fillGradientEl.checked;
  // Show/hide UI rows
  document.querySelectorAll(".solidControls").forEach(el => el.classList.toggle("hidden", gradientMode));
  document.querySelectorAll(".gradControls").forEach(el => el.classList.toggle("hidden", !gradientMode));
  // Apply
  if (gradientMode) applyGradientFill(); else applySolidFill();
}

/* ---------------- Metallic toggle ------------------ */
function updateMetal() {
  const val = metalEl.checked ? 1 : 0;
  rimMat.metalness = faceMat.metalness = val;
  rimMat.needsUpdate = faceMat.needsUpdate = true;
}

/* ---------------- Overlay handlers ----------------- */
const loader = new THREE.TextureLoader().setCrossOrigin("anonymous");
function applyOverlayTexture(url){
  loader.load(url, tex=>{
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // Clone and mirror horizontally for the bottom
  const texBottom = tex.clone();
  texBottom.wrapS = THREE.RepeatWrapping;
  texBottom.center.set(0.5, 0.5);
  texBottom.repeat.set(-1, 1);  // mirror across U
  texBottom.offset.set(1, 0);   // keep it within [0,1]
  texBottom.needsUpdate = true;

  // Apply
  compTopOverlay.material.map = tex;
  compTopOverlay.material.opacity = 1; compTopOverlay.material.needsUpdate = true;

  compBotOverlay.material.map = texBottom;
  compBotOverlay.material.opacity = 1; compBotOverlay.material.needsUpdate = true;
}, undefined, err => alert("Failed to load image; check URL & CORS"));
}
function clearOverlayTexture(){
  for(const m of [compTopOverlay.material, compBotOverlay.material]){
    m.map = null; m.opacity = 0; m.needsUpdate = true;
  }
}

/* ----------------- Wire up UI ---------------------- */
fillSolidEl.addEventListener("change", updateFillMode);
fillGradientEl.addEventListener("change", updateFillMode);

bodyColorEl.addEventListener("input", () => { if (fillSolidEl.checked) applySolidFill(); });
const reapplyGradient = () => { if (fillGradientEl.checked) applyGradientFill(); };
gradAEl.addEventListener("input", reapplyGradient);
gradBEl.addEventListener("input", reapplyGradient);

metalEl.addEventListener("change", updateMetal);

document.getElementById("applyOverlay").onclick = () =>{
  const url = overlayUrlEl.value.trim();
  if(!url) return alert("Enter an image URL first.");
  applyOverlayTexture(url);
};
document.getElementById("clearOverlay").onclick = clearOverlayTexture;
clearOverlayTexture();

/* ---------------- Initial state -------------------- */
updateMetal();
updateFillMode(); // applies initial Solid fill

/* ---------------- animation loop ------------------- */
function animate(){
  requestAnimationFrame(animate);
  // Spin around world-vertical (Y)
  turntable.rotation.y += spinSpeed;
  renderer.render(scene, camera);
}
animate();

/* ------------- handle resize ----------------------- */
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- helper: planar UV mapping -------------- */
function planarMapHemisphereUVs(geom,{rotation=0,pad=0,invertV=false}={}) {
  geom.computeBoundingBox();
  const bb = geom.boundingBox;
  const r = Math.max(
    Math.abs(bb.max.x), Math.abs(bb.min.x),
    Math.abs(bb.max.z), Math.abs(bb.min.z)
  );
  const pos = geom.attributes.position;
  const uv  = new THREE.BufferAttribute(new Float32Array(pos.count*2),2);
  const scl = 0.5-pad, cos=Math.cos(rotation), sin=Math.sin(rotation);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), z=pos.getZ(i);
    const U=(x/r)*scl,  V=(z/r)*scl;
    let u=0.5+(U*cos - V*sin);
    let v=0.5+(U*sin + V*cos);
    if(invertV) v = 1-v;
    uv.setXY(i,u,v);
  }
  geom.setAttribute("uv",uv);
}
```

Tip: Ensure you have a `<div id="app">` in your `index.html` to mount the three.js scene. Also include the necessary CSS to style the UI elements and position them correctly.

## Node CLI encoder — PNG → WebM (emoji‑spec)

> File: `scripts/encode-emoji-cli.js`
> Requires: Node 18+, **ffmpeg** on PATH (libvpx‑vp9).

```js
#!/usr/bin/env node
/**
 * Encode a PNG sequence to Telegram Custom Emoji WebM:
 *  - 100x100 px, ≤3s, ≤30fps, VP9, alpha (yuva420p), no audio
 *
 * Usage:
 *   node scripts/encode-emoji-cli.js --in "./out/frame_%04d.png" --fps 30 --out coin_emoji.webm --crf 38
 *   OR two-pass with --bitrate 160k
 */
const { spawnSync } = require('node:child_process');

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : def;
}

const inputPattern = arg('--in');
const fps = parseInt(arg('--fps', '30'), 10);
const out = arg('--out', 'coin_emoji.webm');
const crf = arg('--crf', '38');       // if single-pass
const bitrate = arg('--bitrate');     // e.g., "160k" → two-pass

if (!inputPattern) {
  console.error('Missing --in "./frames/frame_%04d.png"'); process.exit(1);
}
if (fps > 30) {
  console.error('FPS must be ≤30 for custom emoji'); process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}

// Scale & encode (always 100x100)
if (!bitrate) {
  // One-pass CRF
  run('ffmpeg', [
    '-y',
    '-framerate', String(fps), '-i', inputPattern,
    '-vf', 'scale=100:100:flags=lanczos',
    '-an',
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuva420p',
    '-b:v', '0',
    '-crf', String(crf),
    out
  ]);
} else {
  // Two-pass, size-target
  run('ffmpeg', [
    '-y', '-framerate', String(fps), '-i', inputPattern,
    '-vf', 'scale=100:100:flags=lanczos',
    '-an', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
    '-b:v', bitrate, '-pass', '1', '-f', 'webm', '/dev/null'
  ]);
  run('ffmpeg', [
    '-framerate', String(fps), '-i', inputPattern,
    '-vf', 'scale=100:100:flags=lanczos',
    '-an', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
    '-b:v', bitrate, '-pass', '2', out
  ]);
}

console.log(`✅ Wrote ${out}`);
```

> Tip: Use **24 fps** and 2–3 s loops if you struggle to hit **≤256 KB**.

---

## Bot + Serverless snippets

### Verify Telegram **initData** (WebApp auth)

> File: `functions/verify-initdata.js`

```js
// Verifies Telegram WebApp initData using HMAC-SHA256 with bot token
const crypto = require('node:crypto');

function parseInitData(str) {
  return new URLSearchParams(str);
}

function check(initData, botToken) {
  const data = parseInitData(initData);
  const hash = data.get('hash');
  data.delete('hash');

  const pairs = [];
  for (const [k, v] of data.entries()) pairs.push(`${k}=${v}`);
  pairs.sort();
  const dataCheckString = pairs.join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calcHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(calcHash, 'hex'), Buffer.from(hash, 'hex'));
}

module.exports = { check };
```

Use this in every function handling WebApp requests.

### 3.2 Netlify function: **send-file.js** (send result to user)

> Input: `multipart/form-data` with `file` (webm) + `initData`.
> Output: `{ ok: true }`

```js
// functions/send-file.js
const fetch = require('node-fetch');
const FormData = require('form-data');
const { check } = require('./verify-initdata');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  // Netlify gives raw body; easiest is to use multipart parser (skipped here); assume you proxy directly
  // If you proxy from client with a direct Bot API upload URL, you can skip serverless; but here we gate with initData.

  // For brevity, assume client uploaded to this function with ?user_id=... and raw body = file
  const userId = event.queryStringParameters.user_id;
  const initData = event.headers['x-telegram-initdata'] || event.headers['X-Telegram-InitData'];
  if (!userId || !initData) return { statusCode: 400, body: 'Missing user_id or initData' };
  if (!check(initData, BOT_TOKEN)) return { statusCode: 401, body: 'Bad initData' };

  // Forward webm to Telegram as document (or sticker)
  const form = new FormData();
  form.append('chat_id', userId);
  form.append('document', Buffer.from(event.body, 'base64'), { filename: 'coin_emoji.webm', contentType: 'video/webm' });

  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    body: form
  }).then(r => r.json());

  return { statusCode: 200, body: JSON.stringify(resp) };
};
```

> If you prefer **sendSticker**, use `sendSticker` and `sticker` field; works for WebM too.

### 3.3 Netlify function: **create-emoji.js** (upload + create set)

> Body: JSON `{ initData, user_id, set_title, set_slug?, emojis: ["🪙"], file: (pre-uploaded URL) }`
> For simplicity below, we accept a base64 webm and do **uploadStickerFile** first.

```js
// functions/create-emoji.js
const fetch = require('node-fetch');
const FormData = require('form-data');
const { check } = require('./verify-initdata');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME; // without @

function slugifyTitle(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `${base}_by_${BOT_USERNAME}`;
}

async function tg(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { initData, user_id, set_title, set_slug, emoji_list = ['🪙'], webm_base64 } = JSON.parse(event.body || '{}');
  if (!initData || !user_id || !set_title || !webm_base64) return { statusCode: 400, body: 'Missing fields' };

  if (!check(initData, BOT_TOKEN)) return { statusCode: 401, body: 'Bad initData' };

  // 1) uploadStickerFile (video)
  const form = new FormData();
  form.append('user_id', String(user_id));
  form.append('sticker_format', 'video');
  form.append('sticker', Buffer.from(webm_base64, 'base64'), { filename: 'coin.webm', contentType: 'video/webm' });

  const upload = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/uploadStickerFile`, {
    method: 'POST', body: form
  }).then(r => r.json());

  if (!upload.ok) return { statusCode: 400, body: JSON.stringify(upload) };
  const fileId = upload.result.file_id;

  // 2) Try to createNewStickerSet (custom emoji)
  const name = (set_slug || slugifyTitle(set_title)).slice(0, 64); // TG limit
  const inputSticker = {
    sticker: fileId,
    format: 'video',
    emoji_list
  };
  let created = await tg('createNewStickerSet', {
    user_id,
    name,
    title: set_title,
    sticker_type: 'custom_emoji',
    stickers: [inputSticker]
  });

  // If set exists, add to it
  if (!created.ok && created.description && /STICKERSET_INVALID|name is already occupied/i.test(created.description)) {
    created = await tg('addStickerToSet', {
      user_id,
      name,
      sticker: inputSticker
    });
  }

  return { statusCode: 200, body: JSON.stringify(created) };
};
```

> You can then show a link like `https://t.me/addemoji/${name}` for users to add the set.

---

## Hooking your **editor** to this pipeline

* **PNG capture** (client): you already rotate via turntable; add a “Capture” that:

  * sets explicit **duration** and **fps**; drives rotation `angle = 2π * (i/N)`;
  * renders to `size=512` (crisper downscale) → produce **Blobs** → **ZIP** (use `fflate`), POST to `/functions/encode-emoji.js`, or encode locally with the CLI when testing.
* **Serverless encoder** (optional): Implement a function like `encode-emoji.js` that receives a **zip** of PNG frames and runs the same ffmpeg arguments as the CLI (scale to **100×100**, VP9, **yuva420p**).
* When **Download** is tapped:

  * Option 1: client receives `coin_emoji.webm` and triggers a direct **download**;
  * Option 2: call `/functions/send-file.js?user_id=...` with the file in body → Telegram DM from the bot.
* When **Get Emoji**:

  * Call `/functions/create-emoji.js` with `{ webm_base64, user_id, set_title, emoji_list }` → returns JSON; show success + set link.

---

## Editor additions (short notes)

* **Rotation speed**: UI radio → set `spinSpeed` (keep loop exporter independent; exporter sets angle deterministically by frame index).
* **Body texture**:

  * **PNG**: `TextureLoader` → `rimMat.map = faceMat.map = tex; color to white; needsUpdate = true`.
  * **GIF/WebM**: create `<video loop muted playsinline>`, set `src`, `load()`, `play()`, then `new THREE.VideoTexture(video)` → assign as above.
* **Overlay images**: repeat the **video** handling for GIF/WebM. Keep the bottom overlay `geometry.rotateY(Math.PI)` before planar UVs to avoid mirrored look.

---

## Payments - TBD after MVP is ready (two optional plans)

### Plan A — Telegram native payments (recommended inside TG)

* When applied, the footer button is not showing "Download" and "Get Emoji" but a "Continue" or "Back to Bot" and the webapp closes, the bot prompts the **Paywall** message, the user proceeds with the payment, if successful the next message offers the "Download" or "Get Emoji", else if the payment fails, the user is prompted to try again.
* Backend:

  * Use `createInvoiceLink` or `sendInvoice` (with provider token).
  * Handle webhook updates for `pre_checkout_query` and `successful_payment`.
  * Store entitlement by `telegram_user_id` (KV/db).
* After success, allow `create-emoji.js` for that user.

### Plan B — Crypto (ETH/SOL or TON)

* **Provider‑based** (easier):

  * ETH/SOL via **Coinbase Commerce** (ETH/USDC), or a Solana payment gateway.
  * Webhook from provider → verify signature → mark user paid.
* **On‑chain verify** (DIY):

  * Display a unique **amount/memo** and your **wallet address**.
  * Client pays; backend polls an RPC/indexer for incoming tx (address + minimum amount + memo).
  * After **N confirmations**, mark user paid.
* **TON** (fits Telegram ecosystem): similar webhook/verify with a TON gateway; TON has tight Telegram tie‑ins if you pivot later.