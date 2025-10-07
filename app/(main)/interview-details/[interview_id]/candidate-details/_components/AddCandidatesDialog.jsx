import { useState } from 'react'
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { supabase } from '@/app/services/supaBaseclient'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export default function AddCandidatesDialog({ isOpen, onClose, interviewId, onCandidatesAdded }) {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [uploadStep, setUploadStep] = useState('select') // select, preview, uploading, complete

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name)
    parseFile(selectedFile)
  }

  const parseFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const parsedData = XLSX.utils.sheet_to_json(sheet)
        
        // Process data to match our schema
        const processedData = parsedData.map(row => {
          // Map 'Full Name' to 'userName' and 'email-id' to 'userEmail'
          return {
            userName: row['Full Name'] || row['userName'] || row['Name'] || row['User Name'] || '',
            userEmail: row['email-id'] || row['userEmail'] || row['Email'] || row['email'] || '',
          }
        }).filter(candidate => candidate.userName || candidate.userEmail) // Filter out empty rows
        
        setCandidates(processedData)
        setUploadStep('preview')
      } catch (error) {
        console.error('Error parsing file:', error)
        toast.error('Failed to parse the file. Please ensure it\'s a valid Excel or CSV file.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleUpload = async () => {
    if (!candidates.length) {
      toast.error('No valid candidates found in the file.')
      return
    }

    setIsUploading(true)
    setUploadStep('uploading')
    let successCount = 0
    let failCount = 0

    try {
      // Add candidates to the database
      const candidatesWithInterviewId = candidates.map(candidate => ({
        ...candidate,
        interview_id: interviewId,
        created_at: new Date().toISOString(),
        completed: false,
        review_status: 'pending'
      }))

      const { data, error } = await supabase
        .from('interview-feedback')
        .insert(candidatesWithInterviewId)
        .select()

      if (error) throw error
      successCount = candidatesWithInterviewId.length
      
      setUploadStep('complete')
      toast.success(`${successCount} candidates added successfully!`)
      
      // Call the callback to refresh the candidate list
      if (onCandidatesAdded) {
        onCandidatesAdded()
      }
      
      // Close the dialog after a brief delay to show completion
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error('Error uploading candidates:', error)
      failCount = candidates.length
      toast.error('Failed to add candidates. Please try again.')
      setUploadStep('preview') // Go back to preview step on error
    } finally {
      setIsUploading(false)
    }
  }

  const renderContent = () => {
    switch (uploadStep) {
      case 'select':
        return (
          <>
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="mb-1 text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">Excel or CSV file (max 10MB)</p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>File should contain columns for <b>Full Name</b> and <b>email-id</b></p>
            </div>
          </>
        )
      
      case 'preview':
        return (
          <>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-2 py-1 px-2 bg-blue-50 text-blue-700 rounded">
                <div className="flex-shrink-0">📄</div>
                <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2" 
                onClick={() => {
                  setFile(null)
                  setFileName('')
                  setCandidates([])
                  setUploadStep('select')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="text-sm font-medium text-gray-700">Preview ({candidates.length} candidates)</h3>
              </div>
              <div className="overflow-y-auto max-h-64">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.slice(0, 5).map((candidate, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-sm">{candidate.userName || '(No name)'}</td>
                        <td className="px-4 py-2 text-sm">{candidate.userEmail || '(No email)'}</td>
                      </tr>
                    ))}
                    {candidates.length > 5 && (
                      <tr className="border-t">
                        <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 text-center">
                          And {candidates.length - 5} more...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {candidates.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span>No valid candidates found in the file. Please ensure it contains the correct columns.</span>
              </div>
            )}
          </>
        )
      
      case 'uploading':
        return (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-700">Adding candidates to the system...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait, this may take a moment</p>
          </div>
        )
      
      case 'complete':
        return (
          <div className="py-10 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Upload complete!</p>
            <p className="text-gray-500 mt-1">{candidates.length} candidates have been added successfully</p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Candidates</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet file containing candidate information to add multiple candidates at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          {renderContent()}
        </div>

        <DialogFooter>
          {uploadStep !== 'complete' && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              {uploadStep === 'preview' && candidates.length > 0 && (
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : `Upload ${candidates.length} Candidates`}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}