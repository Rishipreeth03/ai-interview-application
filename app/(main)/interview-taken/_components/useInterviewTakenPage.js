import { useEffect, useState } from "react"
import { supabase } from "@/app/services/supaBaseclient"

function useInterviewTakenPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [showReport, setShowReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data } = await supabase.auth.getUser()
      setUserEmail(data?.user?.email || "")
    }
    fetchUserEmail()
  }, [])

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!userEmail) return
      setLoading(true)
      const { data, error } = await supabase
        .from("interview-feedback")
        .select("interview_id, userName, userEmail, created_at, recommended, completed, feedback, conversation")
        .eq("userEmail", userEmail)
        .order("created_at", { ascending: false })
      if (!error && data?.length) {
        const interviewIds = data.map(i => i.interview_id)
        const { data: interviewDetails } = await supabase
          .from("interviews")
          .select("interview_id, jobPosition")
          .in("interview_id", interviewIds)
        const interviewMap = {}
        interviewDetails?.forEach(i => {
          interviewMap[i.interview_id] = i.jobPosition
        })
        setInterviews(
          data.map(i => ({
            ...i,
            jobPosition: interviewMap[i.interview_id] || "Unknown"
          }))
        )
      } else {
        setInterviews(data || [])
      }
      setLoading(false)
    }
    fetchInterviews()
  }, [userEmail])

  const handleShowReport = (report) => {
    setSelectedReport(report)
    setShowReport(true)
  }

  const handleCloseReport = () => {
    setShowReport(false)
    setSelectedReport(null)
  }

  return {
    interviews,
    loading,
    showReport,
    selectedReport,
    handleShowReport,
    handleCloseReport,
  }
}

export default useInterviewTakenPage
