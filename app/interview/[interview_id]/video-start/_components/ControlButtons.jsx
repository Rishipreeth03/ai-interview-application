import { Mic, Phone, Video, VideoOff } from 'lucide-react'
import AlertConfirmation from './AlertConfirmation'
import { motion } from 'framer-motion'

function ControlButtons({ stopInterview, isRecording }) {
    return (
        <div className="flex justify-center items-center gap-10 mt-10">
            <motion.div
                animate={{ scale: isRecording ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: isRecording ? Infinity : 0, duration: 2 }}
            >
                {isRecording ? (
                    <Video className="h-14 w-14 p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full shadow-xl cursor-default" />
                ) : (
                    <VideoOff className="h-14 w-14 p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-full shadow-xl cursor-default" />
                )}
            </motion.div>

            <Mic className="h-14 w-14 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />

            <AlertConfirmation stopInterview={stopInterview}>
                <Phone className="h-14 w-14 p-4 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />
            </AlertConfirmation>
        </div>
    )
}

export default ControlButtons
