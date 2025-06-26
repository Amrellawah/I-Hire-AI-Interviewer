"use client";
import { db } from '@/utils/db';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState, use } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function Feedback({ params }) {
  // Unwrap params Promise for Next.js 15 compatibility
  const resolvedParams = use(params);
  const interviewId = resolvedParams.interviewId;

  const [feedbackList, setFeedbackList] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [interviewData, setInterviewData] = useState({
    interviewType: '',
    jobPosition: '',
    careerLevel: '',
    jobExperience: ''
  });

  // Fetch interview metadata and answers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [interviewMeta, answers] = await Promise.all([
          db.select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId)),
          db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewId))
            .orderBy(UserAnswer.createdAt)
        ]);
        
        if (interviewMeta[0]) {
          setInterviewData({
            interviewType: interviewMeta[0].interviewType,
            jobPosition: interviewMeta[0].jobPosition,
            careerLevel: interviewMeta[0].careerLevel,
            jobExperience: interviewMeta[0].jobExperience
          });
        }
        
        setFeedbackList(answers);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to load interview data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [interviewId]);

  const handleAnswerChange = (questionId, value) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitAnswer = async (questionId, questionText, answer) => {
    if (!answer?.trim()) {
      toast.warning('Please provide an answer');
      return;
    }
  
    setLoadingStates(prev => ({ ...prev, [questionId]: true }));

    try {
      // Save answer to database
      await db.insert(UserAnswer)
        .values({
          id: questionId,
          mockIdRef: interviewId,
          question: questionText,
          userAns: answer,
          createdAt: new Date()
        })
        .onConflictDoUpdate({
          target: UserAnswer.id,
          set: {
            userAns: answer,
            updatedAt: new Date()
          }
        });

      // Clear the current answer from state
      setCurrentAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });

      // Refresh the question list
      const updatedAnswers = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.createdAt);
      
      setFeedbackList(updatedAnswers);
      toast.success('Answer saved successfully');
      
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error('Failed to save answer');
    } finally {
      setLoadingStates(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Calculate progress
  const answeredCount = feedbackList.filter(item => item.userAns).length;
  const totalCount = feedbackList.length;
  const progressPercentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className='p-10'>
      {feedbackList.length === 0 ? (
        <div className="text-center py-10">
          <h2 className='font-bold text-xl text-gray-500'>No interview questions found</h2>
          <Button onClick={() => router.replace('/')} className="mt-6">
            Go Home
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className='text-3xl font-bold text-green-600'>Interview Feedback</h2>
            <div className="flex justify-between items-center mt-4">
              <h2 className='text-primary text-lg'>Complete your interview responses</h2>
              <span className="text-sm font-medium">
                {answeredCount}/{totalCount} completed ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {feedbackList.map((item) => (
              <div key={item.id}>
                <Collapsible defaultOpen={!item.userAns}>
                  <CollapsibleTrigger className={`p-4 rounded-lg flex justify-between w-full text-left bg-secondary hover:bg-gray-100 transition-colors`}>
                    <div className="flex items-center">
                      <span className="font-medium">
                        {item.question}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-5 w-5 text-gray-500" />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 pl-2">
                    {item.userAns ? (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-700">Your Answer:</p>
                          <p className="mt-1 text-gray-900">{item.userAns}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your answer here..."
                          value={currentAnswers[item.id] || ""}
                          onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                          className="min-h-[120px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleAnswerChange(item.id, "")}
                          >
                            Clear
                          </Button>
                          <Button 
                            onClick={() => submitAnswer(item.id, item.question, currentAnswers[item.id])}
                            disabled={loadingStates[item.id] || !currentAnswers[item.id]?.trim()}
                            className="min-w-[120px]"
                          >
                            {loadingStates[item.id] ? (
                              <span className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Saving...
                              </span>
                            ) : 'Submit Answer'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between border-t pt-6">
            <Button 
              variant="outline" 
              onClick={() => router.replace('/')}
            >
              Save and Exit
            </Button>
            {answeredCount === totalCount && totalCount > 0 && (
              <Button 
                onClick={() => router.push(`/interview/${interviewId}/results`)}
                className="bg-green-600 hover:bg-green-700"
              >
                View Final Results
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;