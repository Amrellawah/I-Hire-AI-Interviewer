'use client'

import React from 'react';
import { Users, Briefcase, MessageCircle, ActivitySquare } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    label: 'Total Interviews',
    value: 12, // TODO: Make dynamic
    icon: <Briefcase className="h-7 w-7 text-white" />,
    gradient: 'from-[#be3144] to-[#f05941]',
    bg: 'bg-gradient-to-br from-[#be3144] to-[#f05941] shadow-lg',
  },
  {
    label: 'Candidates',
    value: 34, // TODO: Make dynamic
    icon: <Users className="h-7 w-7 text-white" />,
    gradient: 'from-[#f05941] to-[#be3144]',
    bg: 'bg-gradient-to-br from-[#f05941] to-[#be3144] shadow-lg',
  },
  {
    label: 'Feedbacks',
    value: 7, // TODO: Make dynamic
    icon: <MessageCircle className="h-7 w-7 text-white" />,
    gradient: 'from-[#be3144] to-[#f05941]',
    bg: 'bg-gradient-to-br from-[#be3144] to-[#f05941] shadow-lg',
  },
  {
    label: 'Active Jobs',
    value: 3, // TODO: Make dynamic
    icon: <ActivitySquare className="h-7 w-7 text-white" />,
    gradient: 'from-[#f05941] to-[#be3144]',
    bg: 'bg-gradient-to-br from-[#f05941] to-[#be3144] shadow-lg',
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
      {stats.map((stat, idx) => (
        <div
          key={stat.label}
          className={`relative rounded-2xl p-6 flex flex-col items-start group transition-all duration-300 cursor-pointer ${stat.bg} hover:scale-[1.03] hover:shadow-2xl`}
        >
          <div className={`absolute top-4 right-4 rounded-full p-2 bg-white/20 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}>{stat.icon}</div>
          <span className="text-xs text-white/80 font-semibold mb-1 tracking-wide drop-shadow">{stat.label}</span>
          <span className="text-4xl font-extrabold text-white drop-shadow-lg">
            <CountUp end={stat.value} duration={1.2} separator="," />
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats; 