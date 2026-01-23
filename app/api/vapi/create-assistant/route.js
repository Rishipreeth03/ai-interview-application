import { NextResponse } from 'next/server'
import { VapiClient } from '@vapi-ai/server-sdk'

export async function POST(request) {
    try {
        const { interviewData, userName, duration } = await request.json()

        // Validate required fields
        if (!interviewData || !userName) {
            return NextResponse.json(
                { error: 'Missing required fields: interviewData and userName' },
                { status: 400 }
            )
        }

        // Initialize Vapi Server SDK
        const vapiApiKey = process.env.VAPI_API_KEY
        if (!vapiApiKey) {
            console.error('VAPI_API_KEY is not configured')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        const vapi = new VapiClient({ token: vapiApiKey })

        // Build question list from interview data
        const questions = interviewData.questionList || []
        const questionList = questions.map(q => q.question).join(', ')
        const jobPosition = interviewData.jobPosition || 'the position'
        const durationMin = duration ? Number(duration) : 10

        // Create assistant with proper configuration
        const assistant = await vapi.assistants.create({
            name: `Interview Assistant - ${jobPosition}`,
            firstMessage: `Hi ${userName}, how are you? Ready for your interview on ${jobPosition}?`,
            transcriber: {
                provider: 'deepgram',
                model: 'nova-2',
                language: 'en-US',
            },
            voice: {
                provider: '11labs',
                voiceId: '21m00Tcm4TlvDq8ikWAM',  // Rachel - a friendly, professional voice
            },
            model: {
                provider: 'openai',
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
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
✅ Ensure the interview remains focused
✅ Never reveal the correct answer, only offer abstract hints or encouragement
✅ If no answer is given after sufficient time, move to the next question
✅ If time is running out, make questions shorter and reduce the total number asked
Never give any answer or hints to candidates even if they ask for it.

Questions: ${questionList}
`.trim(),
                    },
                ],
            },
        })

        console.log('✅ Assistant created:', assistant.id)

        return NextResponse.json({
            success: true,
            assistantId: assistant.id,
            assistantName: assistant.name
        })

    } catch (error) {
        console.error('Error creating Vapi assistant:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create assistant' },
            { status: 500 }
        )
    }
}
