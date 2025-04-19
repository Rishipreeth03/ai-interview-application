"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function CreateInterview() {
    const router = useRouter()
    return (
        <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
            <div className='flex items-center gap-5 '>
                <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
                <h2 className='text-2xl font-bold'>Create New Interview</h2>
            </div>
            <div>
                <h3 className='mt-4 text-xl font-bold'>Interview Name</h3>
                <input type="text" className='border bg-white border-black rounded-lg p-2 w-full mt-2' placeholder='Enter Interview Name' />
                <h3 className='mt-4 text-xl font-bold'>Interview Description</h3>
                <textarea className='h-32 border bg-white border-black rounded-lg p-2 w-full mt-2' placeholder='Description' />
            </div>
        </div>
    )
}

export default CreateInterview