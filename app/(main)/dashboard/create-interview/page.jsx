"use client"
import React, { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import InterviewLink from './_components/InterviewLink'
import CreateInterviewHeader from './_components/CreateInterviewHeader'
import StepIndicator from './_components/StepIndicator'
import VideoScreeningToggle from './_components/VideoScreeningToggle'
import useCreateInterview from './_components/useCreateInterview'

// Step labels for indicator - memoize to prevent recreation
const steps = [
  { label: "Details" },
  { label: "Questions" },
  { label: "Link" }
]

function CreateInterview() {
    const {
        step,
        setStep,
        formdata,
        onHandleInputChange,
        onGotoNext,
        interviewId,
        onCreateLink,
        router
    } = useCreateInterview()

    return (
        <div className='mt-10 px-2 md:px-24 lg:px-44 xl:px-56'>
            {/* Header */}
            <CreateInterviewHeader router={router} />
            {/* Step Indicator */}
            <StepIndicator steps={steps} step={step} />
            <Progress value={step * 33.33} className="my-5" />
            {/* Card container with animated transitions */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[350px] transition-all duration-500">
                {step === 1 ? (
                    <>
                        <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGotoNext} />
                        {/* Only show video screening toggle if not coming from video-enabled link */}
                        {!formdata.videoScreening && (
                            <VideoScreeningToggle
                                value={!!formdata?.videoScreening}
                                onChange={val => onHandleInputChange("videoScreening", val)}
                            />
                        )}
                    </>
                ) : step === 2 ? (
                    <QuestionList formdata={formdata} onCreateLink={onCreateLink} />
                ) : step === 3 ? (
                    <InterviewLink interviewId={interviewId} formData={formdata} />
                ) : null}
            </div>
        </div>
    )
}

export default React.memo(CreateInterview)
