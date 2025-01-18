import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Log request details
    const headersObj: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    console.log('Request Headers:', headersObj);
    
    // Verify content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'Content-Type must be application/json'
        },
        { status: 400 }
      );
    }

    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Request Body:', requestBody);
      console.log('API Key:', process.env.NEXT_PUBLIC_ONDEMAND_API_KEY);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'Invalid JSON request body'
        },
        { status: 400 }
      );
    }

    if (!requestBody || typeof requestBody !== 'object') {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'Request body must be a JSON object'
        },
        { status: 400 }
      );
    }

    const { message, externalUserId, pluginIds = [] } = requestBody;
    
    if (!externalUserId || !message) {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'Both externalUserId and message are required'
        },
        { status: 400 }
      );
    }

    if (typeof externalUserId !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'externalUserId and message must be strings'
        },
        { status: 400 }
      );
    }

    const response = await axios.post(
      'https://api.on-demand.io/chat/v1/sessions',
      {
        message,
        externalUserId,
        pluginIds
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_ONDEMAND_API_KEY
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          errorCode: error.response?.data?.errorCode || 'server_error',
          message: error.response?.data?.message || 'An unexpected error occurred'
        },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      {
        errorCode: 'server_error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}