import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { SessionCheatingDetection } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { sessionId, mockId, userEmail, detectionSettings } = await request.json();

    console.log('Starting session cheating detection with:', { sessionId, mockId, userEmail });
    
    if (!sessionId || !mockId) {
      return NextResponse.json(
        { error: 'Session ID and Mock ID are required' },
        { status: 400 }
      );
    }

    const sessionStartTime = new Date();

    // Check if session already exists
    const existingSession = await db
      .select()
      .from(SessionCheatingDetection)
      .where(
        and(
          eq(SessionCheatingDetection.sessionId, sessionId),
          eq(SessionCheatingDetection.mockId, mockId)
        )
      );

    if (existingSession.length > 0) {
      // Update existing session
      await db
        .update(SessionCheatingDetection)
        .set({
          sessionStartTime,
          sessionEndTime: null,
          sessionDuration: 0,
          sessionCheatingDetection: null,
          sessionCheatingRiskScore: 0,
          sessionCheatingAlertsCount: 0,
          sessionCheatingSeverityLevel: 'low',
          sessionCheatingViolations: null,
          sessionCheatingDevices: null,
          sessionCheatingMovementPatterns: null,
          sessionDetectionHistory: [],
          sessionAlerts: [],
          sessionEnhancedMetrics: null,
          sessionDetectionSettings: detectionSettings ? JSON.stringify(detectionSettings) : null,
          updatedAt: new Date()
        })
        .where(eq(SessionCheatingDetection.id, existingSession[0].id));

      return NextResponse.json({
        success: true,
        message: 'Session restarted successfully',
        sessionId,
        mockId,
        sessionStartTime: sessionStartTime.toISOString()
      });
    }

    // Try to insert a new session, and if duplicate error, update instead
    try {
      const newSession = await db
        .insert(SessionCheatingDetection)
        .values({
          sessionId,
          mockId,
          userEmail,
          sessionStartTime,
          sessionDetectionSettings: detectionSettings ? JSON.stringify(detectionSettings) : null
        })
        .returning();

      console.log('Session created successfully:', { sessionId, mockId, sessionStartTime: sessionStartTime.toISOString() });
      
      return NextResponse.json({
        success: true,
        message: 'Session started successfully',
        sessionId,
        mockId,
        sessionStartTime: sessionStartTime.toISOString(),
        sessionRecord: newSession[0]
      });
    } catch (error) {
      // If duplicate key error, update the session instead
      if (error.code === '23505') {
        await db
          .update(SessionCheatingDetection)
          .set({
            sessionStartTime,
            sessionEndTime: null,
            sessionDuration: 0,
            sessionCheatingDetection: null,
            sessionCheatingRiskScore: 0,
            sessionCheatingAlertsCount: 0,
            sessionCheatingSeverityLevel: 'low',
            sessionCheatingViolations: null,
            sessionCheatingDevices: null,
            sessionCheatingMovementPatterns: null,
            sessionDetectionHistory: [],
            sessionAlerts: [],
            sessionEnhancedMetrics: null,
            sessionDetectionSettings: detectionSettings ? JSON.stringify(detectionSettings) : null,
            updatedAt: new Date()
          })
          .where(
            and(
              eq(SessionCheatingDetection.sessionId, sessionId),
              eq(SessionCheatingDetection.mockId, mockId)
            )
          );

        return NextResponse.json({
          success: true,
          message: 'Session restarted successfully (after duplicate)',
          sessionId,
          mockId,
          sessionStartTime: sessionStartTime.toISOString()
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error starting session cheating detection:', error);
    return NextResponse.json(
      { error: 'Failed to start session cheating detection' },
      { status: 500 }
    );
  }
} 