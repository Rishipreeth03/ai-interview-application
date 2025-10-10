import { useState, useEffect } from 'react'
import { supabase } from '@/app/services/supaBaseclient'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

function useInterviewPage(interview_id, setInterviewInfo, router) {
  const searchParams = useSearchParams()
  const [interviewData, setInterviewData] = useState({})
  const [loading, setLoading] = useState(false)
  
  // Extract parameters from URL
  const nameFromUrl = searchParams.get('name') || ''
  const emailFromUrl = searchParams.get('email') || ''
  const candidateIdFromUrl = searchParams.get('candidate_id') || ''
  
  // Set state with URL parameters
  const [userName, setUserName] = useState(nameFromUrl)
  const [userEmail, setUserEmail] = useState(emailFromUrl)
  const [candidateId, setCandidateId] = useState(candidateIdFromUrl)
  
  // Track if we have URL parameters
  const [hasUrlParams] = useState(!!(nameFromUrl && emailFromUrl))

  useEffect(() => {
    if (!interview_id) {
      console.warn('No interview_id provided');
      return;
    }
    
    console.log('Interview ID received:', interview_id);
    GetInterviewDetails();
  }, [interview_id])

  const onJoinInterview = async () => {
    setLoading(true)
    try {
      console.log('Joining interview with ID:', interview_id);
      
      let { data: interviews, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('interview_id', interview_id)

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Interview join data fetched:', interviews);
      
      if (!interviews || interviews.length === 0) {
        toast.error('Interview not found');
        setLoading(false);
        return;
      }

      setInterviewInfo({
        userName: userName,
        userEmail: userEmail,
        candidateId: candidateId,
        interviewData: interviews[0],
      })
      router.push(`/interview/${interview_id}/setup`)
    } catch (error) {
      console.error('Error joining interview:', error);
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  }

  const GetInterviewDetails = async (retryCount = 0) => {
    setLoading(true)
    try {
      console.log('Fetching interview details for:', interview_id);
      
      // Log the query we're about to make for debugging
      console.log('Query:', `SELECT * FROM interviews WHERE interview_id = '${interview_id}'`);
      
      let { data: interviews, error } = await supabase
        .from('interviews')
        .select("*")
        .eq('interview_id', interview_id)
        
      if (error) {
        console.error('Supabase error details:', error);
        
        // Retry logic - attempt up to 3 retries with increasing delay
        if (retryCount < 3) {
          const delay = (retryCount + 1) * 1000; // Increase delay with each retry
          console.log(`Retrying in ${delay}ms... (Attempt ${retryCount + 1} of 3)`);
          
          setTimeout(() => {
            GetInterviewDetails(retryCount + 1);
          }, delay);
          
          return;
        }
        
        throw error;
      }
      
      console.log('Fetched interview data:', interviews);
      
      if (!interviews || interviews.length === 0) {
        console.warn('No interviews found with ID:', interview_id);
        
        // Retry logic for empty results
        if (retryCount < 3) {
          const delay = (retryCount + 1) * 1000;
          console.log(`No interview found. Retrying in ${delay}ms... (Attempt ${retryCount + 1} of 3)`);
          
          setTimeout(() => {
            GetInterviewDetails(retryCount + 1);
          }, delay);
          
          return;
        }
        
        toast.error('Interview not found');
        return;
      }
      
      setInterviewData(interviews[0]);
      toast.success('Interview details loaded');
    } catch (error) {
      console.error('Error fetching interview details:', error);
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  }

  return {
    interviewData,
    loading,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    candidateId,
    setCandidateId,
    hasUrlParams,
    onJoinInterview,
  }
}

export default useInterviewPage
