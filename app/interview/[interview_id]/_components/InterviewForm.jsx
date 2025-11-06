import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Video, Loader2Icon, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function InterviewForm({ 
  userName, 
  setUserName, 
  userEmail, 
  setUserEmail, 
  loading, 
  onJoinInterview, 
  emailDisabled, 
  nameDisabled,
  interviewStatus,
  setupEnabled
}) {
  const isEnded = interviewStatus === 'Ended';
  
  return (
    <>
      {isEnded && (
        <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-700">This interview has ended</h3>
            <p className="text-sm text-red-600">This interview is no longer available for participation.</p>
          </div>
        </div>
      )}
      
      {(nameDisabled || emailDisabled) && !isEnded && (
        <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <div className="text-sm text-blue-700">
            <p className="font-medium">Your details are pre-filled for this interview.</p>
          </div>
        </div>
      )}
      
      <div className="w-full mb-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-sm font-semibold text-gray-700">Enter your Full Name</h2>
          {interviewStatus && (
            <Badge 
              className={`text-xs ${
                interviewStatus === 'Not Started' 
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : interviewStatus === 'Started'
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              {interviewStatus}
            </Badge>
          )}
        </div>
        <Input
          placeholder="e.g. Rishipreeth"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className={`rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${nameDisabled ? 'bg-gray-50' : ''}`}
          disabled={nameDisabled || isEnded}
        />
      </div>
      <div className="w-full mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Your Email</h2>
        <Input
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="e.g. candidate@email.com"
          className={`rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition ${emailDisabled ? 'bg-gray-50' : ''}`}
          disabled={emailDisabled || isEnded}
        />
      </div>
      <Button
        disabled={loading || !userName || !userEmail || isEnded || !setupEnabled}
        onClick={onJoinInterview}
        className={`mt-6 w-full font-bold py-3 rounded-xl ${
          isEnded 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        } text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200`}
      >
        <Video className="mr-2" />
        {loading && <Loader2Icon className="animate-spin mr-2" />}
        {isEnded ? 'Interview Ended' : 'Start Interview'}
      </Button>
    </>
  )
}

export default InterviewForm
