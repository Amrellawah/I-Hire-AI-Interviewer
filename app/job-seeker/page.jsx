"use client"
import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/utils/db';
import { MockInterview, callInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  WebcamIcon, Briefcase, Star, Lightbulb, Search, 
  ArrowRight, Building2, Code, Paintbrush, Database,
  ChevronRight, Loader2, BarChart2, Clock, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CallInterviewCard from '../dashboard/_components/CallInterviewCard';
import Header from "../dashboard/_components/Header";
import Image from 'next/image';

export default function JobSeekerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [interviewList, setInterviewList] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Enhanced job categories with more details
  const jobCategories = [
    {
      icon: <Code className="w-6 h-6 text-[#be3144]" />,
      title: "Software Engineer",
      description: "Build and maintain software systems",
      searchTerm: "software engineer",
      avgSalary: "$110,000",
      growth: "22% (Much faster than average)"
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#be3144]" />,
      title: "Product Manager",
      description: "Lead product development",
      searchTerm: "product manager",
      avgSalary: "$105,000",
      growth: "10% (Faster than average)"
    },
    {
      icon: <Paintbrush className="w-6 h-6 text-[#be3144]" />,
      title: "UX Designer",
      description: "Create user experiences",
      searchTerm: "ux designer",
      avgSalary: "$95,000",
      growth: "13% (Faster than average)"
    },
    {
      icon: <Database className="w-6 h-6 text-[#be3144]" />,
      title: "Data Scientist",
      description: "Analyze complex data",
      searchTerm: "data scientist",
      avgSalary: "$120,000",
      growth: "36% (Much faster than average)"
    },
  ];

  useEffect(() => {
    if (isLoaded && user) {
      fetchInterviews();
    }
    if (isLoaded) {
      fetchAllJobs();
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchInterviews = async () => {
    try {
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

  const fetchAllJobs = async () => {
    try {
      const jobs = await db.select().from(callInterview).orderBy(desc(callInterview.createdAt));
      setAllJobs(jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleCategorySelect = (searchTerm) => {
    router.push(`/jobs?search=${encodeURIComponent(searchTerm)}`);
  };

  // Calculate interview stats
  const completedInterviews = interviewList.length;
  const avgRating = interviewList.reduce((acc, curr) => acc + (curr.rating || 0), 0) / completedInterviews || 0;
  const lastInterviewDate = interviewList[0]?.createdAt;

  // User-friendly job card for job seekers
  function JobSeekerJobCard({ job }) {
    const router = useRouter();
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] flex items-center justify-center text-white font-bold text-lg">
              {job.jobPosition?.charAt(0) || 'J'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#191011] mb-0.5">{job.jobPosition}</h3>
              <span className="text-xs text-[#8e575f]">{job.recruiterName || 'Employer'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1e9ea] text-xs text-[#be3144] font-medium">
              {job.type || 'Interview'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1e9ea] text-xs text-[#be3144] font-medium">
              {job.duration || 'N/A'}
            </span>
          </div>
          <p className="text-sm text-[#191011] mb-4 line-clamp-3 min-h-[48px]">{job.jobDescription || 'No description provided.'}</p>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            className="w-full bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white"
            onClick={() => router.push(`/job-seeker/job/${job.job_id}`)}
          >
            View Details
          </Button>
          <Button
            className="w-full border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea]"
            variant="outline"
            onClick={() => router.push(`/job-seeker/Call-Interview/${job.job_id}`)}
          >
            Start Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Job Seeker Header matching main site style */}
      <div className="pt-[70px]">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4 shadow-sm'}`} style={{ backgroundColor: '#FBF1EE' }}>
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
              {/* Gradient company name */}
              <span className={`text-xl font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-2xl' : 'text-3xl'}`}>I-Hire</span>
            </Link>
            {/* Job seeker actions */}
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="hidden md:flex items-center gap-2 border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea] transition-colors"
                onClick={() => router.push('/job-seeker/Upload-CV')}
              >
                <span>Upload CV</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              {isLoaded && user && (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] hover:border-[#be3144] transition-colors shadow-sm">
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {completedInterviews > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#be3144] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {completedInterviews}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-12 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#be3144]/90 to-[#f05941]/80 z-10"></div>
          <img 
            src="https://cdn.usegalileo.ai/sdxl10/0c18fe0e-67c2-4596-af2f-86cd7bf4ac88.png" 
            alt="Career growth" 
            className="w-full h-96 object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Land Your <span className="text-[#ffd700]">Dream Job</span> with AI Coaching
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Practice interviews, get personalized feedback, and stand out from the competition with our AI-powered platform
              </p>
              
              <form className="w-full" onSubmit={e => { e.preventDefault(); router.push('/job-seeker/jobs'); }}>
                <div className="relative flex shadow-lg rounded-lg overflow-hidden">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8e575f]" />
                  <input
                    type="text"
                    placeholder="Search for jobs (e.g. 'Frontend Developer')"
                    className="w-full pl-12 pr-4 py-4 focus:outline-none text-[#191011] min-h-[56px] text-base"
                    disabled
                  />
                  <Button 
                    type="submit"
                    className="rounded-none px-8 min-h-[56px] h-full text-base font-semibold bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all flex items-center justify-center"
                  >
                    Find Jobs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* User Stats Section */}
        {completedInterviews > 0 && (
          <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e4d3d5]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f1e9ea] rounded-lg">
                  <User className="w-5 h-5 text-[#be3144]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e575f]">Completed</p>
                  <p className="text-xl font-bold text-[#191011]">{completedInterviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e4d3d5]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f1e9ea] rounded-lg">
                  <Star className="w-5 h-5 text-[#be3144] fill-yellow-400/80" />
                </div>
                <div>
                  <p className="text-sm text-[#8e575f]">Avg. Rating</p>
                  <p className="text-xl font-bold text-[#191011]">{avgRating.toFixed(1)}/5</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e4d3d5]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f1e9ea] rounded-lg">
                  <Clock className="w-5 h-5 text-[#be3144]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e575f]">Last Practice</p>
                  <p className="text-xl font-bold text-[#191011]">
                    {lastInterviewDate ? new Date(lastInterviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e4d3d5]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f1e9ea] rounded-lg">
                  <BarChart2 className="w-5 h-5 text-[#be3144]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e575f]">Progress</p>
                  <p className="text-xl font-bold text-[#191011]">
                    {Math.min(completedInterviews * 10, 100)}%
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Job Categories */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#191011]">Explore Job Categories</h2>
            <p className="text-[#8e575f]">Click to search for jobs in each category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-[#e4d3d5] hover:border-[#be3144] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleCategorySelect(category.searchTerm)}
              >
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-[#f1e9ea] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#be3144]/10 transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-[#191011] mb-1 group-hover:text-[#be3144] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#8e575f] mb-3 flex-grow">
                    {category.description}
                  </p>
                  <div className="pt-3 border-t border-[#e4d3d5]">
                    <div className="flex justify-between text-xs text-[#8e575f]">
                      <span>Avg. Salary:</span>
                      <span className="font-medium">{category.avgSalary}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8e575f] mt-1">
                      <span>Job Growth:</span>
                      <span className="font-medium">{category.growth}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Interview Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#191011]">Your Interview History</h2>
              <p className="text-[#8e575f]">
                {completedInterviews > 0 
                  ? `You've completed ${completedInterviews} interview${completedInterviews !== 1 ? 's' : ''}`
                  : "Start practicing to see your history here"}
              </p>
            </div>
            <Link href="/dashboard/interview/new">
              <Button className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all shadow-md">
                Start New Interview
              </Button>
            </Link>
          </div>

          {loadingInterviews ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-[#be3144]" />
            </div>
          ) : interviewList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interviewList.slice(0, 4).map((interview) => (
                  <div 
                    key={interview.mockId} 
                    className="bg-white border border-[#e4d3d5] rounded-xl p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#191011] mb-1 group-hover:text-[#be3144] transition-colors">
                          {interview.jobPosition}
                        </h3>
                        <p className="text-sm text-[#8e575f]">
                          {new Date(interview.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f1e9ea] px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">
                          {interview.rating ? `${interview.rating}/5` : 'Not rated'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm text-[#8e575f]">
                      <Briefcase className="w-4 h-4" />
                      <span>{interview.jobExperience} years experience</span>
                    </div>
                    
                    <p className="text-[#191011] mb-6 line-clamp-2">
                      {interview.jobDesc || "No description provided"}
                    </p>
                    
                    <Link 
                      href={`/dashboard/interview/${interview.mockId}`}
                      className="inline-flex items-center text-sm font-medium text-[#be3144] hover:text-[#a82a3d] transition-colors group-hover:underline"
                    >
                      View Details
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
              {interviewList.length > 4 && (
                <div className="mt-8 text-center">
                  <Link 
                    href="/dashboard/interviews"
                    className="inline-flex items-center text-[#be3144] hover:text-[#a82a3d] font-medium transition-colors group"
                  >
                    View all {interviewList.length} interviews
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#e4d3d5] rounded-xl p-12 text-center">
              <WebcamIcon className="mx-auto w-12 h-12 text-[#8e575f] mb-4" />
              <h3 className="text-xl font-medium text-[#191011] mb-2">
                No interviews yet
              </h3>
              <p className="text-[#8e575f] mb-6 max-w-md mx-auto">
                Get started by practicing with our AI interviewer to improve your skills
              </p>
              <Link href="/dashboard/interview/new">
                <Button className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all">
                  Start Practice Interview
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}