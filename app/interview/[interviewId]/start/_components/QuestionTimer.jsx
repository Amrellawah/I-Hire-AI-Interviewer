"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';

const QuestionTimer = ({ 
  activeQuestionIndex, 
  onTimeExpired, 
  onNextQuestion,
  isQuestionAnswered,
  isQuestionSkipped,
  totalQuestions 
}) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [isRunning, setIsRunning] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(180);
    setIsRunning(true);
    setShowWarning(false);
    setIsExpired(false);
  }, [activeQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // Show warning when 30 seconds left
          if (newTime === 30) {
            setShowWarning(true);
          }
          
          // Auto-submit when time expires
          if (newTime === 0) {
            setIsExpired(true);
            setIsRunning(false);
            if (onTimeExpired) {
              onTimeExpired();
            }
            // Auto-move to next question after 2 seconds
            setTimeout(() => {
              if (onNextQuestion && activeQuestionIndex < totalQuestions - 1) {
                onNextQuestion();
              }
            }, 2000);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimeExpired, onNextQuestion, activeQuestionIndex, totalQuestions]);

  // Pause timer if question is answered or skipped
  useEffect(() => {
    if (isQuestionAnswered || isQuestionSkipped) {
      setIsRunning(false);
    }
  }, [isQuestionAnswered, isQuestionSkipped]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-orange-600';
    return 'text-gray-700';
  };

  // Get timer background color
  const getTimerBgColor = () => {
    if (timeLeft <= 30) return 'bg-red-50 border-red-200';
    if (timeLeft <= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="w-full">
      {/* Timer Display */}
      <div className={`flex items-center justify-center p-4 rounded-lg border-2 ${getTimerBgColor()} mb-4`}>
        <Clock className="h-5 w-5 mr-2 text-gray-600" />
        <span className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </span>
        <span className="ml-2 text-sm text-gray-600">
          remaining
        </span>
      </div>

      {/* Warning Alert */}
      {showWarning && !isExpired && (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            ⚠️ Only 30 seconds remaining! Please submit your answer or skip the question.
          </AlertDescription>
        </Alert>
      )}

      {/* Time Expired Alert */}
      {isExpired && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            ⏰ Time's up! Moving to the next question automatically...
          </AlertDescription>
        </Alert>
      )}

      {/* Question Status */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-600">
          Question {activeQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          {isQuestionAnswered && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              ✓ Answered
            </span>
          )}
          {isQuestionSkipped && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              ⏭ Skipped
            </span>
          )}
          {!isQuestionAnswered && !isQuestionSkipped && timeLeft > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              ⏱️ In Progress
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft <= 30 ? 'bg-red-500' : 
            timeLeft <= 60 ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${(timeLeft / 180) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionTimer; 