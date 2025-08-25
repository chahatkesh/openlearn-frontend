# Development Standards

Code style guidelines and best practices for OpenLearn Frontend development.

## Code Style

### JavaScript/React Standards

#### Component Structure
```jsx
// ✅ Good: Functional component with proper structure
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const MyComponent = ({ title, onAction }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic here
  }, []);

  const handleClick = () => {
    setLoading(true);
    onAction?.();
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click Me
      </button>
    </div>
  );
};

export default MyComponent;
```

#### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `DashboardLayout`)
- **Files**: PascalCase for components (`UserProfile.jsx`)
- **Variables/Functions**: camelCase (`userName`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **CSS Classes**: Use Tailwind utilities, custom classes in kebab-case

#### Import Organization
```jsx
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, User } from 'lucide-react';

// 2. Internal hooks and context
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';

// 3. Components (grouped by type)
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

// 4. Utilities and services
import { formatDate } from '../../utils/dateUtils';
import DataService from '../../utils/dataService';

// 5. Static data
import { leaguesData } from '../../data/leaguesData';
```

### CSS/Tailwind Standards

#### Class Organization
```jsx
// ✅ Group classes logically
<div className="
  flex items-center justify-between
  p-4 m-2
  bg-white border border-gray-200 rounded-lg shadow-sm
  hover:shadow-md hover:border-gray-300
  transition-all duration-200
">
```

#### Responsive Design
```jsx
// ✅ Mobile-first approach
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4
">
```

## Component Guidelines

### Component Types

#### 1. Page Components
- Located in `src/pages/`
- Handle routing and page-level logic
- Compose smaller components

#### 2. Layout Components
- Located in `src/components/common/`
- Provide structure and navigation
- Reusable across pages

#### 3. Feature Components
- Located in feature-specific directories
- Encapsulate specific functionality
- Self-contained with minimal external dependencies

#### 4. UI Components
- Located in `src/components/common/`
- Pure presentational components
- Highly reusable and configurable

### Props Patterns

#### Props Documentation
```jsx
/**
 * User profile card component
 * @param {Object} user - User object with name, email, role
 * @param {boolean} showActions - Whether to show action buttons
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {string} className - Additional CSS classes
 */
const UserCard = ({ 
  user, 
  showActions = false, 
  onEdit, 
  className = '' 
}) => {
  // Component implementation
};
```

#### Default Props
```jsx
// ✅ Use default parameters
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  children 
}) => {
  // Component logic
};
```

## State Management

### Context Usage
```jsx
// ✅ Proper context implementation
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = {
    user,
    loading,
    login: (credentials) => { /* login logic */ },
    logout: () => { /* logout logic */ },
    isAuthenticated: () => !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### State Updates
```jsx
// ✅ Proper state updates
const [items, setItems] = useState([]);

// Adding item
const addItem = (newItem) => {
  setItems(prev => [...prev, newItem]);
};

// Updating item
const updateItem = (id, updates) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};

// Removing item
const removeItem = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
```

## API Integration

### Service Layer Pattern
```jsx
// ✅ Centralized API service
class DataService {
  static async getUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  static async updateUser(id, data) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
}
```

### Error Handling
```jsx
// ✅ Consistent error handling
const fetchUserData = async (userId) => {
  try {
    setLoading(true);
    setError(null);
    
    const userData = await DataService.getUser(userId);
    setUser(userData);
  } catch (error) {
    setError(error.message);
    console.error('Failed to fetch user:', error);
  } finally {
    setLoading(false);
  }
};
```

## Performance Best Practices

### Component Optimization
```jsx
// ✅ Memoization for expensive components
import React, { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
});
```

### Conditional Rendering
```jsx
// ✅ Efficient conditional rendering
const ConditionalComponent = ({ show, data }) => {
  if (!show) return null;
  
  return (
    <div>
      {data.length > 0 ? (
        data.map(item => <Item key={item.id} item={item} />)
      ) : (
        <EmptyState message="No items found" />
      )}
    </div>
  );
};
```

## Testing Guidelines

### Component Testing
```jsx
// ✅ Basic component test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserCard from '../UserCard';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'PIONEER'
  };

  it('renders user information correctly', () => {
    renderWithRouter(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    
    renderWithRouter(
      <UserCard user={mockUser} showActions onEdit={mockOnEdit} />
    );
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

## Git Workflow

### Commit Messages
Follow conventional commit format:

```bash
# ✅ Good commit messages
feat: add user profile editing functionality
fix: resolve dashboard loading issue
docs: update API documentation
style: improve button hover animations
refactor: extract common validation logic
test: add unit tests for auth service
chore: update dependencies
```

### Branch Naming
```bash
# Feature branches
feature/user-profile-editing
feature/dashboard-optimization

# Bug fixes
fix/authentication-redirect
fix/mobile-responsive-header

# Documentation
docs/api-reference-update
docs/setup-guide-improvement
```

## Code Review Checklist

### Before Submitting PR
- [ ] Code follows established conventions
- [ ] All tests pass
- [ ] ESLint warnings resolved
- [ ] Components are properly documented
- [ ] Mobile responsiveness tested
- [ ] Accessibility considerations addressed
- [ ] Performance impact evaluated

### Review Criteria
- [ ] Code is readable and well-structured
- [ ] Error handling is appropriate
- [ ] Security considerations addressed
- [ ] Performance optimizations applied
- [ ] Documentation is updated
- [ ] Tests cover new functionality

## Tools and Extensions

### Required Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (if configured)
- **React Developer Tools**: Debugging React components

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Path Intellisense**

These standards ensure consistency, maintainability, and quality across the OpenLearn Frontend codebase.
