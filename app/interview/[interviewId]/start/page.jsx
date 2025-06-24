"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

function StartInterview({params}) {

    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    
    useEffect(()=>{
        GetInterviewDetials();
    },[]);

     /**
         * Used to Get Interview Details by MockId/Interview Id
         */
    
        const GetInterviewDetials = async()=>{
            const result=await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId,params.interviewId))
            
            const jsonMockResp=JSON.parse(result[0].jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
        }

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
      {/* Simple Progress Bar at Top */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-8 mt-4 mb-4">
        <div className="h-6 bg-gray-100 rounded-full shadow overflow-hidden">
          <div
            className="h-6 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] transition-all duration-300"
            style={{ width: `${mockInterviewQuestion ? ((activeQuestionIndex + 1) / (mockInterviewQuestion.length || 1)) * 100 : 0}%` }}
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
            />
          </div>
        </div>
        {/* Next/End/Previous Buttons */}
        <div className="w-full max-w-6xl flex items-center justify-end mt-8 mb-2 px-2">
          <div className="flex gap-4 ml-4">
            {activeQuestionIndex > 0 && (
              <button
                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                className="px-8 py-3 rounded-full bg-white border border-gray-200 text-[#191011] font-semibold shadow transition hover:scale-105 hover:border-[#be3144] focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:ring-offset-2"
                style={{ zIndex: 40 }}
              >
                Previous Question
              </button>
            )}
            {activeQuestionIndex < (mockInterviewQuestion?.length || 1) - 1 && (
              <button
                onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold shadow-lg hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:ring-offset-2"
                style={{ zIndex: 40 }}
              >
                Next Question
              </button>
            )}
            {activeQuestionIndex === (mockInterviewQuestion?.length || 1) - 1 && interviewData?.mockId && (
              <a
                href={`/interview/${interviewData.mockId}/feedback`}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold shadow-lg hover:scale-105 transition fixed bottom-6 right-6 md:static md:shadow-none md:relative"
                style={{ zIndex: 40 }}
              >
                End Interview
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default StartInterview