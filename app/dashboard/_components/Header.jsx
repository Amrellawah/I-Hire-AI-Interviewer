"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

function Header() {
    const path = usePathname();
    const [scrolled, setScrolled] = useState(false)
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { user, isLoaded } = useUser();

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

    // Close mobile nav on route change
    useEffect(() => {
        setMobileNavOpen(false);
    }, [path]);

    return (
      <div className="pt-[70px] ">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4 shadow-sm'} border-b border-[#f1e9ea] bg-[#FBF1EE]`}>
          <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-auto">
            {/* Logo and brand */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className={`transition-all duration-300 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center overflow-hidden`}> 
                <Image 
                  src={'/logo.png'} 
                  width={40} 
                  height={40} 
                  alt='logo'
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300">I-Hire</span>
            </Link>

            {/* Desktop navigation links - centered */}
            <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
              <Link href="/features" className={`font-medium transition-colors duration-300 hover:text-[#be3144] ${path === '/features' ? 'text-[#be3144]' : 'text-gray-700'}`}>Features</Link>
              <Link href="/about" className={`font-medium transition-colors duration-300 hover:text-[#be3144] ${path === '/about' ? 'text-[#be3144]' : 'text-gray-700'}`}>About</Link>
              <Link href="/interviews" className={`font-medium transition-colors duration-300 hover:text-[#be3144] ${path === '/interviews' ? 'text-[#be3144]' : 'text-gray-700'}`}>Interviews</Link>
            </nav>

            {/* Desktop: User Button always right; Mobile: Hamburger right, hide avatar */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Hamburger for mobile */}
              <button
                className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Open navigation menu"
              >
                <Menu className="w-7 h-7 text-[#be3144]" />
              </button>
              {/* User Button: only show on desktop */}
              <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-2">
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
          </div>
          {/* Mobile Navigation Drawer */}
          {mobileNavOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              />
              {/* Slide-in menu: enhanced UI */}
              <div className="fixed top-0 right-0 h-full w-1/2 max-w-xs bg-gradient-to-b from-[#fff8f6] via-[#fbf9f9] to-[#f1e9ea] shadow-2xl z-50 rounded-l-2xl animate-slide-in-right flex flex-col items-center pt-8 pb-10 px-6 md:hidden">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 text-[#be3144] hover:text-[#f05941] text-3xl font-bold focus:outline-none p-2 rounded-full bg-white/70 shadow-md"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                  style={{lineHeight: 1}}
                >
                  &times;
                </button>
                {/* User avatar with shadow */}
                <div className="shadow-lg rounded-full mb-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-20 h-20 mx-auto mb-0",
                        userButtonPopoverCard: "shadow-lg border border-gray-200",
                        userPreviewAvatarBox: "w-20 h-20"
                      }
                    }}
                  />
                </div>
                {/* Welcome message or user name */}
                <div className="text-[#be3144] font-semibold text-sm mb-3 mt-2">
                  {isLoaded && user ? `Welcome, ${
                    (user.fullName && user.fullName.split(' ')[0]) ||
                    (user.username && user.username.split(' ')[0]) ||
                    (user.primaryEmailAddress?.emailAddress && user.primaryEmailAddress.emailAddress.split('@')[0]) ||
                    'User'
                  }!` : 'Welcome!'}
                </div>
                <div className="w-full border-b border-[#f1e9ea] my-4"></div>
                <nav className="flex flex-col items-center gap-6 w-full mt-2">
                  <Link href="/features" className={`w-full text-center font-semibold text-base py-2 rounded-lg transition-all duration-200 hover:bg-[#f1e9ea] active:bg-[#f05941]/10 hover:text-[#be3144] focus:bg-[#f1e9ea] focus:text-[#be3144] ${path === '/features' ? 'text-[#be3144] bg-[#f1e9ea]' : 'text-gray-700'}`}>Features</Link>
                  <Link href="/about" className={`w-full text-center font-semibold text-base py-2 rounded-lg transition-all duration-200 hover:bg-[#f1e9ea] active:bg-[#f05941]/10 hover:text-[#be3144] focus:bg-[#f1e9ea] focus:text-[#be3144] ${path === '/about' ? 'text-[#be3144] bg-[#f1e9ea]' : 'text-gray-700'}`}>About</Link>
                  <Link href="/interviews" className={`w-full text-center font-semibold text-base py-2 rounded-lg transition-all duration-200 hover:bg-[#f1e9ea] active:bg-[#f05941]/10 hover:text-[#be3144] focus:bg-[#f1e9ea] focus:text-[#be3144] ${path === '/interviews' ? 'text-[#be3144] bg-[#f1e9ea]' : 'text-gray-700'}`}>Interviews</Link>
                </nav>
                <div className="flex-1" />
                {/* Footer */}
                <div className="text-xs text-[#be3144] opacity-70 mt-8">&copy; {new Date().getFullYear()} I-Hire</div>
              </div>
            </>
          )}
        </header>
      </div>
    );
}

export default Header