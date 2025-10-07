'use client'

export default function JobDescriptionSection({ interviewData, position }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
      <h3 className="font-medium text-gray-800 mb-3">Position Information</h3>
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h4 className="font-semibold text-blue-800">{interviewData?.jobPosition || position || 'Interview Position'}</h4>
      </div>
      {interviewData?.jobDescription ? (
        <div className="mt-3 bg-white rounded-md p-3 border border-blue-100">
          <h4 className="text-xs uppercase text-gray-500 mb-2 font-medium">Job Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{interviewData.jobDescription.substring(0, 300)}{interviewData.jobDescription.length > 300 ? '...' : ''}</p>
          {interviewData.jobDescription.length > 300 && (
            <p className="text-xs text-gray-500 mt-2 italic">Description has been truncated for brevity</p>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-600 mt-1">
          Please submit your application for this position. You'll receive more details about the role during the interview process.
        </div>
      )}
    </div>
  )
}
