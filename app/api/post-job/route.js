import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { JobPost } from '@/utils/schema';

export async function POST(req) {
  try {
    const data = await req.json();
    // Basic validation (add more as needed)
    if (!data.jobTitle || !data.jobCategories || !data.jobTypes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Insert into DB
    const result = await db.insert(JobPost).values({
      jobTitle: data.jobTitle,
      jobCategories: data.jobCategories,
      jobTypes: data.jobTypes,
      workplace: data.workplace,
      country: data.country,
      city: data.city,
      careerLevel: data.careerLevel,
      minExperience: data.minExperience,
      maxExperience: data.maxExperience,
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      currency: data.currency,
      period: data.period,
      hideSalary: data.hideSalary,
      additionalSalary: data.additionalSalary,
      vacancies: data.vacancies,
      jobDescription: data.jobDescription,
      jobRequirements: data.jobRequirements,
      skills: data.skills,
      gender: data.gender,
      education: data.education,
      academicExcellence: data.academicExcellence,
    });
    return NextResponse.json({ success: true, jobId: result.insertId });
  } catch (error) {
    console.error('Failed to post job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
} 