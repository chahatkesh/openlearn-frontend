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
  try {
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    return result.data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid API response format');
    }
    throw error;
  }
};

/**
 * Progress Service Class
 */
class ProgressService {
  /**
   * Helper function to check if a league enrollment should be disabled
   * @param {string} leagueName - The league name to check
   * @returns {boolean} True if enrollment is disabled
   */
  static isEnrollmentDisabled(leagueName) {
    const disabledLeagues = ['ML League (1.0)', 'Finance League (1.0)'];
    return disabledLeagues.includes(leagueName);
  }

  /**
   * Enroll user in a cohort/league combination
   * @param {string} cohortId - The cohort ID
   * @param {string} leagueId - The league ID  
   * @param {string} userId - Optional: user ID (for admin enrollment)
   * @returns {Promise} Enrollment data
   */
  static async enrollUser(cohortId, leagueId, userId = null) {
    try {
      // First, fetch league information to check if enrollment is disabled
      const leagueResponse = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
        headers: getAuthHeaders()
      });
      
      if (leagueResponse.ok) {
        const leagueResult = await leagueResponse.json();
        const leagueName = leagueResult.data?.name;
        
        if (leagueName && this.isEnrollmentDisabled(leagueName)) {
          throw new Error('Enrollment for this league is temporarily disabled. Please check back later.');
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/enroll`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cohortId,
          leagueId,
          ...(userId && { userId })
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error('Enrollment failed:', error.message);
      throw error;
    }
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
    try {
      const url = new URL(`${API_BASE_URL}/leagues/${leagueId}`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error(`League progress failed for ${leagueId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get user dashboard with all enrollments, progress, and badges
   * @param {string} userId - Optional: user ID (for admin view)
   * @returns {Promise} Dashboard data
   */
  static async getUserDashboard(userId = null) {
    try {
      const url = new URL(`${API_BASE_URL}/dashboard`);
      if (userId) {
        url.searchParams.append('userId', userId);
      }
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error('Dashboard API failed:', error.message);
      throw error;
    }
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
        return `🎉 Just completed "${data.sectionName}" in ${data.leagueName} on @OpenLearn_nitj! #Learning #Progress #OpenLearn ${baseUrl}`;
      
      case 'week':
        return `📚 Finished Week ${data.weekNumber}: "${data.weekName}" in ${data.leagueName}! Another step forward in my learning journey. #WeekComplete #OpenLearn ${baseUrl}`;
      
      case 'badge':
        return `🏆 Earned the "${data.badgeName}" badge on @OpenLearn_nitj! Proud to have completed all sections in ${data.leagueName}. #Achievement #Badge #OpenLearn ${baseUrl}`;
      
      case 'league':
        return `🎓 Successfully completed the entire "${data.leagueName}" league on @OpenLearn_nitj! ${data.sectionsCount} sections mastered! #LeagueComplete #Achievement #OpenLearn ${baseUrl}`;
      
      default:
        return `🚀 Making great progress on my learning journey with @OpenLearn_nitj! #Learning #Progress #OpenLearn ${baseUrl}`;
    }
  }

  /**
   * Share on X (Twitter)
   * @param {string} message - Message to share
   */
  static shareOnTwitter(message) {
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;
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
    // Handle null or undefined data
    if (!dashboardData) {
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

    const { enrollments = [], badges = [], specializations = [] } = dashboardData;
    
    // Safely calculate totals with default values
    const totalSections = enrollments.reduce((sum, enrollment) => {
      const sections = enrollment?.progress?.totalSections || 0;
      return sum + sections;
    }, 0);
    
    const completedSections = enrollments.reduce((sum, enrollment) => {
      const completed = enrollment?.progress?.completedSections || 0;
      return sum + completed;
    }, 0);
    
    const overallProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    
    const averageProgress = enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, enrollment) => {
          const progress = enrollment?.progress?.progressPercentage || 0;
          return sum + progress;
        }, 0) / enrollments.length)
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

  /**
   * Calculate overall resource progress across all enrollments
   * @param {Object} dashboardData - Dashboard data from API
   * @returns {Object} Overall resource progress statistics
   */
  static calculateOverallResourceProgress(dashboardData) {
    if (!dashboardData?.enrollments) {
      return {
        totalResources: 0,
        completedResources: 0,
        overallResourceProgress: 0,
        totalEnrollments: 0
      };
    }

    const { enrollments = [] } = dashboardData;
    
    // Calculate total resources and completed resources across all leagues
    let totalResources = 0;
    let completedResources = 0;
    
    enrollments.forEach(enrollment => {
      const leagueResources = enrollment?.league?.totalResources || 0;
      const progressPercentage = enrollment?.progress?.progressPercentage || 0;
      
      totalResources += leagueResources;
      completedResources += Math.round((progressPercentage / 100) * leagueResources);
    });
    
    const overallResourceProgress = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
    
    return {
      totalResources,
      completedResources,
      overallResourceProgress,
      totalEnrollments: enrollments.length
    };
  }

  /**
   * Calculate accurate section and week progress based on resource completion
   * @param {Object} dashboardData - Dashboard data from API
   * @param {Object} allResourceProgress - All resource progress data from sections
   * @param {Object} allSectionResources - Mapping of section ID to resources array
   * @returns {Object} Accurate section and week progress statistics
   */
  static calculateAccurateSectionProgress(dashboardData, allResourceProgress = {}, allSectionResources = {}) {
    if (!dashboardData?.enrollments) {
      return {
        totalSections: 0,
        completedSections: 0,
        totalWeeks: 0,
        completedWeeks: 0,
        sectionProgress: {},
        weekProgress: {}
      };
    }

    const { enrollments = [] } = dashboardData;
    let totalSections = 0;
    let completedSections = 0;
    let totalWeeks = 0;
    let completedWeeks = 0;
    const sectionProgress = {};
    const weekProgress = {};

    enrollments.forEach(enrollment => {
      // Use section count from enrollment or fall back to estimation
      const enrollmentSections = enrollment?.progress?.totalSections || 0;
      totalSections += enrollmentSections;
    });

    // Calculate actual section completion from resource data
    Object.keys(allSectionResources).forEach(sectionId => {
      const sectionResources = allSectionResources[sectionId] || [];
      const totalResourcesInSection = sectionResources.length;
      const completedResourcesInSection = sectionResources.filter(resource => 
        allResourceProgress[resource.id]?.isCompleted
      ).length;

      if (totalResourcesInSection > 0) {
        const sectionCompletionPercentage = Math.round(
          (completedResourcesInSection / totalResourcesInSection) * 100
        );
        
        sectionProgress[sectionId] = {
          completed: completedResourcesInSection,
          total: totalResourcesInSection,
          percentage: sectionCompletionPercentage,
          isComplete: sectionCompletionPercentage === 100
        };

        // Count completed sections
        if (sectionCompletionPercentage === 100) {
          completedSections++;
        }
      }
    });

    return {
      totalSections,
      completedSections,
      totalWeeks,
      completedWeeks,
      sectionProgress,
      weekProgress,
      sectionCompletionPercentage: totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0
    };
  }

  /**
   * Calculate accurate resource progress using actual resource completion data
   * @param {Object} dashboardData - Dashboard data from API
   * @param {Object} allResourceProgress - All resource progress data from sections
   * @returns {Object} Accurate resource progress statistics
   */
  static calculateAccurateResourceProgress(dashboardData, allResourceProgress = {}) {
    if (!dashboardData?.enrollments) {
      return {
        totalResources: 0,
        completedResources: 0,
        overallResourceProgress: 0,
        totalEnrollments: 0
      };
    }

    const { enrollments = [] } = dashboardData;
    
    // Calculate actual resource completion from resource progress data
    let totalResources = 0;
    let completedResources = 0;
    
    // Count actual resources from the progress data
    Object.keys(allResourceProgress).forEach(resourceId => {
      totalResources++;
      if (allResourceProgress[resourceId]?.isCompleted) {
        completedResources++;
      }
    });
    
    // If no resource progress data available, fall back to enrollment estimates
    if (totalResources === 0) {
      enrollments.forEach(enrollment => {
        const leagueResources = enrollment?.league?.totalResources || 0;
        const progressPercentage = enrollment?.progress?.progressPercentage || 0;
        
        totalResources += leagueResources;
        completedResources += Math.round((progressPercentage / 100) * leagueResources);
      });
    }
    
    const overallResourceProgress = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;
    
    return {
      totalResources,
      completedResources,
      overallResourceProgress,
      totalEnrollments: enrollments.length
    };
  }
}

export default ProgressService;
