ALTER TABLE "userAnswer" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "suggestedFollowUp" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "isFollowUp";