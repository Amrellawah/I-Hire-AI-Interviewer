"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Briefcase, Star, User, Search, FileText, DollarSign, Zap, ChevronRight, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployerLandingPage() {
  const router = useRouter();
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setHeroVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'} ${scrolled ? 'text-gray-900' : 'text-white'}`}
        style={{ backgroundColor: scrolled ? '#fff' : 'transparent' }}>
        <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              width={40} 
              height={40} 
              alt="I-Hire Logo" 
              className="object-contain"
              loading="lazy"
            />
            <span className="text-3xl font-extrabold tracking-wide">I-Hire</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/post-job" className="font-semibold transition-colors duration-200 hover:underline">
              Post a Job
            </Link>
            <Link href="/search-cvs" className="font-semibold transition-colors duration-200 hover:underline">
              Search CVs
            </Link>
            <Link href="/job-descriptions" className="font-semibold transition-colors duration-200 hover:underline">
              Job Descriptions
            </Link>
            <Link href="/pricing" className="font-semibold transition-colors duration-200 hover:underline">
              Pricing Plans
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button
              className={`px-6 py-2 rounded border font-semibold transition-all duration-200 ${scrolled ? 'border-gray-400 text-gray-900 bg-transparent hover:bg-gray-100' : 'border-white text-white bg-transparent hover:bg-white/10'}`}
              onClick={() => router.push('/sign-in')}
            >
              Log in
            </button>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#be3144]"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Open menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden fixed inset-0 z-50 bg-black/70`} onClick={() => setMobileMenuOpen(false)}>
            <div className={`absolute top-0 right-0 w-64 h-full bg-white text-gray-900 shadow-lg flex flex-col p-6 gap-6 animate-slide-in`} onClick={e => e.stopPropagation()}>
              <button className="self-end mb-4 p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Link href="/post-job" className="font-semibold py-2 px-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Post a Job</Link>
              <Link href="/search-cvs" className="font-semibold py-2 px-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Search CVs</Link>
              <Link href="/job-descriptions" className="font-semibold py-2 px-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Job Descriptions</Link>
              <Link href="/pricing" className="font-semibold py-2 px-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Pricing Plans</Link>
              <button
                className="mt-4 px-6 py-3 rounded-xl border border-[#be3144] text-[#be3144] font-bold bg-white hover:bg-[#f1e9ea] transition-all w-full"
                onClick={() => { setMobileMenuOpen(false); router.push('/sign-in'); }}
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-0 pb-0">
        <section className="relative flex items-center justify-center min-h-[100vh] w-full overflow-hidden">
          {/* Full background image and overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src='https://cdn.usegalileo.ai/sdxl10/0c18fe0e-67c2-4596-af2f-86cd7bf4ac88.png'
              alt="Office background"
              fill
              className="object-cover object-center"
              style={{ filter: 'brightness(1.15)' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#be3144]/80 to-[#f05941]/60" />
          </div>
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center space-y-8 p-4 sm:p-8 md:p-12 w-full min-h-[100vh]">
            <span className="inline-block text-lg font-semibold uppercase tracking-wider text-[#ffd7d7] mb-2">FOR EMPLOYERS</span>
            <h1 className="text-4xl xs:text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl break-words">
              Hire <span className="bg-gradient-to-r from-[#ffd700] to-[#fff] bg-clip-text text-transparent">Smarter.</span><br />
              Grow Faster.
            </h1>
            <p className="text-lg xs:text-xl md:text-3xl text-white/90 max-w-3xl font-medium">
              With Egypt's #1 Online Recruitment Platform. Access top talent, streamline your hiring process, and build your dream team with our AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full max-w-md justify-center">
              <button
                className="px-8 py-4 text-lg md:text-2xl font-bold rounded-xl bg-gradient-to-r from-[#be3144] to-[#f05941] text-white shadow-xl hover:scale-105 hover:shadow-2xl transition-all w-full sm:w-auto"
                onClick={() => router.push('/dashboard')}
              >
                Start Hiring Now
              </button>
            </div>
            <div className="flex items-center gap-2 text-base md:text-lg text-white/80 mt-2 justify-center">
              <Zap className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>14-day free trial • No credit card required</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="mt-16 md:mt-24">
          <div className="mb-4 text-center text-gray-500 font-semibold uppercase tracking-wider text-xs">Trusted by leading employers</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <Briefcase className="w-8 h-8 text-[#be3144] mb-2" />
              <p className="text-2xl font-bold text-gray-900">10,000+</p>
              <p className="text-sm text-gray-600">Jobs Posted</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <User className="w-8 h-8 text-[#be3144] mb-2" />
              <p className="text-2xl font-bold text-gray-900">100K+</p>
              <p className="text-sm text-gray-600">Active Candidates</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <Star className="w-8 h-8 text-[#be3144] mb-2" />
              <p className="text-2xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600">Employer Rating</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <Building2 className="w-8 h-8 text-[#be3144] mb-2" />
              <p className="text-2xl font-bold text-gray-900">5,000+</p>
              <p className="text-sm text-gray-600">Companies Hiring</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-24 bg-white py-16 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Powerful Hiring Tools for Your Business
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to find, attract, and hire the best talent in Egypt.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <Search className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart CV Search</h3>
                <p className="text-gray-600">
                  Find perfect candidates with our AI-powered search that matches skills, experience, and culture fit.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <FileText className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Posting</h3>
                <p className="text-gray-600">
                  Create compelling job posts that attract top talent with our optimized templates and suggestions.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <Briefcase className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Applicant Tracking</h3>
                <p className="text-gray-600">
                  Manage all your candidates in one place with our intuitive tracking system.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <DollarSign className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">
                  Affordable plans for businesses of all sizes with no hidden fees.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <Star className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Employer Branding</h3>
                <p className="text-gray-600">
                  Showcase your company culture and values to attract the right candidates.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg hover:scale-[1.03] transition-all group focus-within:ring-2 focus-within:ring-[#be3144]">
                <div className="w-12 h-12 rounded-lg bg-[#f05941]/10 flex items-center justify-center mb-4 group-hover:animate-bounce">
                  <Zap className="w-6 h-6 text-[#be3144]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Hiring</h3>
                <p className="text-gray-600">
                  Our platform helps you reduce time-to-hire by up to 60% compared to traditional methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-[#be3144] to-[#f05941] py-16 text-white rounded-3xl shadow-2xl border-2 border-white/20 mx-2 md:mx-0 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-white/10" style={{boxShadow: '0 8px 32px 0 rgba(190,49,68,0.12)'}} />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-2 bg-gradient-to-r from-[#ffd700] to-[#fff] rounded-full shadow-lg"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg tracking-tight">
              Ready to transform your hiring process?
            </h2>
            <p className="text-lg mb-10 opacity-90 font-medium">
              Join thousands of companies who found their perfect hires with I-Hire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
              <Button
                size="lg"
                className="px-10 py-6 text-lg font-bold bg-white text-[#be3144] hover:bg-[#f1e9ea] hover:text-[#be3144] shadow-xl rounded-xl transition-all duration-200 border-2 border-white/40 focus:ring-2 focus:ring-[#be3144]"
                onClick={() => router.push('/sign-up')}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-lg font-bold border-white text-white hover:bg-white/10 hover:text-[#ffd700] rounded-xl border-2 focus:ring-2 focus:ring-[#be3144] transition-all duration-200"
                onClick={() => router.push('/demo')}
              >
                Request Demo
              </Button>
            </div>
            <p className="mt-6 text-base opacity-90 font-medium">
              No credit card required &bull; 14-day free trial
            </p>
          </div>
        </section>
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
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
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