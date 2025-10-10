# Vapi Integration for AI-Recruiter

This document provides an overview of how the Vapi AI voice assistant has been integrated into the video interview feature of the AI-Recruiter application.

## Overview

We've implemented Vapi for both the standard interview mode and the video interview mode, providing a consistent experience across both interview types. The video interview now uses the same Vapi AI assistant to ask questions and respond to candidate answers, while still recording video for later review.

## Implementation Details

### 1. Video Interview with Vapi

The video interview now uses Vapi for both asking questions and processing answers, similar to how the regular interview mode works. This includes:

- Voice interactions with the AI interviewer
- Real-time transcription of candidate responses
- AI-driven follow-up questions and comments
- Video recording of the entire session

### 2. Key Components

- `useVideoInterviewLogic.js`: Core hook that manages the Vapi integration, transcription, and interview flow
- `VapiVideoRecorder.jsx`: Component that handles video capture while working with Vapi voice interactions
- Updated `page.jsx`: Combines all components and handles the interview process

### 3. Features

- **AI-Driven Questions**: The Vapi assistant asks questions from the predefined question list
- **Interactive Responses**: The AI can respond to candidate answers with follow-up questions
- **Voice Settings**: Users can adjust the AI voice settings (speed, clarity)
- **Interruptions**: Users can enable interruptions to speak over the AI if needed
- **Question Repetition**: Users can ask the AI to repeat or clarify questions
- **Video Recording**: The entire interview is still recorded visually
- **Silence Detection**: The system can detect when a candidate is silent and offer hints

### 4. How It Works

1. The interview initializes with questions loaded from the database
2. Vapi starts the interview with a greeting and first question
3. The candidate responds verbally
4. Vapi processes the response and provides feedback
5. This cycle continues until all questions are answered
6. The interview concludes with AI feedback generation

### 5. UI Controls

- **Next Question**: Manually advance to the next question
- **End Interview**: Stop the interview and generate feedback
- **Enable Interruptions**: Allow the candidate to interrupt the AI
- **Repeat Question**: Ask the AI to repeat the current question
- **Adjust Voice**: Modify the AI voice characteristics

## Benefits

- **Consistent Experience**: Same AI interview experience across both modes
- **Natural Conversation**: More natural back-and-forth with the AI interviewer
- **Better Feedback**: More comprehensive data for generating feedback
- **Reduced Technical Issues**: Fewer issues with transcription and timing
- **Enhanced Candidate Experience**: More engaging and responsive interview process

## Dependencies

This implementation relies on:
- Vapi AI SDK (`@vapi-ai/web`)
- Next.js
- React
- Supabase

## Usage Notes

Make sure the `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is properly set in your environment variables for this integration to work correctly.