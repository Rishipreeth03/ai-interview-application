'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for applying. Your application has been received and will be processed shortly.
        </p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-5 text-left">
            <h3 className="font-medium text-blue-800 mb-3">What Happens Next?</h3>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-3">
              <li className="pl-2">
                <span className="font-medium">Application Review</span>
                <p className="text-blue-600 mt-1 ml-5">Your application will be reviewed by the hiring team.</p>
              </li>
              <li className="pl-2">
                <span className="font-medium">AI Interview Invitation</span>
                <p className="text-blue-600 mt-1 ml-5">You'll receive an email with a link to start your AI interview process.</p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Complete AI Interview</span>
                <p className="text-blue-600 mt-1 ml-5">Follow the link to complete your interview at your convenience. Your responses will be evaluated on technical knowledge, communication skills, and problem-solving abilities.</p>
              </li>
              <li className="pl-2">
                <span className="font-medium">AI-Assisted Evaluation</span>
                <p className="text-blue-600 mt-1 ml-5">Our AI will provide an initial assessment of your interview performance across multiple skills areas.</p>
              </li>
              <li className="pl-2">
                <span className="font-medium">Results & Next Steps</span>
                <p className="text-blue-600 mt-1 ml-5">After comprehensive review, qualified candidates will be contacted for the next steps in the hiring process.</p>
              </li>
            </ol>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              <span className="font-medium block mb-1">Important Note:</span>
              Please check your email regularly, including your spam folder, to ensure you don't miss any communications about your application.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3 pt-2">
            <Button
              onClick={() => window.close()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Close Window
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/">
                Visit Main Website
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}