import { relations } from "drizzle-orm/relations";
import { jobDetails, jobRecommendation, cvAnalysis, userProfile } from "./schema";

export const jobRecommendationRelations = relations(jobRecommendation, ({one}) => ({
	jobDetail: one(jobDetails, {
		fields: [jobRecommendation.jobDetailsId],
		references: [jobDetails.id]
	}),
}));

export const jobDetailsRelations = relations(jobDetails, ({many}) => ({
	jobRecommendations: many(jobRecommendation),
}));

export const userProfileRelations = relations(userProfile, ({one}) => ({
	cvAnalysis: one(cvAnalysis, {
		fields: [userProfile.cvAnalysisId],
		references: [cvAnalysis.id]
	}),
}));

export const cvAnalysisRelations = relations(cvAnalysis, ({many}) => ({
	userProfiles: many(userProfile),
}));