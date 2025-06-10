import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="flex justify-center px-6 py-16 md:px-20 lg:py-24">
      <div className="flex w-full max-w-[1200px] flex-col">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Image */}
          <div className="group relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl md:min-w-[480px] lg:min-w-[560px]">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/sdxl10/9e8f0a7c-845c-4759-8876-1fd0ff02cc33.png")',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#be3144]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>

          {/* Text and Buttons */}
          <div className="flex flex-col justify-center gap-8 md:min-w-[400px]">
            <div className="text-left">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 w-6 bg-gradient-to-r from-[#be3144] to-[#f05941]"></div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#be3144]">
                  AI Recruitment
                </span>
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#191011] md:text-5xl lg:text-6xl">
                Elevate Your Hiring With{' '}
                <span className="bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent">
                  AI Interviewer
                </span>
              </h1>
              <h2 className="mt-4 text-lg font-normal leading-relaxed text-[#191011]/90 md:text-xl">
                Transform your recruitment process with our cutting-edge platform that helps you interview at scale, reduce unconscious bias, and make data-driven hiring decisions.
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/job-seeker">
                <button className="relative h-14 min-w-[160px] overflow-hidden rounded-xl bg-gradient-to-r from-[#be3144] to-[#f05941] px-6 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-[#f05941] hover:to-[#ff7b54] hover:shadow-xl md:h-16 md:min-w-[180px] md:text-lg">
                  <span className="relative z-10">I'm a Job Seeker</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#f05941] to-[#ff7b54] opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
                </button>
              </Link>

              <Link href="/employer">
                <button className="h-14 min-w-[160px] rounded-xl border-2 border-[#be3144]/30 bg-white px-6 text-base font-bold text-[#191011] shadow-md transition-all duration-300 hover:border-[#be3144]/50 hover:bg-[#f1e9ea] hover:shadow-lg md:h-16 md:min-w-[180px] md:text-lg">
                  I'm an Employer
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item}
                    className="h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                    style={{
                      backgroundImage: `url(https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item}.jpg)`,
                      backgroundSize: 'cover'
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-sm text-[#191011]/80">
                <span className="font-semibold text-[#be3144]">1000+</span> professionals hired this month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}