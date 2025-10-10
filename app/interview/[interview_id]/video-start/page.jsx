'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import VapiVideoRecorder from './_components/VapiVideoRecorder'
import QuestionDisplay from './_components/QuestionDisplay'
import SilenceWarningIndicator from '../_components/SilenceWarningIndicator'
import { supabase } from '@/app/services/supaBaseclient'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import PrecautionsPanel from '../start/_components/PrecautionsPanel'
import useVideoInterviewLogic from './_components/useVideoInterviewLogic'
import EndInterviewDialog from './_components/EndInterviewDialog'
import useStopWebcam from './_components/useStopWebcam'

export default function VideoStartPage() {
  const router = useRouter()
  const params = useParams()
  const { interview_id } = params
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)
  
  // Redirect if user information is missing
  useEffect(() => {
    if (!interviewInfo?.userName || !interviewInfo?.userEmail) {
      router.push(`/interview/${interview_id}`)
    }
  }, [interviewInfo, interview_id, router])
  
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Simplified state management
  const [showEndDialog, setShowEndDialog] = useState(false)
  
  // Process questions from the interviewInfo context
  useEffect(() => {
    if (!interviewInfo) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if we have questions in the interviewInfo
      if (!interviewInfo.interviewData?.questionList) {
        setQuestions([]);
        setLoading(false);
        return;
      }
      
      // Parse questions from the interview data
      const questionList = interviewInfo.interviewData.questionList;
      let parsedQuestions;
      
      try {
        // Handle both string and already parsed JSON
        parsedQuestions = typeof questionList === 'string' 
          ? JSON.parse(questionList) 
          : questionList;
      } catch (parseError) {
        parsedQuestions = [];
      }
      
      // Map the questions to the required format
      const questionData = Array.isArray(parsedQuestions)
        ? parsedQuestions.map((q, idx) => ({
            question_id: `generated-${idx}`,
            question_text: q.text || q.question || q,
            question_order: idx,
            interview_id: interview_id,
            type: q.type || 'General',
            difficulty: q.difficulty || 'medium'
          }))
        : [];
      
      // Update the questions state
      setQuestions(questionData);
      setLoading(false);
      
    } catch (error) {
      setError('Failed to process interview data. Please try again or contact support.');
      setLoading(false);
    }
  }, [interviewInfo, interview_id])

  // Initialize the Vapi interview logic hook with only needed values
  const {
    showLoading,
    secondsElapsed,
    stopInterview,
    activeUser,
    waitingForResponse,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    volumeLevel,
    enableInterruptions,
    repeatQuestion,
    adjustVoiceSettings,
    hintOffered
  } = useVideoInterviewLogic(interviewInfo, interview_id, router, questions)
  // State to track if interview is being ended
  const [endingInterview, setEndingInterview] = useState(false)
  const [interviewEnded, setInterviewEnded] = useState(false)
  
  // Handle next question click
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setEndingInterview(true)
      await stopInterview()
      setInterviewEnded(true)
      setEndingInterview(false)
    }
  }
  
  // Handle end interview - now redirects directly to completed page
  const handleEndInterview = async () => {
    setEndingInterview(true)
    await stopInterview()
    setInterviewEnded(true)
    setEndingInterview(false)
    
    // Directly redirect to completed page
    router.push(`/interview/${interview_id}/completed`)
  }
  
  // Use the hook to stop webcam when interview ends
  useStopWebcam(interviewEnded || showLoading || endingInterview)
  
  // Calculate remaining time based on interview duration from context
  const totalDuration = interviewInfo?.interviewData?.duration 
    ? Number(interviewInfo.interviewData.duration) * 60 
    : 300
  const remainingTime = Math.max(0, totalDuration - secondsElapsed)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-700 text-lg font-medium">Loading interview...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Interview Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <p className="text-sm text-gray-500 text-center mb-4">Interview ID: {interview_id}</p>
          <p className="text-xs text-gray-400 text-center mb-6">
            If this problem persists, please ensure you have a stable internet connection
            and try using a different browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={async () => {
                // Test the database connection before reloading
                try {
                  toast.info("Testing database connection...")
                  const { data, error } = await supabase.from('interviews').select('count').limit(1)
                  
                  if (error) {
                    toast.error("Database connection test failed. Please check your network.")
                    console.error("Connection test error:", error)
                  } else {
                    toast.success("Database connection successful. Reloading...")
                    setTimeout(() => window.location.reload(), 1000)
                  }
                } catch (e) {
                  toast.error("Connection test error: " + e.message)
                }
              }}
              className="mb-2 sm:mb-0"
            >
              Retry Loading
            </Button>
            <Button
              onClick={() => router.push(`/interview/${interview_id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Safely determine the current question
  const hasValidQuestions = questions && Array.isArray(questions) && questions.length > 0;
  const isValidIndex = currentQuestionIndex >= 0 && currentQuestionIndex < (questions?.length || 0);
  const currentQuestion = hasValidQuestions && isValidIndex ? questions[currentQuestionIndex] : null;
  
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-2 py-8"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence>
        {showLoading && (
          <motion.div
            className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative mb-4"
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto">
                <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="6" fill="none" opacity="0.2"/>
                <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="6" fill="none" strokeDasharray="44 88" />
              </svg>
            </motion.div>
            <span className="ml-4 text-lg font-semibold text-indigo-700 mt-4">Processing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main interview content */}
          <motion.div
            className="w-full lg:w-3/4 flex flex-col gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl md:text-3xl text-indigo-700 tracking-tight drop-shadow-lg">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Video Interview</span>
              </h2>
              <div className="flex items-center">
                {totalDuration > 0 && (
                  <div className="mr-4 text-sm text-gray-500">
                    Time remaining: <span className="font-semibold">{Math.floor((totalDuration - secondsElapsed) / 60)}:{((totalDuration - secondsElapsed) % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
                <div className="flex items-center justify-center bg-indigo-100 p-2 rounded-full h-12 w-12">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-indigo-600">
                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Video and question area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vapi Video recorder */}
              <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6">
                <VapiVideoRecorder 
                  interviewId={interview_id}
                  volumeLevel={volumeLevel}
                  activeUser={activeUser}
                  waitingForResponse={waitingForResponse}
                  interviewEnded={interviewEnded || showLoading}
                />
              </div>

              {/* Question display */}
              <div className="lg:col-span-5">
                <QuestionDisplay
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  waitingForResponse={waitingForResponse}
                  activeUser={activeUser}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                <CheckCircle2 className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setShowEndDialog(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={endingInterview || showLoading}
              >
                {endingInterview || showLoading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                    Processing...
                  </>
                ) : (
                  'End Interview'
                )}
              </Button>
              
              {/* Dialogs rendered conditionally to improve performance */}
              {showEndDialog && (
                <EndInterviewDialog
                  open={true}
                  onOpenChange={endingInterview ? () => {} : setShowEndDialog}
                  onConfirm={() => {
                    setShowEndDialog(false);
                    handleEndInterview();
                  }}
                  onCancel={() => setShowEndDialog(false)}
                />
              )}
              
              {/* Interview Completed Dialog removed - direct redirect instead */}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={enableInterruptions}
                variant="ghost" 
                className="text-sm"
              >
                Enable Interruptions
              </Button>
              
              <Button 
                onClick={repeatQuestion}
                variant="ghost" 
                className="text-sm"
              >
                Repeat Question
              </Button>
              
              <Button 
                onClick={() => adjustVoiceSettings({ speed: 1.1, clarity: 0.8 })}
                variant="ghost" 
                className="text-sm"
              >
                Adjust Voice
              </Button>
            </div>
            
            <h2 className="text-base text-indigo-500 text-center mt-4 font-semibold tracking-wide animate-pulse">
              Interview in progress...
            </h2>

            {/* Mobile precautions panel - visible only on small screens */}
            <div className="lg:hidden mt-2">
              <PrecautionsPanel />
            </div>
          </motion.div>

          {/* Right sidebar with precautions - visible only on large screens */}
          <motion.div 
            className="hidden lg:block lg:w-1/4 pt-16"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <PrecautionsPanel />
          </motion.div>
        </div>
        
        {/* Silence warning indicator - placed outside the layout flow */}
        <SilenceWarningIndicator 
          silenceWarningCount={hintOffered ? 1 : 0} 
          show={hintOffered && waitingForResponse}
        />
      </div>
    </motion.div>
  )
}