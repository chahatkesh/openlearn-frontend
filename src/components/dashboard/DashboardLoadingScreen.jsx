import React from 'react';
import { BookOpen, Clock, Target, TrendingUp, Loader2 } from 'lucide-react';

/**
 * Enhanced Loading Screen for Dashboard
 * Shows progressive loading indicators and tips for better UX
 */
const DashboardLoadingScreen = ({ 
  loadingPhase = 'initializing',
  progress = 0,
  showTips = true
}) => {
  const loadingMessages = {
    'initializing': 'Initializing dashboard...',
    'loading basic data': 'Loading your learning data...',
    'loading league details': 'Fetching league information...',
    'loading resource progress': 'Loading your progress...',
    'calculating statistics': 'Calculating statistics...',
    'complete': 'Almost ready!'
  };

  const tips = [
    { icon: BookOpen, text: "Use the search bar to quickly find leagues and assignments" },
    { icon: Target, text: "Click on league cards to view detailed progress and resources" },
    { icon: TrendingUp, text: "Track your completion rates in the progress dashboard" },
    { icon: Clock, text: "Your progress is automatically saved as you complete resources" }
  ];

  const getCurrentTip = () => {
    const tipIndex = Math.floor(progress / 25) % tips.length;
    return tips[tipIndex];
  };

  const currentTip = getCurrentTip();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        {/* Main Loading Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFDE59] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">OpenLearn</h1>
            <p className="text-sm text-gray-600">Loading your dashboard</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {loadingMessages[loadingPhase] || 'Loading...'}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFDE59] mx-auto" />
          </div>

          {/* Loading Tip */}
          {showTips && currentTip && (
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <currentTip.icon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Tip</p>
                  <p className="text-sm text-gray-600">{currentTip.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading States for Different Phases */}
          {progress < 25 && (
            <div className="mt-4 text-xs text-gray-500">
              Setting up your learning environment...
            </div>
          )}
          {progress >= 25 && progress < 50 && (
            <div className="mt-4 text-xs text-gray-500">
              Fetching your enrolled leagues...
            </div>
          )}
          {progress >= 50 && progress < 75 && (
            <div className="mt-4 text-xs text-gray-500">
              Loading your progress data...
            </div>
          )}
          {progress >= 75 && progress < 100 && (
            <div className="mt-4 text-xs text-gray-500">
              Finalizing dashboard...
            </div>
          )}
        </div>

        {/* Optional Skeleton Preview */}
        <div className="mt-6 space-y-3 opacity-30">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoadingScreen;
