"use client"
import React, { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import Head from 'next/head'
import { UserButton } from '@clerk/nextjs'
import WelcomeContainer from './_components/WelcomeContainer'
import { usePathname } from 'next/navigation'

function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname();
  return (
    <>
      <Head>
        <title>I-Hire Dashboard</title>
        <meta name="description" content="AI-powered interview platform" />
      </Head>
      
      <SidebarProvider>
        <div className="min-h-screen w-full bg-[#FBF1EE] relative">
          {/* Sidebar - fixed on desktop */}
          <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          {/* Main Content Area */}
          <div
            className={
              `flex flex-col min-h-screen transition-all duration-300 lg:pl-0 ` +
              (isCollapsed
                ? 'md:ml-20'
                : 'md:ml-64')
            }
            style={{ minWidth: 0 }}
          >
            {/* Top Navigation (for mobile) */}
            <header className="lg:hidden p-4 border-b border-[#e4d3d5] bg-white flex items-center justify-end">
              <UserButton afterSignOutUrl="/" />
            </header>
            
            {/* Content */}
            <main 
              className="flex-1 overflow-y-auto transition-all duration-300" 
              style={{ 
                backgroundColor: '#FBF1EE',
                padding: '1rem',
                marginLeft: 0 
              }}
            >
              <div className="mx-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px]">
                {/* Removed duplicated WelcomeContainer */}
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