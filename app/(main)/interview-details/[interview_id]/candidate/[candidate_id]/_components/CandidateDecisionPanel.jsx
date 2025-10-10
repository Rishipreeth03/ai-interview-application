"use client"

import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function CandidateDecisionPanel({ 
  candidateId,
  candidateName,
  currentStatus,
  aiRecommendation,
  onUpdateStatus,
  isLoading 
}) {
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [actionType, setActionType] = useState(null) // 'accept' or 'reject'

  const handleAction = (type) => {
    setActionType(type)
    setConfirmationOpen(true)
  }

  const confirmAction = async () => {
    try {
      await onUpdateStatus(actionType, "")
      toast(actionType === 'accept' ? 'Candidate Approved' : 'Candidate Rejected', {
        description: `${candidateName} has been ${actionType === 'accept' ? 'approved' : 'rejected'} successfully.`,
        type: actionType === 'accept' ? 'success' : 'default',
      })
      setConfirmationOpen(false)
    } catch (error) {
      toast('Error', {
        description: `Failed to update candidate status: ${error.message}`,
        type: 'error',
      })
    }
  }

  // Determine if candidate is already approved or rejected
  const isApproved = currentStatus === 'approved'
  const isRejected = currentStatus === 'rejected'
  const isPending = !isApproved && !isRejected
  
  // Get message based on AI recommendation
  const getRecommendationMessage = () => {
    if (aiRecommendation === true) {
      return "The AI recommends approving this candidate."
    } else if (aiRecommendation === false) {
      return "The AI does not recommend this candidate."
    }
    return "No AI recommendation available."
  }

  // Get button class based on current status
  const getStatusClass = () => {
    if (isApproved) return "bg-green-50 border-green-200 text-green-800"
    if (isRejected) return "bg-red-50 border-red-200 text-red-800"
    return "bg-amber-50 border-amber-200 text-amber-800"
  }

  // Get status text
  const getStatusText = () => {
    if (isApproved) return "Approved"
    if (isRejected) return "Rejected"
    return "Pending Decision"
  }

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white sticky bottom-4 right-4 left-4">
      <div className="bg-gradient-to-r from-slate-500/10 to-gray-500/10 border-b p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold flex items-center gap-2 text-gray-800">
          <div className="bg-gray-100 p-1.5 rounded-md">
            {isApproved ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : isRejected ? (
              <X className="h-5 w-5 text-red-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-amber-400"></div>
            )}
          </div>
          Recruiter Decision
        </h3>
      </div>
      
      <div className="p-3 md:p-4">
        {/* Status Badge */}
        <div className="mb-2">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isApproved ? 'bg-green-50/50 border border-green-100' : 
            isRejected ? 'bg-red-50/50 border border-red-100' : 
            'bg-amber-50/50 border border-amber-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isApproved ? 'bg-green-500' : 
                isRejected ? 'bg-red-500' : 
                'bg-amber-500'
              }`}></div>
              <span className={`font-medium text-sm ${
                isApproved ? 'text-green-800' : 
                isRejected ? 'text-red-800' : 
                'text-amber-800'
              }`}>
                {getStatusText()}
              </span>
            </div>
            
            <div className={`text-xs px-2.5 py-1 rounded-full ${
              isApproved ? 'bg-green-100 text-green-800' : 
              isRejected ? 'bg-red-100 text-red-800' : 
              'bg-amber-100 text-amber-800'
            }`}>
              {candidateName}
            </div>
          </div>
          
          {/* AI Recommendation - Simplified */}
          {aiRecommendation !== undefined && (
            <div className={`mt-2 p-2 rounded-md text-sm ${
              aiRecommendation === true ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
              aiRecommendation === false ? 'bg-gray-50 text-gray-700 border border-gray-100' : 
              'bg-slate-50 text-slate-700 border border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                {aiRecommendation === true ? (
                  <Check className="h-4 w-4 text-blue-500" />
                ) : aiRecommendation === false ? (
                  <X className="h-4 w-4 text-gray-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-400"></div>
                )}
                {getRecommendationMessage()}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-3">
          {isPending ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-green-600 hover:bg-green-700 transition-all shadow-sm hover:shadow h-12 flex items-center justify-center"
                onClick={() => handleAction('accept')}
                disabled={isLoading}
              >
                {isLoading ? 
                  <Loader2 className="h-5 w-5 mr-1 animate-spin" /> : 
                  <Check className="h-5 w-5 mr-1" />
                }
                <span className="font-medium">Approve</span>
              </Button>
              
              <Button
                className="bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-all shadow-sm hover:shadow h-12 flex items-center justify-center"
                onClick={() => handleAction('reject')}
                disabled={isLoading}
              >
                {isLoading ? 
                  <Loader2 className="h-5 w-5 mr-1 animate-spin" /> : 
                  <X className="h-5 w-5 mr-1" />
                }
                <span className="font-medium">Reject</span>
              </Button>
            </div>
          ) : (
            <div className={`p-3 rounded-lg text-center ${
              isApproved ? 'bg-green-50 border border-green-100' : 
              'bg-red-50 border border-red-100'
            }`}>
              <div className="flex items-center justify-center gap-2">
                {isApproved ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium text-sm ${
                  isApproved ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isApproved ? 'Candidate Approved' : 'Candidate Rejected'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'accept' ? 'Approve Candidate' : 'Reject Candidate'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'accept'
                ? `Are you sure you want to approve ${candidateName}? This will mark them as selected for the position.`
                : `Are you sure you want to reject ${candidateName}? This will mark them as not selected for the position.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                actionType === 'accept' ? 'Approve' : 'Reject'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}