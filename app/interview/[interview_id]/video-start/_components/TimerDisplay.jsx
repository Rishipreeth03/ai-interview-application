'use client'
import React from 'react'

export default function TimerDisplay({ secondsElapsed }) {
  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-14 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-inner">
        <span className="font-semibold text-lg text-indigo-700">{formatTime(secondsElapsed)}</span>
      </div>
    </div>
  );
}