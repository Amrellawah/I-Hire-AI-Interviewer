'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'

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
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-8 bg-gradient-to-b from-[#f05941] to-[#be3144] rounded-full"></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941] font-semibold text-sm uppercase tracking-wider">
                    Your Dashboard
                </span>
            </div>
            
            <div className="flex flex-col @[768px]:flex-row @[768px]:items-end @[768px]:justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-[#191011] text-3xl font-bold leading-tight @[480px]:text-4xl @[480px]:leading-[1.2]">
                        {getTimeBasedGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">{getUserName()}</span>!
                    </h1>
                    <p className="text-[#191011]/90 text-lg font-normal leading-relaxed max-w-[720px] mt-2">
                        {user ? "Here's what's happening with your interviews today." : "Ready to continue your interview preparation?"}
                    </p>
                </div>
                
                {user?.createdAt && (
                    <div className="text-sm text-[#191011]/70">
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WelcomeContainer