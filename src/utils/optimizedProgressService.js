/**
 * Optimized Progress Service for faster league detail page loading
 * Implements batch loading and caching strategies
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

/**
 * Get authorization header with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Handle API response and return data or throw error
 */
const handleResponse = async (response) => {
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  return result.data;
};

/**
 * Optimized Progress Service Class
 */
class OptimizedProgressService {
  
  /**
   * Get league progress with optimized resource loading
   * OPTIMIZATION: Single API call to get all league data including resources
   * @param {string} leagueId - The league ID
   * @returns {Promise} Complete league data with resources
   */
  static async getLeagueProgressOptimized(leagueId) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/complete`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Optimized league progress failed for ${leagueId}:`, error.message);
      throw error;
    }
  }

  /**
   * Batch load resources for multiple sections
   * OPTIMIZATION: Single API call for multiple sections
   * @param {Array} sectionIds - Array of section IDs
   * @returns {Promise} Batch resource data
   */
  static async batchLoadSectionResources(sectionIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/sections/batch/resources`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionIds })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error('Batch resource loading failed:', error.message);
      // Fallback to individual loading if batch fails
      throw error;
    }
  }

  /**
   * Get essential progress data only (for immediate display)
   * OPTIMIZATION: Lightweight API call for quick stats
   * @param {string} leagueId - The league ID
   * @returns {Promise} Essential progress data
   */
  static async getLeagueProgressSummary(leagueId) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/summary`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error(`League progress summary failed for ${leagueId}:`, error.message);
      throw error;
    }
  }
}

export default OptimizedProgressService;
