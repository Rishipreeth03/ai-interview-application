import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { useUser } from '@/app/provider';
import { supabase } from '@/app/services/supaBaseclient';
import {v4 as uuidv4} from 'uuid';
function QuestionList({ formdata ,onCreateLink}) {
  const [loading, setloading] = useState(false);
  const [questionslist, setquestionslist] = useState([]);
  const {user}=useUser();
  const [saveloading,setsaveloading]=useState(false); 
  useEffect(() => {
    if (formdata) {
      generateQuestionList();
    }
  }, [formdata]);

  useEffect(() => {
    console.log('✅ Updated questionslist:', questionslist);
  }, [questionslist]);

  const generateQuestionList = async () => {
    setloading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formdata
      });

      const rawContent = result.data.content.trim();
      const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedContent);

      console.log(parsed.interviewQuestions);
      setquestionslist(parsed.interviewQuestions);
    } catch (e) {
      toast.error('Server Error');
      console.error(e);
    } finally {
      setloading(false);
    }
  };

  const onFinish=async()=>{
        setsaveloading(true);
        console.log("Button clicked");
        const interview_id=uuidv4();
        const { data, error } = await supabase
        .from('interviews')
        .insert([
        { 
            ...formdata,
            questionList:questionslist,
            userEmail:user?.email,
            interview_id:interview_id
         },
        ])
        .select()

        setsaveloading(false);
        onCreateLink(interview_id);
       if(error){
        toast.err('Server Error');
       }
        
  }



  return (
    <div className="p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <Loader2Icon className="w-10 h-10 animate-spin text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-700">Generating Interview Questions...</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {questionslist.length > 0 ? (
            <>
             <QuestionListContainer questionslist={questionslist}/>
             
            
            <div className="mt-6 text-center">
                <Button onClick={()=>onFinish()} disabled={saveloading}>Create Interview Link And Finish</Button>
                {saveloading&&<Loader2Icon className='animate-spin'/>}
              </div>
              </>
              
          ) : (
            <p className="text-gray-500">No questions found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
