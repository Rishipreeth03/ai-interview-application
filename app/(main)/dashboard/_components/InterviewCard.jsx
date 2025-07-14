import React from 'react'
import moment from 'moment';
import { Copy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


function InterviewCard({ interview }) {
    const copyLink = () => {
        const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;
        navigator.clipboard.writeText(url);
        toast('Link copied to clipboard!')
    }

    const onSend = () => {
        window.location.href = "mailto:accounts@mail.com?subject=Smart Persona Interview Link&body=Hi, I would like to share the interview link with you: " + process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;
    }
    return (
        <div className='p-5 bg-white rounded-lg border'>
            <div className='flex items-center justify-between'>
                <div className='h-[40px] w-[40px] bg-primary rounded-full'></div>
                <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM yyy')}</h2>
            </div>
            <h2 className='text-lg font-bold mt-3'>{interview?.jobPosition}</h2>
            <h2 className='mt-2'>{interview?.duration}</h2>
            <div className='flex gap-3 w-full mt-4'>
                <Button variant="outline" onClick={copyLink}><Copy />Copy Link</Button>
                <Button onClick={onSend}> <Send /> Send</Button>
            </div>
        </div>
    )
}

export default InterviewCard