import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserConnections, UserProfile } from '@/utils/schema';

export async function GET() {
  try {
    console.log('=== Testing Database Schema ===');
    
    // Test UserProfile table
    console.log('Testing UserProfile table...');
    const userProfileTest = await db.select().from(UserProfile).limit(1);
    console.log('UserProfile test successful, found', userProfileTest.length, 'records');
    
    // Test UserConnections table
    console.log('Testing UserConnections table...');
    const userConnectionsTest = await db.select().from(UserConnections).limit(1);
    console.log('UserConnections test successful, found', userConnectionsTest.length, 'records');
    
    // Test schema structure
    console.log('UserProfile schema fields:', Object.keys(UserProfile));
    console.log('UserConnections schema fields:', Object.keys(UserConnections));
    
    return NextResponse.json({
      success: true,
      message: 'Database schema test completed',
      userProfileCount: userProfileTest.length,
      userConnectionsCount: userConnectionsTest.length,
      userProfileFields: Object.keys(UserProfile),
      userConnectionsFields: Object.keys(UserConnections)
    });

  } catch (error) {
    console.error('Database schema test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 