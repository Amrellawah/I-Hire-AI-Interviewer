# Video Interview Cheating Detection System

## Overview

The Video Interview Cheating Detection System is a comprehensive AI-powered solution that monitors candidates during video interviews to detect potential cheating behaviors. The system uses computer vision, machine learning, and real-time analysis to ensure interview integrity.

## Features

### 🎯 **Multi-Dimensional Detection**

1. **Face Detection & Tracking**
   - Detects if a face is present in the video
   - Tracks eye movement and gaze direction
   - Identifies when candidate is looking away from screen
   - Monitors facial expressions for suspicious behavior

2. **Multiple Person Detection**
   - Detects multiple faces in the video frame
   - Identifies potential collaboration or assistance
   - Tracks face count over time

3. **Device Detection**
   - **Phone Detection**: Identifies phone screens and devices
   - **Screen Detection**: Detects secondary screens or monitors
   - **Brightness Analysis**: Identifies bright screens in background
   - **Color Analysis**: Detects blue-tinted screens (common for phones)

4. **Movement Analysis**
   - Monitors excessive movement patterns
   - Detects unusual head movements
   - Tracks frame-to-frame changes
   - Identifies suspicious activity patterns

5. **Audio Analysis** (Future Enhancement)
   - Background noise detection
   - Multiple voice detection
   - Audio pattern analysis

### 📊 **Real-Time Monitoring**

- **Continuous Analysis**: Runs every 2-3 seconds during recording
- **Risk Scoring**: Calculates overall risk percentage
- **Alert System**: Immediate notifications for suspicious behavior
- **History Tracking**: Maintains detection history for review

### 🛡️ **Configurable Settings**

```javascript
const detectionSettings = {
  detectionInterval: 3000,        // Analysis frequency (ms)
  confidenceThreshold: 0.7,       // Minimum confidence for alerts
  maxViolations: 3,               // Max violations before high risk
  alertCooldown: 15000,           // Time between alerts (ms)
  faceDetectionEnabled: true,     // Enable face detection
  deviceDetectionEnabled: true,   // Enable device detection
  movementAnalysisEnabled: true,  // Enable movement analysis
  audioAnalysisEnabled: false     // Enable audio analysis (future)
};
```

## Technical Implementation

### Core Components

1. **CheatingDetection.jsx**
   - Main detection component
   - Real-time video analysis
   - Risk calculation and alerting
   - User interface for monitoring

2. **CheatingDetectionReport.jsx**
   - Detailed reporting component
   - Historical data visualization
   - Risk trend analysis
   - Alert summary display

3. **API Endpoints**
   - `/api/save-cheating-detection`: Save detection data
   - Integration with existing evaluation system

### Detection Algorithms

#### Face Detection
```javascript
// Using face-api.js for face detection
const detections = await faceapi.detectAllFaces(
  videoElement, 
  new faceapi.TinyFaceDetectorOptions()
).withFaceLandmarks().withFaceExpressions();

// Eye tracking analysis
const landmarks = detections[0].landmarks;
const leftEye = landmarks.getLeftEye();
const rightEye = landmarks.getRightEye();

// Calculate eye center and direction
const eyeCenter = {
  x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
  y: (leftEyeCenter.y + rightEyeCenter.y) / 2
};

// Check if looking away
const distanceFromCenter = Math.sqrt(
  Math.pow(eyeCenter.x - videoCenter.x, 2) + 
  Math.pow(eyeCenter.y - videoCenter.y, 2)
);

const lookingAway = distanceFromCenter > (videoElement.videoWidth * 0.3);
```

#### Device Detection
```javascript
// Image analysis for device detection
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

let brightPixels = 0;
let bluePixels = 0;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Check for bright pixels (potential screen)
  if (r > 200 && g > 200 && b > 200) {
    brightPixels++;
  }
  
  // Check for blue pixels (potential phone screen)
  if (b > r * 1.5 && b > g * 1.5) {
    bluePixels++;
  }
}

const brightRatio = brightPixels / totalPixels;
const blueRatio = bluePixels / totalPixels;

return {
  screenDetected: brightRatio > 0.3,
  phoneDetected: blueRatio > 0.2,
  confidence: Math.max(brightRatio, blueRatio)
};
```

#### Movement Analysis
```javascript
// Frame difference analysis
const currentData = currentImageData.data;
let totalDifference = 0;
const threshold = 30;

for (let i = 0; i < currentData.length; i += 4) {
  const rDiff = Math.abs(currentData[i] - previousFrameData[i]);
  const gDiff = Math.abs(currentData[i + 1] - previousFrameData[i + 1]);
  const bDiff = Math.abs(currentData[i + 2] - previousFrameData[i + 2]);
  
  const pixelDiff = (rDiff + gDiff + bDiff) / 3;
  if (pixelDiff > threshold) {
    totalDifference++;
  }
}

const movementRatio = totalDifference / (currentData.length / 4);
const excessiveMovement = movementRatio > 0.1; // 10% of pixels changed
```

### Risk Scoring System

```javascript
// Calculate overall risk score
const totalViolations = Object.values(detectionResults).reduce(
  (sum, result) => sum + result.violations, 0
);

const riskScore = Math.min(
  (totalViolations / (settings.maxViolations * 7)) * 100, 100
);

// Risk levels
const getRiskLevel = (risk) => {
  if (risk < 30) return 'Low';
  if (risk < 70) return 'Medium';
  return 'High';
};
```

## Database Schema

### UserAnswer Table Extensions

```sql
-- Cheating detection fields
ALTER TABLE "userAnswer" 
ADD COLUMN "cheatingDetection" JSONB,
ADD COLUMN "cheatingRiskScore" INTEGER DEFAULT 0,
ADD COLUMN "cheatingAlertsCount" INTEGER DEFAULT 0,
ADD COLUMN "cheatingDetectionEnabled" BOOLEAN DEFAULT false,
ADD COLUMN "cheatingDetectionSettings" JSONB;
```

### Data Structure

```javascript
// Cheating detection data structure
{
  riskScore: 45,                    // Overall risk percentage
  alerts: [                         // Array of detection alerts
    {
      id: 1234567890,
      type: 'faceDetection',
      message: 'No face detected in video',
      timestamp: '2024-01-15T10:30:00Z',
      confidence: 0.95,
      violations: 1
    }
  ],
  detectionHistory: [               // Historical detection data
    {
      timestamp: '2024-01-15T10:30:00Z',
      results: {
        faceDetection: { detected: false, confidence: 0.95, violations: 1 },
        eyeTracking: { lookingAway: false, confidence: 0.2, violations: 0 },
        // ... other detection results
      },
      riskScore: 45
    }
  ],
  lastUpdated: '2024-01-15T10:30:00Z'
}
```

## Integration Guide

### 1. Component Integration

```jsx
import CheatingDetection from './CheatingDetection';

// In your video interview component
<CheatingDetection
  webcamRef={webcamRef}
  isRecording={isRecording}
  onCheatingDetected={handleCheatingDetected}
  onCheatingResolved={handleCheatingResolved}
  interviewSettings={{
    detectionInterval: 3000,
    confidenceThreshold: 0.7,
    maxViolations: 3,
    alertCooldown: 15000
  }}
/>
```

### 2. Event Handlers

```javascript
const handleCheatingDetected = (alert) => {
  setCheatingAlerts(prev => [...prev, alert]);
  toast.warning(`Cheating detected: ${alert.message}`, {
    duration: 5000,
    action: {
      label: 'View Details',
      onClick: () => setShowCheatingDetection(true)
    }
  });
};

const handleCheatingResolved = (alertId) => {
  setCheatingAlerts(prev => prev.filter(alert => alert.id !== alertId));
};
```

### 3. Data Saving

```javascript
// Save cheating detection data
const saveCheatingData = async () => {
  const response = await fetch('/api/save-cheating-detection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: sessionId,
      questionIndex: activeQuestionIndex,
      riskScore: overallRisk,
      alerts: alerts,
      detectionHistory: detectionHistory
    })
  });
};
```

## User Interface

### Detection Status Panel

- **Active/Inactive Toggle**: Enable/disable detection
- **Risk Score Display**: Visual progress bar with color coding
- **Real-time Metrics**: Individual detection category status
- **Alert History**: Recent detection alerts with timestamps

### Feedback Integration

- **Collapsible Sections**: Each question can be expanded to show detection data
- **Risk Indicators**: Color-coded risk levels for quick assessment
- **Detailed Reports**: Comprehensive analysis for each answer
- **Historical Trends**: Risk progression over time

## Privacy and Ethics

### Data Protection

- **Local Processing**: Video analysis happens in browser
- **No Video Storage**: Only detection results are saved
- **Minimal Data**: Only metadata and detection flags are stored
- **User Consent**: Clear notification about monitoring

### Fair Use Guidelines

- **False Positive Handling**: Multiple confirmations before flagging
- **Appeal Process**: Candidates can dispute detection results
- **Human Review**: All flagged sessions reviewed by humans
- **Transparency**: Clear explanation of detection methods

## Performance Optimization

### Browser Compatibility

- **WebRTC Support**: Modern browsers with camera access
- **Canvas API**: For image processing and analysis
- **Web Workers**: Background processing for heavy computations
- **Memory Management**: Efficient cleanup of video frames

### Resource Management

```javascript
// Optimize detection frequency
const detectionInterval = isRecording ? 3000 : 10000;

// Cleanup resources
useEffect(() => {
  return () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };
}, []);
```

## Future Enhancements

### Planned Features

1. **Audio Analysis**
   - Background noise detection
   - Multiple voice identification
   - Audio pattern analysis

2. **Advanced AI Models**
   - Custom trained models for specific cheating patterns
   - Machine learning for improved accuracy
   - Adaptive threshold adjustment

3. **Behavioral Analysis**
   - Typing pattern analysis
   - Mouse movement tracking
   - Application switching detection

4. **Integration Features**
   - LMS integration (Canvas, Blackboard)
   - Proctoring service compatibility
   - Custom webhook notifications

### API Extensions

```javascript
// Future API endpoints
POST /api/cheating-detection/analyze-batch
GET /api/cheating-detection/statistics
POST /api/cheating-detection/configure
GET /api/cheating-detection/export-report
```

## Troubleshooting

### Common Issues

1. **Camera Access Denied**
   - Check browser permissions
   - Ensure HTTPS connection
   - Verify camera availability

2. **Detection Not Working**
   - Check face-api.js model loading
   - Verify webcam reference
   - Review console for errors

3. **Performance Issues**
   - Reduce detection frequency
   - Lower video resolution
   - Check browser memory usage

### Debug Mode

```javascript
// Enable debug logging
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Detection results:', detectionResults);
  console.log('Risk score:', riskScore);
  console.log('Alerts:', alerts);
}
```

## Support and Maintenance

### Regular Updates

- **Model Updates**: Regular face-api.js model updates
- **Algorithm Improvements**: Continuous detection accuracy improvements
- **Security Patches**: Regular security and privacy updates
- **Performance Optimization**: Ongoing performance improvements

### Monitoring and Analytics

- **Detection Accuracy**: Track false positive/negative rates
- **Performance Metrics**: Monitor system performance
- **User Feedback**: Collect and analyze user reports
- **Usage Statistics**: Monitor system usage patterns

---

This comprehensive cheating detection system provides robust monitoring capabilities while maintaining user privacy and system performance. The modular design allows for easy customization and future enhancements. 