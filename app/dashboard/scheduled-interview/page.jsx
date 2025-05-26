"use client"
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { eq, desc } from 'drizzle-orm'
import { callInterview } from '@/utils/schema'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CallInterviewCard from '../_components/CallInterviewCard'

function ScheduledInterview() {
    const { user, isLoaded } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
            GetInterviewList();
        }
    }, [user, isLoaded])

    const GetInterviewList = async () => {
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

            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interviews:", error);
            setError("Failed to load interviews. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-5'>
            <h2 className='font-bold text-2xl'>Jobs List with Candidate Feedback</h2>
            {interviewList.length === 0 ? (
                <div className='p-5 flex flex-col gap-3 items-center'>
                    <Video className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Button>+ Create New Job</Button>
                </div>
            ) : (
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {interviewList.map((interview, index) => (
                        <CallInterviewCard interview={interview} key={index} 
                            viewDetail={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ScheduledInterview