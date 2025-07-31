import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const WEBHOOK_URL = `${process.env.NETLIFY_URL || process.env.URL}/.netlify/functions/telegram-webhook`;
    
    if (!BOT_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'TELEGRAM_BOT_TOKEN not configured' }),
      };
    }

    if (!WEBHOOK_URL.includes('https://')) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'WEBHOOK_URL must be HTTPS' }),
      };
    }

    console.log('Setting webhook URL:', WEBHOOK_URL);

    // Set the webhook
    const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message'],
        drop_pending_updates: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram setWebhook error:', errorText);
      throw new Error(`Telegram API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Webhook setup result:', result);

    if (result.ok) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Webhook configured successfully',
          webhook_url: WEBHOOK_URL,
          result: result
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Failed to set webhook',
          details: result
        }),
      };
    }

  } catch (error) {
    console.error('Setup webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
