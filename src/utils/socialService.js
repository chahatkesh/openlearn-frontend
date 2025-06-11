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
   * Share overall progress with modal
   * @param {Object} progressData - Progress data to share
   */
  static shareProgress(progressData) {
    const message = `🚀 Making great progress on @OpenLearnPlatform! 

📊 Overall Progress: ${progressData.overallProgress}%
✅ Completed: ${progressData.completedSections}/${progressData.totalSections} sections

Join me in this learning journey! 🎓

#OpenLearn #Learning #Progress`;

    this.showShareModal('progress', { message, progressData });
  }

  /**
   * Share league-specific progress
   * @param {Object} leagueData - League progress data
   */
  static shareLeagueProgress(leagueData) {
    const message = `🎯 Making progress in ${leagueData.leagueName} on @OpenLearnPlatform!

📈 Progress: ${leagueData.progressPercentage}%
✅ Completed: ${leagueData.completedSections}/${leagueData.totalSections} sections

Learning never stops! 💪

#OpenLearn #${leagueData.leagueName.replace(/\s+/g, '')} #ContinuousLearning`;

    this.showShareModal('league', { message, leagueData });
  }

  /**
   * Show share modal with multiple platform options
   * @param {string} type - Type of share (progress, league, section, badge)
   * @param {Object} data - Share data
   * @param {Function} onShare - Callback when sharing is done
   */
  static showShareModal(type, data, onShare = null) {
    // Create modal HTML
    const modalHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="shareModal">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Share Your Achievement</h3>
            <button onclick="document.getElementById('shareModal').remove()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <textarea 
              id="shareMessage" 
              class="w-full p-3 border border-gray-300 rounded-lg resize-none" 
              rows="4"
              readonly
            >${data.message}</textarea>
          </div>
          
          <div class="flex flex-col space-y-2">
            <button 
              onclick="SocialService.shareOnTwitter(document.getElementById('shareMessage').value); document.getElementById('shareModal').remove();"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </button>
            
            <button 
              onclick="SocialService.shareOnLinkedIn(document.getElementById('shareMessage').value); document.getElementById('shareModal').remove();"
              class="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </button>
            
            <button 
              onclick="navigator.clipboard.writeText(document.getElementById('shareMessage').value).then(() => alert('Copied to clipboard!')); document.getElementById('shareModal').remove();"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Call callback if provided
    if (onShare) {
      onShare(type);
    }
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

  /**
   * Update user social handles/profiles
   * @param {Object} socialHandles - Social handles data
   * @param {string} socialHandles.twitterHandle - Twitter username (without @)
   * @param {string} socialHandles.linkedinUrl - LinkedIn profile URL
   * @param {string} socialHandles.githubUsername - GitHub username (without @)
   * @param {string} socialHandles.kaggleUsername - Kaggle username
   * @returns {Promise} Updated user data
   */
  static async updateSocialHandles(socialHandles) {
    // Transform the data to match backend API format for profile update
    const payload = {
      twitterHandle: socialHandles.twitterHandle || null,
      linkedinUrl: socialHandles.linkedinUrl || null,
      githubUsername: socialHandles.githubUsername || null,
      kaggleUsername: socialHandles.kaggleUsername || null
    };

    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    return handleResponse(response);
  }
}

export default SocialService;
