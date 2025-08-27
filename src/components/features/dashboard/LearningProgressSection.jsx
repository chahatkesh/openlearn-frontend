import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play, CheckSquare, AlertCircle, Trophy, Clock, Target, Search } from 'lucide-react';
import WelcomeBanner from './WelcomeBanner';
import AssignmentManagement from './AssignmentManagement';
import OptimizedDashboardService from '../../../utils/api/optimizedDashboardService';
import ProgressService from '../../../utils/api/progressService';
import ResourceLoadingIndicator, { StatisticLoader, ResourceProgressBadge } from '../../common/ResourceLoadingIndicator';

// OPTIMIZATION 1: Memoized sub-components to prevent unnecessary re-renders
const MemoizedWelcomeBanner = React.memo(WelcomeBanner);
const MemoizedAssignmentManagement = React.memo(AssignmentManagement);

const LearningProgressSection = ({ user }) => {
  const navigate = useNavigate();
  
  // OPTIMIZATION 2: Simplified state management
  const [dashboardData, setDashboardData] = useState(null);
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
  
  // IMPROVEMENT: Separate resource calculation state from main loading state
  const [resourceCalculationsInProgress, setResourceCalculationsInProgress] = useState(new Set());
  const [resourceCalculationsCompleted, setResourceCalculationsCompleted] = useState(new Set());
  const [totalResourceCalculations, setTotalResourceCalculations] = useState(0);
  const [showResourcesCompleteToast, setShowResourcesCompleteToast] = useState(false);

  // HELPER: Get enrolled league IDs to avoid unnecessary API calls
  const getEnrolledLeagueIds = useCallback((enrollments) => {
    if (!enrollments?.length) return new Set();
    return new Set(enrollments.map(enrollment => enrollment.league?.id).filter(Boolean));
  }, []);

  // OPTIMIZATION 3: Progressive data loading with immediate UI feedback
  const loadDashboardDataOptimized = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use optimized service for progressive loading
      const data = await OptimizedDashboardService.loadInitialDashboardData();      
      // Set essential data immediately for fast UI update
      setDashboardData(data.dashboardData);
      setLeagues(data.leagues);
      
      // Set basic league statistics immediately for instant display
      if (data.basicLeagueStats) {
        setLeagueStatistics(data.basicLeagueStats);
      }
      
      // IMPROVEMENT: Main loading is complete - show dashboard immediately
      setLoading(false);
      
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
      // FIXED: Only calculate stats for leagues the user is enrolled in
      if (data.leagues?.length > 0 && data.dashboardData?.enrollments?.length > 0) {
        // Get list of enrolled league IDs
        const enrolledLeagueIds = getEnrolledLeagueIds(data.dashboardData.enrollments);
        
        // Update basic league stats to only include enrolled leagues
        const enrolledBasicStats = {};
        for (const [leagueId, stats] of Object.entries(data.basicLeagueStats)) {
          if (enrolledLeagueIds.has(leagueId)) {
            enrolledBasicStats[leagueId] = stats;
          }
        }
        setLeagueStatistics(enrolledBasicStats);
        
        // Only process leagues the user is actually enrolled in
        const enrolledLeagues = data.leagues.filter(league => enrolledLeagueIds.has(league.id));
        
        // IMPROVEMENT: Check which enrolled leagues already have complete resource calculations
        const leaguesNeedingCalculation = enrolledLeagues.filter(league => {
          const cachedStats = data.basicLeagueStats[league.id];
          // Only calculate if no cached stats or resource count is missing/zero
          return !cachedStats || cachedStats.resourcesCount === 0;
        });
        
        setTotalResourceCalculations(leaguesNeedingCalculation.length);
        setResourceCalculationsInProgress(new Set(leaguesNeedingCalculation.map(l => l.id)));
        
        if (leaguesNeedingCalculation.length > 0) {
          // Create callback to update resource counts when background calculation completes
          const handleResourceUpdate = (leagueId, resourceCount) => {
            setLeagueStatistics(prevStats => ({
              ...prevStats,
              [leagueId]: {
                ...prevStats[leagueId],
                resourcesCount: resourceCount
              }
            }));
            
            // Track completion of each league's resource calculation
            setResourceCalculationsCompleted(prevCompleted => {
              const newCompleted = new Set([...prevCompleted, leagueId]);
              
              // Check if all resource calculations are complete
              if (newCompleted.size === leaguesNeedingCalculation.length) {
                setShowResourcesCompleteToast(true);
                // Hide the toast after 4 seconds
                setTimeout(() => {
                  setShowResourcesCompleteToast(false);
                }, 4000);
              }
              
              return newCompleted;
            });
            
            // Remove from in-progress set
            setResourceCalculationsInProgress(prevInProgress => {
              const newInProgress = new Set(prevInProgress);
              newInProgress.delete(leagueId);
              return newInProgress;
            });
          };

          // Calculate accurate statistics in background to update basic stats
          OptimizedDashboardService.calculateAllLeagueStatistics(leaguesNeedingCalculation, handleResourceUpdate)
            .then(accurateStats => {
              setLeagueStatistics(prevStats => ({
                ...prevStats,
                ...accurateStats
              }));
            });
        } else {
          // All enrolled leagues already have complete data, no calculations needed
          setTotalResourceCalculations(0);
          setResourceCalculationsInProgress(new Set());
        }
      } else {
        // No leagues or no enrollments - no calculations needed
        setTotalResourceCalculations(0);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(`Failed to connect to the learning platform. Please try again later. (${err.message})`);
      
      // Set fallback data to prevent crashes
      setDashboardData({ enrollments: [], badges: [] });
      setLeagues([]);
      setLoading(false);
    }
  }, [getEnrolledLeagueIds]);

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

  const handleLeagueClick = (league) => {
    navigate(`/dashboard/league/${league.id}`);
  };

  // Navigation handlers
  const handleBackToMain = () => {
    setSelectedView('dashboard');
    setSelectedAssignmentLeague(null);
  };

  const scrollToLeagues = () => {
    navigate('/dashboard/leagues');
  };

  // OPTIMIZATION 5: Memoized filter functions for better performance
  const filterEnrollments = useCallback((enrollments) => {
    if (!isSearchActive || !searchTerm) return enrollments;
    
    return enrollments.filter(enrollment => 
      enrollment.league.name.toLowerCase().includes(searchTerm) ||
      enrollment.league.description?.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, isSearchActive]);

  // IMPROVEMENT: Show loading skeleton only for basic dashboard loading, not resource calculations
  // This allows users to see and interact with the dashboard immediately while resources load in background
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-12 lg:pb-16">
          
          {/* Dashboard Header Skeleton - Similar to LeaguesPage */}
          <div className="mb-6 lg:mb-8">
            <div className="h-12 sm:h-16 lg:h-20 bg-gray-200 rounded-2xl w-2/3 mb-3 lg:mb-4 animate-pulse"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded-xl w-1/2 animate-pulse"></div>
          </div>

          <div className="space-y-6 sm:space-y-8 lg:space-y-10">

            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-center group">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/50">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                      <div className="h-5 sm:h-6 bg-gray-200 rounded-xl w-3/4 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress stats skeleton */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 p-5 sm:p-6 lg:p-8">
              <div className="mb-6 sm:mb-8">
                <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-2xl w-1/3 mb-2 sm:mb-3 animate-pulse"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded-xl w-1/2 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-center group">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-200/50">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                      <div className="h-5 sm:h-6 bg-gray-200 rounded-xl w-3/4 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active leagues skeleton */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 p-6 sm:p-8 lg:p-10">
              <div className="mb-8 sm:mb-12">
                <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-2xl w-1/3 mb-3 sm:mb-4 animate-pulse"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded-xl w-1/2 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl sm:rounded-3xl border border-gray-200/30 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-gray-100/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="h-6 sm:h-8 bg-gray-200 rounded-xl w-3/4 mb-3 animate-pulse"></div>
                          <div className="h-4 sm:h-5 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                        </div>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                            <div className="w-8 h-8 bg-gray-200 rounded-xl mx-auto mb-2 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-lg w-8 mx-auto mb-1 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                      <div className="h-12 bg-gray-200 rounded-xl sm:rounded-2xl w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore leagues skeleton */}
            <div className="bg-gray-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16">
              <div className="text-center">
                <div className="h-8 sm:h-10 lg:h-12 bg-gray-700 rounded-2xl w-1/3 mx-auto mb-4 sm:mb-6 animate-pulse"></div>
                <div className="h-5 sm:h-6 bg-gray-700 rounded-xl w-2/3 mx-auto mb-8 sm:mb-10 animate-pulse"></div>
                <div className="h-12 sm:h-16 bg-gray-700 rounded-xl sm:rounded-2xl w-48 mx-auto animate-pulse"></div>
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
  }
  
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-12 lg:pb-16">
        
        {/* Dashboard Header - Similar to LeaguesPage */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 tracking-tight">
            Learning Dashboard
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl leading-relaxed">
            Track your progress and continue your learning journey with personalized insights
          </p>
          
          {/* Search Results Indicator - Dashboard Style */}
          {isSearchActive && (
            <div className="mt-6 max-w-2xl">
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3 text-blue-800">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Search className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm sm:text-base font-medium">
                      Search results for "<span className="font-semibold">{searchTerm}</span>"
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('dashboardSearch', {
                        detail: { searchTerm: '', isActive: false }
                      }));
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        
        {/* Resource Calculation Progress - Apple Style */}
        {resourceCalculationsInProgress.size > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 p-6 sm:p-8">
            <ResourceLoadingIndicator
              isLoading={true}
              completedCount={resourceCalculationsCompleted.size}
              totalCount={totalResourceCalculations}
              compact={false}
            />
          </div>
        )}

        {/* Welcome Banner for New Users - Apple Style */}
        {(!dashboardData?.enrollments || dashboardData.enrollments.length === 0) && (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FFDE59]/10 via-white to-[#FFDE59]/5 rounded-2xl sm:rounded-3xl border border-[#FFDE59]/20">
            <MemoizedWelcomeBanner user={user} onExploreClick={scrollToLeagues} />
          </div>
        )}

        {/* Learning Progress Section - Apple Style Enhanced */}
        {dashboardData?.enrollments?.length > 0 && (
          <section className="">
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Progress Stats - Apple Style Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {(() => {
                  const accurateProgress = ProgressService.calculateAccurateResourceProgress(dashboardData, allResourceProgress);
                  const accurateSectionProgress = ProgressService.calculateAccurateSectionProgress(dashboardData, allResourceProgress, allSectionResources);
                  
                  return (
                    <>
                      {/* Active Leagues Count */}
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                          <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4">
                            <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#E0F2FE"
                                strokeWidth="2.5"
                              />
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2.5"
                                strokeDasharray={`${leagues.length > 0 ? Math.round((dashboardData.enrollments.length / leagues.length) * 50) : 0}, 100`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <span className="absolute text-lg sm:text-xl font-bold text-blue-900">
                              {leagues.length > 0 ? Math.round((dashboardData.enrollments.length / leagues.length) * 100) : 0}%
                            </span>
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Active Leagues</div>
                          <div className="text-sm text-blue-600">
                            {dashboardData.enrollments.length} of {leagues.length} leagues
                          </div>
                        </div>
                      </div>

                      {/* Topics Progress */}
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-green-100/50 transition-all duration-300 hover:-translate-y-1">
                          <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4">
                            <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#ECFDF5"
                                strokeWidth="2.5"
                              />
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2.5"
                                strokeDasharray={`${accurateSectionProgress.sectionCompletionPercentage / 2}, 100`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <span className="absolute text-lg sm:text-xl font-bold text-green-900">
                              {accurateSectionProgress.sectionCompletionPercentage}%
                            </span>
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-green-900 mb-2">Topics Complete</div>
                          <div className="text-sm text-green-600">
                            {accurateSectionProgress.completedSections} of {accurateSectionProgress.totalSections} topics
                          </div>
                        </div>
                      </div>

                      {/* Overall Resource Progress */}
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-[#FFDE59]/20 to-amber-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#FFDE59]/30 transition-all duration-300 hover:-translate-y-1">
                          <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4">
                            <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#FEF3C7"
                                strokeWidth="2.5"
                              />
                              <path
                                d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                fill="none"
                                stroke="#FFDE59"
                                strokeWidth="2.5"
                                strokeDasharray={`${accurateProgress.overallResourceProgress / 2}, 100`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <span className="absolute text-lg sm:text-xl font-bold text-amber-900">
                              {accurateProgress.overallResourceProgress}%
                            </span>
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-amber-900 mb-2">Resources Completed</div>
                          <div className="text-sm text-amber-600">
                            {accurateProgress.completedResources} of {accurateProgress.totalResources}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* Active Leagues Section - Apple Style Enhanced */}
        {dashboardData?.enrollments?.length > 0 && (
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/30 overflow-hidden">
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Section Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black mb-2 sm:mb-3 tracking-tight leading-tight">
                  Active Leagues
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light">
                  Continue your learning journey and track your progress
                </p>
              </div>
              
              {/* Leagues Grid - Enhanced Apple Style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filterEnrollments(dashboardData.enrollments).length > 0 ? (
                  filterEnrollments(dashboardData.enrollments).map((enrollment) => {
                  // Calculate accurate topic progress for this specific league
                  const leagueSectionProgress = (() => {
                    let completedSections = 0;
                    let totalSections = 0;
                    let completedResources = 0;
                    let totalResources = 0;
                    
                    // Count topics that belong to this league and have all resources completed
                    Object.entries(allSectionResources).forEach(([sectionId, resources]) => {
                      // Only count topics that belong to this league
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
                  
                  // Calculate enrollment duration and modules completed
                  const enrollmentDate = new Date(enrollment.enrolledAt || enrollment.createdAt);
                  
                  // Calculate modules completed based on actual progress
                  const modulesCompleted = Math.floor(leagueSectionProgress.progressPercentage / 100 * (leagueStatistics[enrollment.league.id]?.weeksCount || 1));
                  
                  return (
                    <div 
                      key={enrollment.league.id} 
                      className="group bg-gradient-to-br from-white to-gray-50/30 rounded-2xl sm:rounded-3xl border border-gray-200/30 hover:border-gray-300/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/25 overflow-hidden"
                    >
                      {/* League Header - Enhanced */}
                      <div className="p-5 sm:p-6 border-b border-gray-100/50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <h3 className="text-xl sm:text-2xl font-semibold text-black group-hover:text-gray-800 transition-colors tracking-tight leading-tight">
                                {enrollment.league.name}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light line-clamp-2">
                              {enrollment.league.description}
                            </p>
                          </div>
                          
                          {/* Circular Progress Badge - Enhanced */}
                          <div className="ml-6 flex-shrink-0">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                              <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                  fill="none"
                                  stroke="#F9FAFB"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                  fill="none"
                                  stroke="#FFDE59"
                                  strokeWidth="2"
                                  strokeDasharray={`${leagueSectionProgress.progressPercentage / 2}, 100`}
                                  className="transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-bold text-black">
                                {leagueSectionProgress.progressPercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats Section - Enhanced Apple Style */}
                      <div className="p-5 sm:p-6">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl sm:rounded-2xl border border-blue-100/30">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Target size={16} className="text-blue-600" />
                              </div>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-blue-900 mb-1">{leagueSectionProgress.completed}</div>
                            <div className="text-xs sm:text-sm text-blue-600 font-medium">of {leagueSectionProgress.total} topics</div>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-xl sm:rounded-2xl border border-green-100/30">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckSquare size={16} className="text-green-600" />
                              </div>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-green-900 mb-1">{leagueSectionProgress.resourcesCompleted}</div>
                            <div className="text-xs sm:text-sm text-green-600 font-medium">of {leagueSectionProgress.resourcesTotal} resources</div>
                          </div>
                          
                          <div className="text-center p-4 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 rounded-xl sm:rounded-2xl border border-amber-100/30">
                            <div className="flex items-center justify-center mb-2">
                              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Clock size={16} className="text-amber-600" />
                              </div>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-amber-900 mb-1">{modulesCompleted}</div>
                            <div className="text-xs sm:text-sm text-amber-600 font-medium">of {leagueStatistics[enrollment.league.id]?.weeksCount || 0} modules</div>
                          </div>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 px-2">
                          <span className="flex items-center font-light">
                            <Trophy size={14} className="mr-2 text-gray-400" />
                            Enrolled {enrollmentDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {/* Action Button - Apple Style */}
                        <button
                          onClick={() => handleLeagueClick(enrollment.league)}
                          className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-6 py-4 rounded-xl sm:rounded-2xl text-base font-medium hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center group-hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Play size={18} className="mr-3" />
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  );
                })
                ) : (
                  // Show "No results found" message when search yields no results
                  isSearchActive && searchTerm ? (
                    <div className="col-span-full text-center py-16 sm:py-20">
                      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">No Active Leagues Found</h3>
                      <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
                        No leagues match your search for "<span className="font-medium text-black">{searchTerm}</span>"
                      </p>
                      <button
                        onClick={() => {
                          // Clear search by dispatching event
                          window.dispatchEvent(new CustomEvent('clearSearch'));
                        }}
                        className="text-base text-blue-600 hover:text-blue-700 font-medium px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200"
                      >
                        Clear search to see all leagues
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </section>
        )}

        {/* Explore All Leagues - Apple Style Enhanced */}
        <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl">
          <div className="relative p-8 sm:p-12 lg:p-16 text-center">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#FFDE59] to-transparent rounded-2xl sm:rounded-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                Explore Learning Leagues
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Discover all available learning leagues and find the perfect path for your skill development journey.
              </p>
              <button
                onClick={scrollToLeagues}
                className="inline-flex items-center px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] text-black rounded-xl sm:rounded-2xl hover:from-[#FFD700] hover:to-[#FFC107] transition-all duration-300 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:shadow-[#FFDE59]/20 transform hover:scale-105 active:scale-95"
              >
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
                Browse All Leagues
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 ml-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Error Handling - Apple Style */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4 sm:ml-6">
                <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Connection Issue</h3>
                <p className="text-red-700 text-sm sm:text-base leading-relaxed">
                  Unable to connect to the learning platform. Please check your internet connection and try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Resource Calculations Complete Toast - Apple Style */}
      {showResourcesCompleteToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-sm backdrop-blur-sm">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">Dashboard data fetched! 🎉</p>
            </div>
            <button
              onClick={() => setShowResourcesCompleteToast(false)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgressSection;
