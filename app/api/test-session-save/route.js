import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { SessionCheatingDetection } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mockId = searchParams.get('mockId');
    const sessionId = searchParams.get('sessionId');

    let query = db.select().from(SessionCheatingDetection);

    if (mockId) {
      query = query.where(eq(SessionCheatingDetection.mockId, mockId));
    }

    if (sessionId) {
      query = query.where(eq(SessionCheatingDetection.sessionId, sessionId));
    }

    const sessions = await query;

    return NextResponse.json({
      success: true,
      totalSessions: sessions.length,
      sessions: sessions.map(session => ({
        id: session.id,
        sessionId: session.sessionId,
        mockId: session.mockId,
        userEmail: session.userEmail,
        sessionStartTime: session.sessionStartTime,
        sessionEndTime: session.sessionEndTime,
        sessionDuration: session.sessionDuration,
        sessionCheatingRiskScore: session.sessionCheatingRiskScore,
        sessionCheatingAlertsCount: session.sessionCheatingAlertsCount,
        sessionCheatingSeverityLevel: session.sessionCheatingSeverityLevel,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }))
    });

  } catch (error) {
    console.error('Error testing session save:', error);
    return NextResponse.json(
      { error: 'Failed to test session save', details: error.message },
      { status: 500 }
    );
  }
} 