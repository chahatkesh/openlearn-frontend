import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Calendar, 
  ArrowRight, 
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Play,
  Target
} from 'lucide-react';
import OptimizedDashboardService from '../../utils/api/optimizedDashboardService';
import ProgressService from '../../utils/api/progressService';
import { StatisticLoader, ResourceProgressBadge } from '../../components/common/ResourceLoadingIndicator';
import { PageHead } from "../../components/common";
import { MotionDiv, MotionSection } from '../../components/common/MotionWrapper';

const LeaguesPage = () => {
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagueStatistics, setLeagueStatistics] = useState({});
  
  // Resource calculation tracking
  const [resourceCalculationsInProgress, setResourceCalculationsInProgress] = useState(new Set());
  const [resourceCalculationsCompleted, setResourceCalculationsCompleted] = useState(new Set());
  const [totalResourceCalculations, setTotalResourceCalculations] = useState(0);

  // Load leagues data
  const loadLeaguesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use optimized service for progressive loading
      const data = await OptimizedDashboardService.loadInitialDashboardData();
      
      // Set data immediately
      setDashboardData(data.dashboardData);
      setCohorts(data.cohorts);
      setLeagues(data.leagues);
      
      // Set basic league statistics
      if (data.basicLeagueStats) {
        setLeagueStatistics(data.basicLeagueStats);
      }
      
      setLoading(false);

      // Calculate accurate statistics in background
      if (data.leagues?.length > 0) {
        const leaguesNeedingCalculation = data.leagues.filter(league => {
          const cachedStats = data.basicLeagueStats[league.id];
          return !cachedStats || cachedStats.resourcesCount === 0;
        });
        
        setTotalResourceCalculations(leaguesNeedingCalculation.length);
        setResourceCalculationsInProgress(new Set(leaguesNeedingCalculation.map(l => l.id)));
        
        if (leaguesNeedingCalculation.length > 0) {
          const handleResourceUpdate = (leagueId, resourceCount) => {
            setLeagueStatistics(prevStats => ({
              ...prevStats,
              [leagueId]: {
                ...prevStats[leagueId],
                resourcesCount: resourceCount
              }
            }));
            
            setResourceCalculationsCompleted(prevCompleted => {
              const newCompleted = new Set([...prevCompleted, leagueId]);
              return newCompleted;
            });
            
            setResourceCalculationsInProgress(prevInProgress => {
              const newInProgress = new Set(prevInProgress);
              newInProgress.delete(leagueId);
              return newInProgress;
            });
          };

          OptimizedDashboardService.calculateAllLeagueStatistics(leaguesNeedingCalculation, handleResourceUpdate)
            .then(accurateStats => {
              setLeagueStatistics(prevStats => ({
                ...prevStats,
                ...accurateStats
              }));
            });
        }
      }

    } catch (err) {
      console.error('Error loading leagues data:', err);
      setError(`Failed to load leagues. Please try again later. (${err.message})`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaguesData();
  }, [loadLeaguesData]);

  // Filter functions
  const filterLeagues = useCallback(() => {
    // Return all leagues without any filtering
    return leagues;
  }, [leagues]);

  const handleEnrollment = async (cohortId, leagueId) => {
    try {
      // Find the league to check if enrollment is disabled
      const league = leagues.find(l => l.id === leagueId);
      if (league && isEnrollmentDisabled(league.name)) {
        alert('Enrollment for this league is expired. Please check back later.');
        return;
      }
      
      await ProgressService.enrollUser(cohortId, leagueId);
      alert('Enrollment successful! Welcome to your learning journey!');
      await loadLeaguesData(); // Refresh data
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment failed: ${err.message}. Please try again.`);
    }
  };

  const handleLeagueClick = (league) => {
    navigate(`/dashboard/league/${league.id}`);
  };

  // Helper function to check if a league enrollment should be disabled
  const isEnrollmentDisabled = (leagueName) => {
    const disabledLeagues = ['ML League (1.0)', 'Finance League (1.0)'];
    return disabledLeagues.includes(leagueName);
  };

  const filteredLeagues = filterLeagues();

  if (loading) {
    return (
      <MotionSection className="min-h-screen bg-gray-50/50">
        <PageHead 
          title="Leagues - OpenLearn"
          description="Browse and enroll in available learning leagues at OpenLearn"
          keywords="leagues, courses, learning paths, enrollment, OpenLearn"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <MotionDiv 
            className="flex flex-col items-center justify-center py-20 lg:py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-16 h-16 mb-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Leagues</h3>
            <p className="text-gray-600 text-center max-w-md">
              Discovering amazing learning opportunities for you...
            </p>
          </MotionDiv>
        </div>
      </MotionSection>
    );
  }

  return (
    <MotionSection className="min-h-screen bg-transparent">
      <PageHead 
        title="Learning Leagues"
        description="Explore and join specialized learning leagues to advance your skills"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-16 lg:pb-20">
        {/* Dashboard Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4 tracking-tight">
            Learning Leagues
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 max-w-3xl leading-relaxed">
            Join specialized learning tracks designed to help you master new skills and advance your career
          </p>
        </MotionDiv>        {/* Error Message */}
        {error && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Unable to Load Leagues</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Leagues Grid */}
        {filteredLeagues.length > 0 ? (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredLeagues.map((league, index) => {
                const isEnrolled = dashboardData?.enrollments?.some(
                  enrollment => enrollment.league.id === league.id
                );
                const isDisabled = !isEnrolled && isEnrollmentDisabled(league.name);

                const dynamicStats = leagueStatistics[league.id];
                const weeksCount = dynamicStats?.weeksCount || league.weeksCount || 0;
                const sectionsCount = dynamicStats?.sectionsCount || league.sectionsCount || 0;
                const resourcesCount = dynamicStats?.resourcesCount || league.totalResources || 0;
                const isCalculatingResources = resourceCalculationsInProgress.has(league.id);

                return (
                  <MotionDiv
                    key={league.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-gray-200/50 transition-all duration-500 ease-out overflow-hidden ${
                      isDisabled
                        ? 'opacity-60 cursor-not-allowed' 
                        : isEnrolled 
                        ? 'hover:border-gray-400/60 cursor-pointer hover:bg-white/90' 
                        : 'hover:border-gray-300/60 hover:bg-white/90'
                    }`}
                    whileHover={isDisabled ? {} : { 
                      y: -4,
                      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    onClick={() => {
                      if (isEnrolled && !isDisabled) {
                        handleLeagueClick(league);
                      }
                    }}
                  >
                    {/* Resource calculation progress badge */}
                    {isCalculatingResources && (
                      <ResourceProgressBadge 
                        isCalculating={true}
                        completedCount={resourceCalculationsCompleted.size}
                        totalCount={totalResourceCalculations}
                      />
                    )}

                    {/* Enrollment status badge */}
                    {isEnrolled && (
                      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFDE59]/80 backdrop-blur-sm text-black border border-[#FFDE59]/70">
                          <CheckCircle className="h-3 w-3 mr-1.5" />
                          Enrolled
                        </div>
                      </div>
                    )}

                    {/* Disabled status badge */}
                    {isDisabled && (
                      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-red-100/80 backdrop-blur-sm text-red-700 border border-red-200/70">
                          <AlertCircle className="h-3 w-3 mr-1.5" />
                          League Expired
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 lg:p-8">
                      <div className="mb-6">
                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-black transition-colors duration-300">
                          {league.name}
                        </h3>
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-3">
                          {league.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm lg:text-base text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-gray-700" />
                          </div>
                          <span className="font-medium">
                            {`${weeksCount} ${weeksCount === 1 ? 'Module' : 'Modules'}`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm lg:text-base text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <BookOpen className="h-4 w-4 text-gray-700" />
                          </div>
                          <span className="font-medium">
                            {`${sectionsCount} ${sectionsCount === 1 ? 'Topic' : 'Topics'}`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm lg:text-base text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <Target className="h-4 w-4 text-gray-700" />
                          </div>
                          <span className="font-medium">
                            {isCalculatingResources ? (
                              <StatisticLoader color="gray" />
                            ) : (
                              `${resourcesCount} ${resourcesCount === 1 ? 'resource' : 'resources'}`
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDisabled) {
                            // Show alert for disabled leagues
                            alert('Enrollment for this league is temporarily disabled. Please check back later.');
                            return;
                          }
                          if (isEnrolled) {
                            handleLeagueClick(league);
                          } else {
                            const cohortId = cohorts.length > 0 ? cohorts[0].id : 'default';
                            handleEnrollment(cohortId, league.id);
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-full px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium transition-all duration-300 flex items-center justify-center ${
                          isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isEnrolled
                            ? 'bg-[#FFDE59] text-black hover:bg-[#FFDE59]/90 focus:ring-4 focus:ring-[#FFDE59]/30'
                            : 'bg-black text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-200'
                        }`}
                      >
                        {isDisabled ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Enrollment Disabled
                          </>
                        ) : isEnrolled ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Enroll Now
                          </>
                        )}
                      </button>
                    </div>

                    {/* Subtle border highlight */}
                    <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-1 ring-gray-200/30 group-hover:ring-gray-300/50 transition-all duration-300 pointer-events-none"></div>
                  </MotionDiv>
                );
              })}
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-gray-200/50 p-12 lg:p-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">No Leagues Available</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Learning leagues will appear here when they become available. Check back soon for exciting opportunities!
            </p>
          </MotionDiv>
        )}

        {/* No Results */}
        {leagues.length > 0 && filteredLeagues.length === 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-gray-200/50 p-12 lg:p-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">No Results Found</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              No leagues match your current search criteria. Try adjusting your filters.
            </p>
          </MotionDiv>
        )}
      </div>
    </MotionSection>
  );
};

export default LeaguesPage;
