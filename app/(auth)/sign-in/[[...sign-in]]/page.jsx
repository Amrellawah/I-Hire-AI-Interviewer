import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf9f9] via-[#fff8f6] to-[#f1e9ea]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-[#f1e9ea] sticky top-0 z-40">
        <div className="px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo.png" 
                width={40} 
                height={40} 
                alt="I-Hire Logo"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent">
              I-Hire
            </span>
          </Link>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#be3144]/90 to-[#f05941]/90"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")'
            }}
          ></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <div className="max-w-md">
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Image 
                      src="/logo.png" 
                      width={32} 
                      height={32} 
                      alt="I-Hire Logo"
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-2xl">I-Hire</span>
                </Link>
              </div>

              <h1 className="text-4xl font-black leading-tight mb-6">
                Welcome Back to{' '}
                <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  I-Hire
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-white/90 mb-8">
                Continue your journey with AI-powered interview preparation. Access your personalized dashboard and track your progress.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">AI-powered interview feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Real-time performance analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
                  </div>
                  <span className="text-white/90">Personalized job recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-12 lg:py-16">
          <div className="w-full max-w-md">
            {/* Mobile Hero Section */}
            <div className="lg:hidden text-center mb-8">
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      width={32} 
                      height={32} 
                      alt="I-Hire Logo"
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent">
                    I-Hire
                  </span>
                </Link>
              </div>
              
              <h1 className="text-3xl font-black leading-tight text-[#191011] mb-4">
                Welcome Back
              </h1>
              
              <p className="text-[#191011]/70 leading-relaxed">
                Sign in to continue your AI-powered interview journey
        </p>
      </div>

            {/* Sign In Form */}
            <div>
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent",
                    headerTitle: "text-2xl font-bold text-[#191011] mb-2",
                    headerSubtitle: "text-[#191011]/70 mb-6",
                    formButtonPrimary: "bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl",
                    formFieldInput: "w-full px-4 py-3 border border-[#f1e9ea] rounded-xl focus:ring-2 focus:ring-[#be3144]/20 focus:border-[#be3144] transition-all duration-300 bg-white/50 backdrop-blur-sm",
                    formFieldLabel: "text-[#191011] font-medium mb-2",
                    footerActionLink: "text-[#be3144] hover:text-[#f05941] font-medium transition-colors duration-300",
                    dividerLine: "bg-[#f1e9ea]",
                    dividerText: "text-[#191011]/60 bg-white/80 px-4",
                    socialButtonsBlockButton: "border border-[#f1e9ea] bg-white/50 hover:bg-white/80 text-[#191011] font-medium transition-all duration-300 rounded-xl",
                    formFieldLabelRow: "mb-2",
                    formFieldRow: "mb-4",
                    formButtonPrimary__loading: "opacity-75 cursor-not-allowed",
                    formButtonPrimary__disabled: "opacity-75 cursor-not-allowed"
                  }
                }}
              />
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden text-center mt-8">
              <p className="text-[#191011]/60 text-sm">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-[#be3144] hover:text-[#f05941] font-medium transition-colors duration-300">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  </div>
  ) 
}

