'use client'
import { useUser } from '@/app/provider'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

function WelcomeContainer() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');

  // Update greeting based on time of day whenever component renders
  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = 'Welcome';
    
    if (hour < 12) {
      newGreeting = 'Good morning';
    } else if (hour < 18) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }
    
    setGreeting(newGreeting);
  }, []);

  return (
    <div className='bg-white shadow-md rounded-lg p-6 flex justify-between items-center'>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2"> {greeting}, {user?.name || 'there'}!</h1>
        <p className="text-gray-600"> Empowering your hiring process with AI-driven precision—discover top talent effortlessly with AI-Recruiter! </p>
      </div>
      {user?.picture && <Image src={user.picture} alt="user profile" height={50} width={50} className="rounded-full shadow-md ml-4" />}
    </div>
  )
}

export default WelcomeContainer
