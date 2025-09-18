import { Clock } from 'lucide-react'

function InterviewDetails({ interviewData }) {
  return (
    <>
      <h2 className="font-extrabold text-2xl text-gray-900 mb-1">{interviewData?.jobPosition}</h2>
      <h2 className="flex gap-2 items-center text-indigo-500 mt-2 font-medium">
        <Clock className="h-5 w-5" />
        <span>{interviewData?.duration}</span>
      </h2>
    </>
  )
}

export default InterviewDetails
