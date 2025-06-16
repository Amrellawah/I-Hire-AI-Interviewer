"use client";
import { useUser } from "@clerk/nextjs";
import { Pencil, Share2, ChevronDown, ChevronUp, Mail, Phone, Upload, Plus, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function JobSeekerProfilePage() {
  const { user } = useUser();
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.imageUrl || null);
  const fileInputRef = useRef(null);
  // Simulate completedInterviews for badge demo (replace with real data if available)
  const completedInterviews = 3; // TODO: Replace with real value if available

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
            {/* Profile avatar with notification badge */}
            {user && (
              <div className="relative flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] shadow-sm">
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
        </header>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-8 flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-t-2xl" />
          <div className="relative w-32 h-32 flex items-center justify-center">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#f1e9ea] shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#be3144]/80 to-[#f05941]/80 flex items-center justify-center text-5xl font-bold text-white shadow-lg border-4 border-[#f1e9ea]">
                {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : "U"}
              </div>
            )}
            {/* Edit photo button */}
            <button
              className="absolute bottom-2 right-2 bg-white border border-[#e4d3d5] rounded-full p-2 shadow hover:bg-[#f1e9ea] transition-colors"
              onClick={() => fileInputRef.current.click()}
              title="Edit photo"
              type="button"
            >
              <Camera size={22} className="text-[#be3144]" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0 mt-4 md:mt-0 md:ml-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-extrabold text-[#191011]">{user?.fullName || "Nour Elsaharty"}</h2>
              <button className="text-[#be3144] hover:bg-[#f1e9ea] rounded-full p-1 transition-colors"><Pencil size={22} /></button>
              <button className="text-[#be3144] hover:bg-[#f1e9ea] rounded-full p-1 transition-colors"><Share2 size={22} /></button>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your tagline</div>
              <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your location</div>
              <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your online presence</div>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#f1e9ea] bg-[#f9f6f6]">
            <div className="font-bold text-lg flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              Contact Info
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#f1e9ea] text-[#be3144] text-xs font-semibold px-3 py-1 rounded-full tracking-wide">ONLY COMPANIES CAN SEE THIS SECTION</span>
              <button onClick={() => setContactOpen(o => !o)} className="ml-2 p-1 rounded-full border border-[#e4d3d5] hover:bg-[#f1e9ea] transition-colors">
                {contactOpen ? <ChevronUp size={20} className="text-[#be3144]" /> : <ChevronDown size={20} className="text-[#be3144]" />}
              </button>
            </div>
          </div>
          {contactOpen && (
            <div className="p-6 space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-[#191011] text-base">
                <Phone size={20} className="text-[#be3144]" />
                <span>01006464854</span>
              </div>
              <div className="flex items-center gap-3 text-[#191011] text-base">
                <Mail size={20} className="text-[#be3144]" />
                <span>nourelsaharty11@gmail.com</span>
              </div>
              <div>
                <Link href="/job-seeker/Upload-CV" className="inline-flex items-center gap-2 text-[#be3144] hover:text-[#f05941] font-semibold transition-colors text-base">
                  <Upload size={20} className="" />
                  <span>Upload CV</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* General Info Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            <div className="font-bold text-lg text-[#191011]">General Info</div>
          </div>
          <div className="space-y-2">
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your age</div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your career level</div>
            <div><span className="font-semibold">Minimum Salary:</span> <span className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your min salary</span></div>
            <div><span className="font-semibold">Job Search Status:</span> <span className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add job search status</span></div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your nationality</div>
            <div><span className="font-semibold">Education Level:</span> Bachelor's Degree</div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your gender</div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your military status</div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add your marital status</div>
            <div className="text-[#4f46e5] cursor-pointer hover:underline font-medium">+ Add driving license</div>
          </div>
          <div className="font-bold text-lg mt-8 mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            Career Interests
          </div>
          <div className="ml-2 space-y-1">
            <div><span className="font-semibold">Job Titles and Keywords:</span></div>
            <div><span className="font-semibold">Job Categories:</span></div>
            <div><span className="font-semibold">Job Types:</span></div>
          </div>
        </div>

        {/* Skills and Tools Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Skills and Tools</div>
            </div>
            <button className="flex items-center gap-2 text-[#be3144] hover:text-[#f05941] font-semibold transition-colors bg-[#f1e9ea] px-3 py-1 rounded-full text-sm">
              <Pencil size={18} /> + Add new skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {['Python', 'Java', 'C++', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git', 'Github', 'Android', 'iOS', 'React', 'flutter'].map(skill => (
              <span key={skill} className="bg-gradient-to-r from-[#f1e9ea] to-[#fff] text-[#191011] px-3 py-1 rounded-full text-sm border border-[#e4d3d5] font-medium shadow-sm">{skill}</span>
            ))}
          </div>
          <div className="bg-[#f1e9ea] text-[#191011] px-3 py-2 rounded-lg inline-block text-sm font-semibold">STRONG ANALYTICAL AND PROBLEM-SOLVING...</div>
        </div>

        {/* Work Experience Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 w-full">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            <div className="font-bold text-lg text-[#191011]">Work Experience</div>
          </div>
          <img src="/work-exp-illustration.svg" alt="Work Experience" className="w-32 mb-2" />
          <div className="text-[#6b7280] mb-4 text-center">Add and stand out to get more opportunities tailored to your preferences.</div>
          <button className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 shadow transition-all">
            <Plus size={18} /> Add Work Experience
          </button>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Education</div>
            </div>
            <button className="flex items-center gap-2 text-[#be3144] hover:text-[#f05941] font-semibold transition-colors bg-[#f1e9ea] px-3 py-1 rounded-full text-sm">
              <Pencil size={18} /> + Add education
            </button>
          </div>
          <div className="ml-2">
            <div className="font-semibold">Bachelor's Degree in cs general</div>
            <div className="text-[#6b7280]">Nile University (NU)</div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 w-full">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            <div className="font-bold text-lg text-[#191011]">Activities</div>
          </div>
          <img src="/activities-illustration.svg" alt="Activities" className="w-32 mb-2" />
          <div className="text-[#6b7280] mb-4 text-center">Your volunteering and student activities.</div>
          <button className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 shadow transition-all">
            <Plus size={18} /> Add Activities
          </button>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 w-full">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            <div className="font-bold text-lg text-[#191011]">Achievements</div>
          </div>
          <img src="/achievements-illustration.svg" alt="Achievements" className="w-32 mb-2" />
          <div className="text-[#6b7280] mb-4 text-center">Sports, patents, publications, awards, books etc.</div>
          <button className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white font-semibold px-6 py-2 rounded-full flex items-center gap-2 shadow transition-all">
            <Plus size={18} /> Add Achievements
          </button>
        </div>
      </div>
    </div>
  );
} 