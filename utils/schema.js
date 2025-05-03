import { pgTable, text, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

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
  suggestions: text('suggestions'), // ⬅️ Added this!
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
  needsFollowUp: boolean('needsFollowUp').default(false), // ⬅️ Added this!
  reason: text('reason'),
  suggestedFollowUp: varchar('suggestedFollowUp')
});