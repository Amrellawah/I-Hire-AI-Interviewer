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
      {/* Enhanced Header with vibrant colors */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl border-0 p-8 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{interviewDetail?.jobPosition}</h1>
                <p className="text-indigo-100 mt-2 max-w-2xl text-lg">{interviewDetail?.jobDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2">
                <Briefcase className="h-4 w-4 mr-2" />
                {interviewDetail?.category || 'Technical Interview'}
              </Badge>
              <Badge className="bg-emerald-500/20 backdrop-blur-sm text-emerald-100 border-emerald-300/30 px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {stats.totalCandidates} Candidates
              </Badge>
              <Badge className="bg-purple-500/20 backdrop-blur-sm text-purple-100 border-purple-300/30 px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                {interviewDetail?.jobExperience} Experience
              </Badge>
              </div>
              </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.completionRate}%</div>
              <div className="text-indigo-100">Completion Rate</div>
            </div>
            <div className="h-16 w-px bg-white/30"></div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.averageScore}/10</div>
              <div className="text-indigo-100">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Total Candidates</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalCandidates}</div>
            <p className="text-xs text-slate-600 mt-1">
              Completed interviews
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Average Score</CardTitle>
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
            <p className="text-xs text-slate-600 mt-1">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Top Performers</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.topPerformers}</div>
            <p className="text-xs text-slate-600 mt-1">
              Score ≥ 8/10
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-rose-50 to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-slate-700">Need Improvement</CardTitle>
            <div className="h-10 w-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700">{stats.needsImprovement}</div>
            <p className="text-xs text-slate-600 mt-1">
              Score &lt; 6/10
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-2 rounded-2xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 rounded-xl font-medium">
            <Eye className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="candidates" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 rounded-xl font-medium">
            <Users className="h-4 w-4 mr-2" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 rounded-xl font-medium">
            <MessageCircleQuestion className="h-4 w-4 mr-2" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Interview Details */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                  <div>
                    <span className="text-sm text-slate-600">Position</span>
                    <p className="font-semibold text-slate-900">{interviewDetail?.jobPosition}</p>
            </div>
          </div>
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-6 w-6 text-emerald-600" />
          <div>
                    <span className="text-sm text-slate-600">Created</span>
                    <p className="font-semibold text-slate-900">
                      {moment(interviewDetail?.createdAt, 'DD-MM-YYYY').format('MMM DD, YYYY')}
              </p>
            </div>
          </div>
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <div>
                    <span className="text-sm text-slate-600">Category</span>
                    <p className="font-semibold text-slate-900">{interviewDetail?.category || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <div>
                    <span className="text-sm text-slate-600">Experience Required</span>
                    <p className="font-semibold text-slate-900">{interviewDetail?.jobExperience}</p>
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
              <CardContent className="p-6 space-y-6">
                {stats.totalCandidates > 0 ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Success Rate</span>
                        <span className="font-bold text-emerald-600 text-xl">
                          {((stats.topPerformers / stats.totalCandidates) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(stats.topPerformers / stats.totalCandidates) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {stats.topPerformers} out of {stats.totalCandidates} candidates scored 8+ out of 10
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                        <span className="font-bold text-blue-600 text-xl">{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-indigo-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Candidates Yet</h3>
                    <p className="text-slate-500">No candidates have completed this interview yet</p>
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-xl text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Interview Questions
              </CardTitle>
              <CardDescription className="text-purple-100">
                Questions used in this video interview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {interviewDetail?.questionList?.length > 0 ? (
                <div className="space-y-4">
                  {interviewDetail.questionList.map((question, index) => (
                    <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-white/80 to-purple-50/80 rounded-2xl border border-purple-200/50 hover:border-purple-300 hover:shadow-lg transition-all duration-200 backdrop-blur-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <p className="font-semibold text-slate-800 leading-relaxed">{question.question}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {question.type || 'General'}
                          </Badge>
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                            <Play className="h-3 w-3 mr-1" />
                            Video Question
                          </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircleQuestion className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Questions Found</h3>
                  <p className="text-slate-500">No questions have been set for this interview</p>
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