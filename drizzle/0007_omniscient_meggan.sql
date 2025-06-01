ALTER TABLE "JobPost" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "JobPost" CASCADE;--> statement-breakpoint
ALTER TABLE "mockInterview" DROP CONSTRAINT "mockInterview_jobPostId_JobPost_id_fk";
--> statement-breakpoint
ALTER TABLE "CallInterview" DROP CONSTRAINT "CallInterview_jobPostId_JobPost_id_fk";
--> statement-breakpoint
ALTER TABLE "CallInterview" ALTER COLUMN "jobDescription" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "jobTitle" varchar(255);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "jobCategories" varchar(255)[];--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "jobTypes" varchar(255)[];--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "workplace" varchar(100);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "careerLevel" varchar(100);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "minExperience" integer;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "maxExperience" integer;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "minSalary" integer;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "maxSalary" integer;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "currency" varchar(20);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "period" varchar(20);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "hideSalary" boolean;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "additionalSalary" varchar(255);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "vacancies" integer;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "jobDescription" text;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "jobRequirements" text;--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "skills" varchar(255);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "gender" varchar(50);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "education" varchar(100);--> statement-breakpoint
ALTER TABLE "mockInterview" ADD COLUMN "academicExcellence" boolean;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "jobTitle" varchar(255);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "jobCategories" varchar(255)[];--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "jobTypes" varchar(255)[];--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "workplace" varchar(100);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "careerLevel" varchar(100);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "minExperience" integer;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "maxExperience" integer;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "minSalary" integer;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "maxSalary" integer;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "currency" varchar(20);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "period" varchar(20);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "hideSalary" boolean;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "additionalSalary" varchar(255);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "vacancies" integer;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "jobRequirements" text;--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "skills" varchar(255);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "gender" varchar(50);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "education" varchar(100);--> statement-breakpoint
ALTER TABLE "CallInterview" ADD COLUMN "academicExcellence" boolean;--> statement-breakpoint
ALTER TABLE "mockInterview" DROP COLUMN "jobPostId";--> statement-breakpoint
ALTER TABLE "CallInterview" DROP COLUMN "jobPostId";