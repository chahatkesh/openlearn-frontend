# Contributing Guidelines

## Code Standards and Conventions

### TypeScript and JavaScript Standards

**File Naming Conventions:**
- Components: PascalCase (e.g., `UserDashboard.jsx`)
- Utilities: camelCase (e.g., `apiService.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- Directories: kebab-case (e.g., `user-management/`)

**Code Style Guidelines:**

```javascript
// ✅ Good: Functional components with proper destructuring
const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  // State declarations
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  // Custom hooks
  const { isAuthenticated } = useAuth();

  // Effects with clear dependencies
  useEffect(() => {
    if (user?.id) {
      fetchUserDetails(user.id);
    }
  }, [user?.id]);

  // Event handlers
  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Early returns for loading/error states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="user-card bg-white rounded-lg shadow-md p-4">
      {/* Component content */}
    </div>
  );
};

// ✅ Good: PropTypes or TypeScript interfaces
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
```

**ESLint Configuration Compliance:**
```javascript
// ✅ Good: Follow ESLint rules
const ComponentName = () => {
  // Hooks at the top level
  const [state, setState] = useState(null);
  const { user } = useAuth();

  // useCallback for expensive functions
  const memoizedCallback = useCallback(() => {
    // Expensive operation
  }, [dependency]);

  // useMemo for expensive calculations
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(state);
  }, [state]);

  return <div>{/* JSX */}</div>;
};

// ❌ Bad: Hooks in conditions or loops
const BadComponent = () => {
  if (condition) {
    const [state, setState] = useState(null); // ❌ Hook in condition
  }

  for (let i = 0; i < 5; i++) {
    useEffect(() => {}); // ❌ Hook in loop
  }
};
```

### Component Architecture Standards

**Component Organization:**
```
src/components/
├── common/              # Shared utilities across features
│   ├── HeroSection.jsx
│   ├── MotionWrapper.jsx
│   └── index.js        # Barrel exports
├── features/           # Domain-specific components
│   ├── authentication/
│   │   ├── LoginForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── index.js
│   ├── dashboard/
│   │   ├── LearningProgress.jsx
│   │   ├── LeagueCard.jsx
│   │   └── index.js
│   └── admin/
│       ├── UserManagement.jsx
│       ├── ContentManager.jsx
│       └── index.js
├── layout/             # Application layouts
│   ├── DashboardLayout.jsx
│   ├── AdminLayout.jsx
│   └── index.js
└── ui/                 # Base UI components
    ├── LoadingSpinner.jsx
    ├── Modal.jsx
    └── index.js
```

**Component Structure Standards:**
```javascript
// ✅ Standard component structure
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../utils/api';
import { LoadingSpinner, ErrorMessage } from '../ui';

/**
 * ComponentName - Brief description of what this component does
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onAction - Callback when action is triggered
 * @param {boolean} props.loading - Loading state
 */
const ComponentName = ({ title, onAction, loading = false }) => {
  // 1. State declarations
  const [localState, setLocalState] = useState(null);
  const [error, setError] = useState(null);

  // 2. Context and custom hooks
  const { user, isAuthenticated } = useAuth();

  // 3. Computed values
  const computedValue = useMemo(() => {
    return expensiveComputation(localState);
  }, [localState]);

  // 4. Effects
  useEffect(() => {
    if (isAuthenticated()) {
      loadData();
    }
  }, [isAuthenticated]);

  // 5. Event handlers
  const handleAction = useCallback(async () => {
    try {
      setError(null);
      await onAction();
    } catch (err) {
      setError(err.message);
    }
  }, [onAction]);

  const loadData = useCallback(async () => {
    try {
      const data = await ApiService.getData();
      setLocalState(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // 6. Early returns for loading/error states
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  // 7. Main render
  return (
    <div className="component-container">
      <h2 className="text-xl font-bold">{title}</h2>
      <button 
        onClick={handleAction}
        className="btn-primary"
        disabled={loading}
      >
        Action
      </button>
    </div>
  );
};

// 8. PropTypes
ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

// 9. Default export
export default ComponentName;
```

## API Service Standards

### Service Layer Architecture

**Service File Structure:**
```javascript
/**
 * Service Name - Description of service functionality
 * Handles [specific domain] API operations
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

/**
 * Get authorization headers with JWT token
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
 * Service Class with static methods
 */
class ServiceName {
  // ==================== SECTION TITLE ====================
  
  /**
   * Method description
   * @param {string} param1 - Parameter description
   * @param {Object} param2 - Parameter description
   * @returns {Promise} Return value description
   */
  static async methodName(param1, param2) {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ param1, param2 })
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Method name failed:', error.message);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Helper method description
   * @param {Object} data - Data to validate
   * @returns {boolean} Validation result
   */
  static validateData(data) {
    // Validation logic
    return true;
  }
}

export default ServiceName;
```

### Error Handling Standards

**Consistent Error Handling:**
```javascript
// ✅ Good: Consistent error handling pattern
const handleAPICall = async (apiFunction, errorContext) => {
  try {
    setLoading(true);
    setError(null);
    
    const result = await apiFunction();
    return result;
  } catch (error) {
    console.error(`${errorContext} failed:`, error);
    setError(`${errorContext} failed: ${error.message}`);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Usage in components
const handleUserUpdate = async (userData) => {
  await handleAPICall(
    () => UserService.updateUser(userData),
    'User update'
  );
};
```

## Testing Standards

### Component Testing

**Test Structure:**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import ComponentName from './ComponentName';

// Mock dependencies
vi.mock('../../utils/api/ApiService');

// Test wrapper for context providers
const TestWrapper = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('ComponentName', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with required props', () => {
      render(
        <ComponentName title="Test Title" onAction={vi.fn()} />,
        { wrapper: TestWrapper }
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(
        <ComponentName title="Test" onAction={vi.fn()} loading={true} />,
        { wrapper: TestWrapper }
      );
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onAction when button clicked', async () => {
      const mockAction = vi.fn();
      render(
        <ComponentName title="Test" onAction={mockAction} />,
        { wrapper: TestWrapper }
      );

      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(mockAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message on API failure', async () => {
      const mockAction = vi.fn().mockRejectedValue(new Error('API Error'));
      
      render(
        <ComponentName title="Test" onAction={mockAction} />,
        { wrapper: TestWrapper }
      );

      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        expect(screen.getByText(/API Error/)).toBeInTheDocument();
      });
    });
  });
});
```

### API Service Testing

**Service Test Standards:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServiceName from './ServiceName';

// Mock global fetch
global.fetch = vi.fn();

describe('ServiceName', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('includes auth headers in requests', async () => {
      localStorage.setItem('accessToken', 'test-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} })
      });

      await ServiceName.methodName('param1', {});

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('throws error on API failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'API Error' })
      });

      await expect(ServiceName.methodName('param1', {}))
        .rejects.toThrow('API Error');
    });

    it('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network Error'));

      await expect(ServiceName.methodName('param1', {}))
        .rejects.toThrow('Network Error');
    });
  });
});
```

## Git Workflow and Conventions

### Branch Naming

**Branch Types:**
```bash
# Feature branches
feature/user-authentication
feature/dashboard-optimization
feature/admin-user-management

# Bug fixes
bugfix/login-redirect-issue
bugfix/dashboard-loading-error

# Hotfixes
hotfix/security-vulnerability
hotfix/production-api-error

# Documentation
docs/api-documentation
docs/setup-guide-update

# Refactoring
refactor/component-structure
refactor/api-service-optimization
```

### Commit Message Standards

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add role-based route protection

Add ProtectedRoute component that checks user roles before
allowing access to admin routes. Includes redirect logic
for unauthorized users.

Closes #123

fix(dashboard): resolve infinite loading on progress page

The progress calculation was causing an infinite loop when
user had no enrollments. Added proper error handling and
fallback states.

Fixes #456

docs(api): update service documentation

Add comprehensive JSDoc comments for all API service methods
including parameter types and return values.

refactor(components): reorganize component directory structure

Move components into feature-based directories for better
organization and maintainability.

- Move auth components to features/authentication/
- Move dashboard components to features/dashboard/
- Move admin components to features/admin/
```

### Pull Request Guidelines

**PR Title Format:**
```
[Type] Brief description of changes
```

**PR Description Template:**
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] No console.log statements in production code
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated if needed

## Related Issues
Closes #123
Related to #456

## Screenshots (if applicable)
[Add screenshots of UI changes]
```

## Code Review Standards

### Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases handled properly
- [ ] Error handling implemented
- [ ] No console.log statements left in code

**Code Quality:**
- [ ] Follows established patterns
- [ ] Proper component structure
- [ ] Meaningful variable and function names
- [ ] Adequate code comments

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Proper use of useCallback and useMemo
- [ ] Efficient API calls
- [ ] No memory leaks

**Security:**
- [ ] Input validation implemented
- [ ] Authentication checks in place
- [ ] No sensitive data exposure
- [ ] Proper error message handling

**Testing:**
- [ ] Unit tests included
- [ ] Test coverage adequate
- [ ] Tests are meaningful
- [ ] Mock dependencies properly

### Review Comments Standards

**Constructive Feedback:**
```markdown
# ✅ Good feedback
Consider using useCallback here to prevent unnecessary re-renders:
```javascript
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

# ✅ Good feedback with explanation
This could cause a memory leak. The effect cleanup should remove the event listener:
```javascript
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

# ❌ Poor feedback
This is wrong.

# ❌ Poor feedback
Bad code.
```

## Documentation Standards

### Code Documentation

**JSDoc Standards:**
```javascript
/**
 * Calculate user progress across all enrolled leagues
 * @param {Array<Object>} enrollments - User enrollments with progress data
 * @param {Object} resourceProgress - Resource completion mapping
 * @returns {Object} Aggregated progress statistics
 * @example
 * const progress = calculateProgress(userEnrollments, resourceData);
 * console.log(progress.overallPercentage); // 75
 */
const calculateProgress = (enrollments, resourceProgress) => {
  // Implementation
};
```

**Component Documentation:**
```javascript
/**
 * UserDashboard - Main dashboard component for authenticated users
 * 
 * Displays user's learning progress, enrolled leagues, and quick actions.
 * Handles real-time progress updates and provides navigation to league details.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.user - Current user object with profile information
 * @param {Function} props.onLogout - Callback function for user logout
 * @param {boolean} [props.showWelcome=true] - Whether to show welcome message
 * 
 * @example
 * <UserDashboard 
 *   user={currentUser} 
 *   onLogout={handleLogout}
 *   showWelcome={false}
 * />
 */
const UserDashboard = ({ user, onLogout, showWelcome = true }) => {
  // Component implementation
};
```

### README Documentation

**Feature Documentation:**
```markdown
# Feature Name

## Overview
Brief description of what this feature does and why it exists.

## Usage
Basic usage examples with code snippets.

## API Reference
Detailed API documentation for public interfaces.

## Examples
Comprehensive examples showing different use cases.

## Configuration
Any configuration options or environment variables needed.

## Troubleshooting
Common issues and their solutions.
```

This comprehensive guide ensures consistent, high-quality contributions to the OpenLearn platform while maintaining code standards and facilitating effective collaboration.
