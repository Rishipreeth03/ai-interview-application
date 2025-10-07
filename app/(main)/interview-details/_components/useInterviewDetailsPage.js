import { useEffect, useState } from "react"
import { supabase } from "@/app/services/supaBaseclient"
import { useSearchParams } from "next/navigation"

function useInterviewDetailsPage() {
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("id")
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!interviewId) return
    const fetchInterview = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId)
        .single()
      setInterview(data || null)
      setLoading(false)
    }
    fetchInterview()
  }, [interviewId])

  return {
    interview,
    loading
  }
}

export default useInterviewDetailsPage
