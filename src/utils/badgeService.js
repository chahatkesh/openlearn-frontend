/**
 * Badge Service for OpenLearn Platform
 * Handles all badge-related API calls including creation, awarding, revoking, and analytics
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/badges`;

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
 * Badge Service Class
 */
class BadgeService {
  /**
   * Get all badges with user's earned status
   * @returns {Promise} All badges data
   */
  static async getAllBadges() {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get current user's earned badges
   * @returns {Promise} User's badges data
   */
  static async getMyBadges() {
    const response = await fetch(`${API_BASE_URL}/my-badges`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new badge for a league
   * @param {Object} badgeData - Badge creation data
   * @param {string} badgeData.name - Badge name
   * @param {string} badgeData.leagueId - League ID
   * @param {string} badgeData.description - Optional badge description
   * @param {string} badgeData.imageUrl - Optional badge image URL
   * @returns {Promise} Created badge data
   */
  static async createBadge(badgeData) {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(badgeData)
    });
    return handleResponse(response);
  }

  /**
   * Update badge details
   * @param {string} badgeId - Badge ID to update
   * @param {Object} updateData - Update data
   * @param {string} updateData.name - Optional updated name
   * @param {string} updateData.description - Optional updated description
   * @param {string} updateData.imageUrl - Optional updated image URL
   * @returns {Promise} Updated badge data
   */
  static async updateBadge(badgeId, updateData) {
    const response = await fetch(`${API_BASE_URL}/${badgeId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Manually award badge to a user
   * @param {string} badgeId - Badge ID to award
   * @param {string} userId - User ID to award badge to
   * @param {string} reason - Optional reason for awarding
   * @returns {Promise} Award data
   */
  static async awardBadge(badgeId, userId, reason = null) {
    const response = await fetch(`${API_BASE_URL}/${badgeId}/award`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId,
        ...(reason && { reason })
      })
    });
    return handleResponse(response);
  }

  /**
   * Revoke badge from a user
   * @param {string} badgeId - Badge ID to revoke
   * @param {string} userId - User ID to revoke badge from
   * @param {string} reason - Optional reason for revoking
   * @returns {Promise} Revoke confirmation
   */
  static async revokeBadge(badgeId, userId, reason = null) {
    const response = await fetch(`${API_BASE_URL}/${badgeId}/revoke`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId,
        ...(reason && { reason })
      })
    });
    return handleResponse(response);
  }

  /**
   * Get badge analytics and statistics
   * @returns {Promise} Badge analytics data
   */
  static async getBadgeAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Delete a badge (only if no users have earned it)
   * @param {string} badgeId - Badge ID to delete
   * @returns {Promise} Delete confirmation
   */
  static async deleteBadge(badgeId) {
    const response = await fetch(`${API_BASE_URL}/${badgeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Share badge achievement on social media
   * @param {Object} badge - Badge object
   * @param {string} platform - Social platform ('twitter' or 'linkedin')
   */
  static shareBadgeAchievement(badge, platform = 'twitter') {
    const message = this.generateBadgeShareMessage(badge);
    
    if (platform === 'twitter') {
      this.shareOnTwitter(message);
    } else if (platform === 'linkedin') {
      this.shareOnLinkedIn(message);
    }
  }

  /**
   * Generate share message for badge achievement
   * @param {Object} badge - Badge object
   * @returns {string} Share message
   */
  static generateBadgeShareMessage(badge) {
    const baseUrl = window.location.origin;
    return `🏆 Just earned the "${badge.name}" badge on @OpenLearn! ${badge.description} #Achievement #Badge #OpenLearn ${baseUrl}`;
  }

  /**
   * Share on X (Twitter)
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
   * Check if user can create/update badges
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage badges
   */
  static canManageBadges(user) {
    return user && ['CHIEF_PATHFINDER', 'GRAND_PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can award badges
   * @param {Object} user - User object
   * @returns {boolean} Whether user can award badges
   */
  static canAwardBadges(user) {
    return user && ['PATHFINDER', 'CHIEF_PATHFINDER', 'GRAND_PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can delete badges
   * @param {Object} user - User object
   * @returns {boolean} Whether user can delete badges
   */
  static canDeleteBadges(user) {
    return user && user.role === 'GRAND_PATHFINDER';
  }

  /**
   * Get badge status display info
   * @param {Object} badge - Badge object
   * @param {boolean} earnedByUser - Whether user has earned this badge
   * @returns {Object} Status display info
   */
  static getBadgeStatusInfo(badge, earnedByUser) {
    if (earnedByUser) {
      return {
        status: 'earned',
        text: 'Earned',
        color: 'green',
        icon: '✓'
      };
    }
    
    return {
      status: 'available',
      text: 'Available',
      color: 'gray',
      icon: '○'
    };
  }

  /**
   * Format badge for display
   * @param {Object} badge - Raw badge data from API
   * @returns {Object} Formatted badge data
   */
  static formatBadgeForDisplay(badge) {
    return {
      ...badge,
      earnedDateFormatted: badge.earnedAt 
        ? new Date(badge.earnedAt).toLocaleDateString()
        : null,
      createdDateFormatted: badge.createdAt 
        ? new Date(badge.createdAt).toLocaleDateString()
        : null,
      displayImage: badge.imageUrl || '/default-badge.png'
    };
  }

  /**
   * Group badges by category/league
   * @param {Array} badges - Array of badges
   * @returns {Object} Grouped badges by league
   */
  static groupBadgesByLeague(badges) {
    return badges.reduce((groups, badge) => {
      const leagueName = badge.league?.name || 'General';
      if (!groups[leagueName]) {
        groups[leagueName] = [];
      }
      groups[leagueName].push(badge);
      return groups;
    }, {});
  }

  /**
   * Calculate badge statistics
   * @param {Array} badges - Array of badges
   * @returns {Object} Badge statistics
   */
  static calculateBadgeStats(badges) {
    const total = badges.length;
    const earned = badges.filter(badge => badge.earnedByUser).length;
    const available = total - earned;
    const completionPercentage = total > 0 ? Math.round((earned / total) * 100) : 0;

    return {
      total,
      earned,
      available,
      completionPercentage
    };
  }

  /**
   * Sort badges by criteria
   * @param {Array} badges - Array of badges
   * @param {string} sortBy - Sort criteria ('name', 'date', 'popularity')
   * @param {string} order - Sort order ('asc', 'desc')
   * @returns {Array} Sorted badges
   */
  static sortBadges(badges, sortBy = 'name', order = 'asc') {
    const sorted = [...badges].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.earnedAt || a.createdAt) - new Date(b.earnedAt || b.createdAt);
          break;
        case 'popularity':
          comparison = (a.totalEarners || 0) - (b.totalEarners || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
    
    return sorted;
  }

  /**
   * Filter badges by criteria
   * @param {Array} badges - Array of badges
   * @param {Object} filters - Filter criteria
   * @param {string} filters.search - Search term
   * @param {string} filters.league - League filter
   * @param {string} filters.status - Status filter ('earned', 'available', 'all')
   * @returns {Array} Filtered badges
   */
  static filterBadges(badges, filters = {}) {
    let filtered = [...badges];
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(badge => 
        badge.name.toLowerCase().includes(searchTerm) ||
        badge.description?.toLowerCase().includes(searchTerm) ||
        badge.league?.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // League filter
    if (filters.league && filters.league !== 'all') {
      filtered = filtered.filter(badge => badge.league?.id === filters.league);
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'earned') {
        filtered = filtered.filter(badge => badge.earnedByUser);
      } else if (filters.status === 'available') {
        filtered = filtered.filter(badge => !badge.earnedByUser);
      }
    }
    
    return filtered;
  }
}

export default BadgeService;
