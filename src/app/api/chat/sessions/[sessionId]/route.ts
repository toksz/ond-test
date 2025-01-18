import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    
    if (!sessionId) {
      return NextResponse.json(
        {
          errorCode: 'invalid_request',
          message: 'sessionId is required'
        },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}`,
      {
        headers: {
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