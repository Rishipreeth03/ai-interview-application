"use client"
import { Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/services/supaBaseclient'
import { useUser } from '@/app/provider'
import { toast } from 'sonner'
import InterviewCard from '../dashboard/_components/InterviewCard'

function AllInterviews() {
    const router = useRouter();
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        let { data: Interviews, error } = await supabase
            .from("interviews")
            .select('*')
            .eq("userEmail", user?.email)
            .order('created_at', { ascending: false });

        console.log(Interviews);
        setInterviewList(Interviews);
    }

    return (
        <div className='my-5'>
            <h1 className='text-2xl font-bold'>All Interviews</h1>
            {interviewList?.length == 0 &&
                <div className='flex flex-col justify-center items-center mt-5 gap-2'>
                    <Video className='text-primary rounded-lg p-2 h-11 w-11' />
                    <h1>No Interviews Found</h1>
                    <Button className='bg-primary'
                        onClick={() => router.push('/dashboard/create-interview')}>+ Add Interview</Button>
                </div>
            }
            {interviewList &&
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
                    {interviewList.map((interview, index) => (
                        <InterviewCard interview={interview} key={index} />
                    ))}
                </div>
            }
        </div>
    )
}

export default AllInterviews