# Learning Progress APIs

This document covers all learning progress and enrollment-related API endpoints.

## 📚 Progress Overview

The Learning Progress APIs handle user enrollment in cohorts/leagues, section completion tracking, badge awarding, and progress analytics.

## 🌐 Base URL
```
Base URL: {API_BASE_URL}/api/progress
```

## 🎯 Enrollment Management

### POST `/enroll`

Enrolls a user in a cohort/league combination.

#### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Request Body
```json
{
  "cohortId": "cohort_123",
  "leagueId": "league_456",
  "userId": "user_789" // Optional: for admin enrollment
}
```

#### Response Success (201)
```json
{
  "success": true,
  "data": {
    "enrollmentId": "enrollment_101",
    "userId": "user_789",
    "cohortId": "cohort_123",
    "leagueId": "league_456",
    "enrolledAt": "2024-06-12T10:30:00Z",
    "status": "ACTIVE",
    "progress": {
      "totalSections": 24,
      "completedSections": 0,
      "progressPercentage": 0
    }
  }
}
```

#### Response Error (409)
```json
{
  "success": false,
  "error": "User already enrolled in this league"
}
```

### GET `/enrollments`

Gets all enrollments for the current user.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": [
    {
      "enrollmentId": "enrollment_101",
      "enrolledAt": "2024-06-12T10:30:00Z",
      "status": "ACTIVE",
      "cohort": {
        "id": "cohort_123",
        "name": "Web Development Bootcamp",
        "description": "Comprehensive web development course"
      },
      "league": {
        "id": "league_456", 
        "name": "JavaScript Fundamentals",
        "description": "Learn JavaScript from basics to advanced"
      },
      "progress": {
        "totalSections": 24,
        "completedSections": 8,
        "progressPercentage": 33.33,
        "lastAccessedAt": "2024-06-12T15:45:00Z"
      }
    }
  ]
}
```

### DELETE `/enrollments/{enrollmentId}`

Withdraws from an enrollment.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Successfully withdrawn from league"
}
```

## ✅ Section Progress

### POST `/sections/{sectionId}/complete`

Marks a section as completed.

#### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Request Body
```json
{
  "personalNote": "Great introduction to variables",
  "markedForRevision": false
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "sectionProgressId": "progress_789",
    "sectionId": "section_456",
    "userId": "user_123",
    "completedAt": "2024-06-12T16:30:00Z",
    "personalNote": "Great introduction to variables", 
    "markedForRevision": false,
    "progressUpdate": {
      "enrollmentId": "enrollment_101",
      "totalSections": 24,
      "completedSections": 9,
      "progressPercentage": 37.5,
      "badgesEarned": [
        {
          "id": "badge_555",
          "name": "Progress Milestone",
          "description": "Completed 25% of the course"
        }
      ]
    }
  }
}
```

### PUT `/sections/{sectionId}`

Updates section progress (notes and revision flags only).

#### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Request Body
```json
{
  "personalNote": "Updated notes after review",
  "markedForRevision": true
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "sectionProgressId": "progress_789",
    "personalNote": "Updated notes after review",
    "markedForRevision": true,
    "updatedAt": "2024-06-12T17:00:00Z"
  }
}
```

### GET `/sections/{sectionId}/progress`

Gets progress for a specific section.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "sectionId": "section_456",
    "completed": true,
    "completedAt": "2024-06-12T16:30:00Z",
    "personalNote": "Great introduction to variables",
    "markedForRevision": false,
    "timeSpent": 3600, // seconds
    "attempts": 1
  }
}
```

## 📊 Dashboard Data

### GET `/dashboard`

Gets comprehensive dashboard data for the current user.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "role": "PIONEER",
      "status": "ACTIVE"
    },
    "enrollments": [
      {
        "enrollmentId": "enrollment_101",
        "enrolledAt": "2024-06-12T10:30:00Z",
        "league": {
          "id": "league_456",
          "name": "JavaScript Fundamentals",
          "description": "Learn JavaScript basics"
        },
        "progress": {
          "totalSections": 24,
          "completedSections": 9,
          "progressPercentage": 37.5,
          "lastAccessedAt": "2024-06-12T15:45:00Z"
        }
      }
    ],
    "badges": [
      {
        "id": "badge_555",
        "name": "Progress Milestone",
        "description": "Completed 25% of the course",
        "imageUrl": "https://example.com/badge.png",
        "earnedAt": "2024-06-12T16:30:00Z",
        "league": {
          "id": "league_456",
          "name": "JavaScript Fundamentals"
        }
      }
    ],
    "stats": {
      "totalEnrollments": 1,
      "completedLeagues": 0,
      "totalBadges": 1,
      "totalTimeSpent": 10800, // seconds
      "currentStreak": 3 // days
    }
  }
}
```

## 🏆 Progress Analytics

### GET `/analytics/personal`

Gets personal learning analytics.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Query Parameters
- `period`: `week` | `month` | `year` | `all` (default: `month`)
- `leagueId`: Filter by specific league (optional)

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "period": "month",
    "overview": {
      "sectionsCompleted": 25,
      "timeSpent": 36000, // seconds
      "averageSessionTime": 1800, // seconds
      "streakDays": 7,
      "badgesEarned": 3
    },
    "dailyActivity": [
      {
        "date": "2024-06-01",
        "sectionsCompleted": 2,
        "timeSpent": 3600
      },
      {
        "date": "2024-06-02",
        "sectionsCompleted": 3,
        "timeSpent": 2400
      }
    ],
    "leagueProgress": [
      {
        "leagueId": "league_456",
        "leagueName": "JavaScript Fundamentals",
        "progressPercentage": 75,
        "sectionsCompleted": 18,
        "totalSections": 24
      }
    ],
    "achievements": [
      {
        "type": "COMPLETION_MILESTONE",
        "title": "Half Way There!",
        "description": "Completed 50% of JavaScript Fundamentals",
        "unlockedAt": "2024-06-10T14:30:00Z"
      }
    ]
  }
}
```

### GET `/analytics/leaderboard`

Gets leaderboard data.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Query Parameters
- `period`: `week` | `month` | `all` (default: `month`)
- `leagueId`: Filter by specific league (optional)
- `limit`: Number of results (default: 10, max: 50)

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "period": "month",
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user_456",
        "name": "Jane Smith",
        "avatar": "https://example.com/avatar.jpg",
        "score": 950,
        "sectionsCompleted": 38,
        "badgesEarned": 5,
        "timeSpent": 72000
      },
      {
        "rank": 2,
        "userId": "user_123", 
        "name": "John Doe",
        "avatar": "https://example.com/avatar2.jpg",
        "score": 875,
        "sectionsCompleted": 35,
        "badgesEarned": 4,
        "timeSpent": 65400
      }
    ],
    "currentUser": {
      "rank": 2,
      "score": 875,
      "sectionsCompleted": 35
    }
  }
}
```

## 📋 Assignment Progress

### GET `/assignments`

Gets all assignments for enrolled leagues.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": [
    {
      "assignmentId": "assignment_789",
      "title": "Build a Todo App",
      "description": "Create a functional todo application",
      "leagueId": "league_456",
      "leagueName": "JavaScript Fundamentals",
      "dueDate": "2024-06-20T23:59:59Z",
      "status": "PENDING", // PENDING, SUBMITTED, GRADED
      "maxScore": 100,
      "currentScore": null,
      "submittedAt": null,
      "feedback": null
    }
  ]
}
```

### POST `/assignments/{assignmentId}/submit`

Submits an assignment.

#### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Request Body
```json
{
  "submissionUrl": "https://github.com/user/todo-app",
  "notes": "Implemented all required features plus dark mode"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "submissionId": "submission_101",
    "assignmentId": "assignment_789",
    "submittedAt": "2024-06-15T18:30:00Z",
    "submissionUrl": "https://github.com/user/todo-app",
    "notes": "Implemented all required features plus dark mode",
    "status": "SUBMITTED"
  }
}
```

## 📈 Progress Tracking Utilities

### GET `/progress/status`

Gets overall progress status for all enrollments.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "overallProgress": {
      "totalEnrollments": 2,
      "averageProgress": 42.5,
      "completedLeagues": 0,
      "activeLeagues": 2
    },
    "recentActivity": [
      {
        "type": "SECTION_COMPLETED",
        "sectionId": "section_456",
        "sectionTitle": "Variables and Data Types",
        "leagueName": "JavaScript Fundamentals",
        "timestamp": "2024-06-12T16:30:00Z"
      },
      {
        "type": "BADGE_EARNED",
        "badgeId": "badge_555",
        "badgeName": "Progress Milestone",
        "leagueName": "JavaScript Fundamentals",
        "timestamp": "2024-06-12T16:30:00Z"
      }
    ],
    "upcomingDeadlines": [
      {
        "type": "ASSIGNMENT",
        "assignmentId": "assignment_789",
        "title": "Build a Todo App",
        "leagueName": "JavaScript Fundamentals",
        "dueDate": "2024-06-20T23:59:59Z"
      }
    ]
  }
}
```

### POST `/progress/bulk-update`

Updates progress for multiple sections (for admin use).

#### Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

#### Request Body
```json
{
  "userId": "user_123", // Optional: defaults to current user
  "updates": [
    {
      "sectionId": "section_456",
      "completed": true,
      "personalNote": "Completed during review session"
    },
    {
      "sectionId": "section_789",
      "completed": false,
      "markedForRevision": true
    }
  ]
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "updatedSections": 2,
    "progressUpdates": [
      {
        "enrollmentId": "enrollment_101",
        "newProgressPercentage": 45.8,
        "badgesEarned": []
      }
    ]
  }
}
```

## 🔄 Progress Synchronization

### POST `/progress/sync`

Synchronizes progress data (useful after connectivity issues).

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "syncedEnrollments": 2,
    "syncedSections": 15,
    "conflicts": [], // Any data conflicts found
    "lastSyncAt": "2024-06-12T18:00:00Z"
  }
}
```

## 🚨 Error Responses

### Common Error Codes
- **400**: Bad Request (invalid section ID, already completed)
- **401**: Unauthorized (invalid/expired token)
- **403**: Forbidden (not enrolled in league)
- **404**: Not Found (section/enrollment not found)
- **409**: Conflict (already enrolled/completed)
- **429**: Too Many Requests (rate limiting)

### Error Response Format
```json
{
  "success": false,
  "error": "Section already completed",
  "code": "SECTION_ALREADY_COMPLETED",
  "details": {
    "sectionId": "section_456",
    "completedAt": "2024-06-12T16:30:00Z"
  }
}
```

## 🔧 Frontend Integration

### Progress Tracking Hook
```javascript
const useProgress = (enrollmentId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const completeSection = async (sectionId, note = null, revision = false) => {
    try {
      const response = await ProgressService.completeSection(
        sectionId, 
        note, 
        revision
      );
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        completedSections: prev.completedSections + 1,
        progressPercentage: response.progressUpdate.progressPercentage
      }));
      return response;
    } catch (error) {
      console.error('Failed to complete section:', error);
      throw error;
    }
  };

  return { progress, loading, completeSection };
};
```

### Dashboard Data Hook
```javascript
const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await ProgressService.getUserDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData };
};
```

This Learning Progress API documentation provides comprehensive coverage of all progress tracking functionality in the OpenLearn platform.
