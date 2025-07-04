import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections } from '@/utils/schema';
import { eq, or } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      });
    }

    console.log('Checking connections for user:', userId);
    
    // Get all connections for this user
    const connections = await db
      .select()
      .from(UserConnections)
      .where(
        or(
          eq(UserConnections.requesterId, userId),
          eq(UserConnections.recipientId, userId)
        )
      );

    console.log('Found connections:', connections.length);
    console.log('Connections data:', connections);

    return NextResponse.json({
      success: true,
      userId: userId,
      connectionCount: connections.length,
      connections: connections
    });

  } catch (error) {
    console.error('Error checking connections:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 