import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get pending friend requests where user is the recipient
    const pendingRequests = await db
      .select({
        id: UserConnections.id,
        requesterId: UserConnections.requesterId,
        recipientId: UserConnections.recipientId,
        status: UserConnections.status,
        createdAt: UserConnections.createdAt,
        requester: {
          userId: UserProfile.userId,
          name: UserProfile.name,
          email: UserProfile.email,
          profilePhoto: UserProfile.profilePhoto,
          currentPosition: UserProfile.currentPosition,
          currentCompany: UserProfile.currentCompany,
        },
      })
      .from(UserConnections)
      .innerJoin(UserProfile, eq(UserConnections.requesterId, UserProfile.userId))
      .where(
        and(
          eq(UserConnections.recipientId, userId),
          eq(UserConnections.status, 'pending')
        )
      )
      .orderBy(UserConnections.createdAt);

    return NextResponse.json({
      success: true,
      requests: pendingRequests,
    });

  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend requests' },
      { status: 500 }
    );
  }
} 