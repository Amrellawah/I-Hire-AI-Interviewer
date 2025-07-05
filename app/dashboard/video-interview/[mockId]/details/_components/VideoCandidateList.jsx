import moment from 'moment'
import React from 'react'
import VideoCandidateFeedbackDialog from './VideoCandidateFeedbackDialog'
import ChatButton from './ChatButton'
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
  Sparkles,
  Users,
  RefreshCw,
  SkipForward,
  Play,
  Shield,
  AlertTriangle
} from 'lucide-react';

function VideoCandidateList({ candidateList }) {
  // Helper function to calculate average score for a candidate
  const calculateAverageScore = (candidate) => {
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

  const formatSessionId = (sessionId) => {
    if (!sessionId) return 'Legacy Session';
    const parts = sessionId.split('_');
    return parts.slice(-2).join('_');
  };

  const getSessionType = (candidate) => {
    if (candidate.sessionId) {
      return 'New Session';
    }
    return 'Legacy Session';
  };

  return (
    <div className='space-y-6'>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-6 rounded bg-gradient-to-b from-[#be3144] to-[#f05941]"></span>
            <h2 className='text-2xl sm:text-3xl font-bold text-[#191011]'>
              Interview Sessions ({candidateList?.length || 0})
            </h2>
          </div>
          <p className="text-[#8e575f] text-base sm:text-lg">Review candidate performance and feedback by session</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-xs sm:text-sm text-emerald-700 font-medium">Live Updates</span>
          </div>
        </div>
      </div>
      
      {candidateList?.length > 0 ? (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6'>
          {candidateList.map((candidate, index) => {
            const averageScore = calculateAverageScore(candidate);
            const percentage = (averageScore / 10) * 100;
            const completedQuestions = candidate.totalQuestions || candidate.answers?.length || 0;
            const answeredQuestions = candidate.answeredQuestions || 0;
            const skippedQuestions = candidate.skippedQuestions || 0;
            const totalRetries = candidate.totalRetries || 0;
            
            return (
              <Card 
                key={index} 
                className='group hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white to-[#f1e9ea] hover:from-red-50 hover:to-pink-50'
              >
                <CardContent className="p-4 sm:p-6">
                  <div className='flex items-start gap-3 sm:gap-5'>
                    {/* Enhanced Avatar */}
                    <div className='flex-shrink-0'>
                      <div className={`h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r ${getAvatarGradient(averageScore)} rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        {candidate.userName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    </div>
                    
                    {/* Candidate Info */}
                    <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                        <div className="space-y-2 min-w-0">
                          <h3 className='font-bold text-[#191011] text-lg sm:text-xl truncate'>
                            {candidate?.userName || 'Anonymous Candidate'}
                          </h3>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#8e575f]'>
                            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1 bg-[#f1e9ea] rounded-full">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-[#8e575f]" />
                              {moment(candidate?.lastAttemptAt || candidate?.createAt, 'DD-MM-YYYY').format('MMM DD, YYYY')}
                            </div>
                            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1 bg-blue-100 rounded-full">
                              <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                              {formatSessionId(candidate.sessionId)}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getPerformanceBadge(averageScore)}
                        </div>
                      </div>
                      
                      {/* Enhanced Score Display */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-semibold text-[#8e575f]">Performance Score</span>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(averageScore).split(' ')[0]}`}>
                              {averageScore}/10
                            </span>
                            {getScoreIcon(averageScore)}
                          </div>
                        </div>
                        <div className="w-full bg-[#f1e9ea] rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 sm:pt-3">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                          <div>
                            <div className="text-sm sm:text-lg font-bold text-[#191011]">{answeredQuestions}</div>
                            <div className="text-xs text-[#8e575f]">Answered</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                          <SkipForward className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                          <div>
                            <div className="text-sm sm:text-lg font-bold text-[#191011]">{skippedQuestions}</div>
                            <div className="text-xs text-[#8e575f]">Skipped</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          <div>
                            <div className="text-sm sm:text-lg font-bold text-[#191011]">{totalRetries}</div>
                            <div className="text-xs text-[#8e575f]">Retries</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                          <div>
                            <div className="text-sm sm:text-lg font-bold text-[#191011]">{averageScore}</div>
                            <div className="text-xs text-[#8e575f]">Avg Score</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Session Type Badge */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${
                          candidate.sessionId 
                            ? 'border-blue-200 text-blue-700 bg-blue-50' 
                            : 'border-gray-200 text-gray-700 bg-gray-50'
                        }`}>
                          {getSessionType(candidate)}
                        </Badge>
                        {candidate.sessionId && (
                          <span className="text-xs text-gray-500">
                            Session ID: {formatSessionId(candidate.sessionId)}
                          </span>
                        )}
                      </div>
                      
                      {/* Cheating Detection Indicator */}
                      {candidate.sessionCheatingData && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs flex items-center gap-1 ${
                            (candidate.sessionCheatingData.sessionCheatingRiskScore || 0) < 30 
                              ? 'border-green-200 text-green-700 bg-green-50' 
                              : (candidate.sessionCheatingData.sessionCheatingRiskScore || 0) < 70 
                              ? 'border-yellow-200 text-yellow-700 bg-yellow-50'
                              : 'border-red-200 text-red-700 bg-red-50'
                          }`}>
                            <Shield className="h-3 w-3" />
                            Cheating Detection
                            {candidate.sessionCheatingData.sessionCheatingAlertsCount > 0 && (
                              <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                                {candidate.sessionCheatingData.sessionCheatingAlertsCount} alerts
                              </span>
                            )}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Risk: {Math.round(candidate.sessionCheatingData.sessionCheatingRiskScore || 0)}%
                          </span>
                        </div>
                      )}
                      
                      {/* Enhanced Action Buttons */}
                      <div className="pt-2 sm:pt-3 flex items-center gap-3">
                        <VideoCandidateFeedbackDialog candidate={candidate} />
                        <ChatButton candidate={candidate} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-red-50">
          <CardContent className="p-8 sm:p-16 text-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-r from-[#f1e9ea] to-red-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-[#8e575f]" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#191011]">No Interview Sessions Yet</h3>
                <p className="text-[#8e575f] max-w-md mx-auto text-sm sm:text-lg">
                  No candidates have completed this video interview yet. 
                  Share the interview link to start receiving submissions.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#8e575f]">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Waiting for candidates...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default VideoCandidateList; 