import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('=== Testing Table Existence ===');
    
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'UserConnections'
      );
    `);
    
    console.log('Table exists:', tableExists);
    
    if (tableExists[0]?.exists) {
      // Get table structure
      const tableStructure = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default, is_identity
        FROM information_schema.columns 
        WHERE table_name = 'UserConnections'
        ORDER BY ordinal_position;
      `);
      
      console.log('Table structure:', tableStructure);
      
      // Try to count rows
      const rowCount = await db.execute(sql`
        SELECT COUNT(*) as count FROM "UserConnections";
      `);
      
      console.log('Row count:', rowCount);
      
      return NextResponse.json({
        success: true,
        tableExists: true,
        structure: tableStructure,
        rowCount: rowCount[0]?.count
      });
    } else {
      return NextResponse.json({
        success: true,
        tableExists: false,
        message: 'UserConnections table does not exist'
      });
    }

  } catch (error) {
    console.error('Table existence test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 