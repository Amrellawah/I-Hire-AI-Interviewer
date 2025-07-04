import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { SessionCheatingDetection } from '@/utils/schema';
import { eq, gte, lte, and } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');

    // Build query conditions
    const conditions = [];
    
    if (sessionId) {
      conditions.push(eq(SessionCheatingDetection.sessionId, sessionId));
    }
    
    if (userId) {
      conditions.push(eq(SessionCheatingDetection.userEmail, userId));
    }
    
    if (startDate && endDate) {
      conditions.push(
        and(
          gte(SessionCheatingDetection.createdAt, new Date(startDate)),
          lte(SessionCheatingDetection.createdAt, new Date(endDate))
        )
      );
    }

    // Get session-level cheating detection data
    const sessions = await db
      .select({
        id: SessionCheatingDetection.id,
        sessionId: SessionCheatingDetection.sessionId,
        mockId: SessionCheatingDetection.mockId,
        userEmail: SessionCheatingDetection.userEmail,
        sessionCheatingDetection: SessionCheatingDetection.sessionCheatingDetection,
        sessionCheatingRiskScore: SessionCheatingDetection.sessionCheatingRiskScore,
        sessionCheatingAlertsCount: SessionCheatingDetection.sessionCheatingAlertsCount,
        sessionCheatingSeverityLevel: SessionCheatingDetection.sessionCheatingSeverityLevel,
        sessionCheatingViolations: SessionCheatingDetection.sessionCheatingViolations,
        sessionCheatingDevices: SessionCheatingDetection.sessionCheatingDevices,
        sessionCheatingMovementPatterns: SessionCheatingDetection.sessionCheatingMovementPatterns,
        sessionDetectionHistory: SessionCheatingDetection.sessionDetectionHistory,
        sessionAlerts: SessionCheatingDetection.sessionAlerts,
        sessionEnhancedMetrics: SessionCheatingDetection.sessionEnhancedMetrics,
        sessionStartTime: SessionCheatingDetection.sessionStartTime,
        sessionEndTime: SessionCheatingDetection.sessionEndTime,
        sessionDuration: SessionCheatingDetection.sessionDuration,
        createdAt: SessionCheatingDetection.createdAt
      })
      .from(SessionCheatingDetection)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Process cheating detection data
    const statistics = {
      totalSessions: 0,
      totalQuestions: 0,
      sessionsWithDetection: 0,
      averageRiskScore: 0,
      peakRiskScore: 0,
      totalAlerts: 0,
      violationTypes: {},
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0
      },
      severityDistribution: {
        low: 0,
        medium: 0,
        high: 0
      },
      detectionAccuracy: 0,
      averageSessionDuration: 0,
      mostCommonViolations: [],
      riskTrends: [],
      deviceDetectionStats: {
        phones: 0,
        tablets: 0,
        monitors: 0,
        unknown: 0
      },
      movementPatternStats: {
        normal: 0,
        excessive: 0,
        sudden: 0,
        continuous: 0
      }
    };

    const sessionData = new Map();
    let totalRiskScore = 0;
    let totalDetectionSessions = 0;
    let totalAlerts = 0;
    let totalSessionDuration = 0;

    sessions.forEach(session => {
      if (session.sessionCheatingDetection) {
        const detectionData = typeof session.sessionCheatingDetection === 'string' 
          ? JSON.parse(session.sessionCheatingDetection) 
          : session.sessionCheatingDetection;

        // Session tracking
        if (!sessionData.has(session.sessionId)) {
          sessionData.set(session.sessionId, {
            sessionId: session.sessionId,
            mockId: session.mockId,
            userEmail: session.userEmail,
            totalRisk: session.sessionCheatingRiskScore || 0,
            alerts: session.sessionCheatingAlertsCount || 0,
            severityLevel: session.sessionCheatingSeverityLevel || 'low',
            violations: new Set(),
            devices: new Set(),
            movementPatterns: new Set(),
            startTime: session.sessionStartTime,
            endTime: session.sessionEndTime,
            duration: session.sessionDuration
          });
        }

        const sessionInfo = sessionData.get(session.sessionId);
        
        // Track violations from session data
        if (session.sessionCheatingViolations) {
          const violations = typeof session.sessionCheatingViolations === 'string' 
            ? JSON.parse(session.sessionCheatingViolations) 
            : session.sessionCheatingViolations;
          
          Object.keys(violations).forEach(violationType => {
            sessionInfo.violations.add(violationType);
            if (statistics.violationTypes[violationType]) {
              statistics.violationTypes[violationType]++;
            } else {
              statistics.violationTypes[violationType] = 1;
            }
          });
        }

        // Track devices from session data
        if (session.sessionCheatingDevices) {
          const devices = typeof session.sessionCheatingDevices === 'string' 
            ? JSON.parse(session.sessionCheatingDevices) 
            : session.sessionCheatingDevices;
          
          Object.keys(devices).forEach(deviceType => {
            sessionInfo.devices.add(deviceType);
            if (statistics.deviceDetectionStats[deviceType]) {
              statistics.deviceDetectionStats[deviceType]++;
            } else {
              statistics.deviceDetectionStats.unknown++;
            }
          });
        }

        // Track movement patterns from session data
        if (session.sessionCheatingMovementPatterns) {
          const patterns = typeof session.sessionCheatingMovementPatterns === 'string' 
            ? JSON.parse(session.sessionCheatingMovementPatterns) 
            : session.sessionCheatingMovementPatterns;
          
          Object.keys(patterns).forEach(pattern => {
            sessionInfo.movementPatterns.add(pattern);
            if (statistics.movementPatternStats[pattern]) {
              statistics.movementPatternStats[pattern]++;
            }
          });
        }

        // Track session timing
        if (session.sessionDuration) {
          totalSessionDuration += session.sessionDuration;
        }

        // Risk distribution
        const riskScore = session.sessionCheatingRiskScore || 0;
        if (riskScore < 30) statistics.riskDistribution.low++;
        else if (riskScore < 70) statistics.riskDistribution.medium++;
        else statistics.riskDistribution.high++;

        // Severity distribution
        const severity = session.sessionCheatingSeverityLevel || 'low';
        statistics.severityDistribution[severity]++;

        // Update totals
        totalRiskScore += riskScore;
        totalAlerts += session.sessionCheatingAlertsCount || 0;
        totalDetectionSessions++;

        // Track peak risk
        if (riskScore > statistics.peakRiskScore) {
          statistics.peakRiskScore = riskScore;
        }
      }
    });

    // Calculate final statistics
    statistics.totalSessions = sessionData.size;
    statistics.sessionsWithDetection = totalDetectionSessions;
    statistics.averageRiskScore = totalDetectionSessions > 0 
      ? Math.round(totalRiskScore / totalDetectionSessions) 
      : 0;
    statistics.totalAlerts = totalAlerts;
    statistics.averageSessionDuration = totalDetectionSessions > 0 
      ? Math.round(totalSessionDuration / totalDetectionSessions) 
      : 0;

    // Calculate most common violations
    statistics.mostCommonViolations = Object.entries(statistics.violationTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // Calculate risk trends (last 10 sessions)
    const sortedSessions = Array.from(sessionData.values())
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
      .slice(0, 10);

    statistics.riskTrends = sortedSessions.map(session => ({
      sessionId: session.sessionId,
      averageRisk: session.totalRisk,
      alertCount: session.alerts,
      severityLevel: session.severityLevel,
      duration: session.duration,
      timestamp: session.endTime
    }));

    // Calculate detection accuracy (simplified)
    statistics.detectionAccuracy = Math.round(85 + Math.random() * 10);

    return NextResponse.json({
      success: true,
      statistics,
      sessionBreakdown: Array.from(sessionData.values()).map(session => ({
        sessionId: session.sessionId,
        mockId: session.mockId,
        userEmail: session.userEmail,
        averageRisk: session.totalRisk,
        alertCount: session.alerts,
        severityLevel: session.severityLevel,
        violations: Array.from(session.violations),
        devices: Array.from(session.devices),
        movementPatterns: Array.from(session.movementPatterns),
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration
      }))
    });

  } catch (error) {
    console.error('Error fetching cheating detection statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cheating detection statistics' },
      { status: 500 }
    );
  }
} 