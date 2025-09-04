"use client"
import {Progress} from '@/components/ui/progress' 
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './_components/InterviewLink'

// Step labels for indicator
const steps = [
  { label: "Details" },
  { label: "Questions" },
  { label: "Link" }
]

function CreateInterview() {
    const router = useRouter()
    const [step,setStep]=useState(1);
    const [formdata,setformdata]=useState();
    const [interviewId,setinterviewId]=useState();

    const onHandleInputChange=(field,value)=>{
        setformdata(prev=>({
            ...prev,
            [field]:value
        }));
        console.log("FormData:",formdata);
    }

    const onGotoNext=()=>{
        if(!formdata?.jobPosition||!formdata?.jobDescription||!formdata.duration||!formdata.type){
            toast('Please enter all details')
            return;
        }
        setStep(step+1);
    }

    const onCreateLink=(interview_id)=>{
        setinterviewId(interview_id);
        setStep(step+1);
    }

    return (
        <div className='mt-10 px-2 md:px-24 lg:px-44 xl:px-56'>
            {/* Header */}
            <div className='flex gap-5 items-center mb-6'>
                <ArrowLeft onClick={()=>router.back()} className='cursor-pointer hover:text-blue-600 transition'/>
                <h2 className='font-bold text-2xl'>Create new Interview</h2>
            </div>
            {/* Step Indicator */}
            <div className="flex justify-center gap-4 mb-4">
                {steps.map((s, idx) => (
                    <div key={s.label} className={`flex flex-col items-center`}>
                        <span className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white
                            ${step === idx+1 ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'}
                            transition-all duration-300`}>
                            {idx+1}
                        </span>
                        <span className={`mt-2 text-xs ${step === idx+1 ? 'font-semibold text-blue-700' : 'text-gray-500'}`}>
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
            <Progress value={step*33.33} className="my-5"/>
            {/* Card container with animated transitions */}
            <div className="bg-white rounded-xl shadow-lg p-6 min-h-[350px] transition-all duration-500">
                {step==1?
                    <>
                        <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGotoNext}/>
                        <div className="mt-6 flex items-center gap-3">
                            <label className="font-medium text-gray-700">Enable Video Screening:</label>
                            <input
                                type="checkbox"
                                checked={!!formdata?.videoScreening}
                                onChange={e => onHandleInputChange("videoScreening", e.target.checked)}
                                className="w-5 h-5 accent-blue-600"
                            />
                        </div>
                    </>
                :step==2?
                    <QuestionList formdata={formdata} onCreateLink={onCreateLink}/>
                :step==3?
                    <InterviewLink interviewId={interviewId} formData={formdata}/>
                :null}
            </div>
        </div>
    )
}

export default CreateInterview
