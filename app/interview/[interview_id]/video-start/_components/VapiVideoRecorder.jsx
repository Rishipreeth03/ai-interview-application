'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { isWebcamShutdownReliable } from './browserCompatibility'

export default function VapiVideoRecorder({ 
  interviewId,
  volumeLevel,
  activeUser,
  waitingForResponse,
  interviewEnded = false
}) {
  const videoRef = useRef(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [facingMode, setFacingMode] = useState('user')
  const streamRef = useRef(null)
  
  // Function to stop all media tracks
  const stopAllMediaTracks = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
    }
  }
  
  // Combined effect for camera management and interview end handling
  useEffect(() => {
    // Handle interview ending
    if (interviewEnded) {
      stopAllMediaTracks();
      setVideoEnabled(false);
      setAudioEnabled(false);
      
      // Show browser-specific toast message for non-reliable browsers
      if (!isWebcamShutdownReliable()) {
        toast.info(
          "Your browser may require you to manually close this tab to fully turn off the camera.", 
          { duration: 8000 }
        );
      }
      return;
    }
    
    // Set up camera if interview is ongoing
    const setupCamera = async () => {
      try {
        const constraints = {
          video: {
            width: 1280,
            height: 720,
            facingMode: facingMode
          },
          audio: true
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          // Configure tracks based on current state
          stream.getVideoTracks().forEach(track => track.enabled = videoEnabled);
          stream.getAudioTracks().forEach(track => track.enabled = audioEnabled);
        }
      } catch (error) {
        toast.error('Failed to access camera or microphone')
      }
    }
    
    setupCamera();
    
    return () => stopAllMediaTracks();
  }, [facingMode, interviewEnded, videoEnabled, audioEnabled])
  
  // Toggle audio on/off
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = videoRef.current.srcObject.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled
      })
    }
  }
  
  // Toggle video on/off
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
    
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = videoRef.current.srcObject.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled
      })
    }
  }

  // Switch camera (if multiple available)
  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    
    toast.info(newFacingMode === 'user' ? 'Switched to front camera' : 'Switched to back camera')
  }
  
  // Calculate audio level indicator width based on volume level
  const getAudioLevelWidth = () => {
    // volumeLevel is expected to be between 0 and 1
    const level = Math.min(Math.max(volumeLevel || 0, 0), 1)
    return `${level * 100}%`
  }
  
  // Determine the active status indicator
  const getStatusIndicator = () => {
    if (waitingForResponse) {
      return {
        text: "Your Turn",
        bgColor: "bg-green-500",
        animate: "animate-pulse",
        icon: (
          <div className="h-3 w-3 rounded-full bg-white"></div>
        )
      }
    } else if (activeUser) {
      return {
        text: "Listening",
        bgColor: "bg-blue-500",
        animate: "",
        icon: (
          <div className="h-3 w-3 rounded-full bg-white"></div>
        )
      }
    } else {
      return {
        text: "AI Speaking",
        bgColor: "bg-indigo-500",
        animate: "animate-pulse",
        icon: (
          <div className="flex space-x-1">
            <span className="inline-block h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="inline-block h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="inline-block h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )
      }
    }
  }
  
  const status = getStatusIndicator()
  
    // Stop camera if interview has ended
    useEffect(() => {
      if (interviewEnded) {
        // Turn off video and audio
        setVideoEnabled(false);
        setAudioEnabled(false);
        
        // Stop all media tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    }, [interviewEnded]);
    
    return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-xl overflow-hidden border-2 border-indigo-200 bg-gray-900 w-full max-w-2xl aspect-video">
        {/* Video element */}
        {videoEnabled && !interviewEnded ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // Mute local playback to prevent echo
            className="w-full h-full object-cover"
          />
        ) : interviewEnded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="rounded-full bg-green-800/20 p-6 mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <p className="text-xl font-medium text-green-300">Interview Complete</p>
              <p className="text-sm text-gray-400 mt-2">Camera has been turned off</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <VideoOff className="h-16 w-16 mx-auto mb-4 text-indigo-300" />
              <p className="text-lg font-medium">Video is off</p>
            </div>
          </div>
        )}
        
        {/* Status indicator */}
        <div className={`absolute top-4 right-4 flex items-center gap-2 ${status.bgColor} text-white px-3 py-1.5 rounded-full shadow-lg ${status.animate}`}>
          {status.icon}
          <span className="text-sm font-medium">{status.text}</span>
        </div>
        
        {/* Current question indicator when AI is speaking */}
        {!waitingForResponse && activeUser === false && (
          <div className="absolute bottom-12 left-4 right-4 bg-indigo-900/80 text-white p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-indigo-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm">
                <span className="text-indigo-300 font-semibold">AI is asking: </span> 
                <span className="italic">Listen carefully to the current question...</span>
              </p>
            </div>
          </div>
        )}
        
        {/* Audio level indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-green-500 transition-all duration-100"
            style={{ width: getAudioLevelWidth() }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        {interviewEnded ? (
          // Show disabled controls when interview has ended
          <div className="text-center text-gray-500 py-2">
            <p>Interview completed - camera turned off</p>
          </div>
        ) : (
          // Regular controls
          <>
            <Button
              onClick={toggleAudio}
              variant="outline"
              className={audioEnabled ? "border-indigo-300" : "border-red-300 bg-red-50 text-red-700"}
              disabled={interviewEnded}
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              <span className="ml-2">{audioEnabled ? "Mic On" : "Mic Off"}</span>
            </Button>
            
            <Button
              onClick={toggleVideo}
              variant="outline"
              className={videoEnabled ? "border-indigo-300" : "border-red-300 bg-red-50 text-red-700"}
              disabled={interviewEnded}
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              <span className="ml-2">{videoEnabled ? "Video On" : "Video Off"}</span>
            </Button>
            
            <Button
              onClick={switchCamera}
              variant="outline"
              className="border-indigo-300"
              disabled={interviewEnded}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span className="ml-2">Switch Camera</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}