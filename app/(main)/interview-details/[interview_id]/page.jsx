'use client'
import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import InterviewDetailsHeader from "../_components/InterviewDetailsHeader"
import InterviewDetailsCard from "../_components/InterviewDetailsCard"
import InterviewQuestionsList from "../_components/InterviewQuestionsList"
import { useParams } from "next/navigation"
import { supabase } from "@/app/services/supaBaseclient"
import { toast } from "sonner"

export default function InterviewDetailsPage() {
  const params = useParams()
  const interviewId = params.interview_id
  
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchInterview = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId)
        .single()
        
      if (error) {
        throw error
      }
      
      setInterview(data || null)
    } catch (error) {
      console.error("Error fetching interview:", error)
      toast.error("Could not load interview details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!interviewId) return
    fetchInterview()
  }, [interviewId])

  // Remove sharing functions for optimization

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <InterviewDetailsHeader />
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
        </div>
      ) : !interview ? (
        <div className="text-center text-gray-500 py-10">Interview not found.</div>
      ) : (
        <>
          <InterviewDetailsCard interview={interview} />
          
          <InterviewQuestionsList 
            interview={interview} 
            refreshInterview={fetchInterview}
            isDisabled={interview.status === 'Started' || interview.status === 'Ended'}
          />
        </>
      )}
    </main>
  )
}