"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/app/services/supaBaseclient'
import { useRouter } from 'next/navigation'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
      } else {
        setAuthorized(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!authorized) {
    return null
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold my-3'>Dashboard</h1>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard