import React from 'react'
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
import { ArrowRight } from 'lucide-react'
  
const FormContainer = () => {
  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input placeholder="eg. Full Stack Developer" className="mt-2" />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter details of the job description"
          className="h-[200px] mt-2"
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Preparation</h2>
        <Select>
          <SelectTrigger className="w-full mt-2">
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

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className='flex gap-3 flex-wrap mt-2'>
          {InterviewType.map((type, index) => (
            <div key={index} className="flex items-center cursor-pointer gap-2 p-1 px-2 bg-white 
            border border-grey-300 rounded-2xl 
            hover:bg-secondary">
              <type.icon className='h-4 w-4'/>
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>
          <div className='mt-7 flex justify-end'>
          <Button>Generate Question<ArrowRight/></Button>
          </div>
    </div>
  );
}

export default FormContainer
