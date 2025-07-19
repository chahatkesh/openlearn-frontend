import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, CheckSquare, AlertCircle, Trophy, Clock, Target, Search } from 'lucide-react';
import WelcomeBanner from './WelcomeBanner';
import AssignmentManagement from './AssignmentManagement';
import OptimizedDashboardService from '../../utils/optimizedDashboardService';
import ProgressService from '../../utils/progressService';

// OPTIMIZATION 1: Memoized sub-components to prevent unnecessary re-renders
const MemoizedWelcomeBanner = React.memo(WelcomeBanner);
const MemoizedAssignmentManagement = React.memo(AssignmentManagement);

// Small loading component for statistics
const StatisticLoader = ({ color = 'gray' }) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 animate-spin rounded-full border border-${color}-300 border-t-${color}-600`}></div>
    <span className="ml-1 text-gray-400">...</span>
  </div>
);

const LearningProgressSection = ({ user }) => {
  const navigate = useNavigate();
  
  // OPTIMIZATION 2: Simplified state management
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedAssignmentLeague, setSelectedAssignmentLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allResourceProgress, setAllResourceProgress] = useState({});
  const [allSectionResources, setAllSectionResources] = useState({});
  const [sectionToLeagueMap, setSectionToLeagueMap] = useState({});
  const [leagueStatistics, setLeagueStatistics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [resourcesCalculationComplete, setResourcesCalculationComplete] = useState(false);
  const [completedResourceCalculations, setCompletedResourceCalculations] = useState(new Set());
  const [totalLeaguesForCalculation, setTotalLeaguesForCalculation] = useState(0);

  // OPTIMIZATION 3: Progressive data loading with immediate UI feedback
  const loadDashboardDataOptimized = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use optimized service for progressive loading
      const data = await OptimizedDashboardService.loadInitialDashboardData();
      
      // Set essential data immediately for fast UI update
      setDashboardData(data.dashboardData);
      setCohorts(data.cohorts);
      setLeagues(data.leagues);
      
      // Set basic league statistics immediately for instant display
      if (data.basicLeagueStats) {
        setLeagueStatistics(data.basicLeagueStats);
        setStatisticsLoading(false);
      }
      
      // Load resource progress in background for enrolled leagues
      if (data.dashboardData?.enrollments?.length > 0) {
        OptimizedDashboardService.loadResourceProgressOptimized(data.dashboardData)
          .then(resourceData => {
            setAllResourceProgress(resourceData.allResourceProgress);
            setAllSectionResources(resourceData.allSectionResources);
            setSectionToLeagueMap(resourceData.sectionToLeagueMap);
          });
      }

      // Calculate statistics immediately for display, then update in background
      if (data.leagues?.length > 0) {
        setTotalLeaguesForCalculation(data.leagues.length);
        console.log(`Starting resource calculations for ${data.leagues.length} leagues:`, data.leagues.map(l => l.id));
        
        // Create callback to update resource counts when background calculation completes
        const handleResourceUpdate = (leagueId, resourceCount) => {
          console.log(`Resource calculation completed for league ${leagueId}: ${resourceCount} resources`);
          
          setLeagueStatistics(prevStats => ({
            ...prevStats,
            [leagueId]: {
              ...prevStats[leagueId],
              resourcesCount: resourceCount
            }
          }));
          
          // Track completion of each league's resource calculation
          setCompletedResourceCalculations(prevCompleted => {
            const newCompleted = new Set([...prevCompleted, leagueId]);
            console.log(`Completed resource calculations: ${newCompleted.size}/${data.leagues.length}`, [...newCompleted]);
            
            // Check if all resource calculations are complete
            if (newCompleted.size === data.leagues.length) {
              console.log('All resource calculations completed!');
              setResourcesCalculationComplete(true);
              setStatisticsLoading(false);
            }
            
            return newCompleted;
          });
        };

        // Calculate accurate statistics in background to update basic stats
        OptimizedDashboardService.calculateAllLeagueStatistics(data.leagues, handleResourceUpdate)
          .then(accurateStats => {
            console.log('Initial statistics calculated:', accurateStats);
            setLeagueStatistics(prevStats => ({
              ...prevStats,
              ...accurateStats
            }));
            
            // Note: We don't set statisticsLoading to false here anymore
            // It will be set to false only when all resource calculations complete via the callback
          });
      } else {
        console.log('No leagues found, marking calculations as complete');
        setStatisticsLoading(false);
        setResourcesCalculationComplete(true);
      }

      // Only hide initial loading, but keep showing progress for resource calculations
      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(`Failed to connect to the learning platform. Please try again later. (${err.message})`);
      
      // Set fallback data to prevent crashes
      setDashboardData({ enrollments: [], badges: [] });
      setCohorts([]);
      setLeagues([]);
      setLoading(false);
    }
  }, []);

  // OPTIMIZATION 4: Load data on mount with optimized approach
  useEffect(() => {
    loadDashboardDataOptimized();
  }, [loadDashboardDataOptimized]);

  // Listen for search events from the header
  useEffect(() => {
    const handleSearchEvent = (event) => {
      const { searchTerm, isActive } = event.detail;
      setSearchTerm(searchTerm.toLowerCase());
      setIsSearchActive(isActive);
    };

    window.addEventListener('dashboardSearch', handleSearchEvent);
    return () => window.removeEventListener('dashboardSearch', handleSearchEvent);
  }, []);

  const handleEnrollment = async (cohortId, leagueId) => {
    try {
      await ProgressService.enrollUser(cohortId, leagueId);
      alert('Enrollment successful! Welcome to your learning journey!');
      await loadDashboardDataOptimized(); // Refresh dashboard data
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment failed: ${err.message}. Please try again.`);
    }
  };

  const handleLeagueClick = (league) => {
    navigate(`/dashboard/league/${league.id}`);
  };

  // Navigation handlers
  const handleBackToMain = () => {
    setSelectedView('dashboard');
    setSelectedAssignmentLeague(null);
  };

  const scrollToLeagues = () => {
    const leaguesSection = document.getElementById('available-leagues');
    if (leaguesSection) {
      leaguesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // OPTIMIZATION 5: Memoized filter functions for better performance
  const filterEnrollments = useCallback((enrollments) => {
    if (!isSearchActive || !searchTerm) return enrollments;
    
    return enrollments.filter(enrollment => 
      enrollment.league.name.toLowerCase().includes(searchTerm) ||
      enrollment.league.description?.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, isSearchActive]);

  const filterLeagues = useCallback((leagues) => {
    if (!isSearchActive || !searchTerm) return leagues;
    
    return leagues.filter(league => 
      league.name.toLowerCase().includes(searchTerm) ||
      league.description?.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, isSearchActive]);

  // Calculate progress percentage for resource calculations
  const calculateResourceProgress = () => {
    if (totalLeaguesForCalculation === 0) return 100;
    return Math.round((completedResourceCalculations.size / totalLeaguesForCalculation) * 100);
  };

  const getLoadingMessage = () => {
    if (loading) return 'Loading dashboard...';
    if (!resourcesCalculationComplete && totalLeaguesForCalculation > 0) {
      return `Calculating resources... (${completedResourceCalculations.size}/${totalLeaguesForCalculation})`;
    }
    return 'Almost ready!';
  };

  // Show loading until both basic loading and resource calculations are complete
  const isFullyLoaded = !loading && resourcesCalculationComplete;

  if (!isFullyLoaded) {
    const progress = calculateResourceProgress();
    const loadingMessage = getLoadingMessage();
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            {/* Loading Progress Indicator */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFDE59] to-[#FFD700] rounded-2xl flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{loadingMessage}</h3>
                  {!loading && totalLeaguesForCalculation > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                      <div 
                        className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    {loading ? 'Setting up your learning environment...' : 'Finalizing statistics and progress data...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Header skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Progress stats skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Learning Paths skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-100 rounded-xl p-6">
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2].map(j => (
                        <div key={j} className="p-4 bg-gray-50 rounded-lg">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                          <div className="flex space-x-2">
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-14"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If viewing assignments
  if (selectedView === 'assignments' && selectedAssignmentLeague) {
    return (
      <MemoizedAssignmentManagement 
        league={selectedAssignmentLeague}
        onBack={handleBackToMain}
      />
    );
  }  return (
    <div className="bg-transparent">
      <div className="p-6 space-y-6">
        
        {/* Header Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Learning Dashboard</h1>
              <p className="text-sm text-gray-600">Track your progress and continue your journey</p>
            </div>
          </div>
          
          {/* Search Results Indicator */}
          {isSearchActive && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Showing search results for: "<span className="font-semibold">{searchTerm}</span>"
                </span>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('dashboardSearch', {
                      detail: { searchTerm: '', isActive: false }
                    }));
                  }}
                  className="ml-auto text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Welcome Banner for New Users */}
        {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100 shadow-sm overflow-hidden">
            <MemoizedWelcomeBanner user={user} onExploreClick={scrollToLeagues} />
          </div>
        )}

        {/* Learning Progress Section - Only show if user has enrollments */}
        {dashboardData?.enrollments?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
                  <p className="text-sm text-gray-600">Your overall learning statistics</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  // Calculate accurate progress once and reuse
                  const accurateProgress = ProgressService.calculateAccurateResourceProgress(dashboardData, allResourceProgress);
                  const accurateSectionProgress = ProgressService.calculateAccurateSectionProgress(dashboardData, allResourceProgress, allSectionResources);
                  
                  return (
                    <>
                      {/* Active Leagues Count */}
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="relative inline-flex items-center justify-center w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#DBEAFE"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="3"
                              strokeDasharray={`${leagues.length > 0 ? Math.round((dashboardData.enrollments.length / leagues.length) * 50) : 0}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <span className="absolute text-sm font-bold text-gray-900">
                            {leagues.length > 0 ? Math.round((dashboardData.enrollments.length / leagues.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Active Leagues</div>
                        <div className="text-xs text-gray-600">
                          {dashboardData.enrollments.length} of {leagues.length} leagues
                        </div>
                      </div>

                      {/* Sections Progress */}
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="relative inline-flex items-center justify-center w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#D1FAE5"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeDasharray={`${accurateSectionProgress.sectionCompletionPercentage / 2}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <span className="absolute text-sm font-bold text-gray-900">
                            {accurateSectionProgress.sectionCompletionPercentage}%
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Sections Complete</div>
                        <div className="text-xs text-gray-600">
                          {accurateSectionProgress.completedSections} of {accurateSectionProgress.totalSections} total
                        </div>
                      </div>

                      {/* Overall Resource Progress */}
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                        <div className="relative inline-flex items-center justify-center w-20 h-20">
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
                              strokeDasharray={`${accurateProgress.overallResourceProgress / 2}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <span className="absolute text-sm font-bold text-gray-900">
                            {accurateProgress.overallResourceProgress}%
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Resources Completed</div>
                        <div className="text-xs text-gray-600">
                          {accurateProgress.completedResources} of {accurateProgress.totalResources}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

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
                {filterEnrollments(dashboardData.enrollments).length > 0 ? (
                  filterEnrollments(dashboardData.enrollments).map((enrollment) => {
                  // Calculate accurate section progress for this specific league
                  const leagueSectionProgress = (() => {
                    let completedSections = 0;
                    let totalSections = 0;
                    let completedResources = 0;
                    let totalResources = 0;
                    
                    // Count sections that belong to this league and have all resources completed
                    Object.entries(allSectionResources).forEach(([sectionId, resources]) => {
                      // Only count sections that belong to this league
                      if (sectionToLeagueMap[sectionId] === enrollment.league.id && resources.length >= 0) {
                        totalSections++;
                        totalResources += resources.length;
                        
                        const sectionCompletedResources = resources.filter(resource => 
                          allResourceProgress[resource.id]?.isCompleted
                        ).length;
                        completedResources += sectionCompletedResources;
                        
                        if (resources.length > 0 && sectionCompletedResources === resources.length) {
                          completedSections++;
                        }
                      }
                    });
                    
                    // Fall back to enrollment data if no resource data available
                    if (totalSections === 0) {
                      return {
                        completed: enrollment.progress.completedSections || 0,
                        total: enrollment.progress.totalSections || 0,
                        resourcesCompleted: 0,
                        resourcesTotal: 0,
                        progressPercentage: enrollment.progress.progressPercentage || 0
                      };
                    }
                    
                    const progressPercentage = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
                    
                    return {
                      completed: completedSections,
                      total: totalSections,
                      resourcesCompleted: completedResources,
                      resourcesTotal: totalResources,
                      progressPercentage
                    };
                  })();
                  
                  // Calculate enrollment duration and weeks completed
                  const enrollmentDate = new Date(enrollment.enrolledAt || enrollment.createdAt);
                  
                  // Calculate weeks completed based on actual progress
                  const weeksCompleted = Math.floor(leagueSectionProgress.progressPercentage / 100 * (leagueStatistics[enrollment.league.id]?.weeksCount || 1));
                  
                  return (
                    <div 
                      key={enrollment.league.id} 
                      className="group bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 overflow-hidden"
                    >
                      {/* League Header */}
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                                {enrollment.league.name}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {enrollment.league.description}
                            </p>
                          </div>
                          
                          {/* Circular Progress Badge */}
                          <div className="ml-4 flex-shrink-0">
                            <div className="relative w-14 h-14">
                              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                  fill="none"
                                  stroke="#F3F4F6"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                  fill="none"
                                  stroke="#FFDE59"
                                  strokeWidth="3"
                                  strokeDasharray={`${leagueSectionProgress.progressPercentage / 2}, 100`}
                                  className="transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                                {leagueSectionProgress.progressPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats Section */}
                      <div className="p-5">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-center mb-1">
                              <Target size={12} className="text-blue-600 mr-1" />
                              <span className="text-xs font-medium text-blue-700">Sections</span>
                            </div>
                            <div className="text-lg font-bold text-blue-900">{leagueSectionProgress.completed}</div>
                            <div className="text-xs text-blue-600">of {leagueSectionProgress.total}</div>
                          </div>
                          
                          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center justify-center mb-1">
                              <CheckSquare size={12} className="text-green-600 mr-1" />
                              <span className="text-xs font-medium text-green-700">Resources</span>
                            </div>
                            <div className="text-lg font-bold text-green-900">{leagueSectionProgress.resourcesCompleted}</div>
                            <div className="text-xs text-green-600">of {leagueSectionProgress.resourcesTotal}</div>
                          </div>
                          
                          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center justify-center mb-1">
                              <Clock size={12} className="text-amber-600 mr-1" />
                              <span className="text-xs font-medium text-amber-700">Week</span>
                            </div>
                            <div className="text-lg font-bold text-amber-900">{weeksCompleted}</div>
                            <div className="text-xs text-amber-600">of {leagueStatistics[enrollment.league.id]?.weeksCount || 0}</div>
                          </div>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Trophy size={12} className="mr-1" />
                            Enrolled {enrollmentDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {/* Action Button - Made Smaller */}
                        <button
                          onClick={() => handleLeagueClick(enrollment.league)}
                          className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center group-hover:shadow-lg cursor-pointer"
                        >
                          <Play size={14} className="mr-2" />
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  );
                })
                ) : (
                  // Show "No results found" message when search yields no results
                  isSearchActive && searchTerm ? (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">No Active Leagues Found</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        No leagues match your search for "<span className="font-medium">{searchTerm}</span>"
                      </p>
                      <button
                        onClick={() => {
                          // Clear search by dispatching event
                          window.dispatchEvent(new CustomEvent('clearSearch'));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear search to see all leagues
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Learning Paths */}
        <div id="available-leagues" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            {cohorts.length > 0 ? (
              <div className="space-y-6">
                {cohorts.map((cohort) => (
                  <div key={cohort.id} className="relative">
                    <div className="flex items-start mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{cohort.name || 'Learning Cohort'}</h4>
                        <p className="text-sm text-gray-600">{cohort.description || 'Explore available learning leagues'}</p>
                      </div>
                    </div>
                    
                    {/* Leagues Grid */}
                    <div className="ml-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filterLeagues(leagues.filter(league => league && league.id && league.name)).length > 0 ? (
                        filterLeagues(leagues.filter(league => league && league.id && league.name)).map((league) => {
                          const isEnrolled = dashboardData?.enrollments?.some(
                            enrollment => enrollment.league.id === league.id
                          );

                          // Better data validation for league stats with dynamic calculation
                          const dynamicStats = leagueStatistics[league.id];
                          const weeksCount = dynamicStats?.weeksCount || league.weeksCount || league.weeks_count || league.totalWeeks || league._count?.weeks || 0;
                          const sectionsCount = dynamicStats?.sectionsCount || league.sectionsCount || league.sections_count || league.totalSections || league._count?.sections || 0;
                          const resourcesCount = dynamicStats?.resourcesCount || league.totalResources || league.resources_count || league._count?.resources || 0;
                          const leagueName = league.name || 'Learning League';
                          const leagueDescription = league.description || 'A comprehensive learning journey designed to build your skills.';

                          // Determine if we should show loading indicators
                          // Show loading when statistics are being calculated AND we don't have dynamic stats yet
                          const showWeeksLoading = statisticsLoading && !dynamicStats;
                          const showSectionsLoading = statisticsLoading && !dynamicStats;
                          const showResourcesLoading = statisticsLoading && !dynamicStats;

                          return (
                            <div 
                              key={league.id}
                              className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border transition-all duration-300 ${
                                isEnrolled 
                                  ? 'border-green-200 hover:border-green-300 cursor-pointer hover:shadow-sm' 
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
                                      {leagueName}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                      {leagueDescription}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></div>
                                        {showWeeksLoading ? (
                                          <StatisticLoader color="blue" />
                                        ) : (
                                          `${weeksCount} ${weeksCount === 1 ? 'week' : 'weeks'}`
                                        )}
                                      </span>
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                                        {showSectionsLoading ? (
                                          <StatisticLoader color="green" />
                                        ) : (
                                          `${sectionsCount} ${sectionsCount === 1 ? 'section' : 'sections'}`
                                        )}
                                      </span>
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1"></div>
                                        {showResourcesLoading ? (
                                          <StatisticLoader color="purple" />
                                        ) : (
                                          `${resourcesCount} ${resourcesCount === 1 ? 'resource' : 'resources'}`
                                        )}
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
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200 '
                                        : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 cursor-pointer hover:to-black hover:shadow-lg'
                                    }`}
                                  >
                                    {isEnrolled ? 'Enrolled' : 'Enroll'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            {isSearchActive && searchTerm ? (
                              <Search size={20} className="text-gray-400" />
                            ) : (
                              <BookOpen size={20} className="text-gray-400" />
                            )}
                          </div>
                          {isSearchActive && searchTerm ? (
                            <>
                              <h3 className="font-medium text-gray-900 mb-2">No Available Leagues Found</h3>
                              <p className="text-sm text-gray-600 mb-4">
                                No available leagues match your search for "<span className="font-medium">{searchTerm}</span>"
                              </p>
                              <button
                                onClick={() => {
                                  // Clear search by dispatching event
                                  window.dispatchEvent(new CustomEvent('clearSearch'));
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Clear search to see all leagues
                              </button>
                            </>
                          ) : (
                            <p className="text-sm text-gray-600">No leagues available in this cohort yet</p>
                          )}
                        </div>
                      )}
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
                <p className="text-sm text-gray-600">Learning cohorts will appear here when they become available. Check back soon!</p>
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
