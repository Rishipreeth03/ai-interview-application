import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function useCreateInterview() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formdata, setformdata] = useState()
    const [interviewId, setinterviewId] = useState()

    const onHandleInputChange = (field, value) => {
        setformdata(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const onGotoNext = () => {
        if (!formdata?.jobPosition || !formdata?.jobDescription || !formdata.duration || !formdata.type) {
            toast('Please enter all details')
            return
        }
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
