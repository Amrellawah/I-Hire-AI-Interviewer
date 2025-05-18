"use client"
import { db } from '@/utils/db';
import { callInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import CallInterviewCard from './CallInterviewCard';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            const result = await db
                .select()
                .from(callInterview)
                .where(eq(callInterview.recruiterEmail, user?.primaryEmailAddress?.emailAddress || ''))
                .orderBy(desc(callInterview.createdAt))
                .limit(6);
            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>Previously Created</h2>

            {interviewList.length === 0 ? (
                <div className='p-5 flex flex-col gap-3 items-center'>
                    <Video className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Button>+ Create New Job</Button>
                </div>
            ) : (
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {interviewList.map((interview, index) => (
                        <CallInterviewCard interview={interview} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LatestInterviewsList;