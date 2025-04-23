import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Copy, Mail,Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {toast} from 'sonner'
import Link from 'next/link'
function InterviewLink({interviewId,formData}) {
    const url=process.env.NEXT_PUBLIC_HOST_URL+'/'+interviewId
    const GetInterviewUrl=()=>{
        
        return url;
    }

    const onCopyLink=async()=>{
        await navigator.clipboard.writeText(url);
        toast('Link Copied')
    }




  return (
    <div className='flex flex-col items-center justify-center mt-10'>

        <Image src={'/checked.png'} alt='succesfull checked image' width={60} height={60}/>

        <h2 className='font-bold text-lg mt-3'>Your AI Interview is Ready!</h2>
        <p className='mt-3'>Share this link with your candidates</p>
        
        <div className='w-full p-7 mt-6 rounded-xl bg-white '>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold'>
                    Interview Link
                </h2>
                <h2 className='p-1 px-2 text-primary bg-blue-50 rounded-xl'>valid for 30 Days</h2>

                
            </div>
            <div className='mt-3 flex gap-3'>
                    <Input defaultValue={GetInterviewUrl()} disabled={true}/>
                    <Button onClick={()=>onCopyLink()}><Copy/> Copy Link</Button>    
                
            </div>
            <hr className='my-5' />

            <div>
                <h2 className='text-sm text-gray-500 flex gap-1 items-center'><Clock className='h-4 w-4'/> 
                {/* 30mins */}
                {formData.duration}
                </h2>
            </div>
            </div>
            <div className='mt-7 bg-white p-5 rounded-lg w-full'>
                <h2>Share Via</h2>
                <div className='flex gap-7 mt-2'>
                {/* <Button variant={'outline'}><Mail/>Slack </Button> */}
                <Button variant={'outline'} ><Mail/>Whatsapp </Button>
                <Button variant={'outline'}><Mail/>Email </Button>
                </div>
            </div>
            <div className='flex w-full gap-5 justify-between mt-5'>
                <Link href={'/dashboard'}>
                
                <Button variant={'outline'}><ArrowLeft/> Back to Dashboard</Button>
                </Link>
                <Link href={'/create-interview'}>
                
                <Button><Plus/> Create New Interview</Button>
                </Link>
            </div>
            


       
    </div>
  )
}

export default InterviewLink
