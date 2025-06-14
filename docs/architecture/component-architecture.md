# Component Architecture

## 🏗️ Component Structure Overview

The OpenLearn platform follows a hierarchical component architecture that promotes reusability, maintainability, and clear separation of concerns.

## 📁 Component Organization

```
src/components/
├── admin/           # Administrative components
├── auth/            # Authentication components  
├── common/          # Shared utility components
├── dashboard/       # User dashboard components
└── landingPage/     # Public landing page components
```

## 🎯 Component Categories

### 1. Landing Page Components

#### **Hero.jsx**
- Main landing page banner
- Hackathon announcement badge
- Cohort enrollment CTAs
- Responsive design with animations

```jsx
<Hero />
├── HackathonBadge (conditional)
├── CohortEnrollmentBadge
├── MainHeading
└── CTAButtons
```

#### **Cohort.jsx**
- Interactive league selection
- Gradient card designs
- Floating animations
- Enrollment functionality

```jsx
<Cohort />
└── LeagueCard[]
    ├── LeagueInfo
    ├── EnrollmentButton
    └── AnimatedBackground
```

#### **Team.jsx**
- Team member showcase
- Role-based styling
- Special Grand Pathfinder layout
- Social media integration

```jsx
<Team />
└── TeamMemberCard[]
    ├── ProfileImage
    ├── RoleIndicator
    ├── SocialLinks
    └── ConditionalLayout (horizontal for Grand Pathfinder)
```

### 2. Dashboard Components

#### **LearningProgressSection.jsx**
- Conditional enrollment-based display
- Progress overview cards
- Achievement tracking
- Performance analytics

```jsx
<LearningProgressSection />
├── EnrollmentCheck (conditional wrapper)
├── ProgressCard[]
├── BadgeDisplay[]
└── AnalyticsOverview
```

#### **ProgressCard.jsx**
- Individual league progress
- Visual progress indicators
- Social sharing capabilities
- Completion status tracking

```jsx
<ProgressCard />
├── ProgressBar
├── CompletionStats
├── ShareButton
└── StatusIndicator
```

#### **Badge.jsx**
- Achievement display
- Social sharing integration
- Multiple size variants
- Earned date tracking

```jsx
<Badge />
├── BadgeIcon
├── BadgeDetails
├── EarnedDate
└── ShareButton
```

### 3. Authentication Components

#### **ProtectedRoute.jsx**
- Role-based access control
- Authentication verification
- Unauthorized access handling
- Loading state management

```jsx
<ProtectedRoute />
├── AuthenticationCheck
├── RoleVerification
├── UnauthorizedDisplay
└── LoadingScreen
```

#### **AuthLayout.jsx**
- Consistent auth page styling
- Form containers
- Error message display
- Responsive design

### 4. Admin Components

#### **UserManagement.jsx**
- User role assignment
- Status management
- Bulk operations
- Filter and search functionality

```jsx
<UserManagement />
├── UserFilters
├── UserTable
├── RoleSelector[]
└── StatusControls[]
```

#### **ContentManagement Components**
- CRUD operations for all content types
- Form validation
- Bulk operations
- Preview functionality

### 5. Common Components

#### **LoadingScreen.jsx**
- Consistent loading states
- Customizable messages
- Animated indicators
- Global loading overlay

#### **LoadingSpinner.jsx**
- Inline loading indicators
- Multiple size variants
- Color customization
- Animation options

## 🎨 Design Patterns

### 1. Container/Presentational Pattern
```jsx
// Container Component (Logic)
const UserContainer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ... business logic
  
  return <UserList users={users} loading={loading} />;
};

// Presentational Component (UI)
const UserList = ({ users, loading }) => {
  if (loading) return <LoadingSpinner />;
  return users.map(user => <UserCard key={user.id} user={user} />);
};
```

### 2. Compound Component Pattern
```jsx
// Badge component with sub-components
<Badge badge={badgeData} size="lg">
  <Badge.Icon />
  <Badge.Details />
  <Badge.ShareButton />
</Badge>
```

### 3. Render Props Pattern
```jsx
// Authentication wrapper
<AuthProvider>
  {({ user, isAuthenticated }) => (
    isAuthenticated ? <Dashboard user={user} /> : <LoginPage />
  )}
</AuthProvider>
```

## 🔧 Component Guidelines

### 1. Props Design
```jsx
// Good: Explicit and typed props
const UserCard = ({ 
  user,
  size = 'md',
  showActions = true,
  onClick = null,
  className = ''
}) => {
  // Component implementation
};
```

### 2. State Management
```jsx
// Local state for component-specific data
const [isExpanded, setIsExpanded] = useState(false);

// Context for global state
const { user, login, logout } = useAuth();

// Service layer for API calls
const data = await UserService.getProfile();
```

### 3. Event Handling
```jsx
// Event delegation and prevention
const handleCardClick = (e) => {
  e.stopPropagation();
  onClick?.(user);
};

// Keyboard accessibility
const handleKeyPress = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleCardClick(e);
  }
};
```

### 4. Conditional Rendering
```jsx
// Guard clauses for early returns
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState />;

// Conditional JSX rendering
{user?.role === 'GRAND_PATHFINDER' && (
  <AdminControls />
)}

// Ternary for simple conditions
{isEnrolled ? <ProgressView /> : <EnrollmentPrompt />}
```

## 📱 Responsive Design Patterns

### 1. Mobile-First Approach
```jsx
// Tailwind classes for responsive design
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* Content */}
</div>
```

### 2. Adaptive Layouts
```jsx
// Component adapts based on screen size
const TeamMemberCard = ({ level }) => {
  if (level === 'grand') {
    return (
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Horizontal layout on desktop, vertical on mobile */}
      </div>
    );
  }
  // Regular vertical layout
};
```

## 🎭 Animation Patterns

### 1. CSS Animations
```css
/* Floating animation for backgrounds */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

.floating-blob {
  animation: float 6s ease-in-out infinite;
}
```

### 2. Transition Classes
```jsx
// Smooth transitions for interactive elements
<div className="
  transform transition-all duration-300 ease-out
  hover:scale-105 hover:shadow-lg
  focus:ring-2 focus:ring-[#FFDE59]
">
```

## 🔄 Data Flow Patterns

### 1. Props Down, Events Up
```jsx
// Parent manages state, children trigger changes
const Dashboard = () => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  
  return (
    <div>
      <LeagueList onSelect={setSelectedLeague} />
      {selectedLeague && (
        <LeagueDetails league={selectedLeague} />
      )}
    </div>
  );
};
```

### 2. Service Layer Integration
```jsx
// Components use service layer for API calls
const useUserData = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (error) {
        // Handle error
      }
    };
    
    fetchUsers();
  }, []);
  
  return { users };
};
```

## 🛠️ Utility Services

### Favicon Service
- **Location**: `src/utils/faviconService.js`
- **Purpose**: Fetches and caches website favicons for resource display
- **Features**: Multi-source fetching, intelligent caching, fallback icons
- **Integration**: LeagueDetailPage resources table
- **Documentation**: [Favicon Service Guide](../development/favicon-service.md)

```jsx
// Usage in components
const ResourceIcon = ({ resource }) => {
  const [faviconData, setFaviconData] = useState(null);
  
  useEffect(() => {
    FaviconService.getResourceIcon(resource.url, resource.type)
      .then(setFaviconData);
  }, [resource]);
  
  return faviconData?.type === 'favicon' 
    ? <img src={faviconData.url} alt="favicon" />
    : <TypeIcon type={resource.type} />;
};
```

This component architecture ensures scalability, maintainability, and consistent user experience across the OpenLearn platform.
