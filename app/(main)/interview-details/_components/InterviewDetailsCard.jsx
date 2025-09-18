import { Loader2, UserCircle2, Send, Copy } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"

export default function InterviewDetailsCard({ interview, url, copyLink, sendGmail, sendWhatsApp }) {
  return (
    <section className="relative max-w-lg mx-auto p-0">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200 via-white to-indigo-200 opacity-80 blur-md"></div>
      <div className="relative p-8 bg-white/90 rounded-3xl border border-gray-100 shadow-2xl hover:shadow-blue-200 transition-all duration-300 flex flex-col gap-6 backdrop-blur-xl">
        <header className="flex items-center justify-between">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-extrabold text-2xl drop-shadow-lg">
              {interview?.jobPosition?.[0]?.toUpperCase() || 'I'}
            </span>
          </div>
          <time className="text-xs text-gray-400 font-semibold tracking-wide" dateTime={interview?.created_at}>
            {moment(interview?.created_at).format('DD MMM YYYY')}
          </time>
        </header>
        <hr className="border-gray-200 my-2" />
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
            {interview?.jobPosition}
          </h2>
          <span className="inline-block text-sm text-blue-800 bg-blue-100 px-4 py-1 rounded-full font-semibold mb-2 shadow-sm">
            {interview?.duration} min
          </span>
          <div className="mt-2 text-gray-700 text-base">
            <strong>Description:</strong> {interview?.jobDescription}
          </div>
          <div className="mt-2 text-gray-700 text-base">
            <strong>Type:</strong> {interview?.type}
          </div>
          <div className="mt-2 text-gray-700 text-base">
            <strong>Created By:</strong> {interview?.user_name} ({interview?.user_email})
          </div>
        </div>
        <div className="flex gap-4 w-full mt-4">
          <Button
            variant="outline"
            onClick={copyLink}
            className="flex gap-2 items-center border-gray-300 hover:border-blue-500 hover:bg-blue-100 transition font-semibold text-gray-700 focus:ring-2 focus:ring-blue-400"
            aria-label="Copy interview link"
          >
            <Copy className="w-4 h-4" /> Copy Link
          </Button>
          <Button
            onClick={sendGmail}
            className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition font-semibold shadow-md focus:ring-2 focus:ring-indigo-400"
            aria-label="Send interview link via Gmail"
          >
            <Send className="w-4 h-4" /> Send via Gmail
          </Button>
          <Button
            onClick={sendWhatsApp}
            className="flex gap-2 items-center bg-green-500 hover:bg-green-600 text-white transition font-semibold shadow-md focus:ring-2 focus:ring-green-400"
            aria-label="Send interview link via WhatsApp"
          >
            <Send className="w-4 h-4" /> Send via WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}
