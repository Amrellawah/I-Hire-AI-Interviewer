import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { mockId } = params;
    const { isHidden } = await request.json();

    if (!mockId) {
      return NextResponse.json({ error: 'Mock ID is required' }, { status: 400 });
    }

    if (typeof isHidden !== 'boolean') {
      return NextResponse.json({ error: 'isHidden must be a boolean' }, { status: 400 });
    }

    // Update the mock interview's hidden status
    const result = await db
      .update(MockInterview)
      .set({ isHidden })
      .where(eq(MockInterview.mockId, mockId));

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Mock interview not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Mock interview ${isHidden ? 'hidden' : 'shown'} successfully`,
      mockId,
      isHidden
    });

  } catch (error) {
    console.error('Error updating mock interview visibility:', error);
    return NextResponse.json({ error: 'Failed to update mock interview visibility' }, { status: 500 });
  }
} 