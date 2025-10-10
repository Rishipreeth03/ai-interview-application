
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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
  UserPlus,
  Calendar
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
        <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 font-medium px-3 py-1 rounded-full shadow-sm">
          Not Started
        </Badge>
      )
    }

    switch(status?.toLowerCase()) {
      case 'approved':
        return (
          <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200 font-medium px-3 py-1 rounded-full shadow-sm">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
              Approved
            </div>
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 font-medium px-3 py-1 rounded-full shadow-sm">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></div>
              Rejected
            </div>
          </Badge>
        )
      case 'pending':
      default:
        return (
          <Badge className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200 font-medium px-3 py-1 rounded-full shadow-sm">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></div>
              Pending Review
            </div>
          </Badge>
        )
    }
  }

  const getInterviewUrl = (candidateId, userName, userEmail) => {
    // Create an interview link with pre-filled candidate information and candidate_id
    return `/interview/${interviewId}?candidate_id=${encodeURIComponent(candidateId)}&name=${encodeURIComponent(userName || '')}&email=${encodeURIComponent(userEmail || '')}`
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-5 rounded-full border-indigo-100 focus-visible:ring-indigo-400 shadow-sm bg-white/80 backdrop-blur-sm"
            />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button 
              variant="default" 
              onClick={() => setIsAddCandidatesDialogOpen(true)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${
                interviewStatus === 'Started' || interviewStatus === 'Ended'
                  ? 'bg-gray-300/70 hover:bg-gray-300/70 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.35)]'
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
              {(interviewStatus === 'Started' || interviewStatus === 'Ended') && (
                <span className="ml-1 bg-gray-400/20 text-white/90 text-xs py-0.5 px-2 rounded-full">Disabled</span>
              )}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-indigo-200 bg-white hover:bg-indigo-50 hover:text-indigo-700"
            >
              <RefreshCw className={`h-4 w-4 ${localIsLoading ? 'animate-spin text-indigo-600' : ''}`} />
              {localIsLoading ? 'Refreshing...' : 'Refresh List'}
            </Button>
          </motion.div>
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
        <motion.div 
          className="text-center py-16 bg-gradient-to-br from-white to-indigo-50/30 rounded-xl border border-indigo-100/50 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-30"></div>
            <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-full p-4 shadow-sm border border-amber-200">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchTerm ? 
              'Try a different search term or clear your search to see all candidates.' : 
              'Generate an application form to invite candidates to apply for this position.'}
          </p>
          {searchTerm && (
            <motion.button
              onClick={() => setSearchTerm('')}
              className="bg-white text-indigo-600 font-medium px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors border border-indigo-200 shadow-sm inline-flex items-center"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search className="h-4 w-4 mr-2" />
              Clear Search
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="border rounded-xl overflow-hidden shadow-sm bg-white/95 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70 hover:from-indigo-50 hover:to-blue-50">
                <TableHead className="w-12 text-center font-semibold text-indigo-900">#</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-indigo-700 transition-colors"
                  onClick={() => handleSort('userName')}
                >
                  <div className="flex items-center font-semibold text-indigo-900">
                    Full Name {renderSortIcon('userName')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-indigo-700 transition-colors"
                  onClick={() => handleSort('userEmail')}
                >
                  <div className="flex items-center font-semibold text-indigo-900">
                    Email {renderSortIcon('userEmail')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-indigo-700 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center font-semibold text-indigo-900">
                    Applied Date {renderSortIcon('created_at')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-indigo-700 transition-colors"
                  onClick={() => handleSort('review_status')}
                >
                  <div className="flex items-center font-semibold text-indigo-900">
                    Status {renderSortIcon('review_status')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold text-indigo-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate, index) => (
                <TableRow key={candidate.candidate_id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm border border-indigo-200/50">
                        <User className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-gray-900">
                        {candidate.userName || 'Anonymous Candidate'}
                      </span>
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                    >
                      <div className="p-1 rounded-full bg-blue-50">
                        <MailCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{candidate.userEmail || 'No email provided'}</span>
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                    >
                      <time dateTime={candidate.created_at} className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-indigo-50">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                        </div>
                        {moment(candidate.created_at).format('MMM D, YYYY')}
                      </time>
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                    >
                      {getStatusBadge(candidate.review_status, candidate.completed)}
                    </motion.div>
                  </TableCell>
                  <TableCell className="text-right">
                    <motion.div 
                      className="flex justify-end gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.4 }}
                    >
                      {candidate.completed ? (
                        <Link href={`/interview-details/${interviewId}/candidate/${candidate.candidate_id}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 rounded-full px-4 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                          >
                            <FileBarChart className="h-4 w-4 mr-2" /> Report
                          </Button>
                        </Link>
                      ) : (
                        <Link href={getInterviewUrl(candidate.candidate_id, candidate.userName, candidate.userEmail)} target="_blank">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 rounded-full px-4 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Interview
                          </Button>
                        </Link>
                      )}
                      
                      <Link href={`/interview-details/${interviewId}/candidate/${candidate.candidate_id}`}>
                        <Button 
                          size="sm" 
                          className="h-9 rounded-full px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" /> Details
                        </Button>
                      </Link>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
        <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
        {(interviewStatus === 'Started' || interviewStatus === 'Ended') && (
          <motion.div 
            className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="font-medium">
              {interviewStatus === 'Started' 
                ? 'Interview in progress: New applications are disabled' 
                : 'Interview has ended: New applications are disabled'}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}