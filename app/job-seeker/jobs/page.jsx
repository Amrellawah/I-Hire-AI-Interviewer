"use client";
import { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { callInterview, MockInterview } from '@/utils/schema';
import { desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, ArrowLeft, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div
      className="relative group p-0 rounded-2xl overflow-hidden shadow-lg border border-[#f1e9ea] bg-gradient-to-br from-[#fff0f3] via-[#fbe3e6] to-[#f1e9ea] hover:shadow-2xl hover:border-[#be3144] transition-all duration-200 hover:scale-[1.025] flex flex-col h-full"
    >
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
          {job.recruiterName || job.createdBy ? (
            <span className="inline-block text-xs font-medium bg-[#f1e9ea] text-[#be3144] px-2 py-0.5 rounded-full border border-[#e4d3d5] mb-1">
              {job.recruiterName || job.createdBy}
            </span>
          ) : null}
        </div>
      </div>
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <p className="text-sm text-[#191011] mb-4 line-clamp-3 min-h-[48px]">
          {job.jobDescription || job.jobDesc || 'No description provided.'}
        </p>
        <div className="mt-auto">
          <Button
            className="w-full py-3 text-base font-bold bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            onClick={handleViewDetails}
          >
            <span>View Details</span>
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function JobSeekerJobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Job Seeker Header matching main site style */}
      <div className="pt-[70px]">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4 shadow-sm'}`} style={{ backgroundColor: '#FBF1EE' }}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/job-seeker" className="flex items-center gap-4 group">
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
            </div>
          </div>
        </header>
      </div>
      {/* Prominent search bar section under the header */}
      <section className="w-full bg-gradient-to-br from-[#fff0f3] via-[#f05941]/70 to-[#be3144] py-16 px-2 flex flex-col items-center justify-center shadow-lg">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#be3144] mb-10 text-center drop-shadow-[0_2px_8px_rgba(190,49,68,0.15)] tracking-tight">
          Jobs in Egypt and the MENA Region
        </h2>
        <form onSubmit={e => e.preventDefault()} className="w-full max-w-3xl mx-auto flex items-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#f1e9ea] overflow-hidden px-2 py-2 gap-2">
          <span className="pl-4 flex items-center">
            <Search className="text-[#be3144] w-7 h-7" />
          </span>
          <input
            type="text"
            placeholder="Search by Job Title, Keywords, Location, or Creator (e.g. Sales in Cairo, Amr)"
            className="flex-1 py-5 px-4 text-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#be3144]/40 rounded-2xl placeholder-[#c08a92] text-[#191011] transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ minWidth: 0 }}
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#be3144] text-white font-bold px-8 py-4 text-lg shadow-lg transition-all border-none outline-none focus:ring-2 focus:ring-[#be3144]/50"
          >
            Search
          </button>
        </form>
      </section>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-[#191011]">Available Jobs</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="category-filter" className="text-[#8e575f] font-medium mr-2">Filter by Category:</label>
            <select
              id="category-filter"
              className="border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white max-h-60 overflow-y-auto"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              {jobCategories.map((cat, idx) => (
                <option key={idx} value={cat.title}>{cat.title}</option>
              ))}
            </select>
            <label htmlFor="type-filter" className="text-[#8e575f] font-medium ml-4 mr-2">Interview Type:</label>
            <select
              id="type-filter"
              className="border border-[#e4d3d5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]/50 transition-all bg-white"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              {interviewTypes.map((type, idx) => (
                <option key={idx} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
        {loadingJobs ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#be3144]" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobSeekerJobCard job={job} key={job._type === 'call' ? job.job_id : job.mockId} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-[#e4d3d5] rounded-xl p-12 text-center">
            <h3 className="text-xl font-medium text-[#191011] mb-2">
              No jobs available for this category
            </h3>
            <p className="text-[#8e575f] mb-6 max-w-md mx-auto">
              Please check back later for new job opportunities from employers.
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 