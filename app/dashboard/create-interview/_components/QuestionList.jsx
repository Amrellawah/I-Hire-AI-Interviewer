import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';

function QuestionList({ formData, onCreateLink }) {

  const [loading,setLoading]=useState(true);
  const [questionList,setQuestionList]=useState();
  const {user}=useUser();
  const [saveLoading,setSaveLoading]=useState(false);

  useEffect(() => {
    if (formData) {
        GenerateQuestionList()
    }
  }, [formData])

  const GenerateQuestionList = async() => {
    setLoading(true);
    try{
        const result=await axios.post('/api/GenerateQuestionForPhone',{
          ...formData
        })
        console.log(result.data.content);
        const Content=result.data.content;
        const FINAL_CONTENT=Content.replace('```json','').replace('```','')
        setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
        setLoading(false);
    }
    catch(e)
    {
      toast('Server Error, Try again')
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
    toast.success('Interview saved');
    onCreateLink(savedJobId); 
  } catch (e) {
    toast.error('Error saving interview');
  } finally {
    setSaveLoading(false);
  }
};


  return (
    <div>
        {loading&& 
        <div className='p-5 bg-red-100 rounded-2xl border border-primary flex gap-5 items-center'>
            <Loader2Icon className='animate-spin'/>
            <div>
              <h2 className='font-medium'>Generating Interview Questions</h2>
              <p className='text-primary'>Our AI is crafting personalized questions based on your job position</p>
            </div>
        </div>
        }
        {questionList?.length>0&&
          <div>
            <QuestionListContainer questionList={questionList}/>
          </div>
        }
        <div className='flex justify-end mt-10'>
          <Button onClick={() => onFinish()} disabled={saveLoading}>
            {saveLoading&&<Loader2 className='animate-spin'/>}
            Create Interview Link & Finish</Button>
        </div>
    </div>
  )
}

export default QuestionList