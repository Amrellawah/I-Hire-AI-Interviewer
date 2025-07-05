import { Download, CheckCircle, SkipForward, Clock, Target, Trophy, ArrowRight } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, onSelectQuestion }) {
  const downloadQuestionsAsExcel = () => {
    if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) return;
    const data = mockInterviewQuestion.map((question, index) => ({
      "Question Number": index + 1,
      "Question Text": question.question,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');
    XLSX.writeFile(workbook, 'Interview_Questions.xlsx');
  };

  const getQuestionStatus = (index) => {
    // This would need to be passed as a prop or calculated based on user answers
    // For now, we'll show different states based on index
    if (index < activeQuestionIndex) return 'completed';
    if (index === activeQuestionIndex) return 'active';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <Target className="w-4 h-4 text-[#be3144]" />;
      case 'skipped':
        return <SkipForward className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-[#be3144] text-white border-[#be3144]';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return mockInterviewQuestion && (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <Card className="border-0 shadow-none bg-gradient-to-r from-[#be3144] to-[#f05941] text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">Question Navigator</CardTitle>
                  <CardDescription className="text-white/80">
                    {activeQuestionIndex + 1} of {mockInterviewQuestion.length} questions
                  </CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadQuestionsAsExcel}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Questions</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
        </Card>

        {/* Questions Grid */}
        <CardContent className="flex-1 p-6">
          <div className="space-y-4">
            {/* Progress Overview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={(activeQuestionIndex + 1) / mockInterviewQuestion.length * 100} 
                className="h-2 bg-gray-200" 
              />
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-3">
              {mockInterviewQuestion.map((question, index) => {
                const status = getQuestionStatus(index);
                const isActive = index === activeQuestionIndex;
                
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <button
                        className={`relative transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm border-2 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:ring-offset-2 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-[#be3144] scale-105 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#be3144] hover:text-[#be3144] hover:shadow-md'
                        }`}
                        onClick={() => onSelectQuestion && onSelectQuestion(index)}
                        aria-label={`Question ${index + 1}`}
                      >
                        {index + 1}
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div className="max-w-xs">
                        <p className="font-medium">Question {index + 1}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {question.question.length > 100 
                            ? question.question.substring(0, 100) + '...' 
                            : question.question}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Status Legend */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#be3144] rounded-full"></div>
                  <span className="text-xs text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Skipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-gray-700 hover:text-[#be3144]"
                onClick={() => onSelectQuestion && onSelectQuestion(Math.max(0, activeQuestionIndex - 1))}
                disabled={activeQuestionIndex === 0}
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Previous Question
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-gray-700 hover:text-[#be3144]"
                onClick={() => onSelectQuestion && onSelectQuestion(Math.min(mockInterviewQuestion.length - 1, activeQuestionIndex + 1))}
                disabled={activeQuestionIndex === mockInterviewQuestion.length - 1}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Next Question
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </TooltipProvider>
  );
}

export default QuestionsSection;
