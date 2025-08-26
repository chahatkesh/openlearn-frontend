/**
 * Resource Progress Service for OpenLearn Platform
 * Handles granular resource-level progress tracking including completion, notes, revision marking, and time tracking
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/resource-progress`;

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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${result.error || response.statusText}`);
    }
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    
    return result.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from server (HTTP ${response.status})`);
    }
    throw error;
  }
};

/**
 * Resource Progress Service Class
 */
class ResourceProgressService {
  
  // ==================== CORE PROGRESS TRACKING ====================
  
  /**
   * Get user's progress for a specific resource
   * @param {string} resourceId - Resource ID
   * @returns {Promise} Resource progress data
   */
  static async getResourceProgress(resourceId) {
    const response = await fetch(`${API_BASE_URL}/${resourceId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Mark a resource as completed with optional time tracking and notes
   * @param {string} resourceId - Resource ID
   * @param {number} timeSpent - Time spent in seconds (optional)
   * @param {string} personalNote - Personal note (optional)
   * @returns {Promise} Updated progress data
   */
  static async markResourceCompleted(resourceId, timeSpent = null, personalNote = null) {
    const response = await fetch(`${API_BASE_URL}/${resourceId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...(timeSpent && { timeSpent }),
        ...(personalNote && { personalNote })
      })
    });
    return handleResponse(response);
  }

  /**
   * Mark a resource for revision with optional notes
   * @param {string} resourceId - Resource ID
   * @param {string} personalNote - Personal note (optional)
   * @returns {Promise} Updated progress data
   */
  static async markResourceForRevision(resourceId, personalNote = null) {
    const response = await fetch(`${API_BASE_URL}/${resourceId}/revision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...(personalNote && { personalNote })
      })
    });
    return handleResponse(response);
  }

  /**
   * Update personal note for a resource
   * @param {string} resourceId - Resource ID
   * @param {string} personalNote - Personal note
   * @returns {Promise} Updated progress data
   */
  static async updateResourceNote(resourceId, personalNote) {
    const response = await fetch(`${API_BASE_URL}/${resourceId}/note`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ personalNote })
    });
    return handleResponse(response);
  }

  /**
   * Reset resource progress (unmark as completed/revision)
   * @param {string} resourceId - Resource ID
   * @returns {Promise} Reset progress data
   */
  static async resetResourceProgress(resourceId) {
    const response = await fetch(`${API_BASE_URL}/${resourceId}/reset`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== SECTION & BULK OPERATIONS ====================

  /**
   * Get all resources in a section with user's progress
   * @param {string} sectionId - Section ID
   * @returns {Promise} Section resources with progress data
   */
  static async getSectionResourcesProgress(sectionId) {
    const response = await fetch(`${API_BASE_URL}/section/${sectionId}/resources`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get user's resources marked for revision with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @returns {Promise} Revision resources data
   */
  static async getRevisionResources(page = 1, limit = 20) {
    const url = new URL(`${API_BASE_URL}/revision/list`);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== TIME TRACKING UTILITIES ====================

  /**
   * Start time tracking for a resource
   * @param {string} resourceId - Resource ID
   * @returns {Object} Time tracking object
   */
  static startTimeTracking(resourceId) {
    const startTime = Date.now();
    const trackingKey = `resource_time_${resourceId}`;
    
    // Store start time in localStorage for persistence
    localStorage.setItem(trackingKey, startTime.toString());
    
    return {
      resourceId,
      startTime,
      getElapsedSeconds: () => Math.floor((Date.now() - startTime) / 1000),
      stop: () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        localStorage.removeItem(trackingKey);
        return elapsed;
      }
    };
  }

  /**
   * Get elapsed time for a resource if tracking is active
   * @param {string} resourceId - Resource ID
   * @returns {number|null} Elapsed seconds or null if not tracking
   */
  static getElapsedTime(resourceId) {
    const trackingKey = `resource_time_${resourceId}`;
    const startTime = localStorage.getItem(trackingKey);
    
    if (!startTime) return null;
    
    return Math.floor((Date.now() - parseInt(startTime)) / 1000);
  }

  /**
   * Stop time tracking and return elapsed time
   * @param {string} resourceId - Resource ID
   * @returns {number} Elapsed seconds
   */
  static stopTimeTracking(resourceId) {
    const trackingKey = `resource_time_${resourceId}`;
    const startTime = localStorage.getItem(trackingKey);
    
    if (!startTime) return 0;
    
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    localStorage.removeItem(trackingKey);
    
    return elapsed;
  }

  // ==================== ANALYTICS & STATISTICS ====================

  /**
   * Calculate section-level statistics from resources
   * @param {Array} resources - Array of resources with progress
   * @returns {Object} Statistics object
   */
  static calculateSectionStatistics(resources) {
    const totalResources = resources.length;
    const completedResources = resources.filter(r => r.progress?.isCompleted).length;
    const markedForRevision = resources.filter(r => r.progress?.markedForRevision).length;
    const totalTimeSpent = resources.reduce((total, r) => {
      return total + (r.progress?.timeSpent || 0);
    }, 0);
    
    return {
      totalResources,
      completedResources,
      markedForRevision,
      completionPercentage: totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0,
      totalTimeSpent,
      averageTimePerResource: completedResources > 0 ? Math.round(totalTimeSpent / completedResources) : 0
    };
  }

  /**
   * Get resource type icon
   * @param {string} type - Resource type
   * @returns {string} Icon name or emoji
   */
  static getResourceTypeIcon(type) {
    const icons = {
      'VIDEO': '🎥',
      'ARTICLE': '📄',
      'DOCUMENT': '📄',
      'LINK': '🔗',
      'QUIZ': '❓',
      'EXERCISE': '💪',
      'BOOK': '📚',
      'AUDIO': '🎧',
      'IMAGE': '🖼️',
      'CODE': '💻'
    };
    
    return icons[type] || '📄';
  }

  /**
   * Format time duration in human-readable format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  static formatTimeSpent(seconds) {
    if (!seconds || seconds < 60) {
      return `${seconds || 0}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  /**
   * Get progress status display info
   * @param {Object} progress - Progress object
   * @returns {Object} Status display info
   */
  static getProgressStatusInfo(progress) {
    if (!progress) {
      return {
        status: 'not-started',
        label: 'Not Started',
        color: 'gray',
        icon: '⭕'
      };
    }
    
    if (progress.isCompleted) {
      return {
        status: 'completed',
        label: 'Completed',
        color: 'green',
        icon: '✅'
      };
    }
    
    if (progress.markedForRevision) {
      return {
        status: 'revision',
        label: 'Needs Revision',
        color: 'orange',
        icon: '⚠️'
      };
    }
    
    return {
      status: 'in-progress',
      label: 'In Progress',
      color: 'blue',
      icon: '🔄'
    };
  }

  // ==================== VALIDATION HELPERS ====================

  /**
   * Validate personal note
   * @param {string} note - Personal note
   * @returns {Object} Validation result
   */
  static validatePersonalNote(note) {
    if (!note) {
      return { isValid: true, error: null };
    }
    
    if (typeof note !== 'string') {
      return { isValid: false, error: 'Note must be a string' };
    }
    
    if (note.length > 1000) {
      return { isValid: false, error: 'Note cannot exceed 1000 characters' };
    }
    
    if (note.trim().length === 0) {
      return { isValid: false, error: 'Note cannot be empty' };
    }
    
    return { isValid: true, error: null };
  }

  /**
   * Validate time spent
   * @param {number} timeSpent - Time in seconds
   * @returns {Object} Validation result
   */
  static validateTimeSpent(timeSpent) {
    if (!timeSpent) {
      return { isValid: true, error: null };
    }
    
    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      return { isValid: false, error: 'Time spent must be a positive number' };
    }
    
    if (timeSpent > 86400) { // 24 hours in seconds
      return { isValid: false, error: 'Time spent cannot exceed 24 hours' };
    }
    
    return { isValid: true, error: null };
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Mark multiple resources as completed
   * @param {Array} resourceIds - Array of resource IDs
   * @param {string} personalNote - Optional note for all resources
   * @returns {Promise} Bulk operation result
   */
  static async markMultipleResourcesCompleted(resourceIds, personalNote = null) {
    const promises = resourceIds.map(resourceId => 
      this.markResourceCompleted(resourceId, null, personalNote)
    );
    
    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      return {
        successful,
        failed,
        results
      };
    } catch (error) {
      throw new Error('Bulk operation failed: ' + error.message);
    }
  }

  /**
   * Reset multiple resources progress
   * @param {Array} resourceIds - Array of resource IDs
   * @returns {Promise} Bulk operation result
   */
  static async resetMultipleResourcesProgress(resourceIds) {
    const promises = resourceIds.map(resourceId => 
      this.resetResourceProgress(resourceId)
    );
    
    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      return {
        successful,
        failed,
        results
      };
    } catch (error) {
      throw new Error('Bulk reset operation failed: ' + error.message);
    }
  }

  // ==================== LOCAL STORAGE HELPERS ====================

  /**
   * Save resource progress to local storage for offline access
   * @param {string} resourceId - Resource ID
   * @param {Object} progress - Progress data
   */
  static saveProgressToLocalStorage(resourceId, progress) {
    try {
      const storageKey = `resource_progress_${resourceId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        ...progress,
        lastSynced: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save progress to local storage:', error);
    }
  }

  /**
   * Get resource progress from local storage
   * @param {string} resourceId - Resource ID
   * @returns {Object|null} Progress data or null
   */
  static getProgressFromLocalStorage(resourceId) {
    try {
      const storageKey = `resource_progress_${resourceId}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to get progress from local storage:', error);
      return null;
    }
  }

  /**
   * Clear all resource progress from local storage
   */
  static clearLocalStorageProgress() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('resource_progress_') || key.startsWith('resource_time_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear local storage progress:', error);
    }
  }
}

export default ResourceProgressService;
