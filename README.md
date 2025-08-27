<img width="3000" height="1000" alt="openlearnV2" src="https://github.com/user-attachments/assets/1cbb20e2-1345-4600-8d10-df4c6913a3eb" />


# OpenLearn Platform

A comprehensive learning management system designed for skill-based cohort learning with role-based progression and collaborative learning experiences.

## Platform Overview

OpenLearn is a modern learning platform that combines structured learning paths (Leagues) with cohort-based progression, gamification elements, and role-based access control. The platform facilitates collaborative learning through organized cohorts, specialization tracks, and progressive skill development.

## Core Architecture

### Technology Stack

- **Frontend**: React 19 with functional components and hooks
- **Build System**: Vite 6.3.5 with optimized bundling and HMR
- **Styling**: Tailwind CSS 4.1.8 with custom component system
- **Routing**: React Router DOM 7.6.2 with protected routes
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion 12.18.1
- **Development**: ESLint 9.25.0 with modern configuration

### Project Structure

```
src/
├── components/           # Organized component library
│   ├── common/          # Shared utilities (6 components)
│   ├── features/        # Domain-specific components
│   │   ├── admin/       # Administrative functionality
│   │   ├── authentication/ # Auth flows and protection
│   │   ├── dashboard/   # Learning dashboard components
│   │   └── landing/     # Public-facing components
│   ├── layout/          # Application layouts (4 components)
│   ├── ui/             # Base UI components (6 components)
│   └── _deprecated/    # Legacy components (isolated)
├── context/            # React context providers
├── data/              # Static data and configuration
├── hooks/             # Custom React hooks
├── pages/             # Route components
│   ├── admin/         # Admin interface pages
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # User dashboard pages
│   ├── legal/         # Legal documentation
│   └── public/        # Public pages
└── utils/             # Organized utility services
    ├── api/           # API service layer (7 services)
    ├── auth/          # Authentication utilities (3 services)
    ├── helpers/       # General utilities (5 helpers)
    └── social/        # Social media integration (2 services)
```

## Business Logic

### Learning Model

**Hierarchical Content Structure:**
- **Cohorts**: Time-bound learning groups with defined start/end dates
- **Leagues**: Skill-based learning tracks (Finance, ML, Quantum Computing, etc.)
- **Weeks**: Structured learning periods within leagues
- **Sections**: Topical learning units within weeks
- **Resources**: Individual learning materials (videos, articles, exercises)

**User Progression System:**
- **Pioneer**: Basic learner access
- **Luminary**: Advanced learner with additional privileges
- **Pathfinder**: Content management for weeks, sections, resources
- **Chief Pathfinder**: League and assignment management
- **Grand Pathfinder**: Full administrative access

### Key Features

**Learning Management:**
- Cohort-based enrollment with league specialization
- Progress tracking at resource and section levels
- Assignment submission and evaluation system
- Badge system for achievement recognition
- Leaderboards for competitive learning

**Administrative Systems:**
- Role-based content management
- User approval and role assignment workflows
- League assignment to pathfinders with permissions
- Comprehensive analytics and progress monitoring
- Assignment creation and submission management

**Social Features:**
- Progress sharing on social platforms
- Community engagement through events
- Team profiles and facilitator information
- Twitter integration for updates and engagement

## Technical Implementation

### State Management

- **Context-based**: AuthContext for global authentication state
- **Component-level**: useState and useReducer for local state
- **Optimization**: useCallback and useMemo for performance
- **Search**: Dedicated SearchContext for global search functionality

### API Architecture

**Service Layer Pattern:**
- **AdminService**: Comprehensive admin operations (1000+ lines)
- **ProgressService**: Learning progress and enrollment management
- **DataService**: Core data fetching and caching
- **OptimizedDashboardService**: Performance-optimized dashboard data
- **BadgeService**: Achievement and badge management
- **ResourceProgressService**: Detailed resource tracking
- **GitHubService**: Repository integration for assignments

**Authentication Flow:**
- JWT-based with access and refresh tokens
- Role-based route protection
- Automatic token refresh with fallback handling
- Migration system for user data updates

### Performance Optimizations

**Build Configuration:**
- Manual chunk splitting for vendor libraries
- Optimized bundle sizes with 1000kb warning threshold
- ES2015 target with esbuild minification
- Separate chunks for React, UI libraries, and utilities

**Runtime Optimizations:**
- Progressive data loading for dashboard
- Background resource calculation with user feedback
- Memoized components for expensive operations
- Optimized re-renders with dependency arrays

## Development Guidelines

### Code Organization

**Component Architecture:**
- Functional components with hooks pattern
- Props validation and TypeScript interfaces
- Barrel exports for clean import statements
- Separation of concerns with specialized directories

**API Service Pattern:**
- Centralized error handling with consistent responses
- Authorization headers with token management
- RESTful endpoint organization
- Promise-based with async/await syntax

**State Management:**
- Context for global state (auth, search)
- Local state for component-specific data
- Custom hooks for reusable stateful logic
- Performance optimization with React.memo and callbacks

### Security Implementation

**Authentication:**
- JWT token storage in localStorage
- Automatic token refresh mechanism
- Protected routes with role-based access
- Secure logout with token cleanup

**Authorization:**
- Role-based component rendering
- API endpoint protection with auth headers
- Admin function access control
- User permission validation

## Deployment Architecture

### Build System

**Vite Configuration:**
```javascript
// Optimized for production with manual chunks
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['lucide-react', 'react-icons', 'framer-motion'],
  'utils': ['./src/utils/api/dataService.js', './src/utils/api/progressService.js']
}
```

**Environment Configuration:**
- `VITE_API_BASE_URL`: Backend API endpoint
- Twitter API credentials for social integration
- Environment-specific configuration management

**Deployment Requirements:**
- Node.js 18.0.0+ for build process
- Modern browser support (ES2015+)
- CDN-compatible static asset serving
- Environment variable configuration

### Performance Metrics

- **Build Size**: Optimized chunks under 1000kb warning threshold
- **Load Time**: Progressive loading with immediate UI feedback
- **Bundle Analysis**: Separate vendor and utility chunks
- **Lighthouse Optimization**: Configured lighthouse CI for performance monitoring

## API Integration

### Backend Requirements

**Authentication Endpoints:**
- `POST /api/login` - User authentication
- `POST /api/logout` - Session termination
- `GET /api/profile` - User profile retrieval
- `POST /api/refresh` - Token refresh

**Learning Management:**
- `GET /api/leagues` - Available learning tracks
- `POST /api/enroll` - Cohort enrollment
- `GET /api/progress` - Learning progress tracking
- `GET /api/resources` - Learning materials
- `POST /api/assignments/submit` - Assignment submission

**Administrative Operations:**
- `GET /api/admin/users` - User management
- `POST /api/admin/approve-user` - User approval
- `PUT /api/admin/update-role` - Role management
- `POST /api/admin/assign-leagues` - League assignments

### Data Models

**User Model:**
```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'PIONEER' | 'LUMINARY' | 'PATHFINDER' | 'CHIEF_PATHFINDER' | 'GRAND_PATHFINDER',
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED',
  enrollments: Array<Enrollment>,
  createdAt: Date,
  updatedAt: Date
}
```

**Learning Progress Model:**
```javascript
{
  userId: string,
  leagueId: string,
  cohortId: string,
  progressPercentage: number,
  completedSections: number,
  totalSections: number,
  enrolledAt: Date,
  lastActivityAt: Date
}
```

## Quality Assurance

### Code Quality

**ESLint Configuration:**
- React hooks validation
- Modern JavaScript standards
- Import/export consistency
- Code style enforcement

**Build Validation:**
- Type checking with TypeScript interfaces
- Dependency security auditing
- Bundle size monitoring
- Performance lighthouse testing

### Testing Strategy

**Component Testing:**
- React component unit tests
- Hook testing with React Testing Library
- Integration tests for user flows
- API service testing with mocks

**Performance Testing:**
- Lighthouse CI integration
- Bundle analyzer for optimization
- Load testing for API endpoints
- User experience metrics

## Maintenance and Operations

### Development Workflow

**Scripts:**
```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "lint": "eslint .",               // Code quality check
  "lint:fix": "eslint . --fix",     // Auto-fix linting issues
  "preview": "vite preview",        // Preview production build
  "ci": "npm ci && npm run lint && npm run build"  // CI pipeline
}
```

**Dependency Management:**
- Regular security audits with `npm audit`
- Dependency updates with `npm-check-updates`
- Clean builds with cache clearing
- Version pinning for stability

### Monitoring and Analytics

**Performance Monitoring:**
- Build time tracking
- Bundle size analysis
- Runtime performance metrics
- User engagement analytics

**Error Tracking:**
- Console error monitoring
- API failure tracking
- User experience issue detection
- Performance regression alerts

## Support and Documentation

### Developer Resources

**Getting Started:**
1. Clone repository and install dependencies
2. Configure environment variables
3. Run development server with `npm run dev`
4. Access development environment at localhost

**Contributing Guidelines:**
- Follow ESLint configuration for code style
- Implement proper error handling in all API calls
- Add TypeScript interfaces for new data models
- Test components and API integrations thoroughly

**Architecture Decisions:**
- Component organization by domain and purpose
- Service layer pattern for API communication
- Context-based state management for global state
- Progressive loading for optimal user experience

This documentation provides a comprehensive foundation for understanding, developing, and maintaining the OpenLearn platform.
