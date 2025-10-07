import { QUESTIONS_PROMPT } from "@/app/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai"


export async function POST(req){

    const {jobPosition, jobDescription, duration, type, difficulty_level} = await req.json();

    // Convert type array to string if needed
    const typeString = Array.isArray(type) ? type.join(', ') : type;
    
    const finalpromt = QUESTIONS_PROMPT
    .replace('{{jobTitle}}', jobPosition || '')
    .replace('{{jobDescription}}', jobDescription || '')
    .replace('{{duration}}', duration || '')
    .replace('{{type}}', typeString || '')
    .replace('{{difficulty}}', difficulty_level || 'medium')
    .replace('{{seniority}}', 'Not specified') // Default seniority
    .replace('{{language}}', 'English'); // Default language

    console.log(finalpromt);

    try {
      // Check if we have all required fields
      if (!jobPosition || !jobDescription || !duration || !typeString) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPEN_ROUTER_KEY,
      })

      const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `You are an AI assistant that generates structured interview questions in valid JSON format.
                     Always respond with properly formatted JSON that can be parsed with JSON.parse().
                     Return the response as a JSON object with an 'interviewQuestions' key containing an array of question objects.
                     Example format: {"interviewQuestions": [{"question": "...", "type": "...", "difficulty": "...", "language": "..."}]}
                     Do not include any markdown formatting, code blocks, or explanatory text.`
          },
          { role: "user", content: finalpromt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
      
      console.log("AI response received");
      const responseMessage = completion.choices[0].message;
      const content = responseMessage.content;
      
      // Add additional logging
      console.log("Response length:", content.length);
      console.log("Response preview:", content.substring(0, 100) + "...");
      
      // Try to extract and fix JSON from the response
      let processedContent = content;
      try {
        // Find JSON-like pattern starting with interviewQuestions =
        const interviewQuestionsMatch = content.match(/interviewQuestions\s*=\s*(\[[\s\S]*\])/);
        
        if (interviewQuestionsMatch && interviewQuestionsMatch[1]) {
          // Extract just the array part
          const jsonArrayString = interviewQuestionsMatch[1];
          
          // Create a valid JSON object with the interviewQuestions property
          processedContent = `{"interviewQuestions": ${jsonArrayString}}`;
          
          // Validate it's parseable
          JSON.parse(processedContent);
          console.log("Successfully extracted JSON array");
        } else {
          // If no match, try to find any JSON array in the content
          const arrayMatch = content.match(/(\[[\s\S]*\])/);
          
          if (arrayMatch && arrayMatch[1]) {
            processedContent = `{"interviewQuestions": ${arrayMatch[1]}}`;
            JSON.parse(processedContent); // Validate
            console.log("Extracted JSON array from content");
          }
        }
      } catch (e) {
        console.error("Failed to extract valid JSON:", e);
        // Keep original content if parsing fails
      }
      
      return NextResponse.json({
        content: processedContent,
        original_content: content.substring(0, 200) + "..." // Include the first 200 chars for debugging
      });
    }
    catch(e){
        console.error("API Error:", e);
        return NextResponse.json(
          { error: "Failed to generate questions", details: e.message },
          { status: 500 }
        );
    }

}