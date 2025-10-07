'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/app/services/supaBaseclient'
import { toast } from 'sonner'

export default function useApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { interview_id } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  const [error, setError] = useState(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [submissionAttempts, setSubmissionAttempts] = useState(0)
  const [formState, setFormState] = useState('idle')

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  const [fieldTouched, setFieldTouched] = useState({ name: false, email: false })

  const position = searchParams?.get('position') || 'Interview'

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
  }

  const validateInterviewId = (id) => {
    return /^[a-zA-Z0-9-_]+$/.test(id);
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name is too short';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const saveFormState = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`application_form_${interview_id}`, JSON.stringify({
        name,
        email,
        consent,
        lastUpdated: new Date().toISOString(),
      }))
    }
  }

  const handleBlur = (field) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, field === 'name' ? name : email)
    saveFormState()
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && interview_id) {
      const savedState = sessionStorage.getItem(`application_form_${interview_id}`)
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          setName(parsedState.name || '')
          setEmail(parsedState.email || '')
          setConsent(parsedState.consent || false)
        } catch (e) {
          console.error('Error restoring form state:', e)
        }
      }
    }
  }, [interview_id])

  useEffect(() => {
    if (!interview_id) {
      setError('No interview ID provided')
      setIsLoading(false)
      return
    }
    if (!validateInterviewId(interview_id)) {
      setError('Invalid interview ID format')
      setIsLoading(false)
      return
    }
    const fetchInterviewData = async () => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('interview_id', interview_id)
          .single()
        if (error) throw error
        setInterviewData(data)
        if (!data) {
          setError('Invalid interview ID')
          return
        }
        // Check interview status
        if (data.status === 'Started') {
          setError('This interview is currently in progress and not accepting new applications')
          return
        }
        if (data.status === 'Ended') {
          setError('This interview has ended and is no longer accepting applications')
          return
        }
        const { data: existingApplication, error: existingError } = await supabase
          .from('interview-feedback')
          .select('id')
          .eq('interview_id', interview_id)
          .limit(1)
        if (existingError) {
          console.error('Error checking existing applications:', existingError)
        } else if (existingApplication && existingApplication.length > 0) {
          // Log for debugging
        }
      } catch (err) {
        setError('Could not load interview details')
      } finally {
        setIsLoading(false)
      }
    }
    fetchInterviewData()
  }, [interview_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || formState === 'submitting') return
    setSubmissionAttempts((prev) => prev + 1)
    if (submissionAttempts >= 3) {
      toast.error('Too many submission attempts. Please try again later.')
      setTimeout(() => setSubmissionAttempts(0), 30000)
      return
    }
    setFormState('validating')
    let isValid = true
    isValid = validateField('name', name) && isValid
    isValid = validateField('email', email) && isValid
    if (!consent) {
      setErrors((prev) => ({ ...prev, consent: 'You must provide consent to proceed' }))
      isValid = false
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.consent
        return newErrors
      })
    }
    setFieldTouched({ name: true, email: true })
    if (!isValid) {
      setFormState('error')
      toast.error('Please correct the errors before submitting')
      return
    }
    setIsSubmitting(true)
    setFormState('submitting')
    const normalizedEmail = normalizeEmail(email)
    try {
      const timestamp = new Date().toISOString()
      const recordData = {
        interview_id,
        userName: name.trim(),
        userEmail: normalizedEmail,
        completed: false,
        review_status: 'pending',
        feedback: null,
        recommended: null,
        ai_score: null,
        technical_score: null,
        communication_score: null,
        problem_solving_score: null,
        response_quality_avg: null,
        candidate_feedback_score: null,
        created_at: timestamp,
      }
      const { data: existingRecord, error: checkError } = await supabase
        .from('interview-feedback')
        .select('id')
        .eq('interview_id', interview_id)
        .eq('userEmail', normalizedEmail)
        .maybeSingle()
      if (checkError) {
        // Log error
      } else if (existingRecord) {
        toast.error('An application has already been submitted for this interview')
        setAlreadyApplied(true)
        setFormState('error')
        setIsSubmitting(false)
        return
      }
      const { error: insertError } = await supabase
        .from('interview-feedback')
        .insert([recordData])
      if (insertError) {
        setFormState('error')
        setIsSubmitting(false)
        toast.error('Failed to submit application. Please check your information and try again.')
        return
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`application_form_${interview_id}`)
      }
      setFormState('success')
      toast.success('Application submitted successfully!')
      setTimeout(() => {
        router.push(`/application-success`)
      }, 800)
    } catch (err) {
      setFormState('error')
      setIsSubmitting(false)
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  return {
    interviewData,
    position,
    isLoading,
    error,
    alreadyApplied,
    isSubmitting,
    name,
    setName,
    email,
    setEmail,
    consent,
    setConsent,
    errors,
    fieldTouched,
    handleBlur,
    handleSubmit,
  }
}
