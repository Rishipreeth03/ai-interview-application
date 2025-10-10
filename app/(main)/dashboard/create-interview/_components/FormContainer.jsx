import {React, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SideBarOptions,InterviewType } from '@/app/services/Constants'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ArrowRight, Calendar } from 'lucide-react'
import { useState } from "react";
import DateTimePicker from './DateTimePicker';

const FormContainer = ({onHandleInputChange,GoToNext}) => {
  const [interviewType,setInterviewType]=useState([]);

  useEffect(()=>{
      if(interviewType && interviewType.length > 0){
        console.log("Setting interview type:", interviewType);
        onHandleInputChange('type', interviewType);
      } else if(interviewType && interviewType.length === 0) {
        // If all types are deselected, set to null or empty array
        onHandleInputChange('type', []);
      }
  },[interviewType])

  return (
    <div className="p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Interview</h2>
      <div className="space-y-6">
        {/* Job Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Position</label>
          <Input 
            placeholder="e.g. Full Stack Developer" 
            className="mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            onChange={(event)=>onHandleInputChange('jobPosition',event.target.value)}
          />
        </div>
        {/* Job Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
          <Textarea
            placeholder="Enter details of the job description"
            className="h-[120px] mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            onChange={(event)=>onHandleInputChange('jobDescription',event.target.value)}
          />
        </div>
        {/* Interview Preparation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Duration</label>
          <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
            <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5 Min">5 Min</SelectItem>
              <SelectItem value="15 Min">15 Min</SelectItem>
              <SelectItem value="30 Min">30 Min</SelectItem>
              <SelectItem value="45 Min">45 Min</SelectItem>
              <SelectItem value="60 Min">60 Min</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Interview Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Type</label>
          <div className="flex gap-3 flex-wrap mt-1">
            {InterviewType.map((type, index) => {
              const isSelected = interviewType.includes(type.title);
              return (
                <div
                  key={index}
                  className={`flex items-center cursor-pointer gap-2 p-2 px-4 rounded-2xl border transition-colors duration-200
                  ${isSelected ? 'bg-blue-100 text-blue-700 border-blue-300 shadow' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                  onClick={() =>
                    setInterviewType(prev =>
                      isSelected
                        ? prev.filter(item => item !== type.title)
                        : [...prev, type.title]
                    )
                  }
                >
                  <type.icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{type.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
          <Select onValueChange={(value)=>onHandleInputChange('difficulty_level',value)} defaultValue="medium">
            <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            This will affect the complexity of questions generated for the interview.
          </p>
        </div>

        {/* Interview Access Type - New Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Interview Access Type</label>
          <Select onValueChange={(value)=>onHandleInputChange('interview_type',value)} defaultValue="private">
            <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition">
              <SelectValue placeholder="Select Access Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Private interviews are only accessible via direct link. Public interviews may appear in search results.
          </p>
        </div>

        {/* Number of Interviews - New Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Interviews</label>
          <Input 
            type="number"
            min="1"
            defaultValue="1"
            className="mt-1 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            onChange={(event) => {
              const value = parseInt(event.target.value);
              if (value > 0) {
                onHandleInputChange('number_of_interviews', value);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            How many times can this interview be taken with this link.
          </p>
        </div>

        {/* Interview Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700">Interview Schedule</label>
          </div>
          
          {/* Start Time */}
          <div className="mb-4">
            <DateTimePicker 
              label="Start Time"
              value={null} // Let component use default value
              onChange={(value) => onHandleInputChange('start_at', value)}
              hint="When the interview becomes available to candidates"
            />
          </div>
          
          {/* End Time */}
          <div>
            <DateTimePicker 
              label="End Time"
              value={null} // Let component use default value
              onChange={(value) => onHandleInputChange('end_at', value)}
              hint="When the interview will close (must be after start time)"
            />
          </div>
        </div>
        
        {/* Divider */}
        <hr className="my-4 border-gray-200" />
        {/* Generate Button */}
        <div className='flex justify-end'>
          <Button 
            onClick={GoToNext} 
            className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Generate Questions <ArrowRight/>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormContainer
