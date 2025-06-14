import { pgTable, text, integer, varchar, boolean, jsonb, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const MockInterview = pgTable('mockInterview', {
  id: integer('id').primaryKey().notNull().default(sql`GENERATED BY DEFAULT AS IDENTITY`),
  jobDetailsId: integer('jobDetailsId'),
  jsonMockResp: varchar('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition').notNull(),
  jobDesc: varchar('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  category: varchar('category', { length: 100 }),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull(),
});

export const UserAnswer = pgTable('userAnswer', {
  id: integer('id').primaryKey().notNull().default(sql`GENERATED BY DEFAULT AS IDENTITY`),
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
  id: integer('id').primaryKey().notNull().default(sql`GENERATED BY DEFAULT AS IDENTITY`),
  jobDetailsId: integer('jobDetailsId'),
  jobPosition: varchar('jobPosition', { length: 255 }),
  jobDescription: varchar('jobDescription', { length: 255 }),
  duration: varchar('duration', { length: 100 }),
  type: varchar('type', { length: 100 }),
  category: varchar('category', { length: 100 }),
  questionList: jsonb('questionList'),
  recruiterName: varchar('recruiterName', { length: 255 }),
  recruiterEmail: varchar('recruiterEmail', { length: 255 }),
  job_id: varchar('job_id', { length: 255 }).unique(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const callInterviewFeedback = pgTable('CallInterviewFeedback', {
  id: integer('id').primaryKey().notNull().default(sql`GENERATED BY DEFAULT AS IDENTITY`),
  userName: varchar('userName', { length: 255 }).notNull(),
  userEmail: varchar('userEmail', { length: 255 }).notNull(),
  job_id: varchar('job_id', { length: 255 }).notNull().references(() => callInterview.job_id),
  feedback: json('feedback').notNull(),
  recommended: boolean('recommended').notNull()
});

export const callInterviewRelations = relations(callInterview, ({ many }) => ({
  feedback: many(callInterviewFeedback),
}));

export const callInterviewFeedbackRelations = relations(callInterviewFeedback, ({ one }) => ({
  interview: one(callInterview, {
    fields: [callInterviewFeedback.job_id],
    references: [callInterview.job_id],
  }),
}));

export const JobDetails = pgTable('JobDetails', {
  id: integer('id').primaryKey().notNull().default(sql`GENERATED BY DEFAULT AS IDENTITY`),
  jobTitle: varchar('jobTitle', { length: 255 }),
  jobCategories: varchar('jobCategories', { length: 255 }).array(),
  jobTypes: varchar('jobTypes', { length: 255 }).array(),
  workplace: varchar('workplace', { length: 100 }),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  careerLevel: varchar('careerLevel', { length: 100 }),
  minExperience: integer('minExperience'),
  maxExperience: integer('maxExperience'),
  minSalary: integer('minSalary'),
  maxSalary: integer('maxSalary'),
  currency: varchar('currency', { length: 20 }),
  period: varchar('period', { length: 20 }),
  hideSalary: boolean('hideSalary'),
  additionalSalary: varchar('additionalSalary', { length: 255 }),
  vacancies: integer('vacancies'),
  jobDescription: text('jobDescription'),
  jobRequirements: text('jobRequirements'),
  skills: varchar('skills', { length: 255 }),
  gender: varchar('gender', { length: 50 }),
  education: varchar('education', { length: 100 }),
  academicExcellence: boolean('academicExcellence'),
  createdAt: timestamp('createdAt').defaultNow(),
});
