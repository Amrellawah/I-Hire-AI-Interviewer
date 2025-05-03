import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {

    const router=useRouter();

    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }

    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+"/feedback")
    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold' style={{ color: '#A31D1D' }}>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-400'>Created At: {interview.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Button size="sm" variant="outline" 
            onClick={onFeedbackPress}
            >Feedback</Button>
            <Button size="sm" className="w-full"
            onClick={onStart}
            style={{ backgroundColor: '#A31D1D', color: '#FFFFFF' }}
            >Start</Button>

        </div>

    </div>
  )
}

export default InterviewItemCard