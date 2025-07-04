import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    console.log('=== Running UserConnections Migration ===');
    
    // Check if table already exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'UserConnections'
      );
    `);
    
    if (tableExists[0]?.exists) {
      return NextResponse.json({
        success: true,
        message: 'UserConnections table already exists',
        tableExists: true
      });
    }
    
    // Create UserConnections table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "UserConnections" (
        "id" SERIAL PRIMARY KEY,
        "requesterId" varchar(255) NOT NULL,
        "recipientId" varchar(255) NOT NULL,
        "status" varchar(20) DEFAULT 'pending',
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "UserConnections_requesterId_recipientId_unique" UNIQUE("requesterId", "recipientId")
      );
    `);
    
    // Create ChatConversations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ChatConversations" (
        "id" SERIAL PRIMARY KEY,
        "conversationId" varchar(255) UNIQUE NOT NULL,
        "participant1Id" varchar(255) NOT NULL,
        "participant2Id" varchar(255) NOT NULL,
        "lastMessageAt" timestamp DEFAULT now(),
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      );
    `);
    
    // Create ChatMessages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ChatMessages" (
        "id" SERIAL PRIMARY KEY,
        "conversationId" varchar(255) NOT NULL,
        "senderId" varchar(255) NOT NULL,
        "message" text NOT NULL,
        "messageType" varchar(20) DEFAULT 'text',
        "isRead" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT now()
      );
    `);
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "UserConnections_requesterId_idx" ON "UserConnections"("requesterId");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "UserConnections_recipientId_idx" ON "UserConnections"("recipientId");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "UserConnections_status_idx" ON "UserConnections"("status");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatConversations_participant1Id_idx" ON "ChatConversations"("participant1Id");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatConversations_participant2Id_idx" ON "ChatConversations"("participant2Id");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatConversations_lastMessageAt_idx" ON "ChatConversations"("lastMessageAt");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatMessages_conversationId_idx" ON "ChatMessages"("conversationId");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatMessages_senderId_idx" ON "ChatMessages"("senderId");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "ChatMessages_createdAt_idx" ON "ChatMessages"("createdAt");`);
    
    console.log('Migration completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'UserConnections and Chat tables created successfully'
    });

  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 