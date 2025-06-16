import { UserButton } from '@clerk/nextjs'
import React from 'react'
import CreateOptions from './_components/CreateOptions'
import InterviewList from './_components/InterviewList'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard() {
  return (
    <div className="p-4 md:p-8 lg:p-12 transition-all duration-300 max-w-7xl mx-auto space-y-10">
      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        <div className="bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-6 flex flex-col items-start">
          <span className="text-xs text-[#8e575f] font-semibold mb-1">Total Interviews</span>
          <span className="text-3xl font-extrabold text-[#191011]">12</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-6 flex flex-col items-start">
          <span className="text-xs text-[#8e575f] font-semibold mb-1">Candidates</span>
          <span className="text-3xl font-extrabold text-[#191011]">34</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-6 flex flex-col items-start">
          <span className="text-xs text-[#8e575f] font-semibold mb-1">Feedbacks</span>
          <span className="text-3xl font-extrabold text-[#191011]">7</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-6 flex flex-col items-start">
          <span className="text-xs text-[#8e575f] font-semibold mb-1">Active Jobs</span>
          <span className="text-3xl font-extrabold text-[#191011]">3</span>
        </div>
      </div>
      {/* Header Section */}
      <div className="mb-4 md:mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h1 className='text-2xl md:text-3xl font-extrabold text-[#191011]'>Dashboard</h1>
        </div>
        <p className='text-[#8e575f] text-base'>Create and start your AI interview</p>
      </div>
      {/* Quick Actions Section removed */}
      {/* Previous Interviews Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-xl font-bold text-[#191011]">Previous Interviews</h2>
        </div>
        <InterviewList />
      </div>
      {/* Latest Interviews Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-xl font-bold text-[#191011]">Latest Interviews</h2>
        </div>
        <LatestInterviewsList />
      </div>
    </div>
  )
}

export default Dashboard