"use client";
import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { AlertTriangle, Eye, EyeOff, Users, Monitor, Shield, AlertCircle, Volume2, VolumeX, Clock, Activity, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const CheatingDetection = forwardRef(({ 
  webcamRef, 
  isRecording, 
  onCheatingDetected,
  onCheatingResolved,
  onCheatingRiskUpdate,
  onLandmarkData,
  sessionId,
  questionIndex,
  interviewSettings = {},
  showDetails = false
}, ref) => {
  const [detectionResults, setDetectionResults] = useState({
    faceDetection: { detected: false, confidence: 0, violations: 0, lastSeen: Date.now(), faceQuality: 0 },
    eyeTracking: { lookingAway: false, confidence: 0, violations: 0, gazeHistory: [] },
    multipleFaces: { detected: false, count: 0, violations: 0, facePositions: [] },
    phoneDetection: { detected: false, confidence: 0, violations: 0, deviceType: null },
    headMovement: { excessiveHeadMovement: false, confidence: 0, violations: 0, headMovementPattern: 'normal' },
    audioAnalysis: { backgroundNoise: false, confidence: 0, violations: 0, noiseLevel: 0 },
    tabSwitching: { detected: false, confidence: 0, violations: 0, switchCount: 0 },
    typingDetection: { detected: false, confidence: 0, violations: 0, typingPattern: 'normal', typingSpeed: 0, suspiciousEvents: [] }
  });

  const [isActive, setIsActive] = useState(true); // Automatically enabled
  const [overallRisk, setOverallRisk] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [testMode, setTestMode] = useState(false); // Disabled by default for production
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const frameCountRef = useRef(0);
  const lastAlertTimeRef = useRef(0);
  const lastFaceSeenRef = useRef(Date.now());
  const gazeHistoryRef = useRef([]);
  const movementHistoryRef = useRef([]);
  const audioHistoryRef = useRef([]);
  const tabSwitchTimeRef = useRef(Date.now());
  const typingStartTimeRef = useRef(null);
  const headMovementHistoryRef = useRef([]);

  // YOLO-only detection settings
  const settings = {
    detectionInterval: interviewSettings.detectionInterval || 2000,
    confidenceThreshold: interviewSettings.confidenceThreshold || 0.75,
    maxViolations: interviewSettings.maxViolations || 5,
    alertCooldown: interviewSettings.alertCooldown || 10000,
    faceDetectionTimeout: 5000, // 5 seconds without face = violation
    gazeTrackingWindow: 10, // Track last 10 gaze positions
    movementThreshold: 0.08, // Adaptive movement threshold
    audioThreshold: 0.6, // Audio analysis threshold
    tabSwitchThreshold: 3000, // 3 seconds between tab switches
    typingThreshold: 2000, // 2 seconds of continuous typing
    // YOLO-only detection settings
    faceDetectionEnabled: true,
    deviceDetectionEnabled: true, // Only YOLO device detection
    movementAnalysisEnabled: true,
    audioAnalysisEnabled: true,
    tabSwitchingDetectionEnabled: true,
    typingDetectionEnabled: true,
    yoloOnly: true, // Force YOLO-only mode
    ...interviewSettings
  };

  // Enhanced face detection with temporal analysis
  const detectFaces = useCallback(async (videoElement) => {
    try {
      const faceapi = await import('face-api.js');
      
      const detections = await faceapi.detectAllFaces(
        videoElement, 
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.4 // Balanced threshold
        })
      ).withFaceLandmarks().withFaceExpressions();

      const currentTime = Date.now();
      const results = {
        faceCount: detections.length,
        primaryFace: null,
        lookingAway: false,
        expressions: {},
        faceQuality: 0,
        eyeOpenness: 0
      };

      if (detections.length > 0) {
        results.primaryFace = detections[0];
        lastFaceSeenRef.current = currentTime;
        
        // Call landmark data callback
        if (onLandmarkData) {
          onLandmarkData(detections[0].landmarks);
        }
        
        // Enhanced eye tracking with 68-point landmarks
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        
        // Safety checks for eye data
        if (!leftEye || leftEye.length === 0 || !rightEye || rightEye.length === 0) {
          console.warn('Invalid eye data detected');
          return { faceCount: 1, primaryFace: detections[0], lookingAway: false, expressions: {} };
        }
        
        // Enhanced eye center calculation with better weighting
        const leftEyeCenter = leftEye.reduce((acc, point, index) => {
          // Weight inner eye points more heavily for better accuracy
          const weight = index < 6 ? 1.5 : 1.0;
          return {
            x: acc.x + point.x * weight,
            y: acc.y + point.y * weight
          };
        }, { x: 0, y: 0 });
        
        leftEyeCenter.x /= leftEye.reduce((sum, _, index) => sum + (index < 6 ? 1.5 : 1.0), 0);
        leftEyeCenter.y /= leftEye.reduce((sum, _, index) => sum + (index < 6 ? 1.5 : 1.0), 0);

        const rightEyeCenter = rightEye.reduce((acc, point, index) => {
          const weight = index < 6 ? 1.5 : 1.0;
          return {
            x: acc.x + point.x * weight,
            y: acc.y + point.y * weight
          };
        }, { x: 0, y: 0 });
        
        rightEyeCenter.x /= rightEye.reduce((sum, _, index) => sum + (index < 6 ? 1.5 : 1.0), 0);
        rightEyeCenter.y /= rightEye.reduce((sum, _, index) => sum + (index < 6 ? 1.5 : 1.0), 0);

        // Calculate eye openness with more precision
        const leftEyeOpenness = Math.abs(leftEye[1].y - leftEye[5].y);
        const rightEyeOpenness = Math.abs(rightEye[1].y - rightEye[5].y);
        results.eyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;

        // Enhanced gaze tracking with multiple reference points
        const videoCenter = { x: videoElement.videoWidth / 2, y: videoElement.videoHeight / 2 };
        const eyeCenter = {
          x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
          y: (leftEyeCenter.y + rightEyeCenter.y) / 2
        };

        // Calculate gaze direction using eye corners and center
        const leftEyeCorner = leftEye[0]; // Leftmost point of left eye
        const rightEyeCorner = rightEye[3]; // Rightmost point of right eye
        const eyeWidth = Math.sqrt(
          Math.pow(rightEyeCorner.x - leftEyeCorner.x, 2) + 
          Math.pow(rightEyeCorner.y - leftEyeCorner.y, 2)
        );

        // Calculate gaze direction vector
        const gazeVector = {
          x: eyeCenter.x - videoCenter.x,
          y: eyeCenter.y - videoCenter.y
        };

        // Normalize gaze vector
        const gazeDistance = Math.sqrt(gazeVector.x * gazeVector.x + gazeVector.y * gazeVector.y);
        const normalizedGaze = {
          x: gazeVector.x / gazeDistance,
          y: gazeVector.y / gazeDistance
        };

        // Enhanced distance calculation with adaptive thresholds
        const distanceFromCenter = Math.sqrt(
          Math.pow(eyeCenter.x - videoCenter.x, 2) + 
          Math.pow(eyeCenter.y - videoCenter.y, 2)
        );

        // Adaptive threshold based on video size and face size
        const faceBox = detections[0].detection.box;
        const faceSize = Math.sqrt(faceBox.width * faceBox.height);
        const videoDiagonal = Math.sqrt(
          Math.pow(videoElement.videoWidth, 2) + 
          Math.pow(videoElement.videoHeight, 2)
        );
        
        // Dynamic threshold that adapts to face size and video size
        const baseThreshold = Math.min(videoElement.videoWidth * 0.35, videoElement.videoHeight * 0.35);
        const faceSizeFactor = Math.max(0.5, Math.min(1.5, faceSize / (videoDiagonal * 0.3)));
        const adaptiveThreshold = baseThreshold * faceSizeFactor;

        // Enhanced looking away detection with confidence
        const lookingAwayDistance = distanceFromCenter > adaptiveThreshold;
        const lookingAwayConfidence = Math.min(1.0, distanceFromCenter / (adaptiveThreshold * 1.5));
        
        results.lookingAway = lookingAwayDistance;
        results.gazeConfidence = lookingAwayConfidence;
        results.gazeDistance = distanceFromCenter;
        results.gazeThreshold = adaptiveThreshold;

        // Calculate gaze zones for more detailed analysis
        const gazeZone = calculateGazeZone(eyeCenter, videoElement);
        results.gazeZone = gazeZone;
        
        // Enhanced gaze history with more data
        gazeHistoryRef.current.push({
          x: eyeCenter.x,
          y: eyeCenter.y,
          timestamp: currentTime,
          lookingAway: results.lookingAway,
          confidence: lookingAwayConfidence,
          zone: gazeZone,
          eyeOpenness: results.eyeOpenness,
          faceSize: faceSize
        });
        
        // Keep only recent gaze data
        if (gazeHistoryRef.current.length > settings.gazeTrackingWindow) {
          gazeHistoryRef.current.shift();
        }

        // Analyze gaze patterns for suspicious behavior
        if (gazeHistoryRef.current.length >= 5) {
          const recentGaze = gazeHistoryRef.current.slice(-5);
          if (recentGaze && recentGaze.length > 0) {
            const lookingAwayCount = recentGaze.filter(g => g && g.lookingAway).length;
            const averageConfidence = recentGaze.reduce((sum, g) => sum + (g ? g.confidence : 0), 0) / recentGaze.length;
            
            // Detect rapid gaze changes (suspicious)
            const gazeChanges = recentGaze.filter((g, i) => 
              i > 0 && g && recentGaze[i-1] && g.lookingAway !== recentGaze[i-1].lookingAway
            ).length;
            
            results.gazePattern = {
              lookingAwayCount,
              averageConfidence,
              gazeChanges,
              isSuspicious: gazeChanges > 3 || (lookingAwayCount >= 3 && averageConfidence > 0.7)
            };
          }
        }

        // Analyze facial expressions for suspicious behavior
        if (detections[0].expressions) {
          results.expressions = detections[0].expressions;
          
          // Check for suspicious expressions
          const suspiciousExpressions = {
            fear: detections[0].expressions.fear > 0.3,
            surprise: detections[0].expressions.surprise > 0.4,
            disgust: detections[0].expressions.disgust > 0.2
          };
          
          results.suspiciousExpressions = suspiciousExpressions;
        }

        // Calculate face quality score
        const faceArea = faceBox.width * faceBox.height;
        const videoArea = videoElement.videoWidth * videoElement.videoHeight;
        results.faceQuality = Math.min(faceArea / videoArea * 100, 100);
      } else {
        // No face detected - check timeout
        const timeSinceLastFace = currentTime - lastFaceSeenRef.current;
        if (timeSinceLastFace > settings.faceDetectionTimeout) {
          results.faceTimeout = true;
        }
      }

      return results;
    } catch (error) {
      console.error('Face detection error:', error);
      return { faceCount: 0, primaryFace: null, lookingAway: false, expressions: {} };
    }
  }, [settings.faceDetectionTimeout, settings.gazeTrackingWindow, onLandmarkData]);

  // Calculate gaze zone (center, left, right, top, bottom)
  const calculateGazeZone = (eyeCenter, videoElement) => {
    const centerX = videoElement.videoWidth / 2;
    const centerY = videoElement.videoHeight / 2;
    const threshold = Math.min(videoElement.videoWidth, videoElement.videoHeight) * 0.2;
    
    const dx = eyeCenter.x - centerX;
    const dy = eyeCenter.y - centerY;
    
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      return 'center';
    } else if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'bottom' : 'top';
    }
  };

  // Initialize face-api.js models with error handling
  const initializeModels = useCallback(async () => {
    try {
      const faceapi = await import('face-api.js');
      
      // Load models with progress tracking
      const modelPromises = [
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ];

      await Promise.all(modelPromises);
      console.log('✅ Cheating detection models loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load cheating detection models:', error);
      // Fallback to basic detection methods
    }
  }, []);

  // YOLO-only device detection
  const detectDevices = useCallback(async (videoElement) => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0);

      // Convert canvas to base64 for API call
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Call YOLO backend API
      const response = await fetch('/api/detect-mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) {
        console.error('YOLO backend unavailable - device detection disabled');
        return {
          phoneDetected: false,
          deviceType: null,
          confidence: 0,
          detections: [],
          metrics: {
            totalDetections: 0,
            maxConfidence: 0,
            backendUsed: 'none',
            error: 'YOLO backend unavailable'
          },
          landmarks: {
            brightAreas: [],
            blueAreas: [],
            whiteAreas: [],
            edgePoints: [],
            detectedRegions: []
          }
        };
      }

      const result = await response.json();
      
      // Process YOLO detection results
      const phoneDetected = result.mobile_detected;
      const confidence = result.confidence || 0;
      const detections = result.detections || [];
      
      // Device type classification based on detection area and confidence
      let deviceType = null;
      if (phoneDetected) {
        if (detections.length > 0) {
          const largestDetection = detections.reduce((max, det) => 
            det.area > max.area ? det : max, detections[0]);
          
          // Classify based on detection area and confidence
          if (largestDetection.area > 50000 && confidence > 0.9) {
            deviceType = 'tablet';
          } else if (confidence > 0.8) {
            deviceType = 'phone';
          } else {
            deviceType = 'mobile_device';
          }
        } else {
          deviceType = 'mobile_device';
        }
      }

      // Create landmarks for visualization
      const deviceLandmarks = {
        brightAreas: [],
        blueAreas: [],
        whiteAreas: [],
        edgePoints: [],
        detectedRegions: []
      };

      // Add YOLO detection boxes as landmarks
      if (detections.length > 0) {
        deviceLandmarks.detectedRegions = detections.map(detection => ({
          center: detection.center,
          size: detection.area,
          confidence: detection.confidence,
          bbox: detection.bbox,
          type: 'yolo_detection'
        }));
      }

      return {
        phoneDetected,
        deviceType,
        confidence,
        detections: detections,
        metrics: {
          totalDetections: result.total_detections || 0,
          maxConfidence: confidence,
          backendUsed: 'yolo'
        },
        landmarks: deviceLandmarks
      };
    } catch (error) {
      console.error('YOLO device detection error:', error);
      return {
        phoneDetected: false,
        deviceType: null,
        confidence: 0,
        detections: [],
        metrics: {
          totalDetections: 0,
          maxConfidence: 0,
          backendUsed: 'none',
          error: error.message
        },
        landmarks: {
          brightAreas: [],
          blueAreas: [],
          whiteAreas: [],
          edgePoints: [],
          detectedRegions: []
        }
      };
    }
  }, []);

  // Enhanced head movement detection using face landmarks
  const detectHeadMovement = useCallback(async (videoElement) => {
    try {
      const faceapi = await import('face-api.js');
      
      const detections = await faceapi.detectAllFaces(
        videoElement, 
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.4
        })
      ).withFaceLandmarks();

      if (detections.length === 0) {
        return { 
          excessiveHeadMovement: false, 
          confidence: 0, 
          headMovementPattern: 'normal',
          headPosition: null
        };
      }

      const face = detections[0];
      const landmarks = face.landmarks;
      const currentTime = Date.now();

      // Get key head landmarks for movement tracking
      const nose = landmarks.getNose()[3]; // Tip of nose
      const leftEye = landmarks.getLeftEye()[0]; // Left eye corner
      const rightEye = landmarks.getRightEye()[3]; // Right eye corner
      const leftMouth = landmarks.getMouth()[0]; // Left mouth corner
      const rightMouth = landmarks.getMouth()[6]; // Right mouth corner

      // Calculate head center and orientation
      const headCenter = {
        x: (leftEye.x + rightEye.x + nose.x) / 3,
        y: (leftEye.y + rightEye.y + nose.y) / 3
      };

      // Calculate head tilt and rotation
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye.x - leftEye.x, 2) + 
        Math.pow(rightEye.y - leftEye.y, 2)
      );

      const mouthWidth = Math.sqrt(
        Math.pow(rightMouth.x - leftMouth.x, 2) + 
        Math.pow(rightMouth.y - leftMouth.y, 2)
      );

      // Store head position history
      if (!headMovementHistoryRef.current) {
        headMovementHistoryRef.current = [];
      }

      headMovementHistoryRef.current.push({
        center: headCenter,
        eyeDistance,
        mouthWidth,
        timestamp: currentTime
      });

      // Keep only last 10 positions
      if (headMovementHistoryRef.current.length > 10) {
        headMovementHistoryRef.current.shift();
      }

      // Analyze head movement patterns
      let excessiveHeadMovement = false;
      let headMovementPattern = 'normal';
      let confidence = 0;

      if (headMovementHistoryRef.current.length >= 3) {
        const recentPositions = headMovementHistoryRef.current.slice(-3);
        
        // Calculate movement between recent positions
        const movements = [];
        for (let i = 1; i < recentPositions.length; i++) {
          const prev = recentPositions[i - 1];
          const curr = recentPositions[i];
          
          const movement = Math.sqrt(
            Math.pow(curr.center.x - prev.center.x, 2) + 
            Math.pow(curr.center.y - prev.center.y, 2)
          );
          movements.push(movement);
        }

        const avgMovement = movements && movements.length > 0 ? movements.reduce((sum, m) => sum + (m || 0), 0) / movements.length : 0;
        const maxMovement = Math.max(...movements);

        // Detect excessive head movement
        const videoDiagonal = Math.sqrt(
          Math.pow(videoElement.videoWidth, 2) + 
          Math.pow(videoElement.videoHeight, 2)
        );
        const movementThreshold = videoDiagonal * 0.1; // 10% of video diagonal

        if (avgMovement > movementThreshold || maxMovement > movementThreshold * 1.5) {
          excessiveHeadMovement = true;
          confidence = Math.min(avgMovement / movementThreshold, 1);
        }

        // Classify head movement patterns
        if (maxMovement > movementThreshold * 2) {
          headMovementPattern = 'sudden_jerk';
        } else if (avgMovement > movementThreshold * 0.8) {
          headMovementPattern = 'continuous_movement';
        } else if (movements.some(m => m > movementThreshold * 1.2)) {
          headMovementPattern = 'sporadic_movement';
        }

        // Detect head tilting (suspicious behavior)
        const recentEyeDistances = recentPositions.map(p => p.eyeDistance).filter(d => d !== undefined && d !== null);
        const eyeDistanceVariance = recentEyeDistances.length > 0 ? recentEyeDistances.reduce((sum, d, i) => {
          const avg = recentEyeDistances.reduce((a, b) => a + (b || 0), 0) / recentEyeDistances.length;
          return sum + Math.pow((d || 0) - avg, 2);
        }, 0) / recentEyeDistances.length : 0;

        if (eyeDistanceVariance > Math.pow(eyeDistance * 0.1, 2)) {
          headMovementPattern = 'head_tilting';
          excessiveHeadMovement = true;
          confidence = Math.max(confidence, 0.7);
        }
      }

      return {
        excessiveHeadMovement,
        confidence,
        headMovementPattern,
        headPosition: headCenter,
        metrics: {
          eyeDistance,
          mouthWidth,
          movementHistory: headMovementHistoryRef.current.length
        }
      };
    } catch (error) {
      console.error('Head movement detection error:', error);
      return { 
        excessiveHeadMovement: false, 
        confidence: 0, 
        headMovementPattern: 'normal',
        headPosition: null
      };
    }
  }, []);

  // Helper function to get audio stream
  const getAudioStream = useCallback(async () => {
    try {
      // Try to get audio stream from webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        },
        video: false
      });
      return stream;
    } catch (error) {
      console.log('Could not get audio stream:', error.message);
      return null;
    }
  }, []);

  // Initialize audio stream on component mount
  useEffect(() => {
    if (isActive && isRecording) {
      getAudioStream().then(audioStream => {
        if (audioStream) {
          console.log('Audio stream obtained successfully');
        }
      });
    }
  }, [isActive, isRecording, getAudioStream]);

  // Enhanced audio analysis with frequency domain analysis
  const analyzeAudio = useCallback(async (audioStream) => {
    try {
      // Check if audio stream exists and has audio tracks
      if (!audioStream || !audioStream.getAudioTracks || audioStream.getAudioTracks().length === 0) {
        console.log('No audio stream or audio tracks available, skipping audio analysis');
        return {
          backgroundNoise: false,
          confidence: 0,
          noiseLevel: 0,
          audioAvailable: false
        };
      }

      // Check if audio context is supported
      if (!window.AudioContext && !window.webkitAudioContext) {
        console.log('AudioContext not supported, skipping audio analysis');
        return {
          backgroundNoise: false,
          confidence: 0,
          noiseLevel: 0,
          audioAvailable: false
        };
      }

      if (!audioContext) {
        try {
          const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
          const newAnalyser = newAudioContext.createAnalyser();
          
          // Check if we can create media stream source
          const microphone = newAudioContext.createMediaStreamSource(audioStream);
          
          microphone.connect(newAnalyser);
          newAnalyser.fftSize = 512;
          newAnalyser.smoothingTimeConstant = 0.8;
          
          setAudioContext(newAudioContext);
          setAnalyser(newAnalyser);
        } catch (audioError) {
          console.log('Failed to initialize audio context:', audioError.message);
          return {
            backgroundNoise: false,
            confidence: 0,
            noiseLevel: 0,
            audioAvailable: false,
            error: audioError.message
          };
        }
      }

      if (!analyser) {
        console.log('Audio analyser not available, skipping audio analysis');
        return {
          backgroundNoise: false,
          confidence: 0,
          noiseLevel: 0,
          audioAvailable: false
        };
      }
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeArray = new Uint8Array(bufferLength);
      
      analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(timeArray);
      
      // Frequency domain analysis
      let sum = 0;
      let variance = 0;
      let peakFrequency = 0;
      let lowFreqEnergy = 0;
      let highFreqEnergy = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
        if (dataArray[i] > peakFrequency) peakFrequency = dataArray[i];
        
        // Analyze different frequency bands
        if (i < bufferLength / 4) {
          lowFreqEnergy += dataArray[i];
        } else if (i > bufferLength * 3 / 4) {
          highFreqEnergy += dataArray[i];
        }
      }
      
      const average = sum / bufferLength;
      
      for (let i = 0; i < bufferLength; i++) {
        variance += Math.pow(dataArray[i] - average, 2);
      }
      variance /= bufferLength;
      
      // Time domain analysis for background noise
      let rms = 0;
      for (let i = 0; i < timeArray.length; i++) {
        rms += Math.pow(timeArray[i] - 128, 2);
      }
      rms = Math.sqrt(rms / timeArray.length);

      // Enhanced noise detection
      const backgroundNoise = variance > 800 || rms > 20 || (highFreqEnergy > lowFreqEnergy * 1.5);
      const noiseLevel = Math.min((variance + rms) / 100, 1);

      // Update audio history
      audioHistoryRef.current.push({
        variance,
        rms,
        peakFrequency,
        lowFreqEnergy,
        highFreqEnergy,
        timestamp: Date.now()
      });

      if (audioHistoryRef.current.length > 30) {
        audioHistoryRef.current.shift();
      }
      
      return {
        backgroundNoise,
        confidence: Math.min(noiseLevel, 1),
        noiseLevel,
        audioAvailable: true,
        metrics: { variance, rms, peakFrequency, lowFreqEnergy, highFreqEnergy }
      };
    } catch (error) {
      console.error('Audio analysis error:', error);
      return { 
        backgroundNoise: false, 
        confidence: 0, 
        noiseLevel: 0, 
        audioAvailable: false,
        error: error.message 
      };
    }
  }, [audioContext, analyser]);

  // Enhanced typing detection with improved thresholds and reduced false positives
  const detectTyping = useCallback(() => {
    // Initialize typing detection if not already done
    if (!window.typingDetectionInitialized) {
      window.typingDetectionInitialized = true;
      window.typingData = {
        keystrokes: [],
        startTime: null,
        lastKeyTime: null,
        typingSpeed: 0,
        patterns: [],
        suspiciousEvents: [],
        violationCount: 0,
        lastViolationTime: 0
      };

      // Add keyboard event listeners
      const handleKeyDown = (event) => {
        const currentTime = Date.now();
        
        // Skip if it's a modifier key, function key, or navigation key
        if (event.ctrlKey || event.altKey || event.metaKey || 
            event.key === 'Shift' || event.key === 'Tab' || 
            event.key === 'Enter' || event.key === 'Backspace' ||
            event.key === 'Delete' || event.key === 'ArrowUp' ||
            event.key === 'ArrowDown' || event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight' || event.key === 'Home' ||
            event.key === 'End' || event.key === 'PageUp' ||
            event.key === 'PageDown' || event.key === 'Escape') {
      return;
    }

        // Skip single character keys that are likely navigation
        if (event.key.length !== 1) {
      return;
    }

        // Initialize start time
        if (!window.typingData.startTime) {
          window.typingData.startTime = currentTime;
        }

        // Calculate time since last keystroke
        const timeSinceLastKey = window.typingData.lastKeyTime ? 
          currentTime - window.typingData.lastKeyTime : 0;

        // Record keystroke data
        window.typingData.keystrokes.push({
          key: event.key,
          timestamp: currentTime,
          timeSinceLastKey,
          keyCode: event.keyCode
        });

        // Detect suspicious patterns with reduced sensitivity
        detectSuspiciousTypingPatterns(timeSinceLastKey, event);

        window.typingData.lastKeyTime = currentTime;

        // Keep only last 50 keystrokes for memory management (reduced from 100)
        if (window.typingData.keystrokes.length > 50) {
          window.typingData.keystrokes.shift();
        }
      };

      // Detect copy-paste events
      const handlePaste = (event) => {
        const currentTime = Date.now();
        const dataLength = event.clipboardData?.getData('text/plain')?.length || 0;
        
        // Only flag if paste contains substantial text (more than 10 characters)
        if (dataLength > 10) {
          window.typingData.suspiciousEvents.push({
            type: 'paste',
            timestamp: currentTime,
            dataLength: dataLength
          });
        }
      };

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('paste', handlePaste);

      // Store cleanup function
      window.cleanupTypingDetection = () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('paste', handlePaste);
        window.typingDetectionInitialized = false;
      };
    }

    // Analyze current typing data with improved logic
    const analyzeTypingData = () => {
      const data = window.typingData;
      if (!data.keystrokes.length || data.keystrokes.length < 5) {
        return {
          detected: false,
          confidence: 0,
          typingPattern: 'normal',
          typingSpeed: 0,
          suspiciousEvents: 0
        };
      }

      // Calculate typing speed (WPM approximation) - improved calculation
      const totalTime = data.keystrokes.length > 1 ? 
        data.keystrokes[data.keystrokes.length - 1].timestamp - data.keystrokes[0].timestamp : 0;
      
      // More accurate WPM calculation (5 characters per word average)
      const typingSpeed = totalTime > 0 ? 
        Math.round((data.keystrokes.length / 5) / (totalTime / 60000)) : 0;

      // Analyze timing patterns
              const intervals = data.keystrokes && data.keystrokes.length > 1 ? 
          data.keystrokes.slice(1).map((stroke, index) => stroke ? stroke.timeSinceLastKey : 0).filter(interval => interval !== undefined && interval !== null) : [];
        const averageInterval = intervals.length > 0 ? 
          intervals.reduce((sum, interval) => sum + (interval || 0), 0) / intervals.length : 0;
        const variance = intervals.length > 0 ? 
          intervals.reduce((sum, interval) => sum + Math.pow((interval || 0) - averageInterval, 2), 0) / intervals.length : 0;

      // Detect suspicious patterns with higher thresholds
      const suspiciousPatterns = detectSuspiciousPatterns(data, typingSpeed, averageInterval, variance);
      
      // Only count recent suspicious events (last 60 seconds instead of 30)
      const suspiciousEventCount = data.suspiciousEvents && data.suspiciousEvents.length > 0 ? 
        data.suspiciousEvents.filter(event => event && event.timestamp && (Date.now() - event.timestamp < 60000)).length : 0;

      // Determine typing pattern with more lenient thresholds
      let typingPattern = 'normal';
      if (typingSpeed > 150) typingPattern = 'very_fast';        // Increased from 100
      else if (typingSpeed > 120) typingPattern = 'fast';         // Increased from 80
      else if (typingSpeed < 10) typingPattern = 'slow';          // Decreased from 20
      else if (variance < 20 && data.keystrokes.length > 20) typingPattern = 'mechanical'; // Increased threshold
      else if (suspiciousEventCount > 2) typingPattern = 'suspicious'; // Increased threshold

      // Calculate confidence with more conservative approach
      let confidence = 0;
      if (typingSpeed > 150) confidence += 0.3;                   // Reduced from 0.4
      if (variance < 20 && data.keystrokes.length > 20) confidence += 0.2; // Reduced from 0.3
      if (suspiciousEventCount > 2) confidence += 0.2;            // Reduced from 0.3
      if (suspiciousPatterns.length > 1) confidence += 0.1;       // Reduced from 0.2

      // Only detect if confidence is high enough and pattern is clearly suspicious
      const detected = confidence > 0.4 && (typingPattern !== 'normal' || suspiciousEventCount > 3);

      return {
        detected,
        confidence: Math.min(confidence, 1),
        typingPattern,
        typingSpeed,
        suspiciousEvents: suspiciousEventCount,
        patterns: suspiciousPatterns
      };
    };

    return analyzeTypingData();
  }, []);

  // Helper function to detect suspicious typing patterns with higher thresholds
  const detectSuspiciousPatterns = (data, typingSpeed, averageInterval, variance) => {
    const patterns = [];

    // Very fast typing (likely copy-paste) - increased threshold
    if (typingSpeed > 180) {  // Increased from 120
      patterns.push('extremely_fast_typing');
    }

    // Too regular timing (mechanical/automated) - increased threshold
    if (variance < 15 && data.keystrokes.length > 20) {  // Increased from 30, increased length requirement
      patterns.push('mechanical_timing');
    }

    // Sudden bursts of typing - more stringent criteria
    const recentKeystrokes = data.keystrokes && data.keystrokes.length > 0 ? data.keystrokes.slice(-15) : [];  // Increased from 10
    if (recentKeystrokes.length >= 10) {  // Increased from 5
      const recentIntervals = recentKeystrokes.slice(1).map((stroke, index) => stroke ? stroke.timeSinceLastKey : 0).filter(interval => interval !== undefined && interval !== null);
      const recentAverage = recentIntervals.length > 0 ? recentIntervals.reduce((sum, interval) => sum + (interval || 0), 0) / recentIntervals.length : 0;
      
      if (recentAverage < 30) {  // Decreased from 50 - more stringent
        patterns.push('typing_burst');
      }
    }

    // Long pauses followed by fast typing - increased threshold
    const longPauses = data.keystrokes && data.keystrokes.length > 0 ? 
      data.keystrokes.filter(stroke => stroke && stroke.timeSinceLastKey && stroke.timeSinceLastKey > 10000) : [];  // Increased from 5000
    if (longPauses.length > 1) {  // Require multiple long pauses
      patterns.push('long_pauses');
    }

    return patterns;
  };

  // Helper function to detect suspicious typing patterns with reduced sensitivity
  const detectSuspiciousTypingPatterns = (timeSinceLastKey, event) => {
    const data = window.typingData;
    const currentTime = Date.now();

    // Rate limiting for violations to prevent spam
    if (currentTime - data.lastViolationTime < 5000) {  // 5 second cooldown
      return;
    }

    // Detect copy-paste patterns
    if (event.ctrlKey && event.key === 'v') {
      data.suspiciousEvents.push({
        type: 'copy_paste',
        timestamp: currentTime,
        method: 'ctrl_v'
      });
      data.lastViolationTime = currentTime;
    }

    // Detect very fast consecutive typing - increased threshold
    if (timeSinceLastKey < 30) {  // Decreased from 50 - more stringent
      data.suspiciousEvents.push({
        type: 'rapid_typing',
        timestamp: currentTime,
        interval: timeSinceLastKey
      });
      data.lastViolationTime = currentTime;
    }

    // Detect perfect timing (suspicious) - more stringent criteria
    if (timeSinceLastKey > 0 && timeSinceLastKey < 80 && 
        data.keystrokes.length > 10) {  // Increased length requirement
      const lastIntervals = data.keystrokes && data.keystrokes.length > 0 ? 
        data.keystrokes.slice(-8).map(stroke => stroke ? stroke.timeSinceLastKey : 0).filter(interval => interval !== undefined && interval !== null) : [];  // Increased from 5
      const intervalVariance = lastIntervals.length > 0 ? lastIntervals.reduce((sum, interval) => 
        sum + Math.pow((interval || 0) - timeSinceLastKey, 2), 0) / lastIntervals.length : 0;
      
      if (intervalVariance < 5) {  // Decreased from 10 - more stringent
        data.suspiciousEvents.push({
          type: 'perfect_timing',
          timestamp: currentTime,
          variance: intervalVariance
        });
        data.lastViolationTime = currentTime;
      }
    }
  };

  // Enhanced tab switching detection with proper event listeners
  const detectTabSwitching = useCallback(() => {
    // Initialize tab switching detection if not already done
    if (!window.tabSwitchingInitialized) {
      window.tabSwitchingInitialized = true;
      window.tabSwitchingData = {
        lastSwitchTime: 0,
        switchCount: 0,
        isCurrentlyHidden: false,
        lastVisibilityChange: 0,
        switchHistory: []
      };

      // Detect when page becomes hidden (tab switch, minimize, etc.)
      const handleVisibilityChange = () => {
        const currentTime = Date.now();
        
        if (document.hidden) {
          // Page became hidden
          window.tabSwitchingData.isCurrentlyHidden = true;
          window.tabSwitchingData.lastVisibilityChange = currentTime;
        } else {
          // Page became visible again
          if (window.tabSwitchingData.isCurrentlyHidden) {
            const timeHidden = currentTime - window.tabSwitchingData.lastVisibilityChange;
            
            // Only count as tab switch if hidden for more than 500ms (prevents false positives)
            if (timeHidden > 500) {
              window.tabSwitchingData.lastSwitchTime = currentTime;
              window.tabSwitchingData.switchCount++;
              window.tabSwitchingData.isCurrentlyHidden = false;
              
              // Record switch history
              window.tabSwitchingData.switchHistory.push({
                timestamp: currentTime,
                duration: timeHidden,
                type: 'visibility_change'
              });
              
              // Keep only last 10 switches
              if (window.tabSwitchingData.switchHistory.length > 10) {
                window.tabSwitchingData.switchHistory.shift();
              }
              
              console.log('Tab switching detected:', {
                timeHidden,
                switchCount: window.tabSwitchingData.switchCount
              });
            }
          }
        }
      };

      // Detect window blur/focus (alternative method)
      const handleWindowBlur = () => {
        const currentTime = Date.now();
        window.tabSwitchingData.lastSwitchTime = currentTime;
        window.tabSwitchingData.switchCount++;
        
        window.tabSwitchingData.switchHistory.push({
          timestamp: currentTime,
          duration: 0,
          type: 'window_blur'
        });
        
        if (window.tabSwitchingData.switchHistory.length > 10) {
          window.tabSwitchingData.switchHistory.shift();
        }
        
        console.log('Window blur detected - possible tab switch');
      };

      // Add event listeners
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleWindowBlur);

      // Store cleanup function
      window.cleanupTabSwitching = () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleWindowBlur);
        window.tabSwitchingInitialized = false;
      };
    }

    // Analyze current tab switching data
    const data = window.tabSwitchingData;
    const currentTime = Date.now();
    const timeSinceLastSwitch = currentTime - data.lastSwitchTime;
    
    // Detect recent tab switching (within last 30 seconds)
    const recentSwitches = data.switchHistory && data.switchHistory.length > 0 ? 
      data.switchHistory.filter(switchEvent => switchEvent && switchEvent.timestamp && (currentTime - switchEvent.timestamp < 30000)) : [];
    
    const hasRecentSwitch = recentSwitches.length > 0;
    const switchCount = recentSwitches.length;
    
    // Calculate confidence based on switch frequency and recency
    let confidence = 0;
    if (hasRecentSwitch) {
      confidence = Math.min(0.9, 0.5 + (switchCount * 0.2)); // Higher confidence for multiple switches
    }
    
    return {
      detected: hasRecentSwitch,
      confidence,
      switchCount,
      timeSinceLastSwitch,
      recentSwitches: recentSwitches.length,
      totalSwitches: data.switchCount
    };
  }, []);

  // Time-based analysis - REMOVED
  /*
  const analyzeTiming = useCallback(() => {
    const currentTime = Date.now();
    const responseTime = currentTime - (typingStartTimeRef.current || currentTime);
    
    // Suspicious if response time is too short (pre-written answers)
    const suspiciousTiming = responseTime < 2000 && responseTime > 0;
    
    return {
      suspiciousTiming,
      confidence: suspiciousTiming ? 0.7 : 0,
      responseTime
    };
  }, []);
  */

  // Enhanced risk calculation with weighted factors
  const calculateRiskScore = useCallback((results) => {
    const weights = {
      faceDetection: 0.20,      // Reduced from 0.25
      eyeTracking: 0.15,        // Reduced from 0.20
      tabSwitching: 0.25,       // HIGH WEIGHT - most important
      typingDetection: 0.15,    // Added typing detection
      multipleFaces: 0.10,      // Reduced from 0.15
      phoneDetection: 0.10,     // Reduced from 0.15
      headMovement: 0.05,       // Replaced movement analysis with head movement
      audioAnalysis: 0.03,      // Reduced from 0.05
    };

    let weightedScore = 0;
    let totalWeight = 0;

    Object.entries(results).forEach(([key, result]) => {
      if (weights[key]) {
        let violationScore = 0;
        
        if (key === 'faceDetection') {
          violationScore = result.detected ? 0 : Math.min(result.violations * 20, 100);
        } else if (key === 'multipleFaces') {
          violationScore = result.detected ? Math.min(result.violations * 25, 100) : 0;
        } else if (key === 'tabSwitching') {
          // HIGH WEIGHT for tab switching - very serious violation
          violationScore = result.detected ? Math.min(result.violations * 40, 100) : 0;
        } else if (key === 'typingDetection') {
          // Medium weight for typing detection
          violationScore = result.detected ? Math.min(result.violations * 20, 100) : 0;
        } else {
          violationScore = (result.detected || result.lookingAway || result.excessiveHeadMovement) ? 
            Math.min(result.violations * 15, 100) : 0;
        }
        
        weightedScore += violationScore * weights[key];
        totalWeight += weights[key];
      }
    });

    return totalWeight > 0 ? Math.min(weightedScore / totalWeight, 100) : 0;
  }, []);

  // Main detection function with enhanced logic
  const runDetection = useCallback(async () => {
    if (!webcamRef.current || !isActive) {
      return;
    }

    const videoElement = webcamRef.current.video;
    if (!videoElement || videoElement.readyState !== 4) {
      return;
    }

    try {
      // Additional safety check for detection results
      if (!detectionResults || typeof detectionResults !== 'object') {
        console.warn('Invalid detection results, resetting...');
        return;
      }
      // Get audio stream - try multiple sources
      let audioStream = null;
      
      // First try to get audio from video element
      try {
        if (videoElement.srcObject && videoElement.srcObject.getAudioTracks) {
          const audioTracks = videoElement.srcObject.getAudioTracks();
          if (audioTracks.length > 0) {
            audioStream = videoElement.srcObject;
          }
        }
      } catch (audioError) {
        console.log('Audio stream not available from video element:', audioError.message);
      }

      // If no audio from video, try to get separate audio stream
      if (!audioStream && isRecording) {
        try {
          audioStream = await getAudioStream();
        } catch (audioError) {
          console.log('Could not get separate audio stream:', audioError.message);
        }
      }

      // Run all detection algorithms
      const detectionPromises = [
        detectFaces(videoElement),
        detectDevices(videoElement),
        detectHeadMovement(videoElement)
      ];

      // Only add audio analysis if audio stream is available
      if (audioStream) {
        detectionPromises.push(analyzeAudio(audioStream));
      }

      const results = await Promise.all(detectionPromises);
      
      // Safety check for results
      if (!results || results.length < 3) {
        console.warn('Invalid detection results received');
        return;
      }
      
      // Handle case where audio analysis was not added
      const [faceResults, deviceResults, headMovementResults, audioResults] = results;

      const tabResults = detectTabSwitching();
      const typingResults = detectTyping();

      // Update detection results with enhanced data
      const newResults = {
        faceDetection: {
          detected: faceResults.faceCount > 0,
          confidence: faceResults.faceCount > 0 ? 0.9 : 0,
          violations: faceResults.faceCount === 0 ? 
            detectionResults.faceDetection.violations + 1 : 
            detectionResults.faceDetection.violations,
          lastSeen: faceResults.faceCount > 0 ? Date.now() : detectionResults.faceDetection.lastSeen,
          faceQuality: faceResults.faceQuality || 0
        },
        eyeTracking: {
          lookingAway: faceResults.lookingAway,
          confidence: faceResults.gazeConfidence || 0,
          violations: faceResults.lookingAway ? 
            detectionResults.eyeTracking.violations + 1 : 
            detectionResults.eyeTracking.violations,
          gazeDistance: faceResults.gazeDistance || 0,
          gazeThreshold: faceResults.gazeThreshold || 0,
          gazeZone: faceResults.gazeZone || 'center',
          gazePattern: faceResults.gazePattern || null,
          eyeOpenness: faceResults.eyeOpenness || 0
        },
        multipleFaces: {
          detected: faceResults.faceCount > 1,
          count: faceResults.faceCount,
          violations: faceResults.faceCount > 1 ? 
            detectionResults.multipleFaces.violations + 1 : 
            detectionResults.multipleFaces.violations,
          facePositions: faceResults.faceCount > 1 ? Array(faceResults.faceCount).fill({}) : []
        },
                phoneDetection: {
          detected: deviceResults.phoneDetected,
          confidence: deviceResults.confidence,
          violations: deviceResults.phoneDetected ?
            detectionResults.phoneDetection.violations + 1 : 
            detectionResults.phoneDetection.violations,
          deviceType: deviceResults.deviceType,
          landmarks: deviceResults.landmarks || null,
          metrics: {
            ...deviceResults.metrics,
            yoloOnly: true,
            backendUsed: deviceResults.metrics?.backendUsed || 'yolo'
          }
        },
        headMovement: {
          excessiveHeadMovement: headMovementResults.excessiveHeadMovement,
          confidence: headMovementResults.confidence,
          violations: headMovementResults.excessiveHeadMovement ? 
            detectionResults.headMovement.violations + 1 : 
            detectionResults.headMovement.violations,
          headMovementPattern: headMovementResults.headMovementPattern
        },
        audioAnalysis: {
          backgroundNoise: audioResults ? audioResults.backgroundNoise : false,
          confidence: audioResults ? audioResults.confidence : 0,
          violations: audioResults && audioResults.backgroundNoise ? 
            detectionResults.audioAnalysis.violations + 1 : 
            detectionResults.audioAnalysis.violations,
          noiseLevel: audioResults ? audioResults.noiseLevel : 0,
          audioAvailable: audioResults ? audioResults.audioAvailable : false
        },
        tabSwitching: {
          detected: tabResults.detected,
          confidence: tabResults.confidence,
          violations: tabResults.detected ? 
            detectionResults.tabSwitching.violations + 1 : 
            detectionResults.tabSwitching.violations,
          switchCount: tabResults.switchCount
        },
        typingDetection: {
          detected: typingResults.detected,
          confidence: typingResults.confidence,
          violations: typingResults.detected ? 
            updateTypingViolations(detectionResults.typingDetection.violations, typingResults.suspiciousEvents?.length || 0) : 
            detectionResults.typingDetection.violations,
          typingPattern: typingResults.typingPattern,
          typingSpeed: typingResults.typingSpeed,
          suspiciousEvents: typingResults.suspiciousEvents
        }
      };

      // Test mode simulation (disabled by default)
      if (testMode && frameCountRef.current % 15 === 0) {
        const testViolations = ['eyeTracking', 'headMovement', 'phoneDetection'];
        const randomViolation = testViolations[Math.floor(Math.random() * testViolations.length)];
        
        if (randomViolation === 'eyeTracking') {
          newResults.eyeTracking.lookingAway = true;
          newResults.eyeTracking.violations += 1;
        } else if (randomViolation === 'headMovement') {
          newResults.headMovement.excessiveHeadMovement = true;
          newResults.headMovement.violations += 1;
        } else if (randomViolation === 'phoneDetection') {
          newResults.phoneDetection.detected = true;
          newResults.phoneDetection.violations += 1;
        }
      }

      frameCountRef.current++;

      // Call landmark data callback for device detection if device is detected
      if (onLandmarkData && deviceResults.phoneDetected && deviceResults.landmarks) {
        // Combine face landmarks with device landmarks if face is detected
        const combinedLandmarks = {
          deviceDetection: deviceResults.landmarks,
          deviceDetected: deviceResults.phoneDetected,
          deviceType: deviceResults.deviceType,
          deviceConfidence: deviceResults.confidence,
          yoloDetections: deviceResults.detections || [],
          backendUsed: deviceResults.metrics?.backendUsed || 'yolo',
          yoloOnly: true
        };
        
        // Add face landmarks if available
        if (faceResults.faceCount > 0 && faceResults.primaryFace) {
          combinedLandmarks.positions = faceResults.primaryFace.landmarks.positions;
          combinedLandmarks.getLeftEye = faceResults.primaryFace.landmarks.getLeftEye;
          combinedLandmarks.getRightEye = faceResults.primaryFace.landmarks.getRightEye;
        }
        
        onLandmarkData(combinedLandmarks);
      }

      setDetectionResults(newResults);

      // Calculate enhanced risk score
      const riskScore = calculateRiskScore(newResults);
      setOverallRisk(riskScore);

      // Enhanced alert system with severity levels
      const currentTime = Date.now();
      const violations = Object.entries(newResults || {}).filter(([key, result]) => {
        if (!key || !result) return false;
        if (key === 'faceDetection') return !result.detected;
        if (key === 'multipleFaces') return result.detected;
        return result.detected || result.lookingAway || result.excessiveHeadMovement;
      });

      if (violations && violations.length > 0 && currentTime - lastAlertTimeRef.current > settings.alertCooldown) {
        // Calculate alert severity
        const severity = violations.length > 2 ? 'high' : violations.length > 1 ? 'medium' : 'low';
        
        // Safely process violations for message
        let violationMessage = 'Potential cheating detected';
        try {
          const violationTypes = violations
            .map(([key]) => {
              if (!key) return null;
              try {
                return key.replace(/([A-Z])/g, ' $1').toLowerCase();
              } catch (e) {
                return 'unknown';
              }
            })
            .filter(Boolean);
          
          if (violationTypes && violationTypes.length > 0) {
            try {
              violationMessage = `Potential cheating detected: ${violationTypes.join(', ')}`;
            } catch (e) {
              console.warn('Error joining violation types:', e);
              violationMessage = 'Potential cheating detected';
            }
          }
        } catch (e) {
          console.warn('Error processing violation message:', e);
        }
        
        const alert = {
          id: Date.now(),
          type: 'warning',
          severity,
          message: violationMessage,
          timestamp: new Date().toISOString(),
          violations: violations.map(([key, result]) => ({ type: key, ...result })),
          riskScore
        };

        setAlerts(prev => [...prev, alert]);
        lastAlertTimeRef.current = currentTime;
        
        if (onCheatingDetected) {
          onCheatingDetected(alert);
        }
      }

      // Store enhanced detection history
      setDetectionHistory(prev => [...prev.slice(-50), {
        timestamp: new Date().toISOString(),
        results: newResults,
        riskScore,
        metrics: {
          faceQuality: faceResults.faceQuality,
          movementPattern: headMovementResults.headMovementPattern,
          noiseLevel: audioResults ? audioResults.noiseLevel : 0,
          deviceType: deviceResults.deviceType,
          audioAvailable: audioResults ? audioResults.audioAvailable : false
        }
      }]);

    } catch (error) {
      console.error('Detection error:', error);
    }
  }, [webcamRef, isActive, detectionResults, settings, onCheatingDetected, testMode, 
      detectFaces, detectDevices, detectHeadMovement, analyzeAudio, calculateRiskScore, getAudioStream, isRecording]);

  // Start/stop detection
  useEffect(() => {
    if (isActive) {
      detectionIntervalRef.current = setInterval(runDetection, settings.detectionInterval);
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, runDetection, settings.detectionInterval]);

  // Initialize models on mount
  useEffect(() => {
    initializeModels();
  }, [initializeModels]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
      // Cleanup typing detection
      if (window.cleanupTypingDetection) {
        window.cleanupTypingDetection();
      }
      // Cleanup tab switching detection
      if (window.cleanupTabSwitching) {
        window.cleanupTabSwitching();
      }
    };
  }, [audioContext]);

  // Clear alert
  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (onCheatingResolved) {
      onCheatingResolved(alertId);
    }
  };

  // Enhanced violation counting with rate limiting
  const updateTypingViolations = useCallback((currentViolations, newViolations) => {
    // Rate limiting: only increment violations if significant time has passed
    const currentTime = Date.now();
    const timeSinceLastViolation = currentTime - (window.typingData?.lastViolationTime || 0);
    
    // Only increment if more than 10 seconds have passed or if it's a major violation
    if (timeSinceLastViolation > 10000 || newViolations > 3) {
      return currentViolations + 1;
    }
    
    return currentViolations;
  }, []);

  // Periodic save function - now using session-level API
  const saveDetectionDataPeriodically = useCallback(async () => {
    if (!isActive || detectionHistory.length === 0) return;

    try {
      const response = await fetch('/api/session-cheating-detection/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          mockId: sessionId.split('_')[1], // Extract mockId from sessionId (second part)
          detectionData: {
            riskScore: overallRisk,
            alerts: alerts,
            detectionHistory: detectionHistory.slice(-20), // Last 20 entries
            enhancedMetrics: {
              faceQuality: detectionResults.faceDetection.faceQuality,
              movementPattern: detectionResults.headMovement.headMovementPattern,
              noiseLevel: detectionResults.audioAnalysis.noiseLevel,
              deviceType: detectionResults.phoneDetection.deviceType,
              gazeStability: detectionResults.eyeTracking.confidence,
              responseTime: 0,
              audioAvailable: detectionResults.audioAnalysis.audioAvailable
            },
            severityLevel: overallRisk > 70 ? 'high' : overallRisk > 30 ? 'medium' : 'low',
            detectionSettings: settings
          },
          riskScore: overallRisk,
          alerts: alerts,
          enhancedMetrics: {
            faceQuality: detectionResults.faceDetection.faceQuality,
            movementPattern: detectionResults.headMovement.headMovementPattern,
            noiseLevel: detectionResults.audioAnalysis.noiseLevel,
            deviceType: detectionResults.phoneDetection.deviceType,
            gazeStability: detectionResults.eyeTracking.confidence,
            responseTime: 0,
            audioAvailable: detectionResults.audioAnalysis.audioAvailable
          },
          detectionHistory: detectionHistory.slice(-20)
        })
      });

      if (response.ok) {
        console.log('Session-level cheating detection data updated');
      }
    } catch (error) {
      console.error('Error updating session cheating detection data:', error);
    }
  }, [isActive, detectionHistory, overallRisk, alerts, detectionResults, settings, sessionId]);

  // Set up periodic saving
  useEffect(() => {
    if (isActive) {
      const saveInterval = setInterval(saveDetectionDataPeriodically, 30000); // Save every 30 seconds
      return () => clearInterval(saveInterval);
    }
  }, [isActive, saveDetectionDataPeriodically]);

  // Call risk update callback when risk changes
  useEffect(() => {
    if (onCheatingRiskUpdate) {
      onCheatingRiskUpdate(overallRisk);
    }
  }, [overallRisk, onCheatingRiskUpdate]);

  const getRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600 bg-green-100';
    if (risk < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevel = (risk) => {
    if (risk < 30) return 'Low';
    if (risk < 70) return 'Medium';
    return 'High';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  useImperativeHandle(ref, () => ({
    getDetectionHistory: () => detectionHistory,
    getDetectionResults: () => detectionResults,
    getOverallRisk: () => overallRisk,
    getAlerts: () => alerts,
    getEnhancedMetrics: () => ({
      faceQuality: detectionResults.faceDetection.faceQuality,
      movementPattern: detectionResults.headMovement.headMovementPattern,
      noiseLevel: detectionResults.audioAnalysis.noiseLevel,
      deviceType: detectionResults.phoneDetection.deviceType,
      gazeStability: detectionResults.eyeTracking.confidence,
      responseTime: 0, // Could be calculated from detection timing
      audioAvailable: detectionResults.audioAnalysis.audioAvailable
    }),
    getRiskColor: (risk) => getRiskColor(risk),
    getRiskLevel: (risk) => getRiskLevel(risk),
    getSeverityColor: (severity) => getSeverityColor(severity)
  }));

  return (
    <div className="space-y-4">
      {/* Always Active/Status UI (optional, can be shown always) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="font-medium text-sm text-green-700">
            Enhanced Cheating Detection: Active
          </span>
          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Auto-Enabled
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            Always Active
          </div>
        </div>
      </div>
      {/* Only show details if showDetails is true */}
      {showDetails && (
        <>
          {/* Enhanced Risk Score */}
          <div className="p-4 bg-white border rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h3 className="font-semibold text-sm">Enhanced Risk Assessment</h3>
              <Badge className={getRiskColor(overallRisk)}>
                {getRiskLevel(overallRisk)} Risk
              </Badge>
            </div>
            <Progress value={overallRisk} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(overallRisk)}% risk level - Weighted analysis
            </div>
          </div>
          {/* Enhanced Detection Metrics - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.entries(detectionResults).map(([key, result]) => (
              <div key={key} className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    result.detected || result.lookingAway || result.excessiveHeadMovement || 
                    (key === 'faceDetection' && !result.detected)
                      ? 'bg-red-500' 
                      : 'bg-green-500'
                  }`} />
                    {/* Show audio availability indicator */}
                    {key === 'audioAnalysis' && (
                      <div className={`w-1 h-1 rounded-full ${
                        result.audioAvailable ? 'bg-blue-500' : 'bg-gray-400'
                      }`} title={result.audioAvailable ? 'Audio Available' : 'Audio Not Available'} />
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Violations: {result.violations}
                </div>
                {result.confidence > 0 && (
                  <div className="text-xs text-gray-500">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                )}
                {/* Show additional metrics for enhanced detection */}
                {result.faceQuality && (
                  <div className="text-xs text-gray-500">
                    Quality: {Math.round(result.faceQuality)}%
                  </div>
                )}
                {result.headMovementPattern && result.headMovementPattern !== 'normal' && (
                  <div className="text-xs text-orange-600">
                    Pattern: {result.headMovementPattern.replace('_', ' ')}
                  </div>
                )}
                {result.deviceType && (
                  <div className="text-xs text-purple-600">
                    Device: {result.deviceType}
                  </div>
                )}
                {/* Show typing detection metrics */}
                {key === 'typingDetection' && result.typingSpeed > 0 && (
                  <div className="text-xs text-blue-600">
                    Speed: {result.typingSpeed} WPM
                  </div>
                )}
                {key === 'typingDetection' && result.typingPattern !== 'normal' && (
                  <div className="text-xs text-orange-600">
                    Pattern: {result.typingPattern.replace('_', ' ')}
                  </div>
                )}
                {key === 'typingDetection' && result.suspiciousEvents > 0 && (
                  <div className="text-xs text-red-600">
                    Suspicious: {result.suspiciousEvents} events
                  </div>
                )}
                {/* Show high violation warning for typing */}
                {key === 'typingDetection' && result.violations > 10 && (
                  <div className="text-xs text-red-600 font-medium bg-red-50 px-1 py-0.5 rounded mt-1">
                    ⚠️ High violations: {result.violations}
                  </div>
                )}
                {/* Show tab switching metrics */}
                {key === 'tabSwitching' && result.switchCount > 0 && (
                  <div className="text-xs text-purple-600">
                    Switches: {result.switchCount} (30s)
                  </div>
                )}
                {key === 'tabSwitching' && result.totalSwitches > 0 && (
                  <div className="text-xs text-purple-600">
                    Total: {result.totalSwitches} switches
                  </div>
                )}
                {key === 'tabSwitching' && result.detected && (
                  <div className="text-xs text-red-600 font-medium bg-red-50 px-1 py-0.5 rounded mt-1">
                    ⚠️ Tab switching detected!
                  </div>
                )}
                {/* Show audio availability status */}
                {key === 'audioAnalysis' && (
                  <div className="text-xs text-gray-400">
                    {result.audioAvailable ? 'Audio: Available' : 'Audio: Not Available'}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Enhanced Alerts with Severity */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Detection Alerts</h3>
              {alerts.slice(-3).map((alert) => (
                <Alert key={alert.id} className={`border ${getSeverityColor(alert.severity)}`}>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="break-words">{alert.message}</span>
                      <button
                        onClick={() => clearAlert(alert.id)}
                        className="text-xs text-yellow-600 hover:text-yellow-800 self-start sm:self-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()} - Risk: {Math.round(alert.riskScore)}%
                    </div>
                    {alert.severity && (
                      <div className="text-xs text-yellow-600">
                        Severity: {alert.severity.toUpperCase()}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </>
      )}
      {/* Hidden canvas for image processing */}
      <canvas 
        ref={canvasRef} 
        className="hidden" 
        style={{ display: 'none' }}
      />
    </div>
  );
});

export default CheatingDetection; 