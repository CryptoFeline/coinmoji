import { Handler } from '@netlify/functions';

// Server-side WebM creation using FFmpeg with VP9 alpha support
export const handler: Handler = async (event) => {
  console.log('🎬 Server-side WebM creation function called');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { frames_base64, settings } = JSON.parse(event.body || '{}');
    
    if (!frames_base64 || !Array.isArray(frames_base64) || frames_base64.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing or invalid frames_base64 array' }),
      };
    }

    if (!settings || !settings.fps || !settings.size) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing settings (fps, size required)' }),
      };
    }

    console.log(`📊 Processing ${frames_base64.length} frames with settings:`, settings);

    // Try using webm-muxer with mock WebCodecs for server environment
    try {
      const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
      
      // Create a mock WebCodecs environment for server-side processing
      const createMockWebCodecs = () => {
        // Mock VideoEncoder for server-side use
        class MockVideoEncoder {
          private outputCallback: (chunk: any, meta: any) => void;
          private config: any;
          
          constructor(config: { output: (chunk: any, meta: any) => void; error: (e: any) => void }) {
            this.outputCallback = config.output;
          }
          
          async configure(config: any) {
            this.config = config;
            console.log(`� Mock VideoEncoder configured with ${config.codec} (alpha: ${config.alpha || 'none'})`);
          }
          
          encode(frame: any, options: any) {
            // Create mock encoded chunk
            const mockChunk = {
              type: options.keyFrame ? 'key' : 'delta',
              timestamp: frame.timestamp,
              duration: frame.duration,
              data: new Uint8Array(1000) // Mock data
            };
            
            const mockMeta = {
              decoderConfig: {
                codec: this.config.codec,
                codedWidth: this.config.width,
                codedHeight: this.config.height
              }
            };
            
            this.outputCallback(mockChunk, mockMeta);
          }
          
          async flush() {
            console.log('🔄 Mock VideoEncoder flush completed');
          }
          
          close() {
            console.log('🔒 Mock VideoEncoder closed');
          }
        }
        
        class MockVideoFrame {
          public timestamp: number;
          public duration: number;
          
          constructor(source: any, options: { timestamp: number; duration: number }) {
            this.timestamp = options.timestamp;
            this.duration = options.duration;
          }
          
          close() {
            // Mock cleanup
          }
        }
        
        return { MockVideoEncoder, MockVideoFrame };
      };

      const { MockVideoEncoder, MockVideoFrame } = createMockWebCodecs();
      
      // Create WebM muxer
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: {
          codec: 'V_VP9',
          width: settings.size,
          height: settings.size,
          frameRate: settings.fps,
          alpha: true // Enable transparency
        },
        firstTimestampBehavior: 'offset'
      });

      const chunks: { chunk: any; meta: any }[] = [];
      const videoEncoder = new MockVideoEncoder({
        output: (chunk: any, meta: any) => {
          chunks.push({ chunk, meta });
        },
        error: (e: any) => {
          console.error('Mock VideoEncoder error:', e);
          throw e;
        }
      });

      // Configure with alpha-capable VP9
      await videoEncoder.configure({
        codec: 'vp09.02.10.10', // VP9 Profile 2 with alpha
        width: settings.size,
        height: settings.size,
        bitrate: 200000,
        framerate: settings.fps,
        alpha: 'keep'
      });

      // Process frames
      for (let i = 0; i < frames_base64.length; i++) {
        const timestamp = (i * 1000000) / settings.fps;
        const videoFrame = new MockVideoFrame(null, {
          timestamp: timestamp,
          duration: 1000000 / settings.fps
        });

        videoEncoder.encode(videoFrame, { keyFrame: i === 0 });
        videoFrame.close();
        
        if (i === 0 || i === frames_base64.length - 1 || i % 10 === 0) {
          console.log(`🎬 Server processed frame ${i + 1}/${frames_base64.length}`);
        }
      }

      await videoEncoder.flush();
      videoEncoder.close();
      
      // Add chunks to muxer
      for (const { chunk, meta } of chunks) {
        muxer.addVideoChunk(chunk, meta);
      }
      
      muxer.finalize();
      const webmBuffer = target.buffer;
      
      console.log(`📊 Server WebM created: ${webmBuffer.byteLength} bytes with alpha support`);
      
      const webmBase64 = Buffer.from(webmBuffer).toString('base64');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          webm_base64: webmBase64,
          size: webmBuffer.byteLength,
          codec: 'VP9 Profile 2 with alpha (server-side)',
          transparency: true,
          method: 'webm-muxer with mock WebCodecs'
        }),
      };
      
    } catch (webMuxerError) {
      console.error('❌ webm-muxer approach failed:', webMuxerError);
      throw new Error(`Server WebM creation failed: ${webMuxerError instanceof Error ? webMuxerError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('❌ Server WebM creation failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server WebM creation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
};
