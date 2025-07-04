import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { ChatMessages, ChatConversations, UserProfile } from '@/utils/schema';
import { eq, and, desc, or } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Verify user is part of the conversation
    const conversation = await db
      .select()
      .from(ChatConversations)
      .where(
        and(
          eq(ChatConversations.conversationId, conversationId),
          or(
            eq(ChatConversations.participant1Id, userId),
            eq(ChatConversations.participant2Id, userId)
          )
        )
      )
      .limit(1);

    if (!conversation.length) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Get messages for the conversation
    const messages = await db
      .select({
        id: ChatMessages.id,
        conversationId: ChatMessages.conversationId,
        senderId: ChatMessages.senderId,
        message: ChatMessages.message,
        messageType: ChatMessages.messageType,
        isRead: ChatMessages.isRead,
        createdAt: ChatMessages.createdAt,
        sender: {
          userId: UserProfile.userId,
          name: UserProfile.name,
          email: UserProfile.email,
          profilePhoto: UserProfile.profilePhoto,
        },
      })
      .from(ChatMessages)
      .innerJoin(UserProfile, eq(ChatMessages.senderId, UserProfile.userId))
      .where(eq(ChatMessages.conversationId, conversationId))
      .orderBy(desc(ChatMessages.createdAt))
      .limit(50); // Limit to last 50 messages

    // Mark messages as read for the other participant
    await db
      .update(ChatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(ChatMessages.conversationId, conversationId),
          eq(ChatMessages.senderId, userId === conversation[0].participant1Id 
            ? conversation[0].participant2Id 
            : conversation[0].participant1Id),
          eq(ChatMessages.isRead, false)
        )
      );

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { conversationId, message, messageType = 'text' } = await req.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'Conversation ID and message are required' },
        { status: 400 }
      );
    }

    // Verify user is part of the conversation
    const conversation = await db
      .select()
      .from(ChatConversations)
      .where(
        and(
          eq(ChatConversations.conversationId, conversationId),
          or(
            eq(ChatConversations.participant1Id, userId),
            eq(ChatConversations.participant2Id, userId)
          )
        )
      )
      .limit(1);

    if (!conversation.length) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Create new message
    const newMessage = await db
      .insert(ChatMessages)
      .values({
        conversationId,
        senderId: userId,
        message,
        messageType,
        isRead: false,
      })
      .returning();

    // Update conversation's last message timestamp
    await db
      .update(ChatConversations)
      .set({
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(ChatConversations.conversationId, conversationId));

    return NextResponse.json({
      success: true,
      message: newMessage[0],
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 