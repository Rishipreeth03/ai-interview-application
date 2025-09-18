import { UserCircle2, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InterviewTakenList({ interviews, handleShowReport }) {
  return (
    <div className="space-y-6">
      {interviews.map((interview) => (
        <div
          key={interview.interview_id}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <UserCircle2 className="w-10 h-10 text-blue-500" />
            <div>
              <div className="font-bold text-lg text-gray-800">{interview.jobPosition}</div>
              <div className="text-sm text-gray-500">{interview.userName}</div>
              <div className="text-xs text-gray-500">{interview.userEmail}</div>
              <div className="text-xs text-indigo-500 mt-1">
                {interview.completed ? "Completed" : "In Progress"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {interview.recommended === true ? "Recommended" : interview.recommended === false ? "Not Recommended" : ""}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400">
              {new Date(interview.created_at).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-indigo-200 text-indigo-700"
                onClick={() => window.open(`/interview/${interview.interview_id}`, "_blank")}
              >
                View Interview
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-green-200 text-green-700 flex items-center gap-1"
                onClick={() => handleShowReport(interview)}
              >
                <BarChart2 className="w-4 h-4" />
                Show Report
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
