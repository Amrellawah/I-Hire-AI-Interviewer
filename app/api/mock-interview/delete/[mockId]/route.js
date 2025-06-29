import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { mockId } = params;

    if (!mockId) {
      return NextResponse.json({ error: 'Mock ID is required' }, { status: 400 });
    }

    // First delete all related user answers
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));

    // Then delete the mock interview
    const result = await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Mock interview not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Mock interview and all related data deleted successfully',
      deletedMockId: mockId
    });

  } catch (error) {
    console.error('Error deleting mock interview:', error);
    return NextResponse.json({ error: 'Failed to delete mock interview' }, { status: 500 });
  }
} 