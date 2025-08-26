# Learning Progress API

## Overview

The Learning Progress API manages user enrollment, progress tracking, and learning analytics across the OpenLearn platform. It provides comprehensive functionality for monitoring user advancement through leagues, sections, and resources.

## Progress Service Architecture

### Service Class Structure

**ProgressService Implementation:**
```javascript
/**
 * Progress Service Class - Handles learning progress and enrollment management
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
    try {
      const response = await fetch(`${API_BASE_URL}/progress/section/${sectionId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          personalNote,
          markedForRevision
        })
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Section completion failed:', error.message);
      throw error;
    }
  }

  /**
   * Update section progress (notes and revision flags only)
   * @param {string} sectionId - The section ID
   * @param {string} personalNote - Personal note
   * @param {boolean} markedForRevision - Whether to mark for revision
   * @returns {Promise} Updated progress data
   */
  static async updateSectionProgress(sectionId, personalNote, markedForRevision) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/section/${sectionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          personalNote,
          markedForRevision
        })
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Section progress update failed:', error.message);
      throw error;
    }
  }
}
```

## Enrollment Management

### User Enrollment

**Endpoint:** `POST /api/enroll`

**Request:**
```json
{
  "cohortId": "cohort_123",
  "leagueId": "ml_league",
  "userId": "user_456"  // Optional for admin enrollment
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "enrollment_789",
      "userId": "user_456",
      "cohortId": "cohort_123", 
      "leagueId": "ml_league",
      "enrolledAt": "2024-01-15T10:30:00Z",
      "status": "ACTIVE",
      "progress": {
        "completedSections": 0,
        "totalSections": 24,
        "completedResources": 0,
        "totalResources": 156,
        "progressPercentage": 0,
        "lastActivityAt": null,
        "timeSpent": 0,
        "streak": 0
      }
    },
    "league": {
      "id": "ml_league",
      "name": "Machine Learning",
      "description": "Comprehensive ML learning path",
      "estimatedHours": 120,
      "difficulty": "Intermediate"
    },
    "cohort": {
      "id": "cohort_123",
      "name": "Winter 2024 Cohort",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-04-15T23:59:59Z"
    }
  }
}
```

**Frontend Implementation:**
```javascript
const handleEnrollment = async (cohortId, leagueId) => {
  try {
    setLoading(true);
    setError(null);
    
    const result = await ProgressService.enrollUser(cohortId, leagueId);
    
    // Update UI state
    setEnrollments(prev => [...prev, result.enrollment]);
    
    // Show success message
    showNotification('Enrollment successful! Welcome to your learning journey!');
    
    // Refresh dashboard data
    await loadDashboardData();
    
  } catch (error) {
    console.error('Enrollment error:', error);
    setError(`Enrollment failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### Get User Enrollments

**Endpoint:** `GET /api/progress/enrollments`

**Query Parameters:**
- `status` (optional): Filter by enrollment status (ACTIVE, COMPLETED, PAUSED, DROPPED)
- `leagueId` (optional): Filter by specific league
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enrollment_789",
        "userId": "user_456",
        "cohortId": "cohort_123",
        "leagueId": "ml_league",
        "enrolledAt": "2024-01-15T10:30:00Z",
        "status": "ACTIVE",
        "progress": {
          "completedSections": 8,
          "totalSections": 24,
          "completedResources": 45,
          "totalResources": 156,
          "progressPercentage": 33,
          "lastActivityAt": "2024-01-20T14:30:00Z",
          "timeSpent": 1440,
          "streak": 5
        },
        "league": {
          "id": "ml_league",
          "name": "Machine Learning",
          "description": "Comprehensive ML learning path",
          "cover": "/leagues/ml-cover.jpg",
          "color": "#3B82F6"
        },
        "cohort": {
          "id": "cohort_123",
          "name": "Winter 2024 Cohort"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 3,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

## Section Progress Management

### Complete Section

**Endpoint:** `POST /api/progress/section/{sectionId}/complete`

**Request:**
```json
{
  "personalNote": "Excellent content on neural networks. Need to review backpropagation.",
  "markedForRevision": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sectionProgress": {
      "id": "section_progress_123",
      "userId": "user_456",
      "sectionId": "section_789",
      "isCompleted": true,
      "completedAt": "2024-01-20T14:30:00Z",
      "timeSpent": 45,
      "personalNote": "Excellent content on neural networks. Need to review backpropagation.",
      "markedForRevision": false,
      "resourcesCompleted": 8,
      "totalResources": 8
    },
    "enrollmentProgress": {
      "completedSections": 9,
      "totalSections": 24,
      "progressPercentage": 37,
      "badgesEarned": [
        {
          "id": "badge_first_section",
          "name": "First Steps",
          "description": "Completed your first section"
        }
      ]
    }
  }
}
```

**Frontend Implementation:**
```javascript
const handleSectionCompletion = async (sectionId, note = '', forRevision = false) => {
  try {
    setUpdatingSection(sectionId);
    
    const result = await ProgressService.completeSection(
      sectionId, 
      note, 
      forRevision
    );
    
    // Update local state
    setSectionProgress(prev => ({
      ...prev,
      [sectionId]: result.sectionProgress
    }));
    
    // Update overall progress
    setEnrollmentProgress(result.enrollmentProgress);
    
    // Show badges if earned
    if (result.enrollmentProgress.badgesEarned?.length > 0) {
      showBadgeNotification(result.enrollmentProgress.badgesEarned);
    }
    
    // Confetti effect for completion
    triggerConfetti();
    
  } catch (error) {
    console.error('Section completion failed:', error);
    showErrorMessage('Failed to mark section as complete');
  } finally {
    setUpdatingSection(null);
  }
};
```

### Update Section Progress

**Endpoint:** `PUT /api/progress/section/{sectionId}`

**Request:**
```json
{
  "personalNote": "Updated notes after review session",
  "markedForRevision": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sectionProgress": {
      "id": "section_progress_123",
      "userId": "user_456",
      "sectionId": "section_789",
      "isCompleted": true,
      "personalNote": "Updated notes after review session",
      "markedForRevision": true,
      "updatedAt": "2024-01-21T09:15:00Z"
    }
  }
}
```

## Resource Progress Tracking

### Mark Resource as Complete

**Endpoint:** `POST /api/progress/resource/{resourceId}/complete`

**Request:**
```json
{
  "timeSpent": 15,
  "score": 85,
  "notes": "Great video explanation of gradient descent",
  "metadata": {
    "watchProgress": 1.0,
    "bookmarks": ["2:30", "5:45"],
    "highlights": ["Chain rule explanation", "Learning rate importance"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resourceProgress": {
      "id": "resource_progress_456",
      "userId": "user_456",
      "resourceId": "resource_123",
      "isCompleted": true,
      "completedAt": "2024-01-20T15:45:00Z",
      "timeSpent": 15,
      "score": 85,
      "attempts": 1,
      "notes": "Great video explanation of gradient descent",
      "metadata": {
        "watchProgress": 1.0,
        "bookmarks": ["2:30", "5:45"],
        "highlights": ["Chain rule explanation", "Learning rate importance"]
      }
    },
    "sectionProgress": {
      "resourcesCompleted": 3,
      "totalResources": 8,
      "progressPercentage": 37
    }
  }
}
```

### Get Resource Progress

**Endpoint:** `GET /api/progress/resource/{resourceId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "resourceProgress": {
      "id": "resource_progress_456",
      "userId": "user_456",
      "resourceId": "resource_123",
      "isCompleted": true,
      "completedAt": "2024-01-20T15:45:00Z",
      "timeSpent": 15,
      "score": 85,
      "attempts": 1,
      "notes": "Great video explanation of gradient descent",
      "metadata": {
        "watchProgress": 1.0,
        "bookmarks": ["2:30", "5:45"],
        "highlights": ["Chain rule explanation", "Learning rate importance"]
      }
    }
  }
}
```

## Progress Analytics

### Get Learning Analytics

**Endpoint:** `GET /api/progress/analytics`

**Query Parameters:**
- `period` (optional): Time period (week, month, quarter, year)
- `leagueId` (optional): Filter by specific league
- `includeDetails` (optional): Include detailed breakdown

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEnrollments": 3,
      "activeEnrollments": 2,
      "completedLeagues": 1,
      "totalBadges": 8,
      "currentStreak": 5,
      "longestStreak": 12,
      "totalTimeSpent": 4320,
      "averageSessionTime": 45
    },
    "progressBreakdown": {
      "byLeague": [
        {
          "leagueId": "ml_league",
          "leagueName": "Machine Learning",
          "progressPercentage": 75,
          "completedSections": 18,
          "totalSections": 24,
          "timeSpent": 2880,
          "averageScore": 87
        }
      ],
      "byWeek": [
        {
          "weekNumber": 1,
          "sectionsCompleted": 3,
          "timeSpent": 180,
          "averageScore": 92
        }
      ]
    },
    "recentActivity": [
      {
        "type": "SECTION_COMPLETED",
        "timestamp": "2024-01-20T14:30:00Z",
        "description": "Completed 'Introduction to Neural Networks'",
        "leagueName": "Machine Learning",
        "pointsEarned": 50
      }
    ],
    "achievements": {
      "recentBadges": [
        {
          "id": "badge_ml_basics",
          "name": "ML Foundations",
          "earnedAt": "2024-01-19T16:20:00Z"
        }
      ],
      "milestones": [
        {
          "type": "FIRST_LEAGUE_50_PERCENT",
          "achievedAt": "2024-01-18T12:00:00Z",
          "description": "Reached 50% completion in first league"
        }
      ]
    }
  }
}
```

### Get League-Specific Progress

**Endpoint:** `GET /api/progress/league/{leagueId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "enrollment_789",
      "enrolledAt": "2024-01-15T10:30:00Z",
      "status": "ACTIVE"
    },
    "progress": {
      "completedSections": 8,
      "totalSections": 24,
      "completedResources": 45,
      "totalResources": 156,
      "progressPercentage": 33,
      "timeSpent": 1440,
      "averageScore": 87
    },
    "weeklyProgress": [
      {
        "weekId": "week_1",
        "weekName": "Introduction to ML",
        "sectionsCompleted": 4,
        "totalSections": 4,
        "progressPercentage": 100,
        "timeSpent": 360
      }
    ],
    "nextRecommendations": [
      {
        "type": "SECTION",
        "id": "section_next",
        "name": "Deep Learning Fundamentals",
        "estimatedTime": 45,
        "difficulty": "Intermediate"
      }
    ]
  }
}
```

## Progress Calculation Utilities

### Frontend Progress Calculations

**Accurate Progress Calculation:**
```javascript
/**
 * Calculate accurate resource progress across enrollments
 */
static calculateAccurateResourceProgress(dashboardData, allResourceProgress) {
  if (!dashboardData?.enrollments?.length) {
    return { completedResources: 0, totalResources: 0 };
  }

  let totalCompleted = 0;
  let totalResources = 0;

  dashboardData.enrollments.forEach(enrollment => {
    // Count resources that belong to this league
    Object.entries(allResourceProgress).forEach(([resourceId, progress]) => {
      if (progress.leagueId === enrollment.league.id) {
        totalResources++;
        if (progress.isCompleted) {
          totalCompleted++;
        }
      }
    });
  });

  return {
    completedResources: totalCompleted,
    totalResources: totalResources
  };
}

/**
 * Calculate section progress with resource completion validation
 */
static calculateAccurateSectionProgress(dashboardData, allResourceProgress, allSectionResources) {
  if (!dashboardData?.enrollments?.length) {
    return { completed: 0, total: 0 };
  }

  let completedSections = 0;
  let totalSections = 0;

  dashboardData.enrollments.forEach(enrollment => {
    Object.entries(allSectionResources).forEach(([sectionId, resources]) => {
      if (resources.leagueId === enrollment.league.id) {
        totalSections++;
        
        // Check if all resources in section are completed
        const allResourcesCompleted = resources.every(resource => 
          allResourceProgress[resource.id]?.isCompleted
        );
        
        if (allResourcesCompleted && resources.length > 0) {
          completedSections++;
        }
      }
    });
  });

  return {
    completed: completedSections,
    total: totalSections
  };
}
```

**Progress Update Handlers:**
```javascript
const useProgressTracking = (enrollmentId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateResourceProgress = useCallback(async (resourceId, progressData) => {
    setLoading(true);
    
    try {
      const result = await ProgressService.markResourceComplete(
        resourceId,
        progressData
      );
      
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        resources: {
          ...prev.resources,
          [resourceId]: result.resourceProgress
        },
        section: result.sectionProgress
      }));
      
      // Trigger progress recalculation
      await recalculateProgress();
      
    } catch (error) {
      console.error('Failed to update resource progress:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  const recalculateProgress = useCallback(async () => {
    try {
      const analytics = await ProgressService.getAnalytics();
      setProgress(analytics);
    } catch (error) {
      console.error('Failed to recalculate progress:', error);
    }
  }, []);

  return {
    progress,
    loading,
    updateResourceProgress,
    recalculateProgress
  };
};
```

This comprehensive Learning Progress API enables detailed tracking of user advancement through the OpenLearn platform, providing both granular resource-level progress and high-level analytics for effective learning management.
