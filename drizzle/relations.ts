import { relations } from "drizzle-orm/relations";
import { cvAnalysis, userProfile } from "./schema";

export const userProfileRelations = relations(userProfile, ({one}) => ({
	cvAnalysis: one(cvAnalysis, {
		fields: [userProfile.cvAnalysisId],
		references: [cvAnalysis.id]
	}),
}));

export const cvAnalysisRelations = relations(cvAnalysis, ({many}) => ({
	userProfiles: many(userProfile),
}));