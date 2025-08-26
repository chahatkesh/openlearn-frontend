# Development Setup Guide

## Prerequisites

### System Requirements

**Node.js Environment:**
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher (comes with Node.js)
- Git for version control

**Development Tools:**
- Visual Studio Code (recommended)
- Chrome/Firefox with developer tools
- Postman or similar API testing tool

### Verification Commands

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 8.0.0

# Check Git installation
git --version
```

## Quick Start

### 1. Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd openlearn-frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2. Environment Configuration

**Edit `.env` file:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Twitter API Configuration (optional for development)
VITE_TWITTER_API_KEY=your_api_key_here
VITE_TWITTER_API_KEY_SECRET=your_api_key_secret_here
VITE_TWITTER_BEARER_TOKEN=your_bearer_token_here
VITE_TWITTER_ACCESS_TOKEN=your_access_token_here
VITE_TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Access the application
# Open http://localhost:5173 in your browser
```

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server with HMR
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint for code quality checks
npm run lint:fix         # Auto-fix linting issues

# Build Process
npm run build            # Create production build
npm run type-check       # TypeScript type checking

# Maintenance
npm run clean            # Clean build artifacts and cache
npm run deps:check       # Check for unused dependencies
npm run deps:update      # Update dependencies to latest versions
npm run security:audit   # Security audit of dependencies
npm run security:fix     # Fix security vulnerabilities

# CI/CD
npm run ci               # Complete CI pipeline (install, lint, build)
```

### Development Server Features

**Vite Development Server:**
- Hot Module Replacement (HMR) for instant updates
- Fast build times with native ES modules
- Automatic browser refresh on file changes
- Source map support for debugging
- CSS preprocessing with Tailwind CSS

**Development URLs:**
- Application: `http://localhost:5173`
- Network access: `http://[your-ip]:5173` (for mobile testing)

## Code Organization

### Component Development

**Creating New Components:**

```bash
# Navigate to appropriate directory
cd src/components/features/[domain]

# Create component file
touch NewComponent.jsx

# Add to barrel export
echo "export { default as NewComponent } from './NewComponent';" >> index.js
```

**Component Template:**
```javascript
import React, { useState, useEffect } from 'react';

const NewComponent = ({ 
  // Props with default values
  title = '',
  onAction = () => {},
  loading = false 
}) => {
  // Local state
  const [localState, setLocalState] = useState(null);

  // Effects
  useEffect(() => {
    // Component logic
  }, []);

  // Event handlers
  const handleAction = () => {
    onAction();
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Main render
  return (
    <div className="new-component">
      <h2>{title}</h2>
      <button onClick={handleAction}>
        Action
      </button>
    </div>
  );
};

export default NewComponent;
```

### API Service Development

**Creating New Services:**

```bash
# Navigate to API services directory
cd src/utils/api

# Create service file
touch newService.js

# Add to barrel export
echo "export { default as NewService } from './newService';" >> index.js
```

**Service Template:**
```javascript
/**
 * New Service for OpenLearn Platform
 * Handles [specific functionality] API calls
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
 * New Service Class
 */
class NewService {
  /**
   * Get data from API
   * @param {string} id - Resource ID
   * @returns {Promise} API response data
   */
  static async getData(id) {
    const response = await fetch(`${API_BASE_URL}/resource/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }

  /**
   * Create new resource
   * @param {Object} data - Resource data
   * @returns {Promise} Created resource
   */
  static async create(data) {
    const response = await fetch(`${API_BASE_URL}/resource`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }
}

export default NewService;
```

## Debugging and Development Tools

### Browser Developer Tools

**React Developer Tools:**
```bash
# Install React Developer Tools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**Debugging Features:**
- Component tree inspection
- Props and state examination
- Performance profiling
- Hook debugging

### Console Debugging

**Development Logging:**
```javascript
// Use console.log for development debugging
console.log('Debug info:', { data, state, props });

// Use console.error for error tracking
console.error('Error occurred:', error);

// Use console.warn for warnings
console.warn('Deprecated feature used:', feature);

// Use console.table for tabular data
console.table(arrayOfObjects);
```

### Network Debugging

**API Call Monitoring:**
- Use browser Network tab to inspect API calls
- Check request headers for authentication
- Verify response status codes and data
- Monitor loading times and performance

**Common Debugging Scenarios:**
```javascript
// Debug authentication issues
const debugAuth = () => {
  const token = localStorage.getItem('accessToken');
  console.log('Current token:', token ? 'Present' : 'Missing');
  
  if (token) {
    // Decode JWT to check expiration (development only)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token expires:', new Date(payload.exp * 1000));
  }
};

// Debug API calls
const debugAPICall = async (url, options) => {
  console.log('API Call:', { url, options });
  
  try {
    const response = await fetch(url, options);
    console.log('Response:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Testing Environment

### Component Testing Setup

**Testing Dependencies:**
```bash
# Install testing dependencies (if not already included)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

**Basic Component Test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewComponent from './NewComponent';

describe('NewComponent', () => {
  it('renders with title', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const mockAction = vi.fn();
    render(<NewComponent onAction={mockAction} />);
    
    fireEvent.click(screen.getByText('Action'));
    expect(mockAction).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<NewComponent loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### API Service Testing

**Service Test Example:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewService from './newService';

// Mock fetch
global.fetch = vi.fn();

describe('NewService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData })
    });

    const result = await NewService.getData('1');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/resource/1',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Bearer')
        })
      })
    );
  });

  it('handles API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Not found' })
    });

    await expect(NewService.getData('1')).rejects.toThrow('Not found');
  });
});
```

## Performance Optimization

### Development Performance

**Bundle Analysis:**
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
});
```

**Performance Monitoring:**
```javascript
// Monitor component render times
const PerformanceWrapper = ({ children, name }) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`${name} render time: ${endTime - startTime}ms`);
    };
  });

  return children;
};

// Monitor API call performance
const monitorAPI = async (apiCall, name) => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    console.log(`${name} API call: ${endTime - startTime}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`${name} API error after ${endTime - startTime}ms:`, error);
    throw error;
  }
};
```

## Common Development Issues

### Troubleshooting Guide

**Issue: Development server won't start**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port availability
lsof -ti:5173  # If occupied, kill process or change port
```

**Issue: Authentication not working**
```javascript
// Check token storage
console.log('Access token:', localStorage.getItem('accessToken'));
console.log('Refresh token:', localStorage.getItem('refreshToken'));

// Clear tokens and re-login
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

**Issue: API calls failing**
```javascript
// Verify API base URL
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Check network connectivity
fetch(import.meta.env.VITE_API_BASE_URL + '/health')
  .then(response => console.log('API health:', response.status))
  .catch(error => console.error('API unreachable:', error));
```

**Issue: Components not updating**
```javascript
// Check for missing dependencies in useEffect
useEffect(() => {
  // Add all referenced variables to dependency array
}, [dependency1, dependency2]); // Don't forget dependencies!

// Verify state updates
const [state, setState] = useState(initialValue);

const updateState = (newValue) => {
  console.log('Updating state from', state, 'to', newValue);
  setState(newValue);
};
```

This development setup guide provides everything needed to start contributing to the OpenLearn platform efficiently and effectively.
