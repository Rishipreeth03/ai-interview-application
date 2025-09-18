import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Video, Loader2Icon } from 'lucide-react'

function InterviewForm({ userName, setUserName, userEmail, setUserEmail, loading, onJoinInterview, emailDisabled }) {
  return (
    <>
      <div className="w-full mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Enter your Full Name</h2>
        <Input
          placeholder="e.g. Rishipreeth"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
        />
      </div>
      <div className="w-full mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Your Email</h2>
        <Input
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          placeholder="e.g. candidate@email.com"
          className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          disabled={emailDisabled}
        />
      </div>
      <Button
        disabled={loading || !userName || !userEmail}
        onClick={onJoinInterview}
        className="mt-6 w-full font-bold py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
      >
        <Video className="mr-2" />
        {loading && <Loader2Icon className="animate-spin mr-2" />}
        Start Interview
      </Button>
    </>
  )
}

export default InterviewForm
