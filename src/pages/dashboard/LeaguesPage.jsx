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
import OptimizedDashboardService from '../../utils/optimizedDashboardService';
import ProgressService from '../../utils/progressService';
import { StatisticLoader, ResourceProgressBadge } from '../../components/common/ResourceLoadingIndicator';
import { PageHead } from "../../components/common";

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

  const filteredLeagues = filterLeagues();

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHead 
          title="Leagues - OpenLearn"
          description="Browse and enroll in available learning leagues at OpenLearn"
          keywords="leagues, courses, learning paths, enrollment, OpenLearn"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading leagues...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHead 
        title="Leagues - OpenLearn"
        description="Browse and enroll in available learning leagues. Find the perfect learning path for your skill development journey."
        keywords="leagues, courses, learning paths, enrollment, programming, skill development, OpenLearn"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Leagues</h1>
          <p className="text-gray-600">Discover and join learning leagues to advance your skills</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Leagues Grid */}
        {filteredLeagues.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeagues.map((league) => {
                  const isEnrolled = dashboardData?.enrollments?.some(
                    enrollment => enrollment.league.id === league.id
                  );

                  const dynamicStats = leagueStatistics[league.id];
                  const weeksCount = dynamicStats?.weeksCount || league.weeksCount || 0;
                  const sectionsCount = dynamicStats?.sectionsCount || league.sectionsCount || 0;
                  const resourcesCount = dynamicStats?.resourcesCount || league.totalResources || 0;
                  const isCalculatingResources = resourceCalculationsInProgress.has(league.id);

                  return (
                    <div 
                      key={league.id}
                      className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border transition-all duration-300 ${
                        isEnrolled 
                          ? 'border-green-200 hover:border-green-300 cursor-pointer hover:shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                      }`}
                      onClick={() => {
                        if (isEnrolled) {
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
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enrolled
                          </span>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                            {league.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {league.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            {`${weeksCount} ${weeksCount === 1 ? 'week' : 'weeks'}`}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                            {`${sectionsCount} ${sectionsCount === 1 ? 'section' : 'sections'}`}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="h-4 w-4 mr-2 text-purple-500" />
                            {isCalculatingResources ? (
                              <StatisticLoader color="purple" />
                            ) : (
                              `${resourcesCount} ${resourcesCount === 1 ? 'resource' : 'resources'}`
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isEnrolled) {
                              handleLeagueClick(league);
                            } else {
                              // For now, we'll use the first cohort's ID or a default
                              const cohortId = cohorts.length > 0 ? cohorts[0].id : 'default';
                              handleEnrollment(cohortId, league.id);
                            }
                          }}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                            isEnrolled
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                              : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'
                          }`}
                        >
                          {isEnrolled ? (
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
                    </div>
                  );
                })}
              </div>
            </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Leagues Available</h3>
            <p className="text-gray-600">Learning leagues will appear here when they become available.</p>
          </div>
        )}

        {/* No Results */}
        {leagues.length > 0 && filteredLeagues.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">No leagues are currently available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaguesPage;
