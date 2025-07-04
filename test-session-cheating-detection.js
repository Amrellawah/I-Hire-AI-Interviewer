// Test script to verify session cheating detection functionality
const testSessionCheatingDetection = async () => {
  console.log('🧪 Testing Session Cheating Detection...');

  // Test 1: Start a session
  console.log('\n1. Testing session start...');
  try {
    const startResponse = await fetch('/api/session-cheating-detection/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test_session_123',
        mockId: 'test_mock_456',
        userEmail: 'test@example.com',
        detectionSettings: {
          detectionInterval: 2000,
          confidenceThreshold: 0.75,
          maxViolations: 5,
          alertCooldown: 10000
        }
      })
    });

    if (startResponse.ok) {
      console.log('✅ Session started successfully');
    } else {
      console.log('❌ Failed to start session');
    }
  } catch (error) {
    console.log('❌ Error starting session:', error.message);
  }

  // Test 2: Update session with detection data
  console.log('\n2. Testing session update...');
  try {
    const updateResponse = await fetch('/api/session-cheating-detection/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test_session_123',
        mockId: 'test_mock_456',
        detectionData: {
          riskScore: 45,
          alerts: [
            {
              id: Date.now(),
              type: 'faceDetection',
              message: 'No face detected',
              timestamp: new Date().toISOString(),
              confidence: 0.9,
              violations: 1
            }
          ],
          detectionHistory: [
            {
              timestamp: new Date().toISOString(),
              riskScore: 45,
              results: {
                faceDetection: { detected: false, confidence: 0.9, violations: 1 },
                eyeTracking: { lookingAway: false, confidence: 0.2, violations: 0 }
              }
            }
          ],
          enhancedMetrics: {
            faceQuality: 0,
            movementPattern: 'normal',
            noiseLevel: 0.3,
            deviceType: null,
            gazeStability: 0.2,
            responseTime: 0,
            audioAvailable: true
          },
          severityLevel: 'medium',
          detectionSettings: {
            detectionInterval: 2000,
            confidenceThreshold: 0.75
          }
        },
        riskScore: 45,
        alerts: [
          {
            id: Date.now(),
            type: 'faceDetection',
            message: 'No face detected',
            timestamp: new Date().toISOString(),
            confidence: 0.9,
            violations: 1
          }
        ],
        enhancedMetrics: {
          faceQuality: 0,
          movementPattern: 'normal',
          noiseLevel: 0.3,
          deviceType: null,
          gazeStability: 0.2,
          responseTime: 0,
          audioAvailable: true
        },
        detectionHistory: [
          {
            timestamp: new Date().toISOString(),
            riskScore: 45,
            results: {
              faceDetection: { detected: false, confidence: 0.9, violations: 1 },
              eyeTracking: { lookingAway: false, confidence: 0.2, violations: 0 }
            }
          }
        ]
      })
    });

    if (updateResponse.ok) {
      console.log('✅ Session updated successfully');
    } else {
      console.log('❌ Failed to update session');
    }
  } catch (error) {
    console.log('❌ Error updating session:', error.message);
  }

  // Test 3: End session
  console.log('\n3. Testing session end...');
  try {
    const endResponse = await fetch('/api/session-cheating-detection/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test_session_123',
        mockId: 'test_mock_456',
        finalDetectionData: {
          sessionCompleted: true,
          totalQuestions: 5,
          answeredQuestions: 4,
          skippedQuestions: 1,
          sessionDuration: 300000 // 5 minutes
        }
      })
    });

    if (endResponse.ok) {
      console.log('✅ Session ended successfully');
    } else {
      console.log('❌ Failed to end session');
    }
  } catch (error) {
    console.log('❌ Error ending session:', error.message);
  }

  // Test 4: Get session data
  console.log('\n4. Testing session retrieval...');
  try {
    const getResponse = await fetch('/api/session-cheating-detection/test_mock_456?sessionId=test_session_123');
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ Session data retrieved:', data.sessions?.length || 0, 'sessions found');
    } else {
      console.log('❌ Failed to retrieve session data');
    }
  } catch (error) {
    console.log('❌ Error retrieving session data:', error.message);
  }

  console.log('\n🎉 Session cheating detection test completed!');
};

// Run the test if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testSessionCheatingDetection = testSessionCheatingDetection;
  console.log('🧪 Session cheating detection test available as window.testSessionCheatingDetection()');
} else {
  // Node.js environment
  testSessionCheatingDetection();
} 