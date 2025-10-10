import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CardHeader,
  JobTitleAndTags,
  JobDescription,
  ScheduleInfo,
  ActionButtons
} from "./InterviewCardComponents";
import EditScheduleDialog from "./EditScheduleDialog";

export default function InterviewDetailsCard({ interview, onInterviewUpdated }) {
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  // Keep local state for immediate UI updates
  const [localInterview, setLocalInterview] = useState(interview);
  
  // Update local state when props change
  useEffect(() => {
    setLocalInterview(interview);
  }, [interview]);
  
  const handleEditSchedule = () => {
    setIsEditScheduleOpen(true);
  };
  
  const handleScheduleUpdated = (updatedData) => {
    // Immediately update local state for better UI feedback
    if (updatedData) {
      setLocalInterview({...localInterview, ...updatedData});
    }
    
    // Call parent's update function if available
    if (typeof onInterviewUpdated === 'function') {
      onInterviewUpdated();
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Decorative elements */}
      <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-blue-600 opacity-10"></div>
      <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-indigo-600 opacity-10"></div>
      <div className="absolute top-1/3 -right-4 w-8 h-8 rounded-full bg-purple-600 opacity-10"></div>
      <div className="absolute bottom-1/3 -left-4 w-8 h-8 rounded-full bg-purple-600 opacity-10"></div>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100 via-white to-indigo-100 opacity-80 blur-md"></div>
      
      {/* Main card content */}
      <div className="relative p-8 bg-white/95 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-xl hover:shadow-blue-200/50 transition-all duration-300 flex flex-col gap-5">
        
        {/* Card header with position and metadata */}
        <CardHeader interview={localInterview} />
        
        <hr className="border-t border-dashed border-indigo-100" />
        
        {/* Job Title and Tags */}
        <JobTitleAndTags interview={localInterview} />
        
        {/* Job Description Card */}
        <JobDescription interview={localInterview} />
        
        {/* Schedule information if available */}
        <ScheduleInfo 
          interview={localInterview} 
          onEditSchedule={handleEditSchedule}
        />
        
        {/* Interview ID (displayed more subtly) */}
        {localInterview?.interview_id && (
          <div className="text-xs text-gray-400 text-center mb-1">
            ID: {localInterview.interview_id}
          </div>
        )}
        
        {/* Action buttons */}
        <ActionButtons 
          onViewCandidateDetails={() => window.location.href = `/interview-details/${localInterview.interview_id}/candidate-details`}
          interviewId={localInterview.interview_id}
        />
      </div>
      
      {/* Edit Schedule Dialog */}
      <EditScheduleDialog
        isOpen={isEditScheduleOpen}
        onClose={() => setIsEditScheduleOpen(false)}
        interview={localInterview}
        onScheduleUpdated={handleScheduleUpdated}
      />
    </motion.div>
  );
}
