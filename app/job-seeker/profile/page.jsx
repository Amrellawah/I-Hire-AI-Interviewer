"use client";
import { useUser } from "@clerk/nextjs";
import { Pencil, Share2, ChevronDown, ChevronUp, Mail, Phone, Upload, Plus, Camera, Save, X, Edit3, MapPin, Calendar, GraduationCap, Briefcase, Award, Globe, Star, AlertCircle, MoreVertical, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function JobSeekerProfilePage() {
  const { user, isLoaded } = useUser();
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [languagesDraft, setLanguagesDraft] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [editingCerts, setEditingCerts] = useState(false);
  const [certsDraft, setCertsDraft] = useState([]);
  const [newCert, setNewCert] = useState("");
  const [editingContact, setEditingContact] = useState(false);
  const [contactDraft, setContactDraft] = useState({ phone: "", email: "" });
  const [editingExp, setEditingExp] = useState(false);
  const [expDraft, setExpDraft] = useState([]);
  const [newExp, setNewExp] = useState({ title: "", company: "", duration: "", description: "" });
  const [editingEdu, setEditingEdu] = useState(false);
  const [eduDraft, setEduDraft] = useState([]);
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", year: "" });
  const displayLanguages = userProfile?.languages || [];
  const displaySkills = userProfile?.skills || [];
  const displayCertifications = userProfile?.certifications || [];
  const displayExperience = userProfile?.experience || [];
  const displayEducation = userProfile?.education || [];

  // Fetch user profile and CV analysis data
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!editingLanguages && displayLanguages) {
      setLanguagesDraft(displayLanguages);
    }
  }, [editingLanguages, displayLanguages]);

  useEffect(() => { if (!editingSkills) setSkillsDraft(displaySkills); }, [editingSkills, displaySkills]);
  useEffect(() => { if (!editingCerts) setCertsDraft(displayCertifications); }, [editingCerts, displayCertifications]);
  useEffect(() => { if (!editingContact) setContactDraft({ phone: userProfile?.phone || "", email: userProfile?.email || "" }); }, [editingContact, userProfile]);
  useEffect(() => { if (!editingExp) setExpDraft(displayExperience); }, [editingExp, displayExperience]);
  useEffect(() => { if (!editingEdu) setEduDraft(displayEducation); }, [editingEdu, displayEducation]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      const profileResponse = await fetch(`/api/user-profile?userId=${user.id}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
        setProfilePhoto(profileData.profilePhoto || null);
        
        // If there's CV analysis data, fetch it
        if (profileData.cvAnalysisId) {
          try {
            const cvResponse = await fetch(`/api/cv-analyze?userId=${user.id}`);
            if (cvResponse.ok) {
              const cvData = await cvResponse.json();
              setCvAnalysis(cvData);
            }
          } catch (cvError) {
            console.error('Error fetching CV analysis:', cvError);
            // Don't show error for CV analysis, it's optional
          }
        }
      } else if (profileResponse.status === 404) {
        // Profile doesn't exist yet, create a basic one
        setUserProfile({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.fullName || '',
          phone: '',
          profilePhoto: null,
          currentPosition: '',
          currentCompany: '',
          location: '',
          summary: '',
          skills: [],
          languages: [],
          certifications: [],
          education: [],
          experience: [],
          isProfileComplete: false
        });
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        const response = await fetch('/api/profile-photo', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setProfilePhoto(result.profilePhoto);
          setUserProfile(prev => ({ ...prev, profilePhoto: result.profilePhoto }));
        } else {
          throw new Error('Failed to upload photo');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        setError('Failed to upload photo. Please try again.');
      }
    }
  };

  // Delete custom photo (revert to Gmail photo)
  const handleDeletePhoto = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await fetch('/api/profile-photo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (response.ok) {
        setProfilePhoto(null);
        setUserProfile(prev => ({ ...prev, profilePhoto: null }));
        setPhotoMenuOpen(false);
      } else {
        throw new Error('Failed to delete photo');
      }
    } catch (error) {
      setError('Failed to delete photo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Use Gmail photo explicitly
  const handleUseGmailPhoto = async () => {
    try {
      setSaving(true);
      setError(null);
      const gmailPhoto = user.imageUrl;
      const response = await fetch('/api/profile-photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, profilePhoto: gmailPhoto }),
      });
      if (response.ok) {
        setProfilePhoto(gmailPhoto);
        setUserProfile(prev => ({ ...prev, profilePhoto: gmailPhoto }));
        setPhotoMenuOpen(false);
      } else {
        throw new Error('Failed to use Gmail photo');
      }
    } catch (error) {
      setError('Failed to use Gmail photo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle profile updates
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      const { createdAt, updatedAt, ...profileDataToSend } = userProfile || {};
      const payload = {
        ...profileDataToSend,
        ...editData,
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
      };
      console.log('Saving profile payload:', payload); // DEBUG: log payload including location
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        setEditData({});
        setEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add language
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languagesDraft.includes(newLanguage.trim())) {
      setLanguagesDraft([...languagesDraft, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  // Remove language
  const handleRemoveLanguage = (lang) => {
    setLanguagesDraft(languagesDraft.filter(l => l !== lang));
  };

  // Save languages
  const handleSaveLanguages = async () => {
    try {
      setSaving(true);
      setError(null);
      // Ensure languagesDraft is always an array of strings
      const safeLanguages = Array.isArray(languagesDraft) ? languagesDraft.filter(l => typeof l === 'string') : [];
      // Remove createdAt and updatedAt from userProfile before sending
      const { createdAt, updatedAt, ...profileDataToSend } = userProfile || {};
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileDataToSend,
          languages: safeLanguages,
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
        }),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        setEditingLanguages(false);
      } else {
        let errorMsg = 'Failed to update languages';
        try {
          const err = await response.json();
          errorMsg = err.error || errorMsg;
          console.error('API error:', err);
        } catch (e) {
          // ignore
        }
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      setError(error.message || 'Failed to update languages. Please try again.');
      console.error('handleSaveLanguages error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Skills and Tools Section (chip style, modern edit logic)
  const handleAddSkill = () => { if (newSkill.trim() && !skillsDraft.includes(newSkill.trim())) { setSkillsDraft([...skillsDraft, newSkill.trim()]); setNewSkill(""); } };
  const handleRemoveSkill = (skill) => setSkillsDraft(skillsDraft.filter(s => s !== skill));
  const handleSaveSkills = async () => { await handleProfileFieldSave({ skills: skillsDraft }); setEditingSkills(false); };

  // Certifications
  const handleAddCert = () => { if (newCert.trim() && !certsDraft.includes(newCert.trim())) { setCertsDraft([...certsDraft, newCert.trim()]); setNewCert(""); } };
  const handleRemoveCert = (cert) => setCertsDraft(certsDraft.filter(c => c !== cert));
  const handleSaveCerts = async () => { await handleProfileFieldSave({ certifications: certsDraft }); setEditingCerts(false); };

  // Contact Info
  const handleSaveContact = async () => { await handleProfileFieldSave({ phone: contactDraft.phone, email: contactDraft.email }); setEditingContact(false); };

  // Work Experience
  const handleAddExp = () => { if (newExp.title && newExp.company) { setExpDraft([...expDraft, { ...newExp }]); setNewExp({ title: "", company: "", duration: "", description: "" }); } };
  const handleRemoveExp = (idx) => setExpDraft(expDraft.filter((_, i) => i !== idx));
  const handleExpChange = (idx, field, value) => setExpDraft(expDraft.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  const handleSaveExp = async () => { await handleProfileFieldSave({ experience: expDraft }); setEditingExp(false); };

  // Education
  const handleAddEdu = () => { if (newEdu.degree && newEdu.institution) { setEduDraft([...eduDraft, { ...newEdu }]); setNewEdu({ degree: "", institution: "", year: "" }); } };
  const handleRemoveEdu = (idx) => setEduDraft(eduDraft.filter((_, i) => i !== idx));
  const handleEduChange = (idx, field, value) => setEduDraft(eduDraft.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));
  const handleSaveEdu = async () => { await handleProfileFieldSave({ education: eduDraft }); setEditingEdu(false); };

  // --- Generalized save helper ---
  const handleProfileFieldSave = async (fields) => {
    setSaving(true);
    setError(null);
    const { createdAt, updatedAt, ...profileDataToSend } = userProfile || {};
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileDataToSend,
          ...fields,
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
        }),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
      } else {
        let errorMsg = 'Failed to update profile';
        try { const err = await response.json(); errorMsg = err.error || errorMsg; } catch (e) {}
        setError(errorMsg);
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#be3144] mx-auto mb-4"></div>
          <p className="text-[#191011]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#191011] mb-4">Please sign in to view your profile</p>
          <Link href="/sign-in" className="bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-6 py-2 rounded-full">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.name || user.fullName || "User";
  const displayEmail = userProfile?.email || user.emailAddresses[0]?.emailAddress || "";
  const displayPhone = userProfile?.phone || "";
  const displayLocation = userProfile?.location || "";
  const displaySummary = userProfile?.summary || "";

  // Only show a photo if profilePhoto is set (custom or Gmail). If null, always show initials.
  let showInitials = false;
  let effectivePhoto = null;
  if (profilePhoto && profilePhoto !== "") {
    effectivePhoto = profilePhoto;
    showInitials = false;
  } else {
    showInitials = true;
  }

  // Get initials (first letter of first and last name)
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(userProfile?.name || user.fullName || "User");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf9f9] to-[#f1e9ea]">
      {/* Job Seeker Header */}
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
            {/* Profile avatar */}
            {user && (
              <div className="relative flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f1e9ea] to-[#e4d3d5] flex items-center justify-center overflow-hidden border-2 border-[#f1e9ea] shadow-sm">
                  {showInitials ? (
                    <span className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-sky-300 select-none">{initials}</span>
                  ) : (
                  <img
                      src={effectivePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-8 flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-t-2xl" />
          <div className="relative w-32 h-32 flex items-center justify-center">
            {showInitials ? (
              <div className="w-32 h-32 rounded-full bg-sky-300 flex items-center justify-center text-5xl font-bold text-white shadow-lg border-4 border-[#f1e9ea] select-none">
                {initials}
              </div>
            ) : (
              <img
                src={effectivePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#f1e9ea] shadow-lg"
              />
            )}
            {/* Edit photo button and menu */}
            <button
              className="absolute bottom-2 right-2 bg-white border border-[#e4d3d5] rounded-full p-2 shadow hover:bg-[#f1e9ea] transition-colors"
              onClick={() => fileInputRef.current.click()}
              title="Edit photo"
              type="button"
              disabled={saving}
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
            {/* Photo menu */}
            <div className="absolute top-2 right-2">
              <button
                className="bg-white border border-[#e4d3d5] rounded-full p-1 shadow hover:bg-[#f1e9ea] transition-colors"
                onClick={() => setPhotoMenuOpen((v) => !v)}
                type="button"
                disabled={saving}
              >
                <MoreVertical size={20} className="text-[#be3144]" />
              </button>
              {photoMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e4d3d5] rounded-lg shadow-lg z-10 animate-fade-in">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#f1e9ea] text-[#be3144]"
                    onClick={handleDeletePhoto}
                    disabled={saving || !profilePhoto}
                  >
                    <Trash2 size={16} /> Delete Photo
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[#f1e9ea] text-[#be3144]"
                    onClick={handleUseGmailPhoto}
                    disabled={saving || effectivePhoto === user.imageUrl}
                  >
                    <RefreshCw size={16} /> Use Gmail Photo
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 mt-4 md:mt-0 md:ml-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-extrabold text-[#191011]">{displayName}</h2>
              <button 
                className="text-[#be3144] hover:bg-[#f1e9ea] rounded-full p-1 transition-colors"
                onClick={() => setEditing(!editing)}
                disabled={saving}
              >
                {editing ? <X size={22} /> : <Pencil size={22} />}
              </button>
              <button className="text-[#be3144] hover:bg-[#f1e9ea] rounded-full p-1 transition-colors">
                <Share2 size={22} />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add your location"
                    className="w-full px-3 py-2 border border-[#e4d3d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                    value={editData.location ?? displayLocation}
                    onChange={e => setEditData({...editData, location: e.target.value})}
                    disabled={saving}
                  />
                  <button
                    onClick={async () => {
                      await handleSaveProfile();
                    }}
                    disabled={saving}
                    className="bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  {displayLocation && <div className="text-[#6b7280] flex items-center gap-1"><MapPin size={16} /> {displayLocation}</div>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Section (modern edit logic) */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#f1e9ea] bg-[#f9f6f6]">
            <div className="font-bold text-lg flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              Contact Info
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#f1e9ea] text-[#be3144] text-xs font-semibold px-3 py-1 rounded-full tracking-wide">ONLY COMPANIES CAN SEE THIS SECTION</span>
              {!editingContact && (
                <button onClick={() => { setEditingContact(true); setContactDraft({ phone: displayPhone, email: displayEmail }); }} className="ml-2 p-1 rounded-full border border-[#e4d3d5] hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} className="text-[#be3144]" /></button>
              )}
              {editingContact && (
                <>
                  <button onClick={handleSaveContact} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingContact(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          <div className="p-6 space-y-4 animate-fade-in">
            {editingContact ? (
              <>
                <div className="flex items-center gap-3 text-[#191011] text-base">
                  <Phone size={20} className="text-[#be3144]" />
                  <input
                    type="text"
                    value={contactDraft.phone}
                    onChange={e => setContactDraft({ ...contactDraft, phone: e.target.value })}
                    placeholder="Phone number"
                    className="px-2 py-1 border border-[#e4d3d5] rounded text-base focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                    disabled={saving}
                  />
                </div>
                <div className="flex items-center gap-3 text-[#191011] text-base">
                  <Mail size={20} className="text-[#be3144]" />
                  <input
                    type="email"
                    value={contactDraft.email}
                    onChange={e => setContactDraft({ ...contactDraft, email: e.target.value })}
                    placeholder="Email address"
                    className="px-2 py-1 border border-[#e4d3d5] rounded text-base focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                    disabled={saving}
                  />
                </div>
              </>
            ) : (
              <>
                {displayPhone && (
                  <div className="flex items-center gap-3 text-[#191011] text-base">
                    <Phone size={20} className="text-[#be3144]" />
                    <span>{displayPhone}</span>
                  </div>
                )}
                {displayEmail && (
                  <div className="flex items-center gap-3 text-[#191011] text-base">
                    <Mail size={20} className="text-[#be3144]" />
                    <span>{displayEmail}</span>
                  </div>
                )}
              </>
            )}
            <div>
              <Link href="/job-seeker/Upload-CV" className="inline-flex items-center gap-2 text-[#be3144] hover:text-[#f05941] font-semibold transition-colors text-base">
                <Upload size={20} />
                <span>Upload CV</span>
              </Link>
            </div>
            {saving && <div className="text-xs text-[#be3144] mt-1">Saving...</div>}
            {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Skills and Tools</div>
            </div>
            <div className="flex items-center gap-2">
              {!editingSkills && (
                <>
                  <button onClick={() => { setEditingSkills(true); setSkillsDraft(displaySkills); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => { setEditingSkills(true); setSkillsDraft(displaySkills); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Plus size={22} /></button>
                </>
              )}
              {editingSkills && (
                <>
                  <button onClick={handleSaveSkills} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingSkills(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          {editingSkills ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsDraft.map((skill, idx) => (
                <span key={skill + idx} className="flex items-center bg-gradient-to-r from-[#f1e9ea] to-[#fff] text-[#191011] px-3 py-1 rounded-full text-sm border border-[#e4d3d5] font-medium shadow-sm">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-[#be3144] hover:text-red-600"><X size={14} /></button>
                </span>
              ))}
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSkill(); }}
                placeholder="Add skill/tool"
                className="px-2 py-1 border border-[#e4d3d5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                style={{ minWidth: 120 }}
                disabled={saving}
              />
              <button onClick={handleAddSkill} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors text-[#be3144]" disabled={saving}><Plus size={18} /></button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((skill, idx) => (
                <span key={skill + idx} className="bg-gradient-to-r from-[#f1e9ea] to-[#fff] text-[#191011] px-3 py-1 rounded-full text-sm border border-[#e4d3d5] font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          )}
          {saving && <div className="text-xs text-[#be3144] mt-1">Saving...</div>}
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Languages</div>
            </div>
            <div className="flex items-center gap-2">
              {!editingLanguages && (
                <>
                  <button onClick={() => { setEditingLanguages(true); setLanguagesDraft(displayLanguages); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => { setEditingLanguages(true); setLanguagesDraft(displayLanguages); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Plus size={22} /></button>
                </>
              )}
              {editingLanguages && (
                <>
                  <button onClick={handleSaveLanguages} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingLanguages(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          {editingLanguages ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {languagesDraft.map((lang, idx) => (
                <span key={lang} className="flex items-center bg-gradient-to-r from-[#f1e9ea] to-[#fff] text-[#191011] px-3 py-1 rounded-full text-sm border border-[#e4d3d5] font-medium shadow-sm">
                  {lang}
                  <button onClick={() => handleRemoveLanguage(lang)} className="ml-2 text-[#be3144] hover:text-red-600"><X size={14} /></button>
                </span>
              ))}
              <input
                type="text"
                value={newLanguage}
                onChange={e => setNewLanguage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddLanguage(); }}
                placeholder="Add language"
                className="px-2 py-1 border border-[#e4d3d5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                style={{ minWidth: 100 }}
                disabled={saving}
              />
              <button onClick={handleAddLanguage} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors text-[#be3144]" disabled={saving}><Plus size={18} /></button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayLanguages.map((language, index) => (
                <span key={index} className="bg-gradient-to-r from-[#f1e9ea] to-[#fff] text-[#191011] px-3 py-1 rounded-full text-sm border border-[#e4d3d5] font-medium shadow-sm">
                  {language}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Certifications Section (old style, modern edit logic) */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Certifications</div>
            </div>
            <div className="flex items-center gap-2">
              {!editingCerts && (
                <>
                  <button onClick={() => { setEditingCerts(true); setCertsDraft(displayCertifications); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => { setEditingCerts(true); setCertsDraft(displayCertifications); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Plus size={22} /></button>
                </>
              )}
              {editingCerts && (
                <>
                  <button onClick={handleSaveCerts} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingCerts(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          {editingCerts ? (
            <div className="space-y-2 mb-2">
              {certsDraft.map((cert, idx) => (
                <div key={cert + idx} className="flex items-center gap-2 text-[#191011]">
                  <Award size={16} className="text-[#be3144]" />
                  <span>{cert}</span>
                  <button onClick={() => handleRemoveCert(cert)} className="ml-2 text-[#be3144] hover:text-red-600"><X size={14} /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newCert}
                  onChange={e => setNewCert(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCert(); }}
                  placeholder="Add certification"
                  className="px-2 py-1 border border-[#e4d3d5] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#be3144]"
                  style={{ minWidth: 180 }}
                  disabled={saving}
                />
                <button onClick={handleAddCert} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors text-[#be3144]" disabled={saving}><Plus size={18} /></button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {displayCertifications.map((cert, idx) => (
                <div key={cert + idx} className="flex items-center gap-2 text-[#191011]">
                  <Award size={16} className="text-[#be3144]" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          )}
          {saving && <div className="text-xs text-[#be3144] mt-1">Saving...</div>}
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>

        {/* Work Experience Section (old style, modern edit logic) */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Work Experience</div>
            </div>
            <div className="flex items-center gap-2">
              {!editingExp && (
                <>
                  <button onClick={() => { setEditingExp(true); setExpDraft(displayExperience); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => { setEditingExp(true); setExpDraft(displayExperience); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Plus size={22} /></button>
                </>
              )}
              {editingExp && (
                <>
                  <button onClick={handleSaveExp} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingExp(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          {editingExp ? (
            <div className="space-y-4 mb-2">
              {expDraft.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-[#be3144] pl-4 relative bg-[#f9f6f6] rounded-lg p-3">
                  <button onClick={() => handleRemoveExp(idx)} className="absolute top-2 right-2 text-[#be3144] hover:text-red-600"><X size={16} /></button>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={e => handleExpChange(idx, 'title', e.target.value)}
                    placeholder="Job Title"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm font-semibold text-[#191011] bg-white"
                    disabled={saving}
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => handleExpChange(idx, 'company', e.target.value)}
                    placeholder="Company"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                    disabled={saving}
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={e => handleExpChange(idx, 'duration', e.target.value)}
                    placeholder="Duration (e.g. 2020-2022)"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                    disabled={saving}
                  />
                  <textarea
                    value={exp.description}
                    onChange={e => handleExpChange(idx, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    className="block w-full px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#191011] bg-white"
                    rows={2}
                    disabled={saving}
                  />
                </div>
              ))}
              {/* Add new experience row */}
              <div className="border-l-4 border-dashed border-[#be3144] pl-4 bg-[#f9f6f6] rounded-lg p-3 flex flex-col gap-1">
                <input
                  type="text"
                  value={newExp.title}
                  onChange={e => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder="Job Title"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm font-semibold text-[#191011] bg-white"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={newExp.company}
                  onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                  placeholder="Company"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={newExp.duration}
                  onChange={e => setNewExp({ ...newExp, duration: e.target.value })}
                  placeholder="Duration (e.g. 2020-2022)"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                  disabled={saving}
                />
                <textarea
                  value={newExp.description}
                  onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                  placeholder="Description (optional)"
                  className="block w-full px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#191011] bg-white"
                  rows={2}
                  disabled={saving}
                />
                <button onClick={handleAddExp} className="mt-2 self-end bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm" disabled={saving || !newExp.title || !newExp.company}>
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayExperience.length > 0 ? (
                displayExperience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-[#be3144] pl-4">
                    <div className="font-semibold text-[#191011]">{exp.title}</div>
                    <div className="text-[#6b7280]">{exp.company}</div>
                    <div className="text-sm text-[#6b7280]">{exp.duration}</div>
                    {exp.description && <div className="text-[#191011] mt-2">{exp.description}</div>}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase size={48} className="text-[#e4d3d5] mx-auto mb-4" />
                  <p className="text-[#6b7280] mb-4">Add your work experience to stand out</p>
                </div>
              )}
            </div>
          )}
          {saving && <div className="text-xs text-[#be3144] mt-1">Saving...</div>}
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>

        {/* Education Section (old style, modern edit logic) */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">Education</div>
            </div>
            <div className="flex items-center gap-2">
              {!editingEdu && (
                <>
                  <button onClick={() => { setEditingEdu(true); setEduDraft(displayEducation); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => { setEditingEdu(true); setEduDraft(displayEducation); }} className="p-1 rounded-full hover:bg-[#f1e9ea] transition-colors"><Plus size={22} /></button>
                </>
              )}
              {editingEdu && (
                <>
                  <button onClick={handleSaveEdu} disabled={saving} className="p-1 rounded-full hover:bg-green-100 transition-colors text-green-700"><Save size={20} /></button>
                  <button onClick={() => setEditingEdu(false)} className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-700"><X size={20} /></button>
                </>
              )}
            </div>
          </div>
          {editingEdu ? (
            <div className="space-y-4 mb-2">
              {eduDraft.map((edu, idx) => (
                <div key={idx} className="border-l-4 border-[#be3144] pl-4 relative bg-[#f9f6f6] rounded-lg p-3">
                  <button onClick={() => handleRemoveEdu(idx)} className="absolute top-2 right-2 text-[#be3144] hover:text-red-600"><X size={16} /></button>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => handleEduChange(idx, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm font-semibold text-[#191011] bg-white"
                    disabled={saving}
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={e => handleEduChange(idx, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                    disabled={saving}
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={e => handleEduChange(idx, 'year', e.target.value)}
                    placeholder="Year (e.g. 2022)"
                    className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                    disabled={saving}
                  />
                </div>
              ))}
              {/* Add new education row */}
              <div className="border-l-4 border-dashed border-[#be3144] pl-4 bg-[#f9f6f6] rounded-lg p-3 flex flex-col gap-1">
                <input
                  type="text"
                  value={newEdu.degree}
                  onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                  placeholder="Degree"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm font-semibold text-[#191011] bg-white"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={newEdu.institution}
                  onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })}
                  placeholder="Institution"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={newEdu.year}
                  onChange={e => setNewEdu({ ...newEdu, year: e.target.value })}
                  placeholder="Year (e.g. 2022)"
                  className="block w-full mb-1 px-2 py-1 border border-[#e4d3d5] rounded text-sm text-[#6b7280] bg-white"
                  disabled={saving}
                />
                <button onClick={handleAddEdu} className="mt-2 self-end bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm" disabled={saving || !newEdu.degree || !newEdu.institution}>
                  <Plus size={16} /> Add Education
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayEducation.length > 0 ? (
                displayEducation.map((edu, index) => (
                  <div key={index} className="border-l-4 border-[#be3144] pl-4">
                    <div className="font-semibold text-[#191011]">{edu.degree}</div>
                    <div className="text-[#6b7280]">{edu.institution}</div>
                    <div className="text-sm text-[#6b7280]">{edu.year}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <GraduationCap size={48} className="text-[#e4d3d5] mx-auto mb-4" />
                  <p className="text-[#6b7280] mb-4">Add your educational background</p>
                </div>
              )}
            </div>
          )}
          {saving && <div className="text-xs text-[#be3144] mt-1">Saving...</div>}
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>

        {/* CV Analysis Summary */}
        {cvAnalysis && (
          <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
            <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
              <div className="font-bold text-lg text-[#191011]">CV Analysis Summary</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#be3144]" />
                <span className="font-medium">Analysis completed on {new Date(cvAnalysis.createdAt).toLocaleDateString()}</span>
              </div>
              {cvAnalysis.feedback && (
                <div className="bg-[#f1e9ea] p-4 rounded-lg">
                  <p className="text-[#191011]">{cvAnalysis.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Completion Status */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#f1e9ea] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941] mr-2"></span>
            <div className="font-bold text-lg text-[#191011]">Profile Completion</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#191011]">Profile Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProfile?.isProfileComplete 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userProfile?.isProfileComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <div className="w-full bg-[#f1e9ea] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#be3144] to-[#f05941] h-2 rounded-full transition-all duration-300"
                style={{ width: `${userProfile?.isProfileComplete ? 100 : 60}%` }}
              ></div>
            </div>
            {!userProfile?.isProfileComplete && (
              <p className="text-sm text-[#6b7280]">
                Complete your profile to get better job recommendations
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 