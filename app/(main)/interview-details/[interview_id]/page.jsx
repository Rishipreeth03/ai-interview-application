'use client'
import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import InterviewDetailsHeader from "../_components/InterviewDetailsHeader"
import InterviewDetailsCard from "../_components/InterviewDetailsCard"
import InterviewQuestionsList from "../_components/InterviewQuestionsList"
import { useParams } from "next/navigation"
import { supabase } from "@/app/services/supaBaseclient"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Add animation styles for the background blobs
const styles = `
  @keyframes blob {
    0% {
      transform: scale(1) translate(0px, 0px);
    }
    33% {
      transform: scale(1.1) translate(30px, -50px);
    }
    66% {
      transform: scale(0.9) translate(-20px, 20px);
    }
    100% {
      transform: scale(1) translate(0px, 0px);
    }
  }
  .animate-blob {
    animation: blob 15s infinite alternate;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`

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
    
    // Set up real-time subscription to get updates immediately
    const channel = supabase
      .channel(`interview-${interviewId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'interviews', 
          filter: `interview_id=eq.${interviewId}` 
        },
        (payload) => {
          // Update our state when interview is modified
          if (payload.new) {
            setInterview(payload.new)
          }
        }
      )
      .subscribe()
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [interviewId])

  // Remove sharing functions for optimization

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4 lg:px-8">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-20 left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <InterviewDetailsHeader />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
              <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-blue-400 animate-spin absolute top-4 left-4"></div>
            </div>
            <p className="text-indigo-600 mt-6 font-medium animate-pulse">Loading interview details...</p>
          </div>
        ) : !interview ? (
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-red-100 p-10 my-10">
            <div className="text-red-500 bg-red-50 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Interview Not Found</h2>
            <p className="text-gray-600">The interview you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = '/all-interview'}>
              View All Interviews
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <InterviewDetailsCard 
              interview={interview} 
              onInterviewUpdated={fetchInterview}
            />
            
            <InterviewQuestionsList 
              interview={interview} 
              refreshInterview={fetchInterview}
              isDisabled={interview.status === 'Started' || interview.status === 'Ended'}
            />
          </div>
        )}
      </div>
    </main>
  )
}