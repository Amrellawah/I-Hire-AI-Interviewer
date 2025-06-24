import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserProfile, CVAnalysis } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'userId or email is required' },
        { status: 400 }
      );
    }

    let profile;
    if (userId) {
      profile = await db.select().from(UserProfile).where(eq(UserProfile.userId, userId));
    } else {
      profile = await db.select().from(UserProfile).where(eq(UserProfile.email, email));
    }

    if (profile.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const profileData = await req.json();
    const { userId, email } = profileData;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'userId and email are required' },
        { status: 400 }
      );
    }

    // Validate array fields for drizzle schema
    const safeProfileData = {
      ...profileData,
      skills: Array.isArray(profileData.skills) ? profileData.skills : [],
      languages: Array.isArray(profileData.languages) ? profileData.languages : [],
      certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
    };

    // Debug log incoming data
    console.log('UserProfile POST incoming:', safeProfileData);

    // Check if profile already exists
    const existingProfile = await db.select().from(UserProfile).where(eq(UserProfile.userId, userId));
    
    if (existingProfile.length > 0) {
      // Update existing profile
      const [updatedProfile] = await db.update(UserProfile)
        .set({
          ...safeProfileData,
          updatedAt: new Date()
        })
        .where(eq(UserProfile.userId, userId))
        .returning();

      return NextResponse.json(updatedProfile);
    } else {
      // Create new profile
      const [newProfile] = await db.insert(UserProfile)
        .values(safeProfileData)
        .returning();

      return NextResponse.json(newProfile);
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json(
      { error: 'Failed to create/update user profile', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { userId, ...updateData } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const [updatedProfile] = await db.update(UserProfile)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(UserProfile.userId, userId))
      .returning();

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 