'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/services/supaBaseclient";
import { Loader2, CalendarCheck, UserCircle2, BarChart2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple ProgressBar component
function ProgressBar({ value, max = 10, label }) {
  const percent = Math.round((value / max) * 100);
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
  );
}

export default function InterviewTakenPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Get current user's email from Supabase Auth
    const fetchUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email || "");
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!userEmail) return;
      setLoading(true);
      // Fetch from interview-feedback table based on userEmail
      const { data, error } = await supabase
        .from("interview-feedback")
        .select("interview_id, userName, userEmail, created_at, recommended, completed, feedback, conversation")
        .eq("userEmail", userEmail)
        .order("created_at", { ascending: false });
      if (!error && data?.length) {
        // Fetch interview names from interviews table
        const interviewIds = data.map(i => i.interview_id);
        const { data: interviewDetails } = await supabase
          .from("interviews")
          .select("interview_id, jobPosition")
          .in("interview_id", interviewIds);
        // Map interview_id to jobPosition
        const interviewMap = {};
        interviewDetails?.forEach(i => {
          interviewMap[i.interview_id] = i.jobPosition;
        });
        // Attach jobPosition to each feedback
        setInterviews(
          data.map(i => ({
            ...i,
            jobPosition: interviewMap[i.interview_id] || "Unknown"
          }))
        );
      } else {
        setInterviews(data || []);
      }
      setLoading(false);
    };
    fetchInterviews();
  }, [userEmail]);

  // Dialog for report
  const handleShowReport = (report) => {
    setSelectedReport(report);
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setSelectedReport(null);
  };

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-indigo-700">
        <CalendarCheck className="w-7 h-7" /> Interviews Taken
      </h1>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-500" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No interviews taken yet.</div>
      ) : (
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
      )}

      {/* Report Dialog */}
      {showReport && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-indigo-200">
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
                  <pre className="bg-gray-100 rounded-lg p-3 text-xs max-h-40 overflow-auto">{JSON.stringify(selectedReport.conversation, null, 2)}</pre>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No report available.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
