CREATE TABLE "CallInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jobPosition" varchar(255),
	"jobDescription" varchar(255),
	"duration" varchar(100),
	"type" varchar(100),
	"questionList" jsonb,
	"recruiterName" varchar(255),
	"recruiterEmail" varchar(255),
	"job_id" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	"category" varchar(100)
);
