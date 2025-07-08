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
  Video,
  PieChart,
  Settings
} from 'lucide-react';
import VideoCandidateList from './VideoCandidateList';
import LabelAnalytics from './LabelAnalytics';
import InterviewSettings from './InterviewSettings';
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
      const ratings = candidate.answers?.map(answer => parseFloat(answer.rating) || 0) || [];
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
        <TabsList className="grid w-full grid-cols-5 bg-[#f1e9ea] p-1 sm:p-2 rounded-2xl">
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
          <TabsTrigger value="analytics" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <PieChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <MessageCircleQuestion className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Questions</span>
            <span className="sm:hidden">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="transition-all font-medium rounded-xl flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#be3144] data-[state=active]:to-[#f05941] data-[state=active]:text-white data-[state=active]:shadow-none
            data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#8e575f]">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
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
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Duration</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base">
                      {interviewDetail?.duration || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-[#8e575f]">Location</span>
                    <p className="font-semibold text-[#191011] text-sm sm:text-base">
                      {interviewDetail?.location || 'Remote'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Performance Metrics */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-emerald-600">{stats.completionRate}%</div>
                    <div className="text-xs text-[#8e575f]">Completion Rate</div>
                      </div>
                  <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</div>
                    <div className="text-xs text-[#8e575f]">Total Candidates</div>
                      </div>
                    </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    <span className="text-sm text-[#8e575f]">Top Performers</span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      {stats.topPerformers} candidates
                    </Badge>
                    </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    <span className="text-sm text-[#8e575f]">Need Improvement</span>
                    <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                      {stats.needsImprovement} candidates
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <VideoCandidateList candidateList={candidateList} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LabelAnalytics candidateList={candidateList} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {/* Questions Analysis */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MessageCircleQuestion className="h-5 w-5 text-white" />
                </div>
                Questions Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {interviewDetail?.questionList && interviewDetail.questionList.length > 0 ? (
                <div className="space-y-4">
                  {interviewDetail.questionList.map((q, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-[#be3144]">Q{idx + 1}:</span>
                        <span className="text-gray-900 font-medium">{q.question || q}</span>
                      </div>
                      {q.type && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#fbeaec] text-[#be3144]">{q.type}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircleQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Questions Analysis</h3>
                  <p className="text-gray-500">
                    No questions found for this interview.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <InterviewSettings 
            mockId={interviewDetail?.mockId} 
            isHidden={interviewDetail?.isHidden || false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VideoInterviewDetailContainer; 