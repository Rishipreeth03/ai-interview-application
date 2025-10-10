import React, { useState, useEffect } from 'react';
import { Calendar, X, Save, Users, Lock } from 'lucide-react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/app/services/supaBaseclient';
import moment from 'moment';
import DateTimePicker from '../../dashboard/create-interview/_components/DateTimePicker';

export default function EditScheduleDialog({ isOpen, onClose, interview, onScheduleUpdated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startAt, setStartAt] = useState(interview?.start_at || null);
  const [endAt, setEndAt] = useState(interview?.end_at || null);
  const [numberOfInterviews, setNumberOfInterviews] = useState(interview?.number_of_interviews || 1);
  const [interviewType, setInterviewType] = useState(interview?.interview_type || 'private');
  const [appliedCount, setAppliedCount] = useState(interview?.applied_count || 0);
  
  // Reset form when dialog opens with fresh data
  useEffect(() => {
    if (isOpen && interview) {
      setStartAt(interview.start_at);
      setEndAt(interview.end_at);
      setNumberOfInterviews(interview.number_of_interviews || 1);
      setInterviewType(interview.interview_type || 'private');
      setAppliedCount(interview.applied_count || 0);
    }
  }, [isOpen, interview]);

  const handleStartAtChange = (value) => {
    setStartAt(value);
    
    // Ensure end time is after start time (at least 30 minutes later)
    const newStartAt = moment(value);
    const currentEndAt = moment(endAt);
    
    // If end time is before or equal to new start time, adjust it
    if (currentEndAt.isSameOrBefore(newStartAt)) {
      const newEndAt = newStartAt.clone().add(30, 'minutes');
      setEndAt(newEndAt.toISOString());
    }
  };

  const validateNumberOfInterviews = (value) => {
    // Parse the input as a number
    const num = parseInt(value, 10);
    
    // Must be a valid number
    if (isNaN(num)) return false;
    
    // Must be at least 1
    if (num < 1) return false;
    
    // Must be at least equal to the number of candidates already applied
    if (num < appliedCount) return false;
    
    return true;
  };

  const handleSubmit = async () => {
    // Validate dates
    const startMoment = moment(startAt);
    const endMoment = moment(endAt);
    
    if (!startMoment.isValid() || !endMoment.isValid()) {
      toast.error('Please select valid start and end dates');
      return;
    }
    
    if (endMoment.isSameOrBefore(startMoment)) {
      toast.error('End time must be after start time');
      return;
    }
    
    // Validate number of interviews
    if (!validateNumberOfInterviews(numberOfInterviews)) {
      toast.error(`Number of interviews must be at least ${appliedCount} (current number of applied candidates)`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update interview schedule in database
      const { error } = await supabase
        .from('interviews')
        .update({
          start_at: startAt,
          end_at: endAt,
          number_of_interviews: numberOfInterviews,
          interview_type: interviewType,
          updated_at: new Date().toISOString()
        })
        .eq('interview_id', interview.interview_id);
      
      if (error) throw error;
      
      // Create updated data object to pass to parent
      const updatedData = {
        start_at: startAt,
        end_at: endAt,
        number_of_interviews: numberOfInterviews,
        interview_type: interviewType,
        updated_at: new Date().toISOString()
      };
      
      toast.success('Interview details updated successfully');
      
      // Notify parent component with the updated data
      if (onScheduleUpdated) {
        onScheduleUpdated(updatedData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating interview details:', error);
      toast.error('Failed to update interview details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Edit Interview Details
          </DialogTitle>
          <DialogDescription>
            Update the schedule, slots, and access type for this interview
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Interview Schedule section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-500" />
              Interview Schedule
            </h3>
            
            {/* Start Time */}
            <DateTimePicker 
              label="Start Time"
              value={startAt} 
              onChange={handleStartAtChange}
              hint="When the interview becomes available to candidates"
            />
            
            {/* End Time */}
            <DateTimePicker 
              label="End Time"
              value={endAt} 
              onChange={setEndAt}
              minDate={startAt}
              hint="When the interview will close (must be after start time)"
            />
          </div>
          
          {/* Interview Configuration section */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              Interview Configuration
            </h3>
            
            {/* Number of Interviews */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Slots
              </label>
              <Input 
                type="number"
                min={appliedCount}
                value={numberOfInterviews}
                onChange={(e) => setNumberOfInterviews(parseInt(e.target.value) || 1)}
                className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {appliedCount > 0 ? 
                  `Must be at least ${appliedCount} (current number of candidates)` : 
                  'How many times this interview can be taken'
                }
              </p>
            </div>
            
            {/* Interview Access Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Type
              </label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Select access type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-blue-500" />
                      <span>Private</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-green-500" />
                      <span>Public</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Private interviews are only accessible via direct link
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 justify-end">
          <Button 
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex gap-1.5 items-center"
          >
            {isSubmitting ? 'Saving...' : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}