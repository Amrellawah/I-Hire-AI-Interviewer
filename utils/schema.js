import { pgTable, text, serial, varchar, boolean, jsonb, timestamp, json } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: varchar('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition').notNull(),
  jobDesc: varchar('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull(),
});

export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: varchar('question').notNull(),
  correctAns: text('correctAns'),
  userAns: text('userAns'),
  feedback: text('feedback'),
  rating: varchar('rating'),
  suggestions: text('suggestions'), 
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
  needsFollowUp: boolean('needsFollowUp').default(false), 
  reason: text('reason'),
  suggestedFollowUp: varchar('suggestedFollowUp')
});

export const callInterview = pgTable('CallInterview', {
  id: serial('id').primaryKey(),
  jobPosition: varchar('jobPosition', { length: 255 }),
  jobDescription: varchar('jobDescription', { length: 255 }),
  duration: varchar('duration', { length: 100 }),
  type: varchar('type', { length: 100 }),
  questionList: jsonb('questionList'),
  recruiterName: varchar('recruiterName', { length: 255 }),
  recruiterEmail: varchar('recruiterEmail', { length: 255 }),
  job_id: varchar('job_id', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const callInterviewFeedback = pgTable('CallInterviewFeedback', {
  id: serial('id').primaryKey(),
  userName: varchar('userName', { length: 255 }).notNull(),
  userEmail: varchar('userEmail', { length: 255 }).notNull(),
  job_id: varchar('job_id', { length: 255 }).notNull(),
  feedback: json('feedback').notNull(),
  recommended: boolean('recommended').notNull()
});

