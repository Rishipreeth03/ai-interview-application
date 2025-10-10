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
      
      if (!interviewId) {
        throw new Error('Interview ID is undefined or null');
      }
      
      // Try direct table access first
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('interview_id', interviewId)
        
        if (!error && data && data.length > 0) {
          console.log('Interview data fetched (method 1):', data[0])
          setInterviewData(data[0]) // Take the first result
          return
        } else if (error) {
          console.log('Method 1 error:', error.message)
        } else if (data && data.length === 0) {
          console.log('No interview found with ID (method 1):', interviewId)
        }
      } catch (directError) {
        console.log('Direct access failed, trying fallback method:', directError)
      }
      
      // Fallback: Try with raw SQL query
      try {
        const { data, error } = await supabase
          .rpc('get_interview', { id: interviewId })
        
        if (!error && data) {
          // RPC might return a single object or an array, handle both cases
          const interviewData = Array.isArray(data) ? data[0] : data;
          
          if (interviewData) {
            console.log('Interview data fetched (method 2):', interviewData)
            setInterviewData(interviewData)
            return
          } else {
            console.log('No interview data returned from RPC (method 2)')
          }
        } else if (error) {
          console.log('Method 2 error:', error.message)
        }
      } catch (rpcError) {
        console.log('RPC method failed, trying third method:', rpcError)
      }
      
      // Third attempt: Try with the SQL query directly but without .single()
      const { data: sqlData, error: sqlError } = await supabase
        .from('interviews')
        .select('*')
        .eq('interview_id', interviewId)
      
      if (sqlError) {
        console.log('Method 3 error:', sqlError.message)
        throw new Error(`All methods failed to fetch interview data: ${sqlError.message}`)
      }
      
      // Check if we got any results
      if (sqlData && sqlData.length > 0) {
        console.log('Interview data fetched (method 3):', sqlData[0])
        setInterviewData(sqlData[0]) // Take the first result
      } else {
        console.log('No interview data found with ID:', interviewId)
        throw new Error(`No interview found with ID: ${interviewId}`)
      }
    } catch (error) {
      console.error('Error fetching interview data:', error.message || JSON.stringify(error))
      toast.error('Failed to load interview details')
    }
  }

  const fetchCandidates = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching candidates for interview ID:', interviewId)
      
      if (!interviewId) {
        throw new Error('Interview ID is undefined or null');
      }
      
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
        } else {
          console.log('Method 1 error:', error.message)
        }
      } catch (directError) {
        console.log('Direct access to interview-feedback failed, trying alternative method:', directError)
      }
      
      // Try alternative syntax (SQL-style filter)
      const { data, error } = await supabase
        .from('interview-feedback')
        .select('*')
        .filter('interview_id', 'eq', interviewId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.log('Method 2 error:', error.message)
        throw new Error(`Failed to fetch candidates: ${error.message}`)
      }
      
      console.log('Candidates fetched (method 2):', data?.length || 0)
      setCandidates(data || [])
    } catch (error) {
      console.error('Error fetching candidates:', error.message || JSON.stringify(error))
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