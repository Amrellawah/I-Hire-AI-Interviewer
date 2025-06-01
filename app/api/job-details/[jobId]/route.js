import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { JobDetails } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(req, { params }) {
  const { jobId } = params;
  try {
    const result = await db.select().from(JobDetails).where(eq(JobDetails.id, Number(jobId)));
    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Job details not found' }, { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
  }
} 