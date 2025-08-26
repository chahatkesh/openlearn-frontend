# System Architecture

## Overview

OpenLearn implements a modern single-page application (SPA) architecture with a clear separation of concerns, modular component organization, and optimized performance patterns.

## Frontend Architecture

### Component Hierarchy

```
Application Layer
├── App.jsx (Root routing and providers)
├── Layout Components
│   ├── DashboardLayout (Protected user interface)
│   ├── AdminLayout (Administrative interface)
│   ├── Navbar (Global navigation)
│   └── Footer (Site footer)
├── Feature Components
│   ├── Authentication (Login, signup, protection)
│   ├── Dashboard (Learning progress, leagues)
│   ├── Admin (User management, content creation)
│   └── Landing (Public marketing pages)
├── UI Components
│   ├── LoadingScreen, LoadingSpinner
│   ├── ModalPortal, OTPInput
│   ├── ProgressIndicator, SkeletonLoader
│   └── Base interactive components
└── Common Components
    ├── HeroSection, SectionHeader
    ├── MotionWrapper, PageHead
    ├── ResourceLoadingIndicator
    └── ScrollToTop
```

### State Management Architecture

**Global State (React Context):**
- **AuthContext**: User authentication, role management, session handling
- **SearchContext**: Global search functionality across the platform

**Local State Patterns:**
- Component-level useState for UI state
- useReducer for complex state logic
- Custom hooks for reusable stateful logic
- Memoization with useMemo and useCallback for performance

### Service Layer Architecture

```
API Service Layer
├── AdminService (User, content, role management)
├── ProgressService (Learning progress, enrollments)
├── DataService (Core data fetching, caching)
├── OptimizedDashboardService (Performance-optimized data loading)
├── BadgeService (Achievement system)
├── ResourceProgressService (Detailed progress tracking)
└── GitHubService (Repository integration)

Authentication Services
├── EmailVerificationService
├── MigrationService
└── PasswordResetService

Utility Services
├── SocialService (Social media sharing)
├── GitHubService (Repository integration)
└── Helper utilities (formatting, validation)
```

## Data Flow Architecture

### Authentication Flow

```
1. User Login Request
   ├── Form submission to AuthContext
   ├── API call to /api/login
   ├── JWT token storage (access + refresh)
   ├── User profile fetch
   └── Global state update

2. Protected Route Access
   ├── Route guard checks authentication
   ├── Token validation with backend
   ├── Role-based access control
   └── Redirect handling (login/unauthorized)

3. Token Refresh Flow
   ├── Automatic refresh on expiration
   ├── Background token renewal
   ├── Graceful fallback on failure
   └── Session cleanup on logout
```

### Learning Progress Flow

```
1. Dashboard Data Loading
   ├── Initial data fetch (enrollments, leagues)
   ├── Progressive loading with UI feedback
   ├── Background resource calculation
   └── Real-time progress updates

2. Progress Tracking
   ├── Resource completion events
   ├── Section progress calculation
   ├── League progress aggregation
   └── Badge achievement evaluation

3. Enrollment Process
   ├── Cohort selection
   ├── League enrollment
   ├── Progress initialization
   └── Dashboard refresh
```

## Performance Architecture

### Loading Optimization

**Progressive Loading Strategy:**
1. **Initial Load**: Essential user data and navigation
2. **Secondary Load**: Dashboard statistics and basic league info
3. **Background Load**: Detailed resource progress and calculations
4. **On-Demand Load**: League-specific content and assignments

**Caching Strategy:**
- Browser localStorage for user session data
- Component-level state caching for recently accessed data
- API response caching with OptimizedDashboardService
- Static asset caching through Vite build optimization

### Build Optimization

**Code Splitting:**
```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['lucide-react', 'react-icons', 'framer-motion'],
  'utils': ['./src/utils/api/dataService.js', './src/utils/api/progressService.js']
}
```

**Bundle Optimization:**
- Vendor libraries separated for better caching
- Utility functions bundled separately
- Tree shaking for unused code elimination
- ES2015 target with esbuild minification

## Security Architecture

### Authentication Security

**Token Management:**
- JWT access tokens (short-lived)
- Refresh tokens (longer-lived)
- Secure storage in localStorage
- Automatic cleanup on logout/expiration

**Route Protection:**
```javascript
// Role-based route protection
<Route element={<ProtectedRoute requiredRoles={['ADMIN', 'PATHFINDER']} />}>
  <Route path="/admin" element={<AdminLayout />} />
</Route>
```

### Authorization Levels

**User Roles and Permissions:**
```
PIONEER
├── Basic learning access
├── Progress tracking
├── League enrollment
└── Profile management

LUMINARY
├── All Pioneer permissions
├── Advanced learning features
├── Badge achievements
└── Social sharing

PATHFINDER
├── All Luminary permissions
├── Content management (weeks, sections, resources)
├── Basic administrative functions
└── Progress analytics

CHIEF_PATHFINDER
├── All Pathfinder permissions
├── League management
├── Assignment creation/management
├── User progress oversight
└── Advanced analytics

GRAND_PATHFINDER
├── All Chief Pathfinder permissions
├── User management and approval
├── Role assignment
├── System configuration
└── Full administrative access
```

## Integration Architecture

### External Service Integration

**Social Media Integration:**
- Twitter API for content sharing
- LinkedIn sharing capabilities
- WhatsApp integration for community
- Social progress sharing functionality

**Development Tool Integration:**
- GitHub repository integration for assignments
- Code submission and review workflows
- Project-based learning support

### API Integration Patterns

**RESTful API Communication:**
```javascript
// Standardized API service pattern
class APIService {
  static async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options
    });
    return handleResponse(response);
  }
}
```

**Error Handling Strategy:**
- Centralized error handling in service layer
- User-friendly error messages
- Automatic retry for transient failures
- Graceful degradation for optional features

## Scalability Architecture

### Component Scalability

**Modular Design:**
- Feature-based component organization
- Reusable UI component library
- Consistent prop interfaces
- Standardized error boundaries

**State Scalability:**
- Context providers for global state
- Local state for component-specific data
- Custom hooks for reusable logic
- Performance optimization with memoization

### Data Scalability

**Efficient Data Loading:**
- Pagination for large datasets
- Background loading for non-critical data
- Progressive enhancement for better UX
- Optimistic updates for immediate feedback

**Performance Monitoring:**
- Bundle size tracking
- Runtime performance metrics
- User experience monitoring
- API response time tracking

## Deployment Architecture

### Build Process

```
Development → Staging → Production
├── ESLint validation
├── TypeScript checking
├── Unit test execution
├── Integration test suite
├── Performance benchmarking
├── Security scanning
└── Production bundle creation
```

### Environment Configuration

**Environment Variables:**
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_TWITTER_*`: Social media API credentials
- Environment-specific feature flags
- Debug and logging configurations

**Deployment Targets:**
- Static file hosting (Vercel, Netlify)
- CDN distribution for global performance
- Progressive Web App capabilities
- Mobile-responsive design standards

This architecture supports the OpenLearn platform's requirements for scalability, maintainability, and performance while providing a solid foundation for future enhancements and feature additions.
