import React from 'react';
import { AlertCircle } from 'lucide-react';

const AuthError = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-600">{message}</p>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthError;
