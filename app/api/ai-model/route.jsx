import { QUESTIONS_PROMPT } from "@/app/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai"


export async function POST(req){

    const {jobPosition,jobDescription,duration,type}=await req.json();

    const finalpromt=QUESTIONS_PROMPT
    .replace('{{jobTitle}}',jobPosition)
    .replace('{{jobDescription}}',jobDescription)
    .replace('{{duration}}',duration)
    .replace('{{type}}',type);

    console.log(finalpromt);

    try{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPEN_ROUTER_KEY,
        
      })

      const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: finalpromt }
        ],
      })
      console.log(completion.choices[0].message)
      return NextResponse.json(completion.choices[0].message);

    }
    catch(e){
        console.log(e);
        return NextResponse.json(e);
    }

}