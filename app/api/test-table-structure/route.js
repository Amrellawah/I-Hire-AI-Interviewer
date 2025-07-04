import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserConnections } from '@/utils/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('=== Testing Table Structure ===');
    
    // Try to get table info
    console.log('UserConnections schema fields:', Object.keys(UserConnections));
    
    // Try a simple select to see if table exists
    console.log('Testing simple select...');
    const result = await db.select().from(UserConnections).limit(1);
    console.log('Select result:', result);
    
    // Try to get table structure from database
    try {
      const tableInfo = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'UserConnections'
        ORDER BY ordinal_position
      `);
      console.log('Table structure from database:', tableInfo);
    } catch (schemaError) {
      console.error('Error getting table structure:', schemaError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Table structure test completed',
      schemaFields: Object.keys(UserConnections),
      selectResult: result
    });

  } catch (error) {
    console.error('Table structure test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 