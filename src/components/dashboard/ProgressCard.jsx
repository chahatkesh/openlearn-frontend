import React from 'react';
import { CheckCircle, Circle, Award, TrendingUp } from 'lucide-react';

const ProgressCard = ({ enrollment, onClick }) => {
  const progressPercentage = enrollment.progress.progressPercentage || 0;
  const completedSections = enrollment.progress.completedSections || 0;
  const totalSections = enrollment.progress.totalSections || 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(enrollment.league)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {enrollment.league.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {enrollment.league.description}
          </p>
        </div>
        {progressPercentage === 100 && (
          <Award className="text-[#FFDE59] ml-2" size={24} />
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-[#FFDE59]">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-[#FFDE59] h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 15 && (
              <div className="h-full flex items-center justify-end pr-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">{completedSections}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{totalSections - completedSections}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{totalSections}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {progressPercentage === 100 ? (
              <CheckCircle className="text-green-500 mr-2" size={16} />
            ) : progressPercentage > 0 ? (
              <TrendingUp className="text-blue-500 mr-2" size={16} />
            ) : (
              <Circle className="text-gray-400 mr-2" size={16} />
            )}
            <span className="text-sm font-medium text-gray-700">
              {progressPercentage === 100 ? 'Completed' : 
               progressPercentage > 0 ? 'In Progress' : 'Not Started'}
            </span>
          </div>
          <button className="text-[#FFDE59] hover:text-[#FFD700] text-sm font-medium">
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
