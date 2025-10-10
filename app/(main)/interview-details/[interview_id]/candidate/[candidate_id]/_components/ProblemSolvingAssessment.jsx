"use client"

import { LightbulbIcon, AlertCircle, ThumbsUp, ThumbsDown, BrainCircuit, BadgeCheck } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function ProblemSolvingAssessment({ problemSolvingEvaluation, score }) {
  // Map the new structure to compatible format
  const problemSolvingData = problemSolvingEvaluation || null;
  
  
  if (!problemSolvingData && !score) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-800">
            <div className="bg-indigo-100 p-1.5 rounded-md">
              <LightbulbIcon className="h-5 w-5 text-indigo-600" />
            </div>
            Problem Solving Assessment
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No Problem Solving Assessment Available</h3>
          <p className="text-amber-700 max-w-md text-center">The problem solving assessment data is not available for this candidate.</p>
        </div>
      </div>
    )
  }
  
  // If we have the score from DB but no detailed data, create a basic structure
  const hasDetailedData = !!problemSolvingData
  const formattedScore = score ? Math.round(score) : null
  
  // Use the problemSolvingData.score if available
  const evalScore = hasDetailedData && problemSolvingData.score !== undefined ? problemSolvingData.score : null;
  
  // Create problem solving categories based on detailed evaluation data
  let categories = [];
  
  if (hasDetailedData) {
    // Check if we have the new detailed structure with specific assessment fields
    const hasDetailedFields = problemSolvingData.analyticalThinking || 
                             problemSolvingData.criticalThinking || 
                             problemSolvingData.creativity || 
                             problemSolvingData.decisionMaking || 
                             problemSolvingData.logicalReasoning;
                             
    if (hasDetailedFields) {
      // Create categories from the detailed fields in the new structure
      categories = [
        problemSolvingData.analyticalThinking && {
          name: "Analytical Thinking",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: problemSolvingData.analyticalThinking
        },
        problemSolvingData.criticalThinking && {
          name: "Critical Thinking",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: problemSolvingData.criticalThinking
        },
        problemSolvingData.creativity && {
          name: "Creativity",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: problemSolvingData.creativity
        },
        problemSolvingData.decisionMaking && {
          name: "Decision Making",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: problemSolvingData.decisionMaking
        },
        problemSolvingData.logicalReasoning && {
          name: "Logical Reasoning",
          score: evalScore ? (evalScore / 10).toFixed(1) : 0,
          feedback: problemSolvingData.logicalReasoning
        }
      ].filter(Boolean); // Remove any undefined entries
    } else if (problemSolvingData.aspects || problemSolvingData.categories) {
      // Use existing aspect/categories structure if available
      categories = problemSolvingData.aspects || problemSolvingData.categories;
    } else if (problemSolvingData.analysis || problemSolvingData.approach) {
      // For your specific structure with analysis/approach and no specific categories
      // Skip categories since we'll show them in dedicated sections
      categories = [];
    } else {
      // Fallback to basic structure with available fields
      categories = [
        {
          name: "Problem Analysis",
          score: problemSolvingData.analysisScore || 0,
          feedback: problemSolvingData.analysisFeedback || "No specific feedback provided."
        },
        {
          name: "Solution Approach",
          score: problemSolvingData.designScore || 0,
          feedback: problemSolvingData.approachFeedback || "No specific feedback provided."
        }
      ];
    }
  } else if (formattedScore !== null) {
    // Basic category when no detailed data is available but we have a score
    categories = [
      {
        name: "Problem Solving Skills",
        score: (formattedScore / 10).toFixed(1),
        feedback: "Overall assessment based on candidate's problem solving approach during the interview."
      }
    ];
  }

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b p-4 md:p-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-800">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <LightbulbIcon className="h-5 w-5 text-indigo-600" />
          </div>
          Problem Solving Assessment
        </h3>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Overall problem solving score - prioritize the detailed evaluation score */}
        {(evalScore !== null || formattedScore !== null || (hasDetailedData && problemSolvingData.overallScore !== undefined)) && (
          <div className="mb-6 bg-slate-50/80 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                <span>Overall Problem Solving Score</span>
              </div>
              <div className={`font-semibold py-1 px-3 rounded-full ${getScoreBgClass(
                evalScore !== null
                  ? evalScore / 10
                  : formattedScore !== null 
                    ? formattedScore / 10
                    : (problemSolvingData.overallScore || 0)
              )}`}>
                {evalScore !== null
                  ? (evalScore > 10 ? `${evalScore}%` : `${evalScore}/10`)
                  : formattedScore !== null 
                    ? (formattedScore > 10 ? `${formattedScore}%` : `${formattedScore}/10`)
                    : problemSolvingData.overallScore ? `${problemSolvingData.overallScore}/10` : "N/A"
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
                        : (problemSolvingData.overallScore || 0) * 10)
                  )}`}
                  style={{ 
                    width: `${
                      evalScore !== null
                        ? (evalScore > 10 ? evalScore : evalScore * 10)
                        : formattedScore !== null 
                          ? (formattedScore > 10 ? formattedScore : formattedScore * 10)
                          : (problemSolvingData.overallScore || 0) * 10
                    }%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Problem Solving categories */}
        {categories.length > 0 && (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-slate-800 flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-indigo-500" />
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
        
        {/* Analysis Section */}
        {problemSolvingData.analysis && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-100 p-1 rounded">
                <BrainCircuit className="h-4 w-4 text-indigo-600" />
              </div>
              <h4 className="text-sm font-medium text-indigo-700">ANALYSIS</h4>
            </div>
            <div className="text-gray-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {problemSolvingData.analysis}
            </div>
          </div>
        )}
        
        {/* Approach Section */}
        {problemSolvingData.approach && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-100 p-1 rounded">
                <LightbulbIcon className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-purple-700">APPROACH</h4>
            </div>
            <div className="text-gray-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {problemSolvingData.approach}
            </div>
          </div>
        )}
        
        {/* Strengths */}
        {problemSolvingData.strengths && problemSolvingData.strengths.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-1 rounded">
                <ThumbsUp className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-green-700">STRENGTHS</h4>
            </div>
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
              <ul className="space-y-2">
                {Array.isArray(problemSolvingData.strengths) ? (
                  problemSolvingData.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-green-500 flex-shrink-0">•</div>
                      <span>{typeof strength === 'string' ? strength : JSON.stringify(strength)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-green-500 flex-shrink-0">•</div>
                    <span>{typeof problemSolvingData.strengths === 'string' ? 
                      problemSolvingData.strengths : 
                      'No specific strengths identified.'}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {/* Weaknesses */}
        {problemSolvingData.weaknesses && problemSolvingData.weaknesses.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-100 p-1 rounded">
                <ThumbsDown className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium text-amber-700">WEAKNESSES</h4>
            </div>
            <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
              <ul className="space-y-2">
                {Array.isArray(problemSolvingData.weaknesses) ? (
                  problemSolvingData.weaknesses.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-amber-500 flex-shrink-0">•</div>
                      <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-amber-500 flex-shrink-0">•</div>
                    <span>{typeof problemSolvingData.weaknesses === 'string' ? 
                      problemSolvingData.weaknesses : 
                      'No specific weaknesses identified.'}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {/* Improvement Suggestions / Recommendations */}
        {(problemSolvingData.improvementSuggestions || problemSolvingData.recommendations) && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-1 rounded">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-blue-700">RECOMMENDATIONS</h4>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700">
              {Array.isArray(problemSolvingData.improvementSuggestions || problemSolvingData.recommendations) ? (
                <ul className="space-y-2">
                  {(problemSolvingData.improvementSuggestions || problemSolvingData.recommendations).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-4 mt-0.5 text-blue-500 flex-shrink-0">•</div>
                      <span>{typeof rec === 'string' ? rec : JSON.stringify(rec)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{problemSolvingData.improvementSuggestions || problemSolvingData.recommendations || 'No specific recommendations provided.'}</p>
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