'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/app/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useRouter } from 'next/navigation'

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id])

  const onJoinInterview = async () => {
    setLoading(true);
    let { data: interviews, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('interview_id', interview_id)

    setInterviewInfo({
      userName: userName,
      userEmail: userEmail,
      interviewData: interviews[0],
    });
    router.push(`/interview/${interview_id}/start`);
    setLoading(false);
  }

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from('interviews')
        .select("jobPosition,jobDescription,duration,type")
        .eq('interview_id', interview_id)
      setInterviewData(interviews[0]);
      if (interviews.length === 0) {
        toast('No interview found');
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast('Error fetching interview details');
    }
  }

  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-80 mt-7'>
      <div className='flex flex-col items-center justify-center border rounded-xl bg-white
      p-7 lg:px-33 xl:px-52 mb-20'>
        <Image src={'/logo.png'} alt='logo' width={200} height={100}
          className='w-[140px]' />
        <h2 className='mt-3'>AI-Powered Interview Platform</h2>

        <Image src={'/interview.png'} alt='interview'
          width={500}
          height={500}
          className='w-[280px] my-6' />

        <h2 className='font-bold text-xl'>{interviewData?.jobPosition}</h2>
        <h2 className='flex gap-2 items-center text-gray-500 mt-3'><Clock className='h-4 w-4' />{interviewData?.duration}</h2>

        <div className='w-full'>
          <h2>Enter your Full Name</h2>
          <Input placeholder='e.g. Rishipreeth' onChange={(e) => setUserName(e.target.value)} />
        </div>

        <div className='w-full'>
          <h2>Enter your Email</h2>
          <Input placeholder='e.g. rishi@gmail.com' onChange={(e) => setUserEmail(e.target.value)} />
        </div>

        <div className='p-3 bg-blue-100 rounded-lg mt-5 flex gap-2 items-start'>
          <Info className='text-primary' />
          <div>
            <h2 className='font-bold'>Before you begin</h2>
            <ul>
              <li className='text-sm text-gray-500'>- Test your camera and microphone</li>
              <li className='text-sm text-gray-500'>- You can skip questions if you don't know the answer</li>
              <li className='text-sm text-gray-500'>- Ensure you have stable internet connection</li>
            </ul>
          </div>
        </div>
        <Button disabled={loading || !userName}
          onClick={() => onJoinInterview()}
          className={'mt-5 w-full font-bold'}>
          <Video /> {loading && <Loader2Icon />}
          Start Interview
        </Button>
      </div>
    </div>
  )
}

export default Interview
