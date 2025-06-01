"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateOptions from '../_components/CreateOptions';

const jobCategories = [
  'Accounting/Finance',
  'Administration',
  'Banking',
  'R&D/Science',
  'Engineering - Construction/Civil/Architecture',
  'Business Development',
  'Creative/Design/Art',
  'Customer Service/Support',
  'Writing/Editorial',
  'Hospitality/Hotels/Food Services',
  'Human Resources',
  'Installation/Maintenance/Repair',
  'IT/Software Development',
  'Legal',
  'Logistics/Supply Chain',
  'Operations/Management',
  'Manufacturing/Production',
  'Marketing/PR/Advertising',
  'Medical/Healthcare',
  'Other',
  'Project/Program Management',
  'Quality',
  'Analyst/Research',
  'Sales/Retail',
  'Media/Journalism/Publishing',
  'Sports and Leisure',
  'Fashion',
  'Pharmaceutical',
  'Tourism/Travel',
  'Purchasing/Procurement',
  'Strategy/Consulting',
  'C-Level Executive/GM/Director',
];
const jobTypes = [
  'Full Time', 'Part Time', 'Freelance / Project', 'Shift Based', 'Volunteering'
];
const workplaces = ['On-site', 'Remote', 'Hybrid'];
const countries = ['Egypt', 'USA', 'UK', 'Germany', 'India'];
const cities = {
  Egypt: ['Cairo', 'Alexandria', 'Giza'],
  USA: ['New York', 'San Francisco', 'Los Angeles'],
  UK: ['London', 'Manchester'],
  Germany: ['Berlin', 'Munich'],
  India: ['Delhi', 'Mumbai'],
};
const careerLevels = [
  { label: 'Experienced', sub: 'Non-Manager' },
  { label: 'Manager', sub: '' },
  { label: 'Senior Management', sub: 'CEO, GM, Director, Head' },
  { label: 'Entry Level', sub: 'Junior Level / Fresh Grad' },
  { label: 'Student', sub: 'Undergrad / Postgrad' },
];
const currencyOptions = [
  { label: 'Egyptian Pound', value: 'EGP' },
  { label: 'US Dollar', value: 'USD' },
  { label: 'Euro', value: 'EUR' },
];
const periodOptions = [
  { label: 'Per Month', value: 'Per Month' },
  { label: 'Per Year', value: 'Per Year' },
  { label: 'Per Week', value: 'Per Week' },
];

export default function PostJobPage() {
  const [step, setStep] = useState('jobDetails'); // 'jobDetails' | 'chooseType'
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('Egypt');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [hideSalary, setHideSalary] = useState(false);
  const [additionalSalary, setAdditionalSalary] = useState('');
  const [vacancies, setVacancies] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReq, setJobReq] = useState('');
  const [skills, setSkills] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [period, setPeriod] = useState('Per Month');
  const [showCurrencyEdit, setShowCurrencyEdit] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [academicExcellence, setAcademicExcellence] = useState(false);
  const genderOptions = [
    'No Preference', 'Males Only', 'Females Only', 'Males Preferred', 'Females Preferred'
  ];
  const educationOptions = [
    'Not Specified', 'High School (or equivalent)', 'Diploma',
    "Bachelor's Degree", "Master's Degree", 'Doctorate', 'MBA'
  ];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else if (selectedTypes.length < 3) {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  const handleWorkplace = (wp) => setSelectedWorkplace(wp);
  const handleCareer = (cl) => setSelectedCareer(cl);

  const handleJobDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Collect all job details into an object
    const details = {
      jobTitle,
      jobCategories: selectedCategories,
      jobTypes: selectedTypes,
      workplace: selectedWorkplace,
      country: selectedCountry,
      city: selectedCity,
      careerLevel: selectedCareer,
      minExperience: minExp ? parseInt(minExp) : null,
      maxExperience: maxExp ? parseInt(maxExp) : null,
      minSalary: minSalary ? parseInt(minSalary) : null,
      maxSalary: maxSalary ? parseInt(maxSalary) : null,
      currency,
      period,
      hideSalary,
      additionalSalary,
      vacancies,
      jobDescription: jobDesc,
      jobRequirements: jobReq,
      skills,
      gender,
      education,
      academicExcellence,
    };
    try {
      const response = await fetch('/api/job-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      if (data.success) {
        setJobDetails({ ...details, id: data.id });
        setStep('chooseType');
      } else {
        setError('Failed to save job details');
      }
    } catch (err) {
      setError('Failed to save job details');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseType = (type) => {
    if (!jobDetails || !jobDetails.id) {
      setError('Job details must be saved first.');
      return;
    }
    if (type === 'mock') {
      router.push(`/dashboard/create-mock-interview?jobDetailsId=${jobDetails.id}`);
    } else if (type === 'call') {
      router.push(`/dashboard/create-interview?jobDetailsId=${jobDetails.id}`);
    }
  };

  if (step === 'chooseType') {
    // Reuse your CreateOptions component, but override navigation to use handleChooseType
    return (
      <div className="min-h-screen bg-[#fdf4f4] flex items-center justify-center py-12">
        <CreateOptions onChoose={handleChooseType} />
      </div>
    );
  }

  // Default: show job details form
  return (
    <form onSubmit={handleJobDetailsSubmit}>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 my-10 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-[#191011] tracking-tight">Job Details</h2>
        <div className="space-y-8">
          {/* Job Title */}
          <div>
            <label className="font-semibold text-base mb-2 block">Job Title</label>
            <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" className="mt-1 h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
          </div>
          {/* Job Category */}
          <div>
            <label className="font-semibold text-base mb-2 block">Job Category <span className="text-gray-400">— max. 3</span></label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 p-2 rounded-xl min-h-[48px] items-center bg-white border border-gray-300">
                {selectedCategories.map(cat => (
                  <span key={cat} className="flex items-center bg-gradient-to-r from-[#be3144] to-[#f05941] text-white rounded px-3 py-1 text-sm font-medium mr-1 mb-1 shadow-sm">
                    {cat}
                    <button
                      type="button"
                      className="ml-1 focus:outline-none"
                      onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                      aria-label={`Remove ${cat}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                <Select
                  value={""}
                  onValueChange={value => {
                    if (!selectedCategories.includes(value) && selectedCategories.length < 3) {
                      setSelectedCategories([...selectedCategories, value]);
                    }
                  }}
                >
                  <SelectTrigger className="flex-1 min-w-[120px] bg-transparent border-0 shadow-none focus:ring-0 focus:border-0 h-8">
                    <SelectValue placeholder={selectedCategories.length === 0 ? "Select at least one job category" : ""} />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 shadow-lg max-h-72 overflow-y-auto z-50">
                    {jobCategories.filter(cat => !selectedCategories.includes(cat)).map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">You can select up to 3 categories.</div>
          </div>
          {/* Job Type */}
          <div>
            <label className="font-semibold text-base mb-2 block">Job Type <span className="text-gray-400">— max. 3</span></label>
            <div className="flex flex-wrap gap-2 mt-2">
              {jobTypes.map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedTypes.includes(type) ? undefined : 'outline'}
                  size="sm"
                  onClick={() => handleType(type)}
                  className={selectedTypes.includes(type)
                    ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-0 shadow-sm'
                    : 'bg-white border-gray-300 hover:border-[#be3144]'}
                >
                  {type} {selectedTypes.includes(type) ? '✓' : '+'}
                </Button>
              ))}
            </div>
          </div>
          {/* Workplace */}
          <div>
            <label className="font-semibold text-base mb-2 block">Workplace</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {workplaces.map(wp => (
                <Button
                  key={wp}
                  type="button"
                  variant={selectedWorkplace === wp ? undefined : 'outline'}
                  size="sm"
                  onClick={() => handleWorkplace(wp)}
                  className={selectedWorkplace === wp
                    ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-0 shadow-sm'
                    : 'bg-white border-gray-300 hover:border-[#be3144]'}
                >
                  {wp}
                </Button>
              ))}
            </div>
          </div>
          {/* Job Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-base mb-2 block">Country</label>
              <select className="w-full border rounded-xl px-3 py-3 mt-1 bg-gray-50 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30" value={selectedCountry} onChange={e => { setSelectedCountry(e.target.value); setSelectedCity(''); }}>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold text-base mb-2 block">City</label>
              <select className="w-full border rounded-xl px-3 py-3 mt-1 bg-gray-50 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                <option value="">Select city</option>
                {cities[selectedCountry]?.map(city => <option key={city}>{city}</option>)}
              </select>
            </div>
          </div>
          {/* Career Level */}
          <div>
            <h2 className="text-xl font-bold mb-4 mt-2">Career Level</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {careerLevels.map(cl => {
                const selected = selectedCareer === cl.label;
                return (
                  <Button
                    key={cl.label}
                    type="button"
                    variant={selected ? undefined : 'outline'}
                    size="lg"
                    onClick={() => handleCareer(cl.label)}
                    className={
                      (selected
                        ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-0 shadow-lg scale-105'
                        : 'bg-white text-[#191011] border border-gray-300 hover:border-[#be3144] hover:bg-[#f9f6f6]') +
                      ' flex flex-col items-start w-full px-4 py-3 sm:px-6 sm:py-4 transition-all duration-200 rounded-2xl focus:ring-2 focus:ring-[#be3144]/40 hover:shadow-md min-h-[64px] sm:min-h-[70px] text-base sm:text-lg'
                    }
                  >
                    <span className="font-bold text-base sm:text-lg mb-1">{cl.label}</span>
                    {cl.sub && (
                      <span className={
                        selected
                          ? 'text-white text-xs opacity-80 font-normal'
                          : 'text-gray-400 text-xs font-normal'
                      }>
                        {cl.sub}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
          {/* Years of Experience */}
          <div>
            <label className="font-semibold text-base mb-2 block">Years of Experience</label>
            <div className="flex gap-2 mt-1">
              <Input placeholder="Min" value={minExp} onChange={e => setMinExp(e.target.value)} className="h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
              <span className="self-center">to</span>
              <Input placeholder="Max" value={maxExp} onChange={e => setMaxExp(e.target.value)} className="h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
            </div>
          </div>
          {/* Salary Range */}
          <div>
            <label className="font-semibold text-base mb-2 block">Salary Range</label>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3 mt-2">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input placeholder="e.g. 8,000" value={minSalary} onChange={e => setMinSalary(e.target.value)} className="h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-white rounded-xl" />
                  <span className="self-center">to</span>
                  <Input placeholder="e.g. 12,000" value={maxSalary} onChange={e => setMaxSalary(e.target.value)} className="h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-white rounded-xl" />
                </div>
                <span className="text-xs text-gray-500 ml-0 sm:ml-2 mt-2 sm:mt-0 flex items-center gap-2">
                  {showCurrencyEdit ? (
                    <>
                      <select
                        className="border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#be3144]/50"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                      >
                        {currencyOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        className="border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#be3144]/50"
                        value={period}
                        onChange={e => setPeriod(e.target.value)}
                      >
                        {periodOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <Button type="button" size="sm" variant="ghost" className="text-[#be3144] ml-2 px-2 py-1" onClick={() => setShowCurrencyEdit(false)}>
                        Done
                      </Button>
                    </>
                  ) : (
                    <>
                      {currency}/
                      {period}
                      <button type="button" className="text-[#be3144] underline ml-2 text-xs font-semibold" onClick={() => setShowCurrencyEdit(true)}>
                        Change
                      </button>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={hideSalary} onChange={e => setHideSalary(e.target.checked)} className="accent-[#be3144] w-4 h-4" />
                <span className="text-sm">Hide salary in job post (will only be used for recommendations)</span>
              </div>
              <span className="text-xs mt-1" style={{ color: '#be3144' }}>Showing salary attracts more candidates</span>
            </div>
          </div>
          {/* Additional Salary Details */}
          <div>
            <label className="font-semibold text-base mb-2 block">Additional Salary Details <span className="text-gray-400">— optional</span></label>
            <Textarea value={additionalSalary} onChange={e => setAdditionalSalary(e.target.value)} placeholder="e.g. Commissions and bonuses" maxLength={200} className="mt-1 h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
            <div className="text-xs text-gray-400 text-right">{additionalSalary.length}/200</div>
          </div>
          {/* Number of Vacancies */}
          <div>
            <label className="font-semibold text-base mb-2 block">Number of Vacancies</label>
            <div className="flex items-center gap-2 mt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setVacancies(Math.max(1, vacancies - 1))} className="rounded-full w-9 h-9 text-lg">-</Button>
              <span className="px-3 text-lg font-semibold">{vacancies}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setVacancies(vacancies + 1)} className="rounded-full w-9 h-9 text-lg">+</Button>
            </div>
          </div>
          {/* About The Job */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-xl font-bold mb-4">About The Job</h2>
            <div className="mb-4">
              <label className="font-semibold text-base mb-2 block">Job Description</label>
              <Textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Describe the job, responsibilities, and expectations" rows={5} className="mt-1 h-28 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
            </div>
            <div className="mb-4">
              <label className="font-semibold text-base mb-2 block">Job Requirements</label>
              <Textarea value={jobReq} onChange={e => setJobReq(e.target.value)} placeholder="List the requirements for the job" rows={4} className="mt-1 h-24 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
            </div>
            <div className="mb-4">
              <label className="font-semibold text-base mb-2 block">Skills and Tools</label>
              <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Enter keywords including any related job titles, technologies, or keywords the candidate should have in their CV." className="mt-1 h-12 text-base border-gray-300 focus:border-[#be3144] focus:ring-2 focus:ring-[#be3144]/30 bg-gray-50 rounded-xl" />
            </div>
          </div>
          {/* Advanced Settings */}
          <div className="bg-[#f9f6f6] border border-gray-200 rounded-2xl p-4 sm:p-6 mt-10 mb-6 shadow-sm">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAdvanced(v => !v)}>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">Advanced Settings</h2>
                <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#be3144]" /> : <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#be3144]" />}
            </div>
            {showAdvanced && (
              <div className="mt-2 sm:mt-3 space-y-6 sm:space-y-8">
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 leading-relaxed">All the below requirements are optional. If you don't need them, skip them. However, they can help us provide you with much better candidate recommendations, especially if this job is for a technical position.</p>
                {/* Gender */}
                <div>
                  <label className="font-semibold text-sm sm:text-base mb-2 block">Gender</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {genderOptions.map(opt => (
                      <Button
                        key={opt}
                        type="button"
                        variant={gender === opt ? undefined : 'outline'}
                        size="lg"
                        onClick={() => setGender(gender === opt ? '' : opt)}
                        className={
                          (gender === opt
                            ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-0 shadow-md scale-105'
                            : 'bg-white text-[#191011] border border-gray-300 hover:border-[#be3144] hover:bg-[#f9f6f6]') +
                          ' w-full px-3 py-2 sm:px-4 sm:py-3 transition-all duration-200 rounded-xl focus:ring-2 focus:ring-[#be3144]/40 hover:shadow-md text-xs sm:text-base'
                        }
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Education Level */}
                <div>
                  <label className="font-semibold text-sm sm:text-base mb-2 block">Education Level</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {educationOptions.map(opt => (
                      <Button
                        key={opt}
                        type="button"
                        variant={education === opt ? undefined : 'outline'}
                        size="lg"
                        onClick={() => setEducation(education === opt ? '' : opt)}
                        className={
                          (education === opt
                            ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-0 shadow-md scale-105'
                            : 'bg-white text-[#191011] border border-gray-300 hover:border-[#be3144] hover:bg-[#f9f6f6]') +
                          ' w-full px-3 py-2 sm:px-4 sm:py-3 transition-all duration-200 rounded-xl focus:ring-2 focus:ring-[#be3144]/40 hover:shadow-md text-xs sm:text-base'
                        }
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Academic Excellence */}
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={academicExcellence}
                    onChange={e => setAcademicExcellence(e.target.checked)}
                    className="accent-[#be3144] w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    id="academic-excellence"
                  />
                  <label htmlFor="academic-excellence" className="text-xs sm:text-base font-medium select-none">Academic Excellence is important</label>
                </div>
                <p className="text-xs text-gray-300 ml-6 -mt-2">(i.e. job seeker with excellent and very good grade will be preferred)</p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <Button type="submit" className="px-8 py-3 bg-gradient-to-r from-[#be3144] to-[#f05941] text-white font-semibold rounded-xl shadow-md hover:from-[#a31d1d] hover:to-[#be3144] transition-all duration-200 text-lg" disabled={loading}>
              {loading ? 'Posting...' : 'Save & Continue'}
            </Button>
          </div>
          {success && <div className="text-green-600 font-semibold mt-4 text-center">Job posted successfully!</div>}
          {error && <div className="text-red-600 font-semibold mt-4 text-center">{error}</div>}
        </div>
      </div>
    </form>
  );
} 