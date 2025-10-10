import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ConfirmDetailsAlert({ name, email, onConfirm, onEdit }) {
  return (
    <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800">Are these your details?</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Please confirm that these pre-filled details are correct before proceeding.
          </p>
          
          <div className="bg-white/80 p-3 rounded-md mb-4 border border-yellow-100">
            <div className="mb-1.5">
              <span className="text-xs font-medium text-gray-500">Full Name:</span>
              <p className="font-medium text-gray-800">{name}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Email Address:</span>
              <p className="font-medium text-gray-800">{email}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" /> Yes, these are correct
            </Button>
            <Button 
              variant="outline"
              onClick={onEdit}
              className="border-yellow-300 hover:border-yellow-400 text-yellow-800 flex items-center gap-1.5"
            >
              <X className="h-4 w-4" /> No, I need to edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDetailsAlert;