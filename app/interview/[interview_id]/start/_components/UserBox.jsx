function UserBox({ userName }) {
    return (
        <div className="bg-white/90 rounded-2xl border border-indigo-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
            <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow">You</div>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-blue-100 mb-4">
                    <span className="text-3xl text-white font-bold select-none">
                        {userName?.charAt(0)}
                    </span>
                </div>
                <span className="text-lg font-bold text-indigo-700">{userName}</span>
                <span className="text-xs text-gray-500 mt-1">Participant</span>
            </div>
        </div>
    )
}

export default UserBox
