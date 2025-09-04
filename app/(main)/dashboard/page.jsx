"use client"
import React, { useEffect, useState } from 'react'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <span className="text-lg font-medium text-gray-700">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold my-3'>Dashboard</h1>
      {/* Quick Tips section */}
      <div className="mb-6 p-4 bg-yellow-50 rounded shadow">
        <h2 className="font-semibold mb-2">Quick Tips</h2>
        <ul className="list-disc ml-5 text-gray-700">
          <li>Use <b>Create Options</b> to start a new interview.</li>
          <li>Check <b>Latest Interviews</b> for recent activity.</li>
          <li>Visit the Help section for more guidance.</li>
        </ul>
      </div>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard