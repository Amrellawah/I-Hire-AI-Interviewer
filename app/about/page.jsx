"use client";
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import Header from "../dashboard/_components/Header";

// Import our modern components
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import ParallaxSection from '../../components/ui/ParallaxSection';
import InteractiveCard from '../../components/ui/InteractiveCard';
import AnimatedStats from '../../components/ui/AnimatedStats';
import AnimatedTimeline from '../../components/ui/AnimatedTimeline';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import ScrollTriggeredAnimation, { StaggeredAnimation } from '../../components/ui/ScrollTriggeredAnimation';
import ParticleSystem, { FloatingParticles } from '../../components/ui/ParticleSystem';
import ModernCursor from '../../components/ui/ModernCursor';

// Icons
const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Rocket: () => (
    <svg className="w-6 h-6" fill="none" stroke="#fff" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" fill="none" stroke="#fff" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Award: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
};

// 1. Import useMobile hook for device detection
import useMobile from '../../hooks/use-mobile';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const isMobile = useMobile();
  
  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Stats data
  const statsData = [
    {
      value: 1000,
      suffix: "+",
      label: "Interviews Conducted",
      description: "AI-powered interviews completed",
      icon: <Icons.Users />
    },
    {
      value: 95,
      suffix: "%",
      label: "Accuracy Rate",
      description: "Advanced AI evaluation precision",
      icon: <Icons.Award />
    },
    {
      value: 50,
      suffix: "+",
      label: "Companies Served",
      description: "Trusted by leading organizations",
      icon: <Icons.Globe />
    },
    {
      value: 24,
      suffix: "hr",
      label: "Response Time",
      description: "Lightning-fast feedback delivery",
      icon: <Icons.Rocket />
    }
  ];

  // Timeline data
  const timelineData = [
    {
      date: "2023 - Q1",
      title: "Project Inception",
      description: "Started with a vision to revolutionize hiring through AI technology",
      tags: ["Research", "Planning"],
      icon: <Icons.Star />
    },
    {
      date: "2023 - Q2",
      title: "MVP Development",
      description: "Built the first version with core AI interview capabilities",
      tags: ["Development", "AI Integration"],
      icon: <Icons.Rocket />
    },
    {
      date: "2023 - Q3",
      title: "Beta Launch",
      description: "Released beta version to select companies for testing",
      tags: ["Testing", "Feedback"],
      icon: <Icons.Users />
    },
    {
      date: "2023 - Q4",
      title: "Public Launch",
      description: "Successfully launched I-Hire to the public market",
      tags: ["Launch", "Growth"],
      icon: <Icons.Award />
    }
  ];

  return (
    <>
      {/* Modern Custom Cursor - hide on mobile */}
      {!isMobile && <ModernCursor />}
      
      <AnimatedBackground isMobile={isMobile}>
      <Header />
      
        <main className="relative px-2 w-full min-h-screen">
          {/* Floating Particles - reduce on mobile */}
          <FloatingParticles count={isMobile ? 10 : 30} />
          
          {/* Hero Section with Parallax */}
          <ParallaxSection className="min-h-[60vh] flex items-center justify-center pt-15 sm:pt-20">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 text-center">
              <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-[#191011] mb-4 sm:mb-6 leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">I-Hire</span>
          </h1>
              </ScrollTriggeredAnimation>
              
              <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
                <p className="text-base sm:text-xl md:text-2xl text-[#8e575f] leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12">
                  Empowering companies and job seekers with the future of AI-driven hiring. 
                  Discover our story, mission, and the passionate team behind I-Hire.
                </p>
              </ScrollTriggeredAnimation>

              {/* Floating action buttons */}
              <ScrollTriggeredAnimation animation="bounceIn" delay={0.6}>
                <div className="flex justify-center gap-4">
                  <FloatingActionButton
                    icon={<Icons.Heart />}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    tooltip="Back to top"
                    pulse={true}
                    size={isMobile ? 'small' : 'large'}
                  />
                </div>
              </ScrollTriggeredAnimation>
                  </div>
          </ParallaxSection>

          {/* Mission & Vision Section */}
          <section className="py-10 sm:py-20 px-2 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollTriggeredAnimation animation="fadeInUp">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#191011] mb-4 sm:mb-6">Our Mission & Vision</h2>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 sm:mb-8 rounded-full" />
                  <p className="text-base sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
                    To revolutionize the hiring process by making it faster, fairer, and more insightful for everyone.
                  </p>
                </div>
              </ScrollTriggeredAnimation>

              <StaggeredAnimation staggerDelay={0.2} animation="slideInUp">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <InteractiveCard glowEffect={true} className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-2xl flex items-center justify-center mr-6">
                        <Icons.Rocket />
                      </div>
                      <h3 className="text-2xl font-bold text-[#191011]">Vision</h3>
                    </div>
                    <p className="text-lg text-[#8e575f] leading-relaxed">
                      To be the world's most trusted platform for AI-powered talent discovery and career growth, 
                      connecting exceptional talent with outstanding opportunities across the globe.
                    </p>
                  </InteractiveCard>

                  <InteractiveCard glowEffect={true} className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-2xl flex items-center justify-center mr-6">
                        <Icons.Heart />
                      </div>
                      <h3 className="text-2xl font-bold text-[#191011]">Values</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="text-[#f05941] mr-3 mt-1 text-xl">•</span>
                        <div>
                          <strong className="text-[#191011]">Integrity & Fairness:</strong>
                          <p className="text-[#8e575f]">We build trust through transparency</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[#f05941] mr-3 mt-1 text-xl">•</span>
                        <div>
                          <strong className="text-[#191011]">Innovation & Excellence:</strong>
                          <p className="text-[#8e575f]">We push boundaries in hiring tech</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[#f05941] mr-3 mt-1 text-xl">•</span>
                        <div>
                          <strong className="text-[#191011]">Empathy & Inclusion:</strong>
                          <p className="text-[#8e575f]">We design for all candidates</p>
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </div>
              </StaggeredAnimation>
                  </div>
          </section>

          {/* Statistics Section */}
          <section className="py-10 sm:py-20 px-2 sm:px-4 bg-gradient-to-r from-[#fef6f6] to-[#fff9f9]">
            <div className="max-w-6xl mx-auto">
              <ScrollTriggeredAnimation animation="fadeInUp">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#191011] mb-4 sm:mb-6">Our Impact</h2>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 sm:mb-8 rounded-full" />
                  <p className="text-base sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
                    Transforming the hiring landscape with cutting-edge AI technology
                  </p>
                </div>
              </ScrollTriggeredAnimation>

              <AnimatedStats stats={statsData} />
          </div>
        </section>

        {/* Team Section */}
          <section className="py-10 sm:py-20 px-2 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollTriggeredAnimation animation="fadeInUp">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#191011] mb-4 sm:mb-6">Meet the Team</h2>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 sm:mb-8 rounded-full" />
                  <p className="text-base sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
              We are a group of passionate engineers and innovators dedicated to transforming the hiring experience with AI-driven solutions.
            </p>
                </div>
              </ScrollTriggeredAnimation>

              {/* Team Photo */}
              <ScrollTriggeredAnimation animation="scaleIn">
                <div className="w-full flex justify-center mb-10 sm:mb-16">
                  <div className="relative w-full max-w-2xl sm:max-w-4xl h-48 sm:h-[24rem] md:h-[32rem] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/uploads/Team.JPG"
                      width={800}
                      height={500}
                alt="Our Team Photo"
                      className="object-cover object-center w-full h-full"
                priority
              />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">The I-Hire Team</h3>
                      <p className="text-lg opacity-90">Building the future of hiring</p>
                    </div>
              </div>
            </div>
              </ScrollTriggeredAnimation>

              {/* Project Supervisor - Dr. Noha Gamal */}
              <ScrollTriggeredAnimation animation="fadeInUp" delay={0.2}>
                <div className="text-center mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#191011] mb-6">Project Supervisor</h3>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-8 rounded-full" />
                </div>
                <div className="flex justify-center mb-16">
                  <InteractiveCard
                    className="p-8 text-center max-w-md"
                    hoverEffect={true}
                    tiltEffect={true}
                    glowEffect={true}
                  >
                    <div className="w-32 h-32 rounded-full mb-6 mx-auto overflow-hidden shadow-lg border-4 border-white">
                      <Image
                        src="/uploads/Dr.Noha.JPG"
                        width={128}
                        height={128}
                        alt="Dr. Noha Gamal"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-[#191011] mb-3">Dr. Noha Gamal</h4>
                    <p className="text-lg text-[#8e575f] mb-4 font-semibold">Project Supervisor</p>
                    <p className="text-sm text-[#8e575f] mb-6">
                      Guiding our team with expertise and vision to revolutionize the hiring process through AI technology.
                    </p>
                    <div className="flex justify-center space-x-4 overflow-x-auto">
                      <a href="https://www.linkedin.com/in/dr-noha-gamaleldin-383ab820/" target="_blank" rel="noopener noreferrer" className="text-[#8e575f] hover:text-[#be3144] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>
                  </InteractiveCard>
                </div>
              </ScrollTriggeredAnimation>

              {/* Team Members Section */}
              <ScrollTriggeredAnimation animation="fadeInUp" delay={0.4}>
                <div className="text-center mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#191011] mb-6">Development Team</h3>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-8 rounded-full" />
                </div>
              </ScrollTriggeredAnimation>

              {/* Team Members Grid */}
              <StaggeredAnimation staggerDelay={0.1} animation="flipIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  {[
                    { name: 'Amr Ellawah', role: 'Co-Founder & Engineer', photo: '/uploads/amr (2).jpg', linkedin: 'https://www.linkedin.com/in/amr-ellawah/' },
                    { name: 'Ali Ibrahim', role: 'Co-Founder & Engineer', photo: '/uploads/Ali.jpg', linkedin: 'https://www.linkedin.com/in/ali-ibrahim-686893245/' },
                    { name: 'Osama Mohamed', role: 'Co-Founder & Engineer', photo: '/uploads/osama.jpg', linkedin: 'https://www.linkedin.com/in/osama-mohamed-15853932b/' },
                    { name: 'Nour Elsaharty', role: 'Co-Founder & Engineer', photo: '/uploads/nourElsaharty.jpg', linkedin: 'https://www.linkedin.com/in/nour-elsaharty-20827830b/' },
                    { name: 'Peter Saad', role: 'Co-Founder & Engineer', photo: '/uploads/peter.jpg', linkedin: 'https://www.linkedin.com/in/peter-saad-349278299/' },
                    { name: 'Yousef Nassar', role: 'Co-Founder & Engineer', photo: '/uploads/youssef.jpg', linkedin: 'https://www.linkedin.com/in/youssef-nassar-3a5916310/' }
                  ].map((member, index) => (
                    <InteractiveCard
                      key={index}
                      className="p-4 sm:p-8 mb-4 sm:mb-8"
                      hoverEffect={true}
                      tiltEffect={true}
                    >
                      <div className="w-24 h-24 rounded-full mb-6 mx-auto overflow-hidden shadow-lg border-4 border-white">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            width={96}
                            height={96}
                            alt={member.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#be3144] to-[#f05941] flex items-center justify-center text-3xl font-bold text-white">
                            {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1].charAt(0)}
                          </div>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-[#191011] mb-2 text-center">{member.name}</h4>
                      <p className="text-[#8e575f] mb-4 text-center">{member.role}</p>
                      <div className="flex justify-center space-x-4 overflow-x-auto">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#8e575f] hover:text-[#be3144] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              </StaggeredAnimation>
            </div>
          </section>

          {/* Journey Timeline */}
          <section className="py-10 sm:py-20 px-2 sm:px-4 bg-gradient-to-r from-[#fef6f6] to-[#fff9f9]">
            <div className="max-w-6xl mx-auto">
              <ScrollTriggeredAnimation animation="fadeInUp">
                <div className="text-center mb-10 sm:mb-16">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#191011] mb-4 sm:mb-6">Our Journey</h2>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 sm:mb-8 rounded-full" />
                  <p className="text-base sm:text-xl text-[#8e575f] max-w-3xl mx-auto">
                    From concept to reality - the story of how I-Hire came to life
                  </p>
                </div>
              </ScrollTriggeredAnimation>

              <AnimatedTimeline items={timelineData} />
            </div>
        </section>

        {/* CTA Section */}
          <section className="py-10 sm:py-20 px-2 sm:px-4">
            <div className="max-w-2xl sm:max-w-4xl mx-auto text-center">
              <ScrollTriggeredAnimation animation="bounceIn">
                <InteractiveCard className="p-6 sm:p-12" glowEffect={true}>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#191011] mb-4 sm:mb-6">Join Us on Our Mission</h2>
                  <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] mx-auto mb-6 sm:mb-8 rounded-full" />
                  <p className="text-base sm:text-xl text-[#8e575f] mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Whether you're a company looking to revolutionize your hiring process or a job seeker ready to showcase your skills, 
                    we invite you to be part of the I-Hire journey.
                  </p>
                  <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Link
                      href="/"
                      className="inline-block px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl text-white bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Started Today
                    </Link>
                  </motion.div>
                </InteractiveCard>
              </ScrollTriggeredAnimation>
          </div>
          </section>
      </main>

        {/* Enhanced Footer - stack on mobile */}
        <footer className="bg-gradient-to-br from-[#191011] via-[#23202b] to-[#2B2D42] text-white pt-10 sm:pt-16 pb-6 sm:pb-8 px-2 sm:px-4 border-t-4 border-[#be3144] mt-8 sm:mt-12 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-6 sm:gap-10 md:gap-8">
          {/* Logo and brand */}
          <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <Image src="/logo.png" width={56} height={56} alt="I-Hire Logo" className="drop-shadow-lg" />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-[#fff] to-[#f1e9ea] bg-clip-text text-transparent tracking-wide">I-Hire</span>
            </div>
              <p className="text-[#f1e9ea] text-base font-medium max-w-xs text-center md:text-left mb-2">
                Connecting talented professionals with top employers across the MENA region.
              </p>
              <span className="inline-block bg-[#be3144] text-white text-xs font-semibold px-3 py-1 rounded-full mt-2 shadow">
                Empowering Your Career Journey
              </span>
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
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" />
                    <circle cx="12" cy="12" r="5" stroke="currentColor" />
                    <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                  </svg>
                </Link>
                <Link href="#" className="w-9 h-9 bg-[#be3144] rounded-full flex items-center justify-center hover:bg-[#f05941] transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                </Link>
                </div>
                <p className="text-[#f1e9ea] text-xs text-center">
                  © {new Date().getFullYear()} <span className="font-bold text-[#be3144]">I-Hire</span>. All rights reserved.
                </p>
            </div>
          </div>
        </div>
      </footer>
      </AnimatedBackground>
    </>
  );
}