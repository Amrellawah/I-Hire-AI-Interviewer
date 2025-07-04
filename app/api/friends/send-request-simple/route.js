import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';
import { eq, and, or } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { requesterId, recipientEmail } = await req.json();

    if (!requesterId || !recipientEmail) {
      return NextResponse.json(
        { error: 'Requester ID and recipient email are required' },
        { status: 400 }
      );
    }

    console.log('Looking for user with email:', recipientEmail);

    // Find the recipient user by email
    const recipientUser = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.email, recipientEmail))
      .limit(1);

    console.log('Recipient user found:', recipientUser);

    if (!recipientUser.length) {
      return NextResponse.json(
        { error: 'User not found with this email address' },
        { status: 404 }
      );
    }

    const recipientId = recipientUser[0].userId;
    console.log('Recipient ID:', recipientId);

    // Check if requester is trying to add themselves
    if (requesterId === recipientId) {
      return NextResponse.json(
        { error: 'You cannot add yourself as a friend' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await db
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

    console.log('Existing connection:', existingConnection);

    if (existingConnection.length > 0) {
      const connection = existingConnection[0];
      
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
    const newConnection = await db
      .insert(UserConnections)
      .values({
        requesterId,
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
      connection: newConnection[0],
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
    
    // Check if it's a table not found error
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return NextResponse.json({
        error: 'Database tables not found. Please run the SQL migration first.',
        details: error.message,
        sqlMigration: `
          -- Run this SQL in your database:
          
          -- Friend connections between users
          CREATE TABLE IF NOT EXISTS "UserConnections" (
            "id" SERIAL PRIMARY KEY,
            "requesterId" varchar(255) NOT NULL,
            "recipientId" varchar(255) NOT NULL,
            "status" varchar(20) DEFAULT 'pending',
            "createdAt" timestamp DEFAULT now(),
            "updatedAt" timestamp DEFAULT now(),
            CONSTRAINT "UserConnections_requesterId_recipientId_unique" UNIQUE("requesterId", "recipientId")
          );

          -- Chat conversations
          CREATE TABLE IF NOT EXISTS "ChatConversations" (
            "id" SERIAL PRIMARY KEY,
            "conversationId" varchar(255) UNIQUE NOT NULL,
            "participant1Id" varchar(255) NOT NULL,
            "participant2Id" varchar(255) NOT NULL,
            "lastMessageAt" timestamp DEFAULT now(),
            "createdAt" timestamp DEFAULT now(),
            "updatedAt" timestamp DEFAULT now()
          );

          -- Chat messages
          CREATE TABLE IF NOT EXISTS "ChatMessages" (
            "id" SERIAL PRIMARY KEY,
            "conversationId" varchar(255) NOT NULL,
            "senderId" varchar(255) NOT NULL,
            "message" text NOT NULL,
            "messageType" varchar(20) DEFAULT 'text',
            "isRead" boolean DEFAULT false,
            "createdAt" timestamp DEFAULT now()
          );
        `
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: 'Failed to send friend request', details: error.message },
      { status: 500 }
    );
  }
} 