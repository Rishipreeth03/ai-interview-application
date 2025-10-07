"use client"
import React, { useEffect, useState } from 'react'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import WelcomeContainer from './_components/WelcomeContainer'
import { motion, AnimatePresence } from "framer-motion"

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [pageKey, setPageKey] = useState(Date.now()) // Add a unique key that changes on each render

  useEffect(() => {
    // Reset loading state and simulate loading for a brief moment when the component mounts
    setLoading(true)
    setPageKey(Date.now()) // Update the key to ensure a fresh render
    
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, []) // Empty dependency array means this runs once on mount
  
  // This ensures the page components are always re-rendered when navigating to this page
  useEffect(() => {
    // Listen for route changes or focus events that might indicate returning to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setPageKey(Date.now())
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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
      key={pageKey} // Add the key to ensure the component is re-rendered
    >
      <motion.h1
        className='text-3xl font-bold my-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key="dashboard-title"
      >
        Dashboard
      </motion.h1>
      
      {/* Welcome Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        key="welcome-container"
        className="mb-6"
      >
        <WelcomeContainer key={new Date().getTime()} />
      </motion.div>
      
      {/* Quick Tips section */}
      <motion.div
        className="mb-6 p-4 bg-yellow-50 rounded shadow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        key="quick-tips"
      >
        <h2 className="font-semibold mb-2">Quick Tips</h2>
        <ul className="list-disc ml-5 text-gray-700">
          <li>Use <b>Create Options</b> to start a new interview.</li>
          <li>Check <b>Latest Interviews</b> for recent activity.</li>
          <li>Visit the Help section for more guidance.</li>
        </ul>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        key="create-options"
      >
        <CreateOptions key={new Date().getTime()} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        key="latest-interviews"
      >
        <LatestInterviewsList key={new Date().getTime()} />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard