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
              style={{ filter: 'brightness(1.2)' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#be3144]/90 to-[#f05941]/80" />
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
        <section className="mt-16 bg-gradient-to-r from-[#be3144] to-[#f05941] py-16 text-white rounded-2xl shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your hiring process?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of companies who found their perfect hires with I-Hire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold bg-white text-[#be3144] hover:bg-gray-100 shadow-md focus:ring-2 focus:ring-[#be3144]"
                  onClick={() => router.push('/sign-up')}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold border-white text-white hover:bg-white/10 focus:ring-2 focus:ring-[#be3144]"
                  onClick={() => router.push('/demo')}
                >
                  Request Demo
                </Button>
              </div>
              <p className="mt-4 text-sm opacity-80">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Image 
                  src="/logo-white.png" 
                  width={40} 
                  height={40} 
                  alt="I-Hire Logo" 
                  className="object-contain"
                  loading="lazy"
                />
                <span className="text-2xl font-bold text-white">
                  I-Hire
                </span>
              </Link>
              <p className="text-gray-400">
                Egypt's leading recruitment platform connecting employers with top talent through innovative AI technology.
              </p>
              {/* Newsletter Signup */}
              <form className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md" onSubmit={e => { e.preventDefault(); /* handle newsletter signup */ }}>
                <input type="email" required placeholder="Your email address" className="flex-1 px-4 py-2 rounded-l-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#be3144]" />
                <Button type="submit" className="rounded-r-lg bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold px-6 focus:ring-2 focus:ring-[#be3144]">Subscribe</Button>
              </form>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                For Employers
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/post-job" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/search-cvs" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Search CVs
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Hiring Guides
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors focus:ring-2 focus:ring-[#be3144] rounded">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} I-Hire. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}