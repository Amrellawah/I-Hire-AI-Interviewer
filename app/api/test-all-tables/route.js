import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('=== Listing All Tables ===');
    
    // Get all tables
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('All tables:', tables);
    
    return NextResponse.json({
      success: true,
      tables: tables
    });

  } catch (error) {
    console.error('List tables failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 