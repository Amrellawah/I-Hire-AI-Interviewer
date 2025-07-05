import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Extract sessionId and mockId from the data
    const { sessionId, mockId, userEmail, ...detectionData } = data;
    
    if (!sessionId || !mockId) {
      return NextResponse.json(
        { error: 'Session ID and Mock ID are required' },
        { status: 400 }
      );
    }

    // First, try to create/start the session
    try {
      const createResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/session-cheating-detection/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          mockId,
          userEmail,
          detectionSettings: detectionData.detectionSettings || {
            detectionInterval: 2000,
            confidenceThreshold: 0.75,
            maxViolations: 5,
            alertCooldown: 10000,
            faceDetectionEnabled: true,
            deviceDetectionEnabled: true,
            movementAnalysisEnabled: true,
            audioAnalysisEnabled: true,
            tabSwitchingDetectionEnabled: true,
            typingDetectionEnabled: true
          }
        })
      });

      if (!createResponse.ok) {
        console.warn('Session creation failed, but continuing with update');
      }
    } catch (error) {
      console.warn('Session creation attempt failed:', error);
    }

    // Then update the session with detection data
    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/session-cheating-detection/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        mockId,
        detectionData,
        riskScore: detectionData.riskScore || 0,
        alerts: detectionData.alerts || [],
        enhancedMetrics: detectionData.enhancedMetrics || {},
        detectionHistory: detectionData.detectionHistory || []
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Error response body:', errorText);
      return NextResponse.json(
        { error: `Failed to update session: ${errorText}` },
        { status: updateResponse.status }
      );
    }

    const result = await updateResponse.json();
    
    return NextResponse.json({
      success: true,
      message: 'Cheating detection data saved successfully (redirected to session API)',
      ...result
    });

  } catch (error) {
    console.error('Error in save-cheating-detection:', error);
    return NextResponse.json(
      { error: 'Failed to save cheating detection data' },
      { status: 500 }
    );
  }
} 