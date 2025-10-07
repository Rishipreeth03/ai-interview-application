'use client'
import React, { useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import AllInterviewsHeader from './_components/InterviewHeader'
import InterviewDetails from './_components/InterviewDetails'
import InterviewForm from './_components/InterviewForm'
import InterviewInfo from './_components/InterviewInfo'
import useInterviewPage from './_components/useInterviewPage'
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from '@/app/services/supaBaseclient'

function Interview() {
  const { interview_id } = useParams()
  const router = useRouter()
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)
  const {
    interviewData,
    loading,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    onJoinInterview,
  } = useInterviewPage(interview_id, setInterviewInfo, router)

  // Fetch email from auth session and disable editing
  React.useEffect(() => {
    async function fetchAuthEmail() {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.email) {
        setUserEmail(data.user.email)
      }
    }
    fetchAuthEmail()
    // eslint-disable-next-line
  }, [])

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0, scale: 0.97, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-100 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-lg p-8 md:p-12 lg:p-16 space-y-6 transition-all duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <AllInterviewsHeader />
        <InterviewDetails interviewData={interviewData} />
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="mb-4"
              >
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="5" fill="none" opacity="0.2"/>
                  <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="5" fill="none" strokeDasharray="32 64" />
                </svg>
              </motion.div>
              <span className="text-lg font-medium text-gray-700">Loading interview...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <InterviewForm
                userName={userName}
                setUserName={setUserName}
                userEmail={userEmail}
                setUserEmail={() => {}}
                loading={loading}
                onJoinInterview={onJoinInterview}
                emailDisabled={true}
                interviewStatus={interviewData?.status}
              />
              <InterviewInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default Interview