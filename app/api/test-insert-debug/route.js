import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/utils/db';
import { UserConnections } from '@/utils/schema';
import { sql } from 'drizzle-orm';

export async function POST(req) {
  try {
    console.log('=== Debug Insert ===');
    
    const { userId } = await auth();
    console.log('User ID:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      });
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { recipientId } = body;
    console.log('Recipient ID:', recipientId);

    // First check if the table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'UserConnections'
      );
    `);
    
    if (!tableExists[0]?.exists) {
      return NextResponse.json({
        success: false,
        error: 'UserConnections table does not exist. Please run the migration first.',
        details: 'Table needs to be created before inserting data'
      }, { status: 500 });
    }
    
    // Log the exact data we're trying to insert
    const insertData = {
      requesterId: userId,
      recipientId,
      status: 'pending'
    };
    
    console.log('Insert data:', insertData);
    console.log('UserConnections schema:', UserConnections);
    console.log('UserConnections fields:', Object.keys(UserConnections));

    // Try to build the query manually to see what's happening
    const query = db.insert(UserConnections).values(insertData);
    console.log('Query object:', query);
    console.log('Query SQL:', query.toSQL());

    const newConnection = await query.returning();
    console.log('Insert successful:', newConnection);

    return NextResponse.json({
      success: true,
      message: 'Connection created successfully',
      connection: newConnection[0]
    });

  } catch (error) {
    console.error('=== Insert Debug Error ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Insert debug failed',
      details: error.message,
      type: typeof error,
      stack: error.stack
    }, { status: 500 });
  }
} 