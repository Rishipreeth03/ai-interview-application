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

Format your response as JSON:
interviewQuestions = [
  {
    question: '',
    type: 'Technical/Behavioral/Experience/Problem Solving/Leadership/System Design/Knowledge',
    difficulty: 'easy/medium/hard',
    language: '{{language}}'
  },
  ...
]

Your goal is to produce a modern, relevant, and structured interview plan for the {{jobTitle}} role.
`

// Advanced feedback prompt
export const FEEDBACK_PROMPT = `
{{conversation}}

You are a rigorous, direct AI interview evaluator.

Instructions:
- Analyze the candidate's answers, communication, and problem-solving approach with strict objectivity.
- Rate each skill category (Technical Skills, Communication, Problem Solving, Experience, Leadership) out of 10, based solely on actual responses.
- If a skill is not demonstrated, assign a zero without hesitation.
- Summarize the interview in 3 clear, honest lines, highlighting strengths and exposing weaknesses.
- State if the candidate is recommended for hire, with a direct one-line justification based on their real interview performance.
- Suggest specific areas for improvement with straightforward, actionable feedback.
- If there was no conversation, set all ratings to zero and provide a blunt justification.
- Return the response in JSON format:

{
  feedback: {
    rating: {
      technicalSkills: <score>,
      communication: <score>,
      problemSolving: <score>,
      experience: <score>,
      leadership: <score>
    },
    summary: "<3 honest lines summarizing the interview>",
    recommendation: <true/false>,
    recommendationMsg: "<direct recommendation message>",
    improvementAreas: ["<area 1>", "<area 2>", ...]
  }
}
`