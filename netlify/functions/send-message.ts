import { Handler } from '@netlify/functions';

// Send text message via Telegram bot
const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-InitData',
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
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Bot token not configured' }),
      };
    }

    console.log('📤 Send message function called');

    // Parse the request body
    const { user_id, message } = JSON.parse(event.body || '{}');
    
    if (!user_id || !message) {
      console.error('❌ Missing required fields:', { user_id, hasMessage: !!message });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing user_id or message' }),
      };
    }

    console.log('📋 Message payload:', {
      user_id,
      messageLength: message.length,
      messagePreview: message.substring(0, 50) + '...'
    });

    // Send message via Telegram Bot API
    console.log('📡 Sending message to Telegram...');
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: user_id,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      }),
    });

    console.log('📡 Telegram response:', { 
      status: response.status, 
      statusText: response.statusText 
    });

    const result = await response.json();
    console.log('📄 Telegram result:', result);

    if (!result.ok) {
      console.error('❌ Telegram message send failed:', result);
      throw new Error(`Failed to send message: ${result.description}`);
    }

    console.log('✅ Message sent successfully:', {
      messageId: result.result.message_id,
      chatId: result.result.chat.id
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message_id: result.result.message_id,
        telegram_response: result,
      }),
    };

  } catch (error) {
    console.error('❌ Error in send-message function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
