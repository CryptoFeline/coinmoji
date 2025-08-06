import { Handler } from '@netlify/functions';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
}

interface TelegramResponse {
  method: string;
  chat_id: number;
  text?: string;
  reply_markup?: any;
}

const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const BOT_USERNAME = process.env.BOT_USERNAME;
    const WEBAPP_URL = process.env.NETLIFY_URL || process.env.URL;
    
    if (!BOT_TOKEN || !BOT_USERNAME) {
      console.error('Missing bot configuration');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Bot not configured' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const update: TelegramUpdate = JSON.parse(event.body);
    console.log('Received update:', JSON.stringify(update, null, 2));

    // Handle incoming messages
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const firstName = message.from.first_name;

      let response: TelegramResponse;

      if (text === '/start') {
        // Send welcome message with Web App button
        response = {
          method: 'sendMessage',
          chat_id: chatId,
          text: `Welcome to 🪙 Coinmoji, ${firstName}! 

Create amazing 3D Coin Emojis with ease! 

Click the button below to open the App:`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Create Coin Emoji',
                  web_app: {
                    url: WEBAPP_URL
                  }
                }
              ]
            ]
          }
        };
      } else if (text === '/help') {
        response = {
          method: 'sendMessage',
          chat_id: chatId,
          text: `Help with Coinmoji Bot:

Commands:
/start - Start creating coin emojis
/help - Show this help message

How to use:
1. Click "Create Coin Emoji" to open the app
2. Customize your 3D coin shape and appearance
3. Add textures and overlays via URLs
4. Export or create your Telegram emoji
5. Add the emoji set and enjoy! 🪙✨`
        };
      } else {
        // Default response for other messages
        response = {
          method: 'sendMessage',
          chat_id: chatId,
          text: `Hello ${firstName}! 👋 

Use /start to create coin emojis or /help for more information.`
        };
      }

      // Send response to Telegram
      const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/${response.method}`;
      
      const telegramResponse = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: response.chat_id,
          text: response.text,
          reply_markup: response.reply_markup,
        }),
      });

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        console.error('Telegram API error:', errorText);
        throw new Error(`Telegram API error: ${telegramResponse.status}`);
      }

      const result = await telegramResponse.json();
      console.log('Telegram response:', result);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, result }),
      };
    }

    // No message to process
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'No message to process' }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
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
