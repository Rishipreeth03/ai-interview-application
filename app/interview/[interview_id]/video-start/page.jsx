"use client"
import React, { useContext } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useParams, useRouter } from 'next/navigation'
import useVideoInterviewLogic from './_components/useVideoInterviewLogic'
import TimerDisplay from './_components/TimerDisplay'
import AIRecruiterBox from './_components/AIRecruiterBox'
import VideoRecorderBox from './_components/VideoRecorderBox'
import ControlButtons from './_components/ControlButtons'
import SilenceWarningIndicator from '../_components/SilenceWarningIndicator'
import PrecautionsPanel from './_components/PrecautionsPanel'
import { motion, AnimatePresence } from "framer-motion"

// Main component
const VideoStartInterview = () => {
    const { interviewInfo } = useContext(InterviewDataContext)
    const { interview_id } = useParams()
    const router = useRouter()
    const {
        showLoading,
        secondsElapsed,
        stopInterview,
        silenceWarningCount,
        waitingForResponse,
        videoRef,
        isRecording,
        recordingError
    } = useVideoInterviewLogic(interviewInfo, interview_id, router)

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
                                <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="6" fill="none" opacity="0.2" />
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
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Video Interview Room</span>
                            </h2>
                            <TimerDisplay secondsElapsed={secondsElapsed} />
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <AIRecruiterBox />
                            <VideoRecorderBox
                                videoRef={videoRef}
                                userName={interviewInfo?.userName}
                                isRecording={isRecording}
                                recordingError={recordingError}
                            />
                        </div>
                        <ControlButtons stopInterview={stopInterview} isRecording={isRecording} />
                        <h2 className="text-base text-indigo-500 text-center mt-4 font-semibold tracking-wide animate-pulse">
                            Video interview in progress...
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
                    silenceWarningCount={silenceWarningCount}
                    show={silenceWarningCount > 0 && waitingForResponse}
                />
            </div>
        </motion.div>
    )
}

export default VideoStartInterview
