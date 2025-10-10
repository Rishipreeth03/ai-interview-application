'use client'

// Simple helper function to check if webcam shutdown should work reliably
export function isWebcamShutdownReliable() {
  try {
    const ua = navigator.userAgent;
    
    // Chrome version check
    if (ua.includes('Chrome')) {
      const match = ua.match(/Chrome\/(\d+)/);
      return match && parseInt(match[1]) >= 80;
    } 
    
    // Firefox version check
    if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/(\d+)/);
      return match && parseInt(match[1]) >= 70;
    }
    
    // Safari version check
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/(\d+)/);
      return match && parseInt(match[1]) >= 15;
    }
    
    // Default to false for other browsers
    return false;
  } catch {
    return false;
  }
}