import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log('=== Testing JSON parsing ===');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'JSON parsing successful',
      receivedData: body
    });

  } catch (error) {
    console.error('JSON parsing error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: typeof error
    }, { status: 500 });
  }
} 