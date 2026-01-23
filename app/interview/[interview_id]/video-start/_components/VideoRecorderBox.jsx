import React from 'react'
import { Video, VideoOff, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function VideoRecorderBox({ videoRef, userName, isRecording, recordingError }) {
    return (
        <div className="bg-white/90 rounded-2xl border border-indigo-100 shadow-xl flex flex-col items-center justify-center py-4 px-4 w-full md:w-1/2 min-h-[320px] relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {isRecording ? (
                    <motion.div
                        className="flex items-center gap-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        REC
                    </motion.div>
                ) : (
                    <div className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full shadow">
                        Stopped
                    </div>
                )}
            </div>

            <div className="absolute top-4 left-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow">
                You
            </div>

            {recordingError ? (
                <div className="flex flex-col items-center justify-center h-full w-full p-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                    <span className="text-sm text-red-600 font-semibold text-center">Camera Error</span>
                    <span className="text-xs text-gray-500 mt-2 text-center">{recordingError}</span>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                        style={{
                            maxHeight: '280px',
                            transform: 'scaleX(-1)' // Mirror the video for natural appearance
                        }}
                    />

                    {!isRecording && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <VideoOff className="w-12 h-12 text-white mx-auto mb-2" />
                                <span className="text-white text-sm font-semibold">Camera Stopped</span>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                <span className="text-lg font-bold text-indigo-700 bg-white/80 px-3 py-1 rounded-full shadow">
                    {userName}
                </span>
                <span className="text-xs text-gray-500 mt-1 bg-white/60 px-2 py-0.5 rounded-full">
                    Participant
                </span>
            </div>
        </div>
    )
}

export default VideoRecorderBox
