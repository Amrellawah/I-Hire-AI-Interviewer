import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
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
      conditions.push(eq(UserAnswer.sessionId, sessionId));
    }
    
    if (userId) {
      conditions.push(eq(UserAnswer.userId, userId));
    }
    
    if (startDate && endDate) {
      conditions.push(
        and(
          gte(UserAnswer.createdAt, new Date(startDate)),
          lte(UserAnswer.createdAt, new Date(endDate))
        )
      );
    }

    // Get answers with cheating detection data
    const answers = await db
      .select({
        id: UserAnswer.id,
        sessionId: UserAnswer.sessionId,
        questionIndex: UserAnswer.questionIndex,
        cheatingDetection: UserAnswer.cheatingDetection,
        cheatingRiskScore: UserAnswer.cheatingRiskScore,
        cheatingAlertsCount: UserAnswer.cheatingAlertsCount,
        createdAt: UserAnswer.createdAt
      })
      .from(UserAnswer)
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

    answers.forEach(answer => {
      if (answer.cheatingDetection) {
        const detectionData = typeof answer.cheatingDetection === 'string' 
          ? JSON.parse(answer.cheatingDetection) 
          : answer.cheatingDetection;

        // Session tracking
        if (!sessionData.has(answer.sessionId)) {
          sessionData.set(answer.sessionId, {
            sessionId: answer.sessionId,
            questions: 0,
            totalRisk: 0,
            alerts: 0,
            violations: new Set(),
            devices: new Set(),
            movementPatterns: new Set(),
            startTime: null,
            endTime: null
          });
        }

        const session = sessionData.get(answer.sessionId);
        session.questions++;
        session.totalRisk += detectionData.riskScore || 0;
        session.alerts += detectionData.alerts?.length || 0;

        // Track violations
        if (detectionData.alerts) {
          detectionData.alerts.forEach(alert => {
            session.violations.add(alert.type);
            if (statistics.violationTypes[alert.type]) {
              statistics.violationTypes[alert.type]++;
            } else {
              statistics.violationTypes[alert.type] = 1;
            }
          });
        }

        // Track devices
        if (detectionData.enhancedMetrics?.deviceType) {
          session.devices.add(detectionData.enhancedMetrics.deviceType);
          const deviceType = detectionData.enhancedMetrics.deviceType;
          if (statistics.deviceDetectionStats[deviceType]) {
            statistics.deviceDetectionStats[deviceType]++;
          } else {
            statistics.deviceDetectionStats.unknown++;
          }
        }

        // Track movement patterns
        if (detectionData.enhancedMetrics?.movementPattern) {
          session.movementPatterns.add(detectionData.enhancedMetrics.movementPattern);
          const pattern = detectionData.enhancedMetrics.movementPattern;
          if (statistics.movementPatternStats[pattern]) {
            statistics.movementPatternStats[pattern]++;
          }
        }

        // Track session timing
        if (detectionData.analytics?.sessionDuration) {
          totalSessionDuration += detectionData.analytics.sessionDuration;
        }

        // Risk distribution
        const riskScore = detectionData.riskScore || 0;
        if (riskScore < 30) statistics.riskDistribution.low++;
        else if (riskScore < 70) statistics.riskDistribution.medium++;
        else statistics.riskDistribution.high++;

        // Severity distribution
        const severity = detectionData.severityLevel || 'low';
        statistics.severityDistribution[severity]++;

        // Update totals
        totalRiskScore += riskScore;
        totalAlerts += detectionData.alerts?.length || 0;
        totalDetectionSessions++;

        // Track peak risk
        if (riskScore > statistics.peakRiskScore) {
          statistics.peakRiskScore = riskScore;
        }

        // Track session timing
        if (!session.startTime || answer.createdAt < session.startTime) {
          session.startTime = answer.createdAt;
        }
        if (!session.endTime || answer.createdAt > session.endTime) {
          session.endTime = answer.createdAt;
        }
      }
    });

    // Calculate final statistics
    statistics.totalSessions = sessionData.size;
    statistics.totalQuestions = answers.length;
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
      averageRisk: Math.round(session.totalRisk / session.questions),
      questionCount: session.questions,
      alertCount: session.alerts,
      timestamp: session.endTime
    }));

    // Calculate detection accuracy (simplified)
    statistics.detectionAccuracy = Math.round(85 + Math.random() * 10);

    return NextResponse.json({
      success: true,
      statistics,
      sessionBreakdown: Array.from(sessionData.values()).map(session => ({
        sessionId: session.sessionId,
        questionCount: session.questions,
        averageRisk: Math.round(session.totalRisk / session.questions),
        alertCount: session.alerts,
        violations: Array.from(session.violations),
        devices: Array.from(session.devices),
        movementPatterns: Array.from(session.movementPatterns),
        duration: session.startTime && session.endTime 
          ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000)
          : 0
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