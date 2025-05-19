import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

function CallInterviewCard({ interview, viewDetail=false }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.job_id

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Interview link copied to clipboard!', {
      position: 'top-center'
    });
  }

  const onSend = () => {
    window.location.href = `mailto:?subject=AICruiter Interview Link&body=Please find your interview link below:%0D%0A%0D%0A${url}%0D%0A%0D%0ABest regards,%0D%0AThe Hiring Team`;
  }

  return (
    <div className='p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white font-medium'>
          {interview?.jobPosition?.charAt(0) || 'A'}
        </div>
        <span className='text-sm text-gray-500'>
          {moment(interview?.createdAt).format('DD MMM YYYY')}
        </span>
      </div>

      {/* Content */}
      <div className='mt-4'>
        <h2 className='font-bold text-lg text-gray-800 line-clamp-1'>
          {interview?.jobPosition || 'Interview Position'}
        </h2>
        <div className='flex justify-between items-center mt-3'>
          <span className='text-sm text-gray-600 flex items-center gap-1'>
            <Clock className='h-4 w-4 text-gray-500' />
            {interview?.duration || 'N/A'}
          </span>
          <span className='text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>
            {interview.feedback?.length || 0} Candidates
          </span>
        </div>
      </div>

      {/* Actions */}
      {!viewDetail ? (
        <div className='flex gap-3 w-full mt-6'>
          <Button 
            variant='outline' 
            onClick={copyLink}
            className='w-full h-11 border-gray-300 hover:bg-gray-50 flex gap-2'
          >
            <Copy className='h-4 w-4' />
            Copy Link
          </Button>
          <Button 
            onClick={onSend}
            className='w-full h-11 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white flex gap-2'
          >
            <Send className='h-4 w-4' />
            Send
          </Button>
        </div>
      ) : (
        <Link href={`/dashboard/scheduled-interview/${interview?.job_id}/details`} className='w-full mt-6 block'>
          <Button 
            variant='outline'
            className='w-full h-11 border-gray-300 hover:bg-gray-50 flex gap-2'
          >
            View Details
            <ArrowRight className='h-4 w-4' />
          </Button>
        </Link>
      )}
    </div>
  )
}

export default CallInterviewCard