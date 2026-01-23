import Image from 'next/image'

function AIRecruiterBox() {
    return (
        <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">AI Recruiter</div>
            <div className="flex flex-col items-center justify-center h-full">
                <Image src="/ai.png" alt="ai" width={100} height={100}
                    className="w-[80px] h-[80px] rounded-full object-cover shadow-lg border-4 border-indigo-100 mb-4" />
                <span className="text-lg font-bold text-indigo-700">AI Recruiter</span>
                <span className="text-xs text-gray-500 mt-1">Virtual Interviewer</span>
            </div>
        </div>
    )
}

export default AIRecruiterBox
