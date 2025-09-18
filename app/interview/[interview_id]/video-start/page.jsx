"use client"
import React from "react"

const VideoStartInterview = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-2 py-8">
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-2xl md:text-3xl text-indigo-700 tracking-tight drop-shadow-lg">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Video Interview Room
                        </span>
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    {/* AI Recruiter Video Box */}
                    <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                            AI Recruiter
                        </div>
                        <div className="flex flex-col items-center justify-center h-full">
                            {/* Placeholder for AI avatar */}
                            <div className="w-[80px] h-[80px] rounded-full bg-indigo-100 flex items-center justify-center mb-4" />
                            <span className="text-lg font-bold text-indigo-700">AI Recruiter</span>
                            <span className="text-xs text-gray-500 mt-1">Virtual Interviewer</span>
                        </div>
                    </div>
                    {/* User Video Box */}
                    <div className="bg-white/90 rounded-2xl border border-indigo-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
                        <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow">
                            You
                        </div>
                        <div className="flex flex-col items-center justify-center h-full">
                            {/* Placeholder for webcam feed */}
                            <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-blue-100 mb-4" />
                            <span className="text-lg font-bold text-indigo-700">Your Name</span>
                            <span className="text-xs text-gray-500 mt-1">Participant</span>
                        </div>
                    </div>
                </div>
                <h2 className="text-base text-indigo-500 text-center mt-8 font-semibold tracking-wide animate-pulse">
                    Video interview in progress...
                </h2>
            </div>
        </div>
    )
}

export default VideoStartInterview