import { Handler, HandlerResponse } from '@netlify/functions';
import { verifyTelegramWebAppData } from './utils/telegram-auth';

interface CreateEmojiPayload {
  initData: string;
  user_id: number;
  set_title: string;
  set_slug?: string;
  emoji_list: string[];
  webm_base64: string;
}

interface BotConfig {
  token: string;
  username: string;
  name: string; // Friendly name for logging
}

// Bot fallback system - tries primary bot first, then backups
const getBotConfigs = (): BotConfig[] => {
  const configs: BotConfig[] = [];
  
  // Primary bot (required)
  const primaryToken = process.env.TELEGRAM_BOT_TOKEN;
  const primaryUsername = process.env.BOT_USERNAME;
  
  if (primaryToken && primaryUsername) {
    configs.push({
      token: primaryToken,
      username: primaryUsername,
      name: 'Primary Bot'
    });
  }
  
  // Backup bots (optional) - numbered BOT_TOKEN_2, BOT_TOKEN_3, etc.
  for (let i = 2; i <= 10; i++) { // Support up to 10 backup bots
    const backupToken = process.env[`TELEGRAM_BOT_TOKEN_${i}`];
    const backupUsername = process.env[`BOT_USERNAME_${i}`];
    
    if (backupToken && backupUsername) {
      configs.push({
        token: backupToken,
        username: backupUsername,
        name: `Backup Bot ${i}`
      });
    }
  }
  
  return configs;
};

// Attempt to create emoji with a specific bot
const tryCreateEmojiWithBot = async (
  bot: BotConfig,
  payload: CreateEmojiPayload
): Promise<{ success: boolean; result?: any; rateLimited?: boolean; retryAfter?: number }> => {
  const { user_id, set_title, emoji_list, webm_base64 } = payload;
  
  console.log(`🤖 Trying ${bot.name} (@${bot.username})...`);
  
  try {
    // Create sticker set name with this bot's username
    const slugifyTitle = (title: string): string => {
      const base = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      return `${base}_by_${bot.username}`.slice(0, 64);
    };

    const stickerSetName = slugifyTitle(set_title);
    console.log(`📛 Sticker set name for ${bot.name}: ${stickerSetName}`);

    // Step 1: Upload sticker file
    console.log(`📤 Uploading sticker file with ${bot.name}...`);
    const fileBuffer = Buffer.from(webm_base64, 'base64');
    
    const formData = new FormData();
    formData.append('user_id', String(user_id));
    formData.append('sticker_format', 'video');
    formData.append('sticker', new Blob([fileBuffer], { type: 'video/webm' }), 'coin.webm');

    const uploadResponse = await fetch(`https://api.telegram.org/bot${bot.token}/uploadStickerFile`, {
      method: 'POST',
      body: formData,
    });

    const uploadResult = await uploadResponse.json();
    console.log(`📄 Upload result for ${bot.name}:`, uploadResult);
    
    if (!uploadResult.ok) {
      // Check if upload failed due to rate limiting
      if (uploadResult.error_code === 429) {
        console.log(`⏰ ${bot.name} is rate limited during upload`);
        return { 
          success: false, 
          rateLimited: true, 
          retryAfter: uploadResult.parameters?.retry_after 
        };
      }
      throw new Error(`Upload failed: ${uploadResult.description}`);
    }

    const fileId = uploadResult.result.file_id;
    console.log(`✅ File uploaded successfully with ${bot.name}:`, { fileId });

    // Step 2: Try to create new sticker set
    const inputSticker = {
      sticker: fileId,
      format: 'video',
      emoji_list: emoji_list,
    };

    console.log(`🎭 Creating new sticker set with ${bot.name}...`);
    let createResponse = await fetch(`https://api.telegram.org/bot${bot.token}/createNewStickerSet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        name: stickerSetName,
        title: `@${set_title}`,
        sticker_type: 'custom_emoji',
        stickers: [inputSticker],
      }),
    });

    let result = await createResponse.json();
    console.log(`📄 Create sticker set result for ${bot.name}:`, result);

    // Check if rate limited
    if (!result.ok && result.error_code === 429) {
      console.log(`⏰ ${bot.name} is rate limited during creation`);
      return { 
        success: false, 
        rateLimited: true, 
        retryAfter: result.parameters?.retry_after 
      };
    }

    // If set already exists, add to existing set
    if (!result.ok && result.description && 
        /STICKERSET_INVALID|name is already occupied/i.test(result.description)) {
      
      console.log(`⚠️ Sticker set exists for ${bot.name}, trying to add to existing set...`);
      createResponse = await fetch(`https://api.telegram.org/bot${bot.token}/addStickerToSet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          name: stickerSetName,
          sticker: inputSticker,
        }),
      });

      result = await createResponse.json();
      console.log(`📄 Add to sticker set result for ${bot.name}:`, result);
      
      // Check rate limiting again for addStickerToSet
      if (!result.ok && result.error_code === 429) {
        console.log(`⏰ ${bot.name} is rate limited during add to set`);
        return { 
          success: false, 
          rateLimited: true, 
          retryAfter: result.parameters?.retry_after 
        };
      }
    }

    // Return result
    return {
      success: result.ok,
      result: {
        ...result,
        bot_used: bot.name,
        bot_username: bot.username,
        set_name: stickerSetName,
        set_url: `https://t.me/addemoji/${stickerSetName}`
      }
    };

  } catch (error) {
    console.error(`❌ Error with ${bot.name}:`, error);
    return { 
      success: false, 
      result: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        bot_used: bot.name
      } 
    };
  }
};

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get all available bot configurations
    const botConfigs = getBotConfigs();
    
    console.log('🔑 Bot configuration check:', {
      totalBots: botConfigs.length,
      bots: botConfigs.map(bot => ({ name: bot.name, username: bot.username }))
    });
    
    if (botConfigs.length === 0) {
      console.error('❌ No bot configurations found');
      throw new Error('No Telegram bot tokens configured');
    }

    if (!event.body) {
      console.error('❌ Missing request body');
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Verify Telegram WebApp data using primary bot token
    console.log('🔐 Verifying Telegram WebApp data...');
    if (!verifyTelegramWebAppData(initData, botConfigs[0].token)) {
      console.error('❌ Invalid Telegram WebApp data');
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid Telegram WebApp data' }),
      };
    }
    console.log('✅ Telegram WebApp data verified');

    // Try each bot in sequence until one succeeds or all are rate limited
    const rateLimitedBots: Array<{ bot: BotConfig; retryAfter: number }> = [];
    let finalResult: any = null;
    let successfulBot: BotConfig | null = null;

    for (const bot of botConfigs) {
      console.log(`� Attempting emoji creation with ${bot.name}...`);
      
      const attempt = await tryCreateEmojiWithBot(bot, payload);
      
      if (attempt.success) {
        console.log(`✅ SUCCESS with ${bot.name}!`);
        finalResult = attempt.result;
        successfulBot = bot;
        break;
      } else if (attempt.rateLimited) {
        console.log(`⏰ ${bot.name} is rate limited, trying next bot...`);
        rateLimitedBots.push({ 
          bot, 
          retryAfter: attempt.retryAfter || 3600 
        });
      } else {
        console.log(`❌ ${bot.name} failed with error:`, attempt.result?.error);
        // Continue to next bot for non-rate-limit errors
      }
    }

    // If no bot succeeded, check if all are rate limited
    if (!finalResult) {
      if (rateLimitedBots.length === botConfigs.length) {
        // All bots are rate limited - return rate limit response
        const shortestWait = Math.min(...rateLimitedBots.map(b => b.retryAfter));
        const retryAfterMinutes = Math.ceil(shortestWait / 60);
        const retryAfterHours = Math.ceil(shortestWait / 3600);
        
        console.log(`⏰ ALL BOTS RATE LIMITED! Shortest wait: ${shortestWait} seconds`);
        
        const rateLimitResponse: HandlerResponse = {
          statusCode: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': shortestWait.toString()
          },
          body: JSON.stringify({
            success: false,
            error: 'rate_limit',
            message: `All emoji creation bots are temporarily rate limited. Please try again in ${
              retryAfterHours > 1 ? `${retryAfterHours} hours` : 
              retryAfterMinutes > 1 ? `${retryAfterMinutes} minutes` : 
              `${shortestWait} seconds`
            }.`,
            retry_after_seconds: shortestWait,
            retry_after_minutes: retryAfterMinutes,
            retry_after_hours: retryAfterHours,
            rate_limited_bots: rateLimitedBots.length,
            total_bots: botConfigs.length,
            suggested_action: retryAfterHours > 1 ? 
              'Download your WebM file instead and create the emoji manually later.' :
              'Please wait and try again shortly.'
          }),
        };
        return rateLimitResponse;
      } else {
        // Some bots failed for other reasons
        throw new Error('All emoji creation attempts failed');
      }
    }

    // Handle successful emoji creation
    console.log('🎉 Final result preparation:', { 
      success: finalResult.ok, 
      hasError: !finalResult.ok,
      description: finalResult.description,
      botUsed: finalResult.bot_used,
      setUrl: finalResult.set_url,
      instructions: finalResult.ok ? 'Emoji created successfully! Click the set_url to install in Telegram.' : 'Creation failed'
    });

    if (finalResult.ok) {
      console.log(`✅ SUCCESS: Emoji set created successfully with ${finalResult.bot_used}!`);
      
      // Send success message to user using the successful bot
      console.log('📤 Sending success message to user...');
      const emojiLink = finalResult.set_url;
      const successMessage = `🎉 <b>Your coin emoji is ready!</b>

<a href="${emojiLink}">Your Coinmoji</a>

<i>Once added, you can use your custom emoji in any chat!</i> 🚀`;
      
      try {
        const messageResponse = await fetch(`${process.env.NETLIFY_SITE_URL || 'https://coinmoji.netlify.app'}/.netlify/functions/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id,
            message: successMessage
          })
        });
        
        const messageResult = await messageResponse.json();
        console.log('📤 Message send result:', messageResult);
        
        if (messageResult.success) {
          console.log('✅ Success message sent to user');
        } else {
          console.warn('⚠️ Failed to send success message:', messageResult);
        }
      } catch (messageError) {
        console.error('❌ Error sending success message:', messageError);
        // Don't fail the main request if message sending fails
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: finalResult.ok,
        set_name: finalResult.set_name,
        set_url: finalResult.set_url,
        bot_used: finalResult.bot_used,
        bot_username: finalResult.bot_username,
        telegram_response: finalResult,
        fallback_info: {
          total_bots_available: botConfigs.length,
          rate_limited_bots: rateLimitedBots.length,
          successful_bot: successfulBot?.name
        }
      }),
    };

  } catch (error) {
    console.error('Error in create-emoji function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
