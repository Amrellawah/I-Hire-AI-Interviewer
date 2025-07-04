import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserProfile } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        userId: null
      });
    }

    console.log('Checking user profile for:', userId);
    
    // Check if user profile exists
    const userProfile = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, userId))
      .limit(1);

    console.log('User profile found:', userProfile.length > 0);
    
    if (userProfile.length > 0) {
      return NextResponse.json({
        success: true,
        userId: userId,
        profileExists: true,
        profile: {
          email: userProfile[0].email,
          name: userProfile[0].name,
          currentPosition: userProfile[0].currentPosition,
          currentCompany: userProfile[0].currentCompany
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        userId: userId,
        profileExists: false,
        message: 'User profile not found in database'
      });
    }

  } catch (error) {
    console.error('Error checking user profile:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 