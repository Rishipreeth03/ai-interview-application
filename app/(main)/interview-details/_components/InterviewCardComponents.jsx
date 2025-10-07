import { 
  Clock, Calendar, Video, Mic, 
  Briefcase, FileText, Tag,
  BarChart3, Info, Users
} from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

// Badge component for consistent styling
export const Badge = ({ icon, text, color = "blue", isStatus = false }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100"
  };

  // Status badges get additional animations
  if (isStatus) {
    return (
      <motion.span 
        className={`inline-flex items-center gap-1.5 text-sm ${colorStyles[color]} px-3 py-1 rounded-full font-medium shadow-sm border`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
        >
          {icon}
        </motion.span>
        {text}
      </motion.span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${colorStyles[color]} px-3 py-1 rounded-full font-medium shadow-sm border`}>
      {icon}
      {text}
    </span>
  );
};

// InfoSection component for consistent card styling
export const InfoSection = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`p-4 bg-gray-50 rounded-xl border border-gray-200 ${className}`}>
      <h3 className="font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
};

// Header component with icon and metadata
export const CardHeader = ({ interview }) => {
  const isVideo = interview?.videoScreening === true;
  const interviewIcon = isVideo ? <Video className="w-6 h-6" /> : <Mic className="w-6 h-6" />;
  
  // Get difficulty badge color
  const getDifficultyColor = () => {
    switch (interview?.difficulty_level?.toLowerCase()) {
      case 'easy': return 'green';
      case 'hard': return 'red';
      default: return 'blue'; // medium or undefined
    }
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (interview?.status) {
      case 'Not Started': return 'amber';
      case 'Started': return 'blue';
      case 'Ended': return 'green';
      default: return 'purple'; // undefined or other status
    }
  };

  return (
    <div className="flex items-center justify-between">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <span className="text-white font-bold text-xl">
          {interviewIcon}
        </span>
      </motion.div>
      
      <div className="text-right">
        <div className="flex items-center justify-end gap-1.5 mb-1">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <time className="text-xs text-gray-500 font-medium" dateTime={interview?.created_at}>
            {moment(interview?.created_at).format('DD MMM YYYY')}
          </time>
        </div>
        
        <div className="flex flex-wrap gap-1.5 justify-end">
          {interview?.difficulty_level && (
            <Badge 
              icon={<BarChart3 className="w-3.5 h-3.5" />}
              text={`${interview.difficulty_level.charAt(0).toUpperCase() + interview.difficulty_level.slice(1)} Difficulty`}
              color={getDifficultyColor()}
            />
          )}
          
          {/* Display interview status with animation */}
          <Badge 
            icon={<Info className="w-3.5 h-3.5" />}
            text={interview?.status || "Not Started"}
            color={getStatusColor()}
            isStatus={true}
          />
        </div>
      </div>
    </div>
  );
};

// Job Title and Tags component
export const JobTitleAndTags = ({ interview }) => {
  const isVideo = interview?.videoScreening === true;
  
  // Parse tags - handle various formats including ["Technical"] literal string
  const parseTags = () => {
    if (!interview?.type) return [];
    
    // Direct approach for ["Technical"] exact format
    if (typeof interview.type === 'string' && interview.type === '["Technical"]') {
      return ["Technical"];
    }
    
    // If it's already an array, return it directly
    if (Array.isArray(interview.type)) {
      return interview.type;
    }
    
    // If it looks like a JSON string array
    if (typeof interview.type === 'string' && 
        interview.type.trim().startsWith('[') && 
        interview.type.trim().endsWith(']')) {
      
      // First approach: Try JSON parsing
      try {
        const parsed = JSON.parse(interview.type);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.log("JSON parsing failed, trying regex");
      }
      
      // Second approach: Use regex to extract content between quotes
      const tagMatches = [];
      const regex = /"([^"]+)"/g;
      let match;
      
      while ((match = regex.exec(interview.type)) !== null) {
        tagMatches.push(match[1]);
      }
      
      if (tagMatches.length > 0) {
        return tagMatches;
      }
      
      // Third approach: Remove brackets and quotes manually
      return [interview.type.replace(/[\[\]"]/g, '').trim()];
    }
    
    // If it's a regular string, split by commas
    if (typeof interview.type === 'string') {
      return interview.type.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    return [];
  };
  
  const interviewTags = parseTags();
  
  // Calculate interview duration in a more readable format
  const formattedDuration = interview?.duration ? 
    `${interview.duration} ${parseInt(interview.duration) > 1 ? 'minutes' : 'minute'}` : 'Not specified';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-indigo-600" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-500">
          {interview?.jobPosition || "Untitled Position"}
        </span>
      </h2>
      
      {/* Interview badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge 
          icon={<Clock className="w-3.5 h-3.5" />}
          text={formattedDuration}
          color="blue"
        />
        
        <Badge 
          icon={isVideo ? <Video className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          text={isVideo ? "Video Interview" : "Audio Interview"}
          color={isVideo ? "purple" : "indigo"}
        />
        
        {/* Display tags as individual badges */}
        {interviewTags.length > 0 ? (
          interviewTags.map((tag, index) => (
            <Badge 
              key={index}
              icon={<Tag className="w-3.5 h-3.5" />}
              text={tag}
              color={["amber", "blue", "purple", "green", "indigo", "red"][index % 6]}
            />
          ))
        ) : (
          // Fallback - try to display the raw type as a single tag if parsing failed
          interview?.type && (
            <Badge 
              icon={<Tag className="w-3.5 h-3.5" />}
              text={typeof interview.type === 'string' ? interview.type.replace(/[\[\]"]/g, '') : String(interview.type)}
              color="amber"
            />
          )
        )}
      </div>
    </div>
  );
};

// Job Description component
export const JobDescription = ({ interview }) => (
  <InfoSection 
    title="Job Description"
    icon={<FileText className="w-4 h-4 text-indigo-600" />}
    className="mb-4"
  >
    <p className="text-gray-700 text-sm leading-relaxed">
      {interview?.jobDescription || "No description provided"}
    </p>
  </InfoSection>
);

// Schedule Information component
export const ScheduleInfo = ({ interview }) => {
  const hasSchedule = interview?.start_at && interview?.end_at;
  const startDate = hasSchedule ? moment(interview.start_at).format('MMM DD, YYYY h:mm A') : null;
  const endDate = hasSchedule ? moment(interview.end_at).format('MMM DD, YYYY h:mm A') : null;
  
  if (!hasSchedule) return null;
  
  return (
    <InfoSection 
      title="Interview Schedule"
      icon={<Calendar className="w-4 h-4 text-blue-600" />}
      className="mb-4"
    >
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 min-w-[50px]">Start:</span>
          <span className="text-blue-700">{startDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 min-w-[50px]">End:</span>
          <span className="text-blue-700">{endDate}</span>
        </div>
      </div>
    </InfoSection>
  );
};

// Action Buttons component
export const ActionButtons = ({ onViewCandidateDetails, interviewId }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.3 }}
    className="flex flex-wrap justify-center gap-3 mt-2"
  >
     <Button
       onClick={onViewCandidateDetails}
       className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition font-medium rounded-xl shadow-md"
       aria-label="View candidate details"
     >
       <Users className="w-4 h-4" /> Candidate Details
     </Button>
  </motion.div>
);