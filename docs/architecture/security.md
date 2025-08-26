# Security Architecture

## Authentication Framework

### JWT Token Management

**Token Structure:**
- **Access Token**: Short-lived (typically 15-30 minutes) for API authentication
- **Refresh Token**: Long-lived (7-30 days) for session renewal
- **Storage**: localStorage with automatic cleanup on logout/expiration

**Authentication Flow:**
```javascript
// Login process with secure token handling
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    setUser(result.data.user);
    return true;
  }
  
  throw new Error(result.error);
};
```

### Token Refresh Mechanism

**Automatic Renewal:**
```javascript
// Background token refresh with fallback handling
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};
```

## Authorization System

### Role-Based Access Control (RBAC)

**User Hierarchy:**
```
GRAND_PATHFINDER (Level 5)
├── Full system administration
├── User management and approval
├── Role assignment capabilities
├── System configuration access
└── All lower-level permissions

CHIEF_PATHFINDER (Level 4)
├── League management
├── Assignment creation/management
├── User progress oversight
├── Advanced analytics access
└── All lower-level permissions

PATHFINDER (Level 3)
├── Content management (weeks, sections, resources)
├── Basic administrative functions
├── Progress analytics
└── All lower-level permissions

LUMINARY (Level 2)
├── Advanced learning features
├── Badge achievements
├── Social sharing capabilities
└── All lower-level permissions

PIONEER (Level 1)
├── Basic learning access
├── Progress tracking
├── League enrollment
└── Profile management
```

### Route Protection Implementation

**Protected Route Component:**
```javascript
const ProtectedRoute = ({ requiredRoles = [], children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Check authentication
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  // Check role authorization
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};
```

**Role Validation:**
```javascript
const hasRole = (requiredRoles) => {
  if (!user) return false;
  
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  
  return requiredRoles.includes(user.role);
};
```

### API Authorization

**Request Header Authentication:**
```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

**Automatic Authorization Handling:**
```javascript
// All API services include automatic authorization
class AdminService {
  static async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}
```

## Data Protection

### Sensitive Data Handling

**User Information Security:**
- Email addresses encrypted in transit and at rest
- Personal information access restricted by role
- Audit logging for sensitive data access
- Automatic data anonymization for analytics

**Session Management:**
```javascript
// Secure logout with complete cleanup
const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Notify backend of logout
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }
};
```

### Input Validation and Sanitization

**Client-Side Validation:**
```javascript
// Form validation with security considerations
const validateUserInput = (data) => {
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }
  
  // Password strength validation
  if (data.password && data.password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  // XSS prevention
  const sanitizedData = {
    ...data,
    name: data.name.replace(/<script.*?>.*?<\/script>/gi, ''),
    description: data.description?.replace(/<script.*?>.*?<\/script>/gi, '')
  };
  
  return sanitizedData;
};
```

## API Security

### Request Authentication

**Standardized Auth Headers:**
```javascript
// Every API request includes proper authentication
const handleResponse = async (response) => {
  // Handle authentication errors
  if (response.status === 401) {
    // Attempt token refresh
    const refreshSuccess = await refreshToken();
    if (!refreshSuccess) {
      // Redirect to login
      window.location.href = '/signin';
      return;
    }
    // Retry original request with new token
    return fetch(response.url, {
      ...response,
      headers: getAuthHeaders()
    });
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  
  return result.data;
};
```

### Error Handling Security

**Secure Error Messages:**
```javascript
// Prevent information leakage through error messages
const handleAPIError = (error) => {
  // Log detailed errors for developers
  console.error('API Error:', error);
  
  // Return sanitized error messages to users
  const userFriendlyErrors = {
    'INVALID_CREDENTIALS': 'Invalid email or password',
    'ACCESS_DENIED': 'You do not have permission to access this resource',
    'TOKEN_EXPIRED': 'Your session has expired. Please log in again',
    'RATE_LIMITED': 'Too many requests. Please try again later'
  };
  
  return userFriendlyErrors[error.code] || 'An unexpected error occurred';
};
```

## Content Security

### XSS Prevention

**Content Sanitization:**
- All user-generated content sanitized before rendering
- HTML tags stripped from user inputs
- Script injection prevention
- Safe rendering with React's built-in protections

**Secure Component Rendering:**
```javascript
// Safe content rendering
const UserGeneratedContent = ({ content }) => {
  // React automatically escapes content, but additional sanitization
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: sanitizedContent 
      }} 
    />
  );
};
```

### CSRF Protection

**Token-Based Protection:**
- JWT tokens provide CSRF protection
- State parameter validation for OAuth flows
- Origin header verification
- Same-site cookie policies where applicable

## Privacy and Compliance

### Data Minimization

**User Data Collection:**
- Only collect essential user information
- Progressive data collection based on user engagement
- Clear consent mechanisms for optional data
- Regular data cleanup for inactive accounts

**Analytics and Tracking:**
```javascript
// Privacy-conscious analytics
const trackUserAction = (action, metadata = {}) => {
  // Only track necessary user behavior
  const anonymizedData = {
    action,
    timestamp: Date.now(),
    sessionId: generateSessionId(), // No personal identifiers
    ...metadata
  };
  
  // Send to analytics service
  analyticsService.track(anonymizedData);
};
```

### Access Logging

**Audit Trail:**
- Administrative actions logged with user identification
- Access attempts to sensitive resources
- Failed authentication attempts
- Data modification events

```javascript
// Secure logging for administrative actions
const logAdminAction = (action, userId, resourceId, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    resourceId,
    details,
    ip: getClientIP(),
    userAgent: navigator.userAgent
  };
  
  // Send to secure logging service
  auditLogger.log(logEntry);
};
```

## Security Monitoring

### Real-Time Security Monitoring

**Suspicious Activity Detection:**
- Multiple failed login attempts
- Unusual access patterns
- Privilege escalation attempts
- API abuse detection

**Automated Response:**
```javascript
// Security event handling
const handleSecurityEvent = (event) => {
  switch (event.type) {
    case 'FAILED_LOGIN_THRESHOLD':
      // Temporarily lock account
      lockUserAccount(event.userId, '15 minutes');
      break;
      
    case 'PRIVILEGE_ESCALATION_ATTEMPT':
      // Log and alert administrators
      alertAdministrators(event);
      logSecurityIncident(event);
      break;
      
    case 'API_ABUSE_DETECTED':
      // Rate limit user
      rateLimit(event.userId);
      break;
  }
};
```

### Vulnerability Management

**Dependency Security:**
- Regular security audits with `npm audit`
- Automated dependency updates for security patches
- Vulnerability scanning in CI/CD pipeline
- Third-party library security assessment

**Security Best Practices:**
- Regular security reviews of code changes
- Penetration testing for critical features
- Security-focused code review process
- Employee security training and awareness

This security architecture ensures that the OpenLearn platform maintains strong protection for user data, prevents unauthorized access, and provides a secure learning environment for all users.
