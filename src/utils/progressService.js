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
   * Enroll user in a cohort/league combination
   * @param {string} cohortId - The cohort ID
   * @param {string} leagueId - The league ID  
   * @param {string} userId - Optional: user ID (for admin enrollment)
   * @returns {Promise} Enrollment data
   */
  static async enrollUser(cohortId, leagueId, userId = null) {
    try {
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
      console.warn('Enrollment API unavailable, simulating enrollment:', error.message);
      
      // Simulate successful enrollment for demo purposes
      return {
        enrollment: {
          id: `enrollment_${Date.now()}`,
          cohortId,
          leagueId,
          userId: userId || 'current_user',
          enrolledAt: new Date().toISOString(),
          progress: {
            progressPercentage: 0,
            completedSections: 0,
            totalSections: 12
          }
        },
        message: 'Successfully enrolled (demo mode)'
      };
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
      console.warn(`League progress API unavailable for ${leagueId}, using fallback data:`, error.message);
      
      // Return mock league progress data
      return {
        league: {
          id: leagueId,
          name: 'Sample League',
          description: 'A sample league for demonstration purposes.',
          weeksCount: 4,
          sectionsCount: 12,
          totalResources: 48
        },
        progress: {
          weeks: [
            {
              id: 'mock_week_1',
              name: 'Week 1: Introduction',
              description: 'Getting started with the fundamentals',
              order: 1,
              sections: [
                {
                  id: 'mock_section_1',
                  name: 'Section 1.1: Overview',
                  description: 'Course overview and objectives',
                  order: 1,
                  progress: {
                    isCompleted: true,
                    completedAt: '2024-01-16T10:30:00.000Z'
                  }
                },
                {
                  id: 'mock_section_2',
                  name: 'Section 1.2: Setup',
                  description: 'Environment setup and tools',
                  order: 2,
                  progress: {
                    isCompleted: false,
                    completedAt: null
                  }
                }
              ]
            }
          ],
          overallProgress: 25,
          completedSections: 3,
          totalSections: 12
        }
      };
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
      console.warn('Dashboard API unavailable, using fallback data:', error.message);
      
      // Return mock data structure to prevent crashes
      return {
        enrollments: [
          {
            id: 'mock_enrollment_1',
            league: {
              id: 'mock_league_1',
              name: 'Machine Learning League',
              description: 'A comprehensive journey through ML fundamentals and applications.',
              weeksCount: 8,
              sectionsCount: 24,
              totalResources: 96
            },
            cohort: {
              id: 'mock_cohort_1',
              name: 'Cohort 1.0'
            },
            progress: {
              progressPercentage: 65,
              completedSections: 15,
              totalSections: 24
            },
            enrolledAt: '2024-01-15T08:00:00.000Z'
          },
          {
            id: 'mock_enrollment_2',
            league: {
              id: 'mock_league_2',
              name: 'Finance League',
              description: 'Understanding money, markets, and financial principles.',
              weeksCount: 6,
              sectionsCount: 18,
              totalResources: 72
            },
            cohort: {
              id: 'mock_cohort_1',
              name: 'Cohort 1.0'
            },
            progress: {
              progressPercentage: 30,
              completedSections: 5,
              totalSections: 18
            },
            enrolledAt: '2024-02-01T08:00:00.000Z'
          }
        ],
        badges: [
          {
            id: 'mock_badge_1',
            name: 'First Steps',
            description: 'Completed your first section',
            earnedAt: '2024-01-16T10:30:00.000Z',
            league: {
              id: 'mock_league_1',
              name: 'Machine Learning League'
            }
          },
          {
            id: 'mock_badge_2',
            name: 'Week Warrior',
            description: 'Completed your first week',
            earnedAt: '2024-01-23T15:45:00.000Z',
            league: {
              id: 'mock_league_1',
              name: 'Machine Learning League'
            }
          }
        ],
        specializations: [],
        statistics: {
          overallProgress: 48,
          completedSections: 20,
          totalSections: 42,
          totalEnrollments: 2,
          badgesEarned: 2
        }
      };
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
}

export default ProgressService;
