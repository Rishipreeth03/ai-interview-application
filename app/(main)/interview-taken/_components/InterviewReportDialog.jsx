import { BarChart2, X } from "lucide-react"

function ProgressBar({ value, max = 10, label }) {
  const percent = Math.round((value / max) * 100)
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default function InterviewReportDialog({ showReport, selectedReport, handleCloseReport }) {
  return (
    showReport && selectedReport && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-8 relative border border-indigo-200
            max-h-[90vh] overflow-y-auto"
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            onClick={handleCloseReport}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <BarChart2 className="w-6 h-6" /> Interview Report
          </h2>
          {selectedReport.feedback ? (
            <>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">Ratings</div>
                {selectedReport.feedback.feedback?.rating &&
                  Object.entries(selectedReport.feedback.feedback.rating).map(([key, value]) => (
                    <ProgressBar key={key} value={value} label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())} />
                  ))}
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">Summary</div>
                <div className="text-gray-600 text-sm">{selectedReport.feedback.feedback?.summary}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">Recommendation</div>
                <div className={`text-sm font-bold ${selectedReport.feedback.feedback?.recommendation ? "text-green-600" : "text-red-600"}`}>
                  {selectedReport.feedback.feedback?.recommendationMsg || (selectedReport.feedback.feedback?.recommendation ? "Recommended" : "Not Recommended")}
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">Areas for Improvement</div>
                <ul className="list-disc ml-5 text-sm text-gray-600">
                  {selectedReport.feedback.feedback?.improvementAreas?.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">Conversation</div>
                <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-auto space-y-3">
                  {Array.isArray(selectedReport.conversation) && selectedReport.conversation.length > 0 ? (
                    selectedReport.conversation.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg max-w-[75%] text-sm shadow
                            ${msg.role === "user"
                              ? "bg-indigo-100 text-indigo-900 rounded-bl-none"
                              : "bg-green-100 text-green-900 rounded-br-none"
                            }`}
                        >
                          <span className="block font-semibold mb-1 text-xs opacity-70">
                            {msg.role === "user" ? "You" : "AI"}
                          </span>
                          <span>{msg.content}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-xs">No conversation available.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No report available.</div>
          )}
        </div>
      </div>
    )
  )
}
