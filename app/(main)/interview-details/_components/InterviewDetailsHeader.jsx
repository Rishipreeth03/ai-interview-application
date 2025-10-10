import { ArrowLeft, Clipboard, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function InterviewDetailsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-lg shadow-md">
            <Clipboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                Interview Details
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View and manage your interview information
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href="/all-interview">
            <Button variant="outline" className="gap-2 border-indigo-200 hover:bg-indigo-50">
              <ArrowLeft className="h-4 w-4" />
              <span>All Interviews</span>
            </Button>
          </Link>
          
          <Button className="gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
      
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-6"></div>
    </motion.div>
  )
}
