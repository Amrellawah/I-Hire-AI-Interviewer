import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList()
    }
  }, [formData])

  const GenerateQuestionList = async() => {
    setLoading(true);
    try {
      const result = await axios.post('/api/GenerateQuestionForPhone', {
        ...formData
      })
      console.log(result.data.content);
      const Content = result.data.content;
      const FINAL_CONTENT = Content.replace('```json','').replace('```','')
      setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
      setLoading(false);
    } catch (e) {
      toast.error('Server Error, Please try again');
      setLoading(false);
    }
  }

  const onFinish = async () => {
    setSaveLoading(true);
    try {
      const response = await axios.post('/api/saveInterview', {
        formData,
        questionList,
        user: {
          fullName: user?.fullName,
          emailAddresses: user?.emailAddresses,
        },
      });

      const savedJobId = response.data.job_id;
      toast.success('Interview saved successfully!');
      onCreateLink(savedJobId); 
    } catch (e) {
      toast.error('Error saving interview');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && 
        <div className='p-5 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 flex gap-4 items-center shadow-sm'>
          <Loader2Icon className='animate-spin h-6 w-6 text-red-600'/>
          <div>
            <h2 className='font-medium text-gray-800'>Generating Interview Questions</h2>
            <p className='text-red-600 text-sm mt-1'>Our AI is crafting personalized questions based on your requirements</p>
          </div>
        </div>
      }

      {/* Questions List */}
      {questionList?.length > 0 &&
        <div className='space-y-4'>
          <QuestionListContainer questionList={questionList}/>
        </div>
      }

      {/* Action Button */}
      <div className='flex justify-end mt-8'>
        <Button 
          onClick={onFinish} 
          disabled={saveLoading || loading}
          className="h-12 px-6 text-base font-medium bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saveLoading ? (
            <>
              <Loader2 className='animate-spin h-5 w-5 mr-2'/>
              Processing...
            </>
          ) : (
            'Create Interview Link & Finish'
          )}
        </Button>
      </div>
    </div>
  )
}

export default QuestionList