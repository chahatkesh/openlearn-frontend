import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, CheckSquare, AlertCircle } from 'lucide-react';
import LeagueDetailPage from './LeagueDetailPage';
import WelcomeBanner from './WelcomeBanner';
import AssignmentManagement from './AssignmentManagement';
import ProgressService from '../../utils/progressService';
import ResourceProgressService from '../../utils/resourceProgressService';
import DataService from '../../utils/dataService';

const LearningProgressSection = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedView, setSelectedView] = useState('dashboard'); // dashboard, assignments
  const [selectedAssignmentLeague, setSelectedAssignmentLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allResourceProgress, setAllResourceProgress] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchCohorts();
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (dashboardData?.enrollments?.length > 0) {
      fetchAllResourceProgress();
    }
  }, [dashboardData]);

  const fetchDashboardData = async () => {
    try {
      const data = await ProgressService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Connection to learning platform failed. Running in demo mode. (${err.message})`);
      
      // Set minimal mock data to prevent crashes
      setDashboardData({
        enrollments: [],
        badges: []
      });
    }
  };

  const fetchAllResourceProgress = useCallback(async () => {
    if (!dashboardData?.enrollments) return;
    
    try {
      // Fetch league progress for each enrollment to get section data
      const allProgress = {};
      
      for (const enrollment of dashboardData.enrollments) {
        try {
          const leagueData = await ProgressService.getLeagueProgress(enrollment.league.id);
          
          if (leagueData?.progress?.weeks) {
            // Fetch resource progress for each section
            for (const week of leagueData.progress.weeks) {
              for (const section of week.sections) {
                try {
                  const sectionData = await ResourceProgressService.getSectionResourcesProgress(section.id);
                  
                  if (sectionData?.resources) {
                    sectionData.resources.forEach(resource => {
                      if (resource.progress) {
                        allProgress[resource.id] = resource.progress;
                      }
                    });
                  }
                } catch (sectionErr) {
                  console.warn(`Failed to fetch resources for section ${section.id}:`, sectionErr);
                }
              }
            }
          }
        } catch (leagueErr) {
          console.warn(`Failed to fetch league data for ${enrollment.league.id}:`, leagueErr);
        }
      }
      
      setAllResourceProgress(allProgress);
    } catch (err) {
      console.warn('Failed to fetch resource progress:', err);
    }
  }, [dashboardData]);

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
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment failed: ${err.message}. Please try again.`);
    }
  };

  const handleLeagueClick = (league) => {
    setSelectedLeague(league);
  };

  // Navigation handlers
  const handleBackFromLeague = () => {
    setSelectedLeague(null);
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
  }  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-yellow-50/30 overflow-hidden">
      <div className="h-full p-6 space-y-6 overflow-y-auto">
        
        {/* Header Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Learning Dashboard</h1>
              <p className="text-sm text-gray-600">Track your progress and continue your journey</p>
            </div>
          </div>
        </div>

        {/* Learning Progress Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
                <p className="text-sm text-gray-600">Your overall learning statistics</p>
              </div>
            </div>
            
            {dashboardData?.enrollments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  // Calculate accurate progress once and reuse
                  const accurateProgress = ProgressService.calculateAccurateResourceProgress(dashboardData, allResourceProgress);
                  const progressStats = ProgressService.calculateProgressStats(dashboardData);
                  
                  return (
                    <>
                      {/* Overall Resource Progress */}
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#FEF3C7"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#FFDE59"
                              strokeWidth="3"
                              strokeDasharray={`${accurateProgress.overallResourceProgress}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <span className="absolute text-lg font-bold text-gray-900">
                            {accurateProgress.overallResourceProgress}%
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Resources Completed</div>
                        <div className="text-xs text-gray-600">
                          {accurateProgress.completedResources} of {accurateProgress.totalResources}
                        </div>
                      </div>

                      {/* Active Leagues Count */}
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="w-20 h-20 bg-gradient-to-r from-black to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <BookOpen size={28} className="text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardData.enrollments.length}</div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Active Leagues</div>
                        <div className="text-xs text-gray-600">Currently enrolled</div>
                      </div>

                      {/* Sections Progress */}
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CheckSquare size={28} className="text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {progressStats.completedSections}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Sections Complete</div>
                        <div className="text-xs text-gray-600">
                          of {progressStats.totalSections} total
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Your Learning Journey</h3>
                <p className="text-gray-600 text-sm">Enroll in leagues below to track your progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Leagues Section */}
        {dashboardData?.enrollments?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Active Leagues</h2>
                  <p className="text-sm text-gray-600">Continue your learning journey</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.enrollments.map((enrollment) => (
                  <div 
                    key={enrollment.league.id} 
                    className="group p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    {/* League Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                        {enrollment.league.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                        {enrollment.league.description}
                      </p>
                      
                      {/* Progress Info */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {enrollment.progress.completedSections} of {enrollment.progress.totalSections} sections completed
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleLeagueClick(enrollment.league)}
                      className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-4 py-3 rounded-xl font-medium hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
                    >
                      <Play size={16} className="mr-2" />
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Welcome Banner for New Users */}
        {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 shadow-sm overflow-hidden">
            <WelcomeBanner user={user} onExploreClick={scrollToLeagues} />
          </div>
        )}

        {/* Available Learning Paths */}
        <div id="available-leagues" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Available Learning Paths</h3>
                <p className="text-sm text-gray-600">Discover new leagues and expand your skills</p>
              </div>
            </div>
            
            {cohorts.length > 0 ? (
              <div className="space-y-6">
                {cohorts.map((cohort) => (
                  <div key={cohort.id} className="relative">
                    <div className="flex items-start mb-4">
                      <div className="w-1 h-16 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full mr-4 mt-1"></div>
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
                            className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border transition-all duration-300 ${
                              isEnrolled 
                                ? 'border-green-200 hover:border-green-300 cursor-pointer hover:shadow-md' 
                                : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                            }`}
                            onClick={() => {
                              if (isEnrolled) {
                                handleLeagueClick(league);
                              }
                            }}
                          >
                            <div className="p-5">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                                    {league.name}
                                  </h5>
                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
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
                                  className={`ml-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isEnrolled
                                      ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                                      : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black hover:shadow-lg'
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Connection Issue</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Unable to connect to the learning platform. Please check your internet connection and try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default LearningProgressSection;
