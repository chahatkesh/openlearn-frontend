/**
 * Social Service for OpenLearn Platform
 * Handles all social sharing API calls and functionality
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/social`;

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
 * Social Service Class
 */
class SocialService {
  /**
   * Generate share URL for Twitter - Section completion
   * @param {string} sectionId - Section ID
   * @returns {Promise} Share URL data
   */
  static async getTwitterSectionShareUrl(sectionId) {
    const response = await fetch(`${API_BASE_URL}/twitter/section/${sectionId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Generate share URL for LinkedIn - Week completion
   * @param {string} weekId - Week ID
   * @returns {Promise} Share URL data
   */
  static async getLinkedInWeekShareUrl(weekId) {
    const response = await fetch(`${API_BASE_URL}/linkedin/week/${weekId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Generate share URL for Twitter - Badge achievement
   * @param {string} badgeId - Badge ID
   * @returns {Promise} Share URL data
   */
  static async getTwitterBadgeShareUrl(badgeId) {
    const response = await fetch(`${API_BASE_URL}/twitter/badge/${badgeId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Generate share URL for LinkedIn - Badge achievement
   * @param {string} badgeId - Badge ID
   * @returns {Promise} Share URL data
   */
  static async getLinkedInBadgeShareUrl(badgeId) {
    const response = await fetch(`${API_BASE_URL}/linkedin/badge/${badgeId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Share section completion on Twitter
   * @param {string} sectionId - Section ID
   * @param {Object} sectionData - Optional section data for fallback
   */
  static async shareSection(sectionId, sectionData = null) {
    try {
      const shareData = await this.getTwitterSectionShareUrl(sectionId);
      window.open(shareData.shareUrl, '_blank', 'width=550,height=420');
    } catch (error) {
      console.error('Error getting share URL, using fallback:', error);
      // Fallback to manual share
      if (sectionData) {
        const message = this.generateSectionShareMessage(sectionData);
        this.shareOnTwitter(message);
      }
    }
  }

  /**
   * Share week completion on LinkedIn
   * @param {string} weekId - Week ID
   * @param {Object} weekData - Optional week data for fallback
   */
  static async shareWeek(weekId, weekData = null) {
    try {
      const shareData = await this.getLinkedInWeekShareUrl(weekId);
      window.open(shareData.shareUrl, '_blank', 'width=550,height=420');
    } catch (error) {
      console.error('Error getting share URL, using fallback:', error);
      // Fallback to manual share
      if (weekData) {
        const message = this.generateWeekShareMessage(weekData);
        this.shareOnLinkedIn(message);
      }
    }
  }

  /**
   * Share badge achievement on Twitter
   * @param {string} badgeId - Badge ID
   * @param {Object} badgeData - Optional badge data for fallback
   */
  static async shareBadgeTwitter(badgeId, badgeData = null) {
    try {
      const shareData = await this.getTwitterBadgeShareUrl(badgeId);
      window.open(shareData.shareUrl, '_blank', 'width=550,height=420');
    } catch (error) {
      console.error('Error getting share URL, using fallback:', error);
      // Fallback to manual share
      if (badgeData) {
        const message = this.generateBadgeShareMessage(badgeData);
        this.shareOnTwitter(message);
      }
    }
  }

  /**
   * Share badge achievement on LinkedIn
   * @param {string} badgeId - Badge ID
   * @param {Object} badgeData - Optional badge data for fallback
   */
  static async shareBadgeLinkedIn(badgeId, badgeData = null) {
    try {
      const shareData = await this.getLinkedInBadgeShareUrl(badgeId);
      window.open(shareData.shareUrl, '_blank', 'width=550,height=420');
    } catch (error) {
      console.error('Error getting share URL, using fallback:', error);
      // Fallback to manual share
      if (badgeData) {
        const message = this.generateBadgeShareMessage(badgeData);
        this.shareOnLinkedIn(message);
      }
    }
  }

  /**
   * Generate manual share message for section completion
   * @param {Object} sectionData - Section data
   * @returns {string} Share message
   */
  static generateSectionShareMessage(sectionData) {
    const baseUrl = window.location.origin;
    return `🎉 Just completed "${sectionData.name}" in ${sectionData.leagueName} on @OpenLearn! Making great progress in my learning journey. #Learning #Progress #OpenLearn ${baseUrl}`;
  }

  /**
   * Generate manual share message for week completion
   * @param {Object} weekData - Week data
   * @returns {string} Share message
   */
  static generateWeekShareMessage(weekData) {
    const baseUrl = window.location.origin;
    return `📚 Finished Week ${weekData.order}: "${weekData.name}" in ${weekData.leagueName}! Another step forward in my learning journey on OpenLearn. #WeekComplete #LearningJourney #OpenLearn ${baseUrl}`;
  }

  /**
   * Generate manual share message for badge achievement
   * @param {Object} badgeData - Badge data
   * @returns {string} Share message
   */
  static generateBadgeShareMessage(badgeData) {
    const baseUrl = window.location.origin;
    return `🏆 Earned the "${badgeData.name}" badge on @OpenLearn! ${badgeData.description || 'Proud of this achievement!'} #Achievement #Badge #OpenLearn ${baseUrl}`;
  }

  /**
   * Generate progress share message
   * @param {Object} progressData - Progress data
   * @returns {string} Share message
   */
  static generateProgressShareMessage(progressData) {
    const baseUrl = window.location.origin;
    const { overallProgress, completedSections, totalSections, enrollments } = progressData;
    
    return `🚀 Making amazing progress on @OpenLearn! ${overallProgress}% complete across ${enrollments} leagues (${completedSections}/${totalSections} sections). #LearningJourney #Progress #OpenLearn ${baseUrl}`;
  }

  /**
   * Generate league completion share message
   * @param {Object} leagueData - League data
   * @returns {string} Share message
   */
  static generateLeagueShareMessage(leagueData) {
    const baseUrl = window.location.origin;
    return `🎓 Successfully completed the entire "${leagueData.name}" league on @OpenLearn! ${leagueData.sectionsCount} sections mastered! Ready for the next challenge. #LeagueComplete #Achievement #OpenLearn ${baseUrl}`;
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
   * Share on Facebook
   * @param {string} message - Message to share
   */
  static shareOnFacebook(message) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(message)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  }

  /**
   * Copy share message to clipboard
   * @param {string} message - Message to copy
   * @returns {Promise} Copy operation result
   */
  static async copyToClipboard(message) {
    try {
      await navigator.clipboard.writeText(message);
      return { success: true, message: 'Copied to clipboard!' };
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return { success: false, message: 'Failed to copy to clipboard' };
    }
  }

  /**
   * Show share modal with multiple platform options
   * @param {string} type - Type of share (section, week, badge, progress, league)
   * @param {Object} data - Data to share
   * @param {Function} onShare - Callback when sharing is completed
   */
  static showShareModal(type, data, onShare = null) {
    let message = '';
    
    switch (type) {
      case 'section':
        message = this.generateSectionShareMessage(data);
        break;
      case 'week':
        message = this.generateWeekShareMessage(data);
        break;
      case 'badge':
        message = this.generateBadgeShareMessage(data);
        break;
      case 'progress':
        message = this.generateProgressShareMessage(data);
        break;
      case 'league':
        message = this.generateLeagueShareMessage(data);
        break;
      default:
        message = `🚀 Making great progress on my learning journey with @OpenLearn! #Learning #Progress #OpenLearn ${window.location.origin}`;
    }

    // Create a simple share modal (you can replace this with a more sophisticated modal)
    const shareOptions = [
      { name: 'Twitter', action: () => this.shareOnTwitter(message) },
      { name: 'LinkedIn', action: () => this.shareOnLinkedIn(message) },
      { name: 'Facebook', action: () => this.shareOnFacebook(message) },
      { name: 'Copy Link', action: async () => {
        const result = await this.copyToClipboard(message);
        alert(result.message);
      }}
    ];

    // Simple implementation - you can enhance this with a proper modal component
    const choice = window.prompt(
      `Share your achievement!\n\nMessage: ${message}\n\nChoose platform:\n1. Twitter\n2. LinkedIn\n3. Facebook\n4. Copy to Clipboard\n\nEnter number (1-4):`
    );

    const choiceIndex = parseInt(choice) - 1;
    if (choiceIndex >= 0 && choiceIndex < shareOptions.length) {
      shareOptions[choiceIndex].action();
      if (onShare) onShare(shareOptions[choiceIndex].name);
    }
  }

  /**
   * Get social share buttons configuration
   * @param {string} type - Type of content being shared
   * @param {Object} data - Data for sharing
   * @returns {Array} Array of share button configurations
   */
  static getShareButtons(type, data) {
    const message = this.getShareMessage(type, data);
    
    return [
      {
        platform: 'twitter',
        label: 'Share on Twitter',
        icon: '🐦',
        color: '#1DA1F2',
        action: () => this.shareOnTwitter(message)
      },
      {
        platform: 'linkedin',
        label: 'Share on LinkedIn', 
        icon: '💼',
        color: '#0077B5',
        action: () => this.shareOnLinkedIn(message)
      },
      {
        platform: 'facebook',
        label: 'Share on Facebook',
        icon: '📘',
        color: '#4267B2',
        action: () => this.shareOnFacebook(message)
      },
      {
        platform: 'copy',
        label: 'Copy to Clipboard',
        icon: '📋',
        color: '#6B7280',
        action: async () => {
          const result = await this.copyToClipboard(message);
          return result;
        }
      }
    ];
  }

  /**
   * Get appropriate share message based on type and data
   * @param {string} type - Type of content
   * @param {Object} data - Data for sharing
   * @returns {string} Share message
   */
  static getShareMessage(type, data) {
    switch (type) {
      case 'section':
        return this.generateSectionShareMessage(data);
      case 'week':
        return this.generateWeekShareMessage(data);
      case 'badge':
        return this.generateBadgeShareMessage(data);
      case 'progress':
        return this.generateProgressShareMessage(data);
      case 'league':
        return this.generateLeagueShareMessage(data);
      default:
        return `🚀 Making great progress on my learning journey with @OpenLearn! #Learning #Progress #OpenLearn ${window.location.origin}`;
    }
  }

  /**
   * Track social share analytics (if needed)
   * @param {string} platform - Platform shared to
   * @param {string} type - Type of content shared
   * @param {string} contentId - ID of content shared
   */
  static trackShare(platform, type, contentId) {
    // This could be enhanced to track analytics
    console.log(`Shared ${type} (${contentId}) on ${platform}`);
    
    // Could send analytics to your backend
    // analytics.track('social_share', { platform, type, contentId });
  }
}

export default SocialService;
