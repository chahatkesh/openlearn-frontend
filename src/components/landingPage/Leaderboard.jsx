import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Lock, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DataService from '../../utils/dataService';
import { getUserAvatarUrl } from '../../utils/boringAvatarsUtils';
import { MotionDiv, MotionA, MotionSection, MotionH2, MotionTr, MotionP } from '../common/MotionWrapper';

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
          
          // Sort by completion percentage (descending), then by earliest completion time for ties
          const sortedData = filteredData.sort((a, b) => {
            const aProgress = a.stats?.completionPercentage || 0;
            const bProgress = b.stats?.completionPercentage || 0;
            
            // First sort by completion percentage (higher is better)
            if (aProgress !== bProgress) {
              return bProgress - aProgress;
            }
            
            // If completion percentages are the same, sort by earliest completion time
            const aLastCompleted = a.recentActivity?.lastCompletedResource?.completedAt;
            const bLastCompleted = b.recentActivity?.lastCompletedResource?.completedAt;
            
            // If both have completion times, earlier completion wins
            if (aLastCompleted && bLastCompleted) {
              return new Date(aLastCompleted) - new Date(bLastCompleted);
            }
            
            // If only one has a completion time, that one ranks higher
            if (aLastCompleted && !bLastCompleted) return -1;
            if (!aLastCompleted && bLastCompleted) return 1;
            
            // If neither has completion times, maintain original order
            return 0;
          });
          
          // Recalculate ranks after sorting
          const rerankedData = sortedData.map((entry, index) => ({
            ...entry,
            rank: index + 1 // Assign new rank based on sorted position
          }));
          
          setLeaderboardData(rerankedData);
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
      <MotionSection 
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100" 
        style={{ backgroundColor: '#F9FAFB' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <MotionDiv 
              className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MotionDiv
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              >
                <Lock className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              </MotionDiv>
              <MotionH2 
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Leaderboard Access Restricted
              </MotionH2>
              <MotionP 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Sign in to view the community leaderboard and see top performers based on tasks completed.
              </MotionP>
              <MotionDiv 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <MotionA
                  href="/signin"
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </MotionA>
                <MotionA
                  href="/signup"
                  className="px-8 py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Account
                </MotionA>
              </MotionDiv>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>
    );
  }

  return (
    <MotionSection 
      className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50" 
      style={{ backgroundColor: '#FFFBEB' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <MotionDiv 
          className="text-center mb-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MotionH2 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
             Top Performers
          </MotionH2>
          <MotionP 
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
          Celebrating our most dedicated learners - ranked by tasks completed.
          </MotionP>
        </MotionDiv>

        {loading ? (
          <MotionDiv 
            className="flex justify-center items-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MotionDiv 
              className="rounded-full h-12 w-12 border-b-2 border-black"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </MotionDiv>
        ) : error ? (
          <MotionDiv 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Leaderboard
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </MotionDiv>
        ) : leaderboardData.length === 0 ? (
          <MotionDiv 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MotionDiv
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            </MotionDiv>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              Leaderboard will populate as students complete tasks.
            </p>
          </MotionDiv>
        ) : (
          <MotionDiv 
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Community Leaderboard
              </h3>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badges
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Recent Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.map((entry, index) => {
                    const { rank, user: student, stats, recentActivity } = entry;
                    const RoleIcon = getRoleIcon(student.role);
                    const isTopThree = rank <= 3;
                    
                    return (
                      <MotionTr 
                        key={student.id}
                        className={`transition-colors duration-200 ${
                          isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 1.4 + (index * 0.1),
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          backgroundColor: isTopThree ? "rgba(255, 251, 235, 0.8)" : "rgba(249, 250, 251, 0.8)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* Rank Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {getPositionIcon(rank)}
                            {isTopThree && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 hidden sm:inline-block">
                                Top {rank}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Student Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                              <img
                                src={getUserAvatarUrl(student, 'avataaars', 40)}
                                alt={`${student.name} avatar`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallbackDiv = e.target.nextSibling;
                                  if (fallbackDiv) {
                                    fallbackDiv.style.display = 'flex';
                                  }
                                }}
                                onLoad={(e) => {
                                  const fallbackDiv = e.target.nextSibling;
                                  if (fallbackDiv) {
                                    fallbackDiv.style.display = 'none';
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ display: 'none' }}>
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{student.name}</div>
                              <div className="text-xs text-gray-500 hidden sm:block">ID: {student.id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${getRoleBgColor(student.role)}`}>
                            <RoleIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${getRoleColor(student.role)}`} />
                            <span className={`text-xs font-medium ${getRoleColor(student.role)} hidden sm:inline`}>
                              {student.role}
                            </span>
                          </div>
                        </td>

                        {/* Tasks Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {stats.resourcesCompleted}/{stats.totalResources}
                          </div>
                          <div className="text-xs text-gray-500 hidden sm:block">completed</div>
                        </td>

                        {/* Progress Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-gray-900">
                              {stats.completionPercentage}%
                            </span>
                            <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${stats.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Badges Column */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600">
                              {stats.badgesEarned}
                            </span>
                          </div>
                        </td>

                        {/* Recent Activity Column - Hidden on smaller screens */}
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          {recentActivity?.lastCompletedResource ? (
                            <div className="max-w-48">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {recentActivity.lastCompletedResource.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(recentActivity.lastCompletedResource.completedAt)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No recent activity</span>
                          )}
                        </td>
                      </MotionTr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Showing {leaderboardData.length} students</span>
                <span>Rankings update in real-time</span>
              </div>
            </div>
          </MotionDiv>
        )}
      </div>
    </MotionSection>
  );
};

export default Leaderboard;