'use client'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import CandidateDetailsHeader from './_components/CandidateDetailsHeader'
import CandidateTable from './_components/CandidateTable'
import GoogleFormGenerator from './_components/GoogleFormGenerator'
import useCandidateDetailsPage from './_components/useCandidateDetailsPage'

export default function CandidateDetailsPage() {
  const params = useParams()
  console.log('Page params:', params) // Debug log
  
  const interview_id = params?.interview_id
  console.log('Using interview_id:', interview_id) // Debug log
  
  const {
    interviewData,
    candidates,
    isLoading,
    generateGoogleForm,
    isFormGenerating,
    googleFormUrl,
    refreshCandidates,
  } = useCandidateDetailsPage(interview_id)

  return (
    <motion.div
      className="w-full py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CandidateDetailsHeader
        interviewData={interviewData}
        isLoading={isLoading}
      />
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Candidate Applications</h2>
            <p className="text-gray-500 text-sm">
              Manage and track candidates for this interview
            </p>
            {interviewData?.status === 'Started' && (
              <p className="text-amber-600 text-xs mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Interview in progress - New applications are disabled
              </p>
            )}
            {interviewData?.status === 'Ended' && (
              <p className="text-amber-600 text-xs mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Interview has ended - New applications are disabled
              </p>
            )}
          </div>
          
          <GoogleFormGenerator 
            interviewId={interview_id} 
            interviewData={interviewData}
            onGenerate={generateGoogleForm}
            isGenerating={isFormGenerating}
            googleFormUrl={googleFormUrl}
            onFormSubmitted={refreshCandidates}
            interviewStatus={interviewData?.status}
          />
        </div>
        
        <CandidateTable 
          candidates={candidates} 
          isLoading={isLoading} 
          interviewId={interview_id}
          onRefresh={refreshCandidates}
          interviewStatus={interviewData?.status}
        />
      </div>
    </motion.div>
  )
}