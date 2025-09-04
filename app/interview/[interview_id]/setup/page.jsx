'use client'
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, MonitorCheck, ShieldCheck, CheckCircle2, ShieldAlert, Loader2Icon } from "lucide-react";

// Vertical progress bar step component
const Step = ({ icon, label, verified, error }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-md ${verified ? "border-green-500 bg-green-100" : error ? "border-red-500 bg-red-100" : "border-gray-300 bg-gray-100"} transition`}>
      {verified ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : error ? <ShieldAlert className="w-7 h-7 text-red-500" /> : icon}
    </div>
    <span className={`font-semibold text-lg ${verified ? "text-green-700" : error ? "text-red-600" : "text-gray-500"}`}>{label}</span>
  </div>
);

export default function InterviewSetup() {
  const router = useRouter();
  const { interview_id } = useParams();
  const [audioVerified, setAudioVerified] = useState(false);
  const [videoVerified, setVideoVerified] = useState(false);
  const [fullscreenVerified, setFullscreenVerified] = useState(false);
  const [thirdPartyVerified, setThirdPartyVerified] = useState(false);
  const [threats, setThreats] = useState([]);
  const [videoScreeningRequired, setVideoScreeningRequired] = useState(false);

  // Fetch interview details to check videoScreening
  React.useEffect(() => {
    const fetchInterview = async () => {
      const { data } = await supabase
        .from("interviews")
        .select("videoScreening")
        .eq("interview_id", interview_id)
        .single();
      setVideoScreeningRequired(!!data?.videoScreening);
    };
    fetchInterview();
  }, [interview_id]);

  // Manual check for third-party AI scripts/extensions
  const checkThirdParty = async () => {
    // REMOVE: setChecking(true);
    let aiThirdPartyDetected = false;
    let detectedThreats = [];
    const aiVendors = [
      "openai", "chatgpt", "bard", "copilot", "anthropic", "perplexity"
    ];
    const scripts = Array.from(document.scripts).map(s => s.src.toLowerCase());
    for (const vendor of aiVendors) {
      if (scripts.some(src => src.includes(vendor))) {
        aiThirdPartyDetected = true;
        detectedThreats.push(`Detected AI third-party script: ${vendor}`);
      }
    }
    if (window.navigator.plugins) {
      for (const plugin of window.navigator.plugins) {
        const name = plugin.name.toLowerCase();
        if (aiVendors.some(vendor => name.includes(vendor))) {
          aiThirdPartyDetected = true;
          detectedThreats.push(`Detected AI browser plugin: ${name}`);
        }
      }
    }
    setThirdPartyVerified(!aiThirdPartyDetected);
    setThreats(detectedThreats);
    // REMOVE: setChecking(false);
  };

  // Manual audio check
  const checkAudio = async () => {
    let audioVerified = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        audioVerified = true;
        stream.getTracks().forEach(track => track.stop());
      }
    } catch {
      audioVerified = false;
    }
    setAudioVerified(audioVerified);
  };

  // Manual video check (if required)
  const checkVideo = async () => {
    let videoVerified = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        videoVerified = true;
        stream.getTracks().forEach(track => track.stop());
      }
    } catch {
      videoVerified = false;
      alert("Please enable your camera for video screening.");
    }
    setVideoVerified(videoVerified);
  };

  // Manual fullscreen check
  const checkFullscreen = async () => {
    // REMOVE: setChecking(true);
    let fullscreenVerified = false;
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      fullscreenVerified = true;
    } else {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
      fullscreenVerified =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
          ? true
          : false;
    }
    setFullscreenVerified(fullscreenVerified);
    // REMOVE: setChecking(false);
  };

  // Redirect only if all checks pass
  const handleContinue = () => {
    if (
      audioVerified &&
      fullscreenVerified &&
      thirdPartyVerified &&
      threats.length === 0 &&
      (!videoScreeningRequired || videoVerified)
    ) {
      if (videoScreeningRequired) {
        router.replace(`/interview/${interview_id}/video-start`);
      } else {
        router.replace(`/interview/${interview_id}/start`);
      }
    } else {
      alert("Please complete all setup steps before continuing.");
    }
  };

  // Progress bar steps
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
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8">
      <div className="max-w-xl w-full bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col gap-10 items-center border border-indigo-100">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 shadow-lg mb-2">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1 tracking-tight">Interview Environment Check</h1>
          <p className="text-gray-500 text-center text-base max-w-md">
            For a secure and smooth interview experience, please verify each step below.
          </p>
        </div>
        <div className="flex w-full">
          {/* Vertical Progress Bar */}
          <div className="flex flex-col items-center mr-8">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <Step {...step} />
                {idx < steps.length - 1 && (
                  <div className={`w-1 h-10 ${step.verified ? "bg-green-400" : step.error ? "bg-red-400" : "bg-gray-300"} rounded-full`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Step Actions */}
          <div className="flex flex-col gap-8 justify-between flex-1">
            {steps.map((step, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                onClick={step.action}
                disabled={step.verified}
                className={`mb-8 ${step.verified ? "border-green-500 text-green-600" : step.error ? "border-red-500 text-red-600" : "border-blue-500 text-blue-600"}`}
              >
                {step.verified ? "Verified" : step.error ? "Error" : "Check"}
              </Button>
            ))}
            {threats.length > 0 && (
              <div className="mb-8 flex items-center gap-2 text-red-500 font-semibold">
                <ShieldAlert className="w-6 h-6" />
                {threats.join(", ")}
              </div>
            )}
          </div>
        </div>
        <Button
          className="w-full mt-8 font-bold text-lg py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
          onClick={handleContinue}
          disabled={
            !audioVerified ||
            !fullscreenVerified ||
            !thirdPartyVerified ||
            threats.length > 0 ||
            (videoScreeningRequired && !videoVerified)
          }
        >
          Continue to Interview
        </Button>
        <div className="mt-4 text-xs text-gray-400 text-center">
          Powered by Smart Hire AI &mdash; Your privacy and security are our priority.
        </div>
      </div>
    </div>
  );
}