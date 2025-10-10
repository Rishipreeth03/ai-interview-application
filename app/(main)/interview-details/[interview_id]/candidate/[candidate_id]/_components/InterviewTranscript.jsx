"use client"

import { MessageSquareDiff, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function InterviewTranscript({ transcript, questionResponses }) {
  // Format transcript data if needed
  const formattedTranscript = Array.isArray(transcript) ? transcript : [];
  
  // Format question responses if needed (ensure proper structure)
  const formattedResponses = Array.isArray(questionResponses) ? questionResponses.map(qr => {
    // Ensure each question response has the expected structure
    return {
      question: qr.question || '',
      response: qr.response || qr.answer || '',
      responseQuality: qr.responseQuality || qr.quality || 0,
      feedback: qr.feedback || ''
    };
  }) : [];
  
  if (formattedTranscript.length === 0 && formattedResponses.length === 0) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-6 text-center">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-amber-800 mb-1">No Transcript Available</h3>
        <p className="text-amber-700">The interview transcript is not available for this candidate.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b p-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquareDiff className="h-5 w-5 text-gray-600" />
          Interview Transcript
        </h3>
      </div>
      
      <div className="p-6">
        {/* Question-by-Question Analysis */}
        {formattedResponses.length > 0 ? (
          <div className="space-y-8">
            {formattedResponses.map((qr, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-blue-700">
                    Q{index + 1}: {qr.question}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={getQualityBadgeClass(qr.responseQuality)}
                  >
                    {qr.responseQuality}/5
                  </Badge>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-gray-800">{qr.response}</p>
                </div>
                
                {qr.feedback && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-500 mb-1">FEEDBACK:</h5>
                    <p className="text-sm text-gray-600">{qr.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Raw Transcript
          <div className="space-y-4">
            {formattedTranscript.map((entry, index) => (
              <div key={index} className="pb-4 border-b last:border-b-0">
                <div className="font-medium mb-1 text-sm text-gray-500">
                  {entry.role === 'assistant' ? 'Interviewer:' : 'Candidate:'}
                </div>
                <p className="text-gray-800">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function for badge styling
function getQualityBadgeClass(score) {
  const numScore = Number(score)
  if (numScore >= 4) return 'bg-green-100 text-green-800 border-green-200'
  if (numScore >= 3) return 'bg-blue-100 text-blue-800 border-blue-200'
  if (numScore >= 2) return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-red-100 text-red-800 border-red-200'
}