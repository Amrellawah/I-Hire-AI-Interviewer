import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { ChatConversations, ChatMessages, UserProfile } from '@/utils/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if tables exist first
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'ChatConversations'
      );
    `);
    
    if (!tableExists[0]?.exists) {
      return NextResponse.json({
        success: true,
        conversations: [],
        message: 'Chat tables not set up yet'
      });
    }

    // Get all conversations for the user
    const conversationsRaw = await db
      .select()
      .from(ChatConversations)
      .where(
        or(
          eq(ChatConversations.participant1Id, userId),
          eq(ChatConversations.participant2Id, userId)
        )
      )
      .orderBy(desc(ChatConversations.lastMessageAt));

    // For each conversation, determine the other participant and fetch their profile
    const conversations = await Promise.all(
      conversationsRaw.map(async (conv) => {
        const otherParticipantId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
        const profileArr = await db
          .select()
          .from(UserProfile)
          .where(eq(UserProfile.userId, otherParticipantId));
        const otherParticipant = profileArr[0] || null;
        return {
          ...conv,
          otherParticipant,
        };
      })
    );

    // Get unread message counts for each conversation
    const conversationsWithUnreadCounts = await Promise.all(
      conversations.map(async (conversation) => {
        try {
          const unreadCount = await db
            .select({ count: db.fn.count() })
            .from(ChatMessages)
            .where(
              and(
                eq(ChatMessages.conversationId, conversation.conversationId),
                eq(ChatMessages.senderId, conversation.otherParticipant?.userId),
                eq(ChatMessages.isRead, false)
              )
            );

          return {
            ...conversation,
            unreadCount: parseInt(unreadCount[0]?.count || 0),
          };
        } catch (error) {
          console.error('Error getting unread count:', error);
          return {
            ...conversation,
            unreadCount: 0,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      conversations: conversationsWithUnreadCounts,
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    
    // Check if it's a table not found error
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return NextResponse.json({
        success: true,
        conversations: [],
        message: 'Chat tables not set up yet'
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
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

    const { participant2Id } = await req.json();

    if (!participant2Id) {
      return NextResponse.json(
        { error: 'Participant 2 ID is required' },
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
            eq(ChatConversations.participant2Id, participant2Id)
          ),
          and(
            eq(ChatConversations.participant1Id, participant2Id),
            eq(ChatConversations.participant2Id, userId)
          )
        )
      )
      .limit(1);

    if (existingConversation.length > 0) {
      // Fetch the other participant's profile for the response
      const conv = existingConversation[0];
      const otherParticipantId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
      const profileArr = await db
        .select()
        .from(UserProfile)
        .where(eq(UserProfile.userId, otherParticipantId));
      const otherParticipant = profileArr[0] || null;
      return NextResponse.json({
        success: true,
        conversation: { ...conv, otherParticipant },
        message: 'Conversation already exists',
      });
    }

    // Create new conversation
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newConversationArr = await db
      .insert(ChatConversations)
      .values({
        conversationId,
        participant1Id: userId,
        participant2Id,
      })
      .returning();
    const newConversation = newConversationArr[0];
    // Fetch the other participant's profile for the response
    const otherParticipantId = newConversation.participant1Id === userId ? newConversation.participant2Id : newConversation.participant1Id;
    const profileArr = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, otherParticipantId));
    const otherParticipant = profileArr[0] || null;
    return NextResponse.json({
      success: true,
      conversation: { ...newConversation, otherParticipant },
      message: 'Conversation created successfully',
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
} 