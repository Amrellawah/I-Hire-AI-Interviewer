"use client"
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VideoInterviewDetailContainer from './_components/VideoInterviewDetailContainer';
import { eq, and } from 'drizzle-orm';
import { MockInterview, UserAnswer } from '@/utils/schema';
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
                    language: UserAnswer.language
                })
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, mockId));

            if (result.length > 0) {
                // Group answers by user email
                const groupedAnswers = result.reduce((acc, answer) => {
                    const email = answer.userEmail;
                    if (!acc[email]) {
                        acc[email] = {
                            userEmail: email,
                            userName: email.split('@')[0], // Use email prefix as name
                            createAt: answer.createdAt,
                            answers: []
                        };
                    }
                    acc[email].answers.push(answer);
                    return acc;
                }, {});

                const candidates = Object.values(groupedAnswers);
                setCandidateList(candidates);
                console.log("Candidates:", candidates);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-800">Loading Interview Details</h3>
                        <p className="text-slate-600 max-w-md">Please wait while we fetch the latest data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center space-y-8 max-w-md mx-auto p-8">
                    <div className="relative">
                        <div className="h-20 w-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <AlertCircle className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800">Something went wrong</h3>
                        <p className="text-slate-600">{error}</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button 
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header with back button */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button 
                                onClick={() => router.back()}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <div className="h-6 w-px bg-slate-300"></div>
                            <h1 className="text-lg font-semibold text-slate-900">Video Interview Details</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-700 font-medium">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <VideoInterviewDetailContainer 
                    interviewDetail={interviewDetail} 
                    candidateList={candidateList}
                />
            </div>
        </div>
    );
}

export default VideoInterviewDetail; 