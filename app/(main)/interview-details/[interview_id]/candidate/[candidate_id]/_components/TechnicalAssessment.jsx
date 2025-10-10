"use client"

import { Code, AlertCircle, Star as StarIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function TechnicalAssessment({ technicalEvaluation, score }) {
  const technicalScore = score ? Math.round(score) : (technicalEvaluation?.score || null);
  
  // Handle the updated structure - technicalEvaluation might be an object now with skills array inside
  const technicalSkills = technicalEvaluation?.skills || [];
  const overallFeedback = technicalEvaluation?.analysis || technicalEvaluation?.overallAssessment || '';
  const codeQuality = technicalEvaluation?.codeQuality || '';
  
  if ((!technicalSkills || !Array.isArray(technicalSkills) || technicalSkills.length === 0) && technicalScore === null) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-b p-4 md:p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-800">
            <div className="bg-purple-100 p-1.5 rounded-md">
              <Code className="h-5 w-5 text-purple-600" />
            </div>
            Technical Skills Assessment
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No Technical Assessment Available</h3>
          <p className="text-amber-700 max-w-md text-center">The technical skills assessment data is not available for this candidate.</p>
        </div>
      </div>
    )
  }
  
  // If we have a score but no detailed technical skills, create a basic skill object
  const skills = technicalSkills && Array.isArray(technicalSkills) && technicalSkills.length > 0
    ? technicalSkills
    : technicalScore !== null 
      ? [{ 
          name: "Technical Skills", 
          score: technicalScore / 10,
          feedback: "Overall assessment of technical capabilities based on interview responses."
        }] 
      : []

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-b p-4 md:p-5">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-800">
          <div className="bg-purple-100 p-1.5 rounded-md">
            <Code className="h-5 w-5 text-purple-600" />
          </div>
          Technical Skills Assessment
        </h3>
      </div>
      
      <div className="p-4 md:p-6">
        {technicalScore !== null && (
          <div className="mb-6 bg-slate-50/80 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="font-medium flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                <span>Overall Technical Score</span>
              </div>
              <div className={`font-semibold py-1 px-3 rounded-full ${getScoreBgClass(technicalScore / 10)}`}>
                {technicalScore > 10 ? `${technicalScore}%` : `${technicalScore}/10`}
              </div>
            </div>
            
            {/* Visual score indicator */}
            <div className="mt-3">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColorClass(technicalScore)}`}
                  style={{ width: `${technicalScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {skills.length > 0 && (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Code className="h-4 w-4 text-purple-500" />
                    {skill.name}
                  </h4>
                  {typeof skill.score === 'number' && (
                    <div className={`font-semibold text-sm py-1 px-2.5 rounded-lg ${getScoreBgClass(skill.score)}`}>
                      {skill.score}/10
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                  {skill.feedback || 'No specific feedback provided for this skill.'}
                </div>
                
                {/* Mini progress indicator */}
                {typeof skill.score === 'number' && (
                  <div className="mt-3 w-full">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={getProgressColorClass(skill.score * 10)}
                        style={{ width: `${skill.score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {skill.codeEvaluation && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium text-sm mb-2 text-purple-700 flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5" />
                      Code Evaluation:
                    </h5>
                    <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                      {skill.codeEvaluation}
                    </div>
                  </div>
                )}
                
                {skill.recommendations && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-medium text-sm mb-2 text-blue-700 flex items-center gap-1.5">
                      <StarIcon className="h-3.5 w-3.5" />
                      Recommendations:
                    </h5>
                    <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md">
                      {skill.recommendations}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Overall technical assessment */}
        {overallFeedback && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-100 p-1 rounded">
                <Code className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-purple-700">OVERALL TECHNICAL ASSESSMENT</h4>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 text-gray-700">
              {overallFeedback}
            </div>
          </div>
        )}
        
        {/* Code quality assessment */}
        {codeQuality && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-1 rounded">
                <Code className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-blue-700">CODE QUALITY ASSESSMENT</h4>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-700">
              {codeQuality}
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