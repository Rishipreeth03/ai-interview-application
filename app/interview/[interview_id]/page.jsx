'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/app/services/supaBaseclient'
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

  // Move all data fetching and user checks inside useEffect (client-only)
  useEffect(() => {
    if (!interview_id) return;
    GetInterviewDetails();
  }, [interview_id]);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const fetchAuthEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user?.email) {
        router.back();
        return;
      }
      setUserEmail(data.user.email);
    };
    fetchAuthEmail();
  }, []);

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
    router.push(`/interview/${interview_id}/setup`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-100 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-lg p-8 md:p-12 lg:p-16 space-y-6 transition-all duration-300">
        <Image src={'/logo.png'} alt='logo' width={200} height={100}
          className="w-[140px] mb-2 drop-shadow-lg" />
        <h2 className="mt-2 text-lg font-semibold text-indigo-700 tracking-wide">AI-Powered Interview Platform</h2>

        <Image src={'/interview.png'} alt='interview'
          width={500}
          height={500}
          className="w-[220px] md:w-[280px] my-6 rounded-2xl shadow-lg border border-indigo-100" />

        <h2 className="font-extrabold text-2xl text-gray-900 mb-1">{interviewData?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-indigo-500 mt-2 font-medium">
          <Clock className="h-5 w-5" />
          <span>{interviewData?.duration}</span>
        </h2>

        <div className="w-full mb-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Enter your Full Name</h2>
          <Input
            placeholder="e.g. Rishipreeth"
            onChange={e => setUserName(e.target.value)}
            className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        <div className="w-full mb-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Your Email</h2>
          <Input
            value={userEmail}
            disabled
            className="rounded-xl border-gray-200 bg-gray-50 text-gray-500"
          />
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mt-4 flex gap-3 items-start shadow-sm border border-blue-100">
          <Info className="text-blue-500 mt-1" />
          <div>
            <h2 className="font-bold text-gray-800 mb-1">Before you begin</h2>
            <ul className="list-disc ml-4 space-y-1">
              <li className="text-sm text-gray-600">Test your camera and microphone</li>
              <li className="text-sm text-gray-600">You can skip questions if you don't know the answer</li>
              <li className="text-sm text-gray-600">Ensure you have stable internet connection</li>
            </ul>
          </div>
        </div>
        <Button
          disabled={loading || !userName}
          onClick={onJoinInterview}
          className="mt-6 w-full font-bold py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Video className="mr-2" />
          {loading && <Loader2Icon className="animate-spin mr-2" />}
          Start Interview
        </Button>
      </div>
    </div>
  )
}

export default Interview
