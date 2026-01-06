import useSWR from 'swr';
import OptimizedDashboardService from '../utils/api/optimizedDashboardService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/auth`;

/**
 * Custom SWR hook for user profile data
 * Automatically handles caching, revalidation, and loading states
 * 
 * @returns {Object} { user, error, isLoading, isValidating, mutate }
 */
export const useUserProfile = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'user-profile',
    async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      throw new Error(result.error || 'Failed to fetch profile');
    },
    {
      // Revalidate on focus (when user returns to tab)
      revalidateOnFocus: true,
      
      // Revalidate every 10 minutes (less frequent than dashboard)
      refreshInterval: 10 * 60 * 1000,
      
      // Keep previous data while revalidating
      keepPreviousData: true,
      
      // Dedupe requests within 5 seconds
      dedupingInterval: 5000,
      
      // Retry on error (don't retry if unauthorized)
      shouldRetryOnError: (error) => {
        return !error.message?.includes('401');
      },
      errorRetryCount: 2,
      
      // Use cache when available
      revalidateIfStale: true,
    }
  );

  return {
    user: data,
    isLoading,
    isValidating,
    error,
    mutate, // Function to manually trigger revalidation
  };
};

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
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    leagueId ? `league-progress-${leagueId}` : null,
    async () => {
      const ProgressService = (await import('../utils/api/progressService')).default;
      const result = await ProgressService.getLeagueProgress(leagueId);
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
    isValidating,
    error,
    mutate,
  };
};

/**
 * Custom SWR hook for section resources with progress
 * 
 * @param {string} sectionId - The section ID to fetch resources for
 * @param {boolean} shouldFetch - Whether to fetch (lazy loading support)
 * @returns {Object} { resources, resourceProgress, isLoading, error, mutate }
 */
export const useSectionResources = (sectionId, shouldFetch = true) => {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && sectionId ? `section-resources-${sectionId}` : null,
    async () => {
      const ResourceProgressService = (await import('../utils/api/resourceProgressService')).default;
      const result = await ResourceProgressService.getSectionResourcesProgress(sectionId);
      
      // Extract resource progress into a map
      const progressMap = {};
      if (result.resources) {
        result.resources.forEach(resource => {
          if (resource.progress) {
            progressMap[resource.id] = resource.progress;
          }
        });
      }
      
      return {
        resources: result.resources || [],
        resourceProgress: progressMap
      };
    },
    {
      revalidateOnFocus: false, // Don't revalidate on focus for individual sections
      refreshInterval: 0, // No automatic refresh
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  return {
    resources: data?.resources || [],
    resourceProgress: data?.resourceProgress || {},
    isLoading,
    error,
    mutate,
  };
};
