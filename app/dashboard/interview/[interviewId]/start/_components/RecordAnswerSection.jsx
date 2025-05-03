"use client";
import Webcam from 'react-webcam';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/OpenAIModel';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, interviewType = 'technical' }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [followUpAnalysis, setFollowUpAnalysis] = useState(null);
  const [followUpResponse, setFollowUpResponse] = useState('');

  const webcamRef = useRef(null);
  const { user } = useUser();
  const MIN_ANSWER_LENGTH = 10;

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    timeout: 10000
  });

  useEffect(() => {
    if (results.length > 0) {
      const fullTranscript = results.map(result => result.transcript).join(' ');
      setUserAnswer(fullTranscript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.trim().length >= MIN_ANSWER_LENGTH && !isProcessing) {
      handleSubmitAnswer();
    }
  }, [isRecording, userAnswer]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTime > 0) {
        setRecordingTime(0);
      }
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartStopRecording = async () => {
    try {
      if (isRecording) {
        stopSpeechToText();
      } else {
        setResults([]);
        setUserAnswer('');
        await startSpeechToText();
      }
    } catch (err) {
      toast.error('Error accessing microphone');
      console.error(err);
    }
  };

  const generateFeedback = async () => {
    if (!userAnswer.trim()) return null;
    
    const feedbackPrompt = `
      Analyze this interview response:

      Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
      Answer: ${userAnswer}

      Provide JSON response with:
      - "rating": number (1-10)
      - "feedback": string (constructive feedback)
      - "suggestions": string[] (3 improvement suggestions)
    `;

    try {
      const result = await chatSession(feedbackPrompt, interviewType);
      return JSON.parse(result.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.error("Feedback generation failed", error);
      return null;
    }
  };

  const generateFollowUpAnalysis = async () => {
    if (!userAnswer.trim()) return null;
    
    const followUpPrompt = `
      Act like an expert interview coach.
      You have been coaching candidates and interviewers for over 20 years, across all industries and job types.

      Your task is to:
        1. Read the candidate’s answer carefully.
        2. Analyze whether the answer is:
        - Clear
        - Complete
        - Specific
        3. Decide if a follow-up question is needed:
        - If yes, create a clear, natural, and specific follow-up question to get more depth, clarification, or examples.
        - If no, explain why the answer is sufficient.

      Analyze this interview response:

      Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}
      Answer: ${userAnswer}

      
      Provide JSON response with:
      - "needsFollowUp": true or false
      - "reason": "reason here"
      - "suggestedFollowUp": "your follow-up question here or empty string if none"

      Important:
      - Be natural, engaging, and job-appropriate when writing follow-up questions.
      - Avoid vague or overly broad questions.

      Take a deep breath and work on this problem step-by-step.
    `;
  
    try {
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
    const feedback = await generateFeedback();
    const followUpAnalysis = await generateFollowUpAnalysis();

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
      needsFollowUp: followUpAnalysis.needsFollowUp,
      reason: followUpAnalysis.reason,
      suggestedFollowUp: followUpAnalysis.suggestedFollowUp,
      interview_type: interviewType,
    });

    toast.success('Answer recorded successfully');
    
  } catch (error) {
    console.error("Submission failed", error);
    toast.error("Submission failed. Please try again.");
  } finally {
    setLoading(false);
    setIsProcessing(false);
  }
};

  const handleRetry = () => {
    setResults([]);
    setUserAnswer('');
    setFeedback(null);
    setfollowUpAnalysis(null);
    if (isRecording) stopSpeechToText();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          </div>
        )}
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
          <Button className="mt-2" onClick={() => toast.success('Follow-up response saved (mock)')}>Submit Follow-Up</Button>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          className="gap-2"
          onClick={handleStartStopRecording}
          disabled={loading}
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
          <Save className="h-5 w-5" />
          {loading ? 'Saving...' : 'Save Answer'}
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
            className="bg-blue-500 h-2 rounded-full" 
            style={{ 
              width: `${Math.min(100, (userAnswer.length / MIN_ANSWER_LENGTH) * 100)}%`,
              backgroundColor: userAnswer.length >= MIN_ANSWER_LENGTH ? '#10B981' : '#3B82F6'
            }}
          ></div>
        </div>
      </div>

      {/* Transcript */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Your Answer:</h3>
        <div className="bg-secondary p-4 rounded-lg min-h-32 border">
          {interimResult ? (
            <p className="text-muted-foreground">{interimResult}</p>
          ) : userAnswer ? (
            <p>{userAnswer}</p>
          ) : (
            <p className="text-muted-foreground italic">
              {isRecording ? "Speak now..." : "Your transcript will appear here"}
            </p>
          )}
        </div>
      </div>

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
