/**
 * Activity Service
 * Handles API calls for user activity tracking and heatmap data
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

/**
 * Get authentication headers with token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

class ActivityService {
  /**
   * Get activity heatmap for a specific year
   * @param {number} year - Year to fetch (defaults to current year)
   * @param {string} userId - Optional user ID (for Pathfinder+ viewing others)
   * @returns {Promise<Object>} Heatmap data
   */
  static async getActivityHeatmap(year = new Date().getFullYear(), userId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/activity/heatmap`);
      url.searchParams.append('year', year.toString());
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch activity heatmap:', error);
      throw error;
    }
  }

  /**
   * Get activity statistics and streaks
   * @param {string} userId - Optional user ID (for Pathfinder+ viewing others)
   * @returns {Promise<Object>} Activity stats
   */
  static async getActivityStats(userId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/activity/stats`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
      throw error;
    }
  }

  /**
   * Get available years with activity data
   * @param {string} userId - Optional user ID (for Pathfinder+ viewing others)
   * @returns {Promise<Object>} Available years
   */
  static async getAvailableYears(userId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/activity/years`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch available years:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive activity dashboard
   * Combines heatmap, stats, and available years in one request
   * @param {number} year - Year to fetch for heatmap
   * @param {string} userId - Optional user ID (for Pathfinder+ viewing others)
   * @returns {Promise<Object>} Complete dashboard data
   */
  static async getActivityDashboard(year = new Date().getFullYear(), userId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/activity/dashboard`);
      url.searchParams.append('year', year.toString());
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch activity dashboard:', error);
      throw error;
    }
  }
}

export default ActivityService;
