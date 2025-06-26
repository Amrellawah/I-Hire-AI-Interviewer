ALTER TABLE "userAnswer" ADD COLUMN "interview_type" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "audioRecording" text;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "language" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "detailedEvaluation" jsonb;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "evaluationScore" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "detailedScores" jsonb;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "combinedScore" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "overallAssessment" text;--> statement-breakpoint
ALTER TABLE "JobDetails" DROP COLUMN "company";