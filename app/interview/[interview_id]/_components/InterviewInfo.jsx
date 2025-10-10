import { Info, Mic, Network, HelpCircle, Video } from 'lucide-react'

function InterviewInfo() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mt-6 shadow-sm border border-blue-100 relative overflow-hidden">
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(white_2px,transparent_2px),linear-gradient(90deg,white_2px,transparent_2px)] bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Info className="text-blue-600 h-4 w-4" />
          </div>
          <h2 className="font-semibold text-blue-800 text-lg">Before you begin</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-1.5 rounded-full mt-0.5">
              <Mic className="text-indigo-600 h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-gray-700">Test your microphone to ensure clear audio during the interview</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-1.5 rounded-full mt-0.5">
              <Video className="text-purple-600 h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-gray-700">Position your camera at eye level in a well-lit environment</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full mt-0.5">
              <HelpCircle className="text-amber-600 h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-gray-700">You can ask the AI to repeat or clarify questions if needed</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
              <Network className="text-emerald-600 h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-gray-700">Ensure you have a stable internet connection before starting</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewInfo
