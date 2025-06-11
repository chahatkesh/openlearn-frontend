/**
 * Data Service for OpenLearn Platform
 * Handles basic data fetching operations for cohorts, leagues, etc.
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
 * Data Service Class
 */
class DataService {
  // ==================== PUBLIC DATA FETCHING ====================
  
  /**
   * Get all cohorts
   * @returns {Promise} Cohorts data
   */
  static async getCohorts() {
    try {
      const response = await fetch(`${API_BASE_URL}/cohorts`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.warn('Cohorts API unavailable, using fallback data:', error.message);
      
      return {
        cohorts: [
          {
            id: 'mock_cohort_1',
            name: 'Cohort 1.0',
            description: 'The first cohort of learners in the OpenLearn platform.',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      };
    }
  }

  /**
   * Get all leagues
   * @returns {Promise} Leagues data
   */
  static async getLeagues() {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.warn('Leagues API unavailable, using fallback data:', error.message);
      
      return {
        leagues: [
          {
            id: 'mock_league_1',
            name: 'Machine Learning League',
            description: 'A comprehensive journey through ML fundamentals and applications.',
            weeksCount: 8,
            sectionsCount: 24,
            totalResources: 96,
            cohortId: 'mock_cohort_1'
          },
          {
            id: 'mock_league_2',
            name: 'Finance League',
            description: 'Understanding money, markets, and financial principles.',
            weeksCount: 6,
            sectionsCount: 18,
            totalResources: 72,
            cohortId: 'mock_cohort_1'
          }
        ]
      };
    }
  }

  /**
   * Get all weeks
   * @returns {Promise} Weeks data
   */
  static async getWeeks() {
    const response = await fetch(`${API_BASE_URL}/weeks`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all sections
   * @returns {Promise} Sections data
   */
  static async getSections() {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all specializations
   * @returns {Promise} Specializations data
   */
  static async getSpecializations() {
    const response = await fetch(`${API_BASE_URL}/specializations`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all resources
   * @returns {Promise} Resources data
   */
  static async getResources() {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== DETAILED DATA FETCHING ====================
  
  /**
   * Get detailed cohort information
   * @param {string} cohortId - Cohort ID
   * @returns {Promise} Cohort details
   */
  static async getCohortDetails(cohortId) {
    const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get detailed league information
   * @param {string} leagueId - League ID
   * @returns {Promise} League details
   */
  static async getLeagueDetails(leagueId) {
    const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all weeks for a specific league
   * @param {string} leagueId - League ID
   * @returns {Promise} Weeks data for the league
   */
  static async getWeeksByLeague(leagueId) {
    const response = await fetch(`${API_BASE_URL}/weeks/league/${leagueId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get week details with sections
   * @param {string} weekId - Week ID
   * @returns {Promise} Week details with sections
   */
  static async getWeekDetails(weekId) {
    const response = await fetch(`${API_BASE_URL}/weeks/${weekId}/sections`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get section details with resources and user progress
   * @param {string} sectionId - Section ID
   * @returns {Promise} Section details with resources and progress
   */
  static async getSectionDetails(sectionId) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all resources for a specific section
   * @param {string} sectionId - Section ID
   * @returns {Promise} Section resources
   */
  static async getSectionResources(sectionId) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/resources`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== SPECIFIC DATA QUERIES ====================

  /**
   * Get sections for a specific week
   * @param {string} weekId - Week ID
   * @returns {Promise} Sections data
   */
  static async getSectionsByWeek(weekId) {
    const sections = await this.getSections();
    return sections.filter(section => section.weekId === weekId);
  }

  /**
   * Get resources for a specific section
   * @param {string} sectionId - Section ID
   * @returns {Promise} Resources data
   */
  static async getResourcesBySection(sectionId) {
    const resources = await this.getResources();
    return resources.filter(resource => resource.sectionId === sectionId);
  }

  /**
   * Get league by ID
   * @param {string} leagueId - League ID
   * @returns {Promise} League data
   */
  static async getLeague(leagueId) {
    const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get week by ID
   * @param {string} weekId - Week ID
   * @returns {Promise} Week data
   */
  static async getWeek(weekId) {
    const response = await fetch(`${API_BASE_URL}/weeks/${weekId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get section by ID
   * @param {string} sectionId - Section ID
   * @returns {Promise} Section data
   */
  static async getSection(sectionId) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get leaderboard data (top 10 users by resource completion)
   * @returns {Promise} Leaderboard data
   */
  static async getLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get current user's rank and nearby users
   * @returns {Promise} User rank data
   */
  static async getMyRank() {
    const response = await fetch(`${API_BASE_URL}/leaderboard/my-rank`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get filtered leaderboard with optional filters
   * @param {Object} filters - Filter options
   * @param {string} filters.specialization - Filter by specialization ID
   * @param {string} filters.league - Filter by league ID
   * @param {number} filters.limit - Number of users to return (max 50, default 10)
   * @returns {Promise} Filtered leaderboard data
   */
  static async getFilteredLeaderboard(filters = {}) {
    const url = new URL(`${API_BASE_URL}/leaderboard/filtered`);
    
    // Add query parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        url.searchParams.append(key, filters[key]);
      }
    });
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== USER PROFILE ====================

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  static async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Find entity by ID in array
   * @param {Array} array - Array to search
   * @param {string} id - ID to find
   * @returns {Object|null} Found entity or null
   */
  static findById(array, id) {
    return array.find(item => item.id === id) || null;
  }

  /**
   * Group entities by a property
   * @param {Array} array - Array to group
   * @param {string} property - Property to group by
   * @returns {Object} Grouped entities
   */
  static groupBy(array, property) {
    return array.reduce((groups, item) => {
      const key = item[property];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }

  /**
   * Sort entities by property
   * @param {Array} array - Array to sort
   * @param {string} property - Property to sort by
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  static sortBy(array, property, order = 'asc') {
    return [...array].sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      
      if (typeof valueA === 'string') {
        return order === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number') {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      if (valueA instanceof Date) {
        return order === 'asc' 
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }
      
      return 0;
    });
  }

  /**
   * Filter entities by criteria
   * @param {Array} array - Array to filter
   * @param {Object} criteria - Filter criteria
   * @returns {Array} Filtered array
   */
  static filterBy(array, criteria) {
    return array.filter(item => {
      return Object.keys(criteria).every(key => {
        const filterValue = criteria[key];
        const itemValue = item[key];
        
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true;
        }
        
        if (typeof filterValue === 'string') {
          return itemValue && itemValue.toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return itemValue === filterValue;
      });
    });
  }

  /**
   * Paginate array
   * @param {Array} array - Array to paginate
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {Object} Paginated result
   */
  static paginate(array, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const paginatedItems = array.slice(offset, offset + limit);
    
    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total: array.length,
        totalPages: Math.ceil(array.length / limit),
        hasNext: page < Math.ceil(array.length / limit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Create a hierarchical structure from flat data
   * @param {Array} items - Flat array of items
   * @param {string} parentKey - Parent reference key
   * @param {string} idKey - ID key
   * @returns {Array} Hierarchical structure
   */
  static createHierarchy(items, parentKey = 'parentId', idKey = 'id') {
    const itemMap = new Map();
    const result = [];

    // Create a map of all items
    items.forEach(item => {
      itemMap.set(item[idKey], { ...item, children: [] });
    });

    // Build hierarchy
    items.forEach(item => {
      const mappedItem = itemMap.get(item[idKey]);
      if (item[parentKey]) {
        const parent = itemMap.get(item[parentKey]);
        if (parent) {
          parent.children.push(mappedItem);
        } else {
          result.push(mappedItem);
        }
      } else {
        result.push(mappedItem);
      }
    });

    return result;
  }

  // ==================== ASSIGNMENT MANAGEMENT ====================

  /**
   * Get assignment for a specific league
   * @param {string} leagueId - League ID
   * @returns {Promise} Assignment data
   */
  static async getLeagueAssignment(leagueId) {
    const response = await fetch(`${API_BASE_URL}/assignments/league/${leagueId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Submit assignment solution
   * @param {string} assignmentId - Assignment ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise} Submission response
   */
  static async submitAssignment(assignmentId, submissionData) {
    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(submissionData)
    });
    return handleResponse(response);
  }

  /**
   * Get user's assignment submissions
   * @returns {Promise} Assignment submissions
   */
  static async getMySubmissions() {
    const response = await fetch(`${API_BASE_URL}/assignments/my-submissions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}

export default DataService;
