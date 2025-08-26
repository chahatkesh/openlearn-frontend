# Data Models

## User Models

### User Entity

**Core User Model:**
```typescript
interface User {
  id: string;                    // Unique identifier
  email: string;                 // Email address (unique)
  name: string;                  // Full name
  role: UserRole;                // User role in the system
  status: UserStatus;            // Account status
  department?: string;           // Academic department
  bio?: string;                  // User biography
  profileImage?: string;         // Profile image URL
  enrollments: Enrollment[];     // User's league enrollments
  badges: Badge[];               // Earned achievement badges
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
}

type UserRole = 
  | 'PIONEER'           // Basic learner access
  | 'LUMINARY'          // Advanced learner features
  | 'PATHFINDER'        // Content management capabilities
  | 'CHIEF_PATHFINDER'  // League and assignment management
  | 'GRAND_PATHFINDER'; // Full administrative access

type UserStatus = 
  | 'ACTIVE'            // Active account
  | 'PENDING'           // Awaiting approval
  | 'SUSPENDED'         // Temporarily suspended
  | 'INACTIVE';         // Deactivated account
```

**User Profile Extended:**
```typescript
interface UserProfile extends User {
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
  };
  statistics: {
    totalEnrollments: number;
    completedLeagues: number;
    totalBadges: number;
    learningStreak: number;
    lastActiveAt: Date;
  };
}
```

## Learning Models

### League Entity

**League Structure:**
```typescript
interface League {
  id: string;                    // Unique identifier
  name: string;                  // League name (e.g., "Finance", "ML")
  title: string;                 // Display title
  description: string;           // Detailed description
  cover: string;                 // Cover image URL
  color: string;                 // Theme color (hex)
  startingDate: string;          // Start date for cohorts
  facilitatedBy: string;         // Facilitating organization
  weeks: Week[];                 // Associated weeks
  specializations: Specialization[]; // Related specializations
  isActive: boolean;             // Whether league is active
  prerequisites?: string[];      // Required prior knowledge
  estimatedHours: number;        // Expected completion time
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];                // Searchable tags
  createdAt: Date;
  updatedAt: Date;
}
```

### Week Entity

**Week Structure:**
```typescript
interface Week {
  id: string;                    // Unique identifier
  leagueId: string;              // Parent league ID
  name: string;                  // Week name
  description: string;           // Week description
  order: number;                 // Week sequence order
  sections: Section[];           // Week sections
  isPublished: boolean;          // Publication status
  startDate?: Date;              // Optional start date
  endDate?: Date;                // Optional end date
  objectives: string[];          // Learning objectives
  estimatedHours: number;        // Expected completion time
  createdAt: Date;
  updatedAt: Date;
}
```

### Section Entity

**Section Structure:**
```typescript
interface Section {
  id: string;                    // Unique identifier
  weekId: string;                // Parent week ID
  name: string;                  // Section name
  description: string;           // Section description
  order: number;                 // Section sequence order
  resources: Resource[];         // Section resources
  isRequired: boolean;           // Whether section is mandatory
  estimatedMinutes: number;      // Expected completion time
  prerequisites?: string[];      // Required prior sections
  createdAt: Date;
  updatedAt: Date;
}
```

### Resource Entity

**Resource Structure:**
```typescript
interface Resource {
  id: string;                    // Unique identifier
  sectionId: string;             // Parent section ID
  name: string;                  // Resource name
  description?: string;          // Resource description
  type: ResourceType;            // Type of resource
  url: string;                   // Resource URL or content
  order: number;                 // Resource sequence order
  isRequired: boolean;           // Whether resource is mandatory
  estimatedMinutes: number;      // Expected completion time
  metadata?: ResourceMetadata;   // Additional resource data
  createdAt: Date;
  updatedAt: Date;
}

type ResourceType = 
  | 'VIDEO'                      // Video content
  | 'ARTICLE'                    // Text article
  | 'DOCUMENT'                   // PDF or document
  | 'EXERCISE'                   // Interactive exercise
  | 'QUIZ'                       // Assessment quiz
  | 'PROJECT'                    // Hands-on project
  | 'EXTERNAL_LINK';             // External resource

interface ResourceMetadata {
  duration?: number;             // Video duration (seconds)
  fileSize?: number;             // File size (bytes)
  difficulty?: string;           // Resource difficulty
  tags?: string[];               // Resource tags
  author?: string;               // Content author
  thumbnailUrl?: string;         // Preview thumbnail
}
```

## Progress Models

### Enrollment Entity

**Enrollment Structure:**
```typescript
interface Enrollment {
  id: string;                    // Unique identifier
  userId: string;                // Enrolled user ID
  cohortId: string;              // Cohort ID
  leagueId: string;              // League ID
  enrolledAt: Date;              // Enrollment timestamp
  completedAt?: Date;            // Completion timestamp
  progress: ProgressSummary;     // Progress summary
  status: EnrollmentStatus;      // Current status
  notes?: string;                // Personal notes
  createdAt: Date;
  updatedAt: Date;
}

type EnrollmentStatus = 
  | 'ACTIVE'                     // Currently enrolled
  | 'COMPLETED'                  // Successfully completed
  | 'PAUSED'                     // Temporarily paused
  | 'DROPPED';                   // Dropped out

interface ProgressSummary {
  completedSections: number;     // Sections completed
  totalSections: number;         // Total sections in league
  completedResources: number;    // Resources completed
  totalResources: number;        // Total resources in league
  progressPercentage: number;    // Overall completion percentage
  lastActivityAt: Date;          // Last learning activity
  timeSpent: number;             // Total time spent (minutes)
  streak: number;                // Current learning streak (days)
}
```

### Resource Progress

**Resource Progress Tracking:**
```typescript
interface ResourceProgress {
  id: string;                    // Unique identifier
  userId: string;                // User ID
  resourceId: string;            // Resource ID
  isCompleted: boolean;          // Completion status
  completedAt?: Date;            // Completion timestamp
  timeSpent: number;             // Time spent on resource (minutes)
  score?: number;                // Score for assessments (0-100)
  attempts: number;              // Number of attempts
  notes?: string;                // Personal notes
  metadata?: {
    watchProgress?: number;      // Video watch progress (0-1)
    bookmarks?: string[];        // Bookmarked sections
    highlights?: string[];       // Important highlights
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Cohort Models

### Cohort Entity

**Cohort Structure:**
```typescript
interface Cohort {
  id: string;                    // Unique identifier
  name: string;                  // Cohort name
  description: string;           // Cohort description
  startDate: Date;               // Cohort start date
  endDate: Date;                 // Cohort end date
  maxParticipants: number;       // Maximum enrollment
  currentParticipants: number;   // Current enrollment count
  leagues: string[];             // Available league IDs
  status: CohortStatus;          // Current status
  facilitators: string[];        // Facilitator user IDs
  enrollments: Enrollment[];     // Student enrollments
  settings: CohortSettings;      // Cohort configuration
  createdAt: Date;
  updatedAt: Date;
}

type CohortStatus = 
  | 'UPCOMING'                   // Not yet started
  | 'ACTIVE'                     // Currently running
  | 'COMPLETED'                  // Finished
  | 'CANCELLED';                 // Cancelled

interface CohortSettings {
  allowLateEnrollment: boolean;  // Allow enrollment after start
  autoProgressTracking: boolean; // Automatic progress tracking
  certificateEnabled: boolean;   // Issue completion certificates
  socialFeaturesEnabled: boolean; // Enable social features
  notifications: {
    weeklyReminders: boolean;    // Send weekly progress reminders
    completionCongrats: boolean; // Congratulate on completion
    milestoneAlerts: boolean;    // Alert on milestone achievements
  };
}
```

### Specialization Entity

**Specialization Structure:**
```typescript
interface Specialization {
  id: string;                    // Unique identifier
  name: string;                  // Specialization name
  description: string;           // Detailed description
  leagues: string[];             // Required league IDs
  prerequisites?: string[];      // Required specializations
  estimatedHours: number;        // Total estimated hours
  difficultyLevel: number;       // Difficulty (1-5)
  certificate: {
    available: boolean;          // Certificate available
    templateUrl?: string;        // Certificate template
    requirements: {
      minScorePercentage: number; // Minimum score required
      requiredLeagues: string[];  // Must complete all leagues
      timeLimit?: number;         // Time limit (days)
    };
  };
  isActive: boolean;             // Whether specialization is active
  createdAt: Date;
  updatedAt: Date;
}
```

## Assignment Models

### Assignment Entity

**Assignment Structure:**
```typescript
interface Assignment {
  id: string;                    // Unique identifier
  leagueId: string;              // Associated league ID
  title: string;                 // Assignment title
  description: string;           // Detailed description
  instructions: string;          // Submission instructions
  type: AssignmentType;          // Type of assignment
  maxScore: number;              // Maximum possible score
  dueDate?: Date;                // Optional due date
  requirements: AssignmentRequirements; // Submission requirements
  rubric?: AssignmentRubric;     // Grading rubric
  isPublished: boolean;          // Publication status
  createdBy: string;             // Creator user ID
  submissions: Submission[];     // Student submissions
  createdAt: Date;
  updatedAt: Date;
}

type AssignmentType = 
  | 'PROJECT'                    // Project submission
  | 'ESSAY'                      // Written essay
  | 'CODE'                       // Code submission
  | 'PRESENTATION'               // Presentation
  | 'PORTFOLIO';                 // Portfolio submission

interface AssignmentRequirements {
  submissionFormat: string[];    // Accepted file formats
  maxFileSize: number;           // Maximum file size (MB)
  minWords?: number;             // Minimum word count
  maxWords?: number;             // Maximum word count
  requiresGithubRepo?: boolean;  // Requires GitHub repository
  allowsMultipleFiles: boolean;  // Multiple file submission
}

interface AssignmentRubric {
  criteria: RubricCriterion[];   // Grading criteria
  totalPoints: number;           // Total possible points
}

interface RubricCriterion {
  name: string;                  // Criterion name
  description: string;           // Criterion description
  maxPoints: number;             // Maximum points for criterion
  levels: RubricLevel[];         // Performance levels
}

interface RubricLevel {
  name: string;                  // Level name (e.g., "Excellent")
  description: string;           // Level description
  points: number;                // Points for this level
}
```

### Submission Entity

**Submission Structure:**
```typescript
interface Submission {
  id: string;                    // Unique identifier
  assignmentId: string;          // Assignment ID
  userId: string;                // Submitter user ID
  content: SubmissionContent;    // Submission content
  status: SubmissionStatus;      // Current status
  submittedAt: Date;             // Submission timestamp
  gradedAt?: Date;               // Grading timestamp
  gradedBy?: string;             // Grader user ID
  grade?: Grade;                 // Assigned grade
  feedback?: string;             // Instructor feedback
  attempts: number;              // Submission attempt number
  metadata?: SubmissionMetadata; // Additional data
  createdAt: Date;
  updatedAt: Date;
}

type SubmissionStatus = 
  | 'DRAFT'                      // Work in progress
  | 'SUBMITTED'                  // Submitted for review
  | 'GRADING'                    // Currently being graded
  | 'GRADED'                     // Graded and returned
  | 'REVISION_REQUESTED';        // Needs revision

interface SubmissionContent {
  type: 'TEXT' | 'FILE' | 'URL' | 'GITHUB';
  data: string;                  // Content data
  files?: SubmissionFile[];      // Attached files
  githubUrl?: string;            // GitHub repository URL
}

interface SubmissionFile {
  name: string;                  // File name
  url: string;                   // File URL
  size: number;                  // File size (bytes)
  type: string;                  // MIME type
}

interface Grade {
  score: number;                 // Numeric score
  maxScore: number;              // Maximum possible score
  percentage: number;            // Percentage score
  letterGrade?: string;          // Letter grade (A, B, C, etc.)
  rubricScores?: RubricScore[];  // Detailed rubric scores
}

interface RubricScore {
  criterionId: string;           // Rubric criterion ID
  score: number;                 // Points earned
  maxScore: number;              // Maximum points possible
  feedback?: string;             // Specific feedback
}

interface SubmissionMetadata {
  wordCount?: number;            // Word count for text submissions
  codeLines?: number;            // Lines of code
  languagesUsed?: string[];      // Programming languages
  collaborators?: string[];      // Collaboration partners
  timeSpent?: number;            // Time spent (minutes)
}
```

## Badge and Achievement Models

### Badge Entity

**Badge Structure:**
```typescript
interface Badge {
  id: string;                    // Unique identifier
  name: string;                  // Badge name
  description: string;           // Badge description
  icon: string;                  // Badge icon URL
  category: BadgeCategory;       // Badge category
  requirements: BadgeRequirements; // Earning requirements
  points: number;                // Points awarded
  rarity: BadgeRarity;           // Badge rarity level
  isActive: boolean;             // Whether badge can be earned
  recipients: BadgeAward[];      // Users who earned this badge
  createdAt: Date;
  updatedAt: Date;
}

type BadgeCategory = 
  | 'PROGRESS'                   // Progress milestones
  | 'COMPLETION'                 // Completion achievements
  | 'ENGAGEMENT'                 // Community engagement
  | 'EXCELLENCE'                 // Excellence in learning
  | 'SPECIAL';                   // Special event badges

type BadgeRarity = 
  | 'COMMON'                     // Easy to obtain
  | 'UNCOMMON'                   // Moderate difficulty
  | 'RARE'                       // Challenging to obtain
  | 'EPIC'                       // Very difficult
  | 'LEGENDARY';                 // Extremely rare

interface BadgeRequirements {
  type: 'LEAGUE_COMPLETION' | 'PROGRESS_MILESTONE' | 'STREAK' | 'SCORE' | 'CUSTOM';
  criteria: any;                 // Specific requirements based on type
  conditions?: {
    minLeagues?: number;         // Minimum leagues completed
    minScore?: number;           // Minimum score required
    consecutiveDays?: number;    // Consecutive learning days
    timeFrame?: number;          // Time frame for completion (days)
  };
}

interface BadgeAward {
  id: string;                    // Unique identifier
  userId: string;                // Recipient user ID
  badgeId: string;               // Badge ID
  earnedAt: Date;                // Award timestamp
  context?: string;              // Context of earning (e.g., league name)
  isVisible: boolean;            // Whether shown on profile
}
```

## API Response Models

### Standard Response Format

**Success Response:**
```typescript
interface APIResponse<T> {
  success: true;
  data: T;
  meta?: ResponseMeta;           // Optional metadata
}

interface ResponseMeta {
  pagination?: {
    page: number;                // Current page
    limit: number;               // Items per page
    totalPages: number;          // Total pages
    totalItems: number;          // Total items
    hasNextPage: boolean;        // Has next page
    hasPrevPage: boolean;        // Has previous page
  };
  filters?: Record<string, any>; // Applied filters
  sorting?: {
    field: string;               // Sort field
    direction: 'asc' | 'desc';   // Sort direction
  };
}
```

**Error Response:**
```typescript
interface APIError {
  success: false;
  error: string;                 // Error message
  code?: string;                 // Error code
  details?: any;                 // Additional error details
  timestamp: Date;               // Error timestamp
  path?: string;                 // API endpoint path
}
```

### Pagination Models

**Paginated Results:**
```typescript
interface PaginatedResponse<T> {
  items: T[];                    // Page items
  pagination: {
    page: number;                // Current page (1-based)
    limit: number;               // Items per page
    totalItems: number;          // Total items
    totalPages: number;          // Total pages
    hasNextPage: boolean;        // Has next page
    hasPrevPage: boolean;        // Has previous page
  };
}

interface PaginationOptions {
  page?: number;                 // Page number (default: 1)
  limit?: number;                // Items per page (default: 20)
  sortBy?: string;               // Sort field
  sortOrder?: 'asc' | 'desc';    // Sort direction
  filters?: Record<string, any>; // Filter criteria
}
```

These data models provide a comprehensive foundation for the OpenLearn platform's data structure, ensuring consistency across the frontend and backend systems while supporting complex learning scenarios and user interactions.
