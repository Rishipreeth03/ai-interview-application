'use client'
import { useUser } from '@/app/provider'
import React from 'react'
import Image from 'next/image'

function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className='bg-white shadow-md rounded-lg p-6 flex justify-between items-center'>
      <div >
        <h1> Welcome {user?.name}</h1>
        <h1> Empowering your hiring process with AI-driven precision—discover top talent effortlessly with AI-Recruiter! </h1>
      </div>
      {user && <Image src={user?.picture} alt="welcome" height={50} width={50} className="rounded-full shadow-md" />}
    </div>
  )
}

export default WelcomeContainer
