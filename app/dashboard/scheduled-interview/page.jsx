"use client"
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { eq, desc, count, sql } from 'drizzle-orm'
import { callInterview, MockInterview, UserAnswer } from '@/utils/schema'
import { Video, Calendar, Users, TrendingUp, Filter, Search, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CallInterviewCard from '../_components/CallInterviewCard'
import InterviewItemCard from '../_components/InterviewItemCard'

function ScheduledInterview() {
    const { user, isLoaded } = useUser();
    const [callInterviewList, setCallInterviewList] = useState([]);
    const [mockInterviewList, setMockInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
            GetCallInterviewList();
            GetMockInterviewList();
        }
    }, [user, isLoaded])

    const GetCallInterviewList = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await db.query.callInterview.findMany({
                where: eq(callInterview.recruiterEmail, user.primaryEmailAddress.emailAddress),
                with: {
                    feedback: true
                },
                orderBy: desc(callInterview.createdAt)
            });

            setCallInterviewList(result);
        } catch (error) {
            console.error("Error fetching call interviews:", error);
            setError("Failed to load call interviews. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const GetMockInterviewList = async () => {
        try {
            // Get all mock interviews for the user
            const mockInterviews = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress || ''))
                .orderBy(desc(MockInterview.createdAt));
            
            // Get candidate counts for each mock interview
            const mockInterviewsWithCounts = await Promise.all(
                mockInterviews.map(async (interview) => {
                    const candidateCountResult = await db
                        .select({ count: count(sql`DISTINCT ${UserAnswer.userEmail}`) })
                        .from(UserAnswer)
                        .where(eq(UserAnswer.mockIdRef, interview.mockId));
                    
                    return {
                        ...interview,
                        candidateCount: candidateCountResult[0]?.count || 0
                    };
                })
            );
            
            setMockInterviewList(mockInterviewsWithCounts);
        } catch (error) {
            console.error("Error fetching mock interviews:", error);
            setError("Failed to load mock interviews. Please try again later.");
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([GetCallInterviewList(), GetMockInterviewList()]);
        setRefreshing(false);
    }

    const filteredCallInterviews = callInterviewList.filter(interview =>
        interview.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMockInterviews = mockInterviewList.filter(interview =>
        interview.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalInterviews = callInterviewList.length + mockInterviewList.length;
    const totalCandidates = callInterviewList.reduce((sum, interview) => sum + (interview.feedback?.length || 0), 0) +
                          mockInterviewList.reduce((sum, interview) => sum + (interview.candidateCount || 0), 0);

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header with skeleton */}
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                
                {/* Stats skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
                
                {/* Content skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                        <Video className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={handleRefresh} className="bg-gradient-to-r from-[#A31D1D] to-[#C53030] hover:from-[#C53030] hover:to-[#E53E3E] animate-pulse-glow">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Scheduled Jobs</h1>
                        <p className="text-gray-600 mt-1">Manage and track all your interview sessions</p>
                    </div>
                    <Button 
                        onClick={handleRefresh}
                        variant="outline"
                        disabled={refreshing}
                        className="flex items-center gap-2 hover:shadow-lg transition-all duration-200 border-[#A31D1D] text-[#A31D1D] hover:bg-[#A31D1D] hover:text-white"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-animation">
                <Card className="bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] border-[#FECACA] animate-stats-enter hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#A31D1D]">Total Interviews</p>
                                <p className="text-2xl font-bold text-[#7F1D1D]">{totalInterviews}</p>
                            </div>
                            <div className="h-12 w-12 bg-[#A31D1D] rounded-lg flex items-center justify-center animate-float shadow-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border-[#BBF7D0] animate-stats-enter hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#166534]">Total Candidates</p>
                                <p className="text-2xl font-bold text-[#14532D]">{totalCandidates}</p>
                            </div>
                            <div className="h-12 w-12 bg-[#16A34A] rounded-lg flex items-center justify-center animate-float shadow-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-[#FCD34D] animate-stats-enter hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#92400E]">Active Sessions</p>
                                <p className="text-2xl font-bold text-[#78350F]">
                                    {callInterviewList.filter(i => i.status === 'active').length + 
                                     mockInterviewList.filter(i => i.status === 'active').length}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-[#F59E0B] rounded-lg flex items-center justify-center animate-float shadow-lg">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Section (no filter buttons) */}
            <Card className="animate-card-enter hover:shadow-lg transition-all duration-300 bg-white border-[#E4D3D5]">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search interviews by position..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 focus:ring-2 focus:ring-[#A31D1D]/20 border-[#E4D3D5] focus:border-[#A31D1D] transition-all duration-200"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Section */}
            {totalInterviews === 0 ? (
                <Card className="text-center py-12 animate-card-enter bg-white border-[#E4D3D5]">
                    <CardContent>
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                            <Video className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews yet</h3>
                        <p className="text-gray-600 mb-4">Create your first interview to get started</p>
                        <Button className="bg-gradient-to-r from-[#A31D1D] to-[#C53030] hover:from-[#C53030] hover:to-[#E53E3E] animate-pulse-glow">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Interview
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 animate-card-enter bg-[#FEF2F2] border-[#FECACA]">
                        <TabsTrigger 
                            value="all" 
                            className="data-[state=active]:bg-[#A31D1D] data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            All Interviews ({totalInterviews})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="call" 
                            className="data-[state=active]:bg-[#A31D1D] data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            Call ({callInterviewList.length})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="video" 
                            className="data-[state=active]:bg-[#A31D1D] data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            Video ({mockInterviewList.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-animation">
                            {filteredCallInterviews.map((interview, index) => (
                                <div key={`call-${index}`} className="transform hover:scale-105 transition-transform duration-200">
                                    <CallInterviewCard interview={interview} viewDetail={true} />
                                </div>
                            ))}
                            {filteredMockInterviews.map((interview, index) => (
                                <div key={`mock-${index}`} className="transform hover:scale-105 transition-transform duration-200">
                                    <InterviewItemCard interview={interview} viewDetail={true} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="call" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-animation">
                            {filteredCallInterviews.map((interview, index) => (
                                <div key={`call-${index}`} className="transform hover:scale-105 transition-transform duration-200">
                                    <CallInterviewCard interview={interview} viewDetail={true} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="video" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-animation">
                            {filteredMockInterviews.map((interview, index) => (
                                <div key={`mock-${index}`} className="transform hover:scale-105 transition-transform duration-200">
                                    <InterviewItemCard interview={interview} viewDetail={true} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}

export default ScheduledInterview