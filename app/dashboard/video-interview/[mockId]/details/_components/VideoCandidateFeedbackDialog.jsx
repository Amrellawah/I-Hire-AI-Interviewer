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
import { Eye, MessageSquare, Lightbulb, BarChart3, Target, Award, TrendingUp, ChevronDown, ChevronRight, Shield, Filter, Settings } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheatingDetectionReport from './CheatingDetectionReport';
import LabelManagementDialog from './LabelManagementDialog';

export default function VideoCandidateFeedbackDialog({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [labelFilter, setLabelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const calculateAverageScore = () => {
    if (!candidate.answers || candidate.answers.length === 0) return 0;
    const ratings = candidate.answers.map(answer => parseFloat(answer.rating) || 0);
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

  const getCategoryColor = (category) => {
    const colors = {
      'CORE': 'bg-blue-100 text-blue-800 border-blue-200',
      'TECHNICAL': 'bg-green-100 text-green-800 border-green-200',
      'BEHAVIORAL': 'bg-purple-100 text-purple-800 border-purple-200',
      'LEADERSHIP': 'bg-orange-100 text-orange-800 border-orange-200',
      'GENERAL': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['GENERAL'];
  };

  const toggleQuestion = (questionIndex) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionIndex)) {
      newExpanded.delete(questionIndex);
    } else {
      newExpanded.add(questionIndex);
    }
    setExpandedQuestions(newExpanded);
  };

  const expandAllQuestions = () => {
    const allIndices = new Set(candidate.answers?.map((_, index) => index) || []);
    setExpandedQuestions(allIndices);
  };

  const collapseAllQuestions = () => {
    setExpandedQuestions(new Set());
  };

  const renderDetailedEvaluation = (answer) => {
    // Check if detailed evaluation data exists
    if (!answer.detailedEvaluation && !answer.detailedScores) {
      return (
        <div className="space-y-4">
          <h4 className="font-semibold text-[#191011] flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Evaluation Summary
          </h4>
          <div className="p-3 bg-[#f1e9ea] rounded-lg">
            <p className="text-sm text-[#8e575f]">
              Detailed evaluation data will be available for new responses. 
              This response was evaluated using the standard feedback system.
            </p>
          </div>
        </div>
      );
    }

    const evaluationLabels = answer.detailedEvaluation || {};
    const detailedScores = answer.detailedScores || {};

    // Filter and sort labels based on current settings
    let filteredLabels = Object.entries(evaluationLabels);
    
    // Apply category filter
    if (labelFilter !== 'all') {
      filteredLabels = filteredLabels.filter(([label, details]) => {
        const category = details.category || detailedScores?.[label]?.category || 'GENERAL';
        return category === labelFilter;
      });
    }

    // Sort labels
    filteredLabels.sort((a, b) => {
      const scoreA = detailedScores?.[a[0]]?.score || 0;
      const scoreB = detailedScores?.[b[0]]?.score || 0;
      
      if (sortBy === 'score') {
        return scoreB - scoreA; // Highest score first
      } else if (sortBy === 'name') {
        return a[0].localeCompare(b[0]); // Alphabetical
      } else if (sortBy === 'category') {
        const categoryA = a[1].category || detailedScores?.[a[0]]?.category || 'GENERAL';
        const categoryB = b[1].category || detailedScores?.[b[0]]?.category || 'GENERAL';
        return categoryA.localeCompare(categoryB);
      }
      return 0;
    });

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h4 className="font-semibold text-[#191011] flex items-center gap-2 text-sm sm:text-base">
          <BarChart3 className="h-4 w-4" />
          Detailed Evaluation
        </h4>
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-2">
            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Labels</SelectItem>
                <SelectItem value="CORE">Core</SelectItem>
                <SelectItem value="TECHNICAL">Technical</SelectItem>
                <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                <SelectItem value="LEADERSHIP">Leadership</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">By Score</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Overall Score Summary */}
        {answer.evaluationScore && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#191011]">AI Evaluation Score:</span>
              <span className={`text-lg font-bold ${getScoreColor(answer.evaluationScore)}`}>
                {answer.evaluationScore}/10
              </span>
            </div>
            {answer.combinedScore && answer.combinedScore !== answer.evaluationScore && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-medium text-[#191011]">Combined Score:</span>
                <span className={`text-sm font-semibold ${getScoreColor(answer.combinedScore)}`}>
                  {answer.combinedScore}/10
                </span>
              </div>
            )}
          </div>
        )}

        {/* Category-based Label Display */}
        <div className="space-y-4">
          {['CORE', 'TECHNICAL', 'BEHAVIORAL', 'LEADERSHIP', 'GENERAL'].map(category => {
            const categoryLabels = filteredLabels.filter(([label, details]) => {
              const labelCategory = details.category || detailedScores?.[label]?.category || 'GENERAL';
              return labelCategory === category;
            });

            if (categoryLabels.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                  <h5 className="font-medium text-sm text-[#191011]">
                    {categoryLabels.length} {categoryLabels.length === 1 ? 'label' : 'labels'}
                  </h5>
                </div>
                
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {categoryLabels.map(([label, details]) => {
            const score = detailedScores?.[label]?.score || 0;
            const justification = details.justification || "";
            const labelValue = details.value || "Not Evaluated";
                    const weight = detailedScores?.[label]?.weight || 1;
            
            return (
              <div 
                key={label} 
                className={`p-2 sm:p-3 rounded-lg border ${getScoreBorderColor(score)} ${getScoreBackgroundColor(score)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-xs sm:text-sm text-[#191011]">{label}</h5>
                    <p className="text-xs text-[#8e575f] mt-1">{labelValue}</p>
                            <p className="text-xs text-gray-500 mt-1">Weight: {weight}x</p>
                  </div>
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
                <p className="text-xs text-[#8e575f]">{justification}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Insights */}
        {filteredLabels.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <h5 className="font-medium text-sm text-[#191011] mb-2">Performance Insights</h5>
            <div className="space-y-1">
              {filteredLabels.slice(0, 3).map(([label, details]) => {
                const score = detailedScores?.[label]?.score || 0;
                return (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-[#8e575f]">{label}:</span>
                    <span className={`font-medium ${getScoreColor(score)}`}>
                      {score >= 7 ? 'Strong' : score >= 5 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleLabelConfigSave = (config) => {
    // Handle label configuration save
    console.log('Label configuration saved:', config);
    toast.success('Label configuration updated!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-[#f1e9ea] text-[#a31d1d] hover:bg-red-50 hover:border-[#be3144]">
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#191011]">
            Candidate Feedback - {candidate.userName}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-[#8e575f]">
            Comprehensive analysis of {candidate.userName}'s video interview performance
          </DialogDescription>
            </div>
            <LabelManagementDialog onSave={handleLabelConfigSave} />
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-[#f1e9ea]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#191011]">Overall Performance</h3>
                <p className="text-xs sm:text-sm text-[#8e575f]">Average score across all questions</p>
              </div>
              <div className="text-left sm:text-right">
                <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(calculateAverageScore())}`}>
                  {calculateAverageScore()}/10
                </div>
                <div className="text-xs sm:text-sm text-[#8e575f]">
                  {candidate.answers?.length || 0} questions completed
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          {candidate.answers?.some(answer => answer.overallAssessment) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <h3 className="text-base sm:text-lg font-semibold text-[#191011] mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                Performance Summary
              </h3>
              <div className="space-y-2">
                {candidate.answers?.map((answer, index) => (
                  answer.overallAssessment && (
                    <div key={index} className="text-xs sm:text-sm text-[#8e575f]">
                      <span className="font-medium">Q{index + 1}:</span> {answer.overallAssessment}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Quick Performance Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-[#191011] mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Quick Performance Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {candidate.answers?.map((answer, index) => {
                const score = parseFloat(answer.rating) || 0;
                const hasDetailedEvaluation = answer.detailedEvaluation || answer.detailedScores;
                
                return (
                  <div 
                    key={index} 
                    className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                      score >= 8 ? 'bg-green-100 border-green-200' :
                      score >= 6 ? 'bg-yellow-100 border-yellow-200' :
                      'bg-red-100 border-red-200'
                    }`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="text-center">
                      <div className={`text-lg sm:text-xl font-bold ${
                        score >= 8 ? 'text-green-600' :
                        score >= 6 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Q{index + 1}
                      </div>
                      <div className={`text-sm font-semibold ${
                        score >= 8 ? 'text-green-600' :
                        score >= 6 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {score}/10
                      </div>
                      {hasDetailedEvaluation && (
                        <div className="text-xs text-gray-500 mt-1">
                          Detailed eval available
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-[#8e575f] text-center">
              Click on any question card above to expand and view detailed feedback
            </div>
          </div>

          {/* Individual Question Responses */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#191011]">Question Responses</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAllQuestions}
                  className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAllQuestions}
                  className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Collapse All
                </Button>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {candidate.answers?.map((answer, index) => {
                const isExpanded = expandedQuestions.has(index);
                
                return (
                  <Collapsible 
                    key={index} 
                    open={isExpanded} 
                    onOpenChange={() => toggleQuestion(index)}
                    className="bg-white border border-[#f1e9ea] rounded-lg hover:border-[#be3144] transition-colors"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 cursor-pointer hover:bg-[#f1e9ea] transition-colors">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-[#8e575f]" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-[#8e575f]" />
                          )}
                          <h4 className="font-medium text-[#191011] text-sm sm:text-base">Question {index + 1}</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getScoreColor(answer.rating)} ${getScoreBackgroundColor(answer.rating)}`}>
                            {answer.rating}/10
                          </div>
                          {answer.combinedScore && answer.combinedScore !== answer.rating && (
                            <div className="text-xs text-[#8e575f]">
                              Combined: {answer.combinedScore}/10
                            </div>
                          )}
                          <div className="text-xs text-[#8e575f]">
                            {isExpanded ? 'Click to collapse' : 'Click to expand'}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3 border-t border-[#f1e9ea]">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-[#8e575f] mb-1">Question:</p>
                          <p className="text-[#191011] bg-[#f1e9ea] p-2 rounded text-sm sm:text-base">{answer.question}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-[#8e575f] mb-1">Answer:</p>
                          <p className="text-[#191011] bg-[#f1e9ea] p-2 rounded text-sm sm:text-base">{answer.userAns}</p>
                        </div>
                        
                        {answer.feedback && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-[#8e575f] mb-1 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Feedback:
                            </p>
                            <p className="text-[#191011] bg-red-50 p-2 rounded border-l-2 border-[#be3144] text-sm sm:text-base">
                              {answer.feedback}
                            </p>
                          </div>
                        )}
                        
                        {answer.suggestions && (
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-[#8e575f] mb-1 flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" />
                              Suggestions:
                            </p>
                            <p className="text-[#191011] bg-yellow-50 p-2 rounded border-l-2 border-yellow-200 text-sm sm:text-base">
                              {answer.suggestions}
                            </p>
                          </div>
                        )}

                        {/* Detailed Evaluation */}
                        {renderDetailedEvaluation(answer)}

                        {/* Cheating Detection Report */}
                        <CheatingDetectionReport cheatingData={answer.cheatingDetection} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>

          {/* Candidate Info */}
          <div className="bg-[#f1e9ea] p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-md font-semibold text-[#191011] mb-2">Candidate Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[#8e575f]">Email:</span>
                <p className="font-medium text-[#191011] break-all">{candidate.userEmail}</p>
              </div>
              <div>
                <span className="text-[#8e575f]">Completed:</span>
                <p className="font-medium text-[#191011]">{candidate.createAt}</p>
              </div>
              {candidate.answers?.some(answer => answer.language) && (
                <div>
                  <span className="text-[#8e575f]">Language:</span>
                  <p className="font-medium text-[#191011]">
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