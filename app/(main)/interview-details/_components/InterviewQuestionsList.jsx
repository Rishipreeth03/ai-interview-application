import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Edit2, 
  Plus, 
  Loader2, 
  Sparkles, 
  Save,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { supabase } from "@/app/services/supaBaseclient"
import axios from 'axios'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function InterviewQuestionsList({ interview, refreshInterview, isDisabled }) {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newQuestionData, setNewQuestionData] = useState({
    question: '',
    type: 'Technical',
    difficulty: 'Medium'
  })

  useEffect(() => {
    if (interview?.questionList) {
      try {
        // Check if questionList is a string that needs to be parsed
        if (typeof interview.questionList === 'string') {
          setQuestions(JSON.parse(interview.questionList))
        } else {
          setQuestions(interview.questionList)
        }
      } catch (error) {
        console.error('Error parsing question list:', error)
        setQuestions([])
        toast.error('Failed to load questions')
      }
    } else {
      setQuestions([])
    }
  }, [interview])

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return
    
    setIsLoading(true)
    try {
      const updatedQuestions = questions.map(q => 
        q === editingQuestion ? newQuestionData : q
      )
      
      await updateQuestionsInDatabase(updatedQuestions)
      setQuestions(updatedQuestions)
      toast.success('Question updated successfully')
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error updating question:', error)
      toast.error('Failed to update question')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!newQuestionData.question.trim()) {
      toast.error('Question text is required')
      return
    }
    
    setIsLoading(true)
    try {
      const updatedQuestions = [...questions, newQuestionData]
      await updateQuestionsInDatabase(updatedQuestions)
      setQuestions(updatedQuestions)
      toast.success('Question added successfully')
      setIsDialogOpen(false)
      // Reset form
      setNewQuestionData({
        question: '',
        type: 'Technical',
        difficulty: 'Medium'
      })
    } catch (error) {
      console.error('Error adding question:', error)
      toast.error('Failed to add question')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuestion = async (questionToDelete) => {
    setIsLoading(true)
    try {
      const updatedQuestions = questions.filter(q => q !== questionToDelete)
      await updateQuestionsInDatabase(updatedQuestions)
      setQuestions(updatedQuestions)
      toast.success('Question deleted successfully')
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete question')
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuestionsInDatabase = async (updatedQuestions) => {
    const { error } = await supabase
      .from('interviews')
      .update({ questionList: updatedQuestions })
      .eq('interview_id', interview.interview_id)
    
    if (error) throw error
    
    // Call the refresh function passed as prop
    if (refreshInterview) {
      refreshInterview()
    }
  }

  const handleRegenerateQuestions = async () => {
    setIsRegenerating(true)
    try {
      // Get the interview details needed for generating questions
      const { jobPosition, jobDescription, duration, type, difficulty_level } = interview
      
      // Call the AI model API to generate new questions
      // Format the request properly
      const typeString = Array.isArray(type) ? type.join(', ') : type;
      
      const response = await axios.post('/api/ai-model', {
        jobPosition,
        jobDescription,
        duration,
        type: typeString,
        seniority: 'Mid-level', // Default value
        language: 'English', // Default value
        difficulty: difficulty_level || 'medium'
      })
      
      let newQuestions = []
      
      if (response.data) {
        // Parse the response to extract questions
        const content = response.data.content
        
        // Try to extract JSON from the response
        try {
          // First try direct JSON parsing
          try {
            const parsedData = JSON.parse(content)
            if (parsedData.interviewQuestions) {
              newQuestions = parsedData.interviewQuestions
              console.log("Successfully parsed JSON directly")
            } else {
              newQuestions = parsedData
            }
          } catch (directParseError) {
            console.log("Direct parsing failed, trying regex extraction")
            
            // Try to extract JSON patterns if direct parsing fails
            const jsonRegex = /\{[\s\S]*?\}/g
            const jsonMatch = content.match(jsonRegex)
            
            if (jsonMatch && jsonMatch[0]) {
              // Clean the JSON string to ensure it's valid
              const cleanJson = jsonMatch[0].replace(/[\n\r\t]/g, "")
              const parsedData = JSON.parse(cleanJson)
              
              if (parsedData.interviewQuestions) {
                newQuestions = parsedData.interviewQuestions
              } else {
                newQuestions = parsedData
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError)
          toast.error('Failed to parse generated questions')
          return
        }
      }
      
      if (newQuestions.length > 0) {
        await updateQuestionsInDatabase(newQuestions)
        setQuestions(newQuestions)
        toast.success('Questions regenerated successfully')
      } else {
        toast.error('Failed to generate new questions')
      }
    } catch (error) {
      console.error('Error regenerating questions:', error)
      toast.error('Failed to regenerate questions')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    setNewQuestionData({
      question: question.question,
      type: question.type || 'Technical',
      difficulty: question.difficulty || 'Medium'
    })
    setIsDialogOpen(true)
  }

  const handleAddNewQuestion = () => {
    setEditingQuestion(null)
    setNewQuestionData({
      question: '',
      type: 'Technical',
      difficulty: 'Medium'
    })
    setIsDialogOpen(true)
  }

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null
    
    const lowerDifficulty = difficulty.toLowerCase()
    if (lowerDifficulty === 'easy') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Easy</Badge>
    } else if (lowerDifficulty === 'medium') {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>
    } else if (lowerDifficulty === 'hard') {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Hard</Badge>
    }
    
    return <Badge>{difficulty}</Badge>
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mt-8"
    >
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-purple-600 opacity-10"></div>
      <div className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 opacity-10"></div>
        
      {/* Card header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 md:p-5 rounded-t-xl flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Interview Questions</h2>
            {isDisabled && (
              <p className="text-white/80 text-xs mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {interview?.status === 'Started' 
                  ? 'Interview in progress - Questions locked' 
                  : 'Interview has ended - Questions locked'}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant="outline"
                    className={`bg-white/20 text-white border-white/30 hover:bg-white/30 flex items-center gap-1 ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
                    onClick={handleAddNewQuestion}
                    disabled={isLoading || isRegenerating || isDisabled}
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                </div>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Cannot add questions while interview is {interview?.status.toLowerCase()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="default"
                    className={`flex items-center gap-1 ${isDisabled 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}`}
                    onClick={handleRegenerateQuestions}
                    disabled={isLoading || isRegenerating || isDisabled}
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Regenerate Questions
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Cannot regenerate questions while interview is {interview?.status.toLowerCase()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-b-xl border border-indigo-100 shadow-lg overflow-hidden">
        {questions.length === 0 ? (
          <div className="p-10 text-center bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="mb-4 p-3 bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No questions available.</p>
            <p className="text-gray-500 text-sm mt-1">Use the AI generator to create interview questions automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-indigo-100">
            {questions.map((question, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-5 hover:bg-indigo-50/50 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 text-indigo-700 h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="font-medium text-gray-800">
                        {question.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 ml-9">
                      {question.type && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2.5 py-0.5 text-xs font-medium rounded-full">
                          {question.type}
                        </Badge>
                      )}
                      {getDifficultyBadge(question.difficulty)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditQuestion(question)}
                              disabled={isLoading || isDisabled}
                              className={`h-8 w-8 p-0 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Edit2 className={`h-4 w-4 ${isDisabled ? 'text-gray-400' : 'text-blue-600'}`} />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {isDisabled && (
                          <TooltipContent>
                            <p>Cannot edit questions while interview is {interview?.status.toLowerCase()}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteQuestion(question)}
                              disabled={isLoading || isDisabled}
                              className={`h-8 w-8 p-0 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Trash2 className={`h-4 w-4 ${isDisabled ? 'text-gray-400' : 'text-red-600'}`} />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {isDisabled && (
                          <TooltipContent>
                            <p>Cannot delete questions while interview is {interview?.status.toLowerCase()}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Question Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              {editingQuestion 
                ? 'Update the question details below.'
                : 'Enter the details for the new question.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Question</label>
              <Textarea 
                value={newQuestionData.question}
                onChange={(e) => setNewQuestionData({...newQuestionData, question: e.target.value})}
                placeholder="Enter your question here"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select 
                  value={newQuestionData.type}
                  onValueChange={(value) => setNewQuestionData({...newQuestionData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Problem-solving">Problem-solving</SelectItem>
                    <SelectItem value="Scenario-based">Scenario-based</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Difficulty</label>
                <Select 
                  value={newQuestionData.difficulty}
                  onValueChange={(value) => setNewQuestionData({...newQuestionData, difficulty: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingQuestion ? handleSaveQuestion : handleAddQuestion}
              disabled={isLoading || !newQuestionData.question.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {editingQuestion ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}