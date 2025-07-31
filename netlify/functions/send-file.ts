import { Handler } from '@netlify/functions';
import { verifyTelegramWebAppData } from './utils/telegram-auth';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // Get initData from headers or body
    const initData = event.headers['x-telegram-initdata'] || 
                    event.headers['X-Telegram-InitData'];
    
    if (!initData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing Telegram initData' }),
      };
    }

    // Verify Telegram WebApp data
    if (!verifyTelegramWebAppData(initData, BOT_TOKEN)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid Telegram WebApp data' }),
      };
    }

    // Get user ID from query parameters
    const userId = event.queryStringParameters?.user_id;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing user_id parameter' }),
      };
    }

    // Get file from body (base64 string)
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing file data' }),
      };
    }

    // Send file to Telegram - handle base64 string in body
    const fileBuffer = event.isBase64Encoded 
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body, 'base64'); // Body contains base64 string
    
    // Create multipart form data manually
    const boundary = '----formdata-netlify-' + Math.random().toString(16);
    const delimiter = '\r\n--' + boundary;
    const closeDelimiter = delimiter + '--';
    
    let body = '';
    body += delimiter + '\r\n';
    body += 'Content-Disposition: form-data; name="chat_id"\r\n\r\n';
    body += userId + '\r\n';
    body += delimiter + '\r\n';
    body += 'Content-Disposition: form-data; name="document"; filename="coin_emoji.webm"\r\n';
    body += 'Content-Type: video/webm\r\n\r\n';
    
    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf8'),
      fileBuffer,
      Buffer.from(closeDelimiter, 'utf8')
    ]);

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyBuffer,
    });

    const result = await telegramResponse.json();

    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        telegram_response: result,
      }),
    };

  } catch (error) {
    console.error('Error in send-file function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
