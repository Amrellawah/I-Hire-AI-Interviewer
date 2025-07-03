"use client"
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/utils/Constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Menu, Home, Settings, User, Bell, HelpCircle } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function AppSidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname()
  const { user } = useUser()
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const sidebarRef = useRef(null)

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  const renderSidebarContent = () => (
    <>
      {/* Header with Logo and Collapse Button */}
      <SidebarHeader className="p-4 border-b border-[#e4d3d5] flex items-center justify-between">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="transition-all duration-300 w-14 h-14">
              <Image 
                src={'/logo.png'} 
                width={56} 
                height={56} 
                alt='Company Logo'
                className="group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent">
              I-Hire
            </span>
          </Link>
        ) : (
          <div className="w-full flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" className="transition-all duration-300 w-14 h-14">
                    <Image 
                      src={'/logo.png'} 
                      width={56} 
                      height={56} 
                      alt='Company Logo'
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Go to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-8 w-8"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isCollapsed ? "Expand" : "Collapse"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup className="p-4">
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((option, index) => {
              const isActive = pathname === option.path || 
                (option.subPaths && option.subPaths.some(path => pathname.startsWith(path)))
              
              const Icon = option.icon
              const hasNotification = option.notificationCount && option.notificationCount > 0
              
              return (
                <SidebarMenuItem key={index}>
                  {isCollapsed ? (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton 
                            asChild
                            className={`p-3 rounded-lg transition-all justify-center ${
                              isActive 
                                ? 'bg-[#f1e9ea] text-[#be3144] font-medium shadow-sm'
                                : 'hover:bg-[#f1e9ea]/50 text-[#191011]'
                            }`}
                          >
                            <Link 
                              href={option.path} 
                              className="flex items-center relative"
                              onClick={() => isMobile && setMobileOpen(false)}
                            >
                              <div className={`p-2 rounded-md relative ${
                                isActive 
                                  ? 'bg-[#be3144] text-white'
                                  : 'bg-[#f1e9ea] text-[#8e575f]'
                              }`}>
                                <Icon className="w-5 h-5" />
                                {hasNotification && (
                                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-white"></span>
                                )}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{option.name}</p>
                          {hasNotification && (
                            <p className="text-xs text-muted-foreground">
                              {option.notificationCount} new notifications
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      className={`p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-[#f1e9ea] text-[#be3144] font-medium shadow-sm'
                          : 'hover:bg-[#f1e9ea]/50 text-[#191011]'
                      }`}
                    >
                      <Link 
                        href={option.path} 
                        className="flex items-center gap-3"
                        onClick={() => isMobile && setMobileOpen(false)}
                      >
                        <div className={`p-2 rounded-md relative ${
                          isActive 
                            ? 'bg-[#be3144] text-white'
                            : 'bg-[#f1e9ea] text-[#8e575f]'
                        }`}>
                          <Icon className="w-5 h-5" />
                          {hasNotification && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-white"></span>
                          )}
                        </div>
                        <span>{option.name}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-[#be3144] rounded-full" />
                        )}
                        {hasNotification && !isActive && (
                          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center">
                            {option.notificationCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>


      {/* User Profile Footer */}
      <SidebarFooter className="p-4 border-t border-[#e4d3d5]">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-4">
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
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#191011] truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-sm text-[#8e575f] truncate">
                {user?.primaryEmailAddress?.emailAddress || 'email@example.com'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </SidebarFooter>
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation menu for the dashboard.</SheetDescription>
            </SheetHeader>
            <div
              ref={sidebarRef}
              className="h-full border-r border-[#e4d3d5] bg-white"
            >
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          className={`fixed top-0 left-0 z-30 h-screen border-r border-[#e4d3d5] bg-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
          {renderSidebarContent()}
        </Sidebar>
      </div>
    </>
  )
}
