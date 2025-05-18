import { UserButton } from '@clerk/nextjs'
import React from 'react'
import CreateOptions from './_components/CreateOptions'
import InterviewList from './_components/InterviewList'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 transition-all duration-300">
      
      {/* Header Section - Reduced spacing */}
      <div className="mb-4 md:mb-6">
        <h1 className='text-xl md:text-2xl font-bold text-[#191011]'>Dashboard</h1>
        <p className='text-[#8e575f] mt-1 md:mt-2 text-sm md:text-base'>Create and start your AI interview</p>
      </div>

      {/* Quick Actions Section - Compact layout */}
      <div className="mb-6 md:mb-8">
          <CreateOptions />
      </div>

      {/* Recent Interviews Section - Tighter spacing */}
      <div className="bg-white rounded-lg md:rounded-xl border border-[#e4d3d5] p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#191011]">Previous Interviews</h2>
          {/* Optional filter/sort controls would go here */}
        </div>
        <InterviewList />
      </div>

      {/* Recent Interviews Section - Tighter spacing */}
      <div className="bg-white rounded-lg md:rounded-xl border border-[#e4d3d5] p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#191011]">Previous Interviews</h2>
          {/* Optional filter/sort controls would go here */}
        </div>
        <LatestInterviewsList />
      </div>

      {/* Stats Section (Optional) - Would appear here if added */}
    </div>
  )
}

export default Dashboard