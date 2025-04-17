import React, { Children } from 'react'
import DashboardProvider from '../provider'
import WelcomeContainer from './_components/WelcomeContainer'

function Dashboard() {
  return (
    <div className='p-20'>
        <h1>Dashboard</h1>    
        <WelcomeContainer/>
    </div>
  )
}

export default Dashboard