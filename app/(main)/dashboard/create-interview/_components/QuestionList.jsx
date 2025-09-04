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
      const result = await axios.post('/api/ai-model', {
        ...formdata
      });

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
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          ...formdata,
          questionList: questionslist,
          userEmail: user?.email,
          interview_id: interview_id,
          videoScreening: formdata?.videoScreening || false // add videoScreening field
        },
      ])
      .select()

    setsaveloading(false);
    onCreateLink(interview_id);
    if (error) {
      toast.error('Server Error');
      setErrorMsg('Failed to save interview. Please try again.');
    }
  }

  return (
    <div className="p-6">
      {/* Step description */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Step 2: Review & Confirm Questions</h2>
        <p className="text-gray-500">Below are the AI-generated interview questions based on your job details. You can review them before finishing.</p>
      </div>
      {/* Error message */}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          <AlertTriangle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse min-h-[200px]">
          <Loader2Icon className="w-10 h-10 animate-spin text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-700">Generating Interview Questions...</h2>
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
