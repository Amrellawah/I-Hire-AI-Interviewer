import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(req) {
  try {
    console.log('=== DEBUG: Starting send-request API ===');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { requesterId, recipientEmail } = body;

    if (!requesterId || !recipientEmail) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Requester ID and recipient email are required' },
        { status: 400 }
      );
    }

    console.log('Looking for user with email:', recipientEmail);

    // Test database connection first
    try {
      const testQuery = await db.select().from(UserProfile).limit(1);
      console.log('Database connection test successful, found', testQuery.length, 'users');
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      return NextResponse.json({
        error: 'Database connection failed',
        details: dbError.message
      }, { status: 500 });
    }

    // Find the recipient user by email
    let recipientUser;
    try {
      recipientUser = await db
        .select()
        .from(UserProfile)
        .where(eq(UserProfile.email, recipientEmail))
        .limit(1);
      
      console.log('Recipient user query completed, found:', recipientUser.length, 'users');
      console.log('Recipient user data:', recipientUser);
    } catch (userError) {
      console.error('Error finding recipient user:', userError);
      return NextResponse.json({
        error: 'Error finding recipient user',
        details: userError.message
      }, { status: 500 });
    }

    if (!recipientUser.length) {
      console.log('No user found with email:', recipientEmail);
      return NextResponse.json(
        { error: 'User not found with this email address' },
        { status: 404 }
      );
    }

    const recipientId = recipientUser[0].userId;
    console.log('Recipient ID:', recipientId);

    // Check if requester is trying to add themselves
    if (requesterId === recipientId) {
      console.log('User trying to add themselves');
      return NextResponse.json(
        { error: 'You cannot add yourself as a friend' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    let existingConnection;
    try {
      existingConnection = await db
        .select()
        .from(UserConnections)
        .where(
          or(
            and(
              eq(UserConnections.requesterId, requesterId),
              eq(UserConnections.recipientId, recipientId)
            ),
            and(
              eq(UserConnections.requesterId, recipientId),
              eq(UserConnections.recipientId, requesterId)
            )
          )
        )
        .limit(1);

      console.log('Existing connection query completed, found:', existingConnection.length, 'connections');
      console.log('Existing connection data:', existingConnection);
    } catch (connectionError) {
      console.error('Error checking existing connection:', connectionError);
      return NextResponse.json({
        error: 'Error checking existing connection',
        details: connectionError.message
      }, { status: 500 });
    }

    if (existingConnection.length > 0) {
      const connection = existingConnection[0];
      console.log('Existing connection found with status:', connection.status);
      
      if (connection.status === 'accepted') {
        return NextResponse.json(
          { error: 'You are already friends with this user' },
          { status: 400 }
        );
      } else if (connection.status === 'pending') {
        if (connection.requesterId === requesterId) {
          return NextResponse.json(
            { error: 'Friend request already sent' },
            { status: 400 }
          );
        } else {
          return NextResponse.json(
            { error: 'You have a pending friend request from this user' },
            { status: 400 }
          );
        }
      } else if (connection.status === 'blocked') {
        return NextResponse.json(
          { error: 'Cannot send request to blocked user' },
          { status: 400 }
        );
      }
    }

    console.log('Creating new connection with:', { requesterId, recipientId });

    // Create new friend request
    let newConnection;
    try {
      newConnection = await db
        .insert(UserConnections)
        .values({
          requesterId,
          recipientId,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      console.log('New connection created successfully:', newConnection);
    } catch (insertError) {
      console.error('Error creating new connection:', insertError);
      return NextResponse.json({
        error: 'Error creating new connection',
        details: insertError.message
      }, { status: 500 });
    }

    console.log('=== DEBUG: API completed successfully ===');

    return NextResponse.json({
      success: true,
      message: 'Friend request sent successfully',
      connection: newConnection[0],
    });

  } catch (error) {
    console.error('=== DEBUG: Unexpected error in send-request API ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send friend request', 
        details: error.message,
        type: typeof error,
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 