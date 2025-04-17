'use client'
import { useUser } from '@/app/provider'
import React from 'react'

function WelcomeContainer() {
    const {user}=useUser();
   
  return (
    <div>
        <h1> Welcome {user?.name}</h1>
      
    </div>
  )
}

export default WelcomeContainer
