import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

async function addMissingColumns() {
  try {
    console.log('Adding missing columns to mockInterview table...');
    
    const queries = [
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "jobRes" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "jobReq" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "perfSkills" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "careerLevel" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "skills" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "education" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "achievements" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "projects" varchar;',
      'ALTER TABLE "mockInterview" ADD COLUMN IF NOT EXISTS "interviewType" varchar;'
    ];

    for (const query of queries) {
      await sql(query);
      console.log('Executed:', query);
    }

    console.log('All columns added successfully!');
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

addMissingColumns(); 