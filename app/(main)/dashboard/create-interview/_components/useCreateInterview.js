import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import moment from 'moment'

function useCreateInterview() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    
    // Initialize formdata with default values
    const [formdata, setformdata] = useState({
        difficulty_level: 'medium',
        // Set default start_at to 1 hour from now, rounded to next 15 min interval
        start_at: moment().add(1, 'hour').startOf('hour').toISOString(),
        // Set default end_at to 2 hours from now, rounded to next 15 min interval
        end_at: moment().add(2, 'hours').startOf('hour').toISOString()
    })
    const [interviewId, setinterviewId] = useState()

    const onHandleInputChange = (field, value) => {
        setformdata(prev => {
            // Special handling for date fields to ensure end_at is after start_at
            if (field === 'start_at') {
                // If updating start_at, check if it's after current end_at
                // If so, adjust end_at to be 1 hour after new start_at
                const newStartAt = moment(value);
                const currentEndAt = moment(prev.end_at);
                
                if (newStartAt.isAfter(currentEndAt) || newStartAt.isSame(currentEndAt)) {
                    return {
                        ...prev,
                        [field]: value,
                        end_at: moment(value).add(1, 'hour').toISOString()
                    }
                }
            } else if (field === 'end_at') {
                // If updating end_at, ensure it's after start_at
                const currentStartAt = moment(prev.start_at);
                const newEndAt = moment(value);
                
                if (newEndAt.isBefore(currentStartAt) || newEndAt.isSame(currentStartAt)) {
                    toast.warning('End time must be after start time');
                    return prev;
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
        
        if (!startTime.isValid() || !endTime.isValid()) {
            toast.error('Invalid date format')
            return
        }
        
        if (endTime.isSameOrBefore(startTime)) {
            toast.error('End time must be after start time')
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
