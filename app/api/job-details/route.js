import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { JobDetails } from '@/utils/schema';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

export async function GET() {
  try {
    // Check table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'JobDetails' 
      ORDER BY ordinal_position
    `;
    
    return NextResponse.json({ 
      success: true, 
      tableInfo: tableInfo,
      message: 'Table structure retrieved successfully'
    });
  } catch (error) {
    console.error('Failed to get table info:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get table info',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Drop and recreate the JobDetails table with proper identity column
    try {
      await sql`DROP TABLE IF EXISTS "JobDetails" CASCADE`;
      await sql`
        CREATE TABLE "JobDetails" (
          "id" SERIAL PRIMARY KEY,
          "jobTitle" varchar(255),
          "jobCategories" varchar(255)[],
          "jobTypes" varchar(255)[],
          "workplace" varchar(100),
          "country" varchar(100),
          "city" varchar(100),
          "careerLevel" varchar(100),
          "minExperience" integer,
          "maxExperience" integer,
          "minSalary" integer,
          "maxSalary" integer,
          "currency" varchar(20),
          "period" varchar(20),
          "hideSalary" boolean,
          "additionalSalary" varchar(255),
          "vacancies" integer,
          "jobDescription" text,
          "jobRequirements" text,
          "skills" varchar(255),
          "gender" varchar(50),
          "education" varchar(100),
          "academicExcellence" boolean,
          "createdAt" timestamp DEFAULT now()
        )
      `;
      console.log('JobDetails table recreated successfully');
    } catch (tableError) {
      console.error('Table recreation error:', tableError.message);
    }
    
    // Remove id field if it exists in the data to let the database auto-generate it
    const { id, ...insertData } = data;
    
    const [result] = await db.insert(JobDetails).values(insertData).returning({ id: JobDetails.id });
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Failed to save job details:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save job details',
      details: error.message 
    }, { status: 500 });
  }
} 