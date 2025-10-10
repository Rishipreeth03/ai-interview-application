"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/app/services/supaBaseclient'

export default function useCandidateReport({ interviewId, candidateId }) {
  const [candidate, setCandidate] = useState(null)
  const [candidateData, setCandidateData] = useState(null)
  const [interviewData, setInterviewData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch candidate and interview data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("Fetching candidate data for:", { interviewId, candidateId })
        
        // Fetch the candidate data from interview-feedback table
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('interview-feedback')
          .select('*')
          .eq('candidate_id', candidateId)
          .eq('interview_id', interviewId)
          .single()
        
        if (feedbackError) {
          console.error("Feedback error:", feedbackError)
          throw new Error(`Failed to fetch candidate data: ${feedbackError.message}`)
        }
        
        // Fetch the interview details
        const { data: interviewDetails, error: interviewError } = await supabase
          .from('interviews')
          .select('*')
          .eq('interview_id', interviewId)
          .single()
        
        if (interviewError) {
          throw new Error(`Failed to fetch interview details: ${interviewError.message}`)
        }
        
        // Set the data
        setCandidateData(feedbackData)
        setInterviewData(interviewDetails)
        
        // Create a candidate object with combined information
        setCandidate({
          id: feedbackData.candidate_id,
          name: feedbackData.userName || 'Anonymous Candidate',
          email: feedbackData.userEmail,
          status: feedbackData.review_status || 'pending',
          appliedAt: feedbackData.created_at,
          completedAt: feedbackData.completed_at,
          updatedAt: feedbackData.updated_at,
          interviewScore: feedbackData.ai_score,
          technicalScore: feedbackData.technical_score,
          communicationScore: feedbackData.communication_score,
          problemSolvingScore: feedbackData.problem_solving_score,
          responseQualityAvg: feedbackData.response_quality_avg,
          candidateFeedbackScore: feedbackData.candidate_feedback_score,
          recommended: feedbackData.recommended
        })
        
      } catch (err) {
        console.error('Error fetching candidate report data:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (interviewId && candidateId) {
      fetchData()
    }
  }, [interviewId, candidateId])
  
  // Function to update candidate status (approve/reject)
  const updateCandidateStatus = async (status, notes = "") => {
    try {
      console.log("Updating status to:", status, "with notes:", notes);
      
      // Update the candidate status in the database
      const { error: updateError } = await supabase
        .from('interview-feedback')
        .update({ 
          review_status: status,
          // Store the notes in the feedback JSON - create nested structure if needed
          feedback: candidateData?.feedback 
            ? { 
                ...candidateData.feedback, 
                reviewNotes: notes,
                reviewedAt: new Date().toISOString()
              } 
            : { 
                reviewNotes: notes,
                reviewedAt: new Date().toISOString()
              },
          updated_at: new Date().toISOString()
        })
        .eq('candidate_id', candidateId)
        .eq('interview_id', interviewId)
      
      if (updateError) {
        throw new Error(`Failed to update candidate status: ${updateError.message}`)
      }
      
      // Update local state
      setCandidate(prev => ({ ...prev, status }))
      setCandidateData(prev => ({ ...prev, review_status: status, review_notes: notes }))
      
      return true
    } catch (error) {
      console.error('Error updating candidate status:', error)
      throw error
    }
  }
  
  // Parse conversation JSON if available
  const parsedConversation = candidateData?.interview_conversation 
    ? (typeof candidateData.interview_conversation === 'string'
        ? JSON.parse(candidateData.interview_conversation)
        : candidateData.interview_conversation)
    : []
    
  // Get score for badge/progress color
  const getBadgeColor = (score) => {
    if (score >= 80) return 'green'
    if (score >= 70) return 'blue'
    if (score >= 60) return 'amber'
    return 'red'
  }
  
  return {
    candidate,
    candidateData,
    interviewData,
    parsedConversation,
    isLoading,
    error,
    updateCandidateStatus,
    getBadgeColor
  }
}