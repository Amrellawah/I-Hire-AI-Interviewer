import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/utils/db';
import { UserProfile } from '@/utils/schema';
import { eq } from 'drizzle-orm';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff', 'image/x-icon', 'image/heic',
  'image/jpg', // sometimes jpg is separate
];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Accept all common image types
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported image file type' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    // Use extension from MIME type
    const ext = file.type.split('/')[1] === 'svg+xml' ? 'svg' : file.type.split('/')[1];
    const fileName = `profile_${userId}_${timestamp}.${ext}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const profilePhotoUrl = `/uploads/${fileName}`;

    // Update user profile with new photo URL
    const [updatedProfile] = await db.update(UserProfile)
      .set({
        profilePhoto: profilePhotoUrl,
        updatedAt: new Date()
      })
      .where(eq(UserProfile.userId, userId))
      .returning();

    if (!updatedProfile) {
      // If profile doesn't exist, create one
      await db.insert(UserProfile)
        .values({
          userId,
          email: '', // Will be updated when user provides email
          profilePhoto: profilePhotoUrl,
          isProfileComplete: false
        });
    }

    return NextResponse.json({
      success: true,
      profilePhoto: profilePhotoUrl
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    // Set profilePhoto to null
    const [updatedProfile] = await db.update(UserProfile)
      .set({ profilePhoto: null, updatedAt: new Date() })
      .where(eq(UserProfile.userId, userId))
      .returning();
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile photo' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { userId, profilePhoto } = await req.json();
    if (!userId || !profilePhoto) {
      return NextResponse.json(
        { error: 'userId and profilePhoto are required' },
        { status: 400 }
      );
    }
    // Set profilePhoto to the provided value (e.g., Gmail photo URL)
    const [updatedProfile] = await db.update(UserProfile)
      .set({ profilePhoto, updatedAt: new Date() })
      .where(eq(UserProfile.userId, userId))
      .returning();
    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, profilePhoto });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    return NextResponse.json(
      { error: 'Failed to update profile photo' },
      { status: 500 }
    );
  }
} 