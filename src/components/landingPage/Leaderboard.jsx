import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Lock, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DataService from '../../utils/dataService';
import { getUserAvatarUrl } from '../../utils/avatarService.jsx';

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboardData = async () => {
      if (isAuthenticated()) {
        try {
          setLoading(true);
          const response = await DataService.getLeaderboard();
          
          // Filter for PIONEER and LUMINARY roles only
          const filteredData = response.leaderboard?.filter(entry => 
            entry.user.role === 'PIONEER' || entry.user.role === 'LUMINARY'
          ) || [];
          
          setLeaderboardData(filteredData);
        } catch (err) {
          setError('Failed to load leaderboard data');
          console.error('Leaderboard error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [isAuthenticated]);

  const getRoleIcon = (role) => {
    return role === 'LUMINARY' ? Sparkles : Star;
  };

  const getRoleColor = (role) => {
    return role === 'LUMINARY' ? 'text-purple-600' : 'text-blue-600';
  };

  const getRoleBgColor = (role) => {
    return role === 'LUMINARY' ? 'bg-purple-50' : 'bg-blue-50';
  };

  const getPositionIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated()) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
              <Lock className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Leaderboard Access Restricted
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Sign in to view the community leaderboard and see top performers based on resources completed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/signin"
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-8 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50" style={{ backgroundColor: '#FFFBEB' }}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
             Top Performers
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Celebrating our most dedicated learners - ranked by resources completed.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Leaderboard
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              Leaderboard will populate as students complete resources.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboardData.map((entry) => {
              const { rank, user: student, stats, recentActivity } = entry;
              const RoleIcon = getRoleIcon(student.role);
              
              return (
                <div
                  key={student.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    rank <= 3
                      ? 'border-yellow-300 bg-gradient-to-br from-white to-yellow-50'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Position and Role */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getPositionIcon(rank)}
                      {rank <= 3 && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          Top {rank}
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getRoleBgColor(student.role)}`}>
                      <RoleIcon className={`w-4 h-4 ${getRoleColor(student.role)}`} />
                      <span className={`text-xs font-medium ${getRoleColor(student.role)}`}>
                        {student.role}
                      </span>
                    </div>
                  </div>

                  {/* Student Avatar and Name */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={getUserAvatarUrl(student, 'avataaars', 64)}
                        alt={`${student.name} avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if avatar fails to load
                          e.target.style.display = 'none';
                          const fallbackDiv = e.target.nextSibling;
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                          }
                        }}
                        onLoad={(e) => {
                          // Hide fallback when image loads successfully
                          const fallbackDiv = e.target.nextSibling;
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'none';
                          }
                        }}
                      />
                      {/* Fallback initials display */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg" style={{ display: 'none' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {student.name}
                    </h3>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resources Completed</span>
                      <span className="font-bold text-lg text-gray-900">
                        {stats.resourcesCompleted}/{stats.totalResources}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Badges Earned</span>
                      <span className="font-medium text-amber-600">
                        {stats.badgesEarned}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {stats.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stats.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Recent Activity */}
                    {recentActivity?.lastCompletedResource && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Latest Achievement</p>
                        <p className="text-sm font-medium text-gray-900">
                          {recentActivity.lastCompletedResource.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(recentActivity.lastCompletedResource.completedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        {!loading && !error && leaderboardData.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Rankings update in real-time based on completed resources. Keep learning to climb the leaderboard! 📚
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;