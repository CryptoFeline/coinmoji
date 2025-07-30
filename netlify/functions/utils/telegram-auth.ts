import crypto from 'crypto';

export interface TelegramInitData {
  auth_date: number;
  hash: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
}

export function parseInitData(initDataString: string): URLSearchParams {
  return new URLSearchParams(initDataString);
}

export function verifyTelegramWebAppData(initDataString: string, botToken: string): boolean {
  try {
    const initData = parseInitData(initDataString);
    const hash = initData.get('hash');
    
    if (!hash) {
      return false;
    }

    // Remove hash from data
    initData.delete('hash');

    // Create data-check-string
    const dataCheckString = Array.from(initData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Generate secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Compare hashes
    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(hash, 'hex')
    );
  } catch (error) {
    console.error('Error verifying Telegram WebApp data:', error);
    return false;
  }
}
