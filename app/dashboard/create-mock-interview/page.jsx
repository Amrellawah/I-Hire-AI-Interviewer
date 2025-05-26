"use client";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import AddNewInterview from '../_components/AddNewInterview';

export default function CreateMockInterview() {
  const router = useRouter();
  return (
    <div className='mt-8 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-36 2xl:px-48'>
      <div className='flex gap-4 items-center mb-6'>
        <button
          onClick={() => router.back()}
          className='p-2 rounded-full hover:bg-gray-100 transition-colors'
          aria-label="Go back"
        >
          <ArrowLeft className='h-5 w-5 text-gray-600' />
        </button>
        <div>
          <h2 className='font-bold text-2xl sm:text-3xl text-gray-800'>Create New Video Interview</h2>
          <p className='text-sm text-gray-500 mt-1'>Enter details to generate a video interview</p>
        </div>
      </div>
      <AddNewInterview open={true} setOpen={() => {}} />
    </div>
  );
} 