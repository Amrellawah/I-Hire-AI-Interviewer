import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { JobDetails } from '@/utils/schema';

export async function POST(req) {
  try {
    const data = await req.json();
    const [result] = await db.insert(JobDetails).values(data).returning({ id: JobDetails.id });
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Failed to save job details:', error);
    return NextResponse.json({ success: false, error: 'Failed to save job details' }, { status: 500 });
  }
} 