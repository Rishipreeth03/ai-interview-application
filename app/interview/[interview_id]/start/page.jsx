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
        <div className="p-20 lg:px-48 xl:px=56">
            {showLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    <span className="ml-4 text-lg font-semibold">Processing...</span>
                </div>
            )}
            <h2 className="font-bold text-xl flex justify-between">
                AI Interview Session
                <span className="flex items-center gap-2">
                    <Timer />
                    {formatTime(secondsElapsed)}
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
                <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
                    <div className="relative">
                        {!activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />}
                        <Image src="/ai.png" alt="ai" width={100} height={100} className="w-[60px] h-[60px] rounded-full object-cover" />
                    </div>
                    <h2>AI Recruiter</h2>
                </div>
                <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
                    <div className="relative">
                        {activeUser && <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />}
                        <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">{interviewInfo?.userName.charAt(0)}</h2>
                    </div>
                    <h2>{interviewInfo?.userName}</h2>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5 mt-10">
                <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
                <AlertConfirmation stopInterview={stopInterview}>
                    <Phone className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
                </AlertConfirmation>
            </div>
            <h2 className="text-sm text-gray-400 text-center mt-5"> Interview in progress....</h2>
        </div>
    )
}

export default StartInterview