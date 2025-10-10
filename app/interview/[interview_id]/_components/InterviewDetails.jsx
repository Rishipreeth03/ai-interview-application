import { Clock, Briefcase, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

function InterviewDetails({ interviewData }) {
  if (!interviewData) return null;
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="font-bold text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {interviewData?.jobPosition}
      </motion.h2>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mt-2">
        <div className="flex items-center gap-2 text-indigo-600">
          <div className="bg-indigo-100 p-2 rounded-full">
            <Clock className="h-4 w-4" />
          </div>
          <span className="font-medium">{interviewData?.duration} minutes</span>
        </div>
        
        <div className="flex items-center gap-2 text-emerald-600">
          <div className="bg-emerald-100 p-2 rounded-full">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-medium">{interviewData?.companyName || 'AI Recruiter'}</span>
        </div>
        
        {interviewData?.date && (
          <div className="flex items-center gap-2 text-amber-600">
            <div className="bg-amber-100 p-2 rounded-full">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-medium">{new Date(interviewData.date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default InterviewDetails
