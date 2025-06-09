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
import LatestJobsSection from './LatestJobsSection';

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

  // Use the same jobCategories as in the jobs page for consistency
  const jobCategories = [
    { title: 'Accounting/Finance', icon: <Database className="w-6 h-6 text-[#be3144]" />, description: 'Manage financial accounts and records.' },
    { title: 'Administration', icon: <Building2 className="w-6 h-6 text-[#be3144]" />, description: 'Oversee office operations and support.' },
    { title: 'Banking', icon: <Briefcase className="w-6 h-6 text-[#be3144]" />, description: 'Work in financial institutions and services.' },
    { title: 'IT/Software Development', icon: <Code className="w-6 h-6 text-[#be3144]" />, description: 'Develop and maintain software systems.' },
    { title: 'Marketing/PR/Advertising', icon: <Lightbulb className="w-6 h-6 text-[#be3144]" />, description: 'Promote brands and manage public relations.' },
    { title: 'Human Resources', icon: <User className="w-6 h-6 text-[#be3144]" />, description: 'Manage recruitment and employee relations.' },
    { title: 'Customer Service/Support', icon: <Star className="w-6 h-6 text-[#be3144]" />, description: 'Assist and support customers.' },
    { title: 'Other', icon: <Database className="w-6 h-6 text-[#be3144]" />, description: 'Explore more categories.' },
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

  const handleCategorySelect = (categoryTitle) => {
    router.push(`/job-seeker/jobs?category=${encodeURIComponent(categoryTitle)}`);
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
              {/* Desktop Upload CV button */}
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
        {/* Mobile Upload CV button */}
        <div className="block md:hidden mb-8 px-2">
          <Button
            className="w-full py-4 text-lg font-bold rounded-2xl shadow-lg bg-gradient-to-r from-[#be3144] to-[#f05941] text-white flex items-center justify-center gap-3 transition-all duration-200 active:scale-95"
            onClick={() => router.push('/job-seeker/Upload-CV')}
            style={{ minHeight: 56 }}
          >
            <span>Upload CV</span>
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
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
              
              <form className="w-full" onSubmit={e => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/job-seeker/jobs?search=${encodeURIComponent(searchQuery)}`); } else { router.push('/job-seeker/jobs'); } }}>
                <div className="relative flex shadow-lg rounded-lg overflow-hidden">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8e575f]" />
                  <input
                    type="text"
                    placeholder="Search for jobs (e.g. 'Frontend Developer')"
                    className="w-full pl-12 pr-4 py-4 focus:outline-none text-[#191011] min-h-[56px] text-base"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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
        <section className="mb-10 bg-[#f9f6f6] border border-[#f1e9ea] rounded-2xl px-2 py-6 md:p-8 shadow-sm">
          <div className="mb-6 px-2 md:px-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-8 h-2 rounded bg-gradient-to-r from-[#be3144] to-[#f05941] mr-2"></span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#191011]">Explore Job Categories</h2>
            </div>
            <div className="h-1 w-24 bg-[#be3144] rounded"></div>
            <p className="text-[#8e575f] text-sm md:text-base mt-2">Click to search for jobs in each category</p>
          </div>
          <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 scrollbar-hide snap-x snap-mandatory px-1 md:px-0">
            {jobCategories.map((category, index) => (
              <div
                key={index}
                className="min-w-[80vw] max-w-[90vw] md:min-w-0 md:max-w-none bg-white p-5 md:p-6 rounded-2xl border border-[#e4d3d5] hover:border-[#be3144] hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full snap-center relative"
                onClick={() => handleCategorySelect(category.title)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 md:w-12 md:h-12 bg-[#f1e9ea] rounded-full flex items-center justify-center group-hover:bg-[#be3144]/10 transition-colors text-2xl md:text-xl">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-[#191011] text-lg md:text-xl group-hover:text-[#be3144] transition-colors flex-1 min-w-0 break-words line-clamp-2">
                    {category.title}
                  </h3>
                  <ChevronRight className="w-6 h-6 text-[#be3144] opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm md:text-base text-[#8e575f] mb-1 flex-grow">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <LatestJobsSection allJobs={allJobs} />
      </main>
    </div>
  );
}

// Helper function for time ago
function timeAgo(date) {
  const now = new Date();
  const posted = new Date(date);
  const diff = Math.floor((now - posted) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return posted.toLocaleDateString();
}