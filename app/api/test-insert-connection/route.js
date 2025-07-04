import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections } from '@/utils/schema';

export async function POST(req) {
  try {
    console.log('=== Testing Connection Insert ===');
    
    const { userId } = await auth();
    console.log('User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      });
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { recipientId } = body;
    console.log('Recipient ID:', recipientId);

    // Test the insert with minimal data
    console.log('Attempting insert with data:', {
      requesterId: userId,
      recipientId,
      status: 'pending'
    });

    const newConnection = await db
      .insert(UserConnections)
      .values({
        requesterId: userId,
        recipientId,
        status: 'pending'
      })
      .returning();

    console.log('Insert successful:', newConnection);

    return NextResponse.json({
      success: true,
      message: 'Connection created successfully',
      connection: newConnection[0]
    });

  } catch (error) {
    console.error('=== Insert Error ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Insert failed',
      details: error.message,
      type: typeof error,
      stack: error.stack
    }, { status: 500 });
  }
} 