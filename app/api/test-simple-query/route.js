import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserProfile } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    console.log('=== Simple Query Test ===');
    
    // Test 1: Authentication
    const { userId } = await auth();
    console.log('User ID from auth:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Test 2: Parse request
    const body = await req.json();
    console.log('Request body:', body);
    
    const { recipientEmail } = body;
    console.log('Recipient email:', recipientEmail);

    // Test 3: Simple query
    console.log('Executing simple query...');
    const users = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.email, recipientEmail))
      .limit(1);

    console.log('Query completed, found users:', users.length);
    console.log('User data:', users);

    return NextResponse.json({
      success: true,
      message: 'Simple query test completed',
      userCount: users.length,
      userData: users
    });

  } catch (error) {
    console.error('=== Error in simple query test ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Simple query test failed',
      details: error.message,
      type: typeof error,
      stack: error.stack
    }, { status: 500 });
  }
} 