"use client"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import CandidateReportHeader from './_components/CandidateReportHeader'
import InterviewFeedback from './_components/InterviewFeedback'
import CandidateDecisionPanel from './_components/CandidateDecisionPanel'
import TechnicalAssessment from './_components/TechnicalAssessment'
import CommunicationSkills from './_components/CommunicationSkills'
import ProblemSolvingAssessment from './_components/ProblemSolvingAssessment'
import InterviewTranscript from './_components/InterviewTranscript'
import useCandidateReport from './_components/useCandidateReport'
import SonnerProvider from './_components/SonnerProvider'
import { AlertCircle } from 'lucide-react'

export default function CandidateReportPage() {
  const { interview_id, candidate_id } = useParams()
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  
  const {
    candidate,
    candidateData,
    interviewData,
    parsedConversation,
    isLoading,
    error,
    updateCandidateStatus,
    getBadgeColor
  } = useCandidateReport({ interviewId: interview_id, candidateId: candidate_id })

  const handleStatusChange = async (status, notes) => {
    try {
      setUpdating(true)
      await updateCandidateStatus(status === 'accept' ? 'approved' : 'rejected', notes)
      toast(`Candidate ${status === 'accept' ? 'approved' : 'rejected'} successfully`, {
        description: `The candidate's status has been updated.`,
        duration: 5000,
        type: status === 'accept' ? 'success' : 'default',
      })
    } catch (error) {
      console.error('Error updating candidate status:', error)
      toast('Failed to update candidate status', {
        description: error.message || 'An unknown error occurred',
        duration: 5000,
        type: 'error',
      })
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-6 max-w-6xl space-y-6">
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Candidate Report</h3>
            <p className="text-red-600">{error.message || "Failed to load candidate data. Please try again later."}</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Get feedback data from candidate data
  const feedbackData = candidateData?.feedback || {}
  const questionResponses = feedbackData.questionResponses || []
  
  return (
    <div className="container py-6 max-w-6xl space-y-6">
      <SonnerProvider />
      <CandidateReportHeader 
        candidate={candidate} 
        interviewData={interviewData}
      />
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="problem-solving">Problem Solving</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            
            {/* Summary Tab */}
            <TabsContent value="summary" className="mt-0">
              <InterviewFeedback 
                feedbackData={feedbackData}
                aiScore={candidateData?.ai_score}
                problemSolvingScore={candidateData?.problem_solving_score}
              />
            </TabsContent>
            
            {/* Technical Tab */}
            <TabsContent value="technical" className="mt-0">
              <TechnicalAssessment 
                technicalEvaluation={feedbackData?.technicalEvaluation}
                score={candidateData?.technical_score}
              />
            </TabsContent>
            
            {/* Communication Tab */}
            <TabsContent value="communication" className="mt-0">
              <CommunicationSkills 
                communicationEvaluation={feedbackData?.communicationEvaluation}
                score={candidateData?.communication_score}
              />
            </TabsContent>
            
            {/* Problem Solving Tab */}
            <TabsContent value="problem-solving" className="mt-0">
              <ProblemSolvingAssessment 
                problemSolvingEvaluation={feedbackData?.problemSolvingEvaluation}
                score={candidateData?.problem_solving_score}
              />
            </TabsContent>
            
            {/* Transcript Tab */}
            <TabsContent value="transcript" className="mt-0">
              <InterviewTranscript 
                transcript={parsedConversation}
                questionResponses={questionResponses}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <CandidateDecisionPanel 
            candidateId={candidate_id}
            candidateName={candidate?.name || 'Candidate'}
            currentStatus={candidateData?.review_status}
            onUpdateStatus={handleStatusChange}
            isLoading={updating}
            aiRecommendation={candidateData?.ai_score >= 70}
          />
        </div>
      </div>
    </div>
  )
}