import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserProfile, UserConnections } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('=== Testing Database Connection ===');
    
    // Test 1: Basic connection
    console.log('Test 1: Basic connection test');
    const testQuery = await db.select().from(UserProfile).limit(1);
    console.log('Basic query successful, found', testQuery.length, 'users');
    
    // Test 2: Check if tables exist
    console.log('Test 2: Checking table structure');
    const userProfileFields = Object.keys(UserProfile);
    const userConnectionsFields = Object.keys(UserConnections);
    console.log('UserProfile fields:', userProfileFields);
    console.log('UserConnections fields:', userConnectionsFields);
    
    // Test 3: Try to insert a test record (will be rolled back)
    console.log('Test 3: Testing insert operation');
    try {
      const testInsert = await db
        .insert(UserConnections)
        .values({
          requesterId: 'test_requester',
          recipientId: 'test_recipient',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      console.log('Insert test successful:', testInsert.length, 'records inserted');
      
      // Clean up test data
      await db
        .delete(UserConnections)
        .where(eq(UserConnections.requesterId, 'test_requester'));
      console.log('Test data cleaned up');
      
    } catch (insertError) {
      console.error('Insert test failed:', insertError.message);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and operations test completed',
      userProfileCount: testQuery.length,
      userProfileFields,
      userConnectionsFields
    });

  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 