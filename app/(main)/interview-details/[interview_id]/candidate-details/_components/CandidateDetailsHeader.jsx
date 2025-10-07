import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Briefcase, Clock, Calendar, Info } from 'lucide-react'
import moment from 'moment'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from "framer-motion"

export default function CandidateDetailsHeader({ interviewData, isLoading }) {
  // Function to determine the style for the status badge
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Not Started':
        return 'bg-amber-100 text-amber-800';
      case 'Started':
        return 'bg-blue-100 text-blue-800';
      case 'Ended':
        return 'bg-green-100 text-green-800';
      default: // undefined or other status
        return 'bg-purple-100 text-purple-800';
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <Link 
        href={`/interview-details/${interviewData?.interview_id || ''}`}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group"
      >
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Interview Details</span>
      </Link>
      
      {isLoading || !interviewData ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex flex-wrap gap-2 mt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900">
            {interviewData.jobPosition || 'Untitled Position'} - Candidate Management
          </h1>
          
          <p className="text-gray-600 mt-1">
            {interviewData.jobDescription?.substring(0, 100) || 'No description provided'}
            {interviewData.jobDescription?.length > 100 ? '...' : ''}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center text-sm text-gray-700">
              <Clock className="h-4 w-4 mr-1 text-blue-600" />
              <span>
                {interviewData.duration 
                  ? `${interviewData.duration} minutes` 
                  : 'Duration not specified'}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-700">
              <Calendar className="h-4 w-4 mr-1 text-blue-600" />
              <span>
                {interviewData.created_at 
                  ? `Created on ${moment(interviewData.created_at).format('MMM D, YYYY')}` 
                  : 'Date not available'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.span 
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Info className="h-4 w-4 mr-1 text-blue-600" />
                </motion.span>
                <motion.span 
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeStyle(interviewData.status)}`}
                  whileTap={{ scale: 0.95 }}
                >
                  {interviewData.status || 'Not Started'}
                </motion.span>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}