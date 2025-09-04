import React from 'react'
import moment from 'moment'
import { Copy, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function InterviewCard({ interview }) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!', {
            description: 'You can now share the interview link.',
            duration: 2000,
        });
    }

    const goToDetails = () => {
        window.location.href = `/interview-details?id=${interview?.interview_id}`;
    }

    return (
        <section className="relative w-full h-full p-0">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200 via-white to-indigo-200 opacity-80 blur-md"></div>
            <div className="relative p-8 bg-white/90 rounded-3xl border border-gray-100 shadow-2xl hover:shadow-blue-200 transition-all duration-300 flex flex-col gap-6 backdrop-blur-xl min-h-[320px] h-full justify-between">
                <header className="flex items-center justify-between">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-white font-extrabold text-2xl drop-shadow-lg">
                            {interview?.jobPosition?.[0]?.toUpperCase() || 'I'}
                        </span>
                    </div>
                    <time className="text-xs text-gray-400 font-semibold tracking-wide" dateTime={interview?.created_at}>
                        {moment(interview?.created_at).format('DD MMM YYYY')}
                    </time>
                </header>
                <hr className="border-gray-200 my-2" />
                <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                        {interview?.jobPosition}
                    </h2>
                    <span className="inline-block text-sm text-blue-800 bg-blue-100 px-4 py-1 rounded-full font-semibold mb-2 shadow-sm">
                        {interview?.duration}
                    </span>
                </div>
                <div className="flex gap-4 w-full mt-2">
                    <Button
                        variant="outline"
                        onClick={copyLink}
                        className="flex gap-2 items-center border-gray-300 hover:border-blue-500 hover:bg-blue-100 transition font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400"
                        aria-label="Copy interview link"
                    >
                        <Copy className="w-4 h-4" /> Copy Link
                    </Button>
                    <Button
                        onClick={goToDetails}
                        className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition font-semibold shadow-md focus:ring-2 focus:ring-indigo-400"
                        aria-label="Go to interview details"
                    >
                        <Send className="w-4 h-4" /> Details
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default InterviewCard