import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Star, MessageSquare, Lightbulb } from 'lucide-react'

function VideoCandidateFeedbackDialog({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);

  const calculateAverageScore = () => {
    if (!candidate.answers || candidate.answers.length === 0) return 0;
    
    const ratings = candidate.answers.map(answer => {
      const rating = parseFloat(answer.rating) || 0;
      return rating;
    });
    
    const sum = ratings.reduce((total, score) => total + score, 0);
    const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
    return average;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Candidate Feedback - {candidate.userName}
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of {candidate.userName}'s video interview performance
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

          {/* Individual Question Responses */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Responses</h3>
            <div className="space-y-4">
              {candidate.answers?.map((answer, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`font-semibold ${getScoreColor(answer.rating)}`}>
                        {answer.rating}/10
                      </span>
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoCandidateFeedbackDialog 