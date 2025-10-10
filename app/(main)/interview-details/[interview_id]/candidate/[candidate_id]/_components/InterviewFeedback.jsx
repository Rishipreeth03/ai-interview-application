"use client"

import { AlertTriangle, CheckCircle2, XCircle, BarChart3 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function InterviewFeedback({ feedbackData, aiScore, problemSolvingScore }) {
  if (!feedbackData) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b p-4 md:p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-800">
            <div className="bg-indigo-100 p-1.5 rounded-md">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            Interview Performance Summary
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No Feedback Available</h3>
          <p className="text-amber-700 max-w-md text-center">The interview feedback data is not available for this candidate.</p>
        </div>
      </div>
    )
  }
  
  // Format the AI score to a percentage with no decimal places
  const formattedScore = aiScore ? Math.round(aiScore) : null
  const formattedProblemSolvingScore = problemSolvingScore ? Math.round(problemSolvingScore) : null
  
  // Extract relevant data from the updated feedback structure
  // Handle nested summary object or direct string
  const summaryData = feedbackData.summary || {}
  const overallFeedback = typeof summaryData === 'object' ? summaryData.overallFeedback : 
                         (typeof summaryData === 'string' ? summaryData : '')
  const summaryOverallScore = typeof summaryData === 'object' && summaryData.overallScore ? summaryData.overallScore : null
  const keyInsights = typeof summaryData === 'object' && Array.isArray(summaryData.keyInsights) ? summaryData.keyInsights : 
                     (Array.isArray(feedbackData.keyInsights) ? feedbackData.keyInsights : [])
  const improvementAreas = Array.isArray(feedbackData.improvementAreas) ? feedbackData.improvementAreas : []
  const recommendationDetails = feedbackData.recommendationDetails || {}

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b p-4 md:p-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-800">
          <div className="bg-indigo-100 p-1.5 rounded-md">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          Interview Performance Summary
        </h3>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Overall Score Display - use summary.overallScore if available, otherwise fall back to aiScore */}
        {(summaryOverallScore !== null || formattedScore !== null) && (
          <div className="mb-6 bg-slate-50/80 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                <span>Overall AI Score</span>
              </div>
              <div className={`font-semibold py-1 px-3 rounded-full ${getScoreBgClass(summaryOverallScore || formattedScore)}`}>
                {summaryOverallScore || formattedScore}%
              </div>
            </div>
            
            {/* Visual score indicator */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColorClass(summaryOverallScore || formattedScore)}`}
                  style={{ width: `${summaryOverallScore || formattedScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Problem Solving Score Display */}
        {formattedProblemSolvingScore !== null && (
          <div className="mb-6 bg-slate-50/80 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <div className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2Z"></path>
                    <path d="M14.5 8A2.5 2.5 0 0 1 17 10.5v9a2.5 2.5 0 0 1-5 0v-9A2.5 2.5 0 0 1 14.5 8Z"></path>
                    <path d="M19.5 14a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1-5 0v-3a2.5 2.5 0 0 1 2.5-2.5Z"></path>
                  </svg>
                </div>
                <span>Problem Solving Score</span>
              </div>
              <div className={`font-semibold py-1 px-3 rounded-full ${getScoreBgClass(formattedProblemSolvingScore)}`}>
                {formattedProblemSolvingScore}%
              </div>
            </div>
            
            {/* Visual score indicator */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColorClass(formattedProblemSolvingScore)}`}
                  style={{ width: `${formattedProblemSolvingScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Overall Assessment */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1 rounded ${formattedScore && formattedScore >= 70 ? 'bg-green-100' : 'bg-red-100'}`}>
              {formattedScore && formattedScore >= 70 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <h4 className={`text-sm font-medium ${formattedScore && formattedScore >= 70 ? 'text-green-700' : 'text-red-700'}`}>OVERALL ASSESSMENT</h4>
          </div>
          
          <div className={`flex items-start gap-3 p-4 rounded-lg ${formattedScore && formattedScore >= 70 ? 'bg-green-50/50 border border-green-100' : 'bg-red-50/50 border border-red-100'}`}>
            {formattedScore && formattedScore >= 70 ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">
                {recommendationDetails.recommendation 
                  ? `${recommendationDetails.recommendation}` 
                  : (formattedScore && formattedScore >= 70 
                    ? "Recommended for the position" 
                    : "Not recommended for the position")}
              </div>
              <p className="text-gray-700 mt-2">
                {overallFeedback || "Based on the interview performance, the AI has provided an assessment of the candidate's suitability for the role."}
              </p>
            </div>
          </div>
        </div>
        
        {/* Key Insights and Improvement Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Insights / Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-1 rounded">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-green-700">KEY INSIGHTS</h4>
            </div>
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100 h-full">
              <ul className="space-y-2">
                {keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="min-w-4 mt-0.5 text-green-500 flex-shrink-0">•</div>
                    <span>{typeof insight === 'string' ? insight : JSON.stringify(insight)}</span>
                  </li>
                ))}
                {keyInsights.length === 0 && (
                  <li className="text-gray-500 italic flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-gray-400 flex-shrink-0">•</div>
                    <span>No key insights highlighted</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Areas for Improvement */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-100 p-1 rounded">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium text-amber-700">AREAS FOR IMPROVEMENT</h4>
            </div>
            <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100 h-full">
              <ul className="space-y-2">
                {improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="min-w-4 mt-0.5 text-amber-500 flex-shrink-0">•</div>
                    <span>{typeof area === 'string' ? area : JSON.stringify(area)}</span>
                  </li>
                ))}
                {improvementAreas.length === 0 && (
                  <li className="text-gray-500 italic flex items-start gap-2">
                    <div className="min-w-4 mt-0.5 text-gray-400 flex-shrink-0">•</div>
                    <span>No specific improvement areas highlighted</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Recommendation Details - if available */}
        {recommendationDetails && Object.keys(recommendationDetails).length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-1 rounded">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-blue-700">RECOMMENDATION DETAILS</h4>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700 space-y-3">
              {recommendationDetails.justification && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Justification</span>
                  <p className="bg-white p-2 rounded border border-blue-50">{recommendationDetails.justification}</p>
                </div>
              )}
              {recommendationDetails.recommendation && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Recommendation</span>
                  <p className="bg-white p-2 rounded border border-blue-50">{recommendationDetails.recommendation}</p>
                </div>
              )}
              {recommendationDetails.confidenceLevel !== undefined && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Confidence Level</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-2 rounded border border-blue-50">
                      {recommendationDetails.confidenceLevel}/10
                    </div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColorClass(recommendationDetails.confidenceLevel * 10)}`}
                        style={{ width: `${recommendationDetails.confidenceLevel * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {recommendationDetails.reason && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Reason</span>
                  <p className="bg-white p-2 rounded border border-blue-50">{recommendationDetails.reason}</p>
                </div>
              )}
              {recommendationDetails.fitForRole && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Fit for Role</span>
                  <p className="bg-white p-2 rounded border border-blue-50">{recommendationDetails.fitForRole}</p>
                </div>
              )}
              {recommendationDetails.nextSteps && (
                <div className="flex flex-col">
                  <span className="font-medium text-blue-800 text-sm mb-1">Next Steps</span>
                  <p className="bg-white p-2 rounded border border-blue-50">{recommendationDetails.nextSteps}</p>
                </div>
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
  
  const numScore = Number(score);
  
  if (numScore >= 80) return 'text-green-600';
  if (numScore >= 70) return 'text-blue-600';
  if (numScore >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreBgClass(score) {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-500';
  
  const numScore = Number(score);
  
  if (numScore >= 80) return 'bg-green-100 text-green-800';
  if (numScore >= 70) return 'bg-blue-100 text-blue-800';
  if (numScore >= 60) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

function getProgressColorClass(score) {
  if (score === null || score === undefined) return 'bg-gray-300';
  
  const numScore = Number(score);
  
  if (numScore >= 80) return 'bg-green-500';
  if (numScore >= 70) return 'bg-blue-500';
  if (numScore >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}