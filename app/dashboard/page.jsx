import { UserButton } from '@clerk/nextjs'
import React from 'react'
import InterviewList from './_components/InterviewList'
import LatestInterviewsList from './_components/LatestInterviewsList'
import WelcomeContainer from './_components/WelcomeContainer'
import DashboardStats from './_components/DashboardStats'
import { CalendarDays, Clock, Users, Video, Sparkles, ShieldCheck, BarChart3, CalendarCheck2 } from 'lucide-react'

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-[#be3144]" />, 
    title: 'AI-Powered Job Matching',
    desc: 'Get personalized job recommendations for candidates and employers using advanced AI algorithms.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#be3144]" />,
    title: 'Enhanced Cheating Detection',
    desc: 'Protect interview integrity with real-time, multi-factor cheating detection and analytics.'
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-[#be3144]" />,
    title: 'Smart Feedback Analytics',
    desc: 'Receive actionable, AI-generated feedback and performance insights for every interview.'
  },
  {
    icon: <CalendarCheck2 className="h-8 w-8 text-[#be3144]" />,
    title: 'Seamless Scheduling',
    desc: 'Effortlessly schedule, manage, and track interviews with built-in calendar integration.'
  },
];

function Dashboard() {
  return (
    <div className="p-4 md:p-8 lg:p-12 transition-all duration-300 max-w-7xl mx-auto space-y-10">
      {/* Welcome Section */}
      <WelcomeContainer />
      {/* Stats Overview Section */}
      <DashboardStats />
      {/* Features Section */}
      <div className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-xl font-bold text-[#191011] flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#be3144]" /> Platform Features
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={feature.title} className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="font-bold text-lg text-[#be3144] mb-2 group-hover:text-[#f05941] transition-colors">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Previous Interviews Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-xl font-bold text-[#191011] flex items-center gap-2">
            <Video className="h-5 w-5 text-[#be3144]" /> Previous Interviews
          </h2>
        </div>
        <InterviewList />
      </div>
      {/* Latest Interviews Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-xl font-bold text-[#191011] flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#be3144]" /> Latest Interviews
          </h2>
        </div>
        <LatestInterviewsList />
      </div>
    </div>
  )
}

export default Dashboard