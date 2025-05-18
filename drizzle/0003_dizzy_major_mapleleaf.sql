CREATE TABLE "CallInterviewFeedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"userName" varchar(255) NOT NULL,
	"userEmail" varchar(255) NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"feedback" json NOT NULL,
	"recommended" boolean NOT NULL
);
