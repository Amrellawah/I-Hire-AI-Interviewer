import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { ChatMessages, ChatConversations, UserProfile } from '@/utils/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { recipientEmail, message, messageType = 'text' } = await req.json();

    if (!recipientEmail || !message) {
      return NextResponse.json(
        { error: 'Recipient email and message are required' },
        { status: 400 }
      );
    }

    // Find the recipient user by email
    const recipientUser = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.email, recipientEmail))
      .limit(1);

    if (!recipientUser.length) {
      return NextResponse.json(
        { error: 'User not found with this email address' },
        { status: 404 }
      );
    }

    const recipientId = recipientUser[0].userId;

    // Check if requester is trying to message themselves
    if (userId === recipientId) {
      return NextResponse.json(
        { error: 'You cannot message yourself' },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await db
      .select()
      .from(ChatConversations)
      .where(
        or(
          and(
            eq(ChatConversations.participant1Id, userId),
            eq(ChatConversations.participant2Id, recipientId)
          ),
          and(
            eq(ChatConversations.participant1Id, recipientId),
            eq(ChatConversations.participant2Id, userId)
          )
        )
      )
      .limit(1);

    let conversationId;

    if (existingConversation.length > 0) {
      conversationId = existingConversation[0].conversationId;
    } else {
      // Create new conversation
      conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db
        .insert(ChatConversations)
        .values({
          conversationId,
          participant1Id: userId,
          participant2Id: recipientId,
        });
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
      conversationId,
    });

  } catch (error) {
    console.error('Error sending direct message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 