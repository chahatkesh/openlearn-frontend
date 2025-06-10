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
  const [currentUser, setCurrentUser] = useState(user);
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
    <div className="space-y-6">
      {/* Navigation Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
          
          <div className="flex items-center space-x-3">
            {dashboardData?.enrollments?.length > 0 && (
              <button
                onClick={() => SocialService.shareProgress({
                  overallProgress: dashboardData.statistics?.overallProgress || 0,
                  completedSections: dashboardData.statistics?.completedSections || 0,
                  totalSections: dashboardData.statistics?.totalSections || 0
                })}
                className="flex items-center px-3 py-2 text-sm font-medium text-[#FFDE59] bg-[#FFDE59]/10 rounded-lg hover:bg-[#FFDE59]/20 transition-colors"
              >
                <Share2 size={16} className="mr-2" />
                Share Progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Dashboard */}
      <ProgressDashboard user={currentUser} refreshTrigger={refreshTrigger} />

      {/* Welcome Banner for New Users */}
      {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
        <WelcomeBanner user={user} onExploreClick={scrollToLeagues} />
      )}

      {/* Current Enrollments with Enhanced Features */}
      {dashboardData?.enrollments?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-2 text-[#FFDE59]" size={24} />
              Your Learning Journey
            </h2>
            <div className="text-sm text-gray-600">
              {dashboardData.enrollments.length} active enrollment{dashboardData.enrollments.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {dashboardData.enrollments.map((enrollment) => (
            <div key={enrollment.league.id} className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {enrollment.league.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {enrollment.league.description}
                    </p>
                    
                    {/* Progress Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <CheckSquare size={16} className="mr-1 text-green-500" />
                        {enrollment.progress.completedSections}/{enrollment.progress.totalSections} sections
                      </span>
                      <span className="flex items-center">
                        <TrendingUp size={16} className="mr-1 text-blue-500" />
                        {enrollment.progress.progressPercentage}% complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleLeagueClick(enrollment.league)}
                    className="bg-[#FFDE59] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#FFD700] transition-colors flex items-center"
                  >
                    <Play size={16} className="mr-2" />
                    Continue Learning
                  </button>
                  
                  <button
                    onClick={() => handleViewAssignments(enrollment.league)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FileText size={16} className="mr-2" />
                    View Assignment
                  </button>

                  {enrollment.progress.progressPercentage > 0 && (
                    <button
                      onClick={() => SocialService.shareLeagueProgress({
                        leagueName: enrollment.league.name,
                        progressPercentage: enrollment.progress.progressPercentage,
                        completedSections: enrollment.progress.completedSections,
                        totalSections: enrollment.progress.totalSections
                      })}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <Share2 size={16} className="mr-2" />
                      Share
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Cohorts & Leagues */}
      <div id="available-leagues" className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="mr-2 text-[#FFDE59]" size={20} />
          Available Cohorts & Leagues
        </h3>
        
        {cohorts.length > 0 ? (
          <div className="space-y-6">
            {cohorts.map((cohort) => (
              <div key={cohort.id} className="border-l-4 border-[#FFDE59] pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">{cohort.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{cohort.description}</p>
                
                {/* Leagues under this cohort */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {leagues.map((league) => {
                    // Check if user is already enrolled in this league
                    const isEnrolled = dashboardData?.enrollments?.some(
                      enrollment => enrollment.league.id === league.id
                    );
                    
                    return (
                      <div 
                        key={league.id}
                        className={`border border-gray-200 rounded-lg p-4 transition-colors ${
                          isEnrolled 
                            ? 'hover:border-[#FFDE59] cursor-pointer' 
                            : 'cursor-default opacity-70'
                        }`}
                        onClick={() => {
                          if (isEnrolled) {
                            handleLeagueClick(league);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">{league.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{league.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{league.weeksCount} weeks</span>
                              <span>{league.sectionsCount} sections</span>
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
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              isEnrolled
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-[#FFDE59] text-gray-900 cursor-pointer hover:bg-[#FFD700]'
                            }`}
                          >
                            {isEnrolled ? 'Enrolled' : 'Enroll'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No cohorts available at the moment</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LearningProgressSection;
