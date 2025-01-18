import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { sessionId, query, pluginIds = [] } = await request.json();
    
    if (!sessionId || !query) {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'sessionId and query are required'
        },
        { status: 400 }
      );
    }

    const response = await axios.post(
      'https://api.on-demand.io/chat/v1/query',
      { 
        sessionId,
        query,
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