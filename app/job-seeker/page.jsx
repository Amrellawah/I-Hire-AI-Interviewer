"use client"
import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/utils/db';
import { MockInterview, callInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  WebcamIcon, Briefcase, Star, Lightbulb, Search, 
  ArrowRight, Building2, Code, Paintbrush, Database,
  ChevronRight, Loader2, BarChart2, Clock, User,
  Pencil, Book, PhoneCall, HelpCircle, Info, Handshake, Mail, Settings, LogOut, MessageCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CallInterviewCard from '../dashboard/_components/CallInterviewCard';
import Header from "../dashboard/_components/Header";
import Image from 'next/image';
import LatestJobsSection from './LatestJobsSection';
import JobRecommendations from './_components/JobRecommendations';
import UserAvatar from '@/components/UserAvatar';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  const { signOut } = useClerk();

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/user-profile?userId=${user.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setUserProfile(data))
        .catch(() => setUserProfile(null));
    }
  }, [isLoaded, user]);

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
      const callJobs = await db.select().from(callInterview).orderBy(desc(callInterview.createdAt));
      const callJobsWithType = callJobs.map(j => ({ ...j, _type: 'call', type: 'Call Interview', jobDescription: j.jobDescription }));
      const mockJobs = await db.select().from(MockInterview).where(eq(MockInterview.isHidden, false)).orderBy(desc(MockInterview.createdAt));
      const mockJobsWithType = mockJobs.map(j => ({ ...j, _type: 'mock', type: 'Video Interview', jobDescription: j.jobDesc }));
      setAllJobs([...callJobsWithType, ...mockJobsWithType]);
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
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] hover:border-[#be3144] transition-colors shadow-sm cursor-pointer"
                    onClick={() => setMenuOpen((open) => !open)}
                    style={{ cursor: 'pointer' }}
                  >
                    <UserAvatar 
                      profilePhoto={userProfile?.profilePhoto} 
                      userImageUrl={user.imageUrl} 
                      name={userProfile?.name || user.fullName} 
                      size={56} 
                    />
                  </div>
                  {completedInterviews > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#be3144] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
                      {completedInterviews}
                    </span>
                  )}
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#e4d3d5] z-50 overflow-hidden animate-fade-in"
                      style={{ minWidth: 280 }}
                    >
                      <div className="p-5 border-b border-[#f1e9ea] flex items-center gap-4 bg-[#f9f6f6]">
                        <UserAvatar 
                          profilePhoto={userProfile?.profilePhoto} 
                          userImageUrl={user.imageUrl} 
                          name={userProfile?.name || user.fullName} 
                          size={56} 
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="font-bold text-[#191011] truncate">{user.fullName || 'User'}</div>
                          <div className="text-xs text-[#8e575f] truncate">{user.primaryEmailAddress?.emailAddress || 'email@example.com'}</div>
                          <a
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              setMenuOpen(false);
                              router.push('/job-seeker/profile');
                            }}
                            className="text-xs text-[#be3144] hover:underline mt-1"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                      <div className="flex flex-col divide-y divide-[#f1e9ea]">
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Pencil className="w-5 h-5 text-[#191011]" /> Edit Profile
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Book className="w-5 h-5 text-[#191011]" /> Career Readings
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <PhoneCall className="w-5 h-5 text-[#191011]" /> Help Center
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Info className="w-5 h-5 text-[#191011]" /> About Us
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Handshake className="w-5 h-5 text-[#191011]" /> Become A Partner
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Mail className="w-5 h-5 text-[#191011]" /> Contact Us
                        </a>
                        <a 
                          href="#" 
                          onClick={e => {
                            e.preventDefault();
                            setMenuOpen(false);
                            router.push('/job-seeker/chat');
                          }}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium"
                        >
                          <MessageCircle className="w-5 h-5 text-[#191011]" /> Chat
                        </a>
                      </div>
                      <div className="border-t border-[#f1e9ea] flex flex-col">
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Settings className="w-5 h-5 text-[#191011]" /> Account Settings
                        </a>
                        <a href="#" onClick={e => { e.preventDefault(); signOut(); }} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f9eaea] transition-colors text-[#be3144] text-base font-semibold">
                          <LogOut className="w-5 h-5 text-[#be3144]" /> Logout
                        </a>
                      </div>
                    </div>
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

        {/* Job Recommendations Section */}
        <section className="mb-10">
          <JobRecommendations />
        </section>

        <LatestJobsSection allJobs={allJobs} loadingJobs={loadingJobs} />
      </main>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#191011] via-[#23202b] to-[#2B2D42] text-white pt-14 pb-8 px-4 border-t-4 border-[#be3144] mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-8">
          {/* Logo and brand */}
          <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <Image src="/logo.png" width={56} height={56} alt="I-Hire Logo" className="drop-shadow-lg" />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-[#fff] to-[#f1e9ea] bg-clip-text text-transparent tracking-wide">I-Hire</span>
            </div>
            <p className="text-[#f1e9ea] text-base font-medium max-w-xs text-center md:text-left mb-2">Connecting talented professionals with top employers across the MENA region.</p>
            <span className="inline-block bg-[#be3144] text-white text-xs font-semibold px-3 py-1 rounded-full mt-2 shadow">Empowering Your Career Journey</span>
          </div>
          {/* Links */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#be3144]">For Job Seekers</h4>
              <ul className="space-y-2 text-[#f1e9ea] text-sm">
                <li><Link href="/job-seeker/jobs" className="hover:text-[#be3144] transition-colors">Browse Jobs</Link></li>
                <li><Link href="/job-seeker/applications" className="hover:text-[#be3144] transition-colors">My Applications</Link></li>
                <li><Link href="/job-seeker/profile" className="hover:text-[#be3144] transition-colors">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#be3144]">Company</h4>
              <ul className="space-y-2 text-[#f1e9ea] text-sm">
                <li><Link href="/about" className="hover:text-[#be3144] transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#be3144] transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-[#be3144] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1 w-full flex flex-col items-center mt-8 lg:mt-0">
              <h4 className="font-bold text-lg mb-4 text-[#be3144] text-center">Connect With Us</h4>
              <div className="w-full flex justify-center items-center gap-4 mb-4">
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </Link>
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" />
                    <circle cx="12" cy="12" r="5" stroke="currentColor" />
                    <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                  </svg>
                </Link>
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
              </div>
              <p className="text-[#f1e9ea] text-xs text-center">© {new Date().getFullYear()} <span className="font-bold text-[#be3144]">I-Hire</span>. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
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