"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function InterviewHeader() {
    const path = usePathname();
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        console.log(path)
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <div className="pt-[70px] ">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4 shadow-sm'}`} 
                style={{ backgroundColor: '#FBF1EE' }}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 group">
                    {/* Logo with hover effect */}
                    <div className={`transition-all duration-300 ${scrolled ? 'w-12 h-12' : 'w-14 h-14'}`}>
                        <Image 
                            src={'/logo.png'} 
                            width={scrolled ? 48 : 56} 
                            height={scrolled ? 48 : 56} 
                            alt='logo'
                            className="group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    
                    {/* Company Name with hover effect */}
                    <span className={`text-xl font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-2xl' : 'text-3xl'}`}>
                        I-Hire
                    </span>
                </Link>

                {/* User Button with better styling */}
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
            </div>
        </header>
        </div>

    )
}

export default InterviewHeader