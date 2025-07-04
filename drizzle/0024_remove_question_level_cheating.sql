-- Remove cheating detection fields from UserAnswer table
-- Moving to session-level cheating detection only

ALTER TABLE "userAnswer" DROP COLUMN IF EXISTS "cheatingDetection";
ALTER TABLE "userAnswer" DROP COLUMN IF EXISTS "cheatingRiskScore";
ALTER TABLE "userAnswer" DROP COLUMN IF EXISTS "cheatingAlertsCount";
ALTER TABLE "userAnswer" DROP COLUMN IF EXISTS "cheatingDetectionEnabled";
ALTER TABLE "userAnswer" DROP COLUMN IF EXISTS "cheatingDetectionSettings"; 