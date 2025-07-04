import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { SessionCheatingDetection } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { 
      sessionId, 
      mockId, 
      detectionData, 
      riskScore, 
      alerts, 
      enhancedMetrics,
      detectionHistory 
    } = await request.json();

    if (!sessionId || !mockId) {
      return NextResponse.json(
        { error: 'Session ID and Mock ID are required' },
        { status: 400 }
      );
    }

    console.log('Looking for session with:', { sessionId, mockId });
    
    // Get current session
    const currentSession = await db
      .select()
      .from(SessionCheatingDetection)
      .where(
        and(
          eq(SessionCheatingDetection.sessionId, sessionId),
          eq(SessionCheatingDetection.mockId, mockId)
        )
      );

    console.log('Found sessions:', currentSession.length, currentSession.map(s => ({ sessionId: s.sessionId, mockId: s.mockId })));

    if (currentSession.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const session = currentSession[0];
    const currentTime = new Date();
    
    // Calculate session duration
    const sessionDuration = session.sessionStartTime ? 
      Math.floor((currentTime - new Date(session.sessionStartTime)) / 1000) : 0;

    // Parse existing data
    const existingDetectionHistory = session.sessionDetectionHistory ? 
      (typeof session.sessionDetectionHistory === 'string' ? 
        JSON.parse(session.sessionDetectionHistory) : session.sessionDetectionHistory) : [];
    
    const existingAlerts = session.sessionAlerts ? 
      (typeof session.sessionAlerts === 'string' ? 
        JSON.parse(session.sessionAlerts) : session.sessionAlerts) : [];

    const existingViolations = session.sessionCheatingViolations ? 
      (typeof session.sessionCheatingViolations === 'string' ? 
        JSON.parse(session.sessionCheatingViolations) : session.sessionCheatingViolations) : {};

    const existingDevices = session.sessionCheatingDevices ? 
      (typeof session.sessionCheatingDevices === 'string' ? 
        JSON.parse(session.sessionCheatingDevices) : session.sessionCheatingDevices) : {};

    const existingMovementPatterns = session.sessionCheatingMovementPatterns ? 
      (typeof session.sessionCheatingMovementPatterns === 'string' ? 
        JSON.parse(session.sessionCheatingMovementPatterns) : session.sessionCheatingMovementPatterns) : {};

    // Update detection history
    const updatedDetectionHistory = [
      ...existingDetectionHistory,
      {
        timestamp: currentTime.toISOString(),
        detectionData,
        riskScore,
        enhancedMetrics
      }
    ].slice(-100); // Keep last 100 entries

    // Update alerts
    const updatedAlerts = alerts ? [...existingAlerts, ...alerts] : existingAlerts;

    // Update violations count
    const updatedViolations = { ...existingViolations };
    if (alerts) {
      alerts.forEach(alert => {
        const violationType = alert.type || 'unknown';
        updatedViolations[violationType] = (updatedViolations[violationType] || 0) + 1;
      });
    }

    // Update devices detected
    const updatedDevices = { ...existingDevices };
    if (enhancedMetrics?.deviceType) {
      const deviceType = enhancedMetrics.deviceType;
      updatedDevices[deviceType] = (updatedDevices[deviceType] || 0) + 1;
    }

    // Update movement patterns
    const updatedMovementPatterns = { ...existingMovementPatterns };
    if (enhancedMetrics?.movementPattern) {
      const pattern = enhancedMetrics.movementPattern;
      updatedMovementPatterns[pattern] = (updatedMovementPatterns[pattern] || 0) + 1;
    }

    // Calculate session-level risk score (average of all detections)
    const allRiskScores = updatedDetectionHistory
      .map(entry => entry.riskScore || 0)
      .filter(score => score > 0);
    
    const sessionRiskScore = allRiskScores.length > 0 ? 
      Math.round(allRiskScores.reduce((sum, score) => sum + score, 0) / allRiskScores.length) : 0;

    // Determine session severity level
    const getSessionSeverityLevel = (riskScore, alertCount) => {
      if (riskScore >= 70 || alertCount >= 10) return 'high';
      if (riskScore >= 40 || alertCount >= 5) return 'medium';
      return 'low';
    };

    const sessionSeverityLevel = getSessionSeverityLevel(sessionRiskScore, updatedAlerts.length);

    // Update session
    await db
      .update(SessionCheatingDetection)
      .set({
        sessionDuration,
        sessionCheatingDetection: JSON.stringify(detectionData),
        sessionCheatingRiskScore: sessionRiskScore,
        sessionCheatingAlertsCount: updatedAlerts.length,
        sessionCheatingSeverityLevel: sessionSeverityLevel,
        sessionCheatingViolations: JSON.stringify(updatedViolations),
        sessionCheatingDevices: JSON.stringify(updatedDevices),
        sessionCheatingMovementPatterns: JSON.stringify(updatedMovementPatterns),
        sessionDetectionHistory: JSON.stringify(updatedDetectionHistory),
        sessionAlerts: JSON.stringify(updatedAlerts),
        sessionEnhancedMetrics: JSON.stringify(enhancedMetrics),
        updatedAt: currentTime
      })
      .where(eq(SessionCheatingDetection.id, session.id));

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully',
      sessionId,
      mockId,
      sessionRiskScore,
      sessionSeverityLevel,
      sessionDuration,
      alertCount: updatedAlerts.length,
      detectionCount: updatedDetectionHistory.length
    });

  } catch (error) {
    console.error('Error updating session cheating detection:', error);
    return NextResponse.json(
      { error: 'Failed to update session cheating detection' },
      { status: 500 }
    );
  }
} 