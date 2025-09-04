import React from 'react'
import Image from 'next/image'

const InterviewHeader = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-100 via-white to-indigo-100 shadow-md rounded-b-2xl flex items-center justify-center py-6 px-4 mb-4">
      <Image
        src={'/logo.png'}
        alt='logo'
        width={120}
        height={80}
        className="w-[120px] h-auto drop-shadow-lg"
        priority
      />
      <span className="ml-4 text-xl font-bold text-indigo-700 tracking-wide hidden md:inline-block">
        Smart Persona Interview
      </span>
    </header>
  )
}

export default InterviewHeader
