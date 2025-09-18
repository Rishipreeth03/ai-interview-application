import { CalendarCheck } from "lucide-react"

export default function InterviewTakenHeader() {
  return (
    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-indigo-700">
      <CalendarCheck className="w-7 h-7" /> Interviews Taken
    </h1>
  )
}
