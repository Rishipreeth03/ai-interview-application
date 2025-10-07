'use client'
import { Button } from '@/components/ui/button'

export default function ErrorState({ error, alreadyApplied, onViewStatus }) {
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }
  if (alreadyApplied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-amber-500 text-5xl mb-4">ℹ️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Applied</h2>
          <p className="text-gray-600 mb-6">
            You have already submitted an application for this position with this email address.
          </p>
          <Button 
            onClick={onViewStatus}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            View Application Status
          </Button>
        </div>
      </div>
    )
  }
  return null
}
