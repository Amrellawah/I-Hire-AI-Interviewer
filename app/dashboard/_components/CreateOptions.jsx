import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AddNewInterview from './AddNewInterview'

function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5'>
        <AddNewInterview/>
        <Link href={'/dashboard/create-interview'} className='bg-white border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer'>
            <Phone className='p-3 text-primary bg-red-100 rounded-lg h-12 w-12'/>
            <h2 className='font-bold'>
               Screening Call</h2>
            <p className='text-gray-500'>Schedule phone screening call with Candidates</p>
        </Link>
    </div>
  )
}

export default CreateOptions