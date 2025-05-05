"use client"
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WebcamIcon, Briefcase, Star, Lightbulb } from 'lucide-react';

export default function JobSeekerPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [interviewList, setInterviewList] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);

  // Sample job categories data
  const jobCategories = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
        </svg>
      ),
      title: "Software Engineer",
      description: "Build and maintain software systems",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H80v32h96V48h24Z"></path>
        </svg>
      ),
      title: "Product Manager",
      description: "Lead product development",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M200,72H180V48a24,24,0,0,0-24-24H100A24,24,0,0,0,76,48V72H56A16,16,0,0,0,40,88V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A16,16,0,0,0,200,72ZM100,48h56V72H100ZM200,200H56V88H200V200Zm-36-68a36,36,0,1,1-36-36A36,36,0,0,1,164,132Zm-48,0a12,12,0,1,1,12,12A12,12,0,0,1,116,132Z"></path>
        </svg>
      ),
      title: "UX Designer",
      description: "Create user experiences",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,72H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8V72H96ZM216,200H40V88H216V200Zm-60-56a36,36,0,1,1-36-36A36,36,0,0,1,156,144Zm-16,0a20,20,0,1,0-20,20A20,20,0,0,0,140,144Z"></path>
        </svg>
      ),
      title: "Data Scientist",
      description: "Analyze complex data",
    },
  ];

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      setLoadingInterviews(true);
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.createdAt));
      
      setInterviewList(result);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoadingInterviews(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleJobSearch = (e) => {
    e.preventDefault();
    console.log("Searching for jobs:", jobSearchQuery);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fbf9f9] overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1e9ea] px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-[#191011]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#191011] text-lg font-bold leading-tight tracking-[-0.015em]">AI Interviewer</h2>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#8e575f] flex border-none bg-[#f1e9ea] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input 
                placeholder="Search" 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191011] focus:outline-0 focus:ring-0 border-none bg-[#f1e9ea] focus:border-none h-full placeholder:text-[#8e575f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <button 
            onClick={() => console.log("Navigate to employers page")}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f1e9ea] text-[#191011] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e4d3d5] transition-colors"
          >
            <span className="truncate">For employers</span>
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-[#bf3046] transition-all" style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/4ac9fb50-6ae0-44b6-994d-caf00c3bdb32.png")' }}></div>
        </div>
      </header>

      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="@container">
            <div className="@[480px]:p-4">
              <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/0c18fe0e-67c2-4596-af2f-86cd7bf4ac88.png")' }}>
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                    Welcome to AI Interviewer
                  </h1>
                  <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                    Get the job you want with AI guidance
                  </h2>
                </div>
                <form onSubmit={handleJobSearch} className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                    <div className="text-[#8e575f] flex border border-[#e4d3d5] bg-[#fbf9f9] items-center justify-center pl-[15px] rounded-l-xl border-r-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <input 
                      placeholder="Search for jobs" 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191011] focus:outline-0 focus:ring-0 border border-[#e4d3d5] bg-[#fbf9f9] focus:border-[#e4d3d5] h-full placeholder:text-[#8e575f] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal" 
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#e4d3d5] bg-[#fbf9f9] pr-[7px]">
                      <button 
                        type="submit"
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#bf3046] text-[#fbf9f9] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#a82a3d] transition-colors"
                      >
                        <span className="truncate">Recommendations</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <h2 className="text-[#191011] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular job categories</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {jobCategories.map((category, index) => (
              <div 
                key={index} 
                className="flex flex-1 gap-3 rounded-lg border border-[#e4d3d5] bg-[#fbf9f9] p-4 flex-col hover:border-[#bf3046] hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setJobSearchQuery(category.title);
                }}
              >
                <div className="text-[#191011]">{category.icon}</div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#191011] font-bold text-sm">{category.title}</h3>
                  <p className="text-[#8e575f] text-xs">{category.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interviews Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-[#191011] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                Your Recent Interviews
              </h2>
              <Link href="/dashboard/interview/new">
                <Button className="bg-[#bf3046] hover:bg-[#a82a3d] text-white">
                  Start New Interview
                </Button>
              </Link>
            </div>

            {loadingInterviews ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#bf3046]"></div>
              </div>
            ) : interviewList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                {interviewList.map((interview) => (
                  <div 
                    key={interview.mockId} 
                    className="border border-[#e4d3d5] rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-[#191011]">
                        {interview.jobPosition}
                      </h3>
                      <span className="text-sm text-[#8e575f]">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3 text-sm text-[#8e575f]">
                      <Briefcase className="h-4 w-4" />
                      <span>{interview.jobExperience} years experience</span>
                    </div>
                    
                    <p className="text-[#191011] mb-4 line-clamp-2">
                      {interview.jobDesc}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">Not rated yet</span>
                      </div>
                      <Link href={`/dashboard/interview/${interview.mockId}`}>
                        <Button variant="outline" className="border-[#bf3046] text-[#bf3046] hover:bg-[#f1e9ea]">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-[#e4d3d5] rounded-xl m-4 bg-white">
                <WebcamIcon className="mx-auto h-12 w-12 text-[#8e575f]" />
                <h3 className="mt-2 text-lg font-medium text-[#191011]">No interviews yet</h3>
                <p className="mt-1 text-sm text-[#8e575f]">
                  Get started by creating your first mock interview
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/interview/new">
                    <Button className="bg-[#bf3046] hover:bg-[#a82a3d] text-white">
                      Start Practice Interview
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}