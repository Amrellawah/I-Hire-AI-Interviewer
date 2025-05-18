"use client"
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';

function CreateInterview() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [jobId,setJobId] = useState();

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        console.log("FormData", formData)
    }

    const onGoToNext=()=>{
        if(!formData?.jobPosition||!formData?.jobDescription||!formData?.duration||!formData?.type)
        {
            toast('Please enter all details!')
            return;
        }
        setStep(step+1);
    }

    const onCreateLink=(job_id)=>{
        setJobId(job_id);
        setStep(step+1);
    }

    return (
        <div className='mt-5 px-10 md:px-24 lg:px-44 xl:px-56'>
            <div className='flex gap-5 items-center'>
                <ArrowLeft onClick={() => router.back()} className='cursor-pointer hover:text-black transition' />
                <h2 className='font-bold text-2xl'>Create New Interview</h2>
            </div>
            <Progress value={step * 33.33} className='my-5' />
            {step == 1 ?<FormContainer 
            onHandleInputChange={onHandleInputChange}
            GoToNext={() => onGoToNext()} />
            :step == 2 ? <QuestionList formData={formData} onCreateLink={(job_id)=>onCreateLink(job_id)} /> 
            :step == 3 ? <InterviewLink job_id={jobId}
            formData={formData}
            /> : null}
        </div>
    );
}

export default CreateInterview;
