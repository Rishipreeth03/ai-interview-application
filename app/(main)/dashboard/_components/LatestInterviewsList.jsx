"use client"
import { Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const LatestInterviewsList = () => {
    const router = useRouter()
    const [interviewList, setInterviewList] = useState([])
    return (
        <div className='my-5'>
            <h1 className='text-2xl font-bold'>Latest Interviews</h1>
            {interviewList?.length == 0 &&
                <div className='flex flex-col justify-center items-center mt-5 gap-2'>
                    <Video className='text-primary rounded-lg p-2 h-11 w-11' />
                    <h1>No Interviews Found</h1>
                    <Button className='bg-primary'
                        onClick={() => router.push('/dashboard/create-interview')}>+ Add Interview</Button>
                </div>
            }
        </div>
    )
}

export default LatestInterviewsList