'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCircle2 } from 'lucide-react';

const quotes = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "Opportunities don't happen, you create them.",
  "Dream big and dare to fail.",
  "The only way to do great work is to love what you do.",
  "Stay positive, work hard, make it happen."
];

function WelcomeContainer() {
    const { user } = useUser();
    // Pick a random quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
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
        <div className="mb-10 relative overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fff8f6] via-[#fbeee6] to-[#f1e9ea] animate-pulse-slow opacity-80 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3 mb-3 pt-6 px-6">
                <div className="w-3 h-8 bg-gradient-to-b from-[#f05941] to-[#be3144] rounded-full"></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941] font-semibold text-sm uppercase tracking-wider">
                    Your Dashboard
                </span>
            </div>
            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 pb-6">
                <div className="flex-1 flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="User avatar" className="w-16 h-16 rounded-full shadow-lg border-2 border-[#f05941] object-cover" />
                      ) : (
                        <UserCircle2 className="w-16 h-16 text-[#f05941] bg-white rounded-full shadow-lg border-2 border-[#f05941] p-1" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-[#191011] text-3xl font-bold leading-tight md:text-4xl md:leading-[1.2] animate-fade-in">
                        <span className="inline-block animate-slide-in-left">{getTimeBasedGreeting()}, </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941] drop-shadow-lg font-extrabold animate-slide-in-right">{getUserName()}</span>!
                      </h1>
                      <p className="text-[#191011]/90 text-lg font-normal leading-relaxed max-w-[720px] mt-2 animate-fade-in">
                        {user ? "Here's what's happening with your jobs today." : "Ready to continue your interview preparation?"}
                      </p>
                      {user?.createdAt && (
                        <div className="text-sm text-[#191011]/70 mt-2 animate-fade-in">
                            Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </div>
                      )}
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 w-full md:w-auto flex md:block">
                    <Link href="/dashboard/post-job" className="w-full">
                        <Button className="w-full md:w-auto bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-[#a31d1d] hover:to-[#be3144] transition-all duration-200">
                            + Post a Job
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Motivational Quote */}
            <div className="relative z-10 px-6 pb-6">
              <div className="mt-2 text-[#be3144] italic text-base font-medium animate-fade-in-slow">
                "{quote}"
              </div>
            </div>
        </div>
    )
}

export default WelcomeContainer