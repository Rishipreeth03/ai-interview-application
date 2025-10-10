'use client'
import { useEffect } from 'react'

// Optimized utility hook to stop webcam when interview ends
export default function useStopWebcam(interviewEnded) {
  useEffect(() => {
    if (!interviewEnded) return;
    
    // Function to stop all active media tracks
    const stopAllMediaTracks = async () => {
      try {
        // Approach 1: Stop tracks from video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
          if (video.srcObject) {
            const stream = video.srcObject;
            if (stream && stream.getTracks) {
              stream.getTracks().forEach(track => {
                try {
                  track.stop();
                } catch (e) {
                  // Silently handle error
                }
              });
            }
            video.srcObject = null;
          }
        });
        
        // Approach 2: Create and immediately stop a fresh stream
        // This helps ensure the camera light turns off on some browsers
        if (typeof navigator.mediaDevices?.getUserMedia === 'function') {
          try {
            const freshStream = await navigator.mediaDevices.getUserMedia({ 
              audio: true, 
              video: { facingMode: 'user' } 
            });
            freshStream.getTracks().forEach(track => track.stop());
          } catch (err) {
            // Silently handle error
          }
        }
      } catch (error) {
        console.error("Error stopping webcam:", error);
      }
    };
    
    // Execute the function to stop all tracks
    stopAllMediaTracks();
    
    // Try once more after a delay to ensure cleanup is complete
    const timeoutId = setTimeout(stopAllMediaTracks, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [interviewEnded]);
  
  return null;
}