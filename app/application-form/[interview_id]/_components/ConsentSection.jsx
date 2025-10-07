'use client'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function ConsentSection({ consent, setConsent, error }) {
  return (
    <div className="border-t pt-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-100 shadow-sm">
        <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About the AI Interview Process
        </h4>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>You'll receive a link to complete an interactive AI-conducted interview</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>The system will evaluate your technical skills, communication ability, and problem-solving</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Your responses will receive objective scores to help assess your qualifications</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>All information is securely stored and only accessible to the hiring team</span>
          </li>
        </ul>
      </div>
      <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all duration-200 hover:border-blue-200">
        <div className="mt-1">
          <Switch 
            id="consent" 
            checked={consent} 
            onCheckedChange={setConsent}
            className={error ? 'data-[state=unchecked]:bg-red-200' : ''}
          />
        </div>
        <div>
          <Label 
            htmlFor="consent" 
            className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-800'} cursor-pointer`}
          >
            I consent to participate in this AI interview process
          </Label>
          {error && (
            <p className="text-red-500 text-xs mt-1 animate-pulse">{error}</p>
          )}
          <p className="text-xs text-gray-600 mt-2">
            By providing consent, you agree that your application data, introduction, and future interview 
            responses may be processed by our AI system to evaluate your skills and qualifications. 
            Your information will be stored securely and handled according to our privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
