import { Mic, Phone } from 'lucide-react'
import AlertConfirmation from './AlertConfirmation'

function ControlButtons({ stopInterview }) {
    return (
        <div className="flex justify-center items-center gap-10 mt-10">
            <Mic className="h-14 w-14 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />
            <AlertConfirmation stopInterview={stopInterview}>
                <Phone className="h-14 w-14 p-4 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />
            </AlertConfirmation>
        </div>
    )
}

export default ControlButtons
