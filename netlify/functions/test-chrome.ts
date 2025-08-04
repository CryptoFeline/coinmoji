import { Handler } from '@netlify/functions';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export const handler: Handler = async (event, context) => {
  console.log('🧪 Testing chrome-aws-lambda in Netlify environment...');
  
  try {
    console.log('📍 Starting Chrome browser...');
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    
    console.log('✅ Chrome launched successfully');
    
    const page = await browser.newPage();
    await page.goto('data:text/html,<h1>Chrome Works!</h1>');
    
    const title = await page.$eval('h1', el => el.textContent);
    console.log('📄 Page content:', title);
    
    await browser.close();
    console.log('🏁 Chrome test completed successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Chrome AWS Lambda working correctly',
        pageContent: title,
        chromeVersion: await chromium.executablePath ? 'Chrome available' : 'Chrome not found'
      }),
    };
    
  } catch (error) {
    console.error('❌ Chrome test failed:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
