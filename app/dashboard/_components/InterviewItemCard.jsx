import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Copy, Send, Calendar, Users, Video } from 'lucide-react'
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
        <div className='group bg-white rounded-2xl shadow-lg border border-[#E4D3D5] p-6 hover:shadow-2xl hover:border-[#166534]/20 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden'>
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#166534]/5 to-[#16A34A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Header */}
            <div className='flex items-center justify-between relative z-10'>
                <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#166534] to-[#16A34A] flex items-center justify-center text-white font-bold text-lg shadow-lg'>
                    {interview?.jobPosition?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className='flex flex-col items-end gap-1'>
                    <span className='text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full'>
                        {moment(interview?.createdAt).format('DD MMM YYYY')}
                    </span>
                    <span className='text-xs font-medium text-[#166534] bg-[#F0FDF4] px-2 py-1 rounded-full flex items-center gap-1'>
                        <Video className='h-3 w-3' />
                        Video Interview
                    </span>
                </div>
            </div>
            
            {/* Content */}
            <div className='relative z-10 flex-1'>
                <h2 className='font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-[#166534] transition-colors duration-200'>
                    {interview?.jobPosition || 'Interview Position'}
                </h2>
                
                <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-[#166534]' />
                            Experience: {interview?.jobExperience || 'N/A'} Years
                        </span>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 flex items-center gap-2'>
                            <Users className='h-4 w-4 text-[#166534]' />
                            Candidates: {interview?.candidateCount || 0}
                        </span>
                        <span className='text-sm text-gray-600 flex items-center gap-2'>
                            <Calendar className='h-4 w-4 text-[#166534]' />
                            {moment(interview?.createdAt).format('MMM DD')}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Actions */}
            {!viewDetail ? (
                <div className='flex flex-col sm:flex-row gap-3 w-full relative z-10'>
                    <Button 
                        variant='outline' 
                        onClick={copyLink}
                        className='flex-1 border-[#166534] text-[#166534] hover:bg-[#166534] hover:text-white transition-all duration-200 flex gap-2 text-sm font-medium'
                    >
                        <Copy className='h-4 w-4' />
                        Copy Link
                    </Button>
                    <Button 
                        onClick={onSend}
                        className='flex-1 bg-gradient-to-r from-[#166534] to-[#16A34A] hover:from-[#16A34A] hover:to-[#22C55E] text-white flex gap-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                    >
                        <Send className='h-4 w-4' />
                        Send
                    </Button>
                </div>
            ) : (
                <Link href={`/dashboard/video-interview/${interview?.mockId}/details`} className='w-full relative z-10 block'>
                    <Button 
                        variant='outline'
                        className='w-full border-[#166534] text-[#166534] hover:bg-[#166534] hover:text-white transition-all duration-200 flex gap-2 text-sm font-medium group-hover:shadow-lg'
                    >
                        View Details
                        <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default InterviewItemCard