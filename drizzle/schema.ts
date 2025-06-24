import { pgTable, integer, varchar, json, boolean, text, timestamp, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const userAnswerIdSeq1 = pgSequence("userAnswer_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const callInterviewFeedback = pgTable("CallInterviewFeedback", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""CallInterviewFeedback_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	userName: varchar({ length: 255 }).notNull(),
	userEmail: varchar({ length: 255 }).notNull(),
	jobId: varchar("job_id", { length: 255 }).notNull(),
	feedback: json().notNull(),
	recommended: boolean().notNull(),
});

export const jobDetails = pgTable("JobDetails", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: ""JobDetails_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	jobTitle: varchar({ length: 255 }),
	jobCategories: varchar({ length: 255 }).array(),
	jobTypes: varchar({ length: 255 }).array(),
	workplace: varchar({ length: 100 }),
	country: varchar({ length: 100 }),
	city: varchar({ length: 100 }),
	careerLevel: varchar({ length: 100 }),
	minExperience: integer(),
	maxExperience: integer(),
	minSalary: integer(),
	maxSalary: integer(),
	currency: varchar({ length: 20 }),
	period: varchar({ length: 20 }),
	hideSalary: boolean(),
	additionalSalary: varchar({ length: 255 }),
	vacancies: integer(),
	jobDescription: text(),
	jobRequirements: text(),
	skills: varchar({ length: 255 }),
	gender: varchar({ length: 50 }),
	education: varchar({ length: 100 }),
	academicExcellence: boolean(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
});

export const mockInterview = pgTable("mockInterview", {
	jsonMockResp: varchar().notNull(),
	jobPosition: varchar().notNull(),
	jobDesc: varchar().notNull(),
	jobExperience: varchar().notNull(),
	createdBy: varchar().notNull(),
	createdAt: varchar(),
	mockId: varchar().notNull(),
	category: varchar({ length: 100 }),
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""mockInterview_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	jobDetailsId: integer(),
});

export const callInterview = pgTable("CallInterview", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""CallInterview_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	jobPosition: varchar(),
	jobDescription: varchar(),
	duration: varchar(),
	type: varchar(),
	questionList: json(),
	recruiterName: varchar(),
	recruiterEmail: varchar(),
	jobId: varchar("job_id"),
	createdAt: timestamp({ mode: 'string' }),
	category: varchar({ length: 100 }),
	jobDetailsId: integer(),
});

export const userAnswer = pgTable("userAnswer", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""userAnswer_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	mockId: varchar().notNull(),
	question: varchar().notNull(),
	correctAns: text(),
	userAns: text(),
	feedback: text(),
	rating: varchar(),
	userEmail: varchar(),
	createdAt: varchar(),
	suggestions: text(),
	needsFollowUp: boolean().default(false),
	reason: text(),
	suggestedFollowUp: varchar(),
});
