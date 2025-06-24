"use client"
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VideoInterviewDetailContainer from './_components/VideoInterviewDetailContainer';
import { eq, and } from 'drizzle-orm';
import { MockInterview, UserAnswer } from '@/utils/schema';
import VideoCandidateList from './_components/VideoCandidateList';

function VideoInterviewDetail() {
    const { mockId } = useParams();
    const { user } = useUser();
    const [interviewDetail, setInterviewDetail] = useState(null);
    const [candidateList, setCandidateList] = useState([]);
    const [activeTab, setActiveTab] = useState('job'); // 'job', 'questions', 'candidates'

    useEffect(() => {
        if (user) {
            GetInterviewDetail();
            GetCandidateList();
        }
    }, [user])

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
                console.log("No video interview found");
            }
            
        } catch (error) {
            console.error("Database error:", error);
        }
    }

    const GetCandidateList = async () => {
        try {
            const result = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, mockId));

            // Group by userEmail to get unique candidates
            const candidatesMap = new Map();
            result.forEach(answer => {
                if (!candidatesMap.has(answer.userEmail)) {
                    candidatesMap.set(answer.userEmail, {
                        userEmail: answer.userEmail,
                        userName: answer.userEmail?.split('@')[0] || 'Anonymous',
                        createAt: answer.createdAt,
                        answers: []
                    });
                }
                candidatesMap.get(answer.userEmail).answers.push(answer);
            });

            const candidates = Array.from(candidatesMap.values());
            setCandidateList(candidates);
            
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    }

    // Tab content rendering
    let tabContent = null;
    if (activeTab === 'job') {
      tabContent = (
        <VideoInterviewDetailContainer interviewDetail={interviewDetail} showJob showQuestions={false} />
      );
    } else if (activeTab === 'questions') {
      tabContent = (
        <VideoInterviewDetailContainer interviewDetail={interviewDetail} showJob={false} showQuestions />
      );
    } else if (activeTab === 'candidates') {
      tabContent = (
        <VideoCandidateList candidateList={candidateList} />
      );
    }

    return (
        <div className='mt-5'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-[#be3144] mb-8 tracking-tight drop-shadow-sm'>Video Interview Details</h2>
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

export default VideoInterviewDetail 