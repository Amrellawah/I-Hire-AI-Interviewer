import { Calendar, Clock, MessageCircleQuestion, ClipboardList } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function InterviewDetailContainer({ interviewDetail }) {
  return (
    <div className='p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6'>
      {/* Header Section */}
      <div className='pb-4 border-b border-gray-100'>
        <h2 className='text-2xl font-bold text-gray-800'>{interviewDetail?.jobPosition}</h2>
        
        <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-50 rounded-lg'>
              <Clock className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Duration</p>
              <p className='font-medium text-gray-800'>{interviewDetail?.duration}</p>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-50 rounded-lg'>
              <Calendar className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Created On</p>
              <p className='font-medium text-gray-800'>
                {moment(interviewDetail?.createdAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-50 rounded-lg'>
              <ClipboardList className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Type</p>
              <p className='font-medium text-gray-800'>
                {typeof interviewDetail?.type === 'string' 
                  ? interviewDetail.type.replace(/[{"}]/g, '') 
                  : interviewDetail?.type || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Job Description</h2>
        <div className='p-4 bg-gray-50 rounded-lg'>
          <p className='text-gray-700 leading-relaxed'>
            {interviewDetail?.jobDescription || 'No job description provided'}
          </p>
        </div>
      </div>

      {/* Interview Questions */}
      <div className='mt-8'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Interview Questions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {interviewDetail?.questionList?.map((item, index) => (
            <div 
              key={index}
              className='p-5 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-colors duration-200 shadow-sm hover:shadow-md'
            >
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 bg-red-50 p-2 rounded-lg'>
                  <MessageCircleQuestion className='h-5 w-5 text-red-600' />
                </div>
                <div>
                  <span className='font-medium text-gray-800'>Question {index + 1}</span>
                  <p className='mt-2 text-gray-700'>{item?.question || 'No question text'}</p>
                  {item?.details && (
                    <div className='mt-3 p-3 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-600'>{item.details}</p>
                    </div>
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