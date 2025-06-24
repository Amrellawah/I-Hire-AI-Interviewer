import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserProfile, JobDetails, JobRecommendation } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { userId, cvText } = await req.json();

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

    // Dynamically import jobMatcherService to avoid build issues
    let jobMatcherService;
    let processedCVText = '';
    let modelStatus = { isLoaded: false, message: 'Model not available in server environment' };
    
    try {
      const jobMatcherModule = await import('@/utils/jobMatcherModel');
      jobMatcherService = jobMatcherModule.default;
      
      // Process CV text if provided
      if (cvText) {
        processedCVText = await jobMatcherService.processCVText(cvText);
      }
      
      modelStatus = await jobMatcherService.getModelStatus();
    } catch (error) {
      console.log('Job matcher model not available:', error.message);
      // Continue with fallback recommendations
    }

    // Get all available jobs
    const allJobs = await db.select().from(JobDetails).limit(100);

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

    // Generate recommendations
    let recommendations = [];
    if (jobMatcherService) {
      try {
        recommendations = await jobMatcherService.generateRecommendations(
          userProfile, 
          allJobs, 
          15, // Get more recommendations for CV-enhanced matching
          processedCVText
        );
      } catch (error) {
        console.log('Using fallback recommendations due to model error:', error.message);
        recommendations = jobMatcherService.generateFallbackRecommendations(
          userProfile, 
          allJobs, 
          15
        );
      }
    } else {
      // Use basic fallback if model is not available
      const basicRecommendations = allJobs.slice(0, 10).map((job, index) => ({
        jobId: job.id,
        jobTitle: job.jobTitle,
        company: job.company,
        city: job.city,
        matchScore: Math.max(50, 100 - index * 5), // Basic scoring
        reason: 'Based on available job listings'
      }));
      recommendations = basicRecommendations;
    }

    // Save recommendations to database
    for (const recommendation of recommendations) {
      await db.insert(JobRecommendation).values({
        userId,
        jobDetailsId: recommendation.jobId,
        matchScore: recommendation.matchScore,
        recommendationReason: recommendation.reason,
        isViewed: false,
        isApplied: false
      }).onConflictDoNothing();
    }

    return NextResponse.json({
      recommendations: recommendations.slice(0, 10), // Return top 10
      userProfile: {
        name: userProfile.name,
        skills: userProfile.skills,
        experience: userProfile.experience,
        currentPosition: userProfile.currentPosition
      },
      modelStatus,
      cvProcessed: !!processedCVText
    });
  } catch (error) {
    console.error('Error generating CV-enhanced recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate CV-enhanced recommendations',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 