import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    console.log('=== Basic Test Endpoint ===');
    console.log('Request received');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Basic test endpoint working',
      receivedData: body
    });

  } catch (error) {
    console.error('Error in basic test:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 