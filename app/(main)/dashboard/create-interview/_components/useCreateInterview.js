import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import moment from 'moment'

function useCreateInterview() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [step, setStep] = useState(1)
    
    // Check for video parameter in URL
    const videoEnabled = useMemo(() => {
        return searchParams.get('video') === 'enabled'
    }, [searchParams])
    
    // Initialize formdata with default values and optimized date handling
    const [formdata, setformdata] = useState({
        difficulty_level: 'medium',
        // Set default start_at to next hour rounded to 15 min interval
        start_at: moment().add(1, 'hour').minute(Math.ceil(moment().minute() / 15) * 15).second(0).toISOString(),
        // Set default end_at to 1 hour after start time
        end_at: moment().add(2, 'hour').minute(Math.ceil(moment().minute() / 15) * 15).second(0).toISOString(),
        // Set videoScreening based on URL parameter
        videoScreening: videoEnabled,
        // Default values for new fields based on schema constraints
        interview_type: 'private',
        number_of_interviews: 1
    })
    const [interviewId, setinterviewId] = useState()

    const onHandleInputChange = (field, value) => {
        setformdata(prev => {
            // Special handling for date fields to ensure end_at is after start_at
            if (field === 'start_at') {
                // Normalize the date-time to 15-minute intervals
                const newStartAt = moment(value).minute(Math.ceil(moment(value).minute() / 15) * 15).second(0);
                const currentEndAt = moment(prev.end_at);
                
                // Always ensure end time is at least 30 minutes after start time
                const minEndTime = moment(newStartAt).add(30, 'minutes');
                
                // If current end time is before or same as new start time + 30min, adjust it
                // but don't show toast warning here - wait until form submission
                if (currentEndAt.isBefore(minEndTime) || currentEndAt.isSame(minEndTime)) {
                    return {
                        ...prev,
                        [field]: newStartAt.toISOString(),
                        end_at: minEndTime.toISOString()
                    }
                }
                
                // Otherwise just update start time with normalized value
                return {
                    ...prev,
                    [field]: newStartAt.toISOString()
                }
            } else if (field === 'end_at') {
                // Normalize the end time to 15-minute intervals
                const newEndAt = moment(value).minute(Math.ceil(moment(value).minute() / 15) * 15).second(0);
                const currentStartAt = moment(prev.start_at);
                
                // Store the normalized value - we'll validate during form submission
                // instead of showing toast warnings on every change
                return {
                    ...prev,
                    [field]: newEndAt.toISOString()
                }
            }
            
            // Regular field update
            return {
                ...prev,
                [field]: value
            };
        });
    }

    const onGotoNext = () => {
        // Check for required fields
        if (!formdata?.jobPosition) {
            toast.error('Please enter a Job Position')
            return
        }
        
        if (!formdata?.jobDescription) {
            toast.error('Please enter a Job Description')
            return
        }
        
        if (!formdata.duration) {
            toast.error('Please select an Interview Duration')
            return
        }
        
        // Check for interview type
        if (!formdata.type || (Array.isArray(formdata.type) && formdata.type.length === 0)) {
            toast.error('Please select at least one Interview Type')
            return
        }
        
        // Validate scheduling fields
        if (!formdata.start_at) {
            toast.error('Please select an interview start time')
            return
        }
        
        if (!formdata.end_at) {
            toast.error('Please select an interview end time')
            return
        }
        
        // Validate that end_at is after start_at
        const startTime = moment(formdata.start_at);
        const endTime = moment(formdata.end_at);
        const currentTime = moment();
        
        if (!startTime.isValid() || !endTime.isValid()) {
            toast.error('Invalid date format')
            return
        }
        
        // Check if start time is in the past
        if (startTime.isBefore(currentTime)) {
            toast.error('Interview start time cannot be in the past')
            return
        }
        
        // Check if end time is at least 30 minutes after start time
        if (endTime.diff(startTime, 'minutes') < 30) {
            toast.error('End time must be at least 30 minutes after start time')
            return
        }
        
        if (endTime.isSameOrBefore(startTime)) {
            toast.error('End time must be after start time')
            return
        }
        
        // Validate interview_type
        if (!formdata.interview_type || !['public', 'private'].includes(formdata.interview_type)) {
            toast.error('Please select a valid interview type (public or private)')
            return
        }
        
        // Validate number_of_interviews
        if (!formdata.number_of_interviews || formdata.number_of_interviews < 1) {
            toast.error('Number of interviews must be at least 1')
            return
        }
        
        // Ensure difficulty_level is always set
        if (!formdata.difficulty_level) {
            setformdata(prev => ({
                ...prev,
                difficulty_level: 'medium'
            }))
        }
        
        console.log("Form data being passed to next step:", formdata);
        setStep(step + 1)
    }

    const onCreateLink = (interview_id) => {
        setinterviewId(interview_id)
        setStep(step + 1)
    }

    return {
        step,
        setStep,
        formdata,
        onHandleInputChange,
        onGotoNext,
        interviewId,
        onCreateLink,
        router
    }
}

export default useCreateInterview
