"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Mic, Phone, Timer } from 'lucide-react'
import React, { useContext, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web'
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/app/services/supaBaseclient'

const StartInterview = () => {
    const { interviewInfo } = useContext(InterviewDataContext)
    const vapiRef = useRef()
    if (!vapiRef.current) {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
    }
    const vapi = vapiRef.current
    const [activeUser, setActiveUser] = useState(false)
    const [conversation, setConversation] = useState()
    const { interview_id } = useParams()
    const router = useRouter()
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [showLoading, setShowLoading] = useState(false)

    // Prevent access if interview is completed
    useEffect(() => {
        if (interviewInfo?.completed) {
            router.replace(`/interview/${interview_id}/completed`)
            return
        }
        if (interviewInfo) {
            setShowLoading(true)
            startCall().finally(() => setShowLoading(false))
            setTimerActive(true)
        }
    }, [interviewInfo])

    // Interview assistant options and prompt
    const startCall = async () => {
        let questionList
        interviewInfo?.interviewData?.questionList.forEach(item => {
            questionList = item?.question + ", " + questionList
        })
        const durationMin = interviewInfo?.duration ? Number(interviewInfo.duration) : 0
        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            voice: {
                provider: "playht",
                voiceId: "jennifer",
            },
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI voice assistant conducting interviews.

Your job is to ask candidates the provided interview questions and assess their responses.

Begin with a friendly introduction, setting a relaxed yet professional tone.

Ask one question at a time and wait for the candidate’s response before proceeding. 
Do NOT give out the answers to any questions. If the candidate struggles or asks for help, offer only abstract hints (no examples or basic hints), or simplify the question to a short-answer format.

If the candidate does not respond within 15 seconds, gently move on to the next question with a phrase like:
"Let's move to the next one!"

If the interview is near the end of the allotted duration (${durationMin} minutes), alert the candidate:
"We're running short on time, so I'll keep the next questions brief."

Reduce the number of questions if time is short, and make questions concise and quick to answer.

Provide brief, encouraging feedback after each answer, such as:
"Nice! That’s a solid answer."
or
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"

After certain questions (like almost at the end of questions) or when time is up, wrap up the interview smoothly by summarizing their performance and end on a positive note.

Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level and remaining time
✅ Ensure the interview remains focused on React
✅ Never reveal the correct answer, only offer abstract hints or encouragement
✅ If no answer is given after sufficient time, move to the next question
✅ If time is running out, make questions shorter and reduce the total number asked

Questions: ${questionList}
`.trim(),
                    },
                ],
            },
        }
        vapi.start(assistantOptions)
    }

    // Stop interview and navigate to completed page
    const stopInterview = () => {
        vapi.stop()
        setTimerActive(false)
        toast("Interview Stopped")
        router.replace(`/interview/${interview_id}/completed`)
        GenerateFeedback()
    }

    // Vapi event listeners
    useEffect(() => {
        const handleMessage = message => {
            if (message?.conversation) setConversation(JSON.stringify(message?.conversation))
        }
        vapi.on("message", handleMessage)
        vapi.on("call-start", () => {
            toast("Call Connected...")
        })
        vapi.on("speech-start", () => setActiveUser(false))
        vapi.on("speech-end", () => setActiveUser(true))
        vapi.on("call-end", () => {
            toast("Interview Ended")
            setTimerActive(false)
            GenerateFeedback()
        })
        return () => {
            vapi.off("message", handleMessage)
            vapi.off("call-start", () => {})
            vapi.off("speech-start", () => {})
            vapi.off("speech-end", () => {})
            vapi.off("call-end", () => {})
        }
    }, [vapi])

    // Save feedback to database and navigate to completed page
    const GenerateFeedback = async () => {
        setShowLoading(true)
        interviewInfo.completed = true
        const result = await axios.post('/api/ai-feedback', { conversation })
        const Content = result?.data?.content
        const FINAL_CONTENT = Content.replace('```json', '').replace('```', '')
        await supabase
            .from('interview-feedback')
            .insert([{
                userName: interviewInfo?.userName,
                userEmail: interviewInfo?.userEmail,
                interview_id,
                feedback: JSON.parse(FINAL_CONTENT),
                recommended: false,
                completed: true
            }])
            .select()
        setShowLoading(false)
        router.replace(`/interview/${interview_id}/completed`)
    }

    // Timer logic
    useEffect(() => {
        let interval
        if (timerActive) {
            interval = setInterval(() => {
                setSecondsElapsed(prev => {
                    const durationSec = interviewInfo?.duration
                        ? Number(interviewInfo.duration) * 60
                        : null
                    if (durationSec && prev + 1 >= durationSec) {
                        setTimerActive(false)
                        stopInterview()
                        return prev
                    }
                    return prev + 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive, interviewInfo])

    // Format timer display
    const formatTime = secs => {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0')
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
        const s = String(secs % 60).padStart(2, '0')
        return `${h}:${m}:${s}`
    }

    // UI
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-2 py-8">
            {showLoading && (
                <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-400"></div>
                    <span className="ml-4 text-lg font-semibold text-indigo-700 mt-4">Processing...</span>
                </div>
            )}
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-2xl md:text-3xl text-indigo-700 tracking-tight drop-shadow-lg">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Interview Room</span>
                    </h2>
                    <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl shadow border border-indigo-100 font-semibold text-indigo-700 text-base">
                        <Timer className="w-5 h-5" />
                        {formatTime(secondsElapsed)}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    {/* AI Recruiter Video Box */}
                    <div className="bg-white/90 rounded-2xl border border-blue-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
                        <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">AI Recruiter</div>
                        <div className="flex flex-col items-center justify-center h-full">
                            <Image src="/ai.png" alt="ai" width={100} height={100}
                                className="w-[80px] h-[80px] rounded-full object-cover shadow-lg border-4 border-indigo-100 mb-4" />
                            <span className="text-lg font-bold text-indigo-700">AI Recruiter</span>
                            <span className="text-xs text-gray-500 mt-1">Virtual Interviewer</span>
                        </div>
                    </div>
                    {/* User Video Box */}
                    <div className="bg-white/90 rounded-2xl border border-indigo-100 shadow-xl flex flex-col items-center justify-center py-8 px-6 w-full md:w-1/2 min-h-[320px] relative">
                        <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow">You</div>
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-blue-100 mb-4">
                                <span className="text-3xl text-white font-bold select-none">
                                    {interviewInfo?.userName?.charAt(0)}
                                </span>
                            </div>
                            <span className="text-lg font-bold text-indigo-700">{interviewInfo?.userName}</span>
                            <span className="text-xs text-gray-500 mt-1">Participant</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-10 mt-10">
                    <Mic className="h-14 w-14 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />
                    <AlertConfirmation stopInterview={stopInterview}>
                        <Phone className="h-14 w-14 p-4 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full cursor-pointer shadow-xl hover:scale-110 transition" />
                    </AlertConfirmation>
                </div>
                <h2 className="text-base text-indigo-500 text-center mt-8 font-semibold tracking-wide animate-pulse">
                    Interview in progress...
                </h2>
            </div>
        </div>
    )
}

export default StartInterview