import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserConnections, ChatConversations, ChatMessages } from '@/utils/schema';

export async function GET() {
  try {
    // Test if tables exist by trying to select from them
    const userConnectionsTest = await db.select().from(UserConnections).limit(1);
    const chatConversationsTest = await db.select().from(ChatConversations).limit(1);
    const chatMessagesTest = await db.select().from(ChatMessages).limit(1);

    return NextResponse.json({
      success: true,
      message: 'All chat tables exist and are accessible',
      tables: {
        UserConnections: 'exists',
        ChatConversations: 'exists',
        ChatMessages: 'exists'
      }
    });

  } catch (error) {
    console.error('Error testing chat tables:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Chat tables may not exist. Please run the SQL migration first.',
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
} 