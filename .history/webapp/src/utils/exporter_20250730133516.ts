import { zip } from 'fflate';

export interface ExportSettings {
  fps: number;
  duration: number; // in seconds
  size: number; // output size (100 for emoji)
}

export class CoinExporter {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private turntable: THREE.Group;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    turntable: THREE.Group
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.turntable = turntable;
  }

  async exportFrames(settings: ExportSettings): Promise<Blob[]> {
    const { fps, duration, size } = settings;
    const totalFrames = Math.floor(fps * duration);
    const frames: Blob[] = [];

    // Store original settings
    const originalSize = { 
      width: this.renderer.domElement.width, 
      height: this.renderer.domElement.height 
    };
    const originalRotation = this.turntable.rotation.y;

    try {
      // Set capture size
      this.renderer.setSize(size, size);
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();

      for (let i = 0; i < totalFrames; i++) {
        // Set rotation for this frame
        const angle = (2 * Math.PI * i) / totalFrames;
        this.turntable.rotation.y = angle;

        // Render frame
        this.renderer.render(this.scene, this.camera);

        // Capture frame as blob
        const blob = await this.captureFrame();
        frames.push(blob);
      }

      return frames;
    } finally {
      // Restore original settings
      this.renderer.setSize(originalSize.width, originalSize.height);
      this.camera.aspect = originalSize.width / originalSize.height;
      this.camera.updateProjectionMatrix();
      this.turntable.rotation.y = originalRotation;
    }
  }

  private captureFrame(): Promise<Blob> {
    return new Promise((resolve) => {
      this.renderer.domElement.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  async exportAsZip(settings: ExportSettings): Promise<Blob> {
    const frames = await this.exportFrames(settings);
    
    const files: Record<string, Uint8Array> = {};
    
    for (let i = 0; i < frames.length; i++) {
      const frameNumber = String(i).padStart(4, '0');
      const fileName = `frame_${frameNumber}.png`;
      files[fileName] = new Uint8Array(await frames[i].arrayBuffer());
    }

    return new Promise((resolve, reject) => {
      zip(files, { level: 6 }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(new Blob([data], { type: 'application/zip' }));
        }
      });
    });
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Telegram WebApp API helpers
export const sendToTelegram = async (blob: Blob, initData: string) => {
  const formData = new FormData();
  formData.append('file', blob, 'coin_emoji.webm');
  formData.append('initData', initData);

  try {
    const response = await fetch('/api/send-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to send file to Telegram');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
};

export const createCustomEmoji = async (
  blob: Blob, 
  initData: string, 
  emojiList: string[] = ['🪙'],
  setTitle: string = 'Custom Coinmoji'
) => {
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const payload = {
    initData,
    user_id: getTelegramUserId(initData),
    set_title: setTitle,
    emoji_list: emojiList,
    webm_base64: base64,
  };

  try {
    const response = await fetch('/api/create-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create custom emoji');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating custom emoji:', error);
    throw error;
  }
};

// Helper to extract user ID from Telegram initData
const getTelegramUserId = (initData: string): number => {
  const params = new URLSearchParams(initData);
  const user = JSON.parse(params.get('user') || '{}');
  return user.id;
};
