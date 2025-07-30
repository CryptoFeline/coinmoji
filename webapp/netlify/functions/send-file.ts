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

    // Get file from body (base64 encoded)
    if (!event.body || !event.isBase64Encoded) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing file data' }),
      };
    }

    // Send file to Telegram
    const fileBuffer = Buffer.from(event.body, 'base64');
    
    const formData = new FormData();
    formData.append('chat_id', userId);
    formData.append('document', new Blob([fileBuffer], { type: 'video/webm' }), 'coin_emoji.webm');

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData,
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
