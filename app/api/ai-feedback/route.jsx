import { FEEDBACK_PROMPT } from "@/app/services/Constants";
import { NextResponse } from 'next/server';
import { supabase } from '@/app/services/supaBaseclient';
import { getMuxAsset } from '@/lib/mux-config';
import { Ollama } from "ollama";

export async function POST(req) {
    const { interview_id, responses, role, conversation, interviewData, ensureFeedback } = await req.json();
    
    // Check if we have a valid conversation
    const hasValidConversation = Array.isArray(conversation) && conversation.length > 0;
    
    // Get Mux video data if interview_id is provided
    let videoAnalysisData = null;
    
    if (interview_id) {
        try {
            // Get the Mux asset ID from Supabase
            const { data: interviewData, error: interviewError } = await supabase
                .from('interviews')
                .select('mux_asset_id, video_duration, video_playback_id')
                .eq('interview_id', interview_id)
                .single();
                
            if (!interviewError && interviewData?.mux_asset_id) {
                // Get the Mux asset details
                const asset = await getMuxAsset(interviewData.mux_asset_id);
                
                // Extract relevant metrics for analysis
                videoAnalysisData = {
                    duration: asset.duration,
                    maxStoredResolution: asset.max_stored_resolution,
                    maxStoredFrameRate: asset.max_stored_frame_rate,
                    aspectRatio: asset.aspect_ratio,
                    hasAudio: asset.tracks.some(track => track.type === 'audio'),
                    hasVideo: asset.tracks.some(track => track.type === 'video'),
                    audioCodec: asset.tracks.find(track => track.type === 'audio')?.codec,
                    videoCodec: asset.tracks.find(track => track.type === 'video')?.codec,
                };
            }
        } catch (error) {
            console.error('Error fetching Mux video data:', error);
            // Continue without video analysis data
        }
    }
    
    // Create input data for the feedback prompt
    const inputData = {
        conversation: conversation || [],
        responses: responses || [],
        role: role || "this position",
        videoAnalysis: videoAnalysisData,
        interviewData: interviewData || {}
    };
    
    // Create the feedback prompt with proper conversation data, ensuring we always use the standard format
    let finalPrompt;
    
    // Prepare the conversation data based on what's available
    let conversationData;
    
    if ((!hasValidConversation && !responses?.length) && ensureFeedback) {
        // For empty conversations, create a placeholder conversation with context
        conversationData = JSON.stringify([
            {
                role: "system",
                content: "The interview was initiated, but no conversation was recorded or the candidate did not engage. This might be due to technical difficulties or other issues."
            },
            {
                role: "assistant",
                content: "Please provide an assessment based on the limited information available. Note that this assessment is limited due to insufficient interaction data."
            },
            {
                role: "system",
                content: `Additional context: ${JSON.stringify(inputData)}`
            }
        ]);
    } else if (responses && responses.length > 0) {
        // For structured responses, format them as a conversation
        const formattedResponses = responses.map((response, index) => ({
            role: index % 2 === 0 ? "assistant" : "user",
            content: response.question || response.response
        }));
        
        // Add video analysis data if available
        if (videoAnalysisData) {
            formattedResponses.push({
                role: "system",
                content: `Video analysis data: ${JSON.stringify(videoAnalysisData)}`
            });
        }
        
        // Add role information
        formattedResponses.push({
            role: "system",
            content: `Role interviewing for: ${role || "this position"}`
        });
        
        conversationData = JSON.stringify(formattedResponses);
    } else {
        // Use the provided conversation or empty array if none
        conversationData = JSON.stringify(conversation || []);
    }
    
    // Always use the standard feedback prompt with the appropriate conversation data
    finalPrompt = FEEDBACK_PROMPT.replace('{{conversation}}', conversationData);

    try {
        // Initialize Ollama client with just the API key
        const ollama = new Ollama({
            host: "https://ollama.com", // Using default Ollama.com API endpoint
            headers: {
                Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
            }
        });

        // Use a default model that's widely available on Ollama
        const OLLAMA_MODEL = "gpt-oss:120b"; // Using the same model as in ai-model/route.jsx

        console.log("Sending request to Ollama with model:", OLLAMA_MODEL);
        
        try {
            console.log("Using standardized feedback prompt for all interview scenarios");
            
            // Using the non-streaming approach for simplicity in handling the response
            const response = await ollama.chat({
                model: OLLAMA_MODEL,
                messages: [
                    {
                        "role": "system",
                        "content": "You are an expert interview feedback analyzer. Always provide detailed, constructive feedback in the exact JSON format specified in the prompt. Ensure the response is valid JSON."
                    },
                    {
                        "role": "user", 
                        "content": finalPrompt
                    }
                ],
                stream: false,
                options: {
                    temperature: 0.2
                }
            });
            
            console.log("Received response from Ollama successfully");
            
            // Format the response to match the expected structure
            const formattedResponse = {
                content: response.message.content,
                role: "assistant"
            };
            
            console.log("AI Feedback generated:", formattedResponse.content.substring(0, 100) + "...");
            return NextResponse.json(formattedResponse);
            
        } catch (ollamaError) {
            console.error("Specific Ollama API error:", ollamaError);
            throw ollamaError; // Re-throw to be caught by the outer try-catch
        }
    }
    catch (e) {
        console.error("Error generating AI feedback with Ollama:", e);
        return NextResponse.json({ 
            error: e.message || String(e),
            content: "We couldn't generate feedback at this time. This might be due to an empty conversation, a technical issue with the Ollama service, or authentication problems.",
            model: "gpt-oss:120b"
        }, {
            status: 500
        });
    }
}