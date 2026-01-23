"use client"

import { ArrowLeft, User, Calendar, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import moment from 'moment'

export default function CandidateReportHeader({ candidate, interviewData }) {
  if (!candidate || !interviewData) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href={`/interview-details/${interviewData.interview_id}/candidate-details`}>
            <Button variant="ghost" size="sm" className="h-9 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Candidate Report</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Position: <span className="font-medium text-foreground">{interviewData?.jobPosition || 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{candidate.name}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5" />
              <span>{candidate.email}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm w-full sm:w-auto sm:ml-auto">
          <div className="flex flex-col">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Applied
            </span>
            <span className="font-medium">
              {moment(candidate.appliedAt).format('MMM D, YYYY')}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Interviewed
            </span>
            <span className="font-medium">
              {candidate.completedAt
                ? moment(candidate.completedAt).format('MMM D, YYYY')
                : 'Not completed'}
            </span>
          </div>

          {candidate.candidateFeedbackScore && (
            <div className="flex flex-col">
              <span className="text-gray-500">Candidate Feedback</span>
              <span className="font-medium flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.round(candidate.candidateFeedbackScore) ? 'text-amber-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
                <span className="ml-1 text-gray-700">
                  ({candidate.candidateFeedbackScore.toFixed(1)})
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}