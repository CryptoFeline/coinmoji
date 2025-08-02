declare module 'ccapture.js' {
  interface CCaptureOptions {
    format: string;
    name?: string;
    framerate?: number;
    quality?: number;
    verbose?: boolean;
    display?: boolean;
    webmOptions?: {
      quality?: number;
      videoBitsPerSecond?: number;
      mimeType?: string;
    };
  }

  class CCapture {
    constructor(options: CCaptureOptions);
    start(): void;
    stop(): void;
    capture(canvas: HTMLCanvasElement): void;
    on?(event: string, callback: (data?: any) => void): void;
  }

  export = CCapture;
}

declare global {
  interface Window {
    CCapture?: any;
  }
}
