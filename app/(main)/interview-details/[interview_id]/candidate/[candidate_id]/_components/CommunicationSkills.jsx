"use client"

import { MessageSquare, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function CommunicationSkills({ communicationEvaluation, score }) {
  // Map the new communicationEvaluation structure to the old communicationData structure
  const communicationData = communicationEvaluation || null;
  
  if (!communicationData && !score) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b p-4 md:p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-teal-800">
            <div className="bg-teal-100 p-1.5 rounded-md">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>
            Communication Skills Assessment
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No Communication Assessment Available</h3>
          <p className="text-amber-700 max-w-md text-center">The communication skills assessment data is not available for this candidate.</p>
        </div>
      </div>
    )
  }
  
  // If we have the score from DB but no detailed data, create a basic structure
  const hasDetailedData = !!communicationData
  const formattedScore = score ? Math.round(score) : null

  // Use the communicationData.score if available
  const evalScore = hasDetailedData && communicationData.score !== undefined ? communicationData.score : null;
  
  // Create communication categories based on detailed evaluation data
  let categories = [];
  
  if (hasDetailedData) {
    // Check if we have the new detailed structure with specific assessment fields
    const hasDetailedFields = communicationData.clarity || 
                             communicationData.structure || 
                             communicationData.conciseness || 
                             communicationData.technicalArticulation || 
                             communicationData.listening;
                             
    if (hasDetailedFields) {
      // Create categories from the detailed fields in the new structure
      categories = [
        communicationData.clarity && {
          name: "Clarity",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: communicationData.clarity
        },
        communicationData.structure && {
          name: "Structure",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: communicationData.structure
        },
        communicationData.conciseness && {
          name: "Conciseness",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: communicationData.conciseness
        },
        communicationData.technicalArticulation && {
          name: "Technical Articulation",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: communicationData.technicalArticulation
        },
        communicationData.listening && {
          name: "Listening Skills",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: communicationData.listening
        }
      ].filter(Boolean); // Remove any undefined entries
    } else if (communicationData.aspects || communicationData.categories) {
      // Use existing aspect/categories structure if available
      categories = communicationData.aspects || communicationData.categories;
    } else {
      // Fallback to basic structure with available fields
      categories = [
        {
          name: "Verbal Communication",
          score: communicationData.verbalScore || communicationData.verbal || 0,
          feedback: communicationData.verbalFeedback || "No specific feedback provided."
        },
        {
          name: "Clarity of Expression",
          score: communicationData.clarityScore || communicationData.clarity || 0,
          feedback: communicationData.clarityFeedback || "No specific feedback provided."
        },
        {
          name: "Professional Language",
          score: communicationData.professionalScore || communicationData.professionalism || 0,
          feedback: communicationData.professionalFeedback || "No specific feedback provided."
        }
      ];
    }
  } else {
    // Basic category when no detailed data is available
    categories = [
      {
        name: "Communication Skills",
        score: formattedScore ? (formattedScore / 10).toFixed(1) : 0,
        feedback: "Overall assessment based on candidate's communication during the interview."
      }
    ];
  }

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b p-4 md:p-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-teal-800">
          <div className="bg-teal-100 p-1.5 rounded-md">
            <MessageSquare className="h-5 w-5 text-teal-600" />
          </div>
          Communication Skills Assessment
        </h3>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Overall communication score - prioritize the detailed evaluation score */}
        {(evalScore !== null || formattedScore !== null || (hasDetailedData && communicationData.overallScore !== undefined)) && (
          <div className="mb-6 bg-slate-50/80 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-500" />
                <span>Overall Communication Score</span>
              </div>
              <div className={`font-semibold py-1 px-3 rounded-full ${getScoreBgClass(
                evalScore !== null
                  ? evalScore / 10
                  : formattedScore !== null 
                    ? formattedScore / 10
                    : communicationData.overallScore
              )}`}>
                {evalScore !== null
                  ? (evalScore > 10 ? `${evalScore}%` : `${evalScore}/10`)
                  : formattedScore !== null 
                    ? (formattedScore > 10 ? `${formattedScore}%` : `${formattedScore}/10`)
                    : communicationData.overallScore ? `${communicationData.overallScore}/10` : "N/A"
                }
              </div>
            </div>
            
            {/* Visual score indicator */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColorClass(
                    (evalScore !== null
                      ? (evalScore > 10 ? evalScore : evalScore * 10)
                      : formattedScore !== null 
                        ? (formattedScore > 10 ? formattedScore : formattedScore * 10)
                        : (communicationData.overallScore || 0) * 10)
                  )}`}
                  style={{ 
                    width: `${
                      evalScore !== null
                        ? (evalScore > 10 ? evalScore : evalScore * 10)
                        : formattedScore !== null 
                          ? (formattedScore > 10 ? formattedScore : formattedScore * 10)
                          : (communicationData.overallScore || 0) * 10
                    }%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Communication categories */}
        {categories.length > 0 && (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-teal-500" />
                    {category.name}
                  </h4>
                  {typeof category.score === 'number' && (
                    <div className={`font-semibold text-sm py-1 px-2.5 rounded-lg ${getScoreBgClass(category.score)}`}>
                      {category.score}/10
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                  {category.feedback}
                </div>
                
                {/* Mini progress indicator */}
                {typeof category.score === 'number' && (
                  <div className="mt-3 w-full">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={getProgressColorClass(category.score * 10)}
                        style={{ width: `${category.score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Analysis / Overall Assessment */}
        {(communicationData.analysis || communicationData.generalObservations || communicationData.overallAssessment) && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-teal-100 p-1 rounded">
                <MessageSquare className="h-4 w-4 text-teal-600" />
              </div>
              <h4 className="text-sm font-medium text-teal-700">ANALYSIS</h4>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-lg border border-teal-100 text-gray-700">
              {communicationData.analysis || communicationData.generalObservations || communicationData.overallAssessment}
            </div>
          </div>
        )}
        
        {/* Strengths */}
        {communicationData.strengths && communicationData.strengths.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-1 rounded">
                <ThumbsUp className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-green-700">STRENGTHS</h4>
            </div>
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
              <ul className="space-y-2">
                {Array.isArray(communicationData.strengths) ? (
                  communicationData.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-green-500 flex-shrink-0">•</div>
                      <span>{typeof strength === 'string' ? strength : JSON.stringify(strength)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-green-500 flex-shrink-0">•</div>
                    <span>{typeof communicationData.strengths === 'string' ? 
                      communicationData.strengths : 
                      'No specific strengths identified.'}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {/* Areas for Improvement / Weaknesses */}
        {((communicationData.areasForImprovement && communicationData.areasForImprovement.length > 0) ||
          (communicationData.weaknesses && communicationData.weaknesses.length > 0)) && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-100 p-1 rounded">
                <ThumbsDown className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium text-amber-700">AREAS FOR IMPROVEMENT</h4>
            </div>
            <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
              <ul className="space-y-2">
                {Array.isArray(communicationData.weaknesses || communicationData.areasForImprovement) ? (
                  (communicationData.weaknesses || communicationData.areasForImprovement).map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-amber-500 flex-shrink-0">•</div>
                      <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-amber-500 flex-shrink-0">•</div>
                    <span>{typeof (communicationData.weaknesses || communicationData.areasForImprovement) === 'string' ? 
                      (communicationData.weaknesses || communicationData.areasForImprovement) : 
                      'No specific areas for improvement identified.'}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {/* Improvement Suggestions / Recommendations */}
        {(communicationData.improvementSuggestions || communicationData.recommendations) && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-1 rounded">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-blue-700">RECOMMENDATIONS</h4>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700">
              {Array.isArray(communicationData.improvementSuggestions || communicationData.recommendations) ? (
                <ul className="space-y-2">
                  {(communicationData.improvementSuggestions || communicationData.recommendations).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-blue-500 flex-shrink-0">•</div>
                      <span>{typeof rec === 'string' ? rec : JSON.stringify(rec)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{communicationData.improvementSuggestions || communicationData.recommendations || 'No specific recommendations provided.'}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper functions for styling based on score
function getScoreColorClass(score) {
  if (score === null || score === undefined) return 'text-gray-500';
  
  // Normalize score to 0-10 range
  const numScore = Number(score);
  const normalizedScore = numScore > 10 ? numScore / 10 : numScore;
  
  if (normalizedScore >= 8) return 'text-green-600';
  if (normalizedScore >= 7) return 'text-blue-600';
  if (normalizedScore >= 6) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreBgClass(score) {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-500';
  
  // Normalize score to 0-10 range
  const numScore = Number(score);
  const normalizedScore = numScore > 10 ? numScore / 10 : numScore;
  
  if (normalizedScore >= 8) return 'bg-green-100 text-green-800';
  if (normalizedScore >= 7) return 'bg-blue-100 text-blue-800';
  if (normalizedScore >= 6) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

function getProgressColorClass(percentage) {
  if (percentage === null || percentage === undefined) return 'bg-gray-300';
  
  const numPercentage = Number(percentage);
  
  if (numPercentage >= 80) return 'bg-green-500';
  if (numPercentage >= 70) return 'bg-blue-500';
  if (numPercentage >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}