import { useEffect, useState } from "react"
import { supabase } from "@/app/services/supaBaseclient"
import { toast } from "sonner"
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

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/interview/${interviewId}`
    : ""

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!', {
      description: 'You can now share the interview link.',
      duration: 2000,
    })
  }

  const sendGmail = () => {
    const subject = encodeURIComponent('Smart Persona Interview Link')
    const body = encodeURIComponent(
      `Hi,\n\nHere is your interview link:\n${url}\n\nBest regards.`
    )
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`,
      '_blank'
    )
  }

  const sendWhatsApp = () => {
    const text = encodeURIComponent(`Smart Persona Interview Link:\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return {
    interview,
    loading,
    url,
    copyLink,
    sendGmail,
    sendWhatsApp,
  }
}

export default useInterviewDetailsPage
