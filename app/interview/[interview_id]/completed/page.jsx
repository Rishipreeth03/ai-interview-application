"use client"
import React from 'react'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

function InterviewCompleted() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Interview Completed!</h1>
            <p className="text-gray-600 mb-6 text-center">
                Thank you for participating in the interview.<br />
                Your responses have been recorded and will be reviewed.<br />
                You will receive feedback soon.
            </p>
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => router.push('/dashboard')}
            >
                Go to Dashboard
            </button>
        </div>
    )
}

export default InterviewCompleted