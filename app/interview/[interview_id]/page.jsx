'use client'
import React, { useContext, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import AllInterviewsHeader from './_components/InterviewHeader'
import InterviewDetails from './_components/InterviewDetails'
import InterviewForm from './_components/InterviewForm'
import InterviewInfo from './_components/InterviewInfo'
import useInterviewPage from './_components/useInterviewPage'
import { supabase } from '@/app/services/supaBaseclient'
import { Button } from '@/components/ui/button'

function Interview() {
  const { interview_id } = useParams()
  // If no interview_id param, show Not Found
  if (!interview_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 rounded-xl shadow-lg border border-gray-200 bg-gray-50 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Page Not Found</h2>
          <p className="mb-6 text-gray-700">No interview ID was provided. Please check your link or return to the home page.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-red-500 hover:bg-red-600 text-white">Return Home</Button>
        </div>
      </div>
    )
  }
  const router = useRouter()
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)
  
  // Debug interview_id
  React.useEffect(() => {
    console.log('Interview page loaded with ID:', interview_id);
  }, [interview_id]);
  
  const {
    interviewData,
    loading,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    hasUrlParams,
    onJoinInterview,
  } = useInterviewPage(interview_id, setInterviewInfo, router)

  
  // Debug context values
  React.useEffect(() => {
    console.log('InterviewDataContext values:', { interviewInfo });
  }, [interviewInfo])

  return (
    <div
      className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 py-8"
    >
      <div
        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center border border-indigo-100/50 rounded-3xl bg-white/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl p-8 md:p-12 lg:p-16 space-y-8 transition-all duration-300"
      >
        <AllInterviewsHeader />
        <InterviewDetails interviewData={interviewData} />
          {loading ? (
            <div
              className="flex flex-col items-center justify-center py-10"
            >
              <div
                className="mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
                <svg width="60" height="60" viewBox="0 0 60 60" className="relative z-10">
                  <circle cx="30" cy="30" r="24" stroke="url(#gradient)" strokeWidth="6" fill="none" opacity="0.15" />
                  <circle cx="30" cy="30" r="24" stroke="url(#gradient)" strokeWidth="6" fill="none" strokeDasharray="40 80" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span 
                className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                Loading your interview...
              </span>
            </div>
          ) : !interviewData ? (
            <div 
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-8 max-w-md shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-amber-800">Interview Not Found</h3>
                </div>
                <p className="text-amber-700 mb-6 leading-relaxed">
                  We couldn't find the interview you're looking for. It may have been removed or the link is incorrect.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-2 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                      <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16"></path>
                      <path d="M8 16H3v5"></path>
                    </svg>
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => router.push('/')}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <InterviewForm
                userName={userName}
                setUserName={setUserName}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
                loading={loading}
                onJoinInterview={onJoinInterview}
                emailDisabled={hasUrlParams}
                nameDisabled={hasUrlParams}
                interviewStatus={interviewData?.status}
                setupEnabled={interviewData?.status === 'Started'}
              />
              <div className="mt-6">
                <InterviewInfo />
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default Interview