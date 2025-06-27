-- Add new fields for enhanced interview system
ALTER TABLE "userAnswer" ADD COLUMN "sessionId" varchar;
ALTER TABLE "userAnswer" ADD COLUMN "questionIndex" integer;
ALTER TABLE "userAnswer" ADD COLUMN "isAnswered" boolean DEFAULT false;
ALTER TABLE "userAnswer" ADD COLUMN "isSkipped" boolean DEFAULT false;
ALTER TABLE "userAnswer" ADD COLUMN "retryCount" integer DEFAULT 0;
ALTER TABLE "userAnswer" ADD COLUMN "lastAttemptAt" timestamp DEFAULT now();
ALTER TABLE "userAnswer" ADD COLUMN "updatedAt" timestamp DEFAULT now();

-- Create index for better performance on session queries
CREATE INDEX "userAnswer_sessionId_idx" ON "userAnswer" ("sessionId");
CREATE INDEX "userAnswer_mockIdRef_sessionId_idx" ON "userAnswer" ("mockIdRef", "sessionId");
CREATE INDEX "userAnswer_questionIndex_idx" ON "userAnswer" ("questionIndex"); 