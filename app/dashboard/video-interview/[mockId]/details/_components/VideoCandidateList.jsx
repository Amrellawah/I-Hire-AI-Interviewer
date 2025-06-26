import moment from 'moment'
import React from 'react'
import VideoCandidateFeedbackDialog from './VideoCandidateFeedbackDialog'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  Eye,
  Sparkles
} from 'lucide-react';

function VideoCandidateList({ candidateList }) {
  // Helper function to calculate average score for a candidate
  const calculateAverageScore = (candidate) => {
    if (!candidate.answers || candidate.answers.length === 0) return 0;
    
    const ratings = candidate.answers.map(answer => {
      const rating = parseInt(answer.rating) || 0;
      return rating;
    });
    
    const sum = ratings.reduce((total, score) => total + score, 0);
    const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
    return average;
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return <Award className="h-4 w-4 text-emerald-600" />;
    if (score >= 6) return <TrendingUp className="h-4 w-4 text-amber-600" />;
    return <AlertCircle className="h-4 w-4 text-rose-600" />;
  };

  const getPerformanceBadge = (score) => {
    if (score >= 8) return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">Excellent</Badge>;
    if (score >= 6) return <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg">Good</Badge>;
    return <Badge className="bg-gradient-to-r from-rose-500 to-red-600 text-white border-0 shadow-lg">Needs Improvement</Badge>;
  };

  const getAvatarGradient = (score) => {
    if (score >= 8) return 'from-emerald-500 to-green-600';
    if (score >= 6) return 'from-amber-500 to-yellow-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className='space-y-6'>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className='text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
            Candidates ({candidateList?.length || 0})
          </h2>
          <p className="text-slate-600 text-lg">Review candidate performance and feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">Live Updates</span>
          </div>
        </div>
      </div>
      
      {candidateList?.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {candidateList.map((candidate, index) => {
            const averageScore = calculateAverageScore(candidate);
            const percentage = (averageScore / 10) * 100;
            const completedQuestions = candidate.answers?.length || 0;
            
            return (
              <Card 
                key={index} 
                className='group hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-blue-50'
              >
                <CardContent className="p-6">
                  <div className='flex items-start gap-5'>
                    {/* Enhanced Avatar */}
                    <div className='flex-shrink-0'>
                      <div className={`h-16 w-16 bg-gradient-to-r ${getAvatarGradient(averageScore)} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        {candidate.userName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    </div>
                    
                    {/* Candidate Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className='font-bold text-slate-900 text-xl'>
                            {candidate?.userName || 'Anonymous Candidate'}
                          </h3>
                          <div className='flex items-center gap-4 text-sm text-slate-500'>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                              <Calendar className="h-4 w-4 text-slate-600" />
                              {moment(candidate?.createAt, 'DD-MM-YYYY').format('MMM DD, YYYY')}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                              <MessageSquare className="h-4 w-4 text-slate-600" />
                              {completedQuestions} Questions
                            </div>
                          </div>
                        </div>
                        {getPerformanceBadge(averageScore)}
                      </div>
                      
                      {/* Enhanced Score Display */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">Performance Score</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${getScoreColor(averageScore).split(' ')[0]}`}>
                              {averageScore}/10
                            </span>
                            {getScoreIcon(averageScore)}
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              averageScore >= 8 
                                ? 'bg-gradient-to-r from-emerald-400 to-green-600' 
                                : averageScore >= 6 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-600'
                                : 'bg-gradient-to-r from-rose-400 to-red-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Enhanced Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-3">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <div>
                            <div className="text-lg font-bold text-slate-900">{completedQuestions}</div>
                            <div className="text-xs text-slate-600">Completed</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                          <Star className="h-5 w-5 text-amber-600" />
                          <div>
                            <div className="text-lg font-bold text-slate-900">{averageScore}</div>
                            <div className="text-xs text-slate-600">Avg Score</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Button */}
                      <div className="pt-3">
                        <VideoCandidateFeedbackDialog candidate={candidate} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50">
          <CardContent className="p-16 text-center">
            <div className="space-y-6">
              <div className="h-24 w-24 bg-gradient-to-r from-slate-200 to-blue-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-800">No Candidates Yet</h3>
                <p className="text-slate-600 max-w-md mx-auto text-lg">
                  No candidates have completed this video interview yet. 
                  Share the interview link to start receiving submissions.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                <Clock className="h-5 w-5" />
                <span>Waiting for candidates...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default VideoCandidateList; 