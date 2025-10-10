import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loader2Icon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner'; // Updated to use sonner for consistent toast notifications
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
      const result = await axios.post('/api/ai-model', {
        ...formdata
      });
      console.log(result.data);
      const rawContent = result.data.content.trim();
      const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedContent);

      setquestionslist(parsed.interviewQuestions);
    } catch (e) {
      setErrorMsg('Failed to generate questions. Please try again.');
      toast.error('Server Error');
      console.error(e);
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
    
    try {
      // Sanitize the data before insertion
      const interviewData = {
        ...formdata,
        questionList: questionslist,
        userEmail: user?.email,
        interview_id: interview_id,
        videoScreening: formdata?.videoScreening || false,
        difficulty_level,
        start_at,
        end_at,
        status: "Not Started", // Add status field
        interview_type: formdata?.interview_type || 'private', // Ensure new fields are included
        number_of_interviews: formdata?.number_of_interviews || 1, // Default to 1 if not set
        updated_at: new Date().toISOString()
      };

      // Remove any undefined values to prevent database errors
      Object.keys(interviewData).forEach(key => 
        interviewData[key] === undefined && delete interviewData[key]
      );

      const { data, error } = await supabase
        .from('interviews') // Remove the quotes around the table name
        .insert([interviewData])
        .select();

      if (error) {
        console.error("Insert error:", error);
        toast.error('Server Error: ' + error.message);
        setErrorMsg('Failed to save interview. Please try again.');
        setsaveloading(false);
        return;
      }
      
      setsaveloading(false);
      onCreateLink(interview_id);
    } catch (err) {
      console.error("Exception during insert:", err);
      toast.error('Unexpected error occurred');
      setErrorMsg('Failed to save interview due to an unexpected error.');
      setsaveloading(false);
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
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={generateQuestionList} 
              variant="outline" 
              className="text-sm border-red-300 hover:bg-red-100"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => {
                // Try with simplified job description
                const simplifiedData = {
                  ...formdata,
                  jobDescription: formdata.jobPosition // Use just the job title as description
                };
                setloading(true);
                setErrorMsg('');
                axios.post('/api/ai-model', simplifiedData, {
                  timeout: 60000,
                  headers: { 'Content-Type': 'application/json' }
                })
                .then(result => {
                  if (result.data.error) {
                    throw new Error(result.data.error);
                  }
                  
                  if (!result.data.content) {
                    throw new Error("No content returned");
                  }
                  
                  const parsedData = JSON.parse(result.data.content);
                  if (parsedData.interviewQuestions && Array.isArray(parsedData.interviewQuestions)) {
                    setquestionslist(parsedData.interviewQuestions);
                    toast.success("Successfully generated questions with simplified job details");
                  } else {
                    throw new Error("Invalid response format");
                  }
                })
                .catch(err => {
                  console.error("Simplified attempt failed:", err);
                  toast.error("Simplified attempt also failed. Please try changing job details.");
                  setErrorMsg(errorMsg + "\n\nSimplified attempt also failed.");
                })
                .finally(() => {
                  setloading(false);
                });
              }}
              variant="secondary" 
              className="text-sm"
            >
              Try With Simplified Details
            </Button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px] border border-indigo-100 rounded-lg p-6 bg-indigo-50">
          <div className="relative">
            <Loader2Icon className="w-12 h-12 animate-spin text-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Generating Interview Questions...</h2>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-600">Our AI is crafting custom questions for this position</p>
            <p className="text-xs text-gray-500 mt-1">This typically takes 15-30 seconds</p>
          </div>
          <div className="w-full max-w-xs mt-2">
            <div className="h-1 w-full bg-indigo-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full animate-progress-indeterminate"></div>
            </div>
          </div>
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
