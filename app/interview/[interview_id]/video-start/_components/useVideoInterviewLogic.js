import { useRef, useState, useEffect, useCallback } from 'react'
import Vapi from '@vapi-ai/web'
import { toast } from 'sonner'
import axios from 'axios'
import { supabase } from '@/app/services/supaBaseclient'

function useVideoInterviewLogic(interviewInfo, interview_id, router, questions) {
    // Validate required parameters
    useEffect(() => {
        if (!interviewInfo) {
            console.warn('useVideoInterviewLogic: interviewInfo is not provided')
        }
        
        if (!interview_id) {
            console.warn('useVideoInterviewLogic: interview_id is not provided')
        }
        
        if (!questions || questions.length === 0) {
            console.warn('useVideoInterviewLogic: questions are empty or not provided')
        }
        
        console.log('useVideoInterviewLogic initialized with:', {
            interviewInfoAvailable: !!interviewInfo,
            interview_id,
            questionsCount: questions?.length || 0
        })
    }, [interviewInfo, interview_id, questions])
    // Initialize Vapi instance once
    const vapiRef = useRef()
    if (!vapiRef.current) {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
        
        if (!apiKey) {
            throw new Error('Vapi API key is missing')
        }
        
        try {
            vapiRef.current = new Vapi(apiKey)
        } catch (error) {
            throw new Error(`Vapi initialization failed: ${error.message}`)
        }
    }
    const vapi = vapiRef.current

    // Core state management
    const [conversation, setConversation] = useState([])
    const [secondsElapsed, setSecondsElapsed] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const toastIds = useRef({})
    const [activeUser, setActiveUser] = useState(false)
    const [waitingForResponse, setWaitingForResponse] = useState(false)
    const [interviewStarted, setInterviewStarted] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [sessionId] = useState(() => crypto.randomUUID())
    const manualStopRef = useRef(false)  // Flag to track manual stopping
    const [transcriptions, setTranscriptions] = useState({})
    const [videoUploadComplete, setVideoUploadComplete] = useState(false)

    // Start the interview process when interviewInfo is available
    useEffect(() => {
        const checkAndStart = async () => {
            if (interviewInfo && questions && questions.length > 0) {
                setShowLoading(true)
                
                // Check if interview was already completed
                const completed = await hasCandidateCompletedInterview(interviewInfo.userEmail, interview_id)
                if (completed) {
                    router.replace(`/interview/${interview_id}/completed`)
                    setShowLoading(false)
                    return
                }
                
                // Start the interview call
                await startCall()
                setShowLoading(false)
                setTimerActive(true)
            }
        }
        checkAndStart()
    }, [interviewInfo, questions])

    // Function to start the Vapi call
    const startCall = async () => {
        // Prepare questions from the interview data
        let questionText = ''
        questions.forEach((item, index) => {
            questionText += `${index + 1}. ${item.question_text}\n`
        })

        const durationMin = interviewInfo?.interviewData?.duration ? Number(interviewInfo.interviewData.duration) : 0
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

Ask one question at a time and wait for the candidate's response before proceeding. 
Do NOT give out the answers to any questions. If the candidate struggles or asks for help, offer only abstract hints (no examples or basic hints), or simplify the question to a short-answer format.

If the candidate does not respond within 15 seconds, gently move on to the next question with a phrase like:
"Let's move to the next one!"

If the interview is near the end of the allotted duration (${durationMin} minutes), alert the candidate:
"We're running short on time, so I'll keep the next questions brief."

Reduce the number of questions if time is short, and make questions concise and quick to answer.

Provide brief, encouraging feedback after each answer, such as:
"Nice! That's a solid answer."
or
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"

After certain questions (like almost at the end of questions) or when time is up, wrap up the interview smoothly by summarizing their performance and end on a positive note.

Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level and remaining time
✅ Ensure the interview remains focused on the job position
✅ Never reveal the correct answer, only offer abstract hints or encouragement
✅ If no answer is given after sufficient time, move to the next question
✅ If time is running out, make questions shorter and reduce the total number asked
Never give any answer or hints to candidates even if they ask for it.

Questions: ${questionText}
`.trim(),
                    },
                ],
            },
        }
        vapi.start(assistantOptions)
    }

    // Function to stop the interview manually
    const stopInterview = async () => {
        setTimerActive(false)
        
        // Set the manual stop flag to true before stopping the call
        manualStopRef.current = true
        
        // Clear silence timer if it exists
        if (silenceTimer) {
            clearTimeout(silenceTimer);
            setSilenceTimer(null);
        }
        
        // Check if we have conversation data
        const hasConversation = conversation && conversation.length > 0;
        
        if (hasConversation) {
            toast("Interview Stopped - Generating feedback...");
            
            try {
                // Stop the call - the 'call-end' event will trigger feedback generation
                vapi.stop()
                
                // Backup timeout to generate feedback if the call-end event doesn't fire
                setTimeout(() => {
                    if (manualStopRef.current) {
                        GenerateFeedback()
                    }
                }, 3000)
            } catch (error) {
                // Still generate feedback even if stopping fails
                GenerateFeedback()
            }
        } else {
            // No conversation data, just stop and show message
            toast.warning("Interview stopped. No conversation was recorded.");
            
            try {
                vapi.stop();
                
                // Give user options to restart
                toast.info("You can restart the interview by refreshing the page", {
                    duration: 8000,
                    action: {
                        label: "Restart",
                        onClick: () => window.location.reload()
                    }
                });
            } catch (error) {
                console.error("Error stopping interview:", error);
            }
        }

        // Return a promise that resolves after a short delay to ensure UI updates
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    
    // Function to allow the candidate to interrupt the AI
    const enableInterruptions = () => {
        try {
            vapi.send({
                type: 'control',
                control: 'unmute-assistant',
                interruptionsEnabled: true,
                interruptAssistantEnabled: true
            })
            toast.success('You can now interrupt the interviewer', {
                duration: 3000,
                description: 'Speak clearly to interrupt when needed'
            })
            return true
        } catch (error) {
            return false
        }
    }
    
    // Function to have the AI repeat or clarify a question
    const repeatQuestion = () => {
        try {
            vapi.say('Could you please repeat the question or explain it further?', 
                false, // Don't end call after spoken
                true,  // Enable interruptions
                true   // Enable interrupting the assistant
            )
            return true
        } catch (error) {
            return false
        }
    }

    // Track silence for hint offering
    const [silenceTimer, setSilenceTimer] = useState(null);
    const [hintOffered, setHintOffered] = useState(false);
    
    // Vapi event listeners with function call handling
    useEffect(() => {
        if (!vapi) {
            return
        }

        const handleMessage = message => {
            if (message?.conversation) {
                setConversation(message.conversation)
                
                // Update transcriptions based on the conversation
                const newConversation = message.conversation
                const lastUserMessage = newConversation.find(msg => msg.role === 'user')
                
                if (lastUserMessage && questions[currentQuestionIndex]) {
                    // Update the transcription for the current question
                    const currentQuestion = questions[currentQuestionIndex]
                    if (currentQuestion && currentQuestion.question_id) {
                        setTranscriptions(prev => ({
                            ...prev,
                            [currentQuestion.question_id]: lastUserMessage.content
                        }))
                    }
                }
                
                // If AI is asking about next question, increment the index
                const lastAiMessage = newConversation.filter(msg => msg.role === 'assistant').pop()
                if (lastAiMessage && lastAiMessage.content && 
                    (lastAiMessage.content.includes("next question") || 
                     lastAiMessage.content.includes("next one"))) {
                    if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(prev => prev + 1)
                        setHintOffered(false) // Reset hint state
                    }
                }
            }

            // Handle speech events for better UX
            if (message?.type === 'speech-start') {
                setActiveUser(false)
                setWaitingForResponse(false)
                
                // Clear silence timer when AI starts speaking
                if (silenceTimer) {
                    clearTimeout(silenceTimer);
                    setSilenceTimer(null);
                }
            }
            
            if (message?.type === 'speech-end') {
                setActiveUser(true)
                setWaitingForResponse(true)
                
                // Start silence detection timer when AI stops speaking
                if (silenceTimer) {
                    clearTimeout(silenceTimer);
                }
                
                // Set a timer to check for silence (10 seconds)
                const timer = setTimeout(() => {
                    // Only offer a hint if one hasn't been offered for the current question
                    if (!hintOffered) {
                        offerHint();
                        setHintOffered(true);
                    }
                }, 10000);
                
                setSilenceTimer(timer);
            }

            // Handle transcript updates
            if (message?.type === 'transcript') {
                setWaitingForResponse(false)
                setActiveUser(true)
                
                // Reset silence timer when user speaks
                if (silenceTimer) {
                    clearTimeout(silenceTimer);
                    setSilenceTimer(null);
                }
            }
        }
        
        // Function to offer hint when silence is detected
        const offerHint = () => {
            try {
                vapi.say("Would you like a hint for this question?", 
                    false, // Don't end call after spoken
                    true,  // Enable interruptions
                    true   // Enable interrupting the assistant
                );
                toast.info("Hint offered due to silence", { 
                    duration: 3000,
                    description: "Say 'yes' if you'd like some guidance"
                });
            } catch (error) {
                console.log("Error offering hint:", error);
            }
        };

        const handleCallStart = () => {
            // Don't restart the interview if it was manually stopped
            if (manualStopRef.current) {
                return
            }
            
            if (toastIds.current.callStart) toast.dismiss(toastIds.current.callStart)
            toastIds.current.callStart = toast("🎙️ Interview Started - AI is listening...", { 
                id: "callStart", 
                duration: 3000,
                description: "Speak clearly and take your time with responses"
            })
            setInterviewStarted(true)
        }

        const handleCallEnd = (endData) => {
            // Check if this was a manual stop - if so, skip the restart logic
            if (manualStopRef.current) {
                proceedWithEnding()
                return
            }
            
            // If the conversation is too short, this might be an error disconnect
            const minValidConversation = 2 // At least 2 exchanges
            
            if (conversation.length < minValidConversation) {
                // Check if we have enough time left to restart
                if (secondsElapsed < (interviewInfo?.duration || 30) * 60 * 0.8) { // If less than 80% of time used
                    toast.warning('Interview connection reset. Reconnecting...', {
                        duration: 3000,
                    })
                    
                    // Try to restart the session
                    setTimeout(async () => {
                        try {
                            await startCall()
                            return
                        } catch (error) {
                            // Only proceed with ending if there's an actual conversation
                            if (conversation && conversation.length > 0) {
                                proceedWithEnding()
                            } else {
                                // If no conversation, just show a message and let user refresh
                                toast.error("Couldn't reconnect to interview. Please try refreshing the page.", {
                                    action: {
                                        label: "Refresh",
                                        onClick: () => window.location.reload()
                                    }
                                })
                            }
                        }
                    }, 1500)
                    
                    return
                }
            }
            
            // Check if we have any conversation data before ending normally
            if (conversation && conversation.length > 0) {
                // Normal interview completion
                proceedWithEnding()
            } else {
                // No conversation data, inform user and don't generate feedback
                toast.warning("Interview ended without any conversation recorded", {
                    duration: 5000
                })
                
                toast.info("You can restart the interview by refreshing the page", {
                    duration: 8000,
                    action: {
                        label: "Restart",
                        onClick: () => window.location.reload()
                    }
                })
                
                // Reset interview state but don't generate feedback or redirect
                setTimerActive(false)
                setActiveUser(false)
                setWaitingForResponse(false)
                setShowLoading(false)
            }
            
            // Function to handle the normal end of interview
            function proceedWithEnding() {
                if (toastIds.current.callEnd) toast.dismiss(toastIds.current.callEnd)
                toastIds.current.callEnd = toast("✅ Interview Completed - Generating feedback...", { 
                    id: "callEnd", 
                    duration: 3000,
                    description: "Please wait while we process your responses"
                })
                
                setTimerActive(false)
                setActiveUser(false)
                setWaitingForResponse(false)
                
                GenerateFeedback()
            }
        }

        const handleError = (error) => {
            // Don't restart if this was a manual stop
            if (manualStopRef.current) {
                setTimerActive(false)
                setActiveUser(false)
                setWaitingForResponse(false)
                setShowLoading(false)
                
                // Only generate feedback if we have some conversation data
                if (conversation && conversation.length > 0) {
                    GenerateFeedback()
                }
                return
            }
            
            // Determine the most user-friendly error message
            let errorMessage = 'An error occurred with the interview';
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error) {
                if (error.message) errorMessage = error.message;
                else if (error.error?.message) errorMessage = error.error.message;
                else if (typeof error.error === 'string') errorMessage = error.error;
            }
            
            // Display error and reset interview state
            toast.error(`Interview error: ${errorMessage}`);
            setTimerActive(false);
            setActiveUser(false);
            setWaitingForResponse(false);
            setShowLoading(false);
            
            // Add option to retry the interview
            toast.info("You can retry the interview by refreshing the page", {
                duration: 8000,
                action: {
                    label: "Refresh",
                    onClick: () => window.location.reload()
                }
            });
        }

        vapi.on("message", handleMessage)
        vapi.on("call-start", handleCallStart)
        vapi.on("call-end", handleCallEnd)
        vapi.on("error", handleError)

        return () => {
            vapi.off("message", handleMessage)
            vapi.off("call-start", handleCallStart)
            vapi.off("call-end", handleCallEnd)
            vapi.off("error", handleError)
            Object.values(toastIds.current).forEach(id => toast.dismiss(id))
            
            // Clear silence timer on cleanup
            if (silenceTimer) {
                clearTimeout(silenceTimer)
            }
        }
    }, [vapi, silenceTimer, currentQuestionIndex, hintOffered, questions, conversation])

    // Generate feedback after interview completion
    const GenerateFeedback = useCallback(async () => {
        // Prevent generating feedback multiple times
        if (showLoading) {
            return
        }
        
        // Check if we have any conversation data
        const hasConversation = conversation && conversation.length > 0;
        if (!hasConversation && !manualStopRef.current) {
            console.warn("Attempted to generate feedback with no conversation data");
            toast.warning("Cannot generate feedback - no conversation recorded");
            setShowLoading(false);
            return;
        }
        
        // Set a static flag to prevent multiple feedback generation attempts
        GenerateFeedback.isGenerating = true
        setShowLoading(true)
        
        try {
            // Prepare conversation data - ensure it's an array even if empty
            const conversationData = JSON.stringify(conversation || [])
            
            // Format question data for the API
            const formattedQuestions = questions.map(q => ({
                question: q.question_text,
                type: q.type || 'General',
                difficulty: q.difficulty || 'medium'
            }));
            
            // Get feedback from the API
            const result = await axios.post('/api/ai-feedback', { 
                conversation: conversationData,
                interviewData: interviewInfo?.interviewData || {},
                questions: formattedQuestions,
                interview_id: interview_id,
                jobPosition: interviewInfo?.interviewData?.jobPosition || 'Not Specified',
                role: interviewInfo?.interviewData?.jobPosition || 'Not Specified',
                ensureFeedback: true // Signal that we need feedback even if conversation is empty
            }, {
                timeout: 45000, // Increased timeout for more complex feedback generation
                headers: { 'Content-Type': 'application/json' }
            })
            
            if (!result?.data) {
                throw new Error('No response data from feedback API')
            }

            const content = result.data.content || result.data
            if (!content) {
                throw new Error('No content in feedback API response')
            }
            
            // Parse feedback content
            let feedbackData;
            try {
                if (typeof content === 'string') {
                    const cleanContent = content.replace(/```json|```/g, '').trim()
                    feedbackData = JSON.parse(cleanContent)
                } else {
                    feedbackData = content
                }
            } catch (parseError) {
                throw new Error('Invalid JSON response from feedback API')
            }

            // Calculate scores
            const technical_score = feedbackData?.technicalEvaluation?.score || null
            const communication_score = feedbackData?.communicationEvaluation?.score || null
            const problem_solving_score = feedbackData?.problemSolvingEvaluation?.score || null
            
            const scores = [technical_score, communication_score, problem_solving_score]
                .filter(s => s !== null && !isNaN(s))
            const ai_score = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 50

            const recommended = ai_score >= 70

            // Save feedback to database - try update first, then insert if needed
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

            // If update failed, try insert
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

                if (insertError) {
                    throw new Error(`Database error: ${insertError.message}`)
                }
            }

            toast.success('🎉 Interview analysis complete! Redirecting to results...')
            
            // Set the manualStopRef to true to prevent any subsequent restart attempts
            manualStopRef.current = true
            
            // Navigate to the completion page only on success
            router.replace(`/interview/${interview_id}/completed`)
            
        } catch (error) {
            console.error('Error generating feedback:', error);
            
            // Try to save a basic feedback record even if AI analysis failed
            try {
                await createFallbackFeedback()
                toast.success('Interview completed - basic feedback saved')
                
                // Only redirect after saving fallback feedback
                router.replace(`/interview/${interview_id}/completed`)
            } catch (fallbackError) {
                console.error('Error saving fallback feedback:', fallbackError);
                toast.error("Failed to save interview results. Please try again or contact support.")
            }
        } finally {
            setShowLoading(false)
            
            // Set the manualStopRef to true to prevent any subsequent restart attempts
            manualStopRef.current = true
        }
    }, [conversation, interviewInfo, interview_id, router, showLoading])

    // Fallback function to create basic feedback when AI analysis fails
    const createFallbackFeedback = useCallback(async () => {
        // Create question response entries for the questions that were asked
        const questionResponses = questions.map((q, idx) => {
            const questionIndex = Math.min(idx, currentQuestionIndex);
            return {
                question: q.question_text,
                response: transcriptions[q.question_id] || "No response recorded",
                score: 0,
                feedback: "Response could not be evaluated due to technical limitations."
            };
        });
        
        // Create a more structured fallback feedback for empty conversations
        const fallbackFeedback = {
            summary: "Interview was completed, but we couldn't generate detailed analysis.",
            technicalEvaluation: {
                score: 0,
                assessment: "Unable to evaluate technical skills due to insufficient data or processing error.",
                strengths: [],
                weaknesses: ["Insufficient data to identify technical strengths and weaknesses."]
            },
            communicationEvaluation: {
                score: 0,
                assessment: "Unable to evaluate communication skills due to insufficient data or processing error.",
                strengths: [],
                weaknesses: ["Insufficient data to identify communication strengths and weaknesses."]
            },
            problemSolvingEvaluation: {
                score: 0,
                assessment: "Unable to evaluate problem-solving skills due to insufficient data or processing error.",
                strengths: [],
                weaknesses: ["Insufficient data to identify problem-solving strengths and weaknesses."]
            },
            questionResponses: questionResponses,
            overallResponseQuality: 0,
            candidateFeedback: "Thank you for participating in the interview. Due to technical limitations or the absence of sufficient conversation data, we couldn't generate detailed feedback at this time.",
            recommendationDetails: {
                recommended: false,
                justification: "Unable to make a recommendation without sufficient data.",
                fitScore: 0,
                nextSteps: "Consider scheduling another interview to properly assess skills."
            },
            improvementAreas: [],
            keyInsights: [
                "The interview process was completed but conversation data was limited or unavailable.",
                `${questions.length} questions were prepared for this interview.`,
                `The interview lasted approximately ${Math.floor(secondsElapsed / 60)} minutes and ${secondsElapsed % 60} seconds.`
            ],
            timestamp: new Date().toISOString(),
            jobPosition: interviewInfo?.interviewData?.jobPosition || "Not specified"
        }

        // Try to update existing record first, then insert if not found
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

        // If update failed, try insert
        if (updateError) {
            const { error: insertError } = await supabase
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

            if (insertError) {
                throw new Error(`Fallback database error: ${insertError.message}`)
            }
        }
    }, [interviewInfo, interview_id, conversation, questions, currentQuestionIndex, transcriptions, secondsElapsed])

    // Timer logic for tracking interview duration
    useEffect(() => {
        let interval
        if (timerActive) {
            interval = setInterval(() => {
                setSecondsElapsed(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive])

    // Check if the candidate has already completed this interview
    async function hasCandidateCompletedInterview(userEmail, interview_id) {
        try {
            const { data, error } = await supabase
                .from('interview-feedback')
                .select('id')
                .eq('userEmail', userEmail)
                .eq('interview_id', interview_id)
                .eq('completed', true)
                .single()

            return !!data && !error
        } catch (err) {
            return false
        }
    }

    // Audio visualization state
    const [volumeLevel, setVolumeLevel] = useState(0)
    
    // Add volume level listener - critical for audio visualization
    useEffect(() => {
        if (!vapi) return;
        
        const handleVolumeChange = (volume) => {
            setVolumeLevel(volume)
        }
        
        vapi.on('volume-level', handleVolumeChange)
        
        return () => {
            vapi.off('volume-level', handleVolumeChange)
        }
    }, [vapi])
    
    // Function to adjust voice settings mid-interview
    const adjustVoiceSettings = (settings = {}) => {
        try {
            const { speed = 1.0, clarity = 0.75 } = settings
            
            vapi.send({
                type: 'control',
                control: 'adjust-voice',
                settings: {
                    speed,
                    clarity,
                    stability: 0.7
                }
            })
            
            toast.success('Voice settings adjusted', { 
                duration: 2000,
                description: `Speed: ${speed}x, Clarity: ${Math.round(clarity * 100)}%`
            })
            
            return true
        } catch (error) {
            return false
        }
    }
    
    // Function to handle video upload complete
    const handleVideoUploadComplete = () => {
        setVideoUploadComplete(true)
        // If the interview is already complete, navigate to completed page
        if (!interviewStarted) {
            router.push(`/interview/${interview_id}/completed`)
        }
    }
    
    return {
        showLoading,
        secondsElapsed,
        stopInterview,
        activeUser,
        waitingForResponse,
        conversation,
        interviewStarted,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        sessionId,
        volumeLevel,
        enableInterruptions,
        repeatQuestion,
        adjustVoiceSettings,
        hintOffered,
        silenceTimer,
        transcriptions,
        setTranscriptions,
        handleVideoUploadComplete,
        videoUploadComplete
    }
}

export default useVideoInterviewLogic