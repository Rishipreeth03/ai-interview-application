import { useState, useEffect } from 'react'
import { X, Upload, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
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
  const [interviewCapacity, setInterviewCapacity] = useState({
    applied_count: 0,
    number_of_interviews: 1,
    remainingSlots: 0
  })

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name)
    parseFile(selectedFile)
  }

  // Fetch interview capacity data when the dialog opens
  useEffect(() => {
    if (isOpen && interviewId) {
      fetchInterviewCapacity()
    }
  }, [isOpen, interviewId])

  const fetchInterviewCapacity = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('applied_count, number_of_interviews')
        .eq('interview_id', interviewId)
        .single()
      
      if (error) throw error
      
      if (data) {
        const remaining = Math.max(0, data.number_of_interviews - data.applied_count)
        setInterviewCapacity({
          applied_count: data.applied_count || 0,
          number_of_interviews: data.number_of_interviews || 1,
          remainingSlots: remaining
        })
        
        console.log(`Interview capacity: ${data.applied_count}/${data.number_of_interviews} (${remaining} slots remaining)`)
      }
    } catch (error) {
      console.error('Error fetching interview capacity:', error)
      toast.error('Failed to check interview capacity')
    }
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

  // Check for duplicate candidates by email
  const checkForDuplicateCandidates = async (candidatesList) => {
    try {
      // Extract all emails from the candidates list
      const emails = candidatesList.map(candidate => candidate.userEmail.toLowerCase().trim()).filter(Boolean);
      
      if (emails.length === 0) return [];
      
      // Query the database for existing candidates with these emails
      const { data, error } = await supabase
        .from('interview-feedback')
        .select('userEmail')
        .eq('interview_id', interviewId)
        .in('userEmail', emails);
      
      if (error) throw error;
      
      // Get the list of existing emails
      const existingEmails = new Set(data.map(c => c.userEmail.toLowerCase().trim()));
      
      // Filter out candidates with existing emails
      return candidatesList.filter(candidate => {
        const email = candidate.userEmail.toLowerCase().trim();
        return !email || !existingEmails.has(email);
      });
    } catch (error) {
      console.error('Error checking for duplicate candidates:', error);
      toast.error('Failed to check for duplicate candidates');
      return candidatesList; // Return the original list if there's an error
    }
  };

  const handleUpload = async () => {
    if (!candidates.length) {
      toast.error('No valid candidates found in the file.')
      return
    }

    // Refresh interview capacity data to ensure we have the latest count
    await fetchInterviewCapacity()

    // Check if we have enough slots for all candidates
    if (candidates.length > interviewCapacity.remainingSlots) {
      if (interviewCapacity.remainingSlots <= 0) {
        toast.error(`Cannot add candidates. The interview has reached its maximum capacity of ${interviewCapacity.number_of_interviews} candidates.`)
        return
      } else {
        toast.warning(`Only ${interviewCapacity.remainingSlots} of ${candidates.length} candidates can be added due to interview capacity limits.`)
      }
    }

    setIsUploading(true)
    setUploadStep('uploading')
    let successCount = 0
    let rejectedCount = 0

    try {
      // Check for duplicate candidates
      const uniqueCandidates = await checkForDuplicateCandidates(candidates);
      const duplicateCount = candidates.length - uniqueCandidates.length;
      
      if (duplicateCount > 0) {
        toast.warning(`${duplicateCount} candidate(s) already exist in this interview and will be skipped.`);
      }
      
      if (uniqueCandidates.length === 0) {
        toast.error('All candidates already exist in this interview.');
        setUploadStep('preview');
        setIsUploading(false);
        return;
      }
      
      // Determine how many candidates we can add based on capacity
      const availableSlots = interviewCapacity.remainingSlots;
      const candidatesToAdd = uniqueCandidates.slice(0, availableSlots);
      rejectedCount = uniqueCandidates.length - candidatesToAdd.length + duplicateCount;

      if (candidatesToAdd.length === 0) {
        throw new Error('No slots available for candidates')
      }

      // Add candidates to the database with unique candidate_id
      const candidatesWithInterviewId = candidatesToAdd.map(candidate => ({
        ...candidate,
        interview_id: interviewId,
        candidate_id: crypto.randomUUID(), // Generate unique UUID for each candidate
        created_at: new Date().toISOString(),
        completed: false,
        review_status: 'pending',
        // Ensure emails are properly formatted
        userEmail: candidate.userEmail ? candidate.userEmail.trim() : ''
      }))

      // Update in a transaction to ensure consistency
      // First, insert the candidates
      const { data: insertedData, error: insertError } = await supabase
        .from('interview-feedback')
        .insert(candidatesWithInterviewId)
        .select()

      if (insertError) throw insertError

      // Then update the applied_count
      const newAppliedCount = interviewCapacity.applied_count + candidatesToAdd.length
      const { error: updateError } = await supabase
        .from('interviews')
        .update({ applied_count: newAppliedCount })
        .eq('interview_id', interviewId)

      if (updateError) throw updateError

      successCount = candidatesToAdd.length
      
      setUploadStep('complete')
      
      // Show appropriate success message with information about duplicates
      // duplicateCount is already defined above
      const capacityRejectedCount = rejectedCount - duplicateCount;
      
      if (duplicateCount > 0 && capacityRejectedCount > 0) {
        toast.success(`${successCount} candidates added successfully. ${duplicateCount} duplicate(s) skipped and ${capacityRejectedCount} rejected due to capacity limits.`);
      } else if (duplicateCount > 0) {
        toast.success(`${successCount} candidates added successfully. ${duplicateCount} duplicate(s) skipped.`);
      } else if (capacityRejectedCount > 0) {
        toast.success(`${successCount} candidates added successfully. ${capacityRejectedCount} candidates could not be added due to capacity limits.`);
      } else {
        toast.success(`${successCount} candidates added successfully!`);
      }
      
      // Call the callback to refresh the candidate list
      if (onCandidatesAdded) {
        onCandidatesAdded()
      }
      
      // Close the dialog after a brief delay to show completion
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error('Error uploading candidates:', error)
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
        // Function to check for duplicate emails within the current list
        const checkForDuplicatesInCurrentList = () => {
          const emails = {};
          const duplicates = new Set();
          
          candidates.forEach((candidate, index) => {
            if (!candidate.userEmail) return;
            
            const email = candidate.userEmail.toLowerCase().trim();
            if (emails[email] === undefined) {
              emails[email] = index;
            } else {
              // Add both first occurrence and current occurrence
              duplicates.add(emails[email]);
              duplicates.add(index);
            }
          });
          
          return Array.from(duplicates);
        };
        
        const duplicateIndices = checkForDuplicatesInCurrentList();
        
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
            
            {/* Capacity warning */}
            {interviewCapacity.remainingSlots < candidates.length && (
              <div className="mb-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Interview capacity limit warning</p>
                  <p className="text-sm">
                    {interviewCapacity.remainingSlots <= 0
                      ? `This interview has reached its maximum capacity of ${interviewCapacity.number_of_interviews} candidates.`
                      : `Only ${interviewCapacity.remainingSlots} of ${candidates.length} candidates can be added due to interview capacity limits.`
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Duplicate emails warning */}
            {duplicateIndices.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Duplicate emails detected</p>
                  <p className="text-sm">
                    {duplicateIndices.length} email(s) appear multiple times in your list.
                    Only the first occurrence of each email will be processed.
                  </p>
                </div>
              </div>
            )}
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Preview ({candidates.length} candidates)</h3>
                <span className="text-xs text-gray-500">
                  Interview Capacity: {interviewCapacity.applied_count}/{interviewCapacity.number_of_interviews}
                </span>
              </div>
              <div className="overflow-y-auto max-h-64">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Email</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.slice(0, 5).map((candidate, index) => {
                      const isDuplicate = duplicateIndices.includes(index);
                      
                      return (
                        <tr key={index} className={`border-t ${isDuplicate ? 'bg-amber-50' : ''}`}>
                          <td className="px-4 py-2 text-sm">{candidate.userName || '(No name)'}</td>
                          <td className={`px-4 py-2 text-sm ${isDuplicate ? 'text-amber-600 font-medium' : ''}`}>
                            {candidate.userEmail || '(No email)'}
                            {isDuplicate && <span className="ml-1 text-xs">(duplicate)</span>}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {isDuplicate ? (
                              <span className="text-amber-600">Duplicate email</span>
                            ) : index < interviewCapacity.remainingSlots ? (
                              <span className="text-green-600">Will be added</span>
                            ) : (
                              <span className="text-red-600">Cannot be added</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {candidates.length > 5 && (
                      <tr className="border-t">
                        <td colSpan={3} className="px-4 py-2 text-sm text-gray-500 text-center">
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
        const addedCount = Math.min(candidates.length, interviewCapacity.remainingSlots)
        const rejectedCount = candidates.length - addedCount
        
        return (
          <div className="py-10 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Upload complete!</p>
            {rejectedCount > 0 ? (
              <>
                <p className="text-gray-500 mt-1">{addedCount} of {candidates.length} candidates added successfully</p>
                <p className="text-amber-600 mt-1 text-sm">{rejectedCount} candidates could not be added due to capacity limits</p>
              </>
            ) : (
              <p className="text-gray-500 mt-1">{candidates.length} candidates have been added successfully</p>
            )}
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
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || interviewCapacity.remainingSlots <= 0}
                  title={interviewCapacity.remainingSlots <= 0 ? 'No slots available' : ''}
                >
                  {isUploading ? 'Uploading...' : 
                    interviewCapacity.remainingSlots < candidates.length
                      ? `Upload ${Math.min(candidates.length, interviewCapacity.remainingSlots)} of ${candidates.length} Candidates`
                      : `Upload ${candidates.length} Candidates`
                  }
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}