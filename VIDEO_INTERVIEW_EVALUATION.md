# Video Interview Evaluation System

## Overview

This system provides a comprehensive video interview evaluation platform that automatically analyzes candidate responses and provides detailed feedback to recruiters. The evaluation system uses advanced AI-powered analysis to assess multiple dimensions of candidate performance with sophisticated label-based scoring.

## Features

### 🎯 **Sophisticated Evaluation Engine**
- **Multi-dimensional Analysis**: Evaluates 10+ different aspects of candidate responses
- **Standardized Scoring**: Uses consistent scoring scales across all evaluation criteria
- **AI-Powered Insights**: Leverages GPT-4 for intelligent analysis and feedback generation
- **Real-time Processing**: Evaluates responses immediately after recording
- **Label-Based System**: Comprehensive evaluation using standardized labels with justifications

### 📊 **Comprehensive Feedback System**
- **Detailed Labels**: Each response is analyzed across multiple dimensions
- **Justified Scores**: Every evaluation includes explanations for the assigned scores
- **Improvement Suggestions**: Provides actionable feedback for candidates
- **Performance Trends**: Tracks candidate performance across multiple questions
- **Weighted Scoring**: Different evaluation criteria have appropriate weights

### 🎥 **Video Recording & Transcription**
- **High-Quality Recording**: Captures both video and audio
- **Automatic Transcription**: Converts speech to text using OpenAI Whisper
- **Language Detection**: Supports multiple languages (English, Arabic, etc.)
- **Quality Assessment**: Evaluates transcription accuracy

### 📈 **Recruiter Dashboard**
- **Performance Overview**: Visual representation of candidate performance
- **Detailed Analytics**: Comprehensive breakdown of evaluation results
- **Candidate Comparison**: Easy comparison between multiple candidates
- **Export Capabilities**: Download evaluation reports
- **Enhanced Visualization**: Improved display of detailed evaluation data

## Evaluation Dimensions

### Core Evaluation Labels
1. **Relevance to Question** - How well the answer addresses the specific question asked
2. **Technical Accuracy** - Correctness of technical concepts, facts, or methodologies mentioned
3. **Clarity of Expression** - How clearly and understandably the candidate communicates their thoughts
4. **Answer Structure** - Logical organization and flow of the response
5. **Depth of Knowledge** - Level of expertise and understanding demonstrated
6. **Practical Application** - How well the candidate can apply concepts to real-world scenarios
7. **Problem-Solving Approach** - Methodology and reasoning used to address challenges
8. **Communication Skills** - Effectiveness of verbal communication and articulation
9. **Confidence Level** - Self-assurance and conviction in the response
10. **Answer Completeness** - How thoroughly the question was addressed

### Scoring Categories

#### Degree-based Values
- **None**: 0, **Minimal**: 1.7, **Low**: 3.3, **Moderate**: 5, **Considerable**: 6.7, **High**: 8.3, **Extensive**: 10

#### Quality-based Values
- **Very Poor**: 0, **Poor**: 2, **Below Average**: 4, **Average**: 5, **Above Average**: 6, **Strong**: 7.5, **Excellent**: 9, **Exceptional**: 10

#### Binary Values
- **Not Detected**: 0, **Partially Detected**: 3.3, **Detected**: 6.7, **Clearly Evident**: 10

#### Expression-based Values
- **Incoherent**: 0, **Confusing**: 2, **Verbose**: 4, **Wordy**: 5, **Adequately Expressed**: 6, **Clear**: 8, **Concise**: 9, **Highly Articulate**: 10

#### Structure Values
- **Unstructured**: 0, **Poorly Structured**: 2, **Partially Structured**: 4, **Mostly Structured**: 6, **Logically Structured**: 8, **Well-Organized**: 10

#### Relevance Values
- **Not Relevant**: 0, **Marginally Relevant**: 1.7, **Partially Relevant**: 3.3, **Generally Relevant**: 5, **Relevant**: 6.7, **Highly Relevant**: 8.3, **Directly Aligned**: 10

#### Technical Accuracy Values
- **Incorrect**: 0, **Mostly Incorrect**: 1.7, **Partially Correct**: 3.3, **Generally Correct**: 5, **Mostly Correct**: 6.7, **Fully Correct**: 8.3, **Technically Precise**: 10

## API Endpoints

### `/api/video-interview-evaluation`
**POST** - Main evaluation endpoint with enhanced label system
```json
{
  "question": "What is your experience with React?",
  "answer": "I have 3 years of experience...",
  "interviewType": "technical"
}
```

**Response:**
```json
{
  "labels": {
    "Relevance to Question": {
      "value": "Highly Relevant",
      "justification": "Directly addresses the React experience question..."
    },
    "Technical Accuracy": {
      "value": "Mostly Correct",
      "justification": "Demonstrates solid understanding of React concepts..."
    }
  },
  "evaluation_score": 7.5,
  "detailed_scores": {
    "Relevance to Question": {
      "label_value": "Highly Relevant",
      "score": 8.3,
      "weight": 1.5,
      "weighted_score": 12.45,
      "justification": "Directly addresses the React experience question..."
    }
  },
  "combined_score": 7.8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### `/api/test-video-evaluation`
**POST** - Test endpoint for enhanced evaluation system
```json
{
  "question": "Tell me about yourself",
  "answer": "I am a software developer...",
  "interviewType": "behavioral"
}
```

## Database Schema

### UserAnswer Table
```sql
CREATE TABLE "userAnswer" (
  "id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "mockIdRef" varchar NOT NULL,
  "question" varchar NOT NULL,
  "userAns" text,
  "feedback" text,
  "rating" varchar,
  "suggestions" text,
  "userEmail" varchar,
  "createdAt" varchar,
  "interview_type" varchar,
  "audioRecording" text,
  "language" varchar,
  "detailedEvaluation" jsonb,
  "evaluationScore" varchar,
  "detailedScores" jsonb,
  "combinedScore" varchar,
  "overallAssessment" text
);
```

## Scoring System

### Label Score Mapping
```javascript
const LABEL_SCORE_MAP = {
  // Degree-based
  'None': 0, 'Minimal': 1.7, 'Low': 3.3, 'Moderate': 5, 
  'Considerable': 6.7, 'High': 8.3, 'Extensive': 10,
  
  // Quality-based
  'Very Poor': 0, 'Poor': 2, 'Below Average': 4, 'Average': 5,
  'Above Average': 6, 'Strong': 7.5, 'Excellent': 9, 'Exceptional': 10,
  
  // Binary
  'Not Detected': 0, 'Partially Detected': 3.3, 
  'Detected': 6.7, 'Clearly Evident': 10
};
```

### Weighted Scoring
```javascript
const LABEL_WEIGHTS = {
  "Relevance to Question": 1.5,
  "Technical Accuracy": 1.5,
  "Clarity of Expression": 1.2,
  "Answer Structure": 1.2,
  "Depth of Knowledge": 1.3,
  "Practical Application": 1.4,
  "Problem-Solving Approach": 1.3,
  "Communication Skills": 1.1,
  "Confidence Level": 1.0,
  "Answer Completeness": 1.2
};
```

## Components

### RecordAnswerSection
- Handles video/audio recording
- Manages transcription
- Calls enhanced evaluation API
- Saves detailed evaluation results to database
- Supports retry functionality

### VideoCandidateFeedbackDialog
- Displays detailed evaluation results with labels
- Shows performance metrics and insights
- Provides improvement suggestions
- Visualizes evaluation dimensions with progress bars
- Sorts evaluation criteria by performance

### VideoInterviewDetailContainer
- Overview dashboard for recruiters
- Performance analytics with detailed breakdowns
- Candidate comparison tools
- Question management
- Enhanced data visualization

## Usage Flow

1. **Interview Setup**
   - Recruiter creates video interview
   - Configures questions and settings
   - Shares interview link with candidates

2. **Candidate Interview**
   - Candidate accesses interview link
   - Records video responses to questions
   - System transcribes audio automatically
   - Real-time evaluation provides detailed feedback

3. **Evaluation Processing**
   - AI analyzes each response using enhanced label system
   - Generates detailed evaluation labels with justifications
   - Calculates weighted scores for each dimension
   - Stores comprehensive results in database

4. **Recruiter Review**
   - Access comprehensive dashboard with detailed analytics
   - View detailed candidate evaluations with label breakdowns
   - Compare multiple candidates across all evaluation dimensions
   - Make informed hiring decisions based on comprehensive data

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
```

## Recent Enhancements

### Enhanced Evaluation System
- **Comprehensive Labels**: 10 specific evaluation dimensions
- **Improved Scoring**: Weighted scoring system for different criteria
- **Better Visualization**: Enhanced display of evaluation results
- **Data Persistence**: Complete evaluation data saved to database
- **Performance Insights**: Automatic analysis of top performance areas

### Technical Improvements
- **API Integration**: Updated to use enhanced video-interview-evaluation endpoint
- **Database Schema**: Added fields for detailed evaluation data
- **Error Handling**: Improved error handling and fallback mechanisms
- **Data Flow**: Complete integration from evaluation to display

## Testing

Use the `/api/test-video-evaluation` endpoint to test the enhanced evaluation system:

```bash
curl -X POST http://localhost:3000/api/test-video-evaluation \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is your experience with React?",
    "answer": "I have 3 years of experience building web applications with React...",
    "interviewType": "technical"
  }'
```

This will return comprehensive evaluation data including all labels, scores, and justifications.

## Troubleshooting

### Common Issues

1. **Evaluation API Fails**
   - Check OpenAI API key configuration
   - Verify API rate limits
   - Review error logs for specific issues

2. **Transcription Issues**
   - Ensure audio quality is sufficient
   - Check language detection settings
   - Verify Whisper API access

3. **Database Errors**
   - Check database connection
   - Verify schema migrations
   - Review query performance

### Support

For technical support or questions about the evaluation system, please refer to the project documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 