import { pgTable, foreignKey, serial, varchar, integer, text, boolean, timestamp, unique, jsonb, json, pgSequence, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const userAnswerIdSeq1 = pgSequence("userAnswer_id_seq1", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const jobRecommendation = pgTable("JobRecommendation", {
	id: serial().primaryKey().notNull(),
	userId: varchar({ length: 255 }).notNull(),
	jobDetailsId: integer().notNull(),
	matchScore: integer(),
	recommendationReason: text(),
	isViewed: boolean().default(false),
	isApplied: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.jobDetailsId],
			foreignColumns: [jobDetails.id],
			name: "JobRecommendation_jobDetailsId_JobDetails_id_fk"
		}),
]);

export const callInterview = pgTable("CallInterview", {
	id: integer().primaryKey().notNull(),
	jobPosition: text(),
	jobDescription: text(),
	duration: varchar({ length: 100 }),
	type: varchar({ length: 100 }),
	questionList: jsonb(),
	recruiterName: varchar({ length: 255 }),
	recruiterEmail: varchar({ length: 255 }),
	jobId: varchar("job_id", { length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	category: varchar({ length: 100 }),
	jobDetailsId: integer(),
}, (table) => [
	unique("CallInterview_job_id_unique").on(table.jobId),
]);

export const callInterviewFeedback = pgTable("CallInterviewFeedback", {
	id: integer().primaryKey().notNull(),
	userName: varchar({ length: 255 }).notNull(),
	userEmail: varchar({ length: 255 }).notNull(),
	jobId: varchar("job_id", { length: 255 }).notNull(),
	feedback: json().notNull(),
	recommended: boolean().notNull(),
	callInterviewId: integer("call_interview_id").notNull(),
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
	id: integer().primaryKey().notNull(),
	jobDetailsId: integer(),
});

export const cvAnalysis = pgTable("CVAnalysis", {
	id: serial().primaryKey().notNull(),
	userId: varchar({ length: 255 }).notNull(),
	originalFileName: varchar({ length: 255 }),
	extractedText: text(),
	parsedData: jsonb().notNull(),
	feedback: text(),
	analysisStatus: varchar({ length: 50 }).default('completed'),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
});

export const jobDetails = pgTable("JobDetails", {
	id: integer().primaryKey().notNull(),
	jobTitle: text(),
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

export const userProfile = pgTable("UserProfile", {
	id: serial().primaryKey().notNull(),
	userId: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	phone: varchar({ length: 50 }),
	profilePhoto: varchar({ length: 500 }),
	currentPosition: varchar({ length: 255 }),
	currentCompany: varchar({ length: 255 }),
	location: varchar({ length: 255 }),
	summary: text(),
	skills: varchar({ length: 255 }).array(),
	languages: varchar({ length: 100 }).array(),
	certifications: varchar({ length: 255 }).array(),
	education: jsonb(),
	experience: jsonb(),
	cvAnalysisId: integer(),
	isProfileComplete: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.cvAnalysisId],
			foreignColumns: [cvAnalysis.id],
			name: "UserProfile_cvAnalysisId_CVAnalysis_id_fk"
		}),
	unique("UserProfile_userId_unique").on(table.userId),
	unique("UserProfile_email_unique").on(table.email),
]);

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
	interviewType: varchar("interview_type", { length: 50 }),
	audioRecording: text(),
	language: varchar({ length: 20 }),
	evaluationScore: real(),
	detailedScores: jsonb(),
	evaluationLabels: jsonb("evaluation_labels"),
	evaluationSummary: text("evaluation_summary"),
	evaluationRecommendation: varchar("evaluation_recommendation", { length: 100 }),
	detailedFeedback: text("detailed_feedback"),
	detailedEvaluation: jsonb(),
	combinedScore: varchar(),
	overallAssessment: text(),
	sessionId: varchar(),
	questionIndex: integer(),
	isAnswered: boolean().default(false),
	isSkipped: boolean().default(false),
	retryCount: integer().default(0),
	lastAttemptAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
	cheatingDetection: jsonb(),
	cheatingRiskScore: integer().default(0),
	cheatingAlertsCount: integer().default(0),
	cheatingDetectionEnabled: boolean().default(false),
	cheatingDetectionSettings: jsonb(),
});
