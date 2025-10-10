'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuestionDisplay({ 
  question, 
  questionNumber, 
  totalQuestions,
  waitingForResponse,
  activeUser
}) {
  if (!question) {
    return (
      <div className="bg-white/90 shadow-lg rounded-xl p-6 h-full flex items-center justify-center">
        <p className="text-gray-500 italic">Loading questions...</p>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white/90 shadow-lg rounded-xl overflow-hidden h-full flex flex-col"
      key={question.question_id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`px-6 py-4 text-white ${waitingForResponse ? 'bg-gradient-to-r from-green-600 to-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Question {questionNumber} of {totalQuestions}</h3>
          <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium flex items-center">
            {waitingForResponse && (
              <span className="inline-block h-2 w-2 mr-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
            {question.topic || 'General'}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <div className={`rounded-xl p-5 border shadow-sm transition-all duration-300 ${
          waitingForResponse 
            ? 'bg-green-50/80 border-green-200 ring-2 ring-green-300/50' 
            : 'bg-indigo-50/70 border-indigo-100'
        }`}>
          <div className="flex items-start gap-2">
            {waitingForResponse && (
              <div className="mt-1 flex-shrink-0">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )}
            <p className={`${waitingForResponse ? 'text-green-800' : 'text-gray-800'} text-lg font-medium`}>
              {question.question_text}
            </p>
          </div>
          
          {waitingForResponse && (
            <div className="mt-3 text-sm text-green-600 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Your turn to respond
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {question.tips && (
            <motion.div 
              className="mt-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                Helpful Tips
              </h4>
              <div className="bg-amber-50/70 rounded-lg p-4 border border-amber-100">
                <p className="text-amber-800 text-sm">{question.tips}</p>
              </div>
            </motion.div>
          )}
          
          {question.expected_duration && (
            <motion.div 
              className="mt-4 flex items-center text-indigo-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Suggested time: <span className="font-semibold">{question.expected_duration} seconds</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}