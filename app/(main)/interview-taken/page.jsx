'use client'
import React from "react"
import InterviewTakenHeader from "./_components/InterviewTakenHeader"
import InterviewTakenList from "./_components/InterviewTakenList"
import InterviewReportDialog from "./_components/InterviewReportDialog"
import useInterviewTakenPage from "./_components/useInterviewTakenPage"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function InterviewTakenPage() {
  const {
    interviews,
    loading,
    showReport,
    selectedReport,
    handleShowReport,
    handleCloseReport,
  } = useInterviewTakenPage()

  return (
    <motion.main
      className="max-w-3xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <InterviewTakenHeader />
      <AnimatePresence>
        {loading ? (
          <motion.div
            className="flex items-center justify-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="5" fill="none" opacity="0.2"/>
                <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="5" fill="none" strokeDasharray="32 64" />
              </svg>
            </motion.div>
          </motion.div>
        ) : interviews.length === 0 ? (
          <motion.div
            className="text-center text-gray-500 py-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Optional illustration */}
            <svg width="64" height="64" fill="none" className="mb-4 opacity-40">
              <circle cx="32" cy="32" r="32" fill="#EEF2FF"/>
              <path d="M20 44h24M32 20v16" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            No interviews taken yet.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <InterviewTakenList
              interviews={interviews}
              handleShowReport={handleShowReport}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
          >
            <InterviewReportDialog
              showReport={showReport}
              selectedReport={selectedReport}
              handleCloseReport={handleCloseReport}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
