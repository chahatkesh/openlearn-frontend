# Coding Standards

## Code Quality and Style

### ESLint Configuration

The project uses ESLint 9.25.0 with modern configuration for maintaining code quality and consistency.

**Configuration Overview:**
```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

### Code Formatting Standards

**File Structure:**
```javascript
// 1. Imports (grouped and ordered)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// External libraries
import { motion } from 'framer-motion';
import { ChevronRight, User, Settings } from 'lucide-react';

// Internal utilities and services
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../utils/api';

// Components (from most general to most specific)
import { LoadingSpinner, ErrorBoundary } from '../../components/ui';
import { DashboardCard } from '../common';

// 2. Constants and configurations
const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DEFAULT_CONFIG = {
  refreshInterval: 30000,
  maxRetries: 3
};

// 3. Component definition
const ComponentName = ({ 
  title, 
  data, 
  onUpdate,
  config = DEFAULT_CONFIG,
  className = '' 
}) => {
  // Component implementation
};

// 4. PropTypes or TypeScript interfaces
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  onUpdate: PropTypes.func.isRequired,
  config: PropTypes.object,
  className: PropTypes.string
};

// 5. Default export
export default ComponentName;
```

### Variable and Function Naming

**Naming Conventions:**
```javascript
// ✅ Good: Descriptive and consistent naming
const userAuthenticationStatus = true;
const fetchUserProfiles = async () => {};
const calculateProgressPercentage = (completed, total) => {};

// Components: PascalCase
const UserDashboard = () => {};
const LearningProgressCard = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;

// Functions and variables: camelCase
const handleUserLogin = () => {};
const isUserAuthenticated = true;
const userEnrollments = [];

// Event handlers: handle + Action
const handleSubmit = () => {};
const handleInputChange = () => {};
const handleModalClose = () => {};

// Boolean variables: is/has/can/should + description
const isLoading = false;
const hasPermissions = true;
const canEditProfile = false;
const shouldShowWelcome = true;

// ❌ Bad: Unclear or inconsistent naming
const data = {}; // Too generic
const temp = ''; // Meaningless
const func1 = () => {}; // Non-descriptive
const UserData = {}; // Should be camelCase for variables
```

## React Component Standards

### Functional Component Structure

**Standard Component Template:**
```javascript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 */
const ComponentName = ({ 
  // Required props first
  title,
  data,
  onAction,
  
  // Optional props with defaults
  loading = false,
  variant = 'primary',
  className = ''
}) => {
  // 1. State declarations (group related state)
  const [localData, setLocalData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  // 2. Context and custom hooks
  const { user, isAuthenticated } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();

  // 3. Derived state and computed values
  const filteredData = useMemo(() => {
    if (!data || !searchTerm) return data;
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const isEmpty = useMemo(() => 
    !filteredData || filteredData.length === 0
  , [filteredData]);

  // 4. Effects (ordered by dependency complexity)
  useEffect(() => {
    // Effects with no dependencies
    document.title = `${title} - OpenLearn`;
    
    return () => {
      document.title = 'OpenLearn';
    };
  }, [title]);

  useEffect(() => {
    // Effects with dependencies
    if (isAuthenticated && data?.length > 0) {
      processData(data);
    }
  }, [isAuthenticated, data]);

  // 5. Event handlers and callbacks
  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleAction = useCallback(async (actionData) => {
    try {
      setError(null);
      await onAction(actionData);
    } catch (err) {
      setError(err.message);
    }
  }, [onAction]);

  const processData = useCallback(async (rawData) => {
    try {
      const processed = await processRawData(rawData);
      setLocalData(processed);
    } catch (err) {
      setError('Failed to process data');
    }
  }, []);

  // 6. Conditional rendering helpers
  const renderEmptyState = () => (
    <div className="text-center py-8 text-gray-500">
      No data available
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-8 text-red-500">
      <p>{error}</p>
      <button 
        onClick={() => setError(null)}
        className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded"
      >
        Dismiss
      </button>
    </div>
  );

  // 7. Early returns for loading/error states
  if (loading) {
    return <LoadingSpinner className="my-8" />;
  }

  if (error) {
    return renderErrorState();
  }

  if (isEmpty) {
    return renderEmptyState();
  }

  // 8. Main render
  return (
    <div className={`component-container ${className}`}>
      <header className="component-header">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={handleExpand}
          className="btn-secondary"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </header>

      <main className={`component-content ${isExpanded ? 'expanded' : ''}`}>
        {filteredData.map(item => (
          <div key={item.id} className="data-item">
            <span>{item.name}</span>
            <button
              onClick={() => handleAction(item)}
              className="btn-primary"
            >
              Action
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

// 9. PropTypes with detailed validation
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  onAction: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  className: PropTypes.string
};

export default ComponentName;
```

### Hook Usage Standards

**State Management:**
```javascript
// ✅ Good: Descriptive state names with proper initialization
const [userProfiles, setUserProfiles] = useState([]);
const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
const [profileError, setProfileError] = useState(null);

// ✅ Good: Grouped related state
const [formState, setFormState] = useState({
  name: '',
  email: '',
  isValid: false
});

// ✅ Good: Boolean state with clear intent
const [isModalOpen, setIsModalOpen] = useState(false);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// ❌ Bad: Generic or unclear state names
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [open, setOpen] = useState(false);
```

**Effect Dependencies:**
```javascript
// ✅ Good: Proper dependency arrays
useEffect(() => {
  if (userId && isAuthenticated) {
    fetchUserData(userId);
  }
}, [userId, isAuthenticated]); // All referenced variables included

// ✅ Good: Cleanup functions
useEffect(() => {
  const timer = setInterval(() => {
    refreshData();
  }, 30000);

  return () => clearInterval(timer);
}, [refreshData]);

// ✅ Good: Event listener cleanup
useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchUserData(userId); // userId not in dependencies
}, []); 

// ❌ Bad: Unnecessary dependencies
useEffect(() => {
  console.log('Component mounted');
}, [someVariable]); // someVariable not used in effect
```

**Performance Optimization:**
```javascript
// ✅ Good: Memoized expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => {
    return acc + calculateComplexValue(item);
  }, 0);
}, [data]); // Only recalculate when data changes

// ✅ Good: Memoized callbacks to prevent child re-renders
const handleItemClick = useCallback((itemId) => {
  setSelectedItem(items.find(item => item.id === itemId));
}, [items]);

// ✅ Good: Memoized components for expensive renders
const MemoizedItemList = useMemo(() => (
  <ItemList 
    items={filteredItems} 
    onItemClick={handleItemClick}
  />
), [filteredItems, handleItemClick]);

// ❌ Bad: Unnecessary memoization
const simpleValue = useMemo(() => {
  return a + b; // Simple calculation doesn't need memoization
}, [a, b]);

// ❌ Bad: Missing memoization for expensive operations
const FilteredList = ({ items, filter }) => {
  // This expensive filter runs on every render
  const filtered = items.filter(item => 
    item.tags.some(tag => 
      tag.toLowerCase().includes(filter.toLowerCase())
    )
  );

  return <List items={filtered} />;
};
```

## API Service Standards

### Service Architecture

**Service Class Structure:**
```javascript
/**
 * UserService - Handles all user-related API operations
 * Provides methods for user management, authentication, and profile operations
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

// Utility functions (not exported)
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  
  return result.data;
};

const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

/**
 * User Service Class
 * All methods are static and handle their own error logging
 */
class UserService {
  // ==================== USER PROFILE OPERATIONS ====================
  
  /**
   * Get user profile by ID
   * @param {string} userId - User ID to fetch
   * @returns {Promise<Object>} User profile data
   * @throws {Error} When user not found or unauthorized
   */
  static async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Get user profile failed:', error.message);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID to update
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's full name
   * @param {string} profileData.email - User's email address
   * @param {string} [profileData.bio] - User's biography
   * @returns {Promise<Object>} Updated user profile
   */
  static async updateUserProfile(userId, profileData) {
    try {
      // Validate required fields
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Update user profile failed:', error.message);
      throw error;
    }
  }

  // ==================== USER SEARCH AND FILTERING ====================
  
  /**
   * Search users with filters and pagination
   * @param {Object} options - Search options
   * @param {string} [options.query] - Search query string
   * @param {string} [options.role] - Filter by user role
   * @param {string} [options.status] - Filter by user status
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=20] - Items per page
   * @returns {Promise<Object>} Search results with pagination
   */
  static async searchUsers(options = {}) {
    try {
      const {
        query = '',
        role = '',
        status = '',
        page = 1,
        limit = 20
      } = options;

      const queryString = buildQueryString({
        q: query,
        role,
        status,
        page,
        limit
      });

      const response = await fetch(
        `${API_BASE_URL}/users/search?${queryString}`,
        { headers: getAuthHeaders() }
      );
      
      return handleResponse(response);
    } catch (error) {
      console.error('Search users failed:', error.message);
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================
  
  /**
   * Bulk update user roles
   * @param {Array<Object>} updates - Array of user role updates
   * @param {string} updates[].userId - User ID to update
   * @param {string} updates[].newRole - New role to assign
   * @returns {Promise<Array>} Results of bulk update operation
   */
  static async bulkUpdateRoles(updates) {
    try {
      if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Updates array is required and cannot be empty');
      }

      // Validate each update object
      updates.forEach((update, index) => {
        if (!update.userId || !update.newRole) {
          throw new Error(`Invalid update at index ${index}: userId and newRole are required`);
        }
      });

      const response = await fetch(`${API_BASE_URL}/users/bulk-update-roles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ updates })
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Bulk update roles failed:', error.message);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Validate user role
   * @param {string} role - Role to validate
   * @returns {boolean} Whether role is valid
   */
  static isValidRole(role) {
    const validRoles = [
      'PIONEER',
      'LUMINARY', 
      'PATHFINDER',
      'CHIEF_PATHFINDER',
      'GRAND_PATHFINDER'
    ];
    
    return validRoles.includes(role);
  }

  /**
   * Check if user has permission for action
   * @param {Object} user - User object
   * @param {string} action - Action to check
   * @returns {boolean} Whether user has permission
   */
  static hasPermission(user, action) {
    if (!user || !user.role) return false;

    const rolePermissions = {
      'PIONEER': ['read_own_profile', 'update_own_profile'],
      'LUMINARY': ['read_own_profile', 'update_own_profile', 'access_advanced_features'],
      'PATHFINDER': ['read_own_profile', 'update_own_profile', 'manage_content'],
      'CHIEF_PATHFINDER': ['read_own_profile', 'update_own_profile', 'manage_content', 'manage_users'],
      'GRAND_PATHFINDER': ['all']
    };

    const userPermissions = rolePermissions[user.role] || [];
    
    return userPermissions.includes('all') || userPermissions.includes(action);
  }
}

export default UserService;
```

### Error Handling Standards

**Consistent Error Handling Pattern:**
```javascript
// ✅ Good: Standardized error handling
class ApiService {
  static async makeRequest(endpoint, options = {}) {
    try {
      // Pre-request validation
      if (!endpoint) {
        throw new Error('Endpoint is required');
      }

      // Make the request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
        ...options
      });

      // Handle different HTTP status codes
      if (response.status === 401) {
        // Handle authentication errors
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        return;
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }

      if (response.status === 404) {
        throw new Error('The requested resource was not found');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 
          `Request failed with status ${response.status}`
        );
      }

      return handleResponse(response);
    } catch (error) {
      // Log error for debugging (remove in production)
      console.error(`API request to ${endpoint} failed:`, error);
      
      // Re-throw with context
      throw new Error(`API Error: ${error.message}`);
    }
  }
}
```

## Performance Standards

### Code Optimization

**React Performance Best Practices:**
```javascript
// ✅ Good: Memoized component to prevent unnecessary renders
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function if needed
  return prevProps.data.length === nextProps.data.length &&
         prevProps.onUpdate === nextProps.onUpdate;
});

// ✅ Good: Optimized list rendering
const ItemList = ({ items, onItemClick }) => {
  const handleItemClick = useCallback((itemId) => {
    onItemClick(itemId);
  }, [onItemClick]);

  return (
    <div className="item-list">
      {items.map(item => (
        <MemoizedItem
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
};

// ✅ Good: Lazy loading for large components
const LazyDashboard = React.lazy(() => import('./Dashboard'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyDashboard />
  </Suspense>
);

// ❌ Bad: Creating objects in render (causes unnecessary re-renders)
const BadComponent = ({ data }) => {
  return (
    <ChildComponent 
      style={{ marginTop: 10 }} // New object every render
      config={{ timeout: 5000 }} // New object every render
      data={data}
    />
  );
};

// ✅ Good: Define objects outside render or use useMemo
const ITEM_STYLE = { marginTop: 10 };
const DEFAULT_CONFIG = { timeout: 5000 };

const GoodComponent = ({ data }) => {
  const config = useMemo(() => ({
    timeout: data.length > 100 ? 10000 : 5000
  }), [data.length]);

  return (
    <ChildComponent 
      style={ITEM_STYLE}
      config={config}
      data={data}
    />
  );
};
```

### Bundle Optimization

**Import/Export Standards:**
```javascript
// ✅ Good: Named imports for tree shaking
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, User } from 'lucide-react';

// ✅ Good: Barrel exports for internal modules
// src/components/ui/index.js
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Modal } from './Modal';
export { default as Button } from './Button';

// ✅ Good: Dynamic imports for code splitting
const loadDashboard = () => import('./Dashboard');

// ❌ Bad: Default imports that prevent tree shaking
import * as Icons from 'lucide-react'; // Imports entire library
import _ from 'lodash'; // Imports entire lodash library

// ✅ Good: Specific imports
import { debounce } from 'lodash-es';
import { Search, User } from 'lucide-react';
```

This comprehensive coding standards guide ensures consistency, maintainability, and performance across the OpenLearn platform codebase.
