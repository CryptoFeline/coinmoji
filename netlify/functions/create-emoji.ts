import { Handler } from '@netlify/functions';
import { verifyTelegramWebAppData } from './utils/telegram-auth';

interface CreateEmojiPayload {
  initData: string;
  user_id: number;
  set_title: string;
  set_slug?: string;
  emoji_list: string[];
  webm_base64: string;
}

const handler: Handler = async (event) => {
  console.log('🎭 Create-emoji function called:', {
    httpMethod: event.httpMethod,
    headers: Object.keys(event.headers),
    bodyLength: event.body?.length || 0
  });

  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const BOT_USERNAME = process.env.BOT_USERNAME;
    
    console.log('🔑 Environment check:', {
      hasBotToken: !!BOT_TOKEN,
      botTokenLength: BOT_TOKEN?.length || 0,
      hasBotUsername: !!BOT_USERNAME,
      botUsername: BOT_USERNAME
    });
    
    if (!BOT_TOKEN || !BOT_USERNAME) {
      console.error('❌ Missing environment variables');
      throw new Error('TELEGRAM_BOT_TOKEN or BOT_USERNAME not configured');
    }

    if (!event.body) {
      console.error('❌ Missing request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    console.log('📝 Parsing request body...');
    const payload: CreateEmojiPayload = JSON.parse(event.body);
    const { initData, user_id, set_title, set_slug, emoji_list = ['🪙'], webm_base64 } = payload;

    console.log('📋 Payload received:', {
      hasInitData: !!initData,
      initDataLength: initData?.length || 0,
      user_id,
      set_title,
      set_slug,
      emoji_list,
      webm_base64_length: webm_base64?.length || 0
    });

    if (!initData || !user_id || !set_title || !webm_base64) {
      console.error('❌ Missing required fields:', {
        hasInitData: !!initData,
        hasUserId: !!user_id,
        hasSetTitle: !!set_title,
        hasWebmBase64: !!webm_base64
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Verify Telegram WebApp data
    console.log('🔐 Verifying Telegram WebApp data...');
    if (!verifyTelegramWebAppData(initData, BOT_TOKEN)) {
      console.error('❌ Invalid Telegram WebApp data');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid Telegram WebApp data' }),
      };
    }
    console.log('✅ Telegram WebApp data verified');

    // Create sticker set name
    console.log('📝 Creating sticker set name...');
    const slugifyTitle = (title: string): string => {
      const base = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      return `${base}_by_@${BOT_USERNAME}`.slice(0, 64);
    };

    const stickerSetName = set_slug || slugifyTitle(set_title);
    console.log('📛 Sticker set name:', stickerSetName);

    // Step 1: Upload sticker file
    console.log('📤 Uploading sticker file...');
    const fileBuffer = Buffer.from(webm_base64, 'base64');
    console.log('📁 File buffer created:', { size: fileBuffer.length });
    
    const formData = new FormData();
    formData.append('user_id', String(user_id));
    formData.append('sticker_format', 'video');
    formData.append('sticker', new Blob([fileBuffer], { type: 'video/webm' }), 'coin.webm');

    console.log('📡 Sending upload request to Telegram...');
    const uploadResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/uploadStickerFile`, {
      method: 'POST',
      body: formData,
    });

    console.log('📡 Upload response:', { 
      status: uploadResponse.status, 
      statusText: uploadResponse.statusText 
    });

    const uploadResult = await uploadResponse.json();
    console.log('📄 Upload result:', uploadResult);
    
    if (!uploadResult.ok) {
      console.error('❌ Upload failed:', uploadResult);
      throw new Error(`Failed to upload sticker: ${uploadResult.description}`);
    }

    const fileId = uploadResult.result.file_id;
    console.log('✅ File uploaded successfully:', { fileId });

    // Step 2: Try to create new sticker set
    console.log('🎭 Creating new sticker set...');
    const inputSticker = {
      sticker: fileId,
      format: 'video',
      emoji_list: emoji_list,
    };

    console.log('📋 Input sticker object:', inputSticker);
    console.log('📋 Create sticker set payload:', {
      user_id,
      name: stickerSetName,
      title: set_title,
      sticker_type: 'custom_emoji',
      stickers: [inputSticker],
    });

    console.log('📡 Sending create sticker set request...');
    let createResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createNewStickerSet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        name: stickerSetName,
        title: set_title,
        sticker_type: 'custom_emoji',
        stickers: [inputSticker],
      }),
    });

    console.log('📡 Create sticker set response:', { 
      status: createResponse.status, 
      statusText: createResponse.statusText 
    });

    let result = await createResponse.json();
    console.log('📄 Create sticker set result:', result);

    // If set already exists, add to existing set
    if (!result.ok && result.description && 
        /STICKERSET_INVALID|name is already occupied/i.test(result.description)) {
      
      console.log('⚠️ Sticker set exists, trying to add to existing set...');
      createResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/addStickerToSet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          name: stickerSetName,
          sticker: inputSticker,
        }),
      });

      console.log('📡 Add to sticker set response:', { 
        status: createResponse.status, 
        statusText: createResponse.statusText 
      });

      result = await createResponse.json();
      console.log('📄 Add to sticker set result:', result);
    }

    console.log('🎉 Final result preparation:', { 
      success: result.ok, 
      hasError: !result.ok,
      description: result.description,
      setUrl: `https://t.me/addemoji/${stickerSetName}`,
      instructions: result.ok ? 'Emoji created successfully! Click the set_url to install in Telegram.' : 'Creation failed'
    });

    if (result.ok) {
      console.log('✅ SUCCESS: Emoji set created successfully!');
      console.log('📱 To use your emoji:');
      console.log(`   1. Click this link: https://t.me/addemoji/${stickerSetName}`);
      console.log('   2. Tap "Add Stickers" in Telegram');
      console.log('   3. Your emoji will now be available in the emoji picker');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: result.ok,
        set_name: stickerSetName,
        set_url: `https://t.me/addemoji/${stickerSetName}`,
        telegram_response: result,
      }),
    };

  } catch (error) {
    console.error('Error in create-emoji function:', error);
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
