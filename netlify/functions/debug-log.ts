import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, data, timestamp } = JSON.parse(event.body || '{}');
    
    // Log to Netlify function logs
    console.log(`[DEBUG ${new Date(timestamp).toISOString()}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Debug log error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
