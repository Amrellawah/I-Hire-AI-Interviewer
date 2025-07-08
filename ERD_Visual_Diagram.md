# AI Interview Application - Visual ERD Diagram

## Complete Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    AI INTERVIEW APPLICATION ERD                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    1:N    ┌─────────────────┐    1:1    ┌─────────────────┐
│   UserProfile   │◄─────────┤   CVAnalysis    │           │ JobRecommendation│
├─────────────────┤           ├─────────────────┤           ├─────────────────┤
│ PK: id          │           │ PK: id          │           │ PK: id          │
│ userId (UNIQUE) │           │ userId          │           │ userId          │
│ email (UNIQUE)  │           │ originalFileName│           │ jobDetailsId    │
│ name            │           │ extractedText   │           │ matchScore      │
│ phone           │           │ parsedData      │           │ recommendationReason│
│ profilePhoto    │           │ feedback        │           │ isViewed        │
│ currentPosition │           │ analysisStatus  │           │ isApplied       │
│ currentCompany  │           │ createdAt       │           │ createdAt       │
│ location        │           └─────────────────┘           └─────────────────┘
│ summary         │                                                      │
│ skills[]        │                                                      │
│ languages[]     │                                                      │
│ certifications[]│                                                      │
│ education       │                                                      │
│ experience      │                                                      │
│ cvAnalysisId    │                                                      │
│ isProfileComplete│                                                     │
│ createdAt       │                                                     │
│ updatedAt       │                                                     │
└─────────────────┘                                                     │
                                                                        │
                                                                        │ N:1
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
                                                                        │
                                                                        │ 1:N
                                                                        │
                                                                        ▼
┌─────────────────┐    1:N    ┌─────────────────┐    1:N    ┌─────────────────┐
│  MockInterview  │◄─────────┤   userAnswer    │           │ CallInterview   │
├─────────────────┤           ├─────────────────┤           ├─────────────────┤
│ PK: id          │           │ PK: id          │           │ PK: id          │
│ jobDetailsId    │           │ mockId          │           │ jobDetailsId    │
│ jsonMockResp    │           │ question        │           │ jobPosition     │
│ jobPosition     │           │ correctAns      │           │ jobDescription  │
│ jobDesc         │           │ userAns         │           │ duration        │
│ jobExperience   │           │ feedback        │           │ type            │
│ category        │           │ rating          │           │ category        │
│ createdBy       │           │ userEmail       │           │ questionList    │
│ createdAt       │           │ createdAt       │           │ recruiterName   │
│ mockId          │           │ suggestions     │           │ recruiterEmail  │
│ jobRes          │           │ needsFollowUp   │           │ job_id (UNIQUE) │
│ jobReq          │           │ reason          │           │ createdAt       │
│ perfSkills      │           │ suggestedFollowUp│          └─────────────────┘
│ careerLevel     │           │ interviewType   │                    │
│ skills          │           │ audioRecording  │                    │ 1:N
│ education       │           │ language        │                    │
│ achievements    │           │ evaluationScore │                    ▼
│ projects        │           │ detailedScores  │           ┌─────────────────┐
│ interviewType   │           │ evaluationLabels│           │CallInterview    │
│ isHidden        │           │ evaluationSummary│          │Feedback         │
└─────────────────┘           │ evaluationRecommendation│   ├─────────────────┤
        │                      │ detailedFeedback │          │ PK: id          │
        │ 1:N                  │ detailedEvaluation│         │ userName        │
        ▼                      │ combinedScore    │         │ userEmail       │
┌─────────────────┐           │ overallAssessment│         │ job_id          │
│SessionCheating  │           │ sessionId        │         │ feedback        │
│Detection        │           │ questionIndex    │         └─────────────────┘
├─────────────────┤           │ isAnswered       │
│ PK: id          │           │ isSkipped        │
│ sessionId       │           │ retryCount       │
│ mockId          │           │ lastAttemptAt    │
│ userEmail       │           │ updatedAt        │
│ sessionStartTime│           │ cheatingDetection│
│ sessionEndTime  │           │ cheatingRiskScore│
│ sessionDuration │           │ cheatingAlertsCount│
│ sessionCheatingDetection│   │ cheatingDetectionEnabled│
│ sessionCheatingRiskScore│   │ cheatingDetectionSettings│
│ sessionCheatingAlertsCount│  └─────────────────┘
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

┌─────────────────┐    M:N    ┌─────────────────┐    1:N    ┌─────────────────┐
│ UserConnections │◄─────────┤ChatConversations│◄─────────┤  ChatMessages   │
├─────────────────┤           ├─────────────────┤           ├─────────────────┤
│ PK: id          │           │ PK: id          │           │ PK: id          │
│ requesterId     │           │ conversationId  │           │ conversationId  │
│ recipientId     │           │ participant1Id  │           │ senderId        │
│ status          │           │ participant2Id  │           │ message         │
│ createdAt       │           │ lastMessageAt   │           │ messageType     │
│ updatedAt       │           │ createdAt       │           │ isRead          │
└─────────────────┘           │ updatedAt       │           │ createdAt       │
                              └─────────────────┘           └─────────────────┘
```

## Relationship Legend

- **1:1** = One-to-One relationship
- **1:N** = One-to-Many relationship  
- **M:N** = Many-to-Many relationship
- **PK** = Primary Key
- **FK** = Foreign Key
- **UNIQUE** = Unique constraint

## Key Features by Domain

### 🔐 **User Management**
- **UserProfile**: Complete user information with skills, experience, education
- **CVAnalysis**: AI-powered CV parsing and analysis
- Profile completion tracking and validation

### 💼 **Job Management** 
- **JobDetails**: Comprehensive job postings with salary, requirements, location
- **JobRecommendation**: AI-powered job matching with scoring
- Application tracking (viewed/applied status)

### 🎯 **Interview System**
- **MockInterview**: Customizable mock interviews with questions
- **CallInterview**: Real recruiter call interviews
- **userAnswer**: Detailed answer evaluation with AI feedback
- **SessionCheatingDetection**: Advanced cheating detection system

### 💬 **Social Features**
- **UserConnections**: Friend requests and connections
- **ChatConversations**: Real-time messaging system
- **ChatMessages**: Message history and read status

### 📊 **Analytics & Security**
- Comprehensive cheating detection at multiple levels
- Detailed evaluation metrics and scoring
- Session monitoring and risk assessment
- Performance tracking and analytics

## Database Technology Stack

- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with TypeScript
- **Migration**: Drizzle Kit
- **Features**: JSONB for complex data, arrays, timestamps, auto-incrementing IDs

This ERD represents a sophisticated AI-powered interview platform with comprehensive job matching, interview management, social networking, and advanced security features. 