import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const AuthError = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
            {message}
          </p>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="ml-3 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded-lg p-1 transition-all duration-200"
              aria-label="Dismiss error"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthError;
