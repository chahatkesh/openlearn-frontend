import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced progress indicator for async operations
 * Shows a subtle loading indicator that doesn't interfere with the UI
 */
const ProgressIndicator = ({ 
  isLoading, 
  message = "Loading...", 
  size = "sm",
  position = "top-right",
  showMessage = false 
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const positionClasses = {
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50",
    "inline": "inline-flex"
  };

  return (
    <div className={`${positionClasses[position]} ${position !== 'inline' ? 'animate-slide-in-right' : ''}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center space-x-2">
        <Loader2 className={`${sizeClasses[size]} text-[#FFDE59] animate-spin`} />
        {showMessage && (
          <span className="text-sm text-gray-600 font-medium">{message}</span>
        )}
      </div>
    </div>
  );
};

/**
 * Resource loading indicator for sections
 * Shows inline loading state with progress
 */
export const SectionLoadingIndicator = ({ 
  sectionName, 
  isLoading, 
  progress = 0 
}) => {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center py-4 space-x-3">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FFDE59]"></div>
      <div className="text-sm text-gray-600">
        Loading {sectionName ? `${sectionName} resources` : 'resources'}...
      </div>
      {progress > 0 && (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FFDE59] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

/**
 * Week expansion loading indicator
 * Shows when a week is being expanded and resources are loading
 */
export const WeekExpansionLoader = ({ weekName }) => (
  <div className="px-6 py-4 border-t border-gray-100">
    <div className="flex items-center justify-center space-x-3">
      <div className="animate-pulse flex space-x-2">
        <div className="w-2 h-2 bg-[#FFDE59] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#FFDE59] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-[#FFDE59] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-600">
        Loading {weekName} content...
      </span>
    </div>
  </div>
);

/**
 * Floating action loader
 * Shows when an action is being processed (like marking complete)
 */
export const ActionLoader = ({ 
  isVisible, 
  message = "Processing...", 
  type = "default" 
}) => {
  if (!isVisible) return null;

  const typeStyles = {
    default: "bg-white border-gray-200 text-gray-700",
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-700"
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className={`${typeStyles[type]} rounded-lg shadow-lg border px-4 py-3 flex items-center space-x-3 backdrop-blur-sm`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

/**
 * Background sync indicator
 * Shows subtle indicator when background operations are happening
 */
export const BackgroundSyncIndicator = ({ 
  isActive, 
  operations = [] 
}) => {
  if (!isActive || operations.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 flex items-center space-x-2 text-xs">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>
          {operations.length === 1 
            ? operations[0]
            : `${operations.length} operations in progress`
          }
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
