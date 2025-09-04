import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Copy, Mail, Plus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

function InterviewLink({ interviewId, formData }) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interviewId
    const GetInterviewUrl = () => url

    const interviewTitle = formData?.jobPosition || "Interview Opportunity"
    const interviewDuration = formData?.duration || "30 mins"

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url)
        toast.success('Link Copied!', { description: 'You can now share it with candidates.' })
    }

    const onShareWhatsapp = () => {
        const message = encodeURIComponent(
            `You are invited to an AI-powered interview for the position of "${interviewTitle}".\n\n` +
            `Interview Duration: ${interviewDuration}\n\n` +
            `Click the link below to start your interview:\n${url}\n\n` +
            `Best of luck.`
        )
        window.open(`https://wa.me/?text=${message}`, '_blank')
    }

    const onShareEmail = () => {
        const subject = encodeURIComponent('Invitation: AI Interview for ' + interviewTitle)
        const body = encodeURIComponent(
            `Hello,\n\n` +
            `You are invited to an AI-powered interview for the position of "${interviewTitle}".\n\n` +
            `Interview Duration: ${interviewDuration}\n\n` +
            `Please click the link below to begin your interview:\n${url}\n\n` +
            `Best regards,\nAI Recruiter Team`
        )
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`,
            '_blank'
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-100 py-10">
            <div className="relative w-full max-w-lg">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 via-blue-50/70 to-indigo-100/80 backdrop-blur-lg z-0"></div>
                <div className="relative bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-100 z-10">
                    {/* Card Header */}
                    <div className="flex flex-col items-center mb-6">
                        <Image src={'/checked.png'} alt='Interview Ready' width={64} height={64} className="mb-3 drop-shadow-lg" />
                        <h2 className='font-extrabold text-3xl text-gray-900 tracking-tight mb-1'>AI Interview Ready</h2>
                        <p className='mt-1 text-gray-500 text-center text-base font-medium'>Share the link below with your candidate to start the interview.</p>
                    </div>
                    <hr className="w-full my-4 border-gray-200" />
                    {/* Interview Link Section */}
                    <div className='w-full mb-6'>
                        <div className="bg-white/90 rounded-xl shadow p-5 border border-gray-100">
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Interview Link</label>
                            <div className="flex gap-2 w-full">
                                <Input 
                                    defaultValue={GetInterviewUrl()} 
                                    disabled={true} 
                                    className="bg-gray-100 font-mono text-sm flex-1"
                                />
                                <Button 
                                    onClick={onCopyLink} 
                                    className="flex gap-2 items-center bg-primary hover:bg-primary/90 text-white transition"
                                >
                                    <Copy className="w-4 h-4" /> Copy
                                </Button>
                            </div>
                            <div className='mt-2 flex items-center gap-2 text-gray-400 text-xs'>
                                <Clock className='h-4 w-4' /> 
                                <span>{interviewDuration} Duration</span>
                            </div>
                        </div>
                    </div>
                    <hr className="w-full my-4 border-gray-200" />
                    {/* Share Section */}
                    <div className='w-full mb-6'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Share Via</label>
                        <div className='flex gap-4'>
                            <Button
                                variant="outline"
                                onClick={onShareWhatsapp}
                                className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition"
                                title="Share interview link via WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onShareEmail}
                                className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                                title="Share interview link via Email"
                            >
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Email</span>
                            </Button>
                        </div>
                    </div>
                    <hr className="w-full my-4 border-gray-200" />
                    {/* Navigation Buttons */}
                    <div className='flex w-full gap-4 justify-between mt-2'>
                        <Link href={'/dashboard'} className="w-1/2">
                            <Button variant={'outline'} className="flex gap-2 items-center w-full hover:bg-gray-100 transition">
                                <ArrowLeft /> Dashboard
                            </Button>
                        </Link>
                        <Link href={'/create-interview'} className="w-1/2">
                            <Button className="flex gap-2 items-center w-full bg-primary hover:bg-primary/90 text-white transition">
                                <Plus /> New Interview
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewLink