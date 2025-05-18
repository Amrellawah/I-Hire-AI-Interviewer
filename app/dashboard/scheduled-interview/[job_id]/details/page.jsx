"use client"
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import { eq, and } from 'drizzle-orm';
import { callInterview } from '@/utils/schema';
import CandidateList from './_components/CandidateList';

function InterviewDetail() {
    const { job_id } = useParams();
    const { user } = useUser();
    const [interviewDetail, setInterviewDetail] = useState(null);

    useEffect(() => {
        if (user) {
            GetInterviewDetail();
        }
    }, [user])

    const GetInterviewDetail = async () => {
        try {
            // Correct Drizzle ORM query
            const result = await db.query.callInterview.findFirst({
                where: and(
                    eq(callInterview.recruiterEmail, user.primaryEmailAddress.emailAddress),
                    eq(callInterview.job_id, job_id)
                ),
                with: {
                    feedback: true
                }
            });

            if (result) {
                setInterviewDetail({
                    ...result,
                    candidateCount: result.feedback?.length || 0
                });
                console.log("Interview details:", result);
            } else {
                console.log("No interview found");
            }
            
        } catch (error) {
            console.error("Database error:", error);
        }
    }

    return (
        <div className='mt-5'>
            <h2 className='font-bold text-2xl'>Interview Detail</h2>
            <InterviewDetailContainer interviewDetail={interviewDetail} />
            <CandidateList candidateList={interviewDetail?.feedback || []} />
        </div>
    )
}

export default InterviewDetail