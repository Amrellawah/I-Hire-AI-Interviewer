-- Add missing columns to userAnswer table for video interview evaluation
ALTER TABLE "userAnswer" 
ADD COLUMN IF NOT EXISTS "detailedEvaluation" JSONB,
ADD COLUMN IF NOT EXISTS "evaluationScore" VARCHAR,
ADD COLUMN IF NOT EXISTS "detailedScores" JSONB,
ADD COLUMN IF NOT EXISTS "combinedScore" VARCHAR,
ADD COLUMN IF NOT EXISTS "overallAssessment" TEXT; 