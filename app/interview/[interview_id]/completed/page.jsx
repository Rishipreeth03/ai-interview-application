"use client"
import React from 'react'
import { CheckCircle, BarChart2, UserCircle2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from "framer-motion"

function InterviewCompleted() {
    const router = useRouter()
    const { interview_id } = useParams()

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-100"
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <motion.div
                className="bg-white rounded-3xl shadow-2xl border border-indigo-100 p-10 flex flex-col items-center max-w-lg w-full"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <CheckCircle className="text-green-500 w-20 h-20 mb-4 drop-shadow-lg" />
                <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight">Interview Completed!</h1>
                <p className="text-gray-600 mb-6 text-center text-base">
                    Thank you for participating in the interview.<br />
                    Your responses have been recorded and will be reviewed.<br />
                    You will receive feedback soon.
                </p>
                <div className="w-full bg-indigo-50 rounded-xl p-6 mb-6 shadow flex flex-col items-center border border-indigo-100">
                    <UserCircle2 className="w-10 h-10 text-blue-500 mb-2" />
                    <span className="font-bold text-lg text-indigo-700 mb-1">Interview Summary</span>
                    <span className="text-sm text-gray-500 text-center mb-2">
                        <BarChart2 className="inline-block w-5 h-5 mr-1 text-green-600" />
                        Your interview is now complete. You can review your answers and feedback once available.
                    </span>
                </div>
                <button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow hover:from-blue-700 hover:to-indigo-700 transition mb-2"
                    onClick={() => router.push(`/interview/${interview_id}`)}
                >
                    Back to Interview
                </button>
                <div className="mt-4 text-xs text-gray-400 text-center">
                    Powered by Smart Hire AI &mdash; Thank you for your time!
                </div>
            </motion.div>
        </motion.div>
    )
}

export default InterviewCompleted