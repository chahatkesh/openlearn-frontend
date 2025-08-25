# API Data Models

Complete reference for data structures and schemas used in OpenLearn Frontend APIs.

## User Models

### User Object
```typescript
interface User {
  id: string;                    // Unique user identifier
  name: string;                  // Full name
  email: string;                 // Email address
  role: UserRole;                // User role (see UserRole enum)
  status: UserStatus;            // Account status (see UserStatus enum)
  createdAt: string;             // ISO 8601 date string
  lastLoginAt?: string;          // ISO 8601 date string (optional)
  profilePicture?: string;       // Profile image URL (optional)
  enrollments?: Enrollment[];    // User enrollments (optional)
  badges?: Badge[];              // Earned badges (optional)
}
```

### User Role Enum
```typescript
enum UserRole {
  PIONEER = 'PIONEER',                    // Basic user role
  LUMINARY = 'LUMINARY',                  // Advanced user
  PATHFINDER = 'PATHFINDER',              // Expert user
  CHIEF_PATHFINDER = 'CHIEF_PATHFINDER',  // Senior expert
  GRAND_PATHFINDER = 'GRAND_PATHFINDER',  // Highest user role
  ADMIN = 'ADMIN'                         // Administrator
}
```

### User Status Enum
```typescript
enum UserStatus {
  PENDING = 'PENDING',          // Awaiting approval
  ACTIVE = 'ACTIVE',            // Active account
  SUSPENDED = 'SUSPENDED',      // Temporarily suspended
  INACTIVE = 'INACTIVE'         // Deactivated account
}
```

## Learning Content Models

### Cohort Object
```typescript
interface Cohort {
  id: string;                   // Unique cohort identifier
  name: string;                 // Cohort name
  description: string;          // Cohort description
  startDate: string;            // ISO 8601 date string
  endDate?: string;             // ISO 8601 date string (optional)
  isActive: boolean;            // Whether cohort is active
  enrollmentCount?: number;     // Number of enrolled users
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### League Object
```typescript
interface League {
  id: string;                   // Unique league identifier
  name: string;                 // League name
  title: string;                // Display title
  description: string;          // League description
  cover: string;                // Cover image URL
  color: string;                // Theme color (hex)
  startingDate: string;         // Starting date
  facilitatedBy: string;        // Facilitator name
  isActive: boolean;            // Whether league is active
  weekCount?: number;           // Number of weeks
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### Week Object
```typescript
interface Week {
  id: string;                   // Unique week identifier
  leagueId: string;             // Associated league ID
  name: string;                 // Week name
  title: string;                // Display title
  description: string;          // Week description
  weekNumber: number;           // Week sequence number
  startDate: string;            // ISO 8601 date string
  endDate: string;              // ISO 8601 date string
  isActive: boolean;            // Whether week is active
  sectionCount?: number;        // Number of sections
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### Section Object
```typescript
interface Section {
  id: string;                   // Unique section identifier
  weekId: string;               // Associated week ID
  name: string;                 // Section name
  title: string;                // Display title
  description: string;          // Section description
  sectionNumber: number;        // Section sequence number
  isActive: boolean;            // Whether section is active
  resourceCount?: number;       // Number of resources
  estimatedDuration?: number;   // Estimated completion time (minutes)
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### Resource Object
```typescript
interface Resource {
  id: string;                   // Unique resource identifier
  sectionId: string;            // Associated section ID
  name: string;                 // Resource name
  title: string;                // Display title
  description: string;          // Resource description
  type: ResourceType;           // Resource type (see ResourceType enum)
  url?: string;                 // Resource URL (optional)
  content?: string;             // Text content (optional)
  resourceNumber: number;       // Resource sequence number
  isRequired: boolean;          // Whether resource is required
  estimatedDuration?: number;   // Estimated time (minutes)
  metadata?: ResourceMetadata;  // Additional metadata (optional)
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### Resource Type Enum
```typescript
enum ResourceType {
  VIDEO = 'VIDEO',              // Video content
  ARTICLE = 'ARTICLE',          // Text article
  EXERCISE = 'EXERCISE',        // Practice exercise
  ASSIGNMENT = 'ASSIGNMENT',    // Graded assignment
  QUIZ = 'QUIZ',                // Quiz or test
  DOCUMENT = 'DOCUMENT',        // PDF or document
  EXTERNAL_LINK = 'EXTERNAL_LINK' // External resource
}
```

### Resource Metadata Object
```typescript
interface ResourceMetadata {
  videoLength?: number;         // Video duration (seconds)
  wordCount?: number;           // Article word count
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags?: string[];              // Resource tags
  prerequisites?: string[];     // Required prior knowledge
  downloadUrl?: string;         // Download link
}
```

## Progress Tracking Models

### Enrollment Object
```typescript
interface Enrollment {
  id: string;                   // Unique enrollment identifier
  userId: string;               // Associated user ID
  cohortId: string;             // Associated cohort ID
  leagueId: string;             // Associated league ID
  enrolledAt: string;           // ISO 8601 date string
  status: EnrollmentStatus;     // Enrollment status
  progress?: ProgressSummary;   // Progress summary (optional)
}
```

### Enrollment Status Enum
```typescript
enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',        // Actively enrolled
  COMPLETED = 'COMPLETED',      // Successfully completed
  DROPPED = 'DROPPED',          // Dropped out
  SUSPENDED = 'SUSPENDED'       // Temporarily suspended
}
```

### Progress Summary Object
```typescript
interface ProgressSummary {
  totalResources: number;       // Total resources in league
  completedResources: number;   // Resources completed
  completionPercentage: number; // Completion percentage (0-100)
  lastActivityAt?: string;      // ISO 8601 date string (optional)
  estimatedCompletion?: string; // Estimated completion date
  weekProgress: WeekProgress[]; // Progress by week
}
```

### Week Progress Object
```typescript
interface WeekProgress {
  weekId: string;               // Week identifier
  weekNumber: number;           // Week sequence number
  totalSections: number;        // Total sections in week
  completedSections: number;    // Sections completed
  completionPercentage: number; // Week completion percentage
  startedAt?: string;           // ISO 8601 date string (optional)
  completedAt?: string;         // ISO 8601 date string (optional)
}
```

### Resource Progress Object
```typescript
interface ResourceProgress {
  id: string;                   // Unique progress identifier
  userId: string;               // Associated user ID
  resourceId: string;           // Associated resource ID
  status: ProgressStatus;       // Progress status
  startedAt?: string;           // ISO 8601 date string (optional)
  completedAt?: string;         // ISO 8601 date string (optional)
  timeSpent?: number;           // Time spent (minutes)
  attempts?: number;            // Number of attempts
  score?: number;               // Score achieved (if applicable)
  notes?: string;               // User notes (optional)
  isStarred?: boolean;          // Marked for revision
}
```

### Progress Status Enum
```typescript
enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',  // Not yet started
  IN_PROGRESS = 'IN_PROGRESS',  // Currently working on
  COMPLETED = 'COMPLETED',      // Successfully completed
  SKIPPED = 'SKIPPED'           // Skipped by user
}
```

## Gamification Models

### Badge Object
```typescript
interface Badge {
  id: string;                   // Unique badge identifier
  name: string;                 // Badge name
  title: string;                // Display title
  description: string;          // Badge description
  icon: string;                 // Badge icon URL
  category: BadgeCategory;      // Badge category
  criteria: BadgeCriteria;      // Earning criteria
  rarity: BadgeRarity;          // Badge rarity level
  isActive: boolean;            // Whether badge is active
  createdAt: string;            // ISO 8601 date string
}
```

### Badge Category Enum
```typescript
enum BadgeCategory {
  COMPLETION = 'COMPLETION',    // Completion badges
  ACHIEVEMENT = 'ACHIEVEMENT',  // Achievement badges
  PARTICIPATION = 'PARTICIPATION', // Participation badges
  MILESTONE = 'MILESTONE',      // Milestone badges
  SPECIAL = 'SPECIAL'           // Special event badges
}
```

### Badge Rarity Enum
```typescript
enum BadgeRarity {
  COMMON = 'COMMON',            // Common badges
  UNCOMMON = 'UNCOMMON',        // Uncommon badges
  RARE = 'RARE',                // Rare badges
  EPIC = 'EPIC',                // Epic badges
  LEGENDARY = 'LEGENDARY'       // Legendary badges
}
```

### Badge Criteria Object
```typescript
interface BadgeCriteria {
  type: 'COMPLETION' | 'STREAK' | 'SCORE' | 'PARTICIPATION' | 'MANUAL';
  threshold?: number;           // Required threshold (optional)
  timeframe?: number;           // Time period (days, optional)
  specificResources?: string[]; // Specific resource IDs (optional)
  conditions?: string[];        // Additional conditions (optional)
}
```

### User Badge Object
```typescript
interface UserBadge {
  id: string;                   // Unique user badge identifier
  userId: string;               // Associated user ID
  badgeId: string;              // Associated badge ID
  earnedAt: string;             // ISO 8601 date string
  awardedBy?: string;           // Awarded by user ID (optional)
  notes?: string;               // Award notes (optional)
  badge: Badge;                 // Badge details
}
```

## Assignment Models

### Assignment Object
```typescript
interface Assignment {
  id: string;                   // Unique assignment identifier
  resourceId: string;           // Associated resource ID
  title: string;                // Assignment title
  description: string;          // Assignment description
  instructions: string;         // Detailed instructions
  dueDate?: string;             // ISO 8601 date string (optional)
  maxScore?: number;            // Maximum possible score
  submissionFormat: SubmissionFormat[]; // Accepted formats
  isRequired: boolean;          // Whether assignment is required
  allowLateSubmission: boolean; // Allow submissions after due date
  maxAttempts?: number;         // Maximum submission attempts
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string
}
```

### Submission Format Enum
```typescript
enum SubmissionFormat {
  TEXT = 'TEXT',                // Text submission
  FILE_UPLOAD = 'FILE_UPLOAD',  // File upload
  URL = 'URL',                  // URL submission
  CODE = 'CODE',                // Code submission
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE' // Multiple choice
}
```

### Submission Object
```typescript
interface Submission {
  id: string;                   // Unique submission identifier
  assignmentId: string;         // Associated assignment ID
  userId: string;               // Associated user ID
  content?: string;             // Text content (optional)
  fileUrl?: string;             // File URL (optional)
  submittedAt: string;          // ISO 8601 date string
  status: SubmissionStatus;     // Submission status
  score?: number;               // Assigned score (optional)
  feedback?: string;            // Instructor feedback (optional)
  gradedAt?: string;            // ISO 8601 date string (optional)
  gradedBy?: string;            // Grader user ID (optional)
  attempt: number;              // Submission attempt number
}
```

### Submission Status Enum
```typescript
enum SubmissionStatus {
  DRAFT = 'DRAFT',              // Draft submission
  SUBMITTED = 'SUBMITTED',      // Submitted for review
  UNDER_REVIEW = 'UNDER_REVIEW', // Being reviewed
  GRADED = 'GRADED',            // Graded and returned
  RETURNED = 'RETURNED'         // Returned for revision
}
```

## API Response Models

### Standard API Response
```typescript
interface ApiResponse<T> {
  success: boolean;             // Request success status
  data?: T;                     // Response data (optional)
  error?: string;               // Error message (optional)
  message?: string;             // Success message (optional)
  timestamp: string;            // ISO 8601 date string
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: boolean;             // Request success status
  data: T[];                    // Array of data items
  pagination: PaginationInfo;   // Pagination information
  error?: string;               // Error message (optional)
  timestamp: string;            // ISO 8601 date string
}
```

### Pagination Info
```typescript
interface PaginationInfo {
  page: number;                 // Current page number
  limit: number;                // Items per page
  total: number;                // Total number of items
  totalPages: number;           // Total number of pages
  hasNext: boolean;             // Whether next page exists
  hasPrev: boolean;             // Whether previous page exists
}
```

## Authentication Models

### Login Request
```typescript
interface LoginRequest {
  email: string;                // User email
  password: string;             // User password
}
```

### Login Response
```typescript
interface LoginResponse {
  accessToken: string;          // JWT access token
  refreshToken: string;         // JWT refresh token
  user: User;                   // User information
}
```

### Token Refresh Request
```typescript
interface TokenRefreshRequest {
  refreshToken: string;         // Valid refresh token
}
```

### Token Refresh Response
```typescript
interface TokenRefreshResponse {
  accessToken: string;          // New JWT access token
  refreshToken: string;         // New JWT refresh token
}
```

This data model reference provides a comprehensive overview of all data structures used throughout the OpenLearn Frontend application. Use these models as a reference when implementing features or integrating with APIs.
