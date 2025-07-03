"use client";
import Webcam from 'react-webcam';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, RefreshCw, Save, Loader2, Languages, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/OpenAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useReactMediaRecorder } from 'react-media-recorder';
import { transcribeAudio } from '@/utils/OpenAIModel';
import { eq, and } from 'drizzle-orm';
import CheatingDetection from './CheatingDetection';

function RecordAnswerSection({ 
  mockInterviewQuestion, 
  activeQuestionIndex, 
  interviewData, 
  interviewType = 'technical',
  sessionId,
  onAnswerSubmitted,
  currentAnswer
}) {
  // State declarations
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [followUpAnalysis, setFollowUpAnalysis] = useState(null);
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [languageMode, setLanguageMode] = useState('auto'); // 'auto', 'en', or 'ar'
  const [retryCount, setRetryCount] = useState(0);
  const [cheatingAlerts, setCheatingAlerts] = useState([]);
  const [cheatingRisk, setCheatingRisk] = useState(0);
  const [showCheatingDetection, setShowCheatingDetection] = useState(true);
  
  const webcamRef = useRef(null);
  const { user } = useUser();
  const MIN_ANSWER_LENGTH = 10;

  // Initialize with existing answer if available
  useEffect(() => {
    if (currentAnswer) {
      setUserAnswer(currentAnswer.userAns || '');
      setFeedback({
        rating: currentAnswer.rating,
        feedback: currentAnswer.feedback,
        suggestions: currentAnswer.suggestions ? currentAnswer.suggestions.split(', ') : []
      });
      setRetryCount(currentAnswer.retryCount || 0);
    } else {
      setUserAnswer('');
      setFeedback(null);
      setRetryCount(0);
    }
  }, [currentAnswer, activeQuestionIndex]);

  // Audio recording setup
  const {
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    mediaBlobUrl,
    clearBlobUrl,
    status,
    error: recordingError
  } = useReactMediaRecorder({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      // Disable audio monitoring to prevent hearing your own voice
      sampleRate: 44100,
      channelCount: 1
    },
    onStart: () => {
      setIsRecording(true);
      setDetectedLanguage(null);
    },
    onStop: async (blobUrl, blob) => {
      setIsRecording(false);
      setAudioBlob(blob);
      setIsTranscribing(true);
      try {
        const { text, detectedLanguage } = await transcribeAudio(blob, languageMode);
        setUserAnswer(text);
        setDetectedLanguage(detectedLanguage);
      } catch (error) {
        toast.error('Audio transcription failed');
        console.error('Transcription error:', error);
      } finally {
        setIsTranscribing(false);
      }
    },
    mediaRecorderOptions: {
      mimeType: 'audio/webm'
    }
  });

  // Handle recording errors
  useEffect(() => {
    if (recordingError) {
      toast.error(`Recording error: ${recordingError}`);
      console.error('Recording error:', recordingError);
    }
  }, [recordingError]);

  // Auto-submit when recording stops with sufficient answer
  useEffect(() => {
    if (!isRecording && userAnswer.trim().length >= MIN_ANSWER_LENGTH && !isProcessing) {
      handleSubmitAnswer();
    }
  }, [isRecording, userAnswer]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (recordingTime > 0) {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartStopRecording = async () => {
    try {
      if (isRecording) {
        stopAudioRecording();
      } else {
        setUserAnswer('');
        setFeedback(null);
        setFollowUpAnalysis(null);
        clearBlobUrl();
        startAudioRecording();
      }
    } catch (err) {
      toast.error('Error accessing microphone');
      console.error('Microphone access error:', err);
    }
  };

  const generateFeedback = async () => {
    if (!userAnswer.trim()) return null;
    
    try {
      // Use the new video interview evaluation API
      const response = await fetch('/api/video-interview-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          answer: userAnswer,
          interviewType: interviewType
        })
      });

      if (!response.ok) {
        throw new Error('Evaluation API request failed');
      }

      const evaluationResult = await response.json();
      
      // Format the result for compatibility with existing UI
      return {
        rating: evaluationResult.evaluation_score || evaluationResult.traditional_feedback?.rating || 5,
        feedback: evaluationResult.traditional_feedback?.feedback || "Evaluation completed successfully",
        suggestions: evaluationResult.traditional_feedback?.suggestions || ["Continue practicing", "Focus on clarity", "Provide more examples"],
        transcriptionQuality: evaluationResult.traditional_feedback?.transcriptionQuality || 5,
        language: detectedLanguage || 'en',
        overallAssessment: evaluationResult.traditional_feedback?.overallAssessment || "Good response with room for improvement",
        // Add detailed evaluation data
        detailedEvaluation: evaluationResult.labels || {},
        evaluationScore: (function() {
          const score = parseFloat(evaluationResult.evaluation_score);
          return isNaN(score) ? 5.0 : score;
        })(),
        detailedScores: evaluationResult.detailed_scores || {},
        combinedScore: evaluationResult.combined_score?.toString() || "5"
      };
    } catch (error) {
      console.error("Feedback generation failed", error);
      toast.error("Failed to generate feedback");
      return null;
    }
  };

  const generateFollowUpAnalysis = async () => {
    if (!userAnswer.trim()) return null;
    
    try {
      const followUpPrompt = `Act like an expert interview coach analyzing:
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
        Answer: ${userAnswer}

        Provide JSON response with:
        - "needsFollowUp": boolean
        - "reason": string
        - "suggestedFollowUp": string`;

      const result = await chatSession(followUpPrompt, interviewType);
      return JSON.parse(result.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.error("Follow up generation failed", error);
      return null;
    }
  };

  const handleSubmitAnswer = async () => {
    if (userAnswer.trim().length < MIN_ANSWER_LENGTH) {
      toast.warning(`Please provide a more detailed answer (minimum ${MIN_ANSWER_LENGTH} characters)`);
      return;
    }

    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    setLoading(true);
    setIsProcessing(true);
    
    try {
      const [feedback, followUpAnalysis] = await Promise.all([
        generateFeedback(),
        generateFollowUpAnalysis()
      ]);

      setFeedback(feedback);
      setFollowUpAnalysis(followUpAnalysis);

      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // Check if answer already exists for this question and session
      const existingAnswer = await db.select().from(UserAnswer)
        .where(and(
          eq(UserAnswer.mockIdRef, interviewData?.mockId),
          eq(UserAnswer.sessionId, sessionId),
          eq(UserAnswer.questionIndex, activeQuestionIndex)
        ));

      if (existingAnswer.length > 0) {
        // Update existing answer
        await db.update(UserAnswer)
          .set({
            userAns: userAnswer,
            feedback: feedback?.feedback || "",
            rating: feedback?.rating || 0,
            suggestions: feedback?.suggestions?.join(', ') || "",
            needsFollowUp: followUpAnalysis?.needsFollowUp || false,
            reason: followUpAnalysis?.reason || "",
            suggestedFollowUp: followUpAnalysis?.suggestedFollowUp || "",
            audioRecording: audioBlob ? await blobToBase64(audioBlob) : null,
            language: detectedLanguage || 'mixed',
            isAnswered: true,
            isSkipped: false,
            retryCount: newRetryCount,
            lastAttemptAt: new Date(),
            updatedAt: new Date(),
            // Add detailed evaluation data
            detailedEvaluation: feedback?.detailedEvaluation || null,
            evaluationScore: feedback?.evaluationScore || null,
            detailedScores: feedback?.detailedScores || null,
            combinedScore: feedback?.combinedScore || null,
            overallAssessment: feedback?.overallAssessment || null
          })
          .where(eq(UserAnswer.id, existingAnswer[0].id));
      } else {
        // Insert new answer
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          questionIndex: activeQuestionIndex,
          sessionId: sessionId,
          userAns: userAnswer,
          feedback: feedback?.feedback || "",
          rating: feedback?.rating || 0,
          suggestions: feedback?.suggestions?.join(', ') || "",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
          needsFollowUp: followUpAnalysis?.needsFollowUp || false,
          reason: followUpAnalysis?.reason || "",
          suggestedFollowUp: followUpAnalysis?.suggestedFollowUp || "",
          interview_type: interviewType,
          audioRecording: audioBlob ? await blobToBase64(audioBlob) : null,
          language: detectedLanguage || 'mixed',
          isAnswered: true,
          isSkipped: false,
          retryCount: newRetryCount,
          lastAttemptAt: new Date(),
          updatedAt: new Date(),
          // Add detailed evaluation data
          detailedEvaluation: feedback?.detailedEvaluation || null,
          evaluationScore: feedback?.evaluationScore || null,
          detailedScores: feedback?.detailedScores || null,
          combinedScore: feedback?.combinedScore || null,
          overallAssessment: feedback?.overallAssessment || null
        });
      }

      // Notify parent component to reload answers
      if (onAnswerSubmitted) {
        onAnswerSubmitted(sessionId);
      }

      toast.success(newRetryCount > 1 ? 'Answer updated successfully' : 'Answer and feedback saved successfully');
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Failed to save your answer");
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setUserAnswer('');
    setFeedback(null);
    setFollowUpAnalysis(null);
    setAudioBlob(null);
    clearBlobUrl();
    if (isRecording) {
      stopAudioRecording();
    }
  };

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Language detection helper
  const containsArabic = (text) => {
    return /[\u0600-\u06FF]/.test(text);
  };

  // Cheating detection handlers
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

  const handleCheatingRiskUpdate = (risk) => {
    setCheatingRisk(risk);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg border max-w-2xl mx-auto">
      {/* Session Info */}
      {sessionId && (
        <div className="w-full mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Session ID: {sessionId.split('_').slice(-2).join('_')}</span>
            {retryCount > 0 && (
              <span className="text-blue-600">Retry #{retryCount}</span>
            )}
          </div>
        </div>
      )}

      {/* Webcam Preview */}
      <div className={`relative mb-6 w-full aspect-video rounded-xl overflow-hidden border-4 transition-all ${isRecording ? 'border-[#be3144] shadow-lg' : 'border-gray-200'}`}>
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          className="w-full h-full object-cover rounded-xl"
          onUserMediaError={(error) => {
            console.error('Webcam error:', error);
            toast.error('Could not access camera or microphone');
          }}
          onUserMedia={() => {
            console.log('Webcam and microphone access granted');
          }}
        />
        {isRecording && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm flex items-center shadow-lg animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            REC {formatTime(recordingTime)}
            {isTranscribing && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </div>
        )}
      </div>

      {/* Cheating Detection Section */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Cheating Detection</h3>
            <span className="text-xs text-gray-500">
              (Recording: {isRecording ? 'Yes' : 'No'}, Risk: {Math.round(cheatingRisk)}%)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCheatingDetection(!showCheatingDetection)}
            className="text-xs"
          >
            {showCheatingDetection ? 'Hide' : 'Show'} Details
          </Button>
        </div>
        
        {/* Always show basic detection status */}
        <div className="p-3 bg-gray-50 rounded-lg mb-2">
          <div className="flex items-center justify-between text-sm">
            <span>Status: {isRecording ? 'Monitoring' : 'Waiting for recording'}</span>
            <span>Alerts: {cheatingAlerts.length}</span>
          </div>
        </div>
        
        {showCheatingDetection && (
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
        )}
        
        {/* Quick Risk Indicator */}
        {!showCheatingDetection && cheatingRisk > 0 && (
          <div className={`p-2 rounded-lg text-xs font-medium ${
            cheatingRisk < 30 ? 'bg-green-100 text-green-700' :
            cheatingRisk < 70 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            Risk Level: {Math.round(cheatingRisk)}% - {cheatingAlerts.length} alerts
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="flex items-center gap-3 mb-4">
        <Languages className="h-5 w-5 text-primary" />
        <Button
          variant={languageMode === 'auto' ? "default" : "outline"}
          onClick={() => setLanguageMode('auto')}
          size="sm"
          className="rounded-full px-4"
        >
          Auto Detect
        </Button>
        <Button
          variant={languageMode === 'en' ? "default" : "outline"}
          onClick={() => setLanguageMode('en')}
          size="sm"
          className="rounded-full px-4"
        >
          English
        </Button>
        <Button
          variant={languageMode === 'ar' ? "default" : "outline"}
          onClick={() => setLanguageMode('ar')}
          size="sm"
          className="rounded-full px-4"
        >
          العربية
        </Button>
      </div>

      {/* Follow-Up Section */}
      {/* {followUpAnalysis?.needsFollowUp && (
        <div className="w-full p-4 border rounded-lg bg-yellow-50 mb-4 animate-in fade-in">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Follow-Up Needed</h2>
          <p className="text-sm mb-2"><strong>Reason:</strong> {followUpAnalysis.reason}</p>
          <p className="text-sm mb-4"><strong>Suggested Question:</strong> {followUpAnalysis.suggestedFollowUp}</p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={2}
            placeholder="Type your follow-up response here..."
            value={followUpResponse}
            onChange={(e) => setFollowUpResponse(e.target.value)}
          />
          <Button className="mt-2" onClick={() => toast.success('Follow-up response saved (mock)')}>
            Submit Follow-Up
          </Button>
        </div>
      )} */}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          className="gap-2 px-6 py-3 text-base font-semibold rounded-full shadow-sm hover:scale-105 transition"
          onClick={handleStartStopRecording}
          disabled={loading || isTranscribing}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-5 w-5" />
              <span className="animate-pulse">Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              <span>Record Answer</span>
            </>
          )}
          {isTranscribing && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>

        <Button
          variant="outline"
          onClick={handleRetry}
          disabled={isRecording || (!userAnswer && !feedback)}
          className="px-6 py-3 rounded-full"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          {retryCount > 0 ? 'Retry Again' : 'Retry'}
        </Button>

        <Button
          onClick={handleSubmitAnswer}
          disabled={loading || !userAnswer.trim() || userAnswer.trim().length < MIN_ANSWER_LENGTH}
          className="gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? 'Processing...' : (retryCount > 0 ? 'Update Answer' : 'Save Answer')}
        </Button>
      </div>

      {/* Recording Progress Bar */}
      {isRecording && (
        <div className="w-full max-w-2xl mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Recording: {formatTime(recordingTime)}</span>
            <span>Max: 2 min</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-red-500"
              style={{ width: `${Math.min(100, (recordingTime / 120) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Answer Length */}
      <div className="w-full max-w-2xl mb-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Answer length: {userAnswer.length} characters</span>
          <span>{MIN_ANSWER_LENGTH} minimum</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (userAnswer.length / MIN_ANSWER_LENGTH) * 100)}%`,
              backgroundColor: userAnswer.length >= MIN_ANSWER_LENGTH ? '#10B981' : '#3B82F6'
            }}
          />
        </div>
      </div>

      {/* Transcription Display */}
      <div className="w-full max-w-2xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Your Answer:</h3>
          {detectedLanguage && (
            <span className="text-sm text-muted-foreground">
              Detected: {detectedLanguage === 'en' ? 'English' :
                detectedLanguage === 'ar' ? 'Arabic' : 'Mixed'}
            </span>
          )}
        </div>
        <div
          className={`bg-gray-50 p-5 rounded-xl min-h-32 border-2 ${containsArabic(userAnswer) ? 'text-right' : 'text-left'} font-medium text-lg tracking-wide`}
          dir={containsArabic(userAnswer) ? 'rtl' : 'ltr'}
        >
          {userAnswer ? (
            <p className="whitespace-pre-wrap">{userAnswer}</p>
          ) : (
            <p className="text-muted-foreground italic">
              {isRecording ? "Recording in progress..." : "Your transcription will appear here"}
            </p>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {mediaBlobUrl && (
        <div className="w-full max-w-2xl mb-4">
          <h3 className="text-lg font-semibold mb-2">Recording:</h3>
          <audio src={mediaBlobUrl} controls className="w-full rounded-lg" />
        </div>
      )}

      {/* Feedback */}
      {/* {feedback && (
        <div className="w-full max-w-2xl space-y-4 animate-in fade-in">
          <h3 className="text-lg font-semibold">Feedback:</h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Rating:</span>
              <span className="bg-green-100 px-2 py-1 rounded-full text-sm">
                {feedback.rating}/10
              </span>
              {feedback.transcriptionQuality && (
                <span className="ml-2 text-sm">
                  (Quality: {feedback.transcriptionQuality}/5)
                </span>
              )}
              {feedback.language && (
                <span className="ml-2 text-sm">
                  (Language: {feedback.language})
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Feedback:</span>
                <p className="text-sm mt-1">{feedback.feedback}</p>
              </div>
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div>
                  <span className="font-medium">Suggestions:</span>
                  <ul className="text-sm mt-1 list-disc list-inside">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default RecordAnswerSection;