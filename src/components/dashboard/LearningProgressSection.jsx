import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BookOpen, Users, Star, ChevronRight, Play, CheckSquare, AlertCircle, Trophy, Clock, Target } from 'lucide-react';
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
  const [allSectionResources, setAllSectionResources] = useState({});
  const [sectionToLeagueMap, setSectionToLeagueMap] = useState({});
  const [leagueStatistics, setLeagueStatistics] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchCohorts();
    fetchLeagues();
  }, []);

  // Function to calculate real league statistics
  const calculateLeagueStatistics = useCallback(async (leagueId) => {
    try {
      console.log(`Calculating statistics for league: ${leagueId}`);
      const leagueData = await ProgressService.getLeagueProgress(leagueId);
      
      if (leagueData?.progress?.weeks) {
        let totalWeeks = leagueData.progress.weeks.length;
        let totalSections = 0;
        let totalResources = 0;
        
        console.log(`League ${leagueId} has ${totalWeeks} weeks`);
        
        // Count sections and resources from the actual league structure
        for (const week of leagueData.progress.weeks) {
          if (week.sections) {
            totalSections += week.sections.length;
            console.log(`Week ${week.id} has ${week.sections.length} sections`);
            
            // Fetch resources for each section to get accurate count
            for (const section of week.sections) {
              try {
                const sectionData = await ResourceProgressService.getSectionResourcesProgress(section.id);
                if (sectionData?.resources) {
                  totalResources += sectionData.resources.length;
                  console.log(`Section ${section.id} has ${sectionData.resources.length} resources`);
                }
              } catch (err) {
                console.warn(`Failed to fetch resources for section ${section.id}:`, err);
              }
            }
          }
        }
        
        const stats = {
          weeksCount: totalWeeks,
          sectionsCount: totalSections,
          resourcesCount: totalResources
        };
        
        console.log(`Final stats for league ${leagueId}:`, stats);
        return stats;
      }
    } catch (err) {
      console.warn(`Failed to calculate statistics for league ${leagueId}:`, err);
    }
    
    return {
      weeksCount: 0,
      sectionsCount: 0,
      resourcesCount: 0
    };
  }, []);

  // Fetch statistics for all leagues
  useEffect(() => {
    const fetchAllLeagueStatistics = async () => {
      if (leagues.length > 0) {
        const statistics = {};
        
        for (const league of leagues) {
          const stats = await calculateLeagueStatistics(league.id);
          statistics[league.id] = stats;
        }
        
        setLeagueStatistics(statistics);
      }
    };
    
    fetchAllLeagueStatistics();
  }, [leagues, calculateLeagueStatistics]);

    const fetchAllResourceProgress = useCallback(async () => {
    if (!dashboardData?.enrollments) return;
    
    try {
      // Fetch league progress for each enrollment to get section data
      const allProgress = {};
      const allSections = {};
      const sectionLeagueMap = {};
      
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
                    // Store section resources for section completion calculation
                    allSections[section.id] = sectionData.resources;
                    
                    // Map section to league
                    sectionLeagueMap[section.id] = enrollment.league.id;
                    
                    // Store individual resource progress
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
      setAllSectionResources(allSections);
      setSectionToLeagueMap(sectionLeagueMap);
    } catch (err) {
      console.warn('Failed to fetch resource progress:', err);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (dashboardData?.enrollments?.length > 0) {
      fetchAllResourceProgress();
    }
  }, [dashboardData, fetchAllResourceProgress]);

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
    <div className="h-full bg-transparent overflow-hidden">
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
                {dashboardData.enrollments.map((enrollment) => {
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
                  
                  // Calculate enrollment duration
                  const enrollmentDate = new Date(enrollment.enrolledAt || enrollment.createdAt);
                  const daysSinceEnrollment = Math.floor((Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={enrollment.league.id} 
                      className="group bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {/* League Header */}
                      <div className="relative p-5 bg-gradient-to-br from-gray-50 to-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors">
                              {enrollment.league.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {enrollment.league.description}
                            </p>
                          </div>
                          
                          {/* Progress Badge */}
                          <div className="ml-3 flex-shrink-0">
                            <div className="relative w-12 h-12">
                              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155"
                                  fill="none"
                                  stroke="#E5E7EB"
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
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center bg-white/50 rounded-lg p-2 hover:bg-white/70 transition-colors">
                            <Target size={14} className="mx-auto mb-1 text-green-500" />
                            <div className="text-sm font-bold text-gray-900">{leagueSectionProgress.completed}</div>
                            <div className="text-xs text-gray-600">Sections</div>
                          </div>
                          <div className="text-center bg-white/50 rounded-lg p-2 hover:bg-white/70 transition-colors">
                            <BookOpen size={14} className="mx-auto mb-1 text-blue-500" />
                            <div className="text-sm font-bold text-gray-900">{leagueSectionProgress.resourcesCompleted}</div>
                            <div className="text-xs text-gray-600">Resources</div>
                          </div>
                          <div className="text-center bg-white/50 rounded-lg p-2 hover:bg-white/70 transition-colors">
                            <Clock size={14} className="mx-auto mb-1 text-amber-500" />
                            <div className="text-sm font-bold text-gray-900">{daysSinceEnrollment}</div>
                            <div className="text-xs text-gray-600">Days Active</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{leagueSectionProgress.completed} of {leagueSectionProgress.total} sections</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-[#FFDE59] to-[#FFD700] h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${leagueSectionProgress.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Action Button - Smaller */}
                        <button
                          onClick={() => handleLeagueClick(enrollment.league)}
                          className="w-full bg-gradient-to-r from-black to-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center group-hover:shadow-md"
                        >
                          <Play size={14} className="mr-1.5" />
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                      {leagues.filter(league => league && league.id && league.name).length > 0 ? (
                        leagues.filter(league => league && league.id && league.name).map((league) => {
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
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></div>
                                        {dynamicStats ? weeksCount : '...'} {weeksCount === 1 ? 'week' : 'weeks'}
                                      </span>
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                                        {dynamicStats ? sectionsCount : '...'} {sectionsCount === 1 ? 'section' : 'sections'}
                                      </span>
                                      <span className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1"></div>
                                        {dynamicStats ? resourcesCount : '...'} {resourcesCount === 1 ? 'resource' : 'resources'}
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
                        })
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <BookOpen size={20} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">No leagues available in this cohort yet</p>
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
