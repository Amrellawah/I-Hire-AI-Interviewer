'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function WelcomeContainer() {
    const { user } = useUser();
    
    // Function to get the best available name with better formatting
    const getUserName = () => {
        const name = user?.fullName || 
                    user?.username || 
                    user?.primaryEmailAddress?.emailAddress.split('@')[0] || 
                    'Valued User';
        return name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Get current time for personalized greeting
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    return (
        <div className="mb-10 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-8 bg-gradient-to-b from-[#f05941] to-[#be3144] rounded-full"></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941] font-semibold text-sm uppercase tracking-wider">
                    Your Dashboard
                </span>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <h1 className="text-[#191011] text-3xl font-bold leading-tight md:text-4xl md:leading-[1.2]">
                        {getTimeBasedGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">{getUserName()}</span>!
                    </h1>
                    <p className="text-[#191011]/90 text-lg font-normal leading-relaxed max-w-[720px] mt-2">
                        {user ? "Here's what's happening with your jobs today." : "Ready to continue your interview preparation?"}
                    </p>
                    {user?.createdAt && (
                        <div className="text-sm text-[#191011]/70 mt-2">
                            Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </div>
                    )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 w-full md:w-auto flex md:block">
                    <Link href="/dashboard/post-job" className="w-full">
                        <Button className="w-full md:w-auto bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-[#a31d1d] hover:to-[#be3144] transition-all duration-200">
                            + Post a Job
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomeContainer