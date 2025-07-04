import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(req) {
  try {
    console.log('=== Testing Send Request Simulation ===');
    
    const { userId } = await auth();
    console.log('Auth user ID:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      });
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { recipientEmail } = body;
    if (!recipientEmail) {
      return NextResponse.json({
        success: false,
        error: 'Recipient email is required'
      });
    }

    console.log('Looking for user with email:', recipientEmail);
    const recipientUser = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.email, recipientEmail))
      .limit(1);

    console.log('Recipient user found:', recipientUser.length);

    if (!recipientUser.length) {
      return NextResponse.json({
        success: false,
        error: 'User not found with this email address'
      });
    }

    const recipientId = recipientUser[0].userId;
    console.log('Recipient ID:', recipientId);

    if (userId === recipientId) {
      return NextResponse.json({
        success: false,
        error: 'You cannot add yourself as a friend'
      });
    }

    console.log('Checking existing connection');
    const existingConnection = await db
      .select()
      .from(UserConnections)
      .where(
        or(
          and(
            eq(UserConnections.requesterId, userId),
            eq(UserConnections.recipientId, recipientId)
          ),
          and(
            eq(UserConnections.requesterId, recipientId),
            eq(UserConnections.recipientId, userId)
          )
        )
      )
      .limit(1);

    console.log('Existing connection found:', existingConnection.length);

    if (existingConnection.length > 0) {
      const connection = existingConnection[0];
      console.log('Connection status:', connection.status);
      
      if (connection.status === 'accepted') {
        return NextResponse.json({
          success: false,
          error: 'You are already friends with this user'
        });
      } else if (connection.status === 'pending') {
        if (connection.requesterId === userId) {
          return NextResponse.json({
            success: false,
            error: 'Friend request already sent'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'You have a pending friend request from this user'
          });
        }
      }
    }

    console.log('Creating new connection with:', { userId, recipientId });
    
    const newConnection = await db
      .insert(UserConnections)
      .values({
        requesterId: userId,
        recipientId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log('New connection created:', newConnection);

    return NextResponse.json({
      success: true,
      message: 'Friend request sent successfully',
      connection: newConnection[0]
    });

  } catch (error) {
    console.error('Error in send-request simulation:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send friend request',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 