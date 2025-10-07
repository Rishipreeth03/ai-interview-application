import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileSpreadsheet, Copy, Check, ExternalLink } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function GoogleFormGenerator({ 
  interviewId, 
  interviewData, 
  onGenerate, 
  isGenerating, 
  googleFormUrl,
  onFormSubmitted,
  interviewStatus
}) {
  const [showDialog, setShowDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    await onGenerate()
    setShowDialog(true)
  }

  const copyFormLink = () => {
    if (googleFormUrl) {
      navigator.clipboard.writeText(googleFormUrl)
      setCopied(true)
      toast.success('Form link copied to clipboard!')
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const closeDialog = () => {
    setShowDialog(false)
    onFormSubmitted()
  }

  return (
    <>
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !interviewData || interviewStatus === 'Started' || interviewStatus === 'Ended'}
        className={`${
          interviewStatus === 'Started' || interviewStatus === 'Ended' 
            ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        } text-white shadow-md`}
        title={
          interviewStatus === 'Started'
            ? 'Cannot generate application forms while interview is in progress'
            : interviewStatus === 'Ended'
            ? 'Cannot generate application forms after interview has ended'
            : 'Generate application form for candidates'
        }
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate Application Form
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-800">Application Form Ready</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Your application form has been generated successfully. Share this unique link with potential candidates to collect their information and prepare them for AI-based skills assessment. The form will automatically create candidate profiles in your database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mt-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-blue-200">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">
                  {interviewData?.jobPosition || 'Interview'} Application Form
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ready to share with candidates for the {interviewData?.jobPosition || 'open position'}
                </p>
                
                <div className="mt-3 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                    Application Form URL
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={googleFormUrl}
                      className="w-full pr-10 py-3 px-4 border-0 bg-white text-sm text-gray-700 focus:outline-none"
                    />
                    <button
                      onClick={copyFormLink}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Form Information
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 ml-6 list-disc">
                  <li>Collects candidate name and email</li>
                  <li>Gathers brief candidate introduction</li>
                  <li>Includes consent for AI interview</li>
                  <li>Displays job position details</li>
                  <li>Automatically creates candidate record</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Usage Tips
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 ml-6 list-disc">
                  <li>Share via email or post on job boards</li>
                  <li>View submissions in Candidate Details</li>
                  <li>Candidates get confirmation after submit</li>
                  <li>Preview the form before sharing</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2 mt-5 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="border-gray-300"
            >
              Done
            </Button>
            
            <div className="flex space-x-2">
              <Button
                onClick={copyFormLink}
                variant="secondary"
                className="bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              
              <Button
                onClick={() => window.open(googleFormUrl, '_blank')}
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview Form
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}