import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Target, 
  Clock, 
  Star,
  CheckCircle,
  AlertCircle,
  Share2,
  Calendar
} from 'lucide-react';
import ProgressService from '../../utils/progressService';
import SocialService from '../../utils/socialService';
import BadgeService from '../../utils/badgeService';

/**
 * Enhanced Progress Dashboard Component
 * Displays comprehensive progress statistics, badges, and learning analytics
 */
const ProgressDashboard = ({ user, refreshTrigger = 0 }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await ProgressService.getUserDashboard();
      setDashboardData(data);
      
      // Calculate enhanced statistics
      const calculatedStats = ProgressService.calculateProgressStats(data);
      setStats(calculatedStats);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (type, data) => {
    SocialService.showShareModal(type, data, (platform) => {
      // Track sharing if needed
      console.log(`Shared ${type} on ${platform}`);
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="mr-2" size={20} />
          <span className="font-medium">Error Loading Progress</span>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFD700] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData || !stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Learning Journey</h3>
          <p className="text-gray-600">Enroll in a league to begin tracking your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Progress Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 text-[#FFDE59]" size={24} />
            Learning Progress
          </h2>
          
          {stats.overallProgress > 0 && (
            <button
              onClick={() => handleShare('progress', {
                overallProgress: stats.overallProgress,
                completedSections: stats.completedSections,
                totalSections: stats.totalSections
              })}
              className="flex items-center text-sm text-gray-600 hover:text-[#FFDE59] transition-colors"
            >
              <Share2 size={16} className="mr-1" />
              Share Progress
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Overall Progress */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                  fill="none"
                  stroke="#FFDE59"
                  strokeWidth="2"
                  strokeDasharray={`${stats.overallProgress}, 100`}
                />
              </svg>
              <span className="absolute text-lg font-bold text-[#FFDE59]">
                {stats.overallProgress}%
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900">Overall Progress</div>
          </div>

          {/* Enrollments */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalEnrollments}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <BookOpen size={14} className="mr-1" />
              Active Leagues
            </div>
          </div>

          {/* Completed Sections */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.completedSections}/{stats.totalSections}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <CheckCircle size={14} className="mr-1" />
              Sections
            </div>
          </div>

          {/* Badges Earned */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.badgesEarned}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center">
              <Award size={14} className="mr-1" />
              Badges Earned
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {stats.totalSections > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Learning Progress
              </span>
              <span className="text-sm text-gray-600">
                {stats.completedSections} of {stats.totalSections} sections completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.overallProgress}%` }}
              >
                {stats.overallProgress > 15 && (
                  <div className="h-full flex items-center justify-end pr-2">
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      {dashboardData.badges && dashboardData.badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="mr-2 text-[#FFDE59]" size={20} />
            Achievements & Badges
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.badges.map((badge) => (
              <div 
                key={badge.id}
                className="flex items-center p-4 bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10 rounded-lg border border-[#FFDE59]/20"
              >
                <div className="w-12 h-12 bg-[#FFDE59] rounded-full flex items-center justify-center mr-4">
                  <Award className="text-gray-900" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.league?.name}</p>
                  <p className="text-xs text-gray-500">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleShare('badge', {
                    name: badge.name,
                    description: badge.description,
                    leagueName: badge.league?.name || 'OpenLearn'
                  })}
                  className="text-[#FFDE59] hover:text-[#FFD700] p-1"
                  title="Share achievement"
                >
                  <Share2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.totalEnrollments > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 text-[#FFDE59]" size={20} />
            Learning Activity
          </h3>
          
          <div className="space-y-4">
            {dashboardData.enrollments.map((enrollment) => {
              const progressStatus = ProgressService.getProgressStatus(enrollment.progress.progressPercentage);
              
              return (
                <div key={enrollment.league.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      progressStatus.color === 'green' ? 'bg-green-500' :
                      progressStatus.color === 'yellow' ? 'bg-yellow-500' :
                      progressStatus.color === 'orange' ? 'bg-orange-500' :
                      progressStatus.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{enrollment.league.name}</h4>
                      <p className="text-sm text-gray-600">
                        {enrollment.progress.completedSections} of {enrollment.progress.totalSections} sections
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.progress.progressPercentage}%
                    </div>
                    <div className={`text-xs ${
                      progressStatus.color === 'green' ? 'text-green-600' :
                      progressStatus.color === 'yellow' ? 'text-yellow-600' :
                      progressStatus.color === 'orange' ? 'text-orange-600' :
                      progressStatus.color === 'blue' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {progressStatus.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
