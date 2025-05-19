import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Mail, MessageSquare } from 'lucide-react'

function CandidateFeedbackDialog({ candidate }) {
    const feedback = candidate?.feedback?.feedback || {}
    
    const calculateAverage = () => {
        const ratings = [
            feedback?.rating?.technicalSkills || 0,
            feedback?.rating?.communication || 0,
            feedback?.rating?.problemSolving || 0,
            feedback?.rating?.experience || 0
        ];
        
        const sum = ratings.reduce((total, score) => total + score, 0);
        const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
        return average;
    };

    const averageScore = calculateAverage();

    const renderSummary = () => {
        if (!feedback?.summary) return (
            <p className="text-sm sm:text-base text-gray-500 italic">No summary available</p>
        )
        
        if (typeof feedback.summary === 'string') {
            return <p className="text-sm sm:text-base text-gray-700">{feedback.summary}</p>
        }
        
        if (Array.isArray(feedback.summary)) {
            return <p className="text-sm sm:text-base text-gray-700">{feedback.summary.join(' ')}</p>
        }
        
        return <p className="text-sm sm:text-base text-gray-500 italic">No summary available</p>
    }

    const isRecommended = feedback?.recommended === 'Yes'

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="text-primary border-primary hover:text-primary/80 text-xs sm:text-sm"
                    size="sm"
                >
                    View Report
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Candidate Feedback Report</DialogTitle>
                    
                    <DialogDescription asChild>
                        <div className="mt-3 sm:mt-5 space-y-4 sm:space-y-6">
                            {/* Candidate Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                                        {candidate.userName?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-sm sm:text-base text-gray-800">{candidate?.userName || 'Anonymous Candidate'}</h2>
                                        <p className="text-xs sm:text-sm text-gray-500">{candidate?.userEmail}</p>
                                    </div>
                                </div>
                                
                                <div className="w-full sm:w-auto flex justify-between sm:block mt-2 sm:mt-0">
                                    <div className="bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-sm border">
                                        <span className="text-lg sm:text-xl font-bold text-primary">
                                            {averageScore}/10
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Assessment */}
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="font-semibold text-base sm:text-lg text-gray-800">Skills Assessment</h2>
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {[
                                        { label: 'Technical Skills', value: feedback?.rating?.technicalSkills || 0 },
                                        { label: 'Communication', value: feedback?.rating?.communication || 0 },
                                        { label: 'Problem Solving', value: feedback?.rating?.problemSolving || 0 },
                                        { label: 'Experience', value: feedback?.rating?.experience || 0 }
                                    ].map((skill, index) => (
                                        <div key={index} className="space-y-1 sm:space-y-2">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="font-medium text-gray-700">{skill.label}</span>
                                                <span className="font-semibold">{skill.value}/10</span>
                                            </div>
                                            <Progress 
                                                value={skill.value * 10} 
                                                className="h-1.5 sm:h-2"
                                                indicatorClassName={skill.value >= 7 ? 'bg-green-500' : skill.value >= 5 ? 'bg-yellow-500' : 'bg-red-500'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="space-y-2 sm:space-y-3">
                                <h2 className="font-semibold text-base sm:text-lg text-gray-800">Performance Summary</h2>
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    {renderSummary()}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className={`p-3 sm:p-4 rounded-lg border ${isRecommended ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                                    <div>
                                        <h3 className={`font-semibold text-sm sm:text-base ${isRecommended ? 'text-green-700' : 'text-red-700'}`}>
                                            {isRecommended ? 'Recommended for hire' : 'Not recommended'}
                                        </h3>
                                        <p className={`text-xs sm:text-sm ${isRecommended ? 'text-green-600' : 'text-red-600'}`}>
                                            {feedback?.recommendationNote || (isRecommended ? 'This candidate shows strong potential' : 'Some areas need improvement')}
                                        </p>
                                    </div>
                                    <Button 
                                        className={`gap-1 sm:gap-2 text-xs sm:text-sm ${isRecommended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        size="sm"
                                    >
                                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateFeedbackDialog