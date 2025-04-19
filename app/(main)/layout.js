import React from 'react'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
  return (
    <div className=' bg-secondary'>
      <DashboardProvider>
        {children}
      </DashboardProvider>

    </div>
  )
}

export default DashboardLayout
