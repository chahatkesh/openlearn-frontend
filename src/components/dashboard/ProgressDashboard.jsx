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
  Calendar,
  Users
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp size={16} className="text-white" />
            </div>
            Learning Analytics
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track your progress across all enrolled leagues</p>
        </div>
        
        {stats.overallProgress > 0 && (
          <button
            onClick={() => handleShare('progress', {
              overallProgress: stats.overallProgress,
              completedSections: stats.completedSections,
              totalSections: stats.totalSections
            })}
            className="flex items-center text-sm text-gray-600 hover:text-[#FFDE59] transition-colors px-3 py-2 rounded-xl hover:bg-[#FFDE59]/10"
          >
            <Share2 size={16} className="mr-1" />
            Share
          </button>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="text-center group">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="2"
                strokeDasharray={`${stats.overallProgress}, 100`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFDE59" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-sm font-bold bg-gradient-to-r from-[#FFDE59] to-[#FFD700] bg-clip-text text-transparent">
              {stats.overallProgress}%
            </span>
          </div>
          <div className="text-sm font-medium text-gray-900">Overall Progress</div>
        </div>

        {/* Active Leagues */}
        <div className="text-center group">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalEnrollments}</div>
          <div className="text-sm text-gray-600">Active Leagues</div>
        </div>

        {/* Completed Sections */}
        <div className="text-center group">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.completedSections}/{stats.totalSections}
          </div>
          <div className="text-sm text-gray-600">Sections</div>
        </div>

        {/* Badges Earned */}
        <div className="text-center group">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
            <Award size={24} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.badgesEarned}</div>
          <div className="text-sm text-gray-600">Badges Earned</div>
        </div>
      </div>

        {/* Progress Bar */}
        {stats.totalSections > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Overall Learning Progress
              </span>
              <span className="text-sm text-gray-600">
                {stats.completedSections} of {stats.totalSections} sections completed
              </span>
            </div>
            <div className="relative w-full bg-gray-200/60 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.overallProgress}%` }}
              >
                <div className="h-full w-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

      {/* Achievements Section */}
      {dashboardData.badges && dashboardData.badges.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <Award size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
              <p className="text-sm text-gray-600">Badges you've earned along your journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.badges.slice(0, 4).map((badge) => (
              <div 
                key={badge.id}
                className="group flex items-center p-4 bg-gradient-to-r from-[#FFDE59]/10 to-[#FFD700]/10 backdrop-blur-sm rounded-xl border border-[#FFDE59]/20 hover:border-[#FFDE59]/40 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <Award className="text-gray-900" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-[#FFDE59] transition-colors">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.league?.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleShare('badge', {
                    name: badge.name,
                    description: badge.description,
                    leagueName: badge.league?.name || 'OpenLearn'
                  })}
                  className="text-gray-400 hover:text-[#FFDE59] p-2 rounded-lg hover:bg-[#FFDE59]/10 transition-all duration-200"
                  title="Share achievement"
                >
                  <Share2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
