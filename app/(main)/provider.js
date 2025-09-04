'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useEffect, useState } from 'react'
import AppSidebar from './_components/AppSidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import { supabase } from '@/app/services/supaBaseclient'
import { useRouter } from 'next/navigation'

function DashboardProvider({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setAuthorized(false)
        router.replace('/auth')
      } else {
        setAuthorized(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <span className="text-lg font-medium text-gray-700">Checking authentication...</span>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='w-full p-10'>
        <WelcomeContainer />
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider