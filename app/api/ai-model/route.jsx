import { QUESTIONS_PROMPT } from "@/app/services/Constants";
import { NextResponse } from "next/server";
import { Ollama } from "ollama";

export async function POST(req){
    // Define CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    try {
        const {jobPosition, jobDescription, duration, type, difficulty, seniority, language} = await req.json();
        
        // Validate required fields
        if (!jobPosition || !jobDescription) {
            return NextResponse.json(
                { 
                    error: "Missing required fields",
                    details: "Job position and job description are required", 
                    content: null
                },
                { 
                    status: 400,
                    headers: corsHeaders
                }
            );
        }

        const finalpromt = QUESTIONS_PROMPT
            .replace('{{jobTitle}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{duration}}', duration || '30 minutes')
            .replace('{{type}}', type || 'general')
            .replace('{{seniority}}', seniority || 'mid-level')
            .replace('{{language}}', language || 'English')
            .replace('{{difficulty}}', difficulty || 'medium');

        console.log(finalpromt);

        // Initialize Ollama client
        const ollama = new Ollama({
            host: "https://ollama.com",
            headers: {
                Authorization: "Bearer 09d9a371c3224f359906cb6c92ef7ddd.0yh8d0OPHTGvuwSFWRwnaIfB"
            }
        });

        // Add JSON formatting instructions
        const enhancedPrompt = `${finalpromt}\n\nIMPORTANT: Return your response as valid JSON with this exact structure:
        {
          "interviewQuestions": [
            {
              "question": "Question text",
              "type": "Question category",
              "difficulty": "medium"
            }
          ]
        }
        Do not include any explanations, markdown formatting, or additional text.`;

        console.log("Sending request to Ollama Cloud...");
        
        // Using the non-streaming approach for simplicity in handling the response
        const response = await ollama.chat({
            model: "gpt-oss:120b", // Using the model from your example
            messages: [
                {
                    "role": "system",
                    "content": "You are an expert interview question generator. Always provide responses in valid JSON format."
                },
                {
                    "role": "user", 
                    "content": enhancedPrompt
                }
            ],
            stream: false
        });

        console.log("Received response from Ollama Cloud");
        
        // Format the response properly for the client
        return NextResponse.json({
            content: response.message.content,
            error: null,
            details: null,
            model: "gpt-oss:120b (Ollama Cloud)"
        }, {
            headers: corsHeaders
        });
    } catch(e) {
        console.error("Error generating questions:", e);
        return NextResponse.json({
            error: "Failed to generate questions",
            details: e.message || "An unexpected error occurred",
            content: null
        }, { 
            status: 500,
            headers: corsHeaders
        });
    }
}

// Handle OPTIONS requests (for CORS preflight)
export async function OPTIONS() {
    return NextResponse.json({}, { 
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        status: 200 
    });
}