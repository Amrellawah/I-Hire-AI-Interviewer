"use client"
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import React, { useEffect, useState, use } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import QuestionTimer from './_components/QuestionTimer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { generateSessionId, isQuestionAnswered, isQuestionSkipped, calculateSessionProgress, getCurrentAnswer } from '@/utils/sessionUtils';
import { toast } from 'sonner';

function StartInterview({params}) {
    // Unwrap params Promise for Next.js 15 compatibility
    const resolvedParams = use(params);
    const interviewId = resolvedParams.interviewId;

    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    
    useEffect(()=>{
        if (user?.primaryEmailAddress?.emailAddress) {
            initializeSession();
        }
    },[interviewId, user]);

    // Cleanup effect to end session when component unmounts
    useEffect(() => {
        return () => {
            // End session when component unmounts
            if (sessionId) {
                endSession();
            }
        };
    }, [sessionId]);

    /**
     * Initialize the interview session
     */
    const initializeSession = async () => {
        try {
            setLoading(true);
            
            // Generate new session ID for this attempt
            const newSessionId = generateSessionId(
                user.primaryEmailAddress.emailAddress, 
                interviewId
            );
            setSessionId(newSessionId);

            // Initialize session-level cheating detection with enhanced settings
            try {
                console.log('Creating session with:', { sessionId: newSessionId, mockId: interviewId });
                
                const response = await fetch('/api/session-cheating-detection/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId: newSessionId,
                        mockId: interviewId,
                        userEmail: user?.primaryEmailAddress?.emailAddress,
                        detectionSettings: {
                            detectionInterval: 2000, // More frequent detection
                            confidenceThreshold: 0.75, // Higher confidence
                            maxViolations: 5, // More violations before high risk
                            alertCooldown: 10000, // Shorter cooldown
                            faceDetectionEnabled: true,
                            deviceDetectionEnabled: true,
                            movementAnalysisEnabled: true,
                            audioAnalysisEnabled: true,
                            tabSwitchingDetectionEnabled: true,
                            typingDetectionEnabled: true
                        }
                    })
                });

                console.log('Session creation response status:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Enhanced session-level cheating detection initialized:', result);
                } else {
                    const errorText = await response.text();
                    console.warn('Failed to initialize session cheating detection:', errorText);
                }
            } catch (error) {
                console.error('Error initializing session cheating detection:', error);
            }

            // Get interview details
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));
            
            if (result.length === 0) {
                toast.error('Interview not found');
                return;
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);

            // Get existing answers for this session
            await loadSessionAnswers(newSessionId);

        } catch (error) {
            console.error('Error initializing session:', error);
            toast.error('Failed to initialize interview session');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load answers for the current session
     */
    const loadSessionAnswers = async (currentSessionId) => {
        try {
            const answers = await db.select().from(UserAnswer)
                .where(and(
                    eq(UserAnswer.mockIdRef, interviewId),
                    eq(UserAnswer.sessionId, currentSessionId)
                ))
                .orderBy(UserAnswer.questionIndex);
            
            setUserAnswers(answers);
        } catch (error) {
            console.error('Error loading session answers:', error);
        }
    };

    /**
     * Handle skipping a question
     */
    const handleSkipQuestion = async () => {
        if (!sessionId || !mockInterviewQuestion) return;

        try {
            const question = mockInterviewQuestion[activeQuestionIndex];
            
            // Check if already skipped
            if (isQuestionSkipped(userAnswers, activeQuestionIndex, sessionId)) {
                toast.info('Question already skipped');
                return;
            }

            // Save skip record
            await db.insert(UserAnswer).values({
                mockIdRef: interviewId,
                question: question.question,
                questionIndex: activeQuestionIndex,
                sessionId: sessionId,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userAns: 'SKIPPED',
                isSkipped: true,
                isAnswered: false,
                rating: '0', // Zero rating for skipped questions
                feedback: 'Question skipped by candidate',
                createdAt: new Date().toISOString(),
                lastAttemptAt: new Date(),
                updatedAt: new Date()
            });

            // Reload answers
            await loadSessionAnswers(sessionId);
            
            toast.success('Question skipped');
            
            // Move to next question if available
            if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
                setActiveQuestionIndex(activeQuestionIndex + 1);
            }
        } catch (error) {
            console.error('Error skipping question:', error);
            toast.error('Failed to skip question');
        }
    };

    /**
     * Handle moving to next question
     */
    const handleNextQuestion = () => {
        if (activeQuestionIndex < (mockInterviewQuestion?.length || 1) - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        }
    };

    /**
     * Handle time expiration for current question
     */
    const handleTimeExpired = async () => {
        if (!sessionId || !mockInterviewQuestion) return;

        try {
            const question = mockInterviewQuestion[activeQuestionIndex];
            
            // Check if already answered or skipped
            if (isQuestionAnswered(userAnswers, activeQuestionIndex, sessionId) || 
                isQuestionSkipped(userAnswers, activeQuestionIndex, sessionId)) {
                return;
            }

            // Auto-skip question when time expires
            await db.insert(UserAnswer).values({
                mockIdRef: interviewId,
                question: question.question,
                questionIndex: activeQuestionIndex,
                sessionId: sessionId,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userAns: 'SKIPPED',
                isSkipped: true,
                isAnswered: false,
                rating: '0', // Zero rating for time-expired questions
                feedback: 'Question automatically skipped due to time expiration',
                createdAt: new Date().toISOString(),
                lastAttemptAt: new Date(),
                updatedAt: new Date()
            });

            // Reload answers
            await loadSessionAnswers(sessionId);
            
            toast.warning('Time expired! Question automatically skipped.');
            
        } catch (error) {
            console.error('Error handling time expiration:', error);
            toast.error('Failed to handle time expiration');
        }
    };

    /**
     * Handle moving to previous question
     */
    const handlePreviousQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(activeQuestionIndex - 1);
        }
    };

    /**
     * End session and save final cheating detection data
     */
    const endSession = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch('/api/session-cheating-detection/end', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    mockId: interviewId,
                    finalDetectionData: {
                        sessionCompleted: true,
                        totalQuestions: mockInterviewQuestion?.length || 0,
                        answeredQuestions: userAnswers.filter(a => a.isAnswered).length,
                        skippedQuestions: userAnswers.filter(a => a.isSkipped).length,
                        sessionDuration: Date.now() - (sessionId ? parseInt(sessionId.split('_')[1]) : Date.now())
                    }
                })
            });

            if (response.ok) {
                console.log('Session ended successfully');
            }
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    /**
     * Check if current question is answered
     */
    const isCurrentQuestionAnswered = () => {
        return isQuestionAnswered(userAnswers, activeQuestionIndex, sessionId);
    };

    /**
     * Check if current question is skipped
     */
    const isCurrentQuestionSkipped = () => {
        return isQuestionSkipped(userAnswers, activeQuestionIndex, sessionId);
    };

    /**
     * Get progress for current session
     */
    const getSessionProgress = () => {
        if (!mockInterviewQuestion || !sessionId) return { answered: 0, skipped: 0, total: 0, progress: 0 };
        return calculateSessionProgress(userAnswers, sessionId, mockInterviewQuestion.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbf9f9] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#be3144] mx-auto mb-4"></div>
                    <p className="text-gray-600">Initializing interview session...</p>
                </div>
            </div>
        );
    }

    const progress = getSessionProgress();

    return (
        <div className="min-h-screen bg-[#fbf9f9] flex flex-col">
            {/* Custom Interview Header */}
            <header className="sticky top-0 z-50 bg-[#FBF1EE] border-b border-[#f1e9ea] shadow-sm py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 group flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                        <Image src={'/logo.png'} width={40} height={40} alt='logo' className="object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300">I-Hire</span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                    <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                                userButtonPopoverCard: "shadow-lg border border-gray-200",
                                userPreviewAvatarBox: "w-12 h-12"
                            }
                        }}
                    />
                </div>
            </header>

            {/* Enhanced Progress Bar */}
            <div className="w-full max-w-6xl mx-auto px-2 md:px-8 mt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Session Progress: {progress.answered} answered, {progress.skipped} skipped
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        {progress.progress}% Complete
                    </span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full shadow overflow-hidden">
                    <div
                        className="h-6 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-2 md:px-8 py-6">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
                    {/* Question */}
                    <div className="flex flex-col h-full">
                        <QuestionsSection 
                            mockInterviewQuestion={mockInterviewQuestion} 
                            activeQuestionIndex={activeQuestionIndex}
                        />
                    </div>
                    {/* Video/ Audio Recording */}
                    <div className="flex flex-col h-full">
                        <RecordAnswerSection
                            mockInterviewQuestion={mockInterviewQuestion} 
                            activeQuestionIndex={activeQuestionIndex}
                            interviewData={interviewData}
                            sessionId={sessionId}
                            userEmail={user?.primaryEmailAddress?.emailAddress}
                            onAnswerSubmitted={loadSessionAnswers}
                            currentAnswer={getCurrentAnswer(userAnswers, activeQuestionIndex, sessionId)}
                        />
                    </div>
                </div>

                {/* Question Timer */}
                <div className="w-full max-w-2xl mx-auto mt-6">
                    <QuestionTimer
                        activeQuestionIndex={activeQuestionIndex}
                        onTimeExpired={handleTimeExpired}
                        onNextQuestion={handleNextQuestion}
                        isQuestionAnswered={isCurrentQuestionAnswered()}
                        isQuestionSkipped={isCurrentQuestionSkipped()}
                        totalQuestions={mockInterviewQuestion?.length || 0}
                    />
                </div>

                {/* Enhanced Navigation Buttons */}
                <div className="w-full max-w-6xl flex items-center justify-between mt-8 mb-2 px-2">
                    {/* Previous Button */}
                    <div>
                        {activeQuestionIndex > 0 && (
                            <Button
                                onClick={handlePreviousQuestion}
                                variant="outline"
                                className="px-8 py-3 rounded-full bg-white border border-gray-200 text-[#191011] font-semibold shadow transition hover:scale-105 hover:border-[#be3144] focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:ring-offset-2"
                            >
                                Previous Question
                            </Button>
                        )}
                    </div>

                    {/* Center Status */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                            Question {activeQuestionIndex + 1} of {mockInterviewQuestion?.length || 0}
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            {isCurrentQuestionAnswered() && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    ✓ Answered
                                </span>
                            )}
                            {isCurrentQuestionSkipped() && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    ⏭ Skipped
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Next/Skip/End Buttons */}
                    <div className="flex gap-4">
                        {/* Skip Button - Show if question is not answered and not skipped */}
                        {!isCurrentQuestionAnswered() && !isCurrentQuestionSkipped() && (
                            <Button
                                onClick={handleSkipQuestion}
                                variant="outline"
                                className="px-6 py-3 rounded-full bg-yellow-50 border-yellow-200 text-yellow-700 font-semibold shadow hover:scale-105 hover:bg-yellow-100 transition"
                            >
                                Skip Question
                            </Button>
                        )}

                        {/* Next Button - Show only if question is answered or skipped */}
                        {(isCurrentQuestionAnswered() || isCurrentQuestionSkipped()) && 
                         activeQuestionIndex < (mockInterviewQuestion?.length || 1) - 1 && (
                            <Button
                                onClick={handleNextQuestion}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold shadow-lg hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:ring-offset-2"
                            >
                                Next Question
                            </Button>
                        )}

                        {/* End Interview Button */}
                        {activeQuestionIndex === (mockInterviewQuestion?.length || 1) - 1 && 
                         (isCurrentQuestionAnswered() || isCurrentQuestionSkipped()) && 
                         interviewData?.mockId && (
                            <Button 
                                onClick={async () => {
                                    // End session before navigating
                                    await endSession();
                                    // Navigate to feedback page
                                    window.location.href = `/interview/${interviewData.mockId}/feedback?sessionId=${sessionId}`;
                                }}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold shadow-lg hover:scale-105 transition"
                            >
                                End Interview
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StartInterview