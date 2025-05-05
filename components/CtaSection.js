import InteractiveCtaSection from './InteractiveCtaSection';

export default function CtaSection() {
  return (
    <div className="@container">
      <div className="@[480px]:p-6">
        <InteractiveCtaSection>
          <div className="flex flex-col gap-4 text-left max-w-2xl">
            <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:leading-tight drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-500 group-hover:-translate-y-1">
              Transform Your Hiring Process with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b54] to-[#f05941]">
                AI
              </span>
            </h1>
            <div className="w-16 h-1.5 bg-gradient-to-r from-[#be3144] to-[#f05941] mb-3 group-hover:w-24 transition-all duration-700 group-hover:bg-gradient-to-r group-hover:from-[#f05941] group-hover:to-[#ff7b54]"></div>
            <h2 className="text-white/90 text-lg font-light leading-relaxed @[480px]:text-xl @[480px]:leading-relaxed drop-shadow-md group-hover:text-white transition-all duration-500 group-hover:translate-y-1">
              Experience the future of recruitment with our AI Interviewer platform. Get started with a free trial and discover how artificial intelligence can streamline your hiring workflow, reduce bias, and find the best candidates faster.
            </h2>
          </div>
          
          <div className="flex flex-col w-full gap-4 mt-8 @[480px]:flex-row @[480px]:gap-6 @[480px]:items-center">
            <button className="relative px-8 py-4 bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-medium rounded-xl shadow-xl hover:from-[#f05941] hover:to-[#ff7b54] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 transform overflow-hidden">
              <span className="relative z-10">Start Free Trial</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#f05941] to-[#ff7b54] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80 group-hover:text-white/90 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-sm text-white/80 font-medium italic group-hover:text-white/90 transition-all duration-500">
                No credit card required • 14-day free trial
              </div>
            </div>
          </div>
        </InteractiveCtaSection>
      </div>
    </div>
  );
}