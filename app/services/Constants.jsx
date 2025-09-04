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
        name: "Interview Taken",
        icon: Calendar,
        path: '/interview-taken',
        color: "#059669"
    },
    {
        name: "All Interviews",
        icon: List,
        path: '/all-interview',
        color: "#f59e42"
    },
    {
        name: "Billing",
        icon: WalletCards,
        path: '/billing',
        color: "#e11d48"
    },
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

Based on the following inputs, generate a well-structured, time-optimized list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration (minutes): {{duration}}
Interview Type: {{type}}
Seniority Level: {{seniority}}
Preferred Language: {{language}}
Difficulty: {{difficulty}} (easy/medium/hard)

Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions tailored to the candidate's seniority, preferred language, and required difficulty.
- Adjust the number and depth of questions to match the interview duration.
- Ensure the questions match the tone and structure of a real-life {{type}} interview.
- Include a mix of short-answer, scenario-based, and open-ended questions.
- Avoid repetition and ensure coverage of all relevant topics.

Format your response in JSON:
interviewQuestions = [
  {
    question: '',
    type: 'Technical/Behavioral/Experience/Problem Solving/Leadership/System Design/Knowledge',
    difficulty: 'easy/medium/hard',
    language: '{{language}}'
  },
  ...
]

The goal is to create a structured, relevant, and modern interview plan for a {{jobTitle}} role.
`

// Advanced feedback prompt
export const FEEDBACK_PROMPT = `
{{conversation}}

You are an uncompromising, brutally honest AI interview evaluator.

- Analyze the user's answers, communication style, and problem-solving approach with zero mercy.
- Rate the skills based on actual conversation meaning for an particular question don't just randomly generate scores. If its a zero then mark it as zero for that particular skill no mercy.
- Give a rating out of 10 for each category: Technical Skills, Communication, Problem Solving, Experience, Leadership, based strictly on actual performance.
- Summarize the interview in 3 concise lines, highlighting strengths and exposing weaknesses directly.
- Clearly state if the candidate is recommended for hire, with a blunt one-line justification based on their real interview responses.
- Suggest areas for improvement with direct, no-nonsense feedback. Do not sugarcoat or soften criticism.
- If there was no conversation set the rating to zero, and give a blunt justification.
- Return the response in JSON format:

{
  feedback: {
    rating: {
      technicalSkills: <actual score>,
      communication: <actual score>,
      problemSolving: <actual score>,
      experience: <actual score>,
      leadership: <actual score>
    },
    summary: "<3 brutally honest lines based on the interview>",
    recommendation: <true/false based on actual performance>,
    recommendationMsg: "<direct recommendation message>",
    improvementAreas: ["<direct area 1>", "<direct area 2>", ...]
  }
}
`