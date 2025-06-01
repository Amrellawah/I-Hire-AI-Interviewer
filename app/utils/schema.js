// Removed JobPost table definition

import { pgTable, serial, varchar, integer, boolean, text, timestamp } from 'drizzle-orm/pg-core';

export const JobPost = pgTable('JobPost', {
  id: serial('id').primaryKey(),
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