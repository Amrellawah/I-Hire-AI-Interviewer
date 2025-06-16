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
    <div className="bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-5 hover:shadow-2xl transition-all duration-200 flex flex-col gap-2">
      <h2 className="font-bold text-lg text-[#be3144] mb-1">{interview?.jobPosition}</h2>
      <div className="text-sm text-[#8e575f] mb-1">{interview?.jobExperience} Years of Experience</div>
      <div className="text-xs text-[#8e575f] mb-2">Created At: {interview.createdAt}</div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" className="border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea]" onClick={onFeedbackPress}>Feedback</Button>
        <Button size="sm" className="bg-gradient-to-r from-[#be3144] to-[#f05941] text-white hover:from-[#f05941] hover:to-[#ff7b54] w-full" onClick={onStart}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard