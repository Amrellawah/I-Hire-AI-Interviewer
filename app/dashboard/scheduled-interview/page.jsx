"use client"
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { eq, desc, count, sql } from 'drizzle-orm'
import { callInterview, MockInterview, UserAnswer } from '@/utils/schema'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CallInterviewCard from '../_components/CallInterviewCard'
import InterviewItemCard from '../_components/InterviewItemCard'

function ScheduledInterview() {
    const { user, isLoaded } = useUser();
    const [callInterviewList, setCallInterviewList] = useState([]);
    const [mockInterviewList, setMockInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
            GetCallInterviewList();
            GetMockInterviewList();
        }
    }, [user, isLoaded])

    const GetCallInterviewList = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await db.query.callInterview.findMany({
                where: eq(callInterview.recruiterEmail, user.primaryEmailAddress.emailAddress),
                with: {
                    feedback: true
                },
                orderBy: desc(callInterview.createdAt)
            });

            setCallInterviewList(result);
        } catch (error) {
            console.error("Error fetching call interviews:", error);
            setError("Failed to load call interviews. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const GetMockInterviewList = async () => {
        try {
            // Get all mock interviews for the user
            const mockInterviews = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress || ''))
                .orderBy(desc(MockInterview.createdAt));
            
            // Get candidate counts for each mock interview
            const mockInterviewsWithCounts = await Promise.all(
                mockInterviews.map(async (interview) => {
                    const candidateCountResult = await db
                        .select({ count: count(sql`DISTINCT ${UserAnswer.userEmail}`) })
                        .from(UserAnswer)
                        .where(eq(UserAnswer.mockIdRef, interview.mockId));
                    
                    return {
                        ...interview,
                        candidateCount: candidateCountResult[0]?.count || 0
                    };
                })
            );
            
            setMockInterviewList(mockInterviewsWithCounts);
        } catch (error) {
            console.error("Error fetching mock interviews:", error);
            setError("Failed to load mock interviews. Please try again later.");
        }
    }

    if (loading) {
        return (
            <div className='mt-5'>
                <h2 className='font-bold text-2xl'>Jobs List with Candidate Feedback</h2>
                <div className='p-5 flex flex-col gap-3 items-center'>
                    <div className="relative mb-4">
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
                    <p className="font-medium">Loading interviews...</p>
                    <p className="text-sm text-gray-500">The wise owl is running through your data</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='mt-5'>
                <h2 className='font-bold text-2xl'>Jobs List with Candidate Feedback</h2>
                <div className='p-5 flex flex-col gap-3 items-center'>
                    <p className='text-red-500'>{error}</p>
                    <Button onClick={() => {
                        setError(null);
                        GetCallInterviewList();
                        GetMockInterviewList();
                    }}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-5'>
            <h2 className='font-bold text-2xl'>Jobs List with Candidate Feedback</h2>
            {callInterviewList.length === 0 && mockInterviewList.length === 0 ? (
                <div className='p-5 flex flex-col gap-3 items-center'>
                    <Video className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Button>+ Create New Job</Button>
                </div>
            ) : (
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {/* Call Interviews */}
                    {callInterviewList.map((interview, index) => (
                        <CallInterviewCard interview={interview} key={"call-" + index} 
                            viewDetail={true}
                        />
                    ))}
                    {/* Mock/Video Interviews */}
                    {mockInterviewList.map((interview, index) => (
                        <InterviewItemCard interview={interview} key={"mock-" + index} 
                            viewDetail={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ScheduledInterview