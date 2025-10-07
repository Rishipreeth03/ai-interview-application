
import { useState, useCallback } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  FileBarChart, 
  User, 
  MailCheck,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  AlertTriangle,
  UserPlus
} from 'lucide-react'
import AddCandidatesDialog from './AddCandidatesDialog'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import moment from 'moment'

export default function CandidateTable({ candidates, isLoading: externalIsLoading, interviewId, onRefresh, interviewStatus }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [refreshKey, setRefreshKey] = useState(0)
  const [localIsLoading, setLocalIsLoading] = useState(false)
  const [isAddCandidatesDialogOpen, setIsAddCandidatesDialogOpen] = useState(false)
  
  // Combine external and local loading states
  const isLoading = externalIsLoading || localIsLoading
  
  const handleRefresh = useCallback(() => {
    // Set local loading state to true
    setLocalIsLoading(true)
    
    // If parent component provided an onRefresh function, call it
    if (typeof onRefresh === 'function') {
      onRefresh()
    }
    
    // After 2 seconds, update the refresh key and clear the loading state
    setTimeout(() => {
      setRefreshKey(prevKey => prevKey + 1)
      setLocalIsLoading(false)
    }, 2000)
  }, [onRefresh])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    // Handle nested fields like userName
    if (sortField === 'userName' && (a[sortField] === null || b[sortField] === null)) {
      aValue = a[sortField] || ''
      bValue = b[sortField] || ''
    }
    
    // Special handling for dates
    if (['created_at', 'completed_at', 'updated_at'].includes(sortField)) {
      aValue = aValue ? new Date(aValue) : new Date(0)
      bValue = bValue ? new Date(bValue) : new Date(0)
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  const filteredCandidates = sortedCandidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase()
    
    return (
      (candidate.userName?.toLowerCase().includes(searchLower) || '') ||
      (candidate.userEmail?.toLowerCase().includes(searchLower) || '') ||
      (candidate.review_status?.toLowerCase().includes(searchLower) || '')
    )
  })

  const renderSortIcon = (field) => {
    if (sortField !== field) return null
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-3 w-3" /> : 
      <ChevronDown className="ml-1 h-3 w-3" />
  }

  const getStatusBadge = (status, isCompleted) => {
    if (!isCompleted) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
          Not Started
        </Badge>
      )
    }

    switch(status?.toLowerCase()) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        )
      case 'pending':
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Pending Review
          </Badge>
        )
    }
  }

  const getInterviewUrl = (candidateId, userName, userEmail) => {
    // Create an interview link with pre-filled candidate information
    return `/interview/${interviewId}?name=${encodeURIComponent(userName || '')}&email=${encodeURIComponent(userEmail || '')}`
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-9 w-60" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="border rounded-lg">
          <div className="p-3 bg-gray-50 border-b">
            <Skeleton className="h-7 w-full" />
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 border-b">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full" key={refreshKey}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            onClick={() => setIsAddCandidatesDialogOpen(true)} 
            className={`flex items-center gap-1 ${
              interviewStatus === 'Started' || interviewStatus === 'Ended'
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
            disabled={interviewStatus === 'Started' || interviewStatus === 'Ended'}
            title={
              interviewStatus === 'Started'
                ? 'Cannot add candidates while interview is in progress'
                : interviewStatus === 'Ended'
                ? 'Cannot add candidates after interview has ended'
                : 'Add new candidates'
            }
          >
            <UserPlus className="h-4 w-4" />
            Add Candidates
          </Button>
          
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Add Candidates Dialog */}
      <AddCandidatesDialog 
        isOpen={isAddCandidatesDialogOpen} 
        onClose={() => setIsAddCandidatesDialogOpen(false)}
        interviewId={interviewId}
        onCandidatesAdded={handleRefresh}
      />

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No candidates found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try a different search term or' : 'Generate an application form to'} invite candidates to apply
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('userName')}
                >
                  <div className="flex items-center">
                    Full Name {renderSortIcon('userName')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('userEmail')}
                >
                  <div className="flex items-center">
                    Email {renderSortIcon('userEmail')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Applied Date {renderSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('review_status')}
                >
                  <div className="flex items-center">
                    Status {renderSortIcon('review_status')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate, index) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="font-medium">
                        {candidate.userName || 'Anonymous Candidate'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MailCheck className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{candidate.userEmail || 'No email provided'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <time dateTime={candidate.created_at}>
                      {moment(candidate.created_at).format('MMM D, YYYY')}
                    </time>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(candidate.review_status, candidate.completed)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {candidate.completed ? (
                        <Link href={`/main/interview-details/${interviewId}/candidate/${candidate.id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            <FileBarChart className="h-4 w-4 mr-1" /> Report
                          </Button>
                        </Link>
                      ) : (
                        <Link href={getInterviewUrl(candidate.id, candidate.userName, candidate.userEmail)} target="_blank">
                          <Button variant="outline" size="sm" className="h-8">
                            <ExternalLink className="h-4 w-4 mr-1" /> Interview Link
                          </Button>
                        </Link>
                      )}
                      
                      <Link href={`/main/interview-details/${interviewId}/candidate/${candidate.id}`}>
                        <Button 
                          size="sm" 
                          className="h-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-500">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
        {(interviewStatus === 'Started' || interviewStatus === 'Ended') && (
          <div className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {interviewStatus === 'Started' 
              ? 'Interview in progress: New applications are disabled' 
              : 'Interview has ended: New applications are disabled'}
          </div>
        )}
      </div>
    </div>
  )
}