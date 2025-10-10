'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function ControlButtons({ stopInterview }) {
  return (
    <motion.div 
      className="flex justify-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <button
        onClick={() => stopInterview()}
        className="px-6 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-center font-medium transition-all hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        End Interview
      </button>

      <button
        onClick={() => window.document.documentElement.requestFullscreen()}
        className="px-6 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center font-medium transition-all hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
        Fullscreen
      </button>
    </motion.div>
  )
}