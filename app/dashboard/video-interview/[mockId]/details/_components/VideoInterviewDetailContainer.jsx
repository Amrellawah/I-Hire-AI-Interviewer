import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Calendar, 
  MapPin, 
  Clock, 
  BarChart3, 
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  MessageCircleQuestion,
  Star,
  Eye,
  Play,
  Zap,
  Shield,
  Globe,
  Video
} from 'lucide-react';
import VideoCandidateList from './VideoCandidateList';
import moment from 'moment';

function VideoInterviewDetailContainer({ interviewDetail, candidateList }) {
  const [activeTab, setActiveTab] = useState('overview');

  const calculateOverallStats = () => {
    if (!candidateList || candidateList.length === 0) {
      return {
        totalCandidates: 0,
        averageScore: 0,
        topPerformers: 0,
        needsImprovement: 0,
        completionRate: 0
      };
    }

    const scores = candidateList.map(candidate => {
      const ratings = candidate.answers?.map(answer => parseInt(answer.rating) || 0) || [];
      return ratings.length > 0 ? ratings.reduce((sum, score) => sum + score, 0) / ratings.length : 0;
    });

    const averageScore = scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : 0;
    const topPerformers = scores.filter(score => score >= 8).length;
    const needsImprovement = scores.filter(score => score < 6).length;
    const completionRate = candidateList.length > 0 ? ((candidateList.filter(c => c.answers?.length > 0).length / candidateList.length) * 100).toFixed(1) : 0;

    return {
      totalCandidates: candidateList.length,
      averageScore: parseFloat(averageScore),
      topPerformers,
      needsImprovement,
      completionRate: parseFloat(completionRate)
    };
  };

  const getPerformanceColor = (score) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return <Star className="h-4 w-4 text-emerald-600" />;
    if (score >= 6) return <TrendingUp className="h-4 w-4 text-amber-600" />;
    return <AlertCircle className="h-4 w-4 text-rose-600" />;
  };

  const stats = calculateOverallStats();

  return (
    <div className="space-y-8">
      {/* Enhanced Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#8e575f]">Total Candidates</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#191011]">{stats.totalCandidates}</div>
            <p className="text-xs text-[#8e575f] mt-1">
              Completed interviews
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#8e575f]">Average Score</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-bold ${getPerformanceColor(stats.averageScore).split(' ')[0]}`}>
                {stats.averageScore}/10
              </div>
              {getScoreIcon(stats.averageScore)}
            </div>
            <p className="text-xs text-[#8e575f] mt-1">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#8e575f]">Top Performers</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.topPerformers}</div>
            <p className="text-xs text-[#8e575f] mt-1">
              Score ≥ 8/10
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-[#8e575f]">Need Improvement</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">{stats.needsImprovement}</div>
            <p className="text-xs text-[#8e575f] mt-1">
              Score &lt; 6/10
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[#f1e9ea] p-1 sm:p-2 rounded-2xl">
          <TabsTrigger value="overview" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Candidates</span>
            <span className="sm:hidden">Candidates</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <MessageCircleQuestion className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Questions</span>
            <span className="sm:hidden">Questions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Enhanced Interview Details */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-red-50">
              <CardHeader className="bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-t-xl text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-[#a31d1d] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Position</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base truncate">{interviewDetail?.jobPosition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Created</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base">
                      {moment(interviewDetail?.createdAt, 'DD-MM-YYYY').format('MMM DD, YYYY')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Category</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base">{interviewDetail?.category || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Experience Required</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base">{interviewDetail?.jobExperience}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Performance Insights */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-xl text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {stats.totalCandidates > 0 ? (
                  <>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-[#8e575f]">Success Rate</span>
                        <span className="font-bold text-emerald-600 text-lg sm:text-xl">
                          {((stats.topPerformers / stats.totalCandidates) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#f1e9ea] rounded-full h-2 sm:h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-green-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(stats.topPerformers / stats.totalCandidates) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#8e575f]">
                        {stats.topPerformers} out of {stats.totalCandidates} candidates scored 8+ out of 10
                      </p>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-[#8e575f]">Completion Rate</span>
                        <span className="font-bold text-[#a31d1d] text-lg sm:text-xl">{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-[#f1e9ea] rounded-full h-2 sm:h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#be3144] to-[#f05941] h-2 sm:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#f1e9ea] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-[#8e575f]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#191011] mb-2">No Candidates Yet</h3>
                    <p className="text-[#8e575f] text-sm sm:text-base">No candidates have completed this interview yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <VideoCandidateList candidateList={candidateList} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-t-xl text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Interview Questions ({interviewDetail?.questionList?.length || 0})
              </CardTitle>
              <CardDescription className="text-red-100">
                Questions used in this video interview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {interviewDetail?.questionList?.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {interviewDetail.questionList.map((question, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-[#f1e9ea] hover:border-[#be3144] hover:shadow-lg transition-all duration-200">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#be3144] to-[#f05941] text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#191011] leading-relaxed mb-2 text-sm sm:text-base">
                          {question.question}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-[#f1e9ea] text-[#8e575f] border-[#f1e9ea] text-xs">
                            {question.type || 'General'}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#f1e9ea] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MessageCircleQuestion className="h-8 w-8 sm:h-10 sm:w-10 text-[#8e575f]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#191011] mb-2">No Questions Found</h3>
                  <p className="text-[#8e575f] text-sm sm:text-base">No questions have been set for this interview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VideoInterviewDetailContainer; 