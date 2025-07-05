"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, Pause, Play, Zap, Target, CheckCircle, SkipForward } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
          if (newTime === 30) setShowWarning(true);
          if (newTime === 0) {
            setIsExpired(true);
            setIsRunning(false);
            if (onTimeExpired) onTimeExpired();
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
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, timeLeft, onTimeExpired, onNextQuestion, activeQuestionIndex, totalQuestions]);

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

  // Get progress percentage
  const getProgressPercentage = () => {
    return ((180 - timeLeft) / 180) * 100;
  };

  return (
    <Card className="bg-white shadow border-0 p-0">
      <CardContent className="py-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
            <Clock className="h-4 w-4 text-gray-500" />
            {activeQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">
            {isQuestionAnswered ? 'Answered' : isQuestionSkipped ? 'Skipped' : isExpired ? 'Time Expired' : 'In Progress'}
          </span>
        </div>
        <div className={`flex flex-col items-center justify-center rounded-lg border ${getTimerBgColor()} mb-2 py-3 px-2`}>
          <span className={`text-2xl font-bold ${getTimerColor()} mb-1`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-gray-500">Time left</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-700 font-semibold">{Math.round(getProgressPercentage())}%</span>
        </div>
        <Progress 
          value={getProgressPercentage()} 
          className={`h-2 transition-all duration-300 rounded-full ${
            timeLeft <= 30 ? 'bg-red-100' : 
            timeLeft <= 60 ? 'bg-orange-100' : 'bg-blue-100'
          }`}
        />
        {showWarning && !isExpired && (
          <div className="mt-2 text-xs text-orange-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Only 30 seconds left!
          </div>
        )}
        {isExpired && (
          <div className="mt-2 text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Time's up! Moving to next question...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionTimer; 