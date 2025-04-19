import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateOptions = () => {
    return (
        <div className='grid grid-cols-2 gap-7'>
            <Link href="/dashboard/create-interview" className='bg-white border border-gray-200 shadow-md rounded-lg p-6 flex items-center justify-center gap-3'>
                <Video className='text-primary bg-blue-50 rounded-lg p-2 h-11 w-11' />
                <div>
                    <h2 className='font-bold'>Create New Interview</h2>
                    <p>Create And Schedule AI Interviews For Recruiting Candidates</p>
                </div>
            </Link>
            <div className='bg-white border border-gray-200 shadow-md rounded-lg p-6 flex items-center justify-center gap-3'>
                <Phone className='text-primary bg-blue-50 rounded-lg p-2 h-11 w-11' />
                <div>
                    <h2 className='font-bold'>Create Phone Screening Call</h2>
                    <p>Schedule Phone Screening Call With Candidates</p>
                </div>
            </div>
        </div>
    )
}

export default CreateOptions