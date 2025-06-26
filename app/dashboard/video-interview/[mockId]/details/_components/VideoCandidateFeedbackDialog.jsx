import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Lightbulb, BarChart3, Target, Award, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function VideoCandidateFeedbackDialog({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);

  const calculateAverageScore = () => {
    if (!candidate.answers || candidate.answers.length === 0) return 0;
    const ratings = candidate.answers.map(answer => parseInt(answer.rating) || 0);
    const sum = ratings.reduce((total, score) => total + score, 0);
    const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
    return average;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackgroundColor = (score) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 8) return 'border-green-200';
    if (score >= 6) return 'border-yellow-200';
    return 'border-red-200';
  };

  const renderDetailedEvaluation = (answer) => {
    // Check if detailed evaluation data exists
    if (!answer.detailedEvaluation && !answer.detailedScores) {
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Evaluation Summary
          </h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Detailed evaluation data will be available for new responses. 
              This response was evaluated using the standard feedback system.
            </p>
          </div>
        </div>
      );
    }

    const evaluationLabels = answer.detailedEvaluation || {};
    const detailedScores = answer.detailedScores || {};

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Detailed Evaluation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(evaluationLabels).map(([label, details]) => {
            const score = detailedScores?.[label]?.score || 0;
            const justification = details.justification || "";
            
            return (
              <div 
                key={label} 
                className={`p-3 rounded-lg border ${getScoreBorderColor(score)} ${getScoreBackgroundColor(score)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm text-gray-800">{label}</h5>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getScoreColor(score)}`}>
                    {score}/10
                  </span>
                </div>
                <div className="mb-2">
                  <Progress 
                    value={score * 10} 
                    className="h-2"
                    indicatorClassName={score >= 7 ? 'bg-green-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}
                  />
                </div>
                <p className="text-xs text-gray-600">{justification}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Candidate Feedback - {candidate.userName}
          </DialogTitle>
          <DialogDescription>
            Comprehensive analysis of {candidate.userName}'s video interview performance
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
                <p className="text-sm text-gray-600">Average score across all questions</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(calculateAverageScore())}`}>
                  {calculateAverageScore()}/10
                </div>
                <div className="text-sm text-gray-500">
                  {candidate.answers?.length || 0} questions completed
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          {candidate.answers?.some(answer => answer.overallAssessment) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Summary
              </h3>
              <div className="space-y-2">
                {candidate.answers?.map((answer, index) => (
                  answer.overallAssessment && (
                    <div key={index} className="text-sm text-gray-700">
                      <span className="font-medium">Q{index + 1}:</span> {answer.overallAssessment}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Individual Question Responses */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Responses</h3>
            <div className="space-y-6">
              {candidate.answers?.map((answer, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(answer.rating)} ${getScoreBackgroundColor(answer.rating)}`}>
                        {answer.rating}/10
                      </div>
                      {answer.combinedScore && answer.combinedScore !== answer.rating && (
                        <div className="text-xs text-gray-500">
                          Combined: {answer.combinedScore}/10
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                      <p className="text-gray-600 bg-gray-50 p-2 rounded">{answer.question}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Answer:</p>
                      <p className="text-gray-600 bg-gray-50 p-2 rounded">{answer.userAns}</p>
                    </div>
                    
                    {answer.feedback && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Feedback:
                        </p>
                        <p className="text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                          {answer.feedback}
                        </p>
                      </div>
                    )}
                    
                    {answer.suggestions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Suggestions:
                        </p>
                        <p className="text-gray-600 bg-yellow-50 p-2 rounded border-l-2 border-yellow-200">
                          {answer.suggestions}
                        </p>
                      </div>
                    )}

                    {/* Detailed Evaluation */}
                    {renderDetailedEvaluation(answer)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Candidate Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{candidate.userEmail}</p>
              </div>
              <div>
                <span className="text-gray-500">Completed:</span>
                <p className="font-medium">{candidate.createAt}</p>
              </div>
              {candidate.answers?.some(answer => answer.language) && (
                <div>
                  <span className="text-gray-500">Language:</span>
                  <p className="font-medium">
                    {candidate.answers.find(answer => answer.language)?.language || 'Not specified'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 