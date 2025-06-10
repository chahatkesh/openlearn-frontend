/**
 * Admin Service for OpenLearn Platform
 * Handles all admin-related API calls including user management, content management
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
 * Admin Service Class
 */
class AdminService {
  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users (admin view)
   * @returns {Promise} Users data
   */
  static async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Approve a user
   * @param {string} userId - User ID to approve
   * @returns {Promise} Approval result
   */
  static async approveUser(userId) {
    const response = await fetch(`${API_BASE_URL}/admin/approve-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId })
    });
    return handleResponse(response);
  }

  /**
   * Update user role
   * @param {string} userId - User ID
   * @param {string} newRole - New role
   * @returns {Promise} Update result
   */
  static async updateUserRole(userId, newRole) {
    const response = await fetch(`${API_BASE_URL}/admin/update-role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, newRole })
    });
    return handleResponse(response);
  }

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {string} newStatus - New status
   * @returns {Promise} Update result
   */
  static async updateUserStatus(userId, newStatus) {
    const response = await fetch(`${API_BASE_URL}/admin/update-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, newStatus })
    });
    return handleResponse(response);
  }

  // ==================== COHORT MANAGEMENT ====================

  /**
   * Get all cohorts
   * @returns {Promise} Cohorts data
   */
  static async getAllCohorts() {
    const response = await fetch(`${API_BASE_URL}/cohorts`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new cohort
   * @param {Object} cohortData - Cohort data
   * @returns {Promise} Created cohort
   */
  static async createCohort(cohortData) {
    const response = await fetch(`${API_BASE_URL}/cohorts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cohortData)
    });
    return handleResponse(response);
  }

  /**
   * Update a cohort
   * @param {string} cohortId - Cohort ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated cohort
   */
  static async updateCohort(cohortId, updateData) {
    const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a cohort
   * @param {string} cohortId - Cohort ID
   * @returns {Promise} Delete result
   */
  static async deleteCohort(cohortId) {
    const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== LEAGUE MANAGEMENT ====================

  /**
   * Get all leagues
   * @returns {Promise} Leagues data
   */
  static async getAllLeagues() {
    const response = await fetch(`${API_BASE_URL}/leagues`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new league
   * @param {Object} leagueData - League data
   * @returns {Promise} Created league
   */
  static async createLeague(leagueData) {
    const response = await fetch(`${API_BASE_URL}/leagues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leagueData)
    });
    return handleResponse(response);
  }

  /**
   * Update a league
   * @param {string} leagueId - League ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated league
   */
  static async updateLeague(leagueId, updateData) {
    const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a league
   * @param {string} leagueId - League ID
   * @returns {Promise} Delete result
   */
  static async deleteLeague(leagueId) {
    const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== SPECIALIZATION MANAGEMENT ====================

  /**
   * Get all specializations
   * @returns {Promise} Specializations data
   */
  static async getAllSpecializations() {
    const response = await fetch(`${API_BASE_URL}/specializations`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new specialization
   * @param {Object} specializationData - Specialization data
   * @returns {Promise} Created specialization
   */
  static async createSpecialization(specializationData) {
    const response = await fetch(`${API_BASE_URL}/specializations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(specializationData)
    });
    return handleResponse(response);
  }

  /**
   * Update a specialization
   * @param {string} specializationId - Specialization ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated specialization
   */
  static async updateSpecialization(specializationId, updateData) {
    const response = await fetch(`${API_BASE_URL}/specializations/${specializationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a specialization
   * @param {string} specializationId - Specialization ID
   * @returns {Promise} Delete result
   */
  static async deleteSpecialization(specializationId) {
    const response = await fetch(`${API_BASE_URL}/specializations/${specializationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== WEEK MANAGEMENT ====================

  /**
   * Get all weeks
   * @returns {Promise} Weeks data
   */
  static async getAllWeeks() {
    const response = await fetch(`${API_BASE_URL}/weeks`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new week
   * @param {Object} weekData - Week data
   * @returns {Promise} Created week
   */
  static async createWeek(weekData) {
    const response = await fetch(`${API_BASE_URL}/weeks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(weekData)
    });
    return handleResponse(response);
  }

  /**
   * Update a week
   * @param {string} weekId - Week ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated week
   */
  static async updateWeek(weekId, updateData) {
    const response = await fetch(`${API_BASE_URL}/weeks/${weekId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a week
   * @param {string} weekId - Week ID
   * @returns {Promise} Delete result
   */
  static async deleteWeek(weekId) {
    const response = await fetch(`${API_BASE_URL}/weeks/${weekId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== SECTION MANAGEMENT ====================

  /**
   * Get all sections
   * @returns {Promise} Sections data
   */
  static async getAllSections() {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new section
   * @param {Object} sectionData - Section data
   * @returns {Promise} Created section
   */
  static async createSection(sectionData) {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: sectionData.name,
        description: sectionData.description,
        order: sectionData.order,
        weekId: sectionData.weekId
      })
    });
    return handleResponse(response);
  }

  /**
   * Update a section
   * @param {string} sectionId - Section ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated section
   */
  static async updateSection(sectionId, updateData) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a section
   * @param {string} sectionId - Section ID
   * @returns {Promise} Delete result
   */
  static async deleteSection(sectionId) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== RESOURCE MANAGEMENT ====================

  /**
   * Get all resources
   * @returns {Promise} Resources data
   */
  static async getAllResources() {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new resource
   * @param {Object} resourceData - Resource data
   * @returns {Promise} Created resource
   */
  static async createResource(resourceData) {
    const response = await fetch(`${API_BASE_URL}/sections/${resourceData.sectionId}/resources`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: resourceData.title,
        url: resourceData.url,
        type: resourceData.type,
        order: resourceData.order
      })
    });
    return handleResponse(response);
  }

  /**
   * Update a resource
   * @param {string} resourceId - Resource ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated resource
   */
  static async updateResource(resourceId, updateData) {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  }

  /**
   * Delete a resource
   * @param {string} resourceId - Resource ID
   * @returns {Promise} Delete result
   */
  static async deleteResource(resourceId) {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Reorder resources within a section
   * @param {string} sectionId - Section ID
   * @param {Array} resourceOrders - Array of resource orders
   * @returns {Promise} Reorder result
   */
  static async reorderResources(sectionId, resourceOrders) {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/resources/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resourceOrders })
    });
    return handleResponse(response);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user has admin privileges
   * @param {Object} user - User object
   * @returns {boolean} Whether user is admin
   */
  static isAdmin(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can manage content
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage content
   */
  static canManageContent(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can manage users
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage users
   */
  static canManageUsers(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user.role);
  }

  /**
   * Get user role display info
   * @param {string} role - User role
   * @returns {Object} Role display info
   */
  static getRoleDisplayInfo(role) {
    const roleInfo = {
      'PIONEER': { name: 'Pioneer', color: 'blue', description: 'Basic learner access' },
      'LUMINARY': { name: 'Luminary', color: 'green', description: 'Advanced learner access' },
      'PATHFINDER': { name: 'Pathfinder', color: 'purple', description: 'Content contributor' },
      'CHIEF_PATHFINDER': { name: 'Chief Pathfinder', color: 'orange', description: 'Admin access' },
      'GRAND_PATHFINDER': { name: 'Grand Pathfinder', color: 'red', description: 'Full system access' }
    };
    
    return roleInfo[role] || { name: role, color: 'gray', description: 'Unknown role' };
  }

  /**
   * Get status display info
   * @param {string} status - User status
   * @returns {Object} Status display info
   */
  static getStatusDisplayInfo(status) {
    const statusInfo = {
      'PENDING': { name: 'Pending', color: 'yellow', description: 'Awaiting approval' },
      'ACTIVE': { name: 'Active', color: 'green', description: 'Active user' },
      'SUSPENDED': { name: 'Suspended', color: 'red', description: 'Account suspended' },
      'INACTIVE': { name: 'Inactive', color: 'gray', description: 'Inactive account' }
    };
    
    return statusInfo[status] || { name: status, color: 'gray', description: 'Unknown status' };
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Format date and time for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date and time
   */
  static formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }
}

export default AdminService;
