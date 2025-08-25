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
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 100 to get all users)
   * @returns {Promise} Users data
   */
  static async getAllUsers(page = 1, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
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

  /**
   * Get pending users
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 100)
   * @returns {Promise} Pending users data
   */
  static async getPendingUsers(page = 1, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/admin/pending-users?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Get all users by fetching all pages (tries multiple endpoints)
   * @returns {Promise} All users data
   */
  static async getAllUsersComplete() {
    try {
      // First try the main admin users endpoint
      try {
        const firstPage = await this.getAllUsers(1, 100);
        let allUsers = firstPage.users || [];
        
        // If there are more pages, fetch them
        if (firstPage.pagination && firstPage.pagination.totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= firstPage.pagination.totalPages; page++) {
            promises.push(this.getAllUsers(page, 100));
          }
          
          const additionalPages = await Promise.all(promises);
          additionalPages.forEach(pageData => {
            if (pageData.users) {
              allUsers = allUsers.concat(pageData.users);
            }
          });
        }
        
        return {
          users: allUsers,
          pagination: {
            page: 1,
            limit: allUsers.length,
            total: allUsers.length,
            totalPages: 1
          }
        };
      } catch (error) {
        console.warn('Main users endpoint failed, trying pending users endpoint:', error);
        
        // Fallback: try pending users endpoint
        const pendingData = await this.getPendingUsers(1, 100);
        let allUsers = pendingData.users || [];
        
        // Fetch all pages of pending users
        if (pendingData.pagination && pendingData.pagination.totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= pendingData.pagination.totalPages; page++) {
            promises.push(this.getPendingUsers(page, 100));
          }
          
          const additionalPages = await Promise.all(promises);
          additionalPages.forEach(pageData => {
            if (pageData.users) {
              allUsers = allUsers.concat(pageData.users);
            }
          });
        }
        
        return {
          users: allUsers,
          pagination: {
            page: 1,
            limit: allUsers.length,
            total: allUsers.length,
            totalPages: 1
          }
        };
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Get all users with a high limit (simple approach)
   * @param {number} limit - Items per page (default: 1000 to get all users)
   * @returns {Promise} Users data
   */
  static async getAllUsersSimple(limit = 1000) {    
    try {
      // Try the main users endpoint first
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=${limit}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        console.warn(`/admin/users endpoint failed with status: ${response.status}`);
        
        // If that fails, try pending users endpoint as fallback
        const pendingResponse = await fetch(`${API_BASE_URL}/admin/pending-users?limit=${limit}`, {
          headers: getAuthHeaders()
        });
        
        if (!pendingResponse.ok) {
          throw new Error(`Both endpoints failed. Pending users status: ${pendingResponse.status}`);
        }
        
        const pendingResult = await handleResponse(pendingResponse);
        
        // Add a note that these are only pending users
        return {
          ...pendingResult,
          note: 'Only pending users loaded - /admin/users endpoint not available'
        };
      }
      
      const result = await handleResponse(response);
      return result;
      
    } catch (error) {
      console.error('Error in getAllUsersSimple:', error);
      throw error;
    }
  }

  /**
   * Get all users using different strategies
   * @returns {Promise} Users data
   */
  static async getAllUsersStrategic() {
    
    // Strategy 1: Try high limit on main endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=1000`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await handleResponse(response);
        return result;
      } else {
        console.log('Strategy 1 failed with status:', response.status);
      }
    } catch (error) {
      console.log('Strategy 1 error:', error.message);
    }
    
    // Strategy 2: Try pagination to get all pages
    try {
      let allUsers = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=50`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          break;
        }
        
        const pageData = await handleResponse(response);
        if (pageData.users && pageData.users.length > 0) {
          allUsers = allUsers.concat(pageData.users);
          hasMore = pageData.pagination && page < pageData.pagination.totalPages;
          page++;
        } else {
          hasMore = false;
        }
        
        // Safety break to avoid infinite loops
        if (page > 20) {
          console.warn('Strategy 2: Breaking loop after 20 pages for safety');
          break;
        }
      }
      
      if (allUsers.length > 0) {
        return {
          users: allUsers,
          pagination: {
            page: 1,
            limit: allUsers.length,
            total: allUsers.length,
            totalPages: 1
          }
        };
      }
    } catch (error) {
      console.log('Strategy 2 error:', error.message);
    }
    
    // Strategy 3: Try pending users as fallback
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pending-users?limit=1000`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await handleResponse(response);
        return {
          ...result,
          note: 'Only pending users loaded - main users endpoint not available'
        };
      } else {
        console.log('Strategy 3 failed with status:', response.status);
      }
    } catch (error) {
      console.log('Strategy 3 error:', error.message);
    }
    
    // All strategies failed
    throw new Error('All user fetching strategies failed. Please check if the backend endpoints exist.');
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

  // ==================== LEAGUE ASSIGNMENT MANAGEMENT ====================

  /**
   * Assign leagues to a pathfinder
   * @param {string} pathfinderId - Pathfinder user ID
   * @param {Array} leagueIds - Array of league IDs to assign
   * @param {Object} permissions - Permission settings
   * @returns {Promise} Assignment result
   */
  static async assignLeaguesToPathfinder(pathfinderId, leagueIds, permissions) {
    const response = await fetch(`${API_BASE_URL}/admin/assign-leagues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        pathfinderId,
        leagueIds,
        permissions
      })
    });
    return handleResponse(response);
  }

  /**
   * Get pathfinder's league assignments
   * @param {string} pathfinderId - Pathfinder user ID
   * @returns {Promise} League assignments data
   */
  static async getPathfinderLeagues(pathfinderId) {
    const response = await fetch(`${API_BASE_URL}/admin/pathfinder-leagues/${pathfinderId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Remove league assignment from pathfinder
   * @param {string} pathfinderId - Pathfinder user ID
   * @param {string} leagueId - League ID to remove
   * @returns {Promise} Removal result
   */
  static async removePathfinderLeague(pathfinderId, leagueId) {
    const response = await fetch(`${API_BASE_URL}/admin/pathfinder-leagues/${pathfinderId}/${leagueId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Update pathfinder permissions for a specific league
   * @param {string} pathfinderId - Pathfinder user ID
   * @param {string} leagueId - League ID
   * @param {Object} permissions - Updated permissions
   * @returns {Promise} Update result
   */
  static async updatePathfinderPermissions(pathfinderId, leagueId, permissions) {
    const response = await fetch(`${API_BASE_URL}/admin/pathfinder-leagues/${pathfinderId}/${leagueId}/permissions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permissions })
    });
    return handleResponse(response);
  }

  /**
   * Get all pathfinder assignments overview
   * @returns {Promise} All pathfinder assignments data
   */
  static async getAllPathfinderAssignments() {
    const response = await fetch(`${API_BASE_URL}/admin/pathfinder-assignments`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Promote user to pathfinder with league assignments
   * @param {string} userId - User ID to promote
   * @param {string} newRole - New role (PATHFINDER or CHIEF_PATHFINDER)
   * @param {Array} leagueAssignments - Array of league assignments with permissions
   * @returns {Promise} Promotion and assignment result
   */
  static async promoteToPathfinderWithLeagues(userId, newRole, leagueAssignments = []) {
    console.log('AdminService received:', { userId, newRole, leagueAssignments });
    
    // First update the role
    await this.updateUserRole(userId, newRole);
    
    // Then assign leagues if provided
    if (Array.isArray(leagueAssignments) && leagueAssignments.length > 0) {
      const leagueIds = leagueAssignments.map(assignment => assignment.leagueId);
      const permissions = leagueAssignments[0]?.permissions || {
        canManageUsers: false,
        canViewAnalytics: true,
        canCreateContent: false
      };
      
      console.log('Extracted league IDs:', leagueIds, 'permissions:', permissions);
      return await this.assignLeaguesToPathfinder(userId, leagueIds, permissions);
    }
    
    return { success: true, message: 'User promoted successfully' };
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
   * @param {number} limit - Items per page (default: 1000 to get all sections)
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Sections data
   */
  static async getAllSections(limit = 1000, page = 1) {
    const response = await fetch(`${API_BASE_URL}/sections?limit=${limit}&page=${page}`, {
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

  /**
   * Get all sections by fetching all pages
   * @returns {Promise} All sections data
   */
  static async getAllSectionsComplete() {
    try {
      // First try the main sections endpoint with high limit
      try {
        const firstPage = await this.getAllSections(1000);
        let allSections = firstPage.sections || [];
        
        // If there are more pages, fetch them
        if (firstPage.pagination && firstPage.pagination.totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= firstPage.pagination.totalPages; page++) {
            promises.push(this.getAllSections(100, page));
          }
          
          const additionalPages = await Promise.all(promises);
          additionalPages.forEach(pageData => {
            if (pageData.sections) {
              allSections = allSections.concat(pageData.sections);
            }
          });
        }
        
        return {
          sections: allSections,
          pagination: {
            page: 1,
            limit: allSections.length,
            total: allSections.length,
            totalPages: 1
          }
        };
      } catch (error) {
        console.error('Error fetching all sections:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in getAllSectionsComplete:', error);
      throw error;
    }
  }

  // ==================== RESOURCE MANAGEMENT ====================

  /**
   * Get all resources
   * @param {number} limit - Items per page (default: 1000 to get all resources)
   * @param {number} page - Page number (default: 1)
   * @returns {Promise} Resources data
   */
  static async getAllResources(limit = 1000, page = 1) {
    const response = await fetch(`${API_BASE_URL}/resources?limit=${limit}&page=${page}`, {
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

  // ==================== ASSIGNMENT MANAGEMENT ====================
  
  /**
   * Get all assignments (admin view)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Assignments data
   */
  static async getAllAssignments(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create a new assignment
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise} Created assignment
   */
  static async createAssignment(assignmentData) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData)
    });
    return handleResponse(response);
  }

  /**
   * Get assignment by league ID with submissions
   * @param {string} leagueId - League ID
   * @returns {Promise} Assignment data with submissions
   */
  static async getAssignmentByLeague(leagueId) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments/league/${leagueId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Submit assignment
   * @param {string} assignmentId - Assignment ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise} Submission result
   */
  static async submitAssignment(assignmentId, submissionData) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(submissionData)
    });
    return handleResponse(response);
  }

  /**
   * Get user submissions
   * @param {string} userId - User ID (optional, for admin view)
   * @returns {Promise} User submissions
   */
  static async getUserSubmissions(userId = null) {
    const url = userId 
      ? `${API_BASE_URL}/admin/assignments/submissions?userId=${userId}`
      : `${API_BASE_URL}/admin/assignments/submissions`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Update an assignment
   * @param {string} assignmentId - Assignment ID
   * @param {Object} assignmentData - Updated assignment data
   * @returns {Promise} Updated assignment
   */
  static async updateAssignment(assignmentId, assignmentData) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(assignmentData)
    });
    return handleResponse(response);
  }

  /**
   * Delete an assignment
   * @param {string} assignmentId - Assignment ID
   * @returns {Promise} Deletion result
   */
  static async deleteAssignment(assignmentId) {
    const response = await fetch(`${API_BASE_URL}/admin/assignments/${assignmentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user is admin
   * @param {Object} user - User object
   * @returns {boolean} Whether user is admin
   */
  static isAdmin(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER'].includes(user.role);
  }  /**
   * Check if user can manage content
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage content
   */
  static canManageContent(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can manage leagues
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage leagues
   */
  static canManageLeagues(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can manage weeks, days, and resources
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage weeks, days, and resources
   */
  static canManageWeeksAndContent(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER'].includes(user.role);
  }

  /**
   * Check if user can manage assignments
   * @param {Object} user - User object
   * @returns {boolean} Whether user can manage assignments
   */
  static canManageAssignments(user) {
    return user && ['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'].includes(user.role);
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
      'PATHFINDER': { name: 'Pathfinder', color: 'purple', description: 'Can manage weeks, days, and resources' },
      'CHIEF_PATHFINDER': { name: 'Chief Pathfinder', color: 'orange', description: 'Can manage leagues, weeks, days, resources, and assignments' },
      'GRAND_PATHFINDER': { name: 'Grand Pathfinder', color: 'red', description: 'Full system access to all admin features' }
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
