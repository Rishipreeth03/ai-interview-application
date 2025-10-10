'use client'

// This utility function checks browser compatibility for media devices
// and returns relevant information to help troubleshoot camera issues
export function checkBrowserMediaSupport() {
  const support = {
    browser: 'Unknown',
    version: 'Unknown',
    mediaDevicesSupported: false,
    getUserMediaSupported: false,
    enumerateDevicesSupported: false,
    mediaRecorderSupported: false,
    webRTCSupported: false,
    notes: []
  };
  
  try {
    // Detect browser
    const ua = navigator.userAgent;
    
    if (ua.includes('Chrome')) {
      support.browser = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      support.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      support.browser = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      support.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      support.browser = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      support.version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edge') || ua.includes('Edg')) {
      support.browser = 'Edge';
      const match = ua.match(/Edge?\/(\d+)/);
      support.version = match ? match[1] : 'Unknown';
    }
    
    // Check media APIs support
    support.mediaDevicesSupported = !!navigator.mediaDevices;
    support.getUserMediaSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    support.enumerateDevicesSupported = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
    support.mediaRecorderSupported = typeof MediaRecorder !== 'undefined';
    support.webRTCSupported = typeof RTCPeerConnection !== 'undefined';
    
    // Add notes based on findings
    if (!support.mediaDevicesSupported) {
      support.notes.push('Your browser lacks proper support for camera and microphone access.');
    }
    
    if (!support.getUserMediaSupported) {
      support.notes.push('Your browser cannot access the camera or microphone.');
    }
    
    if (!support.mediaRecorderSupported) {
      support.notes.push('Your browser does not support video recording.');
    }
    
    // Browser-specific notes
    if (support.browser === 'Safari' && parseInt(support.version) < 13) {
      support.notes.push('Your Safari version may have limited support for all video features. Consider updating or using Chrome.');
    }
    
    if (support.browser === 'Firefox' && parseInt(support.version) < 68) {
      support.notes.push('Your Firefox version may have issues with some video features. Please update to the latest version.');
    }
    
    if (support.browser === 'Chrome' && parseInt(support.version) < 78) {
      support.notes.push('Your Chrome version is outdated for optimal video recording. Consider updating.');
    }
    
    // Add general recommendation if issues are found
    if (support.notes.length > 0) {
      support.notes.push('For the best interview experience, please use the latest version of Chrome or Firefox.');
    } else {
      support.notes.push('Your browser appears to be compatible with our video interview system.');
    }
    
  } catch (error) {
    support.notes.push(`Error checking browser compatibility: ${error.message}`);
  }
  
  return support;
}

// Expose a helper function to check if webcam shutdown should work reliably
export function isWebcamShutdownReliable() {
  const support = checkBrowserMediaSupport();
  
  // Chrome and Firefox recent versions handle webcam shutdown well
  if ((support.browser === 'Chrome' && parseInt(support.version) >= 80) || 
      (support.browser === 'Firefox' && parseInt(support.version) >= 70)) {
    return true;
  }
  
  // Safari has improving but still sometimes problematic webcam handling
  if (support.browser === 'Safari') {
    return parseInt(support.version) >= 15;
  }
  
  // Default to false for other browsers or very old versions
  return false;
}