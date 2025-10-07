'use client'
import React, { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function InterviewDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("id")
  
  useEffect(() => {
    // If we have an id in the query params, redirect to the new dynamic route
    if (interviewId) {
      router.replace(`/interview-details/${interviewId}`)
    } else {
      // If no id, redirect to the interviews list
      router.replace('/all-interview')
    }
  }, [interviewId, router])

  // Return a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-500">Redirecting...</div>
    </div>
  )
}
