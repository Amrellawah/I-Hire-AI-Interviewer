import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { callInterview } from '@/utils/schema';

export async function POST(req) {
  try {
    const body = await req.json();
    const { formData, questionList, user } = body;

    const job_id = uuidv4();

    await db.insert(callInterview).values({
      ...formData,
      questionList,
      recruiterName: user.fullName,
      recruiterEmail: user.emailAddresses?.[0]?.emailAddress || '',
      job_id,
      createdAt: new Date(),
    });

  return NextResponse.json({ success: true, job_id });
  } catch (error) {
    console.error('[saveInterview]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
