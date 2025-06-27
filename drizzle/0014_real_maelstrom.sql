ALTER TABLE "userAnswer" ADD COLUMN "sessionId" varchar;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "questionIndex" integer;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "isAnswered" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "isSkipped" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "retryCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "lastAttemptAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "updatedAt" timestamp DEFAULT now();