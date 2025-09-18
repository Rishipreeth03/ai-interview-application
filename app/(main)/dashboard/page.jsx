"use client"
import React, { useEffect, useState } from 'react'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { motion, AnimatePresence } from "framer-motion"

function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          className="flex flex-col items-center justify-center h-screen"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="mb-4"
          >
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="6" fill="none" opacity="0.2"/>
              <circle cx="32" cy="32" r="28" stroke="#6366F1" strokeWidth="6" fill="none" strokeDasharray="44 88" />
            </svg>
          </motion.div>
          <span className="text-lg font-medium text-gray-700">Loading dashboard...</span>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div
      className='p-10'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className='text-3xl font-bold my-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>
      {/* Quick Tips section */}
      <motion.div
        className="mb-6 p-4 bg-yellow-50 rounded shadow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="font-semibold mb-2">Quick Tips</h2>
        <ul className="list-disc ml-5 text-gray-700">
          <li>Use <b>Create Options</b> to start a new interview.</li>
          <li>Check <b>Latest Interviews</b> for recent activity.</li>
          <li>Visit the Help section for more guidance.</li>
        </ul>
      </motion.div>
      <CreateOptions />
      <LatestInterviewsList />
    </motion.div>
  )
}

export default Dashboard