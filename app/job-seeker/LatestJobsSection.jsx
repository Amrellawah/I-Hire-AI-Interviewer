import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import React from 'react';

export default function LatestJobsSection({ allJobs }) {
  return (
    <section className="mt-4 bg-[#f9f6f6] border border-[#f1e9ea] rounded-2xl px-2 py-6 md:p-8 shadow-sm">
      <div className="mb-6 px-2 md:px-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-8 h-2 rounded bg-gradient-to-r from-[#be3144] to-[#f05941] mr-2"></span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#191011]">Latest Jobs</h2>
        </div>
        <div className="h-1 w-24 bg-[#be3144] rounded"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {allJobs.slice(0, 8).map((job, idx) => (
          <div
            key={job.job_id || job.mockId || idx}
            className="relative bg-white border border-[#e4d3d5] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full overflow-hidden"
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] group-hover:opacity-90 opacity-80 transition-all" />
            <Link
              href={`/job-seeker/job/${job.job_id || job.mockId}`}
              className="font-extrabold text-lg md:text-xl text-[#be3144] group-hover:underline mb-2 mt-2 block truncate"
            >
              {job.jobPosition}
            </Link>
            <div className="text-[#8e575f] text-sm mb-3 truncate flex items-center gap-2">
              <User className="w-4 h-4 text-[#be3144]" />
              {(job.recruiterName || job.createdBy || 'Unknown')}
              {job.location && <span className="ml-2 text-[#be3144]">• {job.location}</span>}
            </div>
            <div className="text-xs text-[#8e575f] mt-auto">
              {job.createdAt ? timeAgo(job.createdAt) : ''}
            </div>
            {/* Simple View Details link */}
            <Link
              href={`/job-seeker/job/${job.job_id || job.mockId}`}
              className="mt-4 text-[#a94442] hover:underline text-base font-normal flex items-center gap-1 w-fit"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <Link href="/job-seeker/jobs" className="text-[#be3144] hover:underline font-semibold flex items-center gap-1 text-lg">
          See other jobs
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
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