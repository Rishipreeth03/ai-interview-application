import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Briefcase, Clock, Calendar, Info, Users, Star } from 'lucide-react'
import moment from 'moment'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from "framer-motion"

export default function CandidateDetailsHeader({ interviewData, isLoading }) {
  // Function to determine the style for the status badge
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200';
      case 'Started':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200';
      case 'Ended':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200';
      default: // undefined or other status
        return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border border-purple-200';
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl shadow-lg border border-indigo-100/50 p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      
      <Link 
        href={`/interview-details/${interviewData?.interview_id || ''}`}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-5 group bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 w-fit"
      >
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Back to Interview Details</span>
      </Link>
      
      {isLoading || !interviewData ? (
        <div className="space-y-4 relative z-10">
          <Skeleton className="h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
          <div className="flex flex-wrap gap-3 mt-6">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-900">
              {interviewData.jobPosition || 'Untitled Position'}
            </h1>
            
            <div className="flex items-center mt-2 mb-3">
              <Users className="h-4 w-4 mr-2 text-indigo-600" />
              <span className="text-indigo-700 font-medium">Candidate Management</span>
            </div>
            
            <p className="text-gray-600 mt-1 max-w-3xl leading-relaxed">
              {interviewData.jobDescription?.substring(0, 120) || 'No description provided'}
              {interviewData.jobDescription?.length > 120 ? '...' : ''}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.div 
                className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {interviewData.duration 
                    ? `${interviewData.duration} minutes` 
                    : 'Duration not specified'}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {interviewData.created_at 
                    ? `Created on ${moment(interviewData.created_at).format('MMM D, YYYY')}` 
                    : 'Date not available'}
                </span>
              </motion.div>
              
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div 
                  className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm flex items-center ${getStatusBadgeStyle(interviewData.status)}`}
                  whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span 
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <Star className="h-4 w-4 mr-2 inline-block" />
                  </motion.span>
                  {interviewData.status || 'Not Started'}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}