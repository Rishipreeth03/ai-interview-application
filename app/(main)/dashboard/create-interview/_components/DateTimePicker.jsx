import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { Calendar, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

/**
 * DateTimePicker component for selecting date and time
 * @param {Object} props Component props
 * @param {string} props.label Label for the date time picker
 * @param {string} props.value Current value (ISO string)
 * @param {Function} props.onChange Change handler function
 * @param {string} props.minDate Minimum allowed date (ISO string)
 * @param {string} props.hint Optional hint text
 */
const DateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  minDate = null,
  hint 
}) => {
  const now = moment();
  const defaultDate = value ? moment(value) : now.clone().add(1, 'hour').startOf('hour');
  
  // Internal state
  const [date, setDate] = useState(defaultDate.format('YYYY-MM-DD'));
  const [hour, setHour] = useState(defaultDate.format('HH'));
  const [minute, setMinute] = useState(defaultDate.format('mm'));
  
  // Calculate minimum allowed date
  const minimumDate = minDate ? moment(minDate) : now;
  
  // Generate hours and minutes for dropdown
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  // Use a ref to track if this is the first render and handle debounce
  const isInitialRender = useRef(true);
  const updateTimeout = useRef(null);

  // Update the value when internal state changes with debounce
  useEffect(() => {
    // Skip the initial render to prevent the infinite loop
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    // Clear any pending updates
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
    
    // Debounce updates to prevent excessive validation
    updateTimeout.current = setTimeout(() => {
      const dateTimeString = `${date}T${hour}:${minute}:00`;
      const dateTime = moment(dateTimeString);
      
      // Only trigger onChange if it's a valid date
      if (dateTime.isValid()) {
        onChange(dateTime.toISOString());
      }
    }, 300); // 300ms debounce
    
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [date, hour, minute]);

  // Validate the selected date is not before minimum - without toast messages
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const dateTime = moment(`${newDate}T${hour}:${minute}:00`);
    
    if (dateTime.isBefore(minimumDate, 'day')) {
      // If before minimum, set to minimum date - silently correct without toast
      setDate(minimumDate.format('YYYY-MM-DD'));
    } else {
      setDate(newDate);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Date Picker */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={date}
            onChange={handleDateChange}
            min={minimumDate.format('YYYY-MM-DD')}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        
        {/* Time Picker - Using Select for better UX */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <div className="flex">
              {/* Hour Select */}
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {hours.map(h => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <span className="text-gray-500 font-bold">:</span>
          
          {/* Minute Select */}
          <div className="flex-1">
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map(m => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {hint && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default DateTimePicker;