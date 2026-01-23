"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import Vapi from '@vapi-ai/web'
import { toast } from 'sonner'
import axios from 'axios'
import { supabase } from '@/app/services/supaBaseclient'

function useVideoInterviewLogic(interviewInfo, interview_id, router) {
    // ==================== VAPI INITIALIZATION ====================
    const vapiRef = useRef()
    if (!vapiRef.current) {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
        if (!apiKey) {
            console.error('Vapi Public API key is missing')
        } else {
            try {
                vapiRef.current = new Vapi(apiKey)
                console.log('✅ Vapi Web SDK initialized')
            } catch (error) {
                console.error('❌ Vapi initialization error:', error)
            }
        }
    }
    const vapi = vapiRef.current

    // ==================== VIDEO PREVIEW STATE ====================
    const videoRef = useRef(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingError, setRecordingError] = useState(null)

    // ==================== INTERVIEW STATE ====================
    const [conversation, setConversation] = useState([])
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [activeUser, setActiveUser] = useState(false)
    const [waitingForResponse, setWaitingForResponse] = useState(false)
    const [interviewStarted, setInterviewStarted] = useState(false)
    const [questionsAsked, setQuestionsAsked] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [sessionId] = useState(() => crypto.randomUUID())
    const [volumeLevel, setVolumeLevel] = useState(0)
    const [assistantId, setAssistantId] = useState(null)

    // ==================== INTERNAL REFS ====================
    const manualStopRef = useRef(false)
    const callActiveRef = useRef(false)
    const toastIds = useRef({})
    const initializationRef = useRef(false)

    // Silence tracking
    const [silenceTimer, setSilenceTimer] = useState(null)
    const [hintOffered, setHintOffered] = useState(false)
    const [silenceWarningCount, setSilenceWarningCount] = useState(0)

    // ==================== VIDEO PREVIEW FUNCTIONS ====================
    const startVideoPreview = useCallback(async () => {
        try {
            // Only capture video - Vapi handles audio separately
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                audio: false
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }

            setIsRecording(true)
            setRecordingError(null)
            toast.success('Camera ready', { duration: 2000 })
        } catch (error) {
            console.error('Camera error:', error)
            setRecordingError(error.message)
            toast.error('Failed to access camera: ' + error.message)
        }
    }, [])

    const stopVideoPreview = useCallback(() => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
        setIsRecording(false)
    }, [])

    // ==================== CREATE ASSISTANT VIA SERVER API ====================
    const createAssistant = useCallback(async () => {
        try {
            console.log('📡 Creating assistant via server API...')
            const response = await axios.post('/api/vapi/create-assistant', {
                interviewData: interviewInfo?.interviewData,
                userName: interviewInfo?.userName,
                duration: interviewInfo?.duration
            })

            if (response.data.success && response.data.assistantId) {
                console.log('✅ Assistant created:', response.data.assistantId)
                setAssistantId(response.data.assistantId)
                return response.data.assistantId
            } else {
                throw new Error(response.data.error || 'Failed to create assistant')
            }
        } catch (error) {
            console.error('❌ Error creating assistant:', error)
            throw error
        }
    }, [interviewInfo])

    // ==================== START VAPI CALL WITH ASSISTANT ID ====================
    const startCall = useCallback(async (assistantIdToUse) => {
        if (!vapi) {
            toast.error('Interview system not ready. Please refresh.')
            throw new Error('Vapi not initialized')
        }

        if (callActiveRef.current) {
            console.log('Call already active, skipping...')
            return
        }

        callActiveRef.current = true

        try {
            console.log('🎤 Starting Vapi call with assistant:', assistantIdToUse)
            // Start call with just the assistant ID - configuration is on the server
            vapi.start(assistantIdToUse)
            console.log('✅ Vapi call initiated')
        } catch (error) {
            callActiveRef.current = false
            console.error('❌ Vapi start error:', error)
            throw error
        }
    }, [vapi])

    // ==================== STOP INTERVIEW ====================
    const stopInterview = useCallback(() => {
        manualStopRef.current = true
        setTimerActive(false)
        stopVideoPreview()

        if (silenceTimer) {
            clearTimeout(silenceTimer)
            setSilenceTimer(null)
        }

        const hasConversation = conversation && conversation.length > 0

        if (hasConversation) {
            toast.info('Stopping interview and generating feedback...')
            try {
                vapi.stop()
                // Backup timeout for feedback generation
                setTimeout(() => {
                    if (manualStopRef.current) {
                        GenerateFeedback()
                    }
                }, 3000)
            } catch (error) {
                GenerateFeedback()
            }
        } else {
            toast.warning('No conversation recorded')
            try {
                vapi.stop()
            } catch (error) {
                console.error('Error stopping:', error)
            }
        }
    }, [vapi, conversation, silenceTimer, stopVideoPreview])

    // ==================== VAPI EVENT HANDLERS ====================
    useEffect(() => {
        if (!vapi) return

        const handleMessage = (message) => {
            console.log('📩 Vapi message:', message?.type)

            if (message?.conversation) {
                setConversation(message.conversation)
                if (message.conversation.length > questionsAsked) {
                    setQuestionsAsked(message.conversation.length)
                    setHintOffered(false)
                }
            }

            if (message?.type === 'speech-start') {
                setActiveUser(false)
                setWaitingForResponse(false)
                if (silenceTimer) {
                    clearTimeout(silenceTimer)
                    setSilenceTimer(null)
                }
            }

            if (message?.type === 'speech-end') {
                setActiveUser(true)
                setWaitingForResponse(true)

                if (silenceTimer) clearTimeout(silenceTimer)

                const timer = setTimeout(() => {
                    if (!hintOffered) {
                        setSilenceWarningCount(prev => prev + 1)
                        setHintOffered(true)
                    }
                }, 10000)
                setSilenceTimer(timer)
            }

            if (message?.type === 'transcript') {
                setWaitingForResponse(false)
                setActiveUser(true)
                if (silenceTimer) {
                    clearTimeout(silenceTimer)
                    setSilenceTimer(null)
                }
            }
        }

        const handleCallStart = () => {
            if (manualStopRef.current) return

            console.log('✅ Vapi call started')
            callActiveRef.current = true
            toast.success('🎙️ Interview Started', {
                duration: 3000,
                description: 'AI interviewer is listening...'
            })
            setInterviewStarted(true)
            setShowLoading(false)
            setTimerActive(true)
        }

        const handleCallEnd = () => {
            console.log('📞 Vapi call ended')
            callActiveRef.current = false

            if (manualStopRef.current) {
                setTimerActive(false)
                setActiveUser(false)
                setWaitingForResponse(false)
                if (conversation && conversation.length > 0) {
                    GenerateFeedback()
                }
                return
            }

            // Normal end - generate feedback if we have conversation
            if (conversation && conversation.length > 0) {
                toast.info('✅ Interview Completed - Generating feedback...')
                setTimerActive(false)
                setActiveUser(false)
                setWaitingForResponse(false)
                GenerateFeedback()
            } else {
                toast.warning('Interview ended without conversation')
                setShowLoading(false)
            }
        }

        const handleError = (error) => {
            console.error('❌ Vapi error:', error)
            callActiveRef.current = false

            if (manualStopRef.current) {
                if (conversation && conversation.length > 0) {
                    GenerateFeedback()
                }
                return
            }

            const errorMsg = typeof error === 'string' ? error :
                error?.message || error?.error?.message || 'An error occurred'

            toast.error(`Interview error: ${errorMsg}`, {
                duration: 8000,
                action: {
                    label: 'Retry',
                    onClick: () => window.location.reload()
                }
            })

            setShowLoading(false)
            stopVideoPreview()
        }

        const handleVolumeLevel = (volume) => {
            setVolumeLevel(volume)
        }

        vapi.on('message', handleMessage)
        vapi.on('call-start', handleCallStart)
        vapi.on('call-end', handleCallEnd)
        vapi.on('error', handleError)
        vapi.on('volume-level', handleVolumeLevel)

        return () => {
            vapi.off('message', handleMessage)
            vapi.off('call-start', handleCallStart)
            vapi.off('call-end', handleCallEnd)
            vapi.off('error', handleError)
            vapi.off('volume-level', handleVolumeLevel)
            if (silenceTimer) clearTimeout(silenceTimer)
        }
    }, [vapi, silenceTimer, questionsAsked, hintOffered, conversation, stopVideoPreview])

    // ==================== AUTO START INTERVIEW ====================
    useEffect(() => {
        if (!interviewInfo || !vapi || initializationRef.current) return
        initializationRef.current = true

        const initInterview = async () => {
            setShowLoading(true)

            try {
                // Check if already completed
                const completed = await hasCandidateCompletedInterview(interviewInfo.userEmail, interview_id)
                if (completed) {
                    router.replace(`/interview/${interview_id}/completed`)
                    return
                }

                // Start video preview first
                await startVideoPreview()

                // Create assistant via server API
                const newAssistantId = await createAssistant()

                // Start the call with the assistant ID
                startCall(newAssistantId)

            } catch (error) {
                console.error('Failed to initialize interview:', error)
                setShowLoading(false)
                stopVideoPreview()
                initializationRef.current = false
                toast.error('Failed to start interview: ' + (error.message || 'Unknown error'), {
                    action: {
                        label: 'Retry',
                        onClick: () => window.location.reload()
                    }
                })
            }
        }

        initInterview()
    }, [interviewInfo, vapi, interview_id, router, startVideoPreview, createAssistant, startCall, stopVideoPreview])

    // ==================== CLEANUP ON UNMOUNT ====================
    useEffect(() => {
        return () => {
            if (vapi && callActiveRef.current) {
                manualStopRef.current = true
                try {
                    vapi.stop()
                } catch (e) {
                    console.error('Cleanup error:', e)
                }
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            }
        }
    }, [vapi])

    // ==================== TIMER ====================
    useEffect(() => {
        let interval
        if (timerActive) {
            interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive])

    // ==================== CHECK COMPLETION STATUS ====================
    async function hasCandidateCompletedInterview(userEmail, interviewId) {
        try {
            const { data, error } = await supabase
                .from('interview-feedback')
                .select('id')
                .eq('userEmail', userEmail)
                .eq('interview_id', interviewId)
                .eq('completed', true)
                .single()
            return !!data && !error
        } catch {
            return false
        }
    }

    // ==================== GENERATE FEEDBACK ====================
    const GenerateFeedback = useCallback(async () => {
        if (showLoading) return

        setShowLoading(true)

        try {
            const result = await axios.post('/api/ai-feedback', {
                conversation: JSON.stringify(conversation || []),
                interviewData: interviewInfo?.interviewData || {},
                ensureFeedback: true
            }, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' }
            })

            const content = result?.data?.content || result?.data
            if (!content) throw new Error('No feedback received')

            let feedbackData
            if (typeof content === 'string') {
                feedbackData = JSON.parse(content.replace(/```json|```/g, '').trim())
            } else {
                feedbackData = content
            }

            // Calculate scores
            const scores = [
                feedbackData?.technicalEvaluation?.score,
                feedbackData?.communicationEvaluation?.score,
                feedbackData?.problemSolvingEvaluation?.score
            ].filter(s => s != null && !isNaN(s))

            const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 50
            const recommended = avgScore >= 70

            // Save to database
            const { error: updateError } = await supabase
                .from('interview-feedback')
                .update({
                    feedback: feedbackData,
                    recommended,
                    completed: true,
                    completed_at: new Date().toISOString(),
                    conversation,
                    review_status: 'completed',
                    updated_at: new Date().toISOString()
                })
                .eq('userEmail', interviewInfo?.userEmail)
                .eq('interview_id', interview_id)

            if (updateError) {
                const { error: insertError } = await supabase
                    .from('interview-feedback')
                    .insert([{
                        userName: interviewInfo?.userName,
                        userEmail: interviewInfo?.userEmail,
                        interview_id,
                        feedback: feedbackData,
                        recommended,
                        completed: true,
                        completed_at: new Date().toISOString(),
                        conversation,
                        review_status: 'completed'
                    }])

                if (insertError) throw new Error(insertError.message)
            }

            toast.success('🎉 Interview completed!')
            manualStopRef.current = true
            router.replace(`/interview/${interview_id}/completed`)

        } catch (error) {
            console.error('Feedback error:', error)
            try {
                await saveFallbackFeedback()
                toast.success('Interview saved')
                router.replace(`/interview/${interview_id}/completed`)
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError)
                toast.error('Failed to save results')
            }
        } finally {
            setShowLoading(false)
            manualStopRef.current = true
        }
    }, [conversation, interviewInfo, interview_id, router, showLoading])

    // ==================== FALLBACK FEEDBACK ====================
    const saveFallbackFeedback = useCallback(async () => {
        const fallbackFeedback = {
            summary: "Interview completed. Detailed analysis unavailable.",
            technicalEvaluation: { score: 0, assessment: "Unable to evaluate" },
            communicationEvaluation: { score: 0, assessment: "Unable to evaluate" },
            problemSolvingEvaluation: { score: 0, assessment: "Unable to evaluate" },
            timestamp: new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('interview-feedback')
            .update({
                feedback: fallbackFeedback,
                recommended: false,
                completed: true,
                completed_at: new Date().toISOString(),
                conversation: conversation || [],
                review_status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('userEmail', interviewInfo?.userEmail)
            .eq('interview_id', interview_id)

        if (updateError) {
            await supabase
                .from('interview-feedback')
                .insert([{
                    userName: interviewInfo?.userName,
                    userEmail: interviewInfo?.userEmail,
                    interview_id,
                    feedback: fallbackFeedback,
                    recommended: false,
                    completed: true,
                    completed_at: new Date().toISOString(),
                    conversation: conversation || [],
                    review_status: 'pending'
                }])
        }
    }, [interviewInfo, interview_id, conversation])

    // ==================== HELPER FUNCTIONS ====================
    const enableInterruptions = useCallback(() => {
        if (vapi && callActiveRef.current) {
            vapi.send({
                type: 'add-message',
                message: {
                    role: 'system',
                    content: 'Allow the candidate to interrupt.'
                }
            })
            toast.success('Interruptions enabled', { duration: 2000 })
        }
    }, [vapi])

    const repeatQuestion = useCallback(() => {
        if (vapi && callActiveRef.current) {
            vapi.send({
                type: 'add-message',
                message: {
                    role: 'system',
                    content: 'Please repeat your last question.'
                }
            })
            toast.info('Repeating question...', { duration: 2000 })
        }
    }, [vapi])

    // ==================== RETURN VALUES ====================
    return {
        // Video
        videoRef,
        isRecording,
        recordingError,
        startVideoPreview,
        stopVideoPreview,

        // Interview state
        showLoading,
        secondsElapsed,
        activeUser,
        waitingForResponse,
        conversation,
        interviewStarted,
        questionsAsked,
        currentQuestionIndex,
        sessionId,
        volumeLevel,
        assistantId,

        // Actions
        stopInterview,
        enableInterruptions,
        repeatQuestion,

        // Silence tracking
        hintOffered,
        silenceTimer,
        silenceWarningCount
    }
}

export default useVideoInterviewLogic
