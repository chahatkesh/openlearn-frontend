# Authentication APIs

This document covers all authentication-related API endpoints for the OpenLearn platform.

## 🔐 Authentication Overview

The OpenLearn platform uses JWT (JSON Web Token) based authentication with refresh token mechanism for secure user sessions.

### Authentication Flow
1. **Registration**: User creates account → Status: PENDING
2. **Approval**: Admin approves user → Status: ACTIVE  
3. **Login**: User authenticates → Receives access + refresh tokens
4. **API Access**: Include access token in Authorization header
5. **Token Refresh**: Use refresh token to get new access token
6. **Logout**: Clear tokens from client storage

## 🌐 Base URL
```
Base URL: {API_BASE_URL}/api
Authentication Endpoints: {API_BASE_URL}
```

## 📝 User Registration

### POST `/signup`

Creates a new user account with PENDING status.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", 
  "password": "securePassword123"
}
```

#### Response Success (201)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "PIONEER",
      "status": "PENDING",
      "createdAt": "2024-06-12T10:30:00Z"
    }
  }
}
```

#### Response Error (400)
```json
{
  "success": false,
  "error": "Email already exists"
}
```

#### Validation Rules
- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format, unique
- **Password**: Required, minimum 8 characters

## 🚪 User Login

### POST `/login`

Authenticates user and returns access tokens.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "PIONEER",
      "status": "ACTIVE",
      "createdAt": "2024-06-12T10:30:00Z",
      "lastLoginAt": "2024-06-12T15:45:00Z"
    }
  }
}
```

#### Response Error (401)
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

#### Response Error (403) - Account Pending
```json
{
  "success": false,
  "error": "Account pending approval"
}
```

## 🔄 Token Refresh

### POST `/refresh`

Refreshes the access token using a valid refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response Error (401)
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

## 👤 Get User Profile

### GET `/profile`

Retrieves the current user's profile information.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Response Success (200)
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "PIONEER",
    "status": "ACTIVE",
    "createdAt": "2024-06-12T10:30:00Z",
    "lastLoginAt": "2024-06-12T15:45:00Z",
    "enrollments": [
      {
        "id": "enrollment_456",
        "cohortId": "cohort_789",
        "leagueId": "league_101",
        "enrolledAt": "2024-06-12T11:00:00Z"
      }
    ],
    "badges": [
      {
        "id": "badge_111",
        "name": "First Steps",
        "earnedAt": "2024-06-12T12:00:00Z"
      }
    ]
  }
}
```

## 🔓 Logout

### POST `/logout`

Invalidates the refresh token (client-side token clearing is also required).

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🔑 Password Management

### POST `/forgot-password`

Initiates password reset process.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST `/reset-password`

Resets password using reset token.

#### Request Body
```json
{
  "token": "reset_token_here",
  "newPassword": "newSecurePassword123"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### PUT `/change-password`

Changes password for authenticated user.

#### Headers
```
Authorization: Bearer {accessToken}
```

#### Request Body
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## 📧 Email Verification

### POST `/resend-verification`

Resends verification email.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

### POST `/verify-email`

Verifies email using verification token.

#### Request Body
```json
{
  "token": "verification_token_here"
}
```

#### Response Success (200)
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

## 🔐 Authentication Headers

### Required Headers for Protected Routes
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Example Request
```javascript
const response = await fetch('/api/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 🏷️ User Roles

### Role Hierarchy
```
PIONEER → LUMINARY → PATHFINDER → CHIEF_PATHFINDER → GRAND_PATHFINDER
```

### Role Permissions
- **PIONEER**: Basic user access
- **LUMINARY**: Enhanced features
- **PATHFINDER**: Peer mentoring
- **CHIEF_PATHFINDER**: Limited admin access
- **GRAND_PATHFINDER**: Full admin access

## ⏱️ Token Information

### Access Token
- **Expiration**: 15 minutes
- **Purpose**: API authentication
- **Storage**: Memory (not localStorage)

### Refresh Token
- **Expiration**: 7 days
- **Purpose**: Access token renewal
- **Storage**: Secure httpOnly cookie (recommended) or localStorage

## 🚨 Error Codes

### Common HTTP Status Codes
- **200**: Success
- **201**: Created (registration)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid credentials/token)
- **403**: Forbidden (account pending/suspended)
- **404**: Not Found
- **409**: Conflict (email already exists)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

## 🔧 Frontend Implementation

### Token Storage
```javascript
// Store tokens after login
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);

// Retrieve tokens
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

// Clear tokens on logout
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

### Automatic Token Refresh
```javascript
// Intercept API calls and refresh token if needed
const makeAuthenticatedRequest = async (url, options = {}) => {
  let accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 401) {
    // Try to refresh token
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      });
    } else {
      // Redirect to login
      window.location.href = '/signin';
    }
  }
  
  return response;
};
```

### Authentication Context
```javascript
// Auth context implementation
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (result.success) {
      setUser(result.data.user);
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: () => !!user,
    hasRole: (roles) => roles.includes(user?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

This authentication API documentation provides complete guidance for implementing secure authentication in the OpenLearn platform.
