'use client'

export default function ApplicationFormHeader({ interviewData, position }) {
  return (
    <div className="flex items-center border-b border-gray-200 pb-4 mb-8">
      <div className="bg-blue-600 text-white p-2 rounded-lg mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {interviewData?.jobPosition || position || 'Interview'} Application
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Complete this form to apply for the position
        </p>
      </div>
    </div>
  )
}
