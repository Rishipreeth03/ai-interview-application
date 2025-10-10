import { Video, Monitor } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo } from 'react'

// Create memoized subcomponents for better performance
const CreateInterviewCard = React.memo(() => (
    <Link
        href="/dashboard/create-interview?video=disabled"
        className='group bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-gray-200 shadow-lg rounded-2xl p-8 flex items-center gap-5 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl'
    >
        <div className="flex items-center justify-center bg-blue-100 rounded-xl p-3 mr-2">
            <Video className='text-blue-600 h-14 w-14' />
        </div>
        <div>
            <h2 className='font-extrabold text-lg text-gray-900 mb-1'>Create New Interview</h2>
            <p className='text-gray-600 mb-3'>Create and schedule AI interviews for recruiting candidates.</p>
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow group-hover:bg-blue-700 transition">Start Now</span>
        </div>
    </Link>
));

const VideoScreeningCard = React.memo(() => (
    <Link
        href="/dashboard/create-interview?video=enabled"
        className='group bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-gray-200 shadow-lg rounded-2xl p-8 flex items-center gap-5 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl'
    >
        <div className="flex items-center justify-center bg-blue-100 rounded-xl p-3 mr-2">
            <Monitor className='text-blue-600 h-14 w-14' />
        </div>
        <div>
            <h2 className='font-extrabold text-lg text-gray-900 mb-1'>Create Video Screening Call</h2>
            <p className='text-gray-600 mb-3'>Schedule video screening calls with candidates.</p>
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow group-hover:bg-blue-700 transition">Schedule</span>
        </div>
    </Link>
));

const CreateOptions = () => {
    // Since this is a static component with no props or state changes,
    // wrapping it in React.memo is sufficient for optimization
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <CreateInterviewCard />
            <VideoScreeningCard />
        </div>
    );
};

export default React.memo(CreateOptions);