-- Add cheating detection fields to UserAnswer table
ALTER TABLE "userAnswer" 
ADD COLUMN "cheatingDetection" JSONB,
ADD COLUMN "cheatingRiskScore" INTEGER DEFAULT 0,
ADD COLUMN "cheatingAlertsCount" INTEGER DEFAULT 0,
ADD COLUMN "cheatingDetectionEnabled" BOOLEAN DEFAULT false,
ADD COLUMN "cheatingDetectionSettings" JSONB; 