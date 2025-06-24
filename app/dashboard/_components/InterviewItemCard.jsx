import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

function InterviewItemCard({interview, viewDetail=false}) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/job-seeker/job/mock/' + interview?.mockId

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
        <div className='bg-white rounded-2xl shadow-xl border-l-4 border-gradient-to-b from-[#be3144] to-[#f05941] p-5 hover:shadow-2xl transition-all duration-200 flex flex-col gap-2'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941] flex items-center justify-center text-white font-bold text-lg'>
                    {interview?.jobPosition?.charAt(0) || 'A'}
                </div>
                <span className='text-xs text-[#8e575f]'>
                    {moment(interview?.createdAt).format('DD MMM YYYY')}
                </span>
            </div>
            {/* Content */}
            <div className='mt-2'>
                <h2 className='font-bold text-lg text-[#be3144] mb-1 line-clamp-1'>
                    {interview?.jobPosition || 'Interview Position'}
                </h2>
                <div className='flex justify-between items-center mt-1'>
                    <span className='text-xs text-[#8e575f] flex items-center gap-1'>
                        <Clock className='h-4 w-4 text-[#be3144]' />
                        {interview?.jobExperience || 'N/A'} Years Exp
                    </span>
                    <div className='flex flex-col gap-1'>
                        <span className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full'>
                            Video Interview
                        </span>
                        <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                            {interview?.candidateCount || 0} Candidates
                        </span>
                    </div>
                </div>
            </div>
            {/* Actions */}
            {!viewDetail ? (
                <div className='flex flex-col sm:flex-row gap-2 w-full mt-3'>
                    <Button 
                        variant='outline' 
                        onClick={copyLink}
                        className='w-full border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea] flex gap-2 text-sm'
                    >
                        <Copy className='h-4 w-4' />
                        Copy Link
                    </Button>
                    <Button 
                        onClick={onSend}
                        className='w-full bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] text-white flex gap-2 text-sm'
                    >
                        <Send className='h-4 w-4' />
                        Send
                    </Button>
                </div>
            ) : (
                <Link href={`/dashboard/video-interview/${interview?.mockId}/details`} className='w-full mt-3 block'>
                    <Button 
                        variant='outline'
                        className='w-full border-[#be3144] text-[#be3144] hover:bg-[#f1e9ea] flex gap-2 text-sm'
                    >
                        View Details
                        <ArrowRight className='h-4 w-4' />
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default InterviewItemCard