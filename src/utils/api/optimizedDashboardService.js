/**
 * Optimized Dashboard Service
 * 
 * This service implements performance optimizations for dashboard loading:
 * 1. Parallel API calls to reduce loading time
 * 2. Smart caching to avoid redundant requests
 * 3. Incremental data loading with immediate UI updates
 * 4. Background resource prefetching
 * 5. Error resilience with partial data fallbacks
 * 
 * @created 2025-07-19
 * @optimizes LearningProgressSection loading performance
 */

import ProgressService from './progressService';
import DataService from './dataService';
import ResourceProgressService from './resourceProgressService';

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

class OptimizedDashboardService {
  /**
   * Extract basic statistics from league objects for immediate display
   * Also checks cached league stats for complete resource counts
   * @param {Array} leagues - Array of league objects
   * @param {Set} enrolledLeagueIds - Optional set of enrolled league IDs to limit processing
   */
  static extractBasicLeagueStats(leagues, enrolledLeagueIds = null) {
    const basicStats = {};
    
    if (!leagues?.length) return basicStats;
    
    // Filter leagues to only enrolled ones if enrolledLeagueIds is provided
    const leaguesToProcess = enrolledLeagueIds 
      ? leagues.filter(league => enrolledLeagueIds.has(league.id))
      : leagues;
    
    leaguesToProcess.forEach(league => {
      if (league && league.id) {
        // First check if we have cached complete stats for this league
        const cachedStats = getCachedData(`league-stats-${league.id}`);
        
        if (cachedStats && cachedStats.resourcesCount > 0) {
          // Use cached complete stats
          basicStats[league.id] = cachedStats;
        } else {
          // Fall back to basic league data (may not have resource count)
          basicStats[league.id] = {
            weeksCount: league.weeksCount || league.weeks_count || league.totalWeeks || league._count?.weeks || 0,
            sectionsCount: league.sectionsCount || league.sections_count || league.totalSections || league._count?.sections || 0,
            resourcesCount: league.totalResources || league.resources_count || league._count?.resources || 0
          };
        }
      }
    });
    
    return basicStats;
  }

  /**
   * OPTIMIZATION 1: Parallel initial data loading
   * Load dashboard and leagues data simultaneously
   * REMOVED: Cohorts call - not used anywhere in dashboard
   */
  static async loadInitialDashboardData() {
    try {
      // Check cache first
      const cachedDashboard = getCachedData('dashboard');
      const cachedLeagues = getCachedData('leagues');

      const promises = [];
      const results = {};

      // Only fetch uncached data
      if (cachedDashboard) {
        results.dashboardData = cachedDashboard;
      } else {
        promises.push(
          ProgressService.getUserDashboard()
            .then(data => {
              setCachedData('dashboard', data);
              results.dashboardData = data;
            })
        );
      }

      if (cachedLeagues) {
        results.leagues = cachedLeagues;
      } else {
        promises.push(
          DataService.getLeagues()
            .then(data => {
              const leagues = data.leagues || [];
              setCachedData('leagues', leagues);
              results.leagues = leagues;
            })
        );
      }

      // Wait for all uncached requests to complete
      await Promise.allSettled(promises);

      const finalLeagues = results.leagues || [];
      const finalDashboardData = results.dashboardData || { enrollments: [], badges: [] };
      
      // Extract enrolled league IDs to optimize basic stats calculation
      const enrolledLeagueIds = finalDashboardData.enrollments?.length > 0 
        ? new Set(finalDashboardData.enrollments.map(enrollment => enrollment.league?.id).filter(Boolean))
        : null;
      
      return {
        dashboardData: finalDashboardData,
        leagues: finalLeagues,
        basicLeagueStats: this.extractBasicLeagueStats(finalLeagues, enrolledLeagueIds),
        fromCache: {
          dashboard: !!cachedDashboard,
          leagues: !!cachedLeagues
        }
      };
    } catch (error) {
      console.error('Error in loadInitialDashboardData:', error);
      
      // Return cached data if available, even if some requests failed
      const cachedLeagues = getCachedData('leagues') || [];
      const cachedDashboardData = getCachedData('dashboard') || { enrollments: [], badges: [] };
      
      // Extract enrolled league IDs even for cached data
      const enrolledLeagueIds = cachedDashboardData.enrollments?.length > 0 
        ? new Set(cachedDashboardData.enrollments.map(enrollment => enrollment.league?.id).filter(Boolean))
        : null;
      
      return {
        dashboardData: cachedDashboardData,
        leagues: cachedLeagues,
        basicLeagueStats: this.extractBasicLeagueStats(cachedLeagues, enrolledLeagueIds),
        error: error.message
      };
    }
  }

  /**
   * OPTIMIZATION 2: Smart league statistics calculation
   * Calculate statistics efficiently with caching and batching
   */
  static async calculateAllLeagueStatistics(leagues, onResourcesUpdate = null) {
    if (!leagues?.length) return {};

    const statistics = {};
    const batchSize = 3; // Process 3 leagues at a time
    
    try {
      // Process leagues in batches to avoid overwhelming the server
      for (let i = 0; i < leagues.length; i += batchSize) {
        const batch = leagues.slice(i, i + batchSize);
        const batchPromises = batch.map(async (league) => {
          const cacheKey = `league-stats-${league.id}`;
          const cached = getCachedData(cacheKey);
          
          if (cached) {
            statistics[league.id] = cached;
            // If cached data has complete resource count, call the callback immediately
            if (cached.resourcesCount > 0 && onResourcesUpdate) {
              onResourcesUpdate(league.id, cached.resourcesCount);
            }
            return;
          }

          try {
            const stats = await this.calculateSingleLeagueStats(league.id, onResourcesUpdate);
            setCachedData(cacheKey, stats);
            statistics[league.id] = stats;
          } catch (err) {
            console.warn(`Failed to calculate stats for league ${league.id}:`, err);
            statistics[league.id] = {
              weeksCount: 0,
              sectionsCount: 0,
              resourcesCount: 0
            };
          }
        });

        await Promise.allSettled(batchPromises);
      }

      return statistics;
    } catch (error) {
      console.error('Error calculating league statistics:', error);
      return {};
    }
  }

  /**
   * Calculate statistics for a single league efficiently
   */
  static async calculateSingleLeagueStats(leagueId, onResourcesUpdate = null) {
    const leagueData = await ProgressService.getLeagueProgress(leagueId);
    
    if (!leagueData?.progress?.weeks) {
      return { weeksCount: 0, sectionsCount: 0, resourcesCount: 0 };
    }

    let totalWeeks = leagueData.progress.weeks.length;
    let totalSections = 0;

    // Calculate sections count immediately
    for (const week of leagueData.progress.weeks) {
      if (week.sections) {
        totalSections += week.sections.length;
      }
    }

    // For resources, we'll estimate based on average or fetch in background
    // This prevents blocking the UI for resource counts
    const sectionIds = leagueData.progress.weeks.flatMap(week => 
      week.sections?.map(section => section.id) || []
    );

    // Background resource counting (non-blocking)
    if (sectionIds.length > 0) {
      this.countResourcesInBackground(sectionIds).then(count => {
        // Update cache with complete data
        const completeStats = {
          weeksCount: totalWeeks,
          sectionsCount: totalSections,
          resourcesCount: count
        };
        setCachedData(`league-stats-${leagueId}`, completeStats);
        
        // Notify component of the resource count update
        if (onResourcesUpdate) {
          onResourcesUpdate(leagueId, count);
        }
      });
    } else {
      // No sections means no resources - immediately notify with 0 count
      if (onResourcesUpdate) {
        onResourcesUpdate(leagueId, 0);
      }
    }

    return {
      weeksCount: totalWeeks,
      sectionsCount: totalSections,
      resourcesCount: 0 // Will be updated in background
    };
  }

  /**
   * OPTIMIZATION 3: Background resource counting
   * Count resources without blocking the main thread
   */
  static async countResourcesInBackground(sectionIds) {
    if (!sectionIds?.length) return 0;

    let totalResources = 0;
    const batchSize = 2; // Small batches for background processing

    try {
      for (let i = 0; i < sectionIds.length; i += batchSize) {
        const batch = sectionIds.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (sectionId) => {
          try {
            const sectionData = await ResourceProgressService.getSectionResourcesProgress(sectionId);
            return sectionData?.resources?.length || 0;
          } catch (err) {
            console.warn(`Failed to fetch resources for section ${sectionId}:`, err);
            return 0;
          }
        });

        const batchCounts = await Promise.allSettled(batchPromises);
        totalResources += batchCounts.reduce((sum, result) => 
          sum + (result.status === 'fulfilled' ? result.value : 0), 0
        );

        // Small delay between batches to avoid overwhelming the server
        if (i + batchSize < sectionIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return totalResources;
    } catch (error) {
      console.warn('Error counting resources in background:', error);
      return 0;
    }
  }

  /**
   * OPTIMIZATION 4: Optimized resource progress loading
   * Load resource progress for enrolled leagues efficiently
   */
  static async loadResourceProgressOptimized(dashboardData) {
    if (!dashboardData?.enrollments?.length) {
      return {
        allResourceProgress: {},
        allSectionResources: {},
        sectionToLeagueMap: {}
      };
    }

    const allProgress = {};
    const allSections = {};
    const sectionLeagueMap = {};

    try {
      // Process enrollments in parallel with controlled concurrency
      const batchSize = 2; // Process 2 leagues at a time
      
      for (let i = 0; i < dashboardData.enrollments.length; i += batchSize) {
        const batch = dashboardData.enrollments.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (enrollment) => {
          try {
            const cacheKey = `league-progress-${enrollment.league.id}`;
            let leagueData = getCachedData(cacheKey);
            
            if (!leagueData) {
              leagueData = await ProgressService.getLeagueProgress(enrollment.league.id);
              setCachedData(cacheKey, leagueData);
            }

            if (leagueData?.progress?.weeks) {
              // Process sections for this league
              const sectionIds = leagueData.progress.weeks.flatMap(week => 
                week.sections?.map(section => section.id) || []
              );

              // Batch process section resources
              for (const sectionId of sectionIds) {
                sectionLeagueMap[sectionId] = enrollment.league.id;
                
                try {
                  const sectionCacheKey = `section-resources-${sectionId}`;
                  let sectionData = getCachedData(sectionCacheKey);
                  
                  if (!sectionData) {
                    sectionData = await ResourceProgressService.getSectionResourcesProgress(sectionId);
                    setCachedData(sectionCacheKey, sectionData);
                  }

                  if (sectionData?.resources) {
                    allSections[sectionId] = sectionData.resources;
                    
                    // Store individual resource progress
                    sectionData.resources.forEach(resource => {
                      if (resource.progress) {
                        allProgress[resource.id] = resource.progress;
                      }
                    });
                  }
                } catch (sectionErr) {
                  console.warn(`Failed to fetch section ${sectionId}:`, sectionErr);
                }
              }
            }
          } catch (leagueErr) {
            console.warn(`Failed to fetch league ${enrollment.league.id}:`, leagueErr);
          }
        });

        await Promise.allSettled(batchPromises);
      }

      return {
        allResourceProgress: allProgress,
        allSectionResources: allSections,
        sectionToLeagueMap: sectionLeagueMap
      };
    } catch (error) {
      console.error('Error loading resource progress:', error);
      return {
        allResourceProgress: {},
        allSectionResources: {},
        sectionToLeagueMap: {}
      };
    }
  }

  /**
   * OPTIMIZATION 5: Progressive data loading
   * Load essential data first, then enhance with additional details
   */
  static async loadDashboardProgressive(onProgressUpdate) {
    const phases = {
      INITIAL: 'loading basic data',
      LEAGUES: 'loading league details', 
      RESOURCES: 'loading resource progress',
      STATISTICS: 'calculating statistics',
      COMPLETE: 'complete'
    };

    try {
      // Phase 1: Load basic dashboard data
      onProgressUpdate?.(phases.INITIAL, 25);
      const initialData = await this.loadInitialDashboardData();
      
      onProgressUpdate?.(phases.LEAGUES, 50);
      
      // Phase 2: Load resource progress for enrolled leagues
      const resourceData = await this.loadResourceProgressOptimized(initialData.dashboardData);
      
      onProgressUpdate?.(phases.RESOURCES, 75);
      
      // Phase 3: Calculate league statistics in background
      this.calculateAllLeagueStatistics(initialData.leagues).then(() => {
        onProgressUpdate?.(phases.STATISTICS, 90);
        // Statistics will be updated via callback when ready
      });

      onProgressUpdate?.(phases.COMPLETE, 100);

      return {
        ...initialData,
        ...resourceData,
        leagueStatistics: {} // Will be populated in background
      };
    } catch (error) {
      console.error('Error in progressive loading:', error);
      throw error;
    }
  }

  /**
   * Clear all cached data (useful for logout or data refresh)
   */
  static clearCache() {
    cache.clear();
  }

  /**
   * Prefetch data for better user experience
   */
  static async prefetchUserData() {
    try {
      // Prefetch common data that user might need
      const prefetchPromises = [
        ProgressService.getUserDashboard().then(data => setCachedData('dashboard', data)),
        DataService.getLeagues().then(data => setCachedData('leagues', data.leagues || []))
      ];

      await Promise.allSettled(prefetchPromises);
    } catch (error) {
      console.log('Prefetch failed, will load on demand:', error);
    }
  }
}

export default OptimizedDashboardService;
