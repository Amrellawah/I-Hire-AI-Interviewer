"use client";
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { db } from '@/utils/db';
import { callInterview, MockInterview } from '@/utils/schema';
import { desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, ArrowLeft, ChevronRight, Search, Filter, X, User, Pencil, Book, PhoneCall, Info, Handshake, Mail, Settings, LogOut } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

// Job categories (full list for filter)
const jobCategories = [
  { title: 'Accounting/Finance' },
  { title: 'Administration' },
  { title: 'Banking' },
  { title: 'R&D/Science' },
  { title: 'Engineering - Construction/Civil/Architecture' },
  { title: 'Business Development' },
  { title: 'Creative/Design/Art' },
  { title: 'Customer Service/Support' },
  { title: 'Writing/Editorial' },
  { title: 'Hospitality/Hotels/Food Services' },
  { title: 'Human Resources' },
  { title: 'Installation/Maintenance/Repair' },
  { title: 'IT/Software Development' },
  { title: 'Legal' },
  { title: 'Logistics/Supply Chain' },
  { title: 'Operations/Management' },
  { title: 'Manufacturing/Production' },
  { title: 'Marketing/PR/Advertising' },
  { title: 'Medical/Healthcare' },
  { title: 'Other' },
  { title: 'Project/Program Management' },
  { title: 'Quality' },
  { title: 'Analyst/Research' },
  { title: 'Sales/Retail' },
  { title: 'Media/Journalism/Publishing' },
  { title: 'Sports and Leisure' },
  { title: 'Fashion' },
  { title: 'Pharmaceutical' },
  { title: 'Tourism/Travel' },
  { title: 'Purchasing/Procurement' },
  { title: 'Strategy/Consulting' },
  { title: 'C-Level Executive/GM/Director' },
];

const interviewTypes = [
  { label: 'All Types', value: 'all' },
  { label: 'Call Interview', value: 'Call Interview' },
  { label: 'Video Interview', value: 'Video Interview' },
];

// User-friendly job card for job seekers
function JobSeekerJobCard({ job }) {
  const router = useRouter();
  const handleViewDetails = () => {
    if (job._type === 'call') {
      router.push(`/job-seeker/job/call/${job.job_id}`);
    } else {
      router.push(`/job-seeker/job/mock/${job.mockId}`);
    }
  };

  return (
    <div className="relative group p-0 rounded-2xl overflow-hidden shadow-lg border border-[#f1e9ea] bg-white hover:shadow-xl hover:border-[#be3144]/50 transition-all duration-200 hover:scale-[1.01] flex flex-col h-full">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#be3144] to-[#f05941]" />
      
      <div className="flex items-center gap-4 px-6 pt-6 pb-2">
        {/* Avatar */}
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#be3144] to-[#f05941] flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white group-hover:border-[#be3144] transition-all">
          {job.jobPosition?.charAt(0) || 'J'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-xl text-[#191011] truncate mb-1 group-hover:text-[#be3144] transition-colors">
            {job.jobPosition}
          </h3>
          <div className="flex flex-wrap gap-1">
          {job.recruiterName || job.createdBy ? (
              <span className="inline-block text-xs font-medium bg-[#f1e9ea] text-[#be3144] px-2 py-0.5 rounded-full border border-[#e4d3d5]">
              {job.recruiterName || job.createdBy}
            </span>
          ) : null}
            <span className="inline-block text-xs font-medium bg-[#f1e9ea] text-[#8e575f] px-2 py-0.5 rounded-full border border-[#e4d3d5]">
              {job._type === 'call' ? 'Call Interview' : 'Video Interview'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <p className="text-sm text-[#191011] mb-4 line-clamp-3 min-h-[48px]">
          {job.jobDescription || job.jobDesc || 'No description provided.'}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center text-xs text-[#8e575f] mb-2">
            {job.location && (
              <span className="flex items-center mr-3">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {job.location}
              </span>
            )}
            {job.createdAt && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <Button
            className="w-full py-3 text-base font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl"
            onClick={handleViewDetails}
          >
            <span>View Details</span>
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || "";
  const initialCategory = searchParams.get('category') || 'All Categories';
  const [allJobs, setAllJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const { user, isLoaded } = useUser();
  const [completedInterviews, setCompletedInterviews] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Theme colors
  const themePrimary = '#be3144';
  const themeBg = '#f1e9ea';
  const themeText = '#be3144';
  const themeSecondaryText = '#8e575f';

  useEffect(() => {
    fetchAllJobs();
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAllJobs = async () => {
    try {
      const callJobs = await db.select().from(callInterview).orderBy(desc(callInterview.createdAt));
      const callJobsWithType = callJobs.map(j => ({ ...j, _type: 'call', type: 'Call Interview', jobDescription: j.jobDescription }));
      const mockJobs = await db.select().from(MockInterview).orderBy(desc(MockInterview.createdAt));
      const mockJobsWithType = mockJobs.map(j => ({ ...j, _type: 'mock', type: 'Video Interview', jobDescription: j.jobDesc }));
      setAllJobs([...callJobsWithType, ...mockJobsWithType]);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Filter jobs by selected category, type, and search query
  const filteredJobs = allJobs.filter(job => {
    const categoryMatch = selectedCategory === 'All Categories' || (job.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const typeMatch = selectedType === 'all' || job.type === selectedType;
    const query = searchQuery.toLowerCase();
    const searchMatch =
      (job.jobPosition?.toLowerCase().includes(query)) ||
      ((job.jobDescription || job.jobDesc || '').toLowerCase().includes(query)) ||
      (job.location?.toLowerCase().includes(query)) ||
      (job.recruiterName?.toLowerCase().includes(query)) ||
      (job.createdBy?.toLowerCase().includes(query));
    return categoryMatch && typeMatch && searchMatch;
  });

  // Pagination logic
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = Math.min(startIdx + jobsPerPage, totalJobs);
  const paginatedJobs = filteredJobs.slice(startIdx, endIdx);

  // Pagination controls logic (show up to 5 page numbers)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const clearFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedType('all');
    setSearchQuery("");
    setCurrentPage(1);
  };

  // When filters/search change, reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, searchQuery]);

  // When searchQuery or selectedCategory changes, update the URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    if (selectedCategory && selectedCategory !== 'All Categories') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Job Seeker Header matching main site style */}
      <div className="pt-[70px]">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg bg-white' : 'py-4 shadow-sm bg-[#FBF1EE]'}`}>
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            {/* Logo and brand */}
            <Link href="/job-seeker" className="flex items-center gap-4 group flex-shrink-0">
                <div className={`transition-all duration-300 ${scrolled ? 'w-12 h-12' : 'w-14 h-14'}`}> 
                  <Image 
                    src={'/logo.png'} 
                    width={scrolled ? 48 : 56} 
                    height={scrolled ? 48 : 56} 
                    alt='logo'
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              <span className={`font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-2xl' : 'text-3xl'}`}>I-Hire</span>
            </Link>
            {/* Navigation links (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
              <Link href="/job-seeker" className="text-[#191011] hover:text-[#be3144] font-medium transition-colors">
                Home
              </Link>
              <Link href="/job-seeker/jobs" className="text-[#be3144] font-medium">
                Jobs
              </Link>
              <Link href="/job-seeker/applications" className="text-[#191011] hover:text-[#be3144] font-medium transition-colors">
                My Applications
              </Link>
            </div>
            {/* Profile button always right */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {isLoaded && user && (
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] hover:border-[#be3144] transition-colors shadow-sm cursor-pointer"
                    onClick={() => setMenuOpen((open) => !open)}
                  >
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
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#e4d3d5] z-50 overflow-hidden animate-fade-in"
                      style={{ minWidth: 280 }}
                    >
                      <div className="p-5 border-b border-[#f1e9ea] flex items-center gap-4 bg-[#f9f6f6]">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#f1e9ea]">
                          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
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
                      </div>
                      <div className="border-t border-[#f1e9ea] flex flex-col">
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f1e9ea] transition-colors text-[#191011] text-base font-medium">
                          <Settings className="w-5 h-5 text-[#191011]" /> Account Settings
                        </a>
                        <a href="#" className="flex items-center gap-4 px-6 py-4 hover:bg-[#f9eaea] transition-colors text-[#be3144] text-base font-semibold">
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

      {/* Prominent search bar section under the header */}
      <section className="relative w-full py-16 px-4 flex flex-col items-center justify-center shadow-lg bg-[url('/ai.png')] bg-cover bg-center overflow-hidden">
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6DED8]/95 via-[#f05941]/80 to-[#be3144]/90 z-0"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-white/90 text-center mb-10 max-w-2xl mx-auto">
            Browse through hundreds of job opportunities in Egypt and the MENA region
          </p>
          {/* Responsive search and filter row */}
          <form onSubmit={e => e.preventDefault()} className="w-full mx-auto flex items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#f1e9ea] overflow-hidden px-4 py-1 gap-2">
            <span className="flex items-center">
              <Search className="text-[#be3144] w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search by Job Title, Keywords, Location, or Creator (e.g. Sales in Cairo, Amr)"
              className="flex-1 py-4 px-4 text-base bg-transparent focus:outline-none focus:ring-0 placeholder-[#c08a92] text-[#191011] transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
              className="hidden md:block rounded-lg bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white font-bold px-6 py-3 text-base shadow-lg transition-all border-none outline-none focus:ring-2 focus:ring-[#be3144]/50"
          >
            Search
          </button>
            {/* Filters button only on mobile, inside the search bar box */}
            <Button 
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 bg-white text-[#be3144] border border-[#be3144] hover:bg-[#be3144]/10 h-full px-4 rounded-lg !py-3"
              style={{ marginLeft: 0, height: '48px' }}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
        </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#191011]">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-[#8e575f] hover:text-[#be3144]">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8e575f] mb-2">Job Category</label>
                  <select
                    className="w-full border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option>All Categories</option>
                    {jobCategories.map((cat, idx) => (
                      <option key={idx} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8e575f] mb-2">Interview Type</label>
                  <select
                    className="w-full border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white"
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                  >
                    {interviewTypes.map((type, idx) => (
                      <option key={idx} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={clearFilters}
                    className="flex-1 bg-white text-[#be3144] border border-[#be3144] hover:bg-[#be3144]/10"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f1e9ea] sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#191011]">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-[#be3144] hover:underline"
                >
                  Clear all
                </button>
          </div>
          
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8e575f] mb-2">Job Category</label>
              <select
                    className="w-full border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                {jobCategories.map((cat, idx) => (
                  <option key={idx} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>
            
                <div>
                  <label className="block text-sm font-medium text-[#8e575f] mb-2">Interview Type</label>
              <select
                    className="w-full border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                {interviewTypes.map((type, idx) => (
                  <option key={idx} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
          </div>
          
          {/* Job listings */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#191011]">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>
              
              {(selectedCategory !== 'All Categories' || selectedType !== 'all' || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCategory !== 'All Categories' && (
                    <span className="inline-flex items-center bg-[#f1e9ea] text-[#be3144] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#e4d3d5]">
                      {selectedCategory}
                      <button 
                        onClick={() => setSelectedCategory('All Categories')}
                        className="ml-1 text-[#be3144] hover:text-[#8e575f]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedType !== 'all' && (
                    <span className="inline-flex items-center bg-[#f1e9ea] text-[#be3144] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#e4d3d5]">
                      {interviewTypes.find(t => t.value === selectedType)?.label}
                      <button 
                        onClick={() => setSelectedType('all')}
                        className="ml-1 text-[#be3144] hover:text-[#8e575f]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center bg-[#f1e9ea] text-[#be3144] text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#e4d3d5]">
                      Search: "{searchQuery}"
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="ml-1 text-[#be3144] hover:text-[#8e575f]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {loadingJobs ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-[#be3144]" />
                <span className="ml-2 text-[#8e575f]">Loading jobs...</span>
          </div>
        ) : filteredJobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedJobs.map((job) => (
              <JobSeekerJobCard job={job} key={job._type === 'call' ? job.job_id : job.mockId} />
            ))}
          </div>
                {/* Pagination controls */}
                <div className="flex flex-col items-center justify-center mt-8">
                  <div className="flex items-center gap-2 text-base mb-2" style={{ color: themeSecondaryText }}>
                    {totalJobs > 0 && (
                      <span>
                        Showing {startIdx + 1} - {endIdx} of {totalJobs}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        background: currentPage === 1 ? themeBg : '#fff',
                        color: currentPage === 1 ? '#c8bfc2' : themeText,
                        border: `1px solid ${themeBg}`,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 0.75rem',
                      }}
                    >
                      &#60;
                    </button>
                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        style={{
                          background: num === currentPage ? themePrimary : themeBg,
                          color: num === currentPage ? '#fff' : themeText,
                          border: `1px solid ${themeBg}`,
                          transition: 'background 0.2s, color 0.2s',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 0.75rem',
                          fontWeight: num === currentPage ? 700 : 500,
                        }}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        background: currentPage === totalPages ? themeBg : '#fff',
                        color: currentPage === totalPages ? '#c8bfc2' : themeText,
                        border: `1px solid ${themeBg}`,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 0.75rem',
                      }}
                    >
                      &#62;
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border-2 border-dashed border-[#e4d3d5] rounded-xl p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-[#f1e9ea] rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-[#be3144]" />
              </div>
                <h3 className="text-xl font-medium text-[#191011] mb-2">
                  No jobs found matching your criteria
              </h3>
                <p className="text-[#8e575f] mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search query to find more opportunities.
              </p>
              <Button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white"
                >
                  Clear all filters
              </Button>
            </div>
            )}
          </div>
        </div>
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
          <div className="flex-1 grid grid-cols-2 gap-8 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-lg mb-4 text-[#be3144]">Connect With Us</h4>
              <div className="flex gap-4 mb-4 justify-center md:justify-start">
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                </Link>
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </Link>
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </Link>
              </div>
              <p className="text-[#f1e9ea] text-xs text-center md:text-left">
                © {new Date().getFullYear()} <span className="font-bold text-[#be3144]">I-Hire</span>. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function JobSeekerJobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}