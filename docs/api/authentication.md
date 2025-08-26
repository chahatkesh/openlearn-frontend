# Authentication API

## Overview

The OpenLearn platform uses JWT-based authentication with role-based access control (RBAC) for securing user sessions and API endpoints.

## Authentication Flow

### Login Process

**Endpoint:** `POST /api/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "PIONEER",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Frontend Implementation:**
```javascript
import { AuthContext } from '../../context/AuthContext';

const login = async (email, password) => {
  setError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      setError(result.error);
      return false;
    }
    
    // Store tokens securely
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    
    // Update user state
    setUser(result.data.user);
    
    return true;
  } catch (err) {
    setError('Login failed. Please try again.');
    return false;
  }
};
```

### Token Refresh

**Endpoint:** `POST /api/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Frontend Implementation:**
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      return true;
    }
    
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
  } catch (err) {
    console.error('Token refresh failed:', err);
    return false;
  }
};
```

### Logout

**Endpoint:** `POST /api/logout`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Implementation:**
```javascript
const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Notify backend of logout (optional - JWT can't be invalidated server-side)
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (err) {
    console.error('Logout API call failed:', err);
  } finally {
    // Always clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }
};
```

## User Profile Management

### Get User Profile

**Endpoint:** `GET /api/profile`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "PIONEER",
    "status": "ACTIVE",
    "department": "Computer Science",
    "bio": "Learning enthusiast",
    "profileImage": "https://example.com/image.jpg",
    "enrollments": [
      {
        "id": "enrollment_id",
        "cohortId": "cohort_id",
        "leagueId": "league_id",
        "enrolledAt": "2024-01-15T10:30:00Z",
        "progress": {
          "completedSections": 5,
          "totalSections": 20,
          "progressPercentage": 25
        }
      }
    ],
    "badges": [
      {
        "id": "badge_id",
        "name": "First Steps",
        "description": "Completed first learning section",
        "earnedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update User Profile

**Endpoint:** `PUT /api/profile`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated biography",
  "department": "Information Technology"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Updated Name",
    "bio": "Updated biography",
    "department": "Information Technology",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Role-Based Access Control

### User Roles Hierarchy

```
GRAND_PATHFINDER (Level 5)
├── Full system administration
├── User management and approval
├── Role assignment capabilities
└── System configuration access

CHIEF_PATHFINDER (Level 4)
├── League management
├── Assignment creation/management
├── User progress oversight
└── Advanced analytics access

PATHFINDER (Level 3)
├── Content management (weeks, sections, resources)
├── Basic administrative functions
└── Progress analytics

LUMINARY (Level 2)
├── Advanced learning features
├── Badge achievements
└── Social sharing capabilities

PIONEER (Level 1)
├── Basic learning access
├── Progress tracking
├── League enrollment
└── Profile management
```

### Role Validation

**Frontend Implementation:**
```javascript
// Check if user has specific role
const hasRole = (requiredRoles) => {
  if (!user) return false;
  
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  
  return requiredRoles.includes(user.role);
};

// Role-based component rendering
const AdminPanel = () => {
  const { user } = useAuth();
  
  if (!hasRole(['GRAND_PATHFINDER', 'CHIEF_PATHFINDER'])) {
    return <div>Access denied</div>;
  }
  
  return <AdminInterface />;
};

// Protected route implementation
const ProtectedRoute = ({ requiredRoles = [], children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
```

## Authentication Headers

### Standard Request Headers

**For Authenticated Requests:**
```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Usage in API calls
const response = await fetch(`${API_BASE_URL}/protected-endpoint`, {
  headers: getAuthHeaders()
});
```

### Automatic Token Refresh

**Request Interceptor Implementation:**
```javascript
const handleResponse = async (response) => {
  // Handle authentication errors
  if (response.status === 401) {
    console.log('Token expired, attempting refresh...');
    
    // Attempt token refresh
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      // Retry original request with new token
      const newHeaders = getAuthHeaders();
      return fetch(response.url, {
        ...response,
        headers: newHeaders
      });
    } else {
      // Redirect to login if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/signin';
      return;
    }
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Request failed');
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  
  return result.data;
};
```

## Error Handling

### Authentication Errors

**Common Error Codes:**
- `INVALID_CREDENTIALS`: Invalid email or password
- `TOKEN_EXPIRED`: Access token has expired
- `TOKEN_INVALID`: Token is malformed or invalid
- `ACCOUNT_SUSPENDED`: User account is suspended
- `EMAIL_NOT_VERIFIED`: Email verification required
- `RATE_LIMITED`: Too many login attempts

**Error Handling Implementation:**
```javascript
const handleAuthError = (error) => {
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password. Please try again.';
    
    case 'TOKEN_EXPIRED':
      // Attempt automatic refresh
      refreshToken().then(success => {
        if (!success) {
          return 'Your session has expired. Please log in again.';
        }
      });
      break;
    
    case 'ACCOUNT_SUSPENDED':
      return 'Your account has been suspended. Please contact support.';
    
    case 'EMAIL_NOT_VERIFIED':
      return 'Please verify your email address before logging in.';
    
    case 'RATE_LIMITED':
      return 'Too many login attempts. Please try again later.';
    
    default:
      return 'Authentication failed. Please try again.';
  }
};
```

## Security Considerations

### Token Storage

**Best Practices:**
- Store tokens in localStorage for simplicity (consider httpOnly cookies for production)
- Clear tokens on logout or authentication errors
- Implement automatic token refresh before expiration
- Never log tokens in console or error messages

### Request Security

**CSRF Protection:**
- JWT tokens provide CSRF protection by design
- Validate origin headers on sensitive requests
- Use HTTPS in production for all authentication endpoints

**Input Validation:**
```javascript
const validateLoginInput = (email, password) => {
  const errors = {};
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

This authentication system provides secure, role-based access control while maintaining a smooth user experience through automatic token refresh and comprehensive error handling.
