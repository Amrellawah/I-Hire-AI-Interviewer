-- Chat and Friend System Migration
-- Add these tables to your database manually

-- Friend connections between users
CREATE TABLE IF NOT EXISTS "UserConnections" (
  "id" SERIAL PRIMARY KEY,
  "requesterId" varchar(255) NOT NULL,
  "recipientId" varchar(255) NOT NULL,
  "status" varchar(20) DEFAULT 'pending', -- pending, accepted, rejected, blocked
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
  "messageType" varchar(20) DEFAULT 'text', -- text, image, file
  "isRead" boolean DEFAULT false,
  "createdAt" timestamp DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE "UserConnections" 
ADD CONSTRAINT "UserConnections_requesterId_UserProfile_userId_fk" 
FOREIGN KEY ("requesterId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE;

ALTER TABLE "UserConnections" 
ADD CONSTRAINT "UserConnections_recipientId_UserProfile_userId_fk" 
FOREIGN KEY ("recipientId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE;

ALTER TABLE "ChatConversations" 
ADD CONSTRAINT "ChatConversations_participant1Id_UserProfile_userId_fk" 
FOREIGN KEY ("participant1Id") REFERENCES "UserProfile"("userId") ON DELETE CASCADE;

ALTER TABLE "ChatConversations" 
ADD CONSTRAINT "ChatConversations_participant2Id_UserProfile_userId_fk" 
FOREIGN KEY ("participant2Id") REFERENCES "UserProfile"("userId") ON DELETE CASCADE;

ALTER TABLE "ChatMessages" 
ADD CONSTRAINT "ChatMessages_conversationId_ChatConversations_conversationId_fk" 
FOREIGN KEY ("conversationId") REFERENCES "ChatConversations"("conversationId") ON DELETE CASCADE;

ALTER TABLE "ChatMessages" 
ADD CONSTRAINT "ChatMessages_senderId_UserProfile_userId_fk" 
FOREIGN KEY ("senderId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "UserConnections_requesterId_idx" ON "UserConnections"("requesterId");
CREATE INDEX IF NOT EXISTS "UserConnections_recipientId_idx" ON "UserConnections"("recipientId");
CREATE INDEX IF NOT EXISTS "UserConnections_status_idx" ON "UserConnections"("status");

CREATE INDEX IF NOT EXISTS "ChatConversations_participant1Id_idx" ON "ChatConversations"("participant1Id");
CREATE INDEX IF NOT EXISTS "ChatConversations_participant2Id_idx" ON "ChatConversations"("participant2Id");
CREATE INDEX IF NOT EXISTS "ChatConversations_lastMessageAt_idx" ON "ChatConversations"("lastMessageAt");

CREATE INDEX IF NOT EXISTS "ChatMessages_conversationId_idx" ON "ChatMessages"("conversationId");
CREATE INDEX IF NOT EXISTS "ChatMessages_senderId_idx" ON "ChatMessages"("senderId");
CREATE INDEX IF NOT EXISTS "ChatMessages_createdAt_idx" ON "ChatMessages"("createdAt"); 