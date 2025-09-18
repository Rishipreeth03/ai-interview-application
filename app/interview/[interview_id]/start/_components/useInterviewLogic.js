import { useRef, useState, useEffect } from 'react'
import Vapi from '@vapi-ai/web'
import { toast } from 'sonner'
import axios from 'axios'
import { supabase } from '@/app/services/supaBaseclient'

function useInterviewLogic(interviewInfo, interview_id, router) {
    const vapiRef = useRef()
    if (!vapiRef.current) {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
    }
    const vapi = vapiRef.current
    const [activeUser, setActiveUser] = useState(false)
    const [conversation, setConversation] = useState()
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [showLoading, setShowLoading] = useState(false)

    // Toast ids for deduplication
    const toastIds = useRef({})

    useEffect(() => {
        async function checkAndStart() {
            if (interviewInfo) {
                setShowLoading(true)
                const completed = await hasCandidateCompletedInterview(interviewInfo?.userEmail, interview_id)
                if (completed) {
                    router.replace(`/interview/${interview_id}/completed`)
                    setShowLoading(false)
                    return
                }
                await startCall()
                setShowLoading(false)
                setTimerActive(true)
            }
        }
        checkAndStart()
    }, [interviewInfo])

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

Guidelines:
- Begin with a friendly introduction, set a relaxed yet professional tone, and reassure the candidate that this is a safe space to share their thoughts.
- Ask one question at a time and wait for the candidate’s response before proceeding.
- Analyze each answer and, if appropriate, ask dynamic follow-up questions that dig deeper into the candidate's reasoning, experience, or skills.
- Avoid asking questions in the same way. If a candidate seems confused or asks for clarification, rephrase the question in a different way so they can understand, but keep the meaning clear.
- If the candidate struggles or asks for help, offer only abstract hints (no examples or basic hints), or simplify the question to a short-answer format.
- If the candidate does not respond within 15 seconds, gently move on to the next question with a phrase like:
"Let's move to the next one!"
- If the interview is near the end of the allotted duration (${durationMin} minutes), alert the candidate:
"We're running short on time, so I'll keep the next questions brief."
- Reduce the number of questions if time is short, and make questions concise and quick to answer.
- After each answer, provide brief, encouraging feedback such as:
"Nice! That’s a solid answer."
or
"Hmm, not quite! Want to try again?"
If the candidate seems unsure, offer reassurance and clarify the question if needed.
- Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!".
- If the candidate seems nervous or distracted, pause and offer a moment to regroup, saying things like "Take your time, no rush."
- If there are interruptions or background noise, acknowledge it and resume smoothly.
- After certain questions (like almost at the end of questions) or when time is up, wrap up the interview smoothly by summarizing their performance, highlighting strengths, and ending on a positive note:
"Thanks for sharing your thoughts today! You did great. We'll review your responses and get back to you soon."

Key Guidelines:
✅ Be friendly, engaging, and witty
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level and remaining time
✅ Ensure the interview remains focused on React
✅ Never reveal the correct answer, only offer abstract hints or encouragement
✅ If no answer is given after sufficient time, move to the next question
✅ If time is running out, make questions shorter and reduce the total number asked
✅ Clarify questions if needed and check for understanding
✅ Help the candidate feel comfortable and supported
✅ Analyze candidate answers and adapt follow-up questions dynamically
✅ Rephrase questions in different ways if the candidate does not understand

Questions: ${questionList}
`.trim(),
                    },
                ],
            },
        }
        vapi.start(assistantOptions)
    }

    const stopInterview = () => {
        vapi.stop()
        setTimerActive(false)
        toast("Interview Stopped")
        GenerateFeedback()
        router.replace(`/interview/${interview_id}/completed`)
        GenerateFeedback()
    }

    useEffect(() => {
        const handleMessage = message => {
            if (message?.conversation) setConversation(JSON.stringify(message?.conversation))
        }
        const handleCallStart = () => {
            if (toastIds.current.callStart) toast.dismiss(toastIds.current.callStart)
            toastIds.current.callStart = toast("Call Connected...", { id: "callStart", duration: 2000 })
        }
        const handleSpeechStart = () => setActiveUser(false)
        const handleSpeechEnd = () => setActiveUser(true)
        const handleCallEnd = () => {
            if (toastIds.current.callEnd) toast.dismiss(toastIds.current.callEnd)
            toastIds.current.callEnd = toast("Interview Ended", { id: "callEnd", duration: 2000 })
            setTimerActive(false)
            GenerateFeedback()
        }

        // Ensure feedback is generated if interviewInfo.completed changes to true
        if (interviewInfo?.completed) {
            GenerateFeedback()
        }

        vapi.on("message", handleMessage)
        vapi.on("call-start", handleCallStart)
        vapi.on("speech-start", handleSpeechStart)
        vapi.on("speech-end", handleSpeechEnd)
        vapi.on("call-end", handleCallEnd)

        return () => {
            vapi.off("message", handleMessage)
            vapi.off("call-start", handleCallStart)
            vapi.off("speech-start", handleSpeechStart)
            vapi.off("speech-end", handleSpeechEnd)
            vapi.off("call-end", handleCallEnd)
            // Dismiss any lingering toasts
            Object.values(toastIds.current).forEach(id => toast.dismiss(id))
        }
    }, [vapi, interviewInfo?.completed])

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

    /**
     * Checks if a candidate with the given userEmail and interview_id has completed the interview.
     * @param {string} userEmail
     * @param {string} interview_id
     * @returns {Promise<boolean>} true if completed, false otherwise
     */
    async function hasCandidateCompletedInterview(userEmail, interview_id) {
        const { data, error } = await supabase
            .from('interview-feedback')
            .select('id')
            .eq('userEmail', userEmail)
            .eq('interview_id', interview_id)
            .eq('completed', true)
            .single();

        return !!data && !error;
    }

    return {
        showLoading,
        secondsElapsed,
        stopInterview,
    }
}

export default useInterviewLogic