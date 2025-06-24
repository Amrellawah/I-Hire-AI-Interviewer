"use client";
import Header from "../dashboard/_components/Header";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col">
      <Head>
        <title>About | I-Hire</title>
        <meta name="description" content="Learn more about I-Hire, our mission, vision, and the team behind the AI-powered interview platform." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-28 pb-16 px-4 sm:px-6">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#191011] mb-6 leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">I-Hire</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#8e575f] leading-relaxed max-w-2xl mx-auto">
            Empowering companies and job seekers with the future of AI-driven hiring. Discover our story, mission, and the passionate team behind I-Hire.
          </p>
        </motion.section>

        {/* Mission Section */}
        <section className="w-full max-w-6xl mx-auto mb-28 px-4">
          <div className="bg-gradient-to-r from-[#fef6f6] to-[#fff9f9] rounded-3xl p-8 sm:p-12 shadow-sm border border-[#f0e6e8]">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#191011] mb-6">Our Mission</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 rounded-full"></div>
              <p className="text-lg sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
                To revolutionize the hiring process by making it faster, fairer, and more insightful for everyone. We believe in the power of technology to unlock human potential and create opportunities for all.
              </p>
            </motion.div>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <motion.div 
                variants={item}
                className="bg-white rounded-2xl shadow-md p-8 border border-[#f0e6e8] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#fff0f1] flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#be3144]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#be3144]">Vision</h3>
                </div>
                <p className="text-base text-[#191011]">
                  To be the world's most trusted platform for AI-powered talent discovery and career growth.
                </p>
              </motion.div>

              <motion.div 
                variants={item}
                className="bg-white rounded-2xl shadow-md p-8 border border-[#f0e6e8] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#fff0f1] flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#be3144]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#be3144]">Values</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#f05941] mr-2 mt-1">•</span>
                    <span className="text-base text-[#191011]"><strong>Integrity & Fairness:</strong> We build trust through transparency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#f05941] mr-2 mt-1">•</span>
                    <span className="text-base text-[#191011]"><strong>Innovation & Excellence:</strong> We push boundaries in hiring tech</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#f05941] mr-2 mt-1">•</span>
                    <span className="text-base text-[#191011]"><strong>Empathy & Inclusion:</strong> We design for all candidates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#f05941] mr-2 mt-1">•</span>
                    <span className="text-base text-[#191011]"><strong>Collaboration & Growth:</strong> We grow together</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full max-w-6xl mx-auto mb-28 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#191011] mb-6">Meet the Team</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 rounded-full"></div>
            <p className="text-lg sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
              We are a group of passionate engineers and innovators dedicated to transforming the hiring experience with AI-driven solutions.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center mb-12"
          >
            <div className="relative w-full max-w-4xl h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/uploads/Team.jpg"
                width={700}
                height={400}
                alt="Our Team Photo"
                className="rounded-2xl shadow-lg border border-[#e4d3d5] object-cover object-center w-full h-[350px] md:h-[400px] lg:h-[500px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold">The I-Hire Team</h3>
                <p className="text-sm sm:text-base opacity-90">Building the future of hiring</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {['Amr Ellawah', 'Ali Ibrahim', 'Osama Mohamed', 'Nour Elsaharty', 'Peter Saad', 'Yousef Nassar'].map((name, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-[#f0e6e8] hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#f0d8db] to-[#f8e8ea] mb-4 flex items-center justify-center text-2xl font-bold text-[#be3144]">
                  {name.split(' ')[0].charAt(0)}{name.split(' ')[1].charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-[#191011] mb-1">{name}</h4>
                <p className="text-sm text-[#8e575f]">Co-Founder & Engineer</p>
                <div className="flex space-x-3 mt-4">
                  <a href="#" className="text-[#8e575f] hover:text-[#be3144] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#8e575f] hover:text-[#be3144] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#8e575f] hover:text-[#be3144] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mx-auto text-center px-4"
        >
          <div className="bg-gradient-to-r from-[#fef6f6] to-[#fff9f9] rounded-3xl p-8 sm:p-12 shadow-sm border border-[#f0e6e8]">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#191011] mb-6">Join Us on Our Mission</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 rounded-full"></div>
            <p className="text-lg sm:text-xl text-[#8e575f] mb-8 max-w-2xl mx-auto">
              Whether you're a company or a job seeker, we invite you to be part of the I-Hire journey.
            </p>
            <motion.a 
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </motion.a>
          </div>
        </motion.section>
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