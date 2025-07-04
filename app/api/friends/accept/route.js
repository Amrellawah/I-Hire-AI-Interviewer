import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { connectionId } = await req.json();

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    // Update the connection status to accepted
    const updatedConnection = await db
      .update(UserConnections)
      .set({
        status: 'accepted',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(UserConnections.id, connectionId),
          eq(UserConnections.recipientId, userId),
          eq(UserConnections.status, 'pending')
        )
      )
      .returning();

    if (!updatedConnection.length) {
      return NextResponse.json(
        { error: 'Friend request not found or already processed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Friend request accepted successfully',
      connection: updatedConnection[0],
    });

  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json(
      { error: 'Failed to accept friend request' },
      { status: 500 }
    );
  }
} 