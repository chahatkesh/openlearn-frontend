/**
 * Progress Service for OpenLearn Platform
 * Handles all progress tracking API calls including enrollment, section completion, and dashboard data
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/progress`;

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
 * Progress Service Class
 */
class ProgressService {
  /**
   * Enroll user in a cohort/league combination
   * @param {string} cohortId - The cohort ID
   * @param {string} leagueId - The league ID  
   * @param {string} userId - Optional: user ID (for admin enrollment)
   * @returns {Promise} Enrollment data
   */
  static async enrollUser(cohortId, leagueId, userId = null) {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        cohortId,
        leagueId,
        ...(userId && { userId })
      })
    });
    return handleResponse(response);
  }

  /**
   * Mark a section as completed
   * @param {string} sectionId - The section ID to mark as complete
   * @param {string} personalNote - Optional personal note
   * @param {boolean} markedForRevision - Whether to mark for revision
   * @returns {Promise} Progress data
   */
  static async completeSection(sectionId, personalNote = null, markedForRevision = false) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        personalNote,
        markedForRevision
      })
    });
    return handleResponse(response);
  }

  /**
   * Update section progress (notes and revision flags only)
   * @param {string} sectionId - The section ID to update
   * @param {string} personalNote - Personal note
   * @param {boolean} markedForRevision - Whether to mark for revision
   * @returns {Promise} Progress data
   */
  static async updateSectionProgress(sectionId, personalNote, markedForRevision) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        personalNote,
        markedForRevision
      })
    });
    return handleResponse(response);
  }

  /**
   * Get detailed progress for a specific league
   * @param {string} leagueId - The league ID
   * @param {string} userId - Optional: user ID (for admin view)
   * @returns {Promise} League progress data
   */
  static async getLeagueProgress(leagueId, userId = null) {
    const url = new URL(`${API_BASE_URL}/leagues/${leagueId}`);
    if (userId) {
      url.searchParams.append('userId', userId);
    }
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get user dashboard with all enrollments, progress, and badges
   * @param {string} userId - Optional: user ID (for admin view)
   * @returns {Promise} Dashboard data
   */
  static async getUserDashboard(userId = null) {
    const url = new URL(`${API_BASE_URL}/dashboard`);
    if (userId) {
      url.searchParams.append('userId', userId);
    }
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all enrollments (admin view with filtering and pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.cohortId - Filter by cohort ID
   * @param {string} params.leagueId - Filter by league ID
   * @param {string} params.userId - Filter by user ID
   * @returns {Promise} Enrollments data with pagination
   */
  static async getAllEnrollments(params = {}) {
    const url = new URL(`${API_BASE_URL}/enrollments`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Share progress on social media
   * @param {string} type - Type of sharing (section, week, badge)
   * @param {Object} data - Data to share
   * @returns {string} Share URL or message
   */
  static generateShareMessage(type, data) {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'section':
        return `🎉 Just completed "${data.sectionName}" in ${data.leagueName} on @OpenLearn! #Learning #Progress #OpenLearn ${baseUrl}`;
      
      case 'week':
        return `📚 Finished Week ${data.weekNumber}: "${data.weekName}" in ${data.leagueName}! Another step forward in my learning journey. #WeekComplete #OpenLearn ${baseUrl}`;
      
      case 'badge':
        return `🏆 Earned the "${data.badgeName}" badge on @OpenLearn! Proud to have completed all sections in ${data.leagueName}. #Achievement #Badge #OpenLearn ${baseUrl}`;
      
      case 'league':
        return `🎓 Successfully completed the entire "${data.leagueName}" league on @OpenLearn! ${data.sectionsCount} sections mastered! #LeagueComplete #Achievement #OpenLearn ${baseUrl}`;
      
      default:
        return `🚀 Making great progress on my learning journey with @OpenLearn! #Learning #Progress #OpenLearn ${baseUrl}`;
    }
  }

  /**
   * Share on Twitter
   * @param {string} message - Message to share
   */
  static shareOnTwitter(message) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }

  /**
   * Share on LinkedIn
   * @param {string} message - Message to share
   */
  static shareOnLinkedIn(message) {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(message)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  }

  /**
   * Calculate progress statistics
   * @param {Object} dashboardData - Dashboard data from API
   * @returns {Object} Calculated statistics
   */
  static calculateProgressStats(dashboardData) {
    if (!dashboardData || !dashboardData.enrollments) {
      return {
        totalEnrollments: 0,
        totalSections: 0,
        completedSections: 0,
        overallProgress: 0,
        badgesEarned: 0,
        specializationsCompleted: 0,
        averageProgress: 0,
        streakData: { current: 0, longest: 0 }
      };
    }

    const { enrollments, badges = [], specializations = [] } = dashboardData;
    
    const totalSections = enrollments.reduce((sum, enrollment) => 
      sum + (enrollment.progress?.totalSections || 0), 0);
    
    const completedSections = enrollments.reduce((sum, enrollment) => 
      sum + (enrollment.progress?.completedSections || 0), 0);
    
    const overallProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    
    const averageProgress = enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, enrollment) => 
          sum + (enrollment.progress?.progressPercentage || 0), 0) / enrollments.length)
      : 0;

    return {
      totalEnrollments: enrollments.length,
      totalSections,
      completedSections,
      overallProgress,
      badgesEarned: badges.length,
      specializationsCompleted: specializations.length,
      averageProgress,
      streakData: { current: 0, longest: 0 } // TODO: Implement streak calculation
    };
  }

  /**
   * Get progress status text and color
   * @param {number} progressPercentage - Progress percentage
   * @returns {Object} Status object with text and color
   */
  static getProgressStatus(progressPercentage) {
    if (progressPercentage === 0) {
      return { text: 'Not Started', color: 'gray' };
    } else if (progressPercentage < 25) {
      return { text: 'Getting Started', color: 'blue' };
    } else if (progressPercentage < 50) {
      return { text: 'Making Progress', color: 'blue' };
    } else if (progressPercentage < 75) {
      return { text: 'Halfway There', color: 'yellow' };
    } else if (progressPercentage < 100) {
      return { text: 'Almost Done', color: 'orange' };
    } else {
      return { text: 'Completed', color: 'green' };
    }
  }

  /**
   * Check if user can enroll others (admin functionality)
   * @param {Object} user - User object
   * @returns {boolean} Whether user can enroll others
   */
  static canEnrollOthers(user) {
    return user && ['PATHFINDER', 'CHIEF_PATHFINDER', 'GRAND_PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can view others' progress (admin functionality)
   * @param {Object} user - User object  
   * @returns {boolean} Whether user can view others' progress
   */
  static canViewOthersProgress(user) {
    return user && ['PATHFINDER', 'CHIEF_PATHFINDER', 'GRAND_PATHFINDER'].includes(user.role);
  }
}

export default ProgressService;
