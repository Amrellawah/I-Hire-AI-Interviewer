"use client"
import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import Head from 'next/head'
import { UserButton } from '@clerk/nextjs'
import WelcomeContainer from './_components/WelcomeContainer'

function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <title>I-Hire Dashboard</title>
        <meta name="description" content="AI-powered interview platform" />
      </Head>
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#FBF1EE]">

          <div className="flex-shrink-0">
            <AppSidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Top Navigation (for mobile) */}
            <header className="lg:hidden p-4 border-b border-[#e4d3d5] bg-white flex items-center justify-between">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-4 ml-auto">
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>
            
            {/* Content */}
            <main 
              className="flex-1 overflow-y-auto transition-all duration-300" 
              style={{ 
                backgroundColor: '#FBF1EE',
                padding: '1rem',
                marginLeft: '0' 
              }}
            >
              <div className="mx-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px]">
                <WelcomeContainer />
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}

export default DashboardLayout