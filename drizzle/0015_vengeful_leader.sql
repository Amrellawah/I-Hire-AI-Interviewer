ALTER TABLE "userAnswer" ADD COLUMN "cheatingDetection" jsonb;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "cheatingRiskScore" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "cheatingAlertsCount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "cheatingDetectionEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "userAnswer" ADD COLUMN "cheatingDetectionSettings" jsonb;