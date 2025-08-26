import React from 'react';
import { CheckCircle, Circle, Award, TrendingUp, Calendar, Share2, BookOpen } from 'lucide-react';
import ProgressService from '../../../utils/progressService';
import SocialService from '../../../utils/socialService';

const ProgressCard = ({ enrollment, onClick }) => {
  const progressPercentage = enrollment.progress.progressPercentage || 0;
  const completedSections = enrollment.progress.completedSections || 0;
  const totalSections = enrollment.progress.totalSections || 0;
  const progressStatus = ProgressService.getProgressStatus(progressPercentage);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareData = {
      name: enrollment.league.name,
      sectionsCount: totalSections,
      completedSections: completedSections,
      progressPercentage: progressPercentage
    };
    SocialService.showShareModal('league', shareData);
  };

  const getProgressColor = () => {
    if (progressPercentage === 100) return 'from-green-400 to-green-600';
    if (progressPercentage >= 75) return 'from-orange-400 to-orange-600';
    if (progressPercentage >= 50) return 'from-yellow-400 to-yellow-600';
    if (progressPercentage >= 25) return 'from-blue-400 to-blue-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-all duration-300 hover:border-[#FFDE59]"
      onClick={() => onClick(enrollment.league)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {enrollment.league.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {enrollment.league.description}
          </p>
          
          {/* Enrollment Date */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Calendar size={12} className="mr-1" />
            Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {progressPercentage === 100 && (
            <div className="flex items-center">
              <Award className="text-[#FFDE59]" size={24} />
            </div>
          )}
          
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-[#FFDE59] transition-colors p-1"
            title="Share progress"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-[#FFDE59]">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${getProgressColor()} h-3 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 15 && (
              <div className="absolute right-2 top-0 h-full flex items-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Status */}
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs font-medium ${
            progressStatus.color === 'green' ? 'text-green-600' :
            progressStatus.color === 'orange' ? 'text-orange-600' :
            progressStatus.color === 'yellow' ? 'text-yellow-600' :
            progressStatus.color === 'blue' ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {progressStatus.text}
          </span>
          <span className="text-xs text-gray-500">
            {completedSections}/{totalSections} sections
          </span>
        </div>
      </div>

      {/* Stats Grid - Responsive layout */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4">
        <div className="p-2 rounded-lg bg-green-50">
          <div className="text-base sm:text-lg font-bold text-green-600">{completedSections}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="p-2 rounded-lg bg-blue-50">
          <div className="text-base sm:text-lg font-bold text-blue-600">{totalSections - completedSections}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <div className="text-base sm:text-lg font-bold text-gray-900">{totalSections}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {progressPercentage === 100 ? (
              <CheckCircle className="text-green-500" size={16} />
            ) : progressPercentage > 0 ? (
              <TrendingUp className="text-blue-500" size={16} />
            ) : (
              <BookOpen className="text-gray-400" size={16} />
            )}
            <span className="text-sm font-medium text-gray-700">
              {progressPercentage === 100 ? 'League Completed!' : 
               progressPercentage > 0 ? 'In Progress' : 'Ready to Start'}
            </span>
          </div>
          
          <div className="flex items-center text-[#FFDE59] hover:text-[#FFD700] text-sm font-medium transition-colors">
            <span className="mr-1">
              {progressPercentage === 100 ? 'Review' : 'Continue'}
            </span>
            <span>→</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">
              Keep going! You're {Math.round((totalSections - completedSections) / totalSections * 100)}% away from completion
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;
