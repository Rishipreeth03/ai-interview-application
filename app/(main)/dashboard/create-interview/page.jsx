"use client"
import {Progress} from '@/components/ui/progress' 
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './_components/InterviewLink'
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
        <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
            <div className='flex gap-5 items-center'>
                <ArrowLeft onClick={()=>router.back()} className='cursor-pointer'/>
                <h2 className='font-bold text-2xl'>Create new Interview</h2>
            </div>
            <Progress value={step*33.33} className="my-5"/>
            {step==1?<FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGotoNext}/>
            :step==2?<QuestionList formdata={formdata} onCreateLink={(interview_id)=>onCreateLink(interview_id)}/>:
            step==3?<InterviewLink interviewId={interviewId} formData={formdata}/>:null}
        </div>
    )
}

export default CreateInterview
