import { motion } from "framer-motion";
import {
  CardHeader,
  JobTitleAndTags,
  JobDescription,
  ScheduleInfo,
  ActionButtons
} from "./InterviewCardComponents";

export default function InterviewDetailsCard({ interview }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-2xl mx-auto p-0"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100 via-white to-indigo-100 opacity-80 blur-md"></div>
      
      {/* Main card content */}
      <div className="relative p-6 bg-white/90 rounded-2xl border border-gray-100 shadow-lg hover:shadow-blue-200 transition-all duration-300 flex flex-col gap-5">
        
        {/* Card header with position and metadata */}
        <CardHeader interview={interview} />
        
        <hr className="border-t border-dashed border-indigo-100" />
        
        {/* Job Title and Tags */}
        <JobTitleAndTags interview={interview} />
        
        {/* Job Description Card */}
        <JobDescription interview={interview} />
        
        {/* Schedule information if available */}
        <ScheduleInfo interview={interview} />
        
        {/* Interview ID (displayed more subtly) */}
        {interview?.interview_id && (
          <div className="text-xs text-gray-400 text-center mb-1">
            ID: {interview.interview_id}
          </div>
        )}
        
        {/* Action buttons */}
        <ActionButtons 
          onViewCandidateDetails={() => window.location.href = `/interview-details/${interview.interview_id}/candidate-details`}
          interviewId={interview.interview_id}
        />
      </div>
    </motion.div>
  );
}
