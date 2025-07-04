import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      success: true,
      userId: userId,
      message: 'User data retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 