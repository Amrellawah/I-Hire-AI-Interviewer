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
import { ChevronRight, ChevronLeft } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import Image from "next/image"

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Sidebar className={`border-r border-[#e4d3d5] bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Header with Logo and Collapse Button */}
      <SidebarHeader className="p-4 border-b border-[#e4d3d5] flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-4 group">
            {/* Logo with hover effect */}
            <div className="transition-all duration-300 w-14 h-14">
              <Image 
                src={'/logo.png'} 
                width={56} 
                height={56} 
                alt='logo'
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Company Name with hover effect */}
            <span className="text-xl font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300">
              I-Hire
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="transition-all duration-300 w-14 h-14">
              <Image 
                src={'/logo.png'} 
                width={56} 
                height={56} 
                alt='logo'
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup className="p-4">
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((option, index) => {
              const isActive = pathname === option.path || 
                (option.subPaths && option.subPaths.some(path => pathname.startsWith(path)))
              
              const Icon = option.icon
              
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild
                    className={`p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#f1e9ea] text-[#be3144] font-medium shadow-sm'
                        : 'hover:bg-[#f1e9ea]/50 text-[#191011]'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Link 
                      href={option.path} 
                      className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <div className={`p-2 rounded-md ${
                        isActive 
                          ? 'bg-[#be3144] text-white'
                          : 'bg-[#f1e9ea] text-[#8e575f]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isCollapsed && (
                        <>
                          <span>{option.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-[#be3144] rounded-full" />
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
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
            <>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#191011] truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-sm text-[#8e575f] truncate">
                  {user?.primaryEmailAddress?.emailAddress || 'email@example.com'}
                </p>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}
