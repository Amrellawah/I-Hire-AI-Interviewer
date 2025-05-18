import { Calendar, Clock, MessageCircleQuestionIcon } from 'lucide-react'
import moment from 'moment'
import React from 'react'


function InterviewDetailContainer({ interviewDetail }) {
  return (
    <div className='p-5 bg-white rounded-lg mt-5'>
        <h2>{interviewDetail?.jobPosition}</h2>

        <div className='mt-4 flex items-center justify-between lg:pr-52'>
            <div>
                <h2 className='text-sm text-gray-500'>Duration</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4'/> {interviewDetail?.duration}</h2>
            </div>
            <div>
                <h2 className='text-sm text-gray-500'>Created On</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' /> { moment(interviewDetail?.createdAt).format('MMM DD, yyyy')}</h2>
            </div>
            <div>
                <h2 className='text-sm text-gray-500'>Type</h2>
                <h2 className='flex text-sm font-bold items-center gap-2'>
                <Clock className='h-4 w-4'/>
                {typeof interviewDetail?.type === 'string' 
                ? interviewDetail.type.replace(/[{"}]/g, '') 
                : interviewDetail?.type || 'Not specified'}
                </h2>
            </div>
        </div>

        <div className='mt-5'>
            <h2 className='font-bold'>Job Description</h2>
            <p className='text-sm leading-6'>{interviewDetail?.jobDescription}</p>
        </div>

        <div className='mt-8'>
        <h2 className='font-bold text-lg mb-4 text-gray-800'>Interview Questions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {interviewDetail?.questionList?.map((item, index) => (
            <div 
                key={index}
                className='p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors shadow-sm hover:shadow-md'
            >
                <div className='flex items-start gap-3'>
                <div className='bg-primary/10 p-2 rounded-full'>
                    <MessageCircleQuestionIcon className='h-5 w-5 text-primary' />
                </div>
                <div>
                    <span className='font-medium text-gray-700'>Question {index + 1}</span>
                    <p className='mt-1 text-sm text-gray-600'>{item?.question || 'No question text'}</p>
                    {item?.details && (
                    <p className='mt-2 text-xs text-gray-500'>{item.details}</p>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>

    </div>
  )
}

export default InterviewDetailContainer