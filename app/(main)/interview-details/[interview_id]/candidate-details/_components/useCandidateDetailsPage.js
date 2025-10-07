import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/app/services/supaBaseclient'

export default function useCandidateDetailsPage(interviewId) {
  const [interviewData, setInterviewData] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormGenerating, setIsFormGenerating] = useState(false)
  const [googleFormUrl, setGoogleFormUrl] = useState('')

  useEffect(() => {
    if (!interviewId) return
    
    fetchInterviewData()
    fetchCandidates()
  }, [interviewId])

  const fetchInterviewData = async () => {
    try {
      console.log('Fetching interview data for ID:', interviewId)
      
      // Try direct table access first
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('interview_id', interviewId)
          .single()
        
        if (!error && data) {
          console.log('Interview data fetched (method 1):', data)
          setInterviewData(data)
          return
        }
      } catch (directError) {
        console.log('Direct access failed, trying fallback method')
      }
      
      // Fallback: Try with raw SQL query
      const { data, error } = await supabase
        .rpc('get_interview', { id: interviewId })
        .single()
      
      if (error) {
        // Third attempt: Try with the SQL query directly
        const { data: sqlData, error: sqlError } = await supabase
          .from('interviews')
          .select('*')
          .filter('interview_id', 'eq', interviewId)
          .single()
        
        if (sqlError) {
          throw sqlError
        }
        
        setInterviewData(sqlData)
        return
      }
      
      console.log('Interview data fetched (method 2):', data)
      setInterviewData(data)
    } catch (error) {
      console.error('Error fetching interview data:', error)
      toast.error('Failed to load interview details')
    }
  }

  const fetchCandidates = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching candidates for interview ID:', interviewId)
      
      // Try direct table access first
      try {
        const { data, error } = await supabase
          .from('interview-feedback')
          .select('*')
          .eq('interview_id', interviewId)
          .order('created_at', { ascending: false })
        
        if (!error) {
          console.log('Candidates fetched (method 1):', data?.length || 0)
          setCandidates(data || [])
          return
        }
      } catch (directError) {
        console.log('Direct access to interview-feedback failed, trying alternative method')
      }
      
      // Try alternative syntax (SQL-style filter)
      const { data, error } = await supabase
        .from('interview-feedback')
        .select('*')
        .filter('interview_id', 'eq', interviewId)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      console.log('Candidates fetched (method 2):', data?.length || 0)
      setCandidates(data || [])
    } catch (error) {
      console.error('Error fetching candidates:', error)
      toast.error('Failed to load candidates')
    } finally {
      setIsLoading(false)
    }
  }

  const generateGoogleForm = async () => {
    if (!interviewData) {
      toast.error('Interview details not available')
      return
    }
    
    setIsFormGenerating(true)
    
    try {
      // Generate a form URL that points to our internal form page
      // Get the current origin for the URL
      const origin = window.location.origin
      
      // Create the URL for our form page outside the (main) layout
      const formUrl = `${origin}/application-form/${interviewId}?position=${encodeURIComponent(interviewData.jobPosition || 'Interview')}`
      
      // Store the form URL in the database for tracking (optional)
      // For now, we'll just set it in state
      setGoogleFormUrl(formUrl)
      
      toast.success('Application form generated successfully!')
    } catch (error) {
      console.error('Error generating application form:', error)
      toast.error('Failed to generate application form')
    } finally {
      setIsFormGenerating(false)
    }
  }

  const refreshCandidates = () => {
    fetchCandidates()
  }

  return {
    interviewData,
    candidates,
    isLoading,
    generateGoogleForm,
    isFormGenerating,
    googleFormUrl,
    refreshCandidates,
  }
}