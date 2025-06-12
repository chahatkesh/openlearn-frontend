# Development Setup Guide

This guide will help you set up the OpenLearn platform for local development.

## 🛠️ Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js (version 8.19.0+)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Recommended Tools
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag
- **Browser**: Chrome or Firefox with React DevTools

## 📥 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd openlearn-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Environment
NODE_ENV=development

# Optional: Analytics and tracking
VITE_ANALYTICS_ID=your-analytics-id
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
openlearn-frontend/
├── public/                 # Static assets
│   ├── favicon.png
│   ├── logo.jpg
│   └── whatsapp-qr.png
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── admin/         # Admin panel components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── dashboard/     # User dashboard components
│   │   └── landingPage/   # Landing page components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions and services
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── docs/                  # Documentation
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🎨 Styling System

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFDE59',
        secondary: '#000000',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
```

### Custom CSS
Global styles are defined in `src/index.css`:
- CSS reset and base styles
- Custom animations
- Utility classes

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Fix auto-fixable linting errors
```

## 🔧 Configuration Files

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### ESLint Configuration
```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // ESLint configuration
]
```

## 🔄 State Management

### Context API Setup
The application uses React Context for global state management:

```javascript
// src/context/AuthContext.jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Authentication logic
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hooks
```javascript
// src/hooks/useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🛣️ Routing Setup

### React Router Configuration
```javascript
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER', 'CHIEF_PATHFINDER']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
```

## 🔌 API Integration

### Service Layer Pattern
API calls are abstracted into service classes:

```javascript
// src/utils/dataService.js
class DataService {
  static async getCohorts() {
    const response = await fetch(`${API_BASE_URL}/cohorts`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // More API methods
}
```

### Authentication Headers
```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

### Error Handling
```javascript
const handleResponse = async (response) => {
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }
  return result.data;
};
```

## 🎨 Component Development

### Component Structure Template
```javascript
import React, { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';

const ComponentName = ({ 
  prop1,
  prop2 = 'defaultValue',
  onAction = null,
  className = ''
}) => {
  const [localState, setLocalState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  const handleAction = () => {
    // Event handling
    onAction?.(data);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={`base-classes ${className}`}>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Props Documentation
```javascript
/**
 * ComponentName - Description of what this component does
 * 
 * @param {string} prop1 - Description of prop1
 * @param {string} prop2 - Description of prop2 with default value
 * @param {function} onAction - Callback function when action occurs
 * @param {string} className - Additional CSS classes
 */
```

## 🔍 Debugging

### React DevTools
1. Install React DevTools browser extension
2. Open browser developer tools
3. Use "Components" and "Profiler" tabs

### Console Debugging
```javascript
// Development logging
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Error boundary
console.error('Error occurred:', error);
```

### Network Debugging
- Use browser Network tab to inspect API calls
- Check request/response headers and payloads
- Monitor failed requests and status codes

## 🚀 Build Process

### Development Build
```bash
npm run dev
```
- Hot module replacement (HMR)
- Source maps for debugging
- Faster build times

### Production Build
```bash
npm run build
```
- Minified and optimized code
- Tree shaking for smaller bundle size
- Asset optimization

### Build Analysis
```bash
npm run build -- --analyze
```
- Bundle size analysis
- Dependency visualization
- Performance optimization insights

## 🧪 Testing Setup

### Testing Framework (Future)
When adding tests, consider:
- **Vitest**: For unit testing
- **React Testing Library**: For component testing
- **Cypress**: For end-to-end testing

### Test Structure
```
src/
├── components/
│   ├── Component.jsx
│   └── __tests__/
│       └── Component.test.jsx
```

## 📁 Environment Management

### Development Environment
```env
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3001
VITE_DEBUG=true
```

### Production Environment
```env
NODE_ENV=production
VITE_API_BASE_URL=https://api.openlearn.com
VITE_DEBUG=false
```

### Environment Variables Access
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

## 🔧 Development Workflow

### 1. Feature Development
1. Create feature branch: `git checkout -b feature/feature-name`
2. Develop and test locally
3. Follow coding standards and conventions
4. Commit with descriptive messages

### 2. Code Quality Checks
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

### 3. Testing
- Test in multiple browsers
- Check responsive design
- Verify all user flows
- Test error scenarios

### 4. Deployment Preparation
```bash
npm run build         # Create production build
npm run preview       # Test production build locally
```

This development setup provides a solid foundation for contributing to the OpenLearn platform. Follow the conventions and patterns established in the codebase for consistency.
