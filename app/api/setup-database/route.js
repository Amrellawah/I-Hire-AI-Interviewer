import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

export async function POST(req) {
  try {
    console.log('Setting up database tables...');

    // Create CVAnalysis table
    await sql`
      CREATE TABLE IF NOT EXISTS "CVAnalysis" (
        "id" SERIAL PRIMARY KEY,
        "userId" varchar(255) NOT NULL,
        "originalFileName" varchar(255),
        "extractedText" text,
        "parsedData" jsonb NOT NULL,
        "feedback" text,
        "analysisStatus" varchar(50) DEFAULT 'completed',
        "createdAt" timestamp DEFAULT now()
      )
    `;

    // Create UserProfile table
    await sql`
      CREATE TABLE IF NOT EXISTS "UserProfile" (
        "id" SERIAL PRIMARY KEY,
        "userId" varchar(255) NOT NULL UNIQUE,
        "email" varchar(255) NOT NULL UNIQUE,
        "name" varchar(255),
        "phone" varchar(50),
        "profilePhoto" varchar(500),
        "currentPosition" varchar(255),
        "currentCompany" varchar(255),
        "location" varchar(255),
        "summary" text,
        "skills" varchar(255)[],
        "languages" varchar(100)[],
        "certifications" varchar(255)[],
        "education" jsonb,
        "experience" jsonb,
        "cvAnalysisId" integer,
        "isProfileComplete" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `;

    // Create JobRecommendation table
    await sql`
      CREATE TABLE IF NOT EXISTS "JobRecommendation" (
        "id" SERIAL PRIMARY KEY,
        "userId" varchar(255) NOT NULL,
        "jobDetailsId" integer NOT NULL,
        "matchScore" integer,
        "recommendationReason" text,
        "isViewed" boolean DEFAULT false,
        "isApplied" boolean DEFAULT false,
        "createdAt" timestamp DEFAULT now()
      )
    `;

    // Add foreign key constraints (if they don't exist)
    try {
      await sql`
        ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_cvAnalysisId_fk" 
        FOREIGN KEY ("cvAnalysisId") REFERENCES "CVAnalysis"("id") ON DELETE SET NULL
      `;
    } catch (error) {
      console.log('Foreign key constraint might already exist:', error.message);
    }

    try {
      await sql`
        ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_jobDetailsId_fk" 
        FOREIGN KEY ("jobDetailsId") REFERENCES "JobDetails"("id") ON DELETE CASCADE
      `;
    } catch (error) {
      console.log('Foreign key constraint might already exist:', error.message);
    }

    console.log('Database tables created successfully!');

    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully' 
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Failed to set up database tables' },
      { status: 500 }
    );
  }
} 