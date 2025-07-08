# AI Interview Application - Entity Relationship Diagram (ERD)

## Database Schema Overview

This ERD represents the complete database structure for the AI Interview application, which includes job matching, interview management, CV analysis, and social networking features.

## Tables and Relationships

### Core User Management
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UserProfile   │    │   CVAnalysis    │    │ JobRecommendation│
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │    │ PK: id          │    │ PK: id          │
│ userId (UNIQUE) │◄───┤ userId          │    │ userId          │
│ email (UNIQUE)  │    │ originalFileName│    │ jobDetailsId    │
│ name            │    │ extractedText   │    │ matchScore      │
│ phone           │    │ parsedData      │    │ recommendationReason│
│ profilePhoto    │    │ feedback        │    │ isViewed        │
│ currentPosition │    │ analysisStatus  │    │ isApplied       │
│ currentCompany  │    │ createdAt       │    │ createdAt       │
│ location        │    └─────────────────┘    └─────────────────┘
│ summary         │                                    │
│ skills[]        │                                    │
│ languages[]     │                                    │
│ certifications[]│                                    │
│ education       │                                    │
│ experience      │                                    │
│ cvAnalysisId    │                                    │
│ isProfileComplete│                                   │
│ createdAt       │                                    │
│ updatedAt       │                                    │
└─────────────────┘                                    │
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   JobDetails    │
                                              ├─────────────────┤
                                              │ PK: id          │
                                              │ jobTitle        │
                                              │ jobCategories[] │
                                              │ jobTypes[]      │
                                              │ workplace       │
                                              │ country         │
                                              │ city            │
                                              │ careerLevel     │
                                              │ minExperience   │
                                              │ maxExperience   │
                                              │ minSalary       │
                                              │ maxSalary       │
                                              │ currency        │
                                              │ period          │
                                              │ hideSalary      │
                                              │ additionalSalary│
                                              │ vacancies       │
                                              │ jobDescription  │
                                              │ jobRequirements │
                                              │ skills          │
                                              │ gender          │
                                              │ education       │
                                              │ academicExcellence│
                                              │ createdAt       │
                                              └─────────────────┘
```

### Interview Management
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  MockInterview  │    │   userAnswer    │    │ CallInterview   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │    │ PK: id          │    │ PK: id          │
│ jobDetailsId    │    │ mockId          │    │ jobDetailsId    │
│ jsonMockResp    │    │ question        │    │ jobPosition     │
│ jobPosition     │    │ correctAns      │    │ jobDescription  │
│ jobDesc         │    │ userAns         │    │ duration        │
│ jobExperience   │    │ feedback        │    │ type            │
│ category        │    │ rating          │    │ category        │
│ createdBy       │    │ userEmail       │    │ questionList    │
│ createdAt       │    │ createdAt       │    │ recruiterName   │
│ mockId          │    │ suggestions     │    │ recruiterEmail  │
│ jobRes          │    │ needsFollowUp   │    │ job_id (UNIQUE) │
│ jobReq          │    │ reason          │    │ createdAt       │
│ perfSkills      │    │ suggestedFollowUp│   └─────────────────┘
│ careerLevel     │    │ interviewType   │            │
│ skills          │    │ audioRecording  │            │
│ education       │    │ language        │            │
│ achievements    │    │ evaluationScore │            │
│ projects        │    │ detailedScores  │            │
│ interviewType   │    │ evaluationLabels│            │
│ isHidden        │    │ evaluationSummary│           │
└─────────────────┘    │ evaluationRecommendation│    │
        │              │ detailedFeedback │           │
        │              │ detailedEvaluation│          │
        │              │ combinedScore    │          │
        │              │ overallAssessment│          │
        │              │ sessionId        │          │
        │              │ questionIndex    │          │
        │              │ isAnswered       │          │
        │              │ isSkipped        │          │
        │              │ retryCount       │          │
        │              │ lastAttemptAt    │          │
        │              │ updatedAt        │          │
        │              │ cheatingDetection│          │
        │              │ cheatingRiskScore│          │
        │              │ cheatingAlertsCount│        │
        │              │ cheatingDetectionEnabled│    │
        │              │ cheatingDetectionSettings│   │
        └──────────────┘                  │          │
                                          │          │
                                          ▼          ▼
                                    ┌─────────────────┐    ┌─────────────────┐
                                    │SessionCheating  │    │CallInterview    │
                                    │Detection        │    │Feedback         │
                                    ├─────────────────┤    ├─────────────────┤
                                    │ PK: id          │    │ PK: id          │
                                    │ sessionId       │    │ userName        │
                                    │ mockId          │    │ userEmail       │
                                    │ userEmail       │    │ job_id          │
                                    │ sessionStartTime│    │ feedback        │
                                    │ sessionEndTime  │    │ recommended     │
                                    │ sessionDuration │    └─────────────────┘
                                    │ sessionCheatingDetection│
                                    │ sessionCheatingRiskScore│
                                    │ sessionCheatingAlertsCount│
                                    │ sessionCheatingSeverityLevel│
                                    │ sessionCheatingViolations│
                                    │ sessionCheatingDevices│
                                    │ sessionCheatingMovementPatterns│
                                    │ sessionDetectionHistory│
                                    │ sessionAlerts   │
                                    │ sessionEnhancedMetrics│
                                    │ sessionDetectionSettings│
                                    │ createdAt       │
                                    │ updatedAt       │
                                    └─────────────────┘
```

### Social Networking & Chat
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ UserConnections │    │ChatConversations│    │  ChatMessages   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ PK: id          │    │ PK: id          │    │ PK: id          │
│ requesterId     │    │ conversationId  │    │ conversationId  │
│ recipientId     │    │ participant1Id  │    │ senderId        │
│ status          │    │ participant2Id  │    │ message         │
│ createdAt       │    │ lastMessageAt   │    │ messageType     │
│ updatedAt       │    │ createdAt       │    │ isRead          │
└─────────────────┘    │ updatedAt       │    │ createdAt       │
                       └─────────────────┘    └─────────────────┘
```

## Key Relationships

### One-to-One Relationships
- **UserProfile** ↔ **CVAnalysis**: A user profile can have one CV analysis
- **UserProfile** ↔ **UserProfile**: Self-referencing for user connections

### One-to-Many Relationships
- **JobDetails** → **JobRecommendation**: One job can have many recommendations
- **JobDetails** → **MockInterview**: One job can have many mock interviews
- **JobDetails** → **CallInterview**: One job can have many call interviews
- **MockInterview** → **userAnswer**: One mock interview can have many user answers
- **MockInterview** → **SessionCheatingDetection**: One mock interview can have many cheating detection sessions
- **CallInterview** → **CallInterviewFeedback**: One call interview can have many feedback entries
- **ChatConversations** → **ChatMessages**: One conversation can have many messages

### Many-to-Many Relationships
- **UserProfile** ↔ **UserProfile** (via UserConnections): Users can connect with multiple other users
- **UserProfile** ↔ **JobDetails** (via JobRecommendation): Users can be recommended multiple jobs

## Data Types Summary

### Primary Keys
- All tables use `integer` auto-incrementing primary keys
- Some tables have additional unique constraints (e.g., `userId`, `email`, `job_id`)

### Foreign Keys
- `UserProfile.cvAnalysisId` → `CVAnalysis.id`
- `JobRecommendation.jobDetailsId` → `JobDetails.id`
- `MockInterview.jobDetailsId` → `JobDetails.id`
- `CallInterview.jobDetailsId` → `JobDetails.id`
- `userAnswer.mockId` → `MockInterview.mockId`
- `SessionCheatingDetection.mockId` → `MockInterview.mockId`
- `CallInterviewFeedback.job_id` → `CallInterview.job_id`

### Complex Data Types
- **Arrays**: `skills[]`, `languages[]`, `certifications[]`, `jobCategories[]`, `jobTypes[]`
- **JSON/JSONB**: `education`, `experience`, `parsedData`, `questionList`, `feedback`, `detailedScores`, `evaluationLabels`, `detailedEvaluation`, `cheatingDetection`, `sessionCheatingDetection`, etc.
- **Timestamps**: `createdAt`, `updatedAt`, `sessionStartTime`, `sessionEndTime`, `lastAttemptAt`, `lastMessageAt`

## Business Logic Domains

### 1. User Management
- User profiles with comprehensive information
- CV analysis and parsing
- Profile completion tracking

### 2. Job Management
- Detailed job postings with multiple attributes
- Job recommendations based on user profiles
- Job application tracking

### 3. Interview System
- Mock interviews with customizable questions
- Call interviews with recruiter information
- Comprehensive answer evaluation and feedback
- Cheating detection at both answer and session levels

### 4. Social Features
- User connections and friend requests
- Real-time chat system
- Message history and read status

### 5. Analytics & Monitoring
- Session-level cheating detection
- Detailed evaluation metrics
- Performance tracking and scoring

## Database Technology
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Hosting**: Neon Database (serverless)
- **Migration**: Drizzle Kit for schema management

This ERD represents a comprehensive AI-powered interview platform with job matching, interview management, social networking, and advanced analytics capabilities. 