"use client"
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Star, Eye, Send, Loader2, TrendingUp, Brain, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';
import clientJobMatcherModel from '@/utils/clientModelLoader';
import CircularProgress from '@/components/ui/circular-progress';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobRecommendations() {
  const [enhancedRecommendations, setEnhancedRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelStatus, setModelStatus] = useState(null);
  const [hiddenJobIds, setHiddenJobIds] = useState([]);
  const [rawRecommendations, setRawRecommendations] = useState([]);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      generateEnhancedRecommendations();
      checkModelStatus();
    }
  }, [isLoaded, user]);

  const checkModelStatus = async () => {
    try {
      const response = await fetch('/api/model-status');
      const data = await response.json();
      if (response.ok) {
        setModelStatus(data.status);
      }
    } catch (error) {
      console.error('Error checking model status:', error);
    }
  };

  const generateEnhancedRecommendations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/job-recommendations?userId=${user.id}&limit=50`);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 404) {
          setUserProfile(data.userProfile || {});
          setRawRecommendations([]);
          setEnhancedRecommendations([]);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch job data for enhancement');
      }
      setRawRecommendations(data.recommendations);
      setUserProfile(data.userProfile);
      const mapped = data.recommendations.map(job => {
        if (job._type === 'call' || job._type === 'mock') return job;
        if (job.job_id) {
          return {
            ...job,
            _type: 'call',
            jobPosition: job.jobPosition || job.jobTitle,
            jobDescription: job.jobDescription || job.jobDesc || job.jobDescription,
          };
        } else if (job.mockId) {
          return {
            ...job,
            _type: 'mock',
            jobPosition: job.jobPosition || job.jobTitle,
            jobDescription: job.jobDescription || job.jobDesc || job.jobDescription,
          };
        }
        return null;
      }).filter(Boolean);
      setEnhancedRecommendations(mapped);
      if (typeof window !== 'undefined') {
        console.log('Raw recommendations from API:', data.recommendations);
        console.log('Mapped recommendations:', mapped);
      }
    } catch (error) {
      if (!error.message.includes('404')) {
        console.error('Error generating enhanced recommendations:', error);
        setError('Failed to generate enhanced recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#be3144]" />
        <span className="ml-2 text-[#8e575f]">Loading your account...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <TrendingUp className="w-12 h-12 text-[#8e575f] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#191011] mb-2">Sign In for AI-Powered Job Recommendations</h3>
        <p className="text-[#8e575f] mb-4">
          Please sign in to get personalized job recommendations powered by our fine-tuned AI model.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#be3144]" />
        <span className="ml-2 text-[#8e575f]">Loading AI-powered job recommendations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <Button 
          onClick={generateEnhancedRecommendations}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const filteredRecommendations = enhancedRecommendations.filter(job => !hiddenJobIds.includes(job._type === 'call' ? job.job_id : job.mockId));

  if (filteredRecommendations.length === 0) {
    if (rawRecommendations.length > 0) {
      return (
        <div className="text-center p-8">
          <TrendingUp className="w-12 h-12 text-[#8e575f] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#be3144] mb-2">No valid jobs with _type found</h3>
          <p className="text-[#8e575f] mb-4">Raw jobs from API (check console for details):</p>
          <pre className="text-xs text-left bg-[#f1e9ea] p-2 rounded max-h-60 overflow-auto" style={{whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{JSON.stringify(rawRecommendations, null, 2)}</pre>
        </div>
      );
    }
    return (
      <div className="text-center p-8">
        <TrendingUp className="w-12 h-12 text-[#8e575f] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#191011] mb-2">No Job Recommendations Yet</h3>
        <p className="text-[#8e575f] mb-4">
          Upload your CV to get personalized job recommendations powered by our fine-tuned AI model.
        </p>
        <Button 
          onClick={() => window.location.href = '/job-seeker/Upload-CV'}
          className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54]"
        >
          Upload CV
        </Button>
      </div>
    );
  }

  const isProfileEmpty = userProfile &&
    !userProfile.skills?.length &&
    !userProfile.experience?.length &&
    !userProfile.currentPosition;

  if (isProfileEmpty) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-[#191011] mb-2">
          Your profile is empty
        </h3>
        <p className="text-[#8e575f] mb-4">
          Please upload your CV to get personalized job recommendations powered by our AI model.
        </p>
        <Button 
          onClick={() => window.location.href = '/job-seeker/Upload-CV'}
          className="bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54]"
        >
          Upload CV
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-[#191011]">
              AI-Enhanced Job Recommendations
            </h2>
            <Sparkles className="w-5 h-5 text-[#be3144]" />
          </div>
          <p className="text-[#8e575f]">
            Powered by fine-tuned semantic matching model
          </p>
          {modelStatus && (
            <div className="flex items-center gap-2 mt-2">
              <Brain className="w-4 h-4 text-[#8e575f]" />
              <span className="text-xs text-[#8e575f]">
                AI semantic matching model active
              </span>
            </div>
          )}
        </div>
        <Button 
          onClick={generateEnhancedRecommendations}
          variant="outline"
          size="sm"
          className="border-[#be3144] text-[#be3144] hover:bg-[#be3144]/10"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRecommendations.map((job) => {
          const key = job._type === 'call' ? job.job_id : job.mockId;
          const handleViewDetails = () => {
            if (job._type === 'call') {
              router.push(`/job-seeker/job/call/${job.job_id}`);
            } else {
              router.push(`/job-seeker/job/mock/${job.mockId}`);
            }
          };
          return (
            <div key={key} className="relative group p-0 rounded-2xl overflow-hidden shadow-lg border border-[#f1e9ea] bg-white hover:shadow-xl hover:border-[#be3144]/50 transition-all duration-200 hover:scale-[1.01] flex flex-col h-full">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#be3144] to-[#f05941]" />
              <div className="flex items-center gap-4 px-6 pt-6 pb-2">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#be3144] to-[#f05941] flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white group-hover:border-[#be3144] transition-all">
                  {job.jobPosition?.charAt(0) || 'J'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-xl text-[#191011] truncate mb-1 group-hover:text-[#be3144] transition-colors flex items-center gap-2">
                    {job.jobPosition}
                    {typeof job.matchScore === 'number' && (
                      <span className="inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#f1e9ea] text-[#be3144] border border-[#e4d3d5]">
                        Match: {job.matchScore}%
                      </span>
                    )}
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
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </span>
                    )}
                    {job.createdAt && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
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
        })}
      </div>
      <div className="text-center pt-4">
        <p className="text-sm text-[#8e575f]">
          Powered by AI semantic matching
        </p>
      </div>
    </div>
  );
} 