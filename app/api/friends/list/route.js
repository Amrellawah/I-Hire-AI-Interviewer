import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';
import { eq, and, or } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all accepted connections for the user
    const connections = await db
      .select({
        id: UserConnections.id,
        requesterId: UserConnections.requesterId,
        recipientId: UserConnections.recipientId,
        status: UserConnections.status,
        createdAt: UserConnections.createdAt,
        friend: {
          userId: UserProfile.userId,
          name: UserProfile.name,
          email: UserProfile.email,
          profilePhoto: UserProfile.profilePhoto,
          currentPosition: UserProfile.currentPosition,
          currentCompany: UserProfile.currentCompany,
        },
      })
      .from(UserConnections)
      .innerJoin(UserProfile, 
        or(
          eq(UserConnections.requesterId, UserProfile.userId),
          eq(UserConnections.recipientId, UserProfile.userId)
        )
      )
      .where(
        and(
          eq(UserConnections.status, 'accepted'),
          or(
            eq(UserConnections.requesterId, userId),
            eq(UserConnections.recipientId, userId)
          ),
          // Exclude the current user from the friend data
          UserProfile.userId !== userId
        )
      )
      .orderBy(UserConnections.createdAt);

    // Transform the data to get friend information
    const friends = connections.map(connection => ({
      connectionId: connection.id,
      friend: connection.friend,
      connectionDate: connection.createdAt,
    }));

    return NextResponse.json({
      success: true,
      friends,
    });

  } catch (error) {
    console.error('Error fetching friends list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends list' },
      { status: 500 }
    );
  }
} 