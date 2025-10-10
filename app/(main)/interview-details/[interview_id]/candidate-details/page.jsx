'use client'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import CandidateDetailsHeader from './_components/CandidateDetailsHeader'
import CandidateTable from './_components/CandidateTable'
import GoogleFormGenerator from './_components/GoogleFormGenerator'
import useCandidateDetailsPage from './_components/useCandidateDetailsPage'
import { Calendar } from 'lucide-react'

export default function CandidateDetailsPage() {
  const params = useParams()
  const interview_id = params?.interview_id
  
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
      className="w-full py-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorative elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      <div className="fixed bottom-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0px, 0px); }
          33% { transform: scale(1.1) translate(30px, -50px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
      
      <CandidateDetailsHeader
        interviewData={interviewData}
        isLoading={isLoading}
      />
      
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100/50 p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="relative z-10">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-700 mb-2">
                Candidate Applications
              </h2>
              <p className="text-gray-600 text-base max-w-md">
                Review, manage and track candidates that have applied for this interview position
              </p>
              {interviewData?.status === 'Started' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-3 shadow-sm">
                  <p className="text-amber-700 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span className="font-medium">Interview in progress</span> - New applications are currently disabled
                  </p>
                </div>
              )}
              {interviewData?.status === 'Ended' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-3 shadow-sm">
                  <p className="text-amber-700 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span className="font-medium">Interview has ended</span> - New applications are no longer accepted
                  </p>
                </div>
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
          </motion.div>
        
        <CandidateTable 
          candidates={candidates} 
          isLoading={isLoading} 
          interviewId={interview_id}
          onRefresh={refreshCandidates}
          interviewStatus={interviewData?.status}
        />
        </div>
      </div>
    </motion.div>
  )
}