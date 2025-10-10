import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

/**
 * A component that shows a visual warning when the user has been silent for too long.
 * 
 * @param {Object} props Component props
 * @param {number} props.silenceWarningCount Number of silence warnings (0-3)
 * @param {boolean} props.show Whether to show the component or not
 */
const SilenceWarningIndicator = ({ silenceWarningCount, show }) => {
  if (!show || silenceWarningCount === 0) return null;

  // Calculate progress percentage (1 warning = 33%, 2 warnings = 66%, 3 warnings = 100%)
  const progressPercent = Math.min(silenceWarningCount / 3 * 100, 100);
  
  // Determine severity based on warning count
  let alertVariant = "default";
  let title = "We haven't heard from you in a while...";
  let description = "Please respond to continue the interview.";
  
  if (silenceWarningCount === 2) {
    alertVariant = "warning";
    title = "Still waiting for your response";
    description = "The interview will continue when you speak.";
  } else if (silenceWarningCount === 3) {
    alertVariant = "destructive";
    title = "Final reminder: Please respond soon";
    description = "The interview will end shortly due to inactivity.";
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-pulse">
      <Alert variant={alertVariant} className="border-2 shadow-lg">
        <AlertTitle className="flex items-center gap-2">
          {silenceWarningCount === 3 ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
          {title}
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2 mb-1">
            {description}
          </div>
          <Progress value={progressPercent} 
            className={`h-2 ${
              silenceWarningCount === 3 ? 'bg-red-100' : 
              silenceWarningCount === 2 ? 'bg-yellow-100' : 
              'bg-gray-100'
            }`} 
          />
          <div className="text-xs mt-1 text-right">
            Warning {silenceWarningCount}/3
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SilenceWarningIndicator;