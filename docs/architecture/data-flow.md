# Data Flow & State Management

This document explains how data flows through the OpenLearn platform and how state is managed across components.

## 🔄 Data Flow Architecture

### High-Level Data Flow
```
User Interaction → Component → Service Layer → API → Backend → Database
                                      ↓
                   State Update ← Response ← Response ← Response
```

## 🏗️ State Management Strategy

### 1. Global State (React Context)

#### AuthContext
Central authentication state management for the entire application.

```javascript
// src/context/AuthContext.jsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication methods
  const login = async (email, password) => { /* ... */ };
  const logout = () => { /* ... */ };
  const checkAuthStatus = async () => { /* ... */ };

  const value = {
    user,
    loading,
    error,
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

#### State Structure
```javascript
const authState = {
  user: {
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
    role: "PIONEER",
    status: "ACTIVE",
    createdAt: "2024-06-12T10:30:00Z"
  },
  loading: false,
  error: null
};
```

### 2. Component-Level State

#### Local State Patterns
```javascript
// Loading state pattern
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

// Form state pattern
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: ''
});

// UI state pattern
const [isExpanded, setIsExpanded] = useState(false);
const [selectedTab, setSelectedTab] = useState('overview');
```

### 3. Service Layer Integration

#### API Service Pattern
```javascript
// src/utils/progressService.js
class ProgressService {
  static async getUserDashboard() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/progress/dashboard`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}
```

## 📊 Data Flow Patterns

### 1. Authentication Flow

```mermaid
graph TD
    A[User Login] --> B[AuthContext.login()]
    B --> C[API Call /login]
    C --> D{Success?}
    D -->|Yes| E[Store Tokens]
    E --> F[Set User State]
    F --> G[Redirect to Dashboard]
    D -->|No| H[Set Error State]
    H --> I[Show Error Message]
```

### 2. Progress Update Flow

```mermaid
graph TD
    A[Section Complete] --> B[Component Handler]
    B --> C[ProgressService.completeSection()]
    C --> D[API Call /sections/:id/complete]
    D --> E[Backend Processing]
    E --> F[Badge Check]
    F --> G[Response with Updates]
    G --> H[Update Local State]
    H --> I[Refresh Progress Display]
    I --> J[Show Badge Notification]
```

### 3. Enrollment Flow

```mermaid
graph TD
    A[User Clicks Enroll] --> B[Enrollment Component]
    B --> C[ProgressService.enrollUser()]
    C --> D[API Call /progress/enroll]
    D --> E[Create Enrollment Record]
    E --> F[Initialize Progress]
    F --> G[Return Enrollment Data]
    G --> H[Update Dashboard State]
    H --> I[Show Success Message]
    I --> J[Redirect to Learning]
```

## 🎣 Custom Hooks

### 1. useAuth Hook
```javascript
// src/hooks/useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in components
const { user, isAuthenticated, hasRole, login, logout } = useAuth();
```

### 2. useApi Hook
```javascript
// Custom hook for API calls
const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Usage
const { data: dashboardData, loading, error } = useApi(
  () => ProgressService.getUserDashboard(),
  [user?.id]
);
```

### 3. useProgress Hook
```javascript
const useProgress = (enrollmentId) => {
  const [progress, setProgress] = useState(null);

  const completeSection = async (sectionId, note, revision) => {
    try {
      const result = await ProgressService.completeSection(sectionId, note, revision);
      
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        completedSections: prev.completedSections + 1,
        progressPercentage: result.progressUpdate.progressPercentage
      }));

      return result;
    } catch (error) {
      throw error;
    }
  };

  return { progress, completeSection };
};
```

## 🔄 State Update Patterns

### 1. Optimistic Updates
```javascript
const handleSectionComplete = async (sectionId) => {
  // Optimistically update UI
  setProgress(prev => ({
    ...prev,
    completedSections: prev.completedSections + 1
  }));

  try {
    await ProgressService.completeSection(sectionId);
    // Success - UI already updated
  } catch (error) {
    // Revert optimistic update
    setProgress(prev => ({
      ...prev,
      completedSections: prev.completedSections - 1
    }));
    setError('Failed to complete section');
  }
};
```

### 2. Batch Updates
```javascript
const handleBulkSectionUpdate = async (sections) => {
  setLoading(true);
  
  try {
    const results = await Promise.all(
      sections.map(section => 
        ProgressService.completeSection(section.id, section.note)
      )
    );

    // Batch update state
    setProgress(prev => ({
      ...prev,
      completedSections: prev.completedSections + results.length,
      progressPercentage: results[results.length - 1].progressUpdate.progressPercentage
    }));

  } catch (error) {
    setError('Failed to update sections');
  } finally {
    setLoading(false);
  }
};
```

### 3. Conditional State Updates
```javascript
const updateUserProgress = (newProgress) => {
  setDashboardData(prev => {
    if (!prev?.enrollments) return prev;

    return {
      ...prev,
      enrollments: prev.enrollments.map(enrollment =>
        enrollment.id === newProgress.enrollmentId
          ? { ...enrollment, progress: newProgress }
          : enrollment
      )
    };
  });
};
```

## 📡 API Communication Patterns

### 1. Error Handling Strategy
```javascript
const handleApiCall = async (apiFunction, errorMessage) => {
  try {
    setLoading(true);
    setError(null);
    const result = await apiFunction();
    return result;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    setError(error.message || errorMessage);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

### 2. Token Refresh Integration
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');

  const makeRequest = async (authToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  };

  let response = await makeRequest(token);

  // Handle token expiration
  if (response.status === 401) {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResponse = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();
        localStorage.setItem('accessToken', accessToken);
        response = await makeRequest(accessToken);
      } else {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      window.location.href = '/signin';
    }
  }

  return response;
};
```

## 🏪 Data Caching Strategy

### 1. Memory Caching
```javascript
const cache = new Map();

const getCachedData = (key, fetchFunction, ttl = 300000) => { // 5 minutes TTL
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.data);
  }

  return fetchFunction().then(data => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  });
};
```

### 2. Local Storage Caching
```javascript
const getStoredData = (key, fetchFunction, ttl = 3600000) => { // 1 hour TTL
  const stored = localStorage.getItem(key);
  
  if (stored) {
    const { data, timestamp } = JSON.parse(stored);
    if (Date.now() - timestamp < ttl) {
      return Promise.resolve(data);
    }
  }

  return fetchFunction().then(data => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    return data;
  });
};
```

## 🔄 State Synchronization

### 1. Real-time Updates
```javascript
// WebSocket integration for real-time updates
const useRealtimeUpdates = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`${WS_URL}?userId=${user.id}`);

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      switch (type) {
        case 'PROGRESS_UPDATE':
          updateUserProgress(data);
          break;
        case 'BADGE_EARNED':
          showBadgeNotification(data);
          break;
        case 'ROLE_UPDATED':
          updateUserRole(data);
          break;
      }
    };

    return () => ws.close();
  }, [user?.id]);
};
```

### 2. Cross-Tab Synchronization
```javascript
// Storage event listener for cross-tab sync
useEffect(() => {
  const handleStorageChange = (event) => {
    if (event.key === 'user-progress') {
      const newProgress = JSON.parse(event.newValue);
      setProgress(newProgress);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

This data flow documentation provides a comprehensive understanding of how state management and data flow work throughout the OpenLearn platform.
