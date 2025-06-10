import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, FileText, CheckSquare, Share2, ClipboardList } from 'lucide-react';
import LeagueDetailPage from './LeagueDetailPage';
import ProgressCard from './ProgressCard';
import WelcomeBanner from './WelcomeBanner';
import ProgressDashboard from './ProgressDashboard';
import AssignmentManagement from './AssignmentManagement';
import ProgressService from '../../utils/progressService';
import DataService from '../../utils/dataService';
import SocialService from '../../utils/socialService';

const LearningProgressSection = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedView, setSelectedView] = useState('dashboard'); // dashboard, assignments
  const [selectedAssignmentLeague, setSelectedAssignmentLeague] = useState(null);
  const [currentUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchCohorts();
    fetchLeagues();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await ProgressService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const fetchCohorts = async () => {
    try {
      const data = await DataService.getCohorts();
      setCohorts(data.cohorts || []);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const data = await DataService.getLeagues();
      setLeagues(data.leagues || []);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollment = async (cohortId, leagueId) => {
    try {
      await ProgressService.enrollUser(cohortId, leagueId);
      alert('Enrollment successful! Welcome to your learning journey!');
      await fetchDashboardData(); // Refresh dashboard data
      setRefreshTrigger(prev => prev + 1); // Trigger refresh in ProgressDashboard
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleLeagueClick = (league) => {
    setSelectedLeague(league);
  };

  const handleViewAssignments = (league) => {
    setSelectedAssignmentLeague(league);
    setSelectedView('assignments');
  };

  // Navigation handlers
  const handleBackFromLeague = () => {
    setSelectedLeague(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBackToMain = () => {
    setSelectedView('dashboard');
    setSelectedAssignmentLeague(null);
    setSelectedLeague(null);
  };

  const scrollToLeagues = () => {
    const leaguesSection = document.getElementById('available-leagues');
    if (leaguesSection) {
      leaguesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // If viewing league details
  if (selectedLeague) {
    return (
      <LeagueDetailPage 
        league={selectedLeague} 
        onBack={handleBackFromLeague}
      />
    );
  }

  // If viewing assignments
  if (selectedView === 'assignments' && selectedAssignmentLeague) {
    return (
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToMain}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ChevronRight className="mr-1 rotate-180" size={20} />
            Back to Dashboard
          </button>
        </div>

        <AssignmentManagement 
          leagueId={selectedAssignmentLeague.id}
          leagueName={selectedAssignmentLeague.name}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50/30 via-white to-blue-50/20 overflow-hidden">
      <div className="h-full p-6 space-y-6 overflow-y-auto">
        
        {/* Header Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Learning Dashboard</h1>
              <p className="text-sm text-gray-600">Track your progress and continue your journey</p>
            </div>
            
            {dashboardData?.enrollments?.length > 0 && (
              <button
                onClick={() => SocialService.shareProgress({
                  overallProgress: dashboardData.statistics?.overallProgress || 0,
                  completedSections: dashboardData.statistics?.completedSections || 0,
                  totalSections: dashboardData.statistics?.totalSections || 0
                })}
                className="flex items-center px-4 py-2 text-sm font-medium text-[#FFDE59] bg-[#FFDE59]/10 backdrop-blur-sm rounded-xl border border-[#FFDE59]/20 hover:bg-[#FFDE59]/20 transition-all duration-200 hover:scale-105"
              >
                <Share2 size={16} className="mr-2" />
                Share Progress
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Progress Dashboard */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden">
          <ProgressDashboard user={currentUser} refreshTrigger={refreshTrigger} />
        </div>

        {/* Welcome Banner for New Users */}
        {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
          <div className="bg-gradient-to-r from-[#FFDE59]/10 to-blue-50/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden">
            <WelcomeBanner user={user} onExploreClick={scrollToLeagues} />
          </div>
        )}

        {/* Active Leagues - Modern Design */}
        {dashboardData?.enrollments?.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Users size={16} className="text-white" />
                  </div>
                  Active Leagues
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {dashboardData.enrollments.length} active enrollment{dashboardData.enrollments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.enrollments.map((enrollment) => (
                <div 
                  key={enrollment.league.id} 
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-[#FFDE59]/30 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    {/* League Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FFDE59] transition-colors">
                          {enrollment.league.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {enrollment.league.description}
                        </p>
                      </div>
                      
                      {/* Progress Badge */}
                      <div className="ml-4 text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#FFDE59]/20 to-[#FFD700]/20 border border-[#FFDE59]/30">
                          <TrendingUp size={14} className="mr-1 text-[#FFDE59]" />
                          <span className="text-sm font-medium text-gray-900">{enrollment.progress.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* League Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-lg font-bold text-blue-600">{enrollment.league.weeksCount || 0}</div>
                        <div className="text-xs text-gray-600">Total Weeks</div>
                      </div>
                      <div className="text-center p-3 bg-green-50/50 rounded-xl">
                        <div className="text-lg font-bold text-green-600">{enrollment.league.sectionsCount || 0}</div>
                        <div className="text-xs text-gray-600">Total Sections</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50/50 rounded-xl">
                        <div className="text-lg font-bold text-purple-600">{enrollment.league.totalResources || 0}</div>
                        <div className="text-xs text-gray-600">Total Resources</div>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {enrollment.progress.completedSections}/{enrollment.progress.totalSections} sections completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative mb-6">
                      <div className="w-full bg-gray-200/60 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${enrollment.progress.progressPercentage}%` }}
                        >
                          <div className="h-full w-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLeagueClick(enrollment.league)}
                        className="flex-1 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] text-gray-900 px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center"
                      >
                        <Play size={16} className="mr-2" />
                        Continue Learning
                      </button>
                      
                      <button
                        onClick={() => handleViewAssignments(enrollment.league)}
                        className="px-4 py-2.5 bg-blue-500/10 text-blue-600 rounded-xl font-medium hover:bg-blue-500/20 transition-all duration-200 flex items-center border border-blue-200/50"
                      >
                        <FileText size={16} className="mr-2" />
                        Assignment
                      </button>

                      {enrollment.progress.progressPercentage > 0 && (
                        <button
                          onClick={() => SocialService.shareLeagueProgress({
                            leagueName: enrollment.league.name,
                            progressPercentage: enrollment.progress.progressPercentage,
                            completedSections: enrollment.progress.completedSections,
                            totalSections: enrollment.progress.totalSections
                          })}
                          className="p-2.5 text-gray-500 hover:text-[#FFDE59] rounded-xl hover:bg-[#FFDE59]/10 transition-all duration-200"
                        >
                          <Share2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Cohorts & Leagues - Modern Design */}
        <div id="available-leagues" className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Available Learning Paths</h3>
                <p className="text-sm text-gray-600">Discover new leagues and expand your skills</p>
              </div>
            </div>
            
            {cohorts.length > 0 ? (
              <div className="space-y-6">
                {cohorts.map((cohort) => (
                  <div key={cohort.id} className="relative">
                    <div className="flex items-start mb-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-[#FFDE59] to-[#FFD700] rounded-full mr-4 mt-1"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{cohort.name}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{cohort.description}</p>
                      </div>
                    </div>
                    
                    {/* Leagues Grid */}
                    <div className="ml-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {leagues.map((league) => {
                        const isEnrolled = dashboardData?.enrollments?.some(
                          enrollment => enrollment.league.id === league.id
                        );
                        
                        return (
                          <div 
                            key={league.id}
                            className={`group relative bg-white/60 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                              isEnrolled 
                                ? 'border-[#FFDE59]/30 hover:border-[#FFDE59]/50 cursor-pointer hover:shadow-md' 
                                : 'border-gray-200/50 opacity-60'
                            }`}
                            onClick={() => {
                              if (isEnrolled) {
                                handleLeagueClick(league);
                              }
                            }}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 mb-1 group-hover:text-[#FFDE59] transition-colors">
                                    {league.name}
                                  </h5>
                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                    {league.description}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></div>
                                      {league.weeksCount} weeks
                                    </span>
                                    <span className="flex items-center">
                                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                                      {league.sectionsCount} sections
                                    </span>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isEnrolled) {
                                      handleEnrollment(cohort.id, league.id);
                                    }
                                  }}
                                  disabled={isEnrolled}
                                  className={`ml-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isEnrolled
                                      ? 'bg-green-100/80 text-green-700 cursor-not-allowed border border-green-200/50'
                                      : 'bg-gradient-to-r from-[#FFDE59] to-[#FFD700] text-gray-900 hover:shadow-md hover:scale-105'
                                  }`}
                                >
                                  {isEnrolled ? 'Enrolled' : 'Enroll'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">No Learning Paths Available</h3>
                <p className="text-sm text-gray-600">Check back later for new cohorts and leagues</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default LearningProgressSection;
