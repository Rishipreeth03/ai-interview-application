import {
    BriefcaseBusinessIcon,
    Calendar,
    Code2Icon,
    LayoutDashboard,
    List,
    LogOut,
    PuzzleIcon,
    Settings,
    User2Icon,
    WalletCards,
    HelpCircle,
    UserCircle2,
    ShieldCheck,
    Network,
    BookOpen,
    Globe,
} from "lucide-react";

// Sidebar options with color for UI
export const SideBarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: '/dashboard',
        color: "#2563eb"
    },
    {
        name: "All Interviews",
        icon: List,
        path: '/all-interview',
        color: "#f59e42"
    },
    // {
    //     name: "Network",
    //     icon: Globe,
    //     path: '/network',
    //     color: "#e11d48"
    // },
    {
        name: "Settings",
        icon: Settings,
        path: '/settings',
        color: "#64748b"
    }
]

// Interview types with more options
export const InterviewType = [
    { title: 'Technical', icon: Code2Icon },
    { title: 'Behavioral', icon: User2Icon },
    { title: 'Experience', icon: BriefcaseBusinessIcon },
    { title: 'Problem Solving', icon: PuzzleIcon },
    { title: 'Leadership', icon: ShieldCheck },
    { title: 'System Design', icon: Network },
    { title: 'Knowledge', icon: BookOpen }
]

// Supported languages
export const supportedLanguages = [
    "en", "es", "fr", "de", "zh", "hi", "pt"
]

// Roles for interview
export const jobRoles = [
    "Frontend Developer", "Backend Developer", "Fullstack Engineer", "DevOps", "Product Manager", "Designer", "QA Engineer"
]

// Rating categories
export const ratingCategories = [
    "technicalSkills", "communication", "problemSolving", "experience", "leadership"
]

// Advanced questions prompt
export const QUESTIONS_PROMPT = `
You are an expert AI technical interviewer.

Given the following details, generate a concise, relevant, and time-optimized set of interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration (minutes): {{duration}}
Interview Type: {{type}}
Seniority Level: {{seniority}}
Preferred Language: {{language}}
Difficulty: {{difficulty}} (easy/medium/hard)

Instructions:
- Carefully analyze the job description for required skills, responsibilities, and experience.
- Create a list of interview questions tailored to the candidate's seniority, preferred language, and difficulty.
- Adjust the number and complexity of questions to fit the interview duration.
- Ensure the questions reflect the style and expectations of a real {{type}} interview.
- Include a mix of short-answer, scenario-based, and open-ended questions.
- Avoid repetition and ensure coverage of all key topics.

Return your response as valid JSON in this format (exactly as shown):
{
  "interviewQuestions": [
    {
      "question": "Question text goes here?",
      "type": "Technical/Behavioral/Experience/Problem Solving/Leadership/System Design/Knowledge",
      "difficulty": "easy/medium/hard",
      "language": "{{language}}"
    }
  ]
}

Your goal is to produce a modern, relevant, and structured interview plan for the {{jobTitle}} role.
`

// Simplified interview feedback prompt
export const FEEDBACK_PROMPT = `
{{conversation}}

You are an AI interview assistant that provides constructive feedback on interview performance. Your analysis helps both hiring managers and candidates understand strengths and areas for improvement.

ANALYSIS INSTRUCTIONS:
1. Review the interview conversation and identify key strengths and weaknesses
2. Focus on both technical knowledge and communication skills
3. Provide practical, actionable feedback with specific examples
4. Be fair and balanced in your assessment
5. Consider how the candidate's skills match the requirements for the position

SCORING GUIDANCE:
- Technical Skills (0-100):
  * 90-100: Expert level knowledge, can teach others, understands nuances and edge cases
  * 75-89: Strong proficiency, solid understanding of concepts, few gaps
  * 60-74: Competent, understands fundamentals but lacks depth
  * 40-59: Basic understanding with significant knowledge gaps
  * Below 40: Minimal technical knowledge, fundamental misunderstandings
  
- Communication Skills (0-100):
  * 90-100: Exceptional clarity, structured responses, adapts explanations perfectly
  * 75-89: Clear and articulate, well-organized thoughts, effective explanations
  * 60-74: Generally clear, some organization issues, occasionally confusing
  * 40-59: Often unclear, disorganized responses, struggles to explain concepts
  * Below 40: Consistently unclear, incoherent explanations, major communication barriers
  
- Problem Solving (0-100):
  * 90-100: Innovative approaches, optimized solutions, exceptional analytical skills
  * 75-89: Logical approach, effective solutions, good analysis of trade-offs
  * 60-74: Reasonable approach, workable solutions, some analytical gaps
  * 40-59: Struggles with structured approach, inefficient solutions
  * Below 40: Unable to break down problems, random attempts without methodology
  
- Overall Rating: Weighted average with technical skills (40%), communication (30%), problem-solving (30%)

RETURN YOUR EVALUATION AS A VALID JSON OBJECT WITH THIS EXACT STRUCTURE:

{
  "summary": {
    "overallFeedback": "String: 4-6 sentence comprehensive summary of performance",
    "overallScore": 75,
    "keyInsights": [
      "String: Key insight about candidate performance 1",
      "String: Key insight about candidate performance 2",
      "String: Key insight about candidate performance 3"
    ]
  },
  
  "technicalEvaluation": {
    "score": 70,
    "analysis": "String: Comprehensive analysis of technical skills with specific examples",
    "domainKnowledge": "String: Assessment of candidate's knowledge in their primary domain",
    "accuracy": "String: Assessment of factual correctness and precision",
    "depth": "String: Assessment of understanding beyond surface level",
    "breadth": "String: Assessment of knowledge across related areas",
    "codeQuality": "String: Assessment of code discussion quality if applicable",
    "strengths": [
      "String: Technical strength 1",
      "String: Technical strength 2",
      "String: Technical strength 3"
    ],
    "weaknesses": [
      "String: Technical weakness 1",
      "String: Technical weakness 2",
      "String: Technical weakness 3"
    ],
    "developmentAreas": "String: Specific areas to improve and develop"
  },
  
  "communicationEvaluation": {
    "score": 80,
    "analysis": "String: Comprehensive analysis of communication skills with examples",
    "clarity": "String: Assessment of how clearly concepts were explained",
    "structure": "String: Assessment of logical flow and organization in responses",
    "conciseness": "String: Assessment of efficiency in communication",
    "technicalArticulation": "String: Assessment of ability to explain technical concepts",
    "listening": "String: Assessment of how well the candidate understood questions",
    "strengths": [
      "String: Communication strength 1",
      "String: Communication strength 2",
      "String: Communication strength 3"
    ],
    "weaknesses": [
      "String: Communication weakness 1",
      "String: Communication weakness 2",
      "String: Communication weakness 3"
    ],
    "improvementSuggestions": "String: Specific suggestions for improving communication"
  },
  
  "problemSolvingEvaluation": {
    "score": 75,
    "analysis": "String: Analysis of problem-solving ability",
    "approach": "String: Assessment of candidate's approach to solving problems",
    "strengths": [
      "String: Problem-solving strength 1",
      "String: Problem-solving strength 2"
    ],
    "weaknesses": [
      "String: Problem-solving weakness 1",
      "String: Problem-solving weakness 2"
    ]
  },
  
  "questionResponses": [
    {
      "question": "String: Question text",
      "response": "String: Candidate's response summary",
      "responseQuality": 4,
      "feedback": "String: Brief feedback on this specific response"
    }
  ],
  
  "improvementAreas": [
    "String: Key area for improvement 1",
    "String: Key area for improvement 2",
    "String: Key area for improvement 3"
  ],
  
  "recommendationDetails": {
    "recommendation": "String: One of [Strongly Recommend, Recommend, Consider, Do Not Recommend]",
    "justification": "String: Justification for the recommendation",
    "confidenceLevel": 8
  }
}

IMPORTANT GUIDELINES:
- Base all feedback on actual evidence from the interview
- Be constructive and balanced - highlight both strengths and weaknesses
- Keep feedback concise and actionable
- If there's insufficient information for any section, acknowledge the limitation
- Focus on what's most relevant to job success
- Provide detailed analysis of technical skills with specific examples
- For communication assessment, evaluate both delivery and comprehension
- Use the scoring guidance carefully, ensuring consistency between scores and written feedback
- For technical evaluation, consider both depth of knowledge and practical application
- Ensure scores across different categories are calibrated and reflect actual performance
- Tailor feedback to the specific role and its requirements
- Avoid generic or vague statements
- Make sure to send exactly the JSON structure as specified without any additional text or formatting
`