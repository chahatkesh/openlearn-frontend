# Getting Started Guide

## Overview

OpenLearn is a comprehensive learning management platform built with React 19 and modern web technologies. This guide will help you quickly understand the platform's structure and get started with development or contribution.

## Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher  
- **Git**: For version control
- **Code Editor**: VS Code recommended with React extensions

### Installation

```bash
# Clone the repository
git clone https://github.com/openlearn/openlearn-frontend.git
cd openlearn-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Project Structure Overview

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   ├── layout/          # Layout components (navbar, footer, etc.)
│   ├── features/        # Feature-specific components
│   ├── common/          # Shared utility components
│   └── _deprecated/     # Legacy components (isolated)
├── pages/               # Route-based page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard pages
│   ├── admin/          # Administrative pages
│   ├── public/         # Public pages
│   └── legal/          # Legal pages
├── utils/               # Utility functions and services
│   ├── api/            # API service layer
│   ├── auth/           # Authentication utilities
│   ├── social/         # Social media integrations
│   └── helpers/        # General helper functions
├── context/             # React context providers
├── hooks/               # Custom React hooks
└── data/               # Static data and configurations
```

## Platform Architecture

### Learning Hierarchy

OpenLearn organizes learning content in a structured hierarchy:

```
Cohorts (Groups of learners)
├── Leagues (Subject areas: ML, CP, Finance, etc.)
    ├── Weeks (Weekly learning modules)
        ├── Sections (Topic divisions within weeks)
            └── Resources (Videos, articles, assignments)
```

### User Progression System

The platform features a 5-tier user progression system:

1. **Pioneer** (Entry level) - New learners starting their journey
2. **Luminary** (Level 2) - Active participants showing engagement
3. **Pathfinder** (Level 3) - Consistent learners with demonstrated progress
4. **Chief Pathfinder** (Level 4) - Advanced learners with leadership qualities
5. **Grand Pathfinder** (Level 5) - Expert level with mentoring capabilities

### Core Features

- **Cohort Management**: Group-based learning with peer interaction
- **League System**: Subject-specific learning tracks
- **Progress Tracking**: Comprehensive learning analytics
- **Assignment System**: Interactive tasks and assessments
- **Badge System**: Achievement recognition and gamification
- **Social Features**: Community interaction and collaboration
- **Admin Dashboard**: Content and user management tools

## Key Technologies

### Frontend Stack

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Modern icon library

### State Management

- **React Context**: Global state management
- **Custom Hooks**: Reusable stateful logic
- **Local Storage**: Persistent client-side data

### API Integration

- **RESTful APIs**: Standard HTTP API communication
- **JWT Authentication**: Token-based security
- **Social Media APIs**: Twitter integration for community features

## Development Workflow

### Code Organization

**Component Structure:**
```javascript
// Example component structure
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

const FeatureComponent = ({ data, onAction }) => {
  // Component logic here
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      {/* Component JSX */}
    </motion.div>
  );
};

export default FeatureComponent;
```

**API Service Pattern:**
```javascript
// Example API service
import { apiClient } from './apiClient';

export const userService = {
  async getCurrentUser() {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
  
  async updateProfile(profileData) {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  }
};
```

### Authentication Flow

**User Authentication Process:**
1. User logs in with credentials
2. Server validates and returns JWT token
3. Token stored in localStorage
4. Token included in subsequent API requests
5. Role-based access control enforced

**Protected Routes:**
```javascript
// Protected route example
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## API Overview

### Authentication Endpoints

```
POST /auth/login          # User login
POST /auth/register       # User registration  
POST /auth/logout         # User logout
GET  /auth/profile        # Get user profile
PUT  /auth/profile        # Update user profile
```

### Learning Management Endpoints

```
GET  /cohorts             # List user's cohorts
GET  /cohorts/:id         # Get cohort details
GET  /leagues             # List available leagues
GET  /leagues/:id/weeks   # Get weeks in a league
GET  /weeks/:id/sections  # Get sections in a week
GET  /resources/:id       # Get resource content
```

### Progress Tracking Endpoints

```
GET  /progress/user/:id   # Get user progress
POST /progress/update     # Update progress
GET  /progress/badges     # Get user badges
POST /assignments/submit  # Submit assignment
GET  /assignments/grades  # Get assignment grades
```

## Environment Setup

### Development Environment

Create a `.env.development` file:
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_TWITTER_API_KEY=your_dev_twitter_key
VITE_TWITTER_API_KEY_SECRET=your_dev_twitter_secret
VITE_TWITTER_BEARER_TOKEN=your_dev_bearer_token
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:debug        # Start with debugging enabled

# Building  
npm run build            # Production build
npm run build:staging    # Staging build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Security
npm run security:audit   # Security vulnerability scan
```

## Common Development Tasks

### Adding a New Page

1. Create page component in appropriate `src/pages/` subdirectory
2. Add route in main router configuration
3. Update navigation if needed
4. Implement authentication/authorization if required

### Creating a New Component

1. Determine appropriate location (`ui/`, `features/`, `common/`)
2. Create component file with proper naming convention
3. Export from appropriate `index.js` barrel file
4. Add to documentation if reusable

### Integrating New API Endpoint

1. Add service function in appropriate `src/utils/api/` file
2. Create custom hook if needed for React integration
3. Update TypeScript types if applicable
4. Add error handling and loading states

### Adding New Feature Flag

1. Add flag to `src/utils/featureFlags.js`
2. Set values for each environment
3. Use `isFeatureEnabled()` in components
4. Document feature and rollout plan

## Best Practices

### Component Development

- Use functional components with hooks
- Implement proper prop validation
- Follow single responsibility principle
- Use composition over inheritance
- Implement proper error boundaries

### State Management

- Use React Context for global state
- Keep local state close to where it's used
- Implement proper loading and error states
- Use custom hooks for reusable stateful logic

### Performance

- Implement lazy loading for large components
- Use React.memo for expensive re-renders
- Optimize bundle sizes with code splitting
- Implement proper image optimization

### Security

- Validate all user inputs
- Implement proper authentication checks
- Use HTTPS in production
- Follow security best practices for JWT handling
- Regular security audits and updates

This getting started guide provides the foundation for understanding and contributing to the OpenLearn platform. For detailed technical information, refer to the specific documentation sections for architecture, API, and development standards.
