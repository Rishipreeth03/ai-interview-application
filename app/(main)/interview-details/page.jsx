'use client'
import React from "react"
import InterviewDetailsHeader from "./_components/InterviewDetailsHeader"
import InterviewDetailsCard from "./_components/InterviewDetailsCard"
import useInterviewDetailsPage from "./_components/useInterviewDetailsPage"

export default function InterviewDetailsPage() {
  const {
    interview,
    loading,
    url,
    copyLink,
    sendGmail,
    sendWhatsApp,
  } = useInterviewDetailsPage()

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
        <InterviewDetailsCard
          interview={interview}
          url={url}
          copyLink={copyLink}
          sendGmail={sendGmail}
          sendWhatsApp={sendWhatsApp}
        />
      )}
    </main>
  )
}
