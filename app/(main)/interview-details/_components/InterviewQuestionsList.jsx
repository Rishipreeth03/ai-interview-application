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
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Interview Questions</h2>
          {isDisabled && (
            <p className="text-amber-600 text-xs mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {interview?.status === 'Started' 
                ? 'Interview in progress - Questions cannot be modified' 
                : 'Interview has ended - Questions cannot be modified'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant="outline" 
                    className={`flex items-center gap-1 ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

      <div className="bg-white rounded-lg border shadow">
        {questions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No questions available. Click "Regenerate Questions" to create new ones.</p>
          </div>
        ) : (
          <div className="divide-y">
            {questions.map((question, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {index + 1}. {question.question}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {question.type && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
              </div>
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
    </div>
  )
}