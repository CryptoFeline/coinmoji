import { Handler } from '@netlify/functions';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import * as path from 'path';

interface MultipartData {
  file: Buffer;
  filename: string;
  mimetype: string;
}

const parseMultipartData = (body: string | null, boundary: string): MultipartData => {
  if (!body) {
    throw new Error('No body provided');
  }

  const bodyBuffer = Buffer.from(body, 'base64');
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  
  // Find file part
  const parts: Buffer[] = [];
  let currentIndex = 0;
  
  while (currentIndex < bodyBuffer.length) {
    const boundaryIndex = bodyBuffer.indexOf(boundaryBuffer, currentIndex);
    if (boundaryIndex === -1) break;
    
    if (currentIndex > 0) {
      parts.push(bodyBuffer.slice(currentIndex, boundaryIndex));
    }
    
    currentIndex = boundaryIndex + boundaryBuffer.length;
  }

  // Find the file part (contains Content-Type)
  for (const part of parts) {
    const partStr = part.toString('binary');
    
    if (partStr.includes('Content-Type:')) {
      const headerEnd = partStr.indexOf('\r\n\r\n');
      if (headerEnd === -1) continue;
      
      const headers = partStr.substring(0, headerEnd);
      const fileData = part.slice(headerEnd + 4, part.length - 2); // Remove trailing \r\n
      
      // Extract filename
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'unknown';
      
      // Extract Content-Type
      const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/);
      const mimetype = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
      
      return {
        file: fileData,
        filename,
        mimetype
      };
    }
  }
  
  throw new Error('No file found in multipart data');
};

const getMimetype = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const mimetypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webm': 'video/webm'
  };
  return mimetypeMap[ext] || 'application/octet-stream';
};

export const handler: Handler = async (event) => {
  console.log('📤 Upload temp file function called:', {
    httpMethod: event.httpMethod,
    headers: Object.keys(event.headers),
    bodyLength: event.body?.length || 0
  });

  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse multipart form data
    const contentType = event.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    
    if (!boundary) {
      throw new Error('No boundary found in Content-Type');
    }

    console.log('📋 Parsing multipart data with boundary:', boundary.substring(0, 20) + '...');

    // Parse file from multipart data
    const { file, filename, mimetype } = parseMultipartData(event.body, boundary);
    
    console.log('📁 File parsed:', {
      filename,
      mimetype,
      size: `${(file.length / 1024).toFixed(1)}KB`
    });

    // Validate file type
    if (!mimetype.match(/^(image|video)\/(jpeg|jpg|png|gif|webm)$/)) {
      console.log('❌ Unsupported file type:', mimetype);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unsupported file type. Please use JPG, PNG, GIF, or WebM.' })
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.length > maxSize) {
      console.log('❌ File too large:', `${(file.length / 1024 / 1024).toFixed(1)}MB`);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB.` })
      };
    }

    // Generate unique temporary filename
    const tempId = randomUUID();
    const extension = path.extname(filename);
    const tempFilename = `temp_${tempId}${extension}`;
    const tempPath = path.join('/tmp', tempFilename);

    console.log('💾 Writing temp file:', tempPath);

    // Write file to /tmp
    await writeFile(tempPath, file);

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    console.log('✅ Temp file created successfully:', {
      tempId,
      filename: tempFilename,
      size: `${(file.length / 1024).toFixed(1)}KB`,
      expiresIn: '5 minutes'
    });

    // Return temporary file info
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        tempId,
        tempPath,
        filename: tempFilename,
        originalName: filename,
        mimetype,
        size: file.length,
        expiresAt,
        message: 'File uploaded successfully'
      })
    };

  } catch (error) {
    console.error('❌ Upload error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
