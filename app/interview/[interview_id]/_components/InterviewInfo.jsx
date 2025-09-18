import { Info } from 'lucide-react'

function InterviewInfo() {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mt-4 flex gap-3 items-start shadow-sm border border-blue-100">
      <Info className="text-blue-500 mt-1" />
      <div>
        <h2 className="font-bold text-gray-800 mb-1">Before you begin</h2>
        <ul className="list-disc ml-4 space-y-1">
          <li className="text-sm text-gray-600">Test your camera and microphone</li>
          <li className="text-sm text-gray-600">You can skip questions if you don't know the answer</li>
          <li className="text-sm text-gray-600">Ensure you have stable internet connection</li>
        </ul>
      </div>
    </div>
  )
}

export default InterviewInfo
