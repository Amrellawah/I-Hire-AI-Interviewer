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
    const [activeTab, setActiveTab] = useState('job'); // 'job', 'questions', 'candidates'

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

    // Tab content rendering
    let tabContent = null;
    if (activeTab === 'job') {
      tabContent = (
        <InterviewDetailContainer interviewDetail={interviewDetail} showJob showQuestions={false} />
      );
    } else if (activeTab === 'questions') {
      tabContent = (
        <InterviewDetailContainer interviewDetail={interviewDetail} showJob={false} showQuestions />
      );
    } else if (activeTab === 'candidates') {
      tabContent = (
        <CandidateList candidateList={interviewDetail?.feedback || []} />
      );
    }

    return (
        <div className='mt-5'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-[#be3144] mb-8 tracking-tight drop-shadow-sm'>Job Details</h2>
            {/* Top Bar Tabs */}
            <div className="flex gap-2 md:gap-6 mb-6 border-b border-gray-200">
              <button
                className={`py-2 px-4 font-semibold transition-colors border-b-2 ${activeTab === 'job' ? 'border-[#be3144] text-[#be3144] bg-[#f1e9ea]' : 'border-transparent text-gray-700 hover:text-[#be3144]'}`}
                onClick={() => setActiveTab('job')}
              >
                Job Details
              </button>
              <button
                className={`py-2 px-4 font-semibold transition-colors border-b-2 ${activeTab === 'questions' ? 'border-[#be3144] text-[#be3144] bg-[#f1e9ea]' : 'border-transparent text-gray-700 hover:text-[#be3144]'}`}
                onClick={() => setActiveTab('questions')}
              >
                Interview Questions
              </button>
              <button
                className={`py-2 px-4 font-semibold transition-colors border-b-2 ${activeTab === 'candidates' ? 'border-[#be3144] text-[#be3144] bg-[#f1e9ea]' : 'border-transparent text-gray-700 hover:text-[#be3144]'}`}
                onClick={() => setActiveTab('candidates')}
              >
                Candidates
              </button>
            </div>
            {/* Tab Content */}
            {tabContent}
        </div>
    )
}

export default InterviewDetail