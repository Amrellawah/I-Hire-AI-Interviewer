import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { SessionCheatingDetection } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { mockId } = params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!mockId) {
      return NextResponse.json(
        { error: 'Mock ID is required' },
        { status: 400 }
      );
    }

    let query = db
      .select()
      .from(SessionCheatingDetection)
      .where(eq(SessionCheatingDetection.mockId, mockId));

    // If sessionId is provided, filter by it
    if (sessionId) {
      query = query.where(eq(SessionCheatingDetection.sessionId, sessionId));
    }

    const sessions = await query;

    if (sessions.length === 0) {
      return NextResponse.json({
        success: true,
        sessions: [],
        message: 'No sessions found for this mock interview'
      });
    }

    // Process sessions data
    const processedSessions = sessions.map(session => {
      const sessionData = {
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
      };

      // Parse JSON fields
      if (session.sessionCheatingDetection) {
        try {
          sessionData.sessionCheatingDetection = typeof session.sessionCheatingDetection === 'string' ? 
            JSON.parse(session.sessionCheatingDetection) : session.sessionCheatingDetection;
        } catch (error) {
          sessionData.sessionCheatingDetection = null;
        }
      }

      if (session.sessionCheatingViolations) {
        try {
          sessionData.sessionCheatingViolations = typeof session.sessionCheatingViolations === 'string' ? 
            JSON.parse(session.sessionCheatingViolations) : session.sessionCheatingViolations;
        } catch (error) {
          sessionData.sessionCheatingViolations = {};
        }
      }

      if (session.sessionCheatingDevices) {
        try {
          sessionData.sessionCheatingDevices = typeof session.sessionCheatingDevices === 'string' ? 
            JSON.parse(session.sessionCheatingDevices) : session.sessionCheatingDevices;
        } catch (error) {
          sessionData.sessionCheatingDevices = {};
        }
      }

      if (session.sessionCheatingMovementPatterns) {
        try {
          sessionData.sessionCheatingMovementPatterns = typeof session.sessionCheatingMovementPatterns === 'string' ? 
            JSON.parse(session.sessionCheatingMovementPatterns) : session.sessionCheatingMovementPatterns;
        } catch (error) {
          sessionData.sessionCheatingMovementPatterns = {};
        }
      }

      if (session.sessionDetectionHistory) {
        try {
          sessionData.sessionDetectionHistory = typeof session.sessionDetectionHistory === 'string' ? 
            JSON.parse(session.sessionDetectionHistory) : session.sessionDetectionHistory;
        } catch (error) {
          sessionData.sessionDetectionHistory = [];
        }
      }

      if (session.sessionAlerts) {
        try {
          sessionData.sessionAlerts = typeof session.sessionAlerts === 'string' ? 
            JSON.parse(session.sessionAlerts) : session.sessionAlerts;
        } catch (error) {
          sessionData.sessionAlerts = [];
        }
      }

      if (session.sessionEnhancedMetrics) {
        try {
          sessionData.sessionEnhancedMetrics = typeof session.sessionEnhancedMetrics === 'string' ? 
            JSON.parse(session.sessionEnhancedMetrics) : session.sessionEnhancedMetrics;
        } catch (error) {
          sessionData.sessionEnhancedMetrics = {};
        }
      }

      if (session.sessionDetectionSettings) {
        try {
          sessionData.sessionDetectionSettings = typeof session.sessionDetectionSettings === 'string' ? 
            JSON.parse(session.sessionDetectionSettings) : session.sessionDetectionSettings;
        } catch (error) {
          sessionData.sessionDetectionSettings = {};
        }
      }

      return sessionData;
    });

    // Calculate summary statistics
    const summaryStats = {
      totalSessions: processedSessions.length,
      completedSessions: processedSessions.filter(s => s.sessionEndTime).length,
      activeSessions: processedSessions.filter(s => !s.sessionEndTime).length,
      averageRiskScore: Math.round(
        processedSessions.reduce((sum, s) => sum + (s.sessionCheatingRiskScore || 0), 0) / processedSessions.length
      ),
      totalAlerts: processedSessions.reduce((sum, s) => sum + (s.sessionCheatingAlertsCount || 0), 0),
      severityBreakdown: {
        high: processedSessions.filter(s => s.sessionCheatingSeverityLevel === 'high').length,
        medium: processedSessions.filter(s => s.sessionCheatingSeverityLevel === 'medium').length,
        low: processedSessions.filter(s => s.sessionCheatingSeverityLevel === 'low').length
      }
    };

    return NextResponse.json({
      success: true,
      sessions: processedSessions,
      summaryStats,
      totalCount: processedSessions.length
    });

  } catch (error) {
    console.error('Error fetching session cheating detection data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session cheating detection data' },
      { status: 500 }
    );
  }
} 