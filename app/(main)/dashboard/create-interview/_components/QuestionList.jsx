import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loader2Icon, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { useUser } from '@/app/provider';
import { supabase } from '@/app/services/supaBaseclient';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({ formdata, onCreateLink }) {
  const [loading, setloading] = useState(false);
  const [questionslist, setquestionslist] = useState([]);
  const { user } = useUser();
  const [saveloading, setsaveloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (formdata) {
      generateQuestionList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formdata]);

  const generateQuestionList = async () => {
    setloading(true);
    setErrorMsg('');
    try {
      // Ensure difficulty_level is included in the payload
      const payload = {
        ...formdata,
        difficulty_level: formdata.difficulty_level || 'medium'
      };
      
      console.log("Sending payload:", payload);
      const result = await axios.post('/api/ai-model', payload);
      
      if (result.data.error) {
        throw new Error(result.data.error);
      }
      
      if (!result.data.content) {
        throw new Error("No content returned from the API");
      }
      
      // The API now sends processed content that should be valid JSON
      const rawContent = result.data.content || "";
      console.log("Raw content:", rawContent.substring(0, 100) + "..."); // Log first 100 chars
      
      // Debug information
      if (result.data.original_content) {
        console.log("Original content snippet:", result.data.original_content);
      }
      
      // Handle different JSON formatting possibilities with more robust error handling
      let parsedData;
      try {
        // First try direct parsing of the processed content from API
        parsedData = JSON.parse(rawContent);
      } catch (parseError) {
        console.error("Initial JSON parsing failed:", parseError);
        
        // Try multiple fallback strategies
        
        // 1. Try removing markdown code blocks
        try {
          const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
          parsedData = JSON.parse(cleanedContent);
          console.log("Parsed JSON after removing markdown blocks");
        } catch (error1) {
          // 2. Try extracting the array pattern manually
          try {
            const arrayMatch = rawContent.match(/(\[[\s\S]*\])/);
            if (arrayMatch && arrayMatch[1]) {
              const jsonStr = `{"interviewQuestions": ${arrayMatch[1]}}`;
              parsedData = JSON.parse(jsonStr);
              console.log("Parsed JSON after extracting array pattern");
            } else {
              throw new Error("No valid JSON array found");
            }
          } catch (error2) {
            // 3. Try fixing common JSON syntax errors
            try {
              // Replace single quotes with double quotes
              const fixedContent = rawContent
                .replace(/'/g, '"')
                .replace(/\s*=\s*/, ': ')
                .trim();
              
              if (fixedContent.startsWith("{") || fixedContent.startsWith("[")) {
                parsedData = JSON.parse(fixedContent);
                console.log("Parsed JSON after syntax fixes");
              } else {
                throw new Error("Content doesn't start with valid JSON markers");
              }
            } catch (error3) {
              console.error("All JSON parsing attempts failed");
              throw new Error("Could not parse the response. Please try again with different job details.");
            }
          }
        }
      }
      
      // Handle the case where we have parsed JSON but it doesn't have the expected structure
      if (!parsedData || !parsedData.interviewQuestions || !Array.isArray(parsedData.interviewQuestions)) {
        console.error("Parsed data doesn't have interviewQuestions array:", parsedData);
        
        // If we have any array in the parsed data, try to use it
        if (parsedData && Array.isArray(parsedData)) {
          console.log("Using root array as questions");
          setquestionslist(parsedData);
        } else {
          throw new Error("The response format was incorrect. Please try again.");
        }
      } else {
        // Normal case - we have the expected structure
        setquestionslist(parsedData.interviewQuestions);
      }
    } catch (e) {
      // Show more specific error message for JSON parsing errors
      if (e instanceof SyntaxError) {
        setErrorMsg(`JSON parsing error: ${e.message}. Please try again.`);
        console.error("JSON parsing error:", e);
        console.error("Response that failed parsing:", result.data.content);
      } else {
        setErrorMsg(`Failed to generate questions. ${e.message || 'Please try again.'}`);
        console.error("Question generation error:", e);
      }
      
      toast.error('Question Generation Error');
    } finally {
      setloading(false);
    }
  };

  const onFinish = async () => {
    setsaveloading(true);
    console.log("Button clicked");
    const interview_id = uuidv4();
    
    // Ensure difficulty_level is properly set with default fallback to 'medium'
    const difficulty_level = formdata?.difficulty_level || 'medium';
    
    // Ensure start_at and end_at are properly formatted ISO strings
    const start_at = formdata?.start_at || null;
    const end_at = formdata?.end_at || null;
    
    const { data, error } = await supabase
      .from('"interviews"')
      .insert([
        {
          ...formdata,
          questionList: questionslist,
          userEmail: user?.email,
          interview_id: interview_id,
          videoScreening: formdata?.videoScreening || false, // add videoScreening field
          difficulty_level, // explicitly include the difficulty_level
          start_at, // include the scheduled start time
          end_at, // include the scheduled end time
          updated_at: new Date().toISOString() // ensure updated_at is set
        },
      ])
      .select()

    setsaveloading(false);
    onCreateLink(interview_id);
    if (error) {
      console.error("Insert error:", error);
      toast.error('Server Error');
      setErrorMsg('Failed to save interview. Please try again.');
    }
  }

  return (
    <div className="p-6">
      {/* Step description */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Step 2: Review & Confirm Questions</h2>
        <p className="text-gray-500">
          Below are the {formdata?.difficulty_level || 'medium'} difficulty AI-generated interview questions based on your job details. You can review them before finishing.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              formdata?.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
              formdata?.difficulty_level === 'hard' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {formdata?.difficulty_level || 'Medium'}
            </span>
          </div>
          
          {formdata?.start_at && formdata?.end_at && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Schedule:</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {new Date(formdata.start_at).toLocaleDateString()} - {new Date(formdata.end_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Error message */}
      {errorMsg && (
        <div className="flex flex-col gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{errorMsg}</span>
          </div>
          <Button 
            onClick={generateQuestionList} 
            variant="outline" 
            className="mt-2 text-sm border-red-300 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse min-h-[200px]">
          <Loader2Icon className="w-10 h-10 animate-spin text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-700">Generating Interview Questions...</h2>
          <p className="text-sm text-gray-500">This may take a moment</p>
        </div>
      ) : questionslist.length === 0 && !errorMsg ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">No questions generated yet</h3>
          <Button 
            onClick={generateQuestionList} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Questions
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {questionslist.length > 0 ? (
            <>
              <div className="bg-white rounded-xl shadow p-4">
                <QuestionListContainer
                  questionslist={questionslist}
                  onChange={setquestionslist}
                />
              </div>
              <div className="mt-6 flex flex-col items-center">
                <Button 
                  onClick={onFinish} 
                  disabled={saveloading}
                  className="w-full max-w-xs"
                >
                  {saveloading ? (
                    <span className="flex items-center gap-2">
                      <Loader2Icon className='animate-spin w-4 h-4' />
                      Saving...
                    </span>
                  ) : (
                    "Create Interview Link And Finish"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No questions found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
