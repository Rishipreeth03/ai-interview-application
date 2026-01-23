import { Timer } from 'lucide-react'

function TimerDisplay({ secondsElapsed }) {
    const formatTime = secs => {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0')
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
        const s = String(secs % 60).padStart(2, '0')
        return `${h}:${m}:${s}`
    }
    return (
        <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl shadow border border-indigo-100 font-semibold text-indigo-700 text-base">
            <Timer className="w-5 h-5" />
            {formatTime(secondsElapsed)}
        </span>
    )
}

export default TimerDisplay
