"use client";
import Webcam from 'react-webcam';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, RefreshCw, Save, Loader2, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/OpenAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useReactMediaRecorder } from 'react-media-recorder';
import { transcribeAudio } from '@/utils/OpenAIModel';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, interviewType = 'technical' }) {
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
  
  const webcamRef = useRef(null);
  const { user } = useUser();
  const MIN_ANSWER_LENGTH = 10;

  // Audio recording setup
  const {
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    mediaBlobUrl,
    clearBlobUrl,
    status,
    error: recordingError
  } = useReactMediaRecorder({
    audio: true,
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
      const feedbackPrompt = `Analyze this interview response:
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
        Answer: ${userAnswer}

        Provide JSON response with:
        - "rating": number (1-10)
        - "feedback": string (constructive feedback)
        - "suggestions": string[] (3 improvement suggestions)
        - "transcriptionQuality": number (1-5, how accurate the transcription is)
        - "language": string (detected language)`;

      const result = await chatSession(feedbackPrompt, interviewType);
      return JSON.parse(result.replace(/```json|```/g, '').trim());
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

    setLoading(true);
    setIsProcessing(true);
    
    try {
      const [feedback, followUpAnalysis] = await Promise.all([
        generateFeedback(),
        generateFollowUpAnalysis()
      ]);

      setFeedback(feedback);
      setFollowUpAnalysis(followUpAnalysis);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
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
        language: detectedLanguage || 'mixed'
      });

      toast.success('Answer and feedback saved successfully');
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

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6">
      {/* Webcam Preview */}
      <div className="relative mb-4 w-full max-w-2xl">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
          className="rounded-lg border-2 border-primary w-full h-auto"
          onUserMediaError={() => toast.error('Could not access camera')}
        />
        {isRecording && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            REC {formatTime(recordingTime)}
            {isTranscribing && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4" />
        <Button
          variant={languageMode === 'auto' ? "default" : "outline"}
          onClick={() => setLanguageMode('auto')}
          size="sm"
        >
          Auto Detect
        </Button>
        <Button
          variant={languageMode === 'en' ? "default" : "outline"}
          onClick={() => setLanguageMode('en')}
          size="sm"
        >
          English
        </Button>
        <Button
          variant={languageMode === 'ar' ? "default" : "outline"}
          onClick={() => setLanguageMode('ar')}
          size="sm"
        >
          العربية
        </Button>
      </div>

      {/* Follow-Up Section */}
      {followUpAnalysis?.needsFollowUp && (
        <div className="w-full lg:w-3/4 p-4 border rounded-lg bg-gray-50">
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
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          className="gap-2"
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
              <span>Start Recording</span>
            </>
          )}
          {isTranscribing && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>

        <Button
          variant="outline"
          onClick={handleRetry}
          disabled={isRecording || (!userAnswer && !feedback)}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Retry
        </Button>

        <Button
          onClick={handleSubmitAnswer}
          disabled={loading || !userAnswer.trim() || userAnswer.trim().length < MIN_ANSWER_LENGTH}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? 'Processing...' : 'Save Answer'}
        </Button>
      </div>

      {/* Answer Length */}
      <div className="w-full max-w-2xl">
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
      <div className="w-full max-w-2xl">
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
          className={`bg-secondary p-4 rounded-lg min-h-32 border ${containsArabic(userAnswer) ? 'text-right' : 'text-left'}`}
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
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Recording:</h3>
          <audio src={mediaBlobUrl} controls className="w-full" />
        </div>
      )}

      {/* Feedback */}
      {feedback && (
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
            <p className="mb-3">{feedback.feedback}</p>
            {feedback.suggestions && (
              <div>
                <h4 className="font-medium mb-1">Suggestions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {feedback.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;