import { useState, useEffect } from 'react'
import { supabase } from '@/app/services/supaBaseclient'
import { toast } from 'sonner'
import InterviewInfo from './InterviewInfo'

function useInterviewPage(interview_id, setInterviewInfo, router) {
  const [interviewData, setInterviewData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!interview_id) return
    GetInterviewDetails()
  }, [interview_id])

  const onJoinInterview = async () => {
    setLoading(true)
    let { data: interviews, error } = await supabase
      .from('"interviews"')
      .select('*')
      .eq('interview_id', interview_id)

    setInterviewInfo({
      userName: userName,
      userEmail: userEmail,
      interviewData: interviews[0],
    })
    router.push(`/interview/${interview_id}/setup`)
    setLoading(false)
  }

  const GetInterviewDetails = async () => {
    setLoading(true)
    try {
      let { data: interviews, error } = await supabase
        .from('"interviews"')
        .select("jobPosition,jobDescription,duration,type")
        .eq('interview_id', interview_id)
      setInterviewData(interviews[0])
      if (interviews.length === 0) {
        toast('No interview found')
        return
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast('Error fetching interview details')
    }
  }

  return {
    interviewData,
    loading,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    onJoinInterview,
  }
}

export default useInterviewPage
