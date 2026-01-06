import useSWR from 'swr';
import OptimizedDashboardService from '../utils/api/optimizedDashboardService';

/**
 * Custom SWR hook for dashboard data
 * Automatically handles caching, revalidation, and loading states
 * 
 * @returns {Object} { data, error, isLoading, isValidating, mutate }
 */
export const useDashboard = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'dashboard-data',
    async () => {
      const result = await OptimizedDashboardService.loadInitialDashboardData();
      return result;
    },
    {
      // Revalidate on focus (when user returns to tab)
      revalidateOnFocus: true,
      
      // Revalidate every 5 minutes
      refreshInterval: 5 * 60 * 1000,
      
      // Keep previous data while revalidating
      keepPreviousData: true,
      
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
      
      // Retry on error
      shouldRetryOnError: true,
      errorRetryCount: 3,
      
      // Use cache when available
      revalidateIfStale: true,
    }
  );

  return {
    dashboardData: data?.dashboardData || null,
    leagues: data?.leagues || [],
    basicLeagueStats: data?.basicLeagueStats || {},
    isLoading,
    isValidating,
    error,
    mutate, // Function to manually trigger revalidation
  };
};

/**
 * Custom SWR hook for specific league progress
 * 
 * @param {string} leagueId - The league ID to fetch progress for
 * @returns {Object} { data, error, isLoading, mutate }
 */
export const useLeagueProgress = (leagueId) => {
  const { data, error, isLoading, mutate } = useSWR(
    leagueId ? `league-progress-${leagueId}` : null,
    async () => {
      const result = await OptimizedDashboardService.getLeagueProgress(leagueId);
      return result;
    },
    {
      revalidateOnFocus: true,
      refreshInterval: 5 * 60 * 1000,
      keepPreviousData: true,
      dedupingInterval: 2000,
    }
  );

  return {
    leagueProgress: data,
    isLoading,
    error,
    mutate,
  };
};
