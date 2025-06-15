# Admin Panel Overview

Welcome to the OpenLearn Admin Panel. This comprehensive guide covers all administrative features available to Chief Pathfinders and Grand Pathfinders.

[![Admin Access](https://img.shields.io/badge/Access-Role%20Based-blue?style=flat-square)]()
[![Security Level](https://img.shields.io/badge/Security-Multi%20Layer-green?style=flat-square)]()
[![Features](https://img.shields.io/badge/Features-Complete-brightgreen?style=flat-square)]()

## Access Requirements

### Role-Based Access
- **CHIEF_PATHFINDER**: Limited admin access (excludes specialized management features)
- **GRAND_PATHFINDER**: Full administrative control (all features including specialization management)

### Access Control Levels
The admin panel implements multi-layer security:
- **Route-level Protection**: Unauthorized users redirected from admin routes
- **UI-level Restrictions**: Menu items and buttons hidden based on permissions
- **Component-level Security**: Features disabled for insufficient permission levels

#### Restricted Features
- **Specialization Management**: Available only to GRAND_PATHFINDER role
- **System Configuration**: Limited to highest permission levels
- **User Role Management**: Controlled access to role modification features

### Accessing the Admin Panel
1. Sign in with your administrative account
2. Look for the **"Admin Panel"** button in the dashboard header
3. Click to enter the administrative interface

## Admin Panel Structure

### Administrative Hierarchy
```mermaid
graph TD
    GP[GRAND_PATHFINDER] --> CP[CHIEF_PATHFINDER]
    GP --> |Full Access| All[All Features]
    CP --> |Limited Access| Standard[Standard Features]
    
    All --> UserMgmt[User Management]
    All --> Content[Content Management]
    All --> Spec[Specialization Management]
    All --> System[System Configuration]
    
    Standard --> UserMgmt
    Standard --> Content
    Standard -.-> |Restricted| Spec
    Standard -.-> |Restricted| System
    
    style GP fill:#ffebee
    style CP fill:#fff3e0
    style Spec fill:#f3e5f5
    style System fill:#f3e5f5
```

### Main Navigation Sections
````
Admin Panel
├── User Management
├── Content Management
│   ├── Cohort Management
│   ├── League Management
│   ├── Week Management
│   ├── Section Management
│   ├── Resource Management
│   └── Specialization Management (GRAND_PATHFINDER only)
├── Badge Management
├── Assignment Management
└── Progress Analytics
````
└── Progress Analytics
```

└── Progress Analytics

## User Management

### Overview
The User Management section allows you to control user accounts, roles, and permissions across the platform.

### User Management Workflow
```mermaid
flowchart TD
    A[New User Registration] --> B[Pending Status]
    B --> C{Admin Review}
    C -->|Approve| D[Active Status]
    C -->|Reject| E[Rejected Status]
    D --> F[Role Assignment]
    F --> G[Permission Granted]
    
    H[Role Updates] --> I[Permission Changes]
    I --> J[User Notification]
    
    style D fill:#e8f5e8
    style E fill:#ffebee
    style G fill:#e8f5e8
```

### Key Features

#### User List & Filtering
- **Status Filters**: All, Active, Pending, Suspended
- **Role Filters**: All roles except Grand Pathfinder
- **Search Functionality**: Find users by name or email
- **User Statistics**: Quick overview of user counts

#### User Actions

##### Approve Pending Users
1. Navigate to User Management
2. Filter by "Pending" status
3. Review user information
4. Click **"Approve"** to activate the account

##### Role Management
1. Select a user from the list
2. Choose new role from dropdown menu
3. Click **"Update Role"** to apply changes
4. User will receive new permissions immediately

##### Status Management
- **Activate**: Enable user access
- **Suspend**: Temporarily disable access
- **Reactivate**: Restore suspended accounts

#### User Details View
Each user entry displays:
- **Profile Information**: Name, email, avatar
- **Current Role**: With role badge
- **Account Status**: Active, Pending, or Suspended
- **Join Date**: When they registered
- **Action Buttons**: Role and status controls

### Best Practices
- **Regular Review**: Check pending users weekly
- **Role Progression**: Follow the natural progression path
- **Documentation**: Keep notes on role changes
- **Communication**: Inform users of status changes

## 📚 Content Management

### Cohort Management

#### Creating New Cohorts
1. Click **"Create New Cohort"**
2. Fill in required information:
   - Name (e.g., "Web Development Bootcamp")
   - Description
   - Start/End dates (optional)
   - Prerequisites
3. Click **"Create Cohort"**

#### Managing Existing Cohorts
- **Edit Details**: Update name, description, dates
- **Archive Cohorts**: Hide completed programs
- **View Enrollments**: See who's enrolled
- **Generate Reports**: Export cohort analytics

### League Management

#### Creating New Leagues
1. Select **"League Management"**
2. Click **"Create New League"**
3. Configure:
   - League name
   - Associated cohort
   - Description
   - Difficulty level
   - Estimated duration
4. Save and publish

#### League Configuration
- **Prerequisites**: Set required previous leagues
- **Badge Configuration**: Define completion badges
- **Resource Limits**: Set maximum resources per section
- **Assessment Rules**: Configure completion requirements

### Week Management

#### Creating Learning Weeks
1. Choose the parent league
2. Click **"Add New Week"**
3. Set:
   - Week number
   - Title and description
   - Learning objectives
   - Estimated time commitment

#### Week Scheduling
- **Sequential Order**: Weeks must be completed in order
- **Release Dates**: Schedule when weeks become available
- **Duration Tracking**: Monitor average completion times

### Section Management

#### Creating Sections
1. Select the parent week
2. Click **"Create Section"**
3. Define:
   - Section title
   - Learning objectives
   - Prerequisites
   - Completion criteria

#### Section Types
- **Content Sections**: Information delivery
- **Exercise Sections**: Hands-on practice
- **Assessment Sections**: Knowledge testing
- **Project Sections**: Applied learning

### Resource Management

#### Adding Resources
1. Navigate to the target section
2. Click **"Add Resource"**
3. Choose resource type:
   - **Video**: Upload or link to video content
   - **Article**: Written content or external links
   - **Interactive**: Coding exercises, simulations
   - **Document**: PDFs, presentations, files
   - **Quiz**: Assessment tools

#### Resource Configuration
- **Access Control**: Who can view the resource
- **Completion Tracking**: Mark as required/optional
- **Difficulty Rating**: Help learners choose appropriate content
- **Tags**: Categorize for easy discovery

### Specialization Management

#### Creating Specializations
1. Access **"Specialization Management"**
2. Click **"Create Specialization"**
3. Configure:
   - Specialization name
   - Required leagues
   - Completion criteria
   - Certification details

#### Specialization Pathways
- **Prerequisites**: Define required background
- **Learning Path**: Sequence of leagues
- **Capstone Projects**: Final assessment requirements
- **Certification**: Generate completion certificates

## 🏆 Badge Management

### Badge System Overview
Badges provide recognition and motivation for learners throughout their journey.

### Creating Badges

#### Automatic Badges
1. Navigate to **"Badge Management"**
2. Click **"Create Badge"**
3. Configure:
   - Badge name and description
   - Associated league
   - Completion criteria
   - Badge image/icon
4. Set automatic awarding rules

#### Manual Badge Awards
1. Find the user in User Management
2. Click **"Award Badge"**
3. Select badge to award
4. Add reason/note
5. Confirm award

### Badge Categories
- **Completion Badges**: For finishing leagues
- **Achievement Badges**: For specific milestones
- **Recognition Badges**: For exceptional work
- **Special Event Badges**: For participation in events

### Badge Analytics
- **Award Statistics**: How many badges of each type
- **User Achievements**: Individual badge collections
- **Popular Badges**: Most frequently earned
- **Badge Effectiveness**: Impact on engagement

## 📝 Assignment Management

### Creating Assignments
1. Select **"Assignment Management"**
2. Click **"Create Assignment"**
3. Configure:
   - Assignment title and description
   - Associated league/section
   - Due date and duration
   - Submission requirements
   - Grading criteria

### Assignment Types
- **Individual Projects**: Solo work
- **Group Projects**: Collaborative assignments
- **Code Challenges**: Programming exercises
- **Research Papers**: Written assignments
- **Presentations**: Oral/visual presentations

### Grading & Feedback
- **Rubric Creation**: Define grading criteria
- **Automated Grading**: For code assignments
- **Peer Review**: Student-to-student evaluation
- **Instructor Feedback**: Detailed comments and suggestions

## 📊 Progress Analytics

### Dashboard Metrics
Access comprehensive analytics on:
- **User Engagement**: Active users, session duration
- **Course Completion**: Success rates by league
- **Badge Distribution**: Achievement patterns
- **Progress Tracking**: Individual and cohort progress

### Reports Available

#### User Progress Reports
- Individual learning journeys
- Completion rates by demographic
- Time-to-completion analysis
- Dropout point identification

#### Content Performance Reports
- Most/least popular content
- Resource effectiveness metrics
- Section completion times
- User feedback analysis

#### Engagement Analytics
- Daily/weekly active users
- Feature usage statistics
- Social sharing metrics
- Badge earning patterns

### Export Options
- **CSV Export**: For spreadsheet analysis
- **PDF Reports**: For stakeholder presentations
- **API Access**: For custom dashboard integration
- **Scheduled Reports**: Automated delivery

## 🔧 Platform Configuration

### System Settings (Grand Pathfinder Only)
- **Platform Branding**: Logo, colors, messaging
- **Feature Toggles**: Enable/disable platform features
- **Email Templates**: Customize notification emails
- **Integration Settings**: Third-party service connections

### Security Configuration
- **Password Policies**: Minimum requirements
- **Session Management**: Timeout settings
- **Access Logs**: User activity monitoring
- **Rate Limiting**: API usage controls

## 🚨 Monitoring & Maintenance

### Health Monitoring
- **System Status**: Server and service health
- **Error Tracking**: Application error logs
- **Performance Metrics**: Response times, load
- **User Feedback**: Support tickets and issues

### Maintenance Tasks
- **Data Backups**: Regular data protection
- **Cache Management**: Performance optimization
- **Log Rotation**: Storage management
- **Security Updates**: Keep system secure

## 📞 Support & Escalation

### User Support Workflow
1. **First Level**: User documentation and FAQ
2. **Second Level**: Chief Pathfinder assistance
3. **Third Level**: Grand Pathfinder intervention
4. **Technical Issues**: Development team escalation

### Common Support Scenarios
- **Account Access Issues**: Password resets, account recovery
- **Content Problems**: Broken links, missing resources
- **Progress Issues**: Lost progress, completion problems
- **Technical Bugs**: Platform functionality issues

### Escalation Procedures
- **Document Issues**: Clear description and steps to reproduce
- **Gather Context**: User details, browser, device information
- **Attempt Resolution**: Use available admin tools
- **Escalate When Needed**: Contact technical team with details

This admin overview provides the foundation for effective platform administration. Each section has detailed procedures and best practices to ensure smooth operation of the OpenLearn platform.
