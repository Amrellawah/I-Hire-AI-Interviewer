"use client"
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VideoInterviewDetailContainer from './_components/VideoInterviewDetailContainer';
import { eq, and } from 'drizzle-orm';
import { MockInterview, UserAnswer, SessionCheatingDetection } from '@/utils/schema';
import VideoCandidateList from './_components/VideoCandidateList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function VideoInterviewDetail() {
    const { mockId } = useParams();
    const { user } = useUser();
    const router = useRouter();
    const [interviewDetail, setInterviewDetail] = useState(null);
    const [candidateList, setCandidateList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('job'); // 'job', 'questions', 'candidates'

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user])

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await Promise.all([
                GetInterviewDetail(),
                GetCandidateList()
            ]);
        } catch (err) {
            setError('Failed to load interview data');
            toast.error('Failed to load interview data');
        } finally {
            setLoading(false);
        }
    }

    const GetInterviewDetail = async () => {
        try {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, mockId));

            if (result.length > 0) {
                const interview = result[0];
                // Parse the JSON questions
                const questions = JSON.parse(interview.jsonMockResp || '[]');
                setInterviewDetail({
                    ...interview,
                    questionList: questions
                });
                console.log("Video interview details:", interview);
            } else {
                setError('Interview not found');
                console.log("No video interview found");
            }
            
        } catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    }

    const GetCandidateList = async () => {
        try {
            // Get session-level cheating detection data
            const sessionCheatingData = await db
                .select()
                .from(SessionCheatingDetection)
                .where(eq(SessionCheatingDetection.mockId, mockId));

            // Create a map of session cheating data for quick lookup
            const sessionCheatingMap = sessionCheatingData.reduce((acc, session) => {
                acc[session.sessionId] = session;
                return acc;
            }, {});

            const result = await db
                .select({
                    id: UserAnswer.id,
                    mockIdRef: UserAnswer.mockIdRef,
                    question: UserAnswer.question,
                    correctAns: UserAnswer.correctAns,
                    userAns: UserAnswer.userAns,
                    feedback: UserAnswer.feedback,
                    rating: UserAnswer.rating,
                    suggestions: UserAnswer.suggestions,
                    userEmail: UserAnswer.userEmail,
                    createdAt: UserAnswer.createdAt,
                    needsFollowUp: UserAnswer.needsFollowUp,
                    reason: UserAnswer.reason,
                    suggestedFollowUp: UserAnswer.suggestedFollowUp,
                    interview_type: UserAnswer.interview_type,
                    audioRecording: UserAnswer.audioRecording,
                    language: UserAnswer.language,
                    detailedEvaluation: UserAnswer.detailedEvaluation,
                    evaluationScore: UserAnswer.evaluationScore,
                    detailedScores: UserAnswer.detailedScores,
                    combinedScore: UserAnswer.combinedScore,
                    overallAssessment: UserAnswer.overallAssessment,
                    sessionId: UserAnswer.sessionId,
                    questionIndex: UserAnswer.questionIndex,
                    isAnswered: UserAnswer.isAnswered,
                    isSkipped: UserAnswer.isSkipped,
                    retryCount: UserAnswer.retryCount,
                    lastAttemptAt: UserAnswer.lastAttemptAt,
                    updatedAt: UserAnswer.updatedAt
                })
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, mockId));

            if (result.length > 0) {
                // Group answers by session ID (each session is a separate candidate)
                const groupedAnswers = result.reduce((acc, answer) => {
                    const sessionKey = answer.sessionId || `${answer.userEmail}_legacy_${answer.createdAt}`;
                    
                    if (!acc[sessionKey]) {
                        acc[sessionKey] = {
                            sessionId: answer.sessionId,
                            userEmail: answer.userEmail,
                            userName: answer.userEmail ? answer.userEmail.split('@')[0] : 'Unknown',
                            createAt: answer.createdAt,
                            lastAttemptAt: answer.lastAttemptAt,
                            answers: [],
                            totalQuestions: 0,
                            answeredQuestions: 0,
                            skippedQuestions: 0,
                            averageRating: 0,
                            totalRetries: 0,
                            // Session-level cheating detection data
                            sessionCheatingData: sessionCheatingMap[sessionKey] || null
                        };
                    }
                    
                    acc[sessionKey].answers.push(answer);
                    
                    // Calculate session statistics
                    if (answer.isAnswered) {
                        acc[sessionKey].answeredQuestions++;
                    }
                    if (answer.isSkipped) {
                        acc[sessionKey].skippedQuestions++;
                    }
                    if (answer.retryCount > 0) {
                        acc[sessionKey].totalRetries += answer.retryCount;
                    }
                    
                    return acc;
                }, {});

                // Calculate averages and totals for each session
                Object.values(groupedAnswers).forEach(session => {
                    session.totalQuestions = session.answers.length;
                    
                    // Calculate average rating (excluding skipped questions)
                    const answeredWithRating = session.answers.filter(a => 
                        a.isAnswered && a.rating && !isNaN(parseFloat(a.rating))
                    );
                    
                    if (answeredWithRating.length > 0) {
                        const totalRating = answeredWithRating.reduce((sum, a) => 
                            sum + parseFloat(a.rating), 0
                        );
                        session.averageRating = (totalRating / answeredWithRating.length).toFixed(1);
                    }
                });

                const candidates = Object.values(groupedAnswers);
                
                // Sort candidates by most recent attempt
                candidates.sort((a, b) => {
                    const dateA = new Date(a.lastAttemptAt || a.createAt);
                    const dateB = new Date(b.lastAttemptAt || b.createAt);
                    return dateB - dateA;
                });
                
                setCandidateList(candidates);
                console.log("Candidates (sessions):", candidates);
            } else {
                setCandidateList([]);
                console.log("No candidates found");
            }
            
        } catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="relative mb-6">
                    <img
                        src="/logo.png"
                        alt="Owl Loader"
                        className="w-24 h-24 animate-owl-bounce"
                        style={{ imageRendering: 'auto' }}
                    />
                    <style jsx>{`
                        @keyframes owl-bounce {
                            0%, 100% { transform: translateY(0) rotate(-5deg); }
                            20% { transform: translateY(-16px) rotate(5deg); }
                            40% { transform: translateY(0) rotate(-5deg); }
                            60% { transform: translateY(-16px) rotate(5deg); }
                            80% { transform: translateY(0) rotate(-5deg); }
                        }
                        .animate-owl-bounce {
                            animation: owl-bounce 1s infinite;
                        }
                    `}</style>
                </div>
                <span className="text-lg text-gray-800 font-medium">Loading interviews...</span>
                <div className="mt-2 text-sm text-gray-500">The wise owl is running through your data</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center space-y-8 max-w-md mx-auto p-8">
                    <div className="relative">
                        <div className="h-20 w-20 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <AlertCircle className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-[#191011]">Something went wrong</h3>
                        <p className="text-[#8e575f]">{error}</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button 
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex items-center gap-2 border-[#f1e9ea] text-[#8e575f] hover:bg-red-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#a31d1d] hover:to-[#be3144] text-white"
                        >
                            <Loader2 className="h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50">
            {/* Enhanced Header with back button */}
            <div className="bg-white/90 backdrop-blur-md border-b border-[#f1e9ea] sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
                        <div className="flex items-center gap-4">
                            <Button 
                                onClick={() => router.back()}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-[#8e575f] hover:text-[#191011] hover:bg-red-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Button>
                            <div className="hidden sm:block h-6 w-px bg-[#f1e9ea]"></div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941]"></span>
                                <h1 className="text-lg sm:text-xl font-semibold text-[#191011]">Video Interview Details</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-emerald-700 font-medium">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <VideoInterviewDetailContainer 
                    interviewDetail={interviewDetail} 
                    candidateList={candidateList}
                />
            </div>
        </div>
    );
}

export default VideoInterviewDetail; 