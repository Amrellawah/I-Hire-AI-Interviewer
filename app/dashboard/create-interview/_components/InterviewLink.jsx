import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, CircleCheckBig, Clock, Copy, List, Mail, Phone, Plus, Slack } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

function InterviewLink({ job_id, formData }) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + job_id

    const GetInterviewUrl = () => {
        return url;
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!', {
            position: 'top-center',
            duration: 2000
        })
    }

    return (
        <div className='max-w-2xl mx-auto flex flex-col items-center justify-center mt-10 px-4 sm:px-6 lg:px-8'>
            {/* Success Header */}
            <div className='text-center mb-8'>
                <CircleCheckBig className='h-16 w-16 text-green-500 mx-auto animate-bounce' strokeWidth={1.5} />
                <h2 className='font-bold text-2xl mt-4 text-gray-800'>Your AI Interview is Ready!</h2>
                <p className='mt-3 text-gray-600 max-w-md'>Share this link with your candidate to begin the interview process</p>
            </div>
        
            {/* Link Card */}
            <div className='w-full p-6 mt-2 rounded-xl bg-white border border-gray-200 shadow-sm'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold text-lg text-gray-800'>Interview Link</h2>
                    <span className='px-3 py-1 text-sm font-medium bg-red-50 text-red-600 rounded-full'>
                        Valid for 30 Days
                    </span>
                </div>

                <div className='mt-4 flex gap-3 items-center'>
                    <Input 
                        defaultValue={GetInterviewUrl()} 
                        disabled={true}
                        className='flex-1 h-12 text-base border-gray-300 focus:ring-2 focus:ring-primary/50'
                    />
                    <Button 
                        onClick={onCopyLink}
                        className='h-12 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                    >
                        <Copy className='h-5 w-5 mr-2' />
                        Copy Link
                    </Button>
                </div>

                <hr className='my-6 border-gray-100' />

                <div className='flex gap-5'>
                    <span className='text-sm text-gray-600 flex gap-2 items-center'>
                        <Clock className='h-4 w-4 text-gray-500' /> 
                        {formData?.duration}
                    </span>
                    <span className='text-sm text-gray-600 flex gap-2 items-center'>
                        <List className='h-4 w-4 text-gray-500' /> 
                        10 Questions
                    </span>
                </div>
            </div>

            {/* Share Options */}
            <div className='mt-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full'>
                <h2 className='font-bold text-lg text-gray-800 mb-4'>Share Via</h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <Button variant={'outline'} className='h-12 gap-2 hover:bg-gray-50'>
                        <Mail className='h-5 w-5 text-gray-600' /> 
                        Email
                    </Button>
                    <Button variant={'outline'} className='h-12 gap-2 hover:bg-gray-50'>
                        <Slack className='h-5 w-5 text-gray-600' /> 
                        Slack
                    </Button>
                    <Button variant={'outline'} className='h-12 gap-2 hover:bg-gray-50'>
                        <Phone className='h-5 w-5 text-gray-600' /> 
                        WhatsApp
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row w-full gap-4 justify-between mt-8'>
                <Link href={'/dashboard'} className='w-full sm:w-auto'>
                    <Button 
                        variant={'outline'} 
                        className='w-full h-12 gap-2 border-gray-300 hover:bg-gray-50'
                    >
                        <ArrowLeft className='h-5 w-5' /> 
                        Back to Dashboard
                    </Button>
                </Link>
                
                <Link href={'/create-interview'} className='w-full sm:w-auto'>
                    <Button className='w-full h-12 gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'>
                        <Plus className='h-5 w-5' /> 
                        Create New Job
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink