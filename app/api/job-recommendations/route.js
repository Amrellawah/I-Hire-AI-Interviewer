import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserProfile, JobDetails, JobRecommendation, callInterview, MockInterview } from '@/utils/schema';
import { eq, and, or, like, inArray } from 'drizzle-orm';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const userProfiles = await db.select().from(UserProfile).where(eq(UserProfile.userId, userId));
    
    if (userProfiles.length === 0) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const userProfile = userProfiles[0];

    // Get all available jobs from callInterview and MockInterview (not JobDetails)
    const allCallInterviews = await db.select().from(callInterview);
    const allMockInterviews = await db.select().from(MockInterview).where(eq(MockInterview.isHidden, false));
    const callJobsWithType = allCallInterviews.map(j => ({ ...j, _type: 'call', type: 'Call Interview', jobDescription: j.jobDescription }));
    const mockJobsWithType = allMockInterviews.map(j => ({ ...j, _type: 'mock', type: 'Video Interview', jobDescription: j.jobDesc }));

    // Normalize jobs to expected structure
    const normalizeJob = (job) => ({
      ...job,
      id: job.job_id || job.mockId, // unique id for matching
      jobTitle: job.jobPosition || job.jobTitle, // ensure jobTitle is present
      company: job.recruiterName || job.createdBy || job.company || job.city,
      city: job.location || job.city,
      skills: job.skills || '',
      jobCategories: job.category ? [job.category] : [],
      minExperience: job.minExperience || job.experience || 0,
      jobDescription: job.jobDescription || job.jobDesc || '',
      _type: job._type,
      job_id: job.job_id,
      mockId: job.mockId,
      type: job.type,
    });

    const allJobs = [
      ...callJobsWithType.map(normalizeJob),
      ...mockJobsWithType.map(normalizeJob)
    ];

    if (allJobs.length === 0) {
      return NextResponse.json({
        recommendations: [],
        userProfile: {
          name: userProfile.name,
          skills: userProfile.skills,
          experience: userProfile.experience
        },
        message: 'No jobs available for recommendations'
      });
    }

    // Debug logging
    console.log('User profile:', userProfile);
    console.log('All jobs:', allJobs);

    // Dynamically import jobMatcherService to avoid build issues
    let jobMatcherService;
    let modelStatus = { isLoaded: false, message: 'Model not available in server environment' };
    let recommendations = [];
    
    try {
      const jobMatcherModule = await import('@/utils/jobMatcherModel');
      jobMatcherService = jobMatcherModule.default;
      
      // Generate recommendations using the job matcher service
      // This will automatically use fallback if model is not available
      recommendations = await jobMatcherService.generateRecommendations(
        userProfile, 
        allJobs, 
        limit
      );
      
      modelStatus = await jobMatcherService.getModelStatus();
    } catch (error) {
      console.log('Job matcher model not available:', error.message);
      // Use basic fallback recommendations
      recommendations = allJobs.slice(0, limit).map((job, index) => ({
        jobId: job.id,
        jobTitle: job.jobTitle,
        company: job.company,
        city: job.city,
        matchScore: Math.max(50, 100 - index * 5), // Basic scoring
        reason: 'Based on available job listings',
        job: job
      }));
    }

    console.log('Recommendations:', recommendations);

    // Save recommendations to database - but skip if jobDetailsId is missing
    // Since we're using callInterview and MockInterview tables, we don't have jobDetailsId
    // We'll just return the recommendations without saving to JobRecommendation table
    console.log('Skipping database save for recommendations (using call/mock interviews)');

    // Attach _type and ids to each recommendation (copy from job object to top level)
    const recommendationsWithJobFields = recommendations.map(rec => {
      return {
        ...rec,
        _type: rec.job?._type,
        job_id: rec.job?.job_id,
        mockId: rec.job?.mockId,
        jobDescription: rec.job?.jobDescription,
        jobPosition: rec.job?.jobPosition,
        createdAt: rec.job?.createdAt,
        recruiterName: rec.job?.recruiterName,
        createdBy: rec.job?.createdBy,
        location: rec.job?.city || rec.job?.location,
      };
    });

    return NextResponse.json({
      recommendations: recommendationsWithJobFields,
      userProfile: {
        name: userProfile.name,
        skills: userProfile.skills,
        experience: userProfile.experience,
        currentPosition: userProfile.currentPosition
      },
      modelStatus
    });
  } catch (error) {
    console.error('Error generating job recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate job recommendations',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId, jobDetailsId, action } = await req.json();

    if (!userId || !jobDetailsId || !action) {
      return NextResponse.json(
        { error: 'userId, jobDetailsId, and action are required' },
        { status: 400 }
      );
    }

    // Update recommendation status
    const updateData = {};
    if (action === 'view') {
      updateData.isViewed = true;
    } else if (action === 'apply') {
      updateData.isApplied = true;
    }

    const [updatedRecommendation] = await db.update(JobRecommendation)
      .set(updateData)
      .where(and(
        eq(JobRecommendation.userId, userId),
        eq(JobRecommendation.jobDetailsId, jobDetailsId)
      ))
      .returning();

    return NextResponse.json(updatedRecommendation);
  } catch (error) {
    console.error('Error updating job recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update job recommendation' },
      { status: 500 }
    );
  }
} 