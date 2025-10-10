import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Copy, Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import moment from 'moment'

function InterviewLink({ interviewId, formData }) {
    // Use window.location to construct a proper URL that will work in all environments
    const baseUrl = typeof window !== 'undefined' ? 
        `${window.location.protocol}//${window.location.host}` : 
        process.env.NEXT_PUBLIC_HOST_URL || '';
    
    const url = `${baseUrl}/interview/${interviewId}`
    console.log("Generated interview URL:", url);
    
    const GetInterviewUrl = () => url

    const interviewTitle = formData?.jobPosition || "Interview Opportunity"
    const interviewDuration = formData?.duration || "30 mins"
    
    // Format dates for display
    const startDate = formData?.start_at ? moment(formData.start_at).format('MMM DD, YYYY [at] h:mm A') : "Not specified"
    const endDate = formData?.end_at ? moment(formData.end_at).format('MMM DD, YYYY [at] h:mm A') : "Not specified"
    const isScheduled = formData?.start_at && formData?.end_at

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url)
        toast.success('Link Copied!', { description: 'You can now share it with candidates.' })
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
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Link</label>
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
                            <div className='mt-2 space-y-1'>
                                <div className='flex items-center gap-2 text-gray-500 text-xs'>
                                    <Clock className='h-4 w-4' /> 
                                    <span>{interviewDuration} Duration</span>
                                </div>
                                
                                {isScheduled && (
                                    <div className='flex items-center gap-2 text-gray-500 text-xs'>
                                        <Calendar className='h-4 w-4' />
                                        <span>Available from {startDate} to {endDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr className="w-full my-4 border-gray-200" />
                    {/* Interview Details Link */}
                    <div className='w-full mb-6'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interview Details</label>
                        <div className='flex gap-4'>
                            <Link href={`/interview-details/${interviewId}`} className="w-full">
                                <Button
                                    variant="outline"
                                    className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition w-full"
                                    title="View Interview Details"
                                >
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">View Interview Details</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <hr className="w-full my-4 border-gray-200" />
                    {/* Navigation Buttons */}
                    <div className='flex w-full gap-4 justify-between mt-2'>
                        <Link href={'/dashboard'} className="w-1/3">
                            <Button variant={'outline'} className="flex gap-2 items-center w-full hover:bg-gray-100 transition">
                                <ArrowLeft /> Dashboard
                            </Button>
                        </Link>
                        <Link href={`/interview-details/${interviewId}`} className="w-1/3">
                            <Button className="flex gap-2 items-center w-full bg-purple-600 hover:bg-purple-700 text-white transition">
                                <Calendar className="w-4 h-4" /> Details
                            </Button>
                        </Link>
                        <Link href={'/dashboard/create-interview'} className="w-1/3">
                            <Button className="flex gap-2 items-center w-full bg-primary hover:bg-primary/90 text-white transition">
                                <Plus /> New
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewLink