CREATE TABLE "ChatConversations" (
	"id" integer PRIMARY KEY NOT NULL,
	"conversationId" varchar(255) NOT NULL,
	"participant1Id" varchar(255) NOT NULL,
	"participant2Id" varchar(255) NOT NULL,
	"lastMessageAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "ChatConversations_conversationId_unique" UNIQUE("conversationId")
);
--> statement-breakpoint
CREATE TABLE "ChatMessages" (
	"id" integer PRIMARY KEY NOT NULL,
	"conversationId" varchar(255) NOT NULL,
	"senderId" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"messageType" varchar(20) DEFAULT 'text',
	"isRead" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "UserConnections" (
	"id" integer PRIMARY KEY NOT NULL,
	"requesterId" varchar(255) NOT NULL,
	"recipientId" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "CVAnalysis" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "JobDetails" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "JobRecommendation" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mockInterview" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessionCheatingDetection" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "userAnswer" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "UserProfile" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "CallInterview" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "CallInterviewFeedback" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "cheatingDetection";--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "cheatingRiskScore";--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "cheatingAlertsCount";--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "cheatingDetectionEnabled";--> statement-breakpoint
ALTER TABLE "userAnswer" DROP COLUMN "cheatingDetectionSettings";