import React from 'react'
import moment from 'moment'
import { Send, Calendar, Clock, Mic, Video, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from "framer-motion"

function InterviewCard({ interview }) {
    // Simplified direct navigation function
    const goToDetails = () => {
        window.location.href = `/interview-details/${interview?.interview_id}`;
    }
    
    // Memoized date formatting for better performance
    const schedule = React.useMemo(() => {
        if (!(interview?.start_at && interview?.end_at)) return null;
        
        return {
            hasSchedule: true,
            startDate: moment(interview.start_at).format('MMM DD, h:mm A'),
            endDate: moment(interview.end_at).format('MMM DD, h:mm A')
        };
    }, [interview?.start_at, interview?.end_at]);
    
    // Determine icon based on video screening (memoized)
    const isVideo = interview?.videoScreening === true;
    const InterviewIcon = isVideo ? Video : Mic;
    
    // Memoized badge styles to avoid recalculating on every render
    const difficultyBadgeStyle = React.useMemo(() => {
        switch (interview?.difficulty_level) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    }, [interview?.difficulty_level]);
    
    // Memoized status badge styling
    const statusBadgeStyle = React.useMemo(() => {
        switch (interview?.status) {
            case 'Not Started': return 'bg-amber-100 text-amber-800';
            case 'Started': return 'bg-blue-100 text-blue-800';
            case 'Ended': return 'bg-green-100 text-green-800';
            default: return 'bg-purple-100 text-purple-800';
        }
    }, [interview?.status]);

    // Memoize the created date to avoid format on every render
    const formattedDate = React.useMemo(() => 
        interview?.created_at ? moment(interview.created_at).format('DD MMM YYYY') : '', 
        [interview?.created_at]
    );

    return (
        <section className="relative w-full h-full p-0">
            {/* Optimized gradient background with reduced blur for better performance */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200 via-white to-indigo-200 opacity-80 blur-sm"></div>
            <div className="relative p-8 bg-white/90 rounded-3xl border border-gray-100 shadow-xl hover:shadow-blue-200 transition-all duration-300 flex flex-col gap-4 min-h-[340px] h-full justify-between">
                <header className="flex items-center justify-between">
                    <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <InterviewIcon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col items-end">
                        <time className="text-xs text-gray-400 font-semibold tracking-wide" dateTime={interview?.created_at}>
                            {formattedDate}
                        </time>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {interview?.difficulty_level && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyBadgeStyle}`}>
                                    {interview?.difficulty_level?.charAt(0).toUpperCase() + interview?.difficulty_level?.slice(1)}
                                </span>
                            )}
                            <motion.span 
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${statusBadgeStyle}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.span 
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                                >
                                    <Info className="w-3 h-3 mr-1" />
                                </motion.span>
                                {interview?.status || 'Not Started'}
                            </motion.span>
                        </div>
                    </div>
                </header>
                <hr className="border-gray-200 my-1" />
                <div className="flex-grow">
                    <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                        {interview?.jobPosition}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-sm text-blue-800 bg-blue-100 px-3 py-1 rounded-full font-semibold shadow-sm">
                            <Clock className="w-3 h-3" /> {interview?.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-purple-800 bg-purple-100 px-3 py-1 rounded-full font-semibold shadow-sm">
                            {isVideo ? (
                                <><Video className="w-3 h-3" /> Video Interview</>
                            ) : (
                                <><Mic className="w-3 h-3" /> Audio Interview</>
                            )}
                        </span>
                    </div>
                    
                    {/* Schedule information if available */}
                    {schedule && (
                        <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">Available:</span>
                            </div>
                            <div className="text-sm text-gray-600 pl-5">
                                {schedule.startDate} to {schedule.endDate}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-center w-full mt-3">
                    <Button
                        onClick={goToDetails}
                        className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition font-semibold shadow-md focus:ring-2 focus:ring-indigo-400 w-full"
                        aria-label="Go to interview details"
                    >
                        <Send className="w-4 h-4" /> View Details
                    </Button>
                </div>
            </div>
        </section>
    )
}

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(InterviewCard)