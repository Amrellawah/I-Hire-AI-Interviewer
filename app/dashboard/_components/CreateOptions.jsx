"use client";
import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

function CreateOptions({ onChoose }) {
  const router = useRouter();
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Video Interview Card */}
      <div
        className='
          group relative
          bg-white border border-gray-200 rounded-xl p-6 
          flex flex-col gap-3 cursor-pointer
          hover:border-primary hover:shadow-lg transition-all
          overflow-hidden
        '
        onClick={() => onChoose ? onChoose('mock') : router.push('/dashboard/create-mock-interview')}
      >
        {/* Background highlight on hover */}
        <div className='
          absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 
          opacity-0 group-hover:opacity-100 transition-opacity
        '/>
        <div className='flex items-center gap-4'>
          <div className='
            p-3 text-primary bg-red-100 rounded-lg
            group-hover:bg-primary group-hover:text-white transition-colors
          '>
            <Video className='h-6 w-6'/>
          </div>
          <h2 className='font-bold text-lg text-gray-800 group-hover:text-primary transition-colors'>
            Video Interview
          </h2>
        </div>
        <p className='text-gray-500 text-sm mt-1 group-hover:text-gray-700 transition-colors'>
          Create AI-powered video interviews for in-depth candidate assessment.
        </p>
        <div className='
          mt-4 text-sm text-primary font-medium
          opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
          transition-all duration-300
        '>
          Get started →
        </div>
      </div>
      {/* Call Interview Card */}
      <div
        className='
          group relative
          bg-white border border-gray-200 rounded-xl p-6 
          flex flex-col gap-3 cursor-pointer
          hover:border-primary hover:shadow-lg transition-all
          overflow-hidden
        '
        onClick={() => onChoose ? onChoose('call') : router.push('/dashboard/create-interview')}
      >
        {/* Background highlight on hover */}
        <div className='
          absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 
          opacity-0 group-hover:opacity-100 transition-opacity
        '/>
        <div className='flex items-center gap-4'>
          <div className='
            p-3 text-primary bg-red-100 rounded-lg
            group-hover:bg-primary group-hover:text-white transition-colors
          '>
            <Phone className='h-6 w-6'/>
          </div>
          <h2 className='font-bold text-lg text-gray-800 group-hover:text-primary transition-colors'>
            Screening Call
          </h2>
        </div>
        <p className='text-gray-500 text-sm mt-1 group-hover:text-gray-700 transition-colors'>
          Schedule phone screening call with candidates. Perfect for initial assessments before formal interviews.
        </p>
        <div className='
          mt-4 text-sm text-primary font-medium
          opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
          transition-all duration-300
        '>
          Get started →
        </div>
      </div>
    </div>
  )
}

export default CreateOptions