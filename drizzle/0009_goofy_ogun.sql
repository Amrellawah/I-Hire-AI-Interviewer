ALTER TABLE "JobDetails" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "JobDetails" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "JobPost" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "JobPost" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "mockInterview" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "mockInterview" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "userAnswer" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "userAnswer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "CallInterview" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "CallInterview" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "CallInterviewFeedback" ALTER COLUMN "id" SET DATA TYPE integer;
ALTER TABLE "CallInterviewFeedback" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY;