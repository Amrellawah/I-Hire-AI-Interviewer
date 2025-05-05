'use client'; // Add this directive at the top
export default function WhyAISection() {
  return (
    <div className="px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-8 bg-gradient-to-b from-[#f05941] to-[#be3144] rounded-full"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941] font-semibold text-sm uppercase tracking-wider">
              Revolutionizing Hiring
            </span>
          </div>
          
          <div className="flex flex-col @[768px]:flex-row @[768px]:items-end @[768px]:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-[#191011] text-4xl font-bold leading-tight @[480px]:text-5xl @[480px]:leading-[1.2] max-w-[720px]">
                Smarter Hiring with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">AI Interviewer</span>
              </h1>
              <p className="text-[#191011]/90 text-lg font-normal leading-relaxed max-w-[720px] mt-4">
                Transform your recruitment process with our cutting-edge AI platform.
              </p>
            </div>
            
            <button className="relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-gradient-to-r from-[#be3144] to-[#f05941] text-white text-base font-bold leading-normal tracking-[0.015em] w-fit hover:from-[#f05941] hover:to-[#ff7b54] transition-all duration-300 group">
              <span className="relative z-10 truncate flex items-center">
                Get started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#f05941] to-[#ff7b54] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                      stroke="#be3144"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "80% Faster Screening",
                description: "Reduce time-to-hire with instant candidate evaluation and ranking."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      stroke="#be3144"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Bias-Free Evaluation",
                description: "Objective assessments that focus solely on candidate qualifications."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      stroke="#be3144"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Candidate Experience",
                description: "Consistent, professional interviews that impress top talent."
              },
              {
                icon: (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke="#be3144"
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                ),
                title: "Data-Driven Insights",
                description: "Comprehensive analytics to optimize your hiring strategy."
              },
              {
                icon: (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke="#be3144"
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                ),
                title: "Secure Platform",
                description: "Enterprise-grade security for your sensitive hiring data."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[300px] @[480px]:w-[350px] flex flex-col gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#be3144]/10 to-[#f05941]/10 group-hover:from-[#be3144]/20 group-hover:to-[#f05941]/20 transition-all duration-300">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#191011] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#be3144] to-[#f05941] transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-[#191011]/80 group-hover:text-[#191011]/90 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Gradient fade effect on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
      
      {/* Custom scrollbar hide (add to your global CSS) */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}