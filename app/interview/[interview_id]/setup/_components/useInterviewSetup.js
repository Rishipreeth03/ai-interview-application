import { useState, useEffect } from "react"
import { Mic, MonitorCheck, ShieldCheck } from "lucide-react"
import { supabase } from "@/app/services/supaBaseclient"

function useInterviewSetup(interview_id, router) {
  const [audioVerified, setAudioVerified] = useState(false)
  const [videoVerified, setVideoVerified] = useState(false)
  const [fullscreenVerified, setFullscreenVerified] = useState(false)
  const [thirdPartyVerified, setThirdPartyVerified] = useState(false)
  const [threats, setThreats] = useState([])
  const [videoScreeningRequired, setVideoScreeningRequired] = useState(false)

  useEffect(() => {
    const fetchInterview = async () => {
      const { data } = await supabase
        .from("interviews")
        .select("videoScreening")
        .eq("interview_id", interview_id)
        .single()
      setVideoScreeningRequired(!!data?.videoScreening)
    }
    fetchInterview()
  }, [interview_id])

  const checkThirdParty = async () => {
    let aiThirdPartyDetected = false
    let detectedThreats = []
    const aiVendors = [
      "openai", "chatgpt", "bard", "copilot", "anthropic", "perplexity"
    ]
    const scripts = Array.from(document.scripts).map(s => s.src.toLowerCase())
    for (const vendor of aiVendors) {
      if (scripts.some(src => src.includes(vendor))) {
        aiThirdPartyDetected = true
        detectedThreats.push(`Detected AI third-party script: ${vendor}`)
      }
    }
    if (window.navigator.plugins) {
      for (const plugin of window.navigator.plugins) {
        const name = plugin.name.toLowerCase()
        if (aiVendors.some(vendor => name.includes(vendor))) {
          aiThirdPartyDetected = true
          detectedThreats.push(`Detected AI browser plugin: ${name}`)
        }
      }
    }
    setThirdPartyVerified(!aiThirdPartyDetected)
    setThreats(detectedThreats)
  }

  const checkAudio = async () => {
    let audioVerified = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (stream) {
        audioVerified = true
        stream.getTracks().forEach(track => track.stop())
      }
    } catch {
      audioVerified = false
    }
    setAudioVerified(audioVerified)
  }

  const checkVideo = async () => {
    let videoVerified = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (stream) {
        videoVerified = true
        stream.getTracks().forEach(track => track.stop())
      }
    } catch {
      videoVerified = false
      alert("Please enable your camera for video screening.")
    }
    setVideoVerified(videoVerified)
  }

  const checkFullscreen = async () => {
    let fullscreenVerified = false
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      fullscreenVerified = true
    } else {
      const elem = document.documentElement
      if (elem.requestFullscreen) await elem.requestFullscreen()
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen()
      else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen()
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen()
      fullscreenVerified =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
          ? true
          : false
    }
    setFullscreenVerified(fullscreenVerified)
  }

  const handleContinue = () => {
    if (
      audioVerified &&
      fullscreenVerified &&
      thirdPartyVerified &&
      threats.length === 0 &&
      (!videoScreeningRequired || videoVerified)
    ) {
      if (videoScreeningRequired) {
        router.replace(`/interview/${interview_id}/video-start`)
      } else {
        router.replace(`/interview/${interview_id}/start`)
      }
    } else {
      alert("Please complete all setup steps before continuing.")
    }
  }

  const steps = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-blue-500" />,
      label: "No third-party AI detected",
      verified: thirdPartyVerified,
      error: !thirdPartyVerified,
      action: checkThirdParty,
    },
    {
      icon: <Mic className="w-7 h-7 text-blue-500" />,
      label: "Microphone access",
      verified: audioVerified,
      error: !audioVerified,
      action: checkAudio,
    },
    ...(videoScreeningRequired
      ? [{
          icon: <MonitorCheck className="w-7 h-7 text-blue-500" />,
          label: "Camera access",
          verified: videoVerified,
          error: !videoVerified,
          action: checkVideo,
        }]
      : []),
    {
      icon: <MonitorCheck className="w-7 h-7 text-blue-500" />,
      label: "Fullscreen mode",
      verified: fullscreenVerified,
      error: !fullscreenVerified,
      action: checkFullscreen,
    },
  ]

  return {
    steps,
    threats,
    handleContinue,
    audioVerified,
    fullscreenVerified,
    thirdPartyVerified,
    videoScreeningRequired,
    videoVerified,
  }
}

export default useInterviewSetup
