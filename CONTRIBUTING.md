# Contributing to OpenLearn Frontend

Welcome to the OpenLearn platform! We're excited to have you contribute to this modern learning management system. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Project Architecture](#-project-architecture)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Component Guidelines](#-component-guidelines)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)
- [Code of Conduct](#-code-of-conduct)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.19.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- React DevTools (browser extension)

## 🛠️ Development Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/openlearn-frontend.git
cd openlearn-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Verify Setup

- Open the application in your browser
- Check the console for any errors
- Ensure hot reload is working by making a small change

## 🏗️ Project Architecture

### Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 5.4.10
- **Styling**: Tailwind CSS 4.1.8
- **Icons**: Lucide React & React Icons
- **Animations**: Framer Motion
- **Routing**: React Router DOM 7.6.2
- **State Management**: React Context API
- **Package Manager**: npm

### Project Structure

```
openlearn-frontend/
├── public/                 # Static assets
│   ├── favicon.png
│   ├── logo.jpg
│   └── team/              # Team member photos
├── src/
│   ├── components/        # React components
│   │   ├── admin/        # Administrative components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared utility components
│   │   ├── dashboard/    # User dashboard components
│   │   └── landingPage/  # Public landing page components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions and services
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── docs/                 # Comprehensive documentation
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── eslint.config.js      # ESLint configuration
```

### Key Features

- **Role-Based Learning**: Progressive user roles (Pioneer → Luminary → Pathfinder → Chief Pathfinder → Grand Pathfinder)
- **Hierarchical Content**: Cohorts → Leagues → Weeks → Sections → Resources
- **Gamification**: Achievement badges, progress tracking, leaderboards
- **Social Learning**: Share progress, connect with peers
- **Modern UI**: Responsive design with subtle animations
- **Admin Panel**: Comprehensive content management system

## 🔄 Development Workflow

### Branch Naming Convention

```bash
# Feature branches
feature/component-name
feature/user-authentication
feature/admin-dashboard

# Bug fixes
fix/login-validation
fix/responsive-layout

# Documentation
docs/contributing-guide
docs/api-documentation

# Refactoring
refactor/component-structure
refactor/state-management
```

### Commit Message Format

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add user role-based routing
fix(dashboard): resolve progress card loading state
docs(readme): update installation instructions
style(components): improve button component styling
refactor(utils): extract common API functions
```

### Development Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the coding standards outlined below
   - Test your changes locally
   - Ensure responsive design works across devices

3. **Run Quality Checks**
   ```bash
   npm run lint          # Check for linting errors
   npm run build         # Ensure build works
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature description"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### JavaScript/React Guidelines

#### 1. Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';

/**
 * ComponentName - Brief description of component purpose
 * 
 * @param {string} prop1 - Description of prop1
 * @param {string} prop2 - Description with default value
 * @param {function} onAction - Callback function description
 * @param {string} className - Additional CSS classes
 */
const ComponentName = ({ 
  prop1,
  prop2 = 'defaultValue',
  onAction = null,
  className = ''
}) => {
  // State declarations
  const [localState, setLocalState] = useState(null);

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleAction = () => {
    // Event handling logic
    onAction?.(data);
  };

  // Early returns for loading/error states
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

#### 2. Naming Conventions

- **Components**: PascalCase (`UserCard`, `DashboardLayout`)
- **Files**: PascalCase for components (`UserCard.jsx`)
- **Variables/Functions**: camelCase (`userName`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: Follow Tailwind conventions

#### 3. Import Organization

```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';

// Internal components
import LoadingSpinner from '../common/LoadingSpinner';
import UserCard from './UserCard';

// Context and hooks
import { useAuth } from '../../hooks/useAuth';

// Utils and services
import { DataService } from '../../utils/dataService';
```

### CSS/Tailwind Guidelines

#### 1. Utility-First Approach
Use Tailwind utilities instead of custom CSS when possible:

```javascript
// Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Avoid
<div className="custom-card-style">
```

#### 2. Responsive Design Pattern
Follow mobile-first approach:

```javascript
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

#### 3. Color Conventions
- Primary: `#FFDE59` (yellow accent)
- Secondary: `#000000` (black)
- Success: Green variants
- Error: Red variants
- Gray scale for neutral elements

#### 4. Animation Guidelines
Use subtle animations with proper duration:

```javascript
// Hover effects
<div className="transition-all duration-300 hover:scale-105 hover:shadow-lg">

// Loading animations
<div className="animate-pulse">

// Custom animations (defined in index.css)
<div className="floating-blob">
```

### Component Architecture Patterns

#### 1. Container/Presentational Pattern

```javascript
// Container Component (Logic)
const UserContainer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Business logic, API calls
  
  return <UserList users={users} loading={loading} />;
};

// Presentational Component (UI)
const UserList = ({ users, loading }) => {
  if (loading) return <LoadingSpinner />;
  return users.map(user => <UserCard key={user.id} user={user} />);
};
```

#### 2. Conditional Rendering

```javascript
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

#### 3. Event Handling

```javascript
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

## 🧩 Component Guidelines

### Creating New Components

#### 1. Component Checklist
- [ ] Component serves a single responsibility
- [ ] Props are well-defined and documented
- [ ] Handles loading and error states
- [ ] Responsive design implemented
- [ ] Accessibility considerations included
- [ ] Proper prop validation

#### 2. Props Design Best Practices

```javascript
// Good: Explicit and typed props
const UserCard = ({ 
  user,                    // Required object
  size = 'md',            // Optional with default
  showActions = true,     // Boolean with default
  onClick = null,         // Optional callback
  className = ''          // Style extension
}) => {
  // Implementation
};

// Document complex props
/**
 * @param {Object} user - User object
 * @param {string} user.name - User's full name
 * @param {string} user.role - User role
 * @param {string} user.avatar - Avatar URL
 */
```

#### 3. State Management Guidelines

```javascript
// Local state for component-specific data
const [isExpanded, setIsExpanded] = useState(false);

// Context for global state
const { user, login, logout } = useAuth();

// Service layer for API calls
const data = await DataService.getProfile();
```

### Accessibility Standards

#### 1. Semantic HTML
```javascript
// Good
<button onClick={handleClick}>Submit</button>
<nav aria-label="Main navigation">

// Avoid
<div onClick={handleClick}>Submit</div>
```

#### 2. ARIA Labels
```javascript
<button 
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
>
```

#### 3. Keyboard Navigation
```javascript
const handleKeyPress = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
};
```

### Performance Considerations

#### 1. Optimization Techniques
- Use `React.memo()` for expensive components
- Implement proper dependency arrays in `useEffect`
- Avoid inline object/function definitions in render
- Use `useCallback` and `useMemo` when appropriate

#### 2. Bundle Optimization
- Import only needed icons: `import { User } from 'lucide-react'`
- Use dynamic imports for large components
- Optimize images and assets

## 🧪 Testing

### Current Testing Setup
The project is currently focused on development and doesn't have comprehensive tests yet. When contributing tests:

#### Recommended Testing Stack
- **Unit Testing**: Vitest
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress

#### Testing Guidelines (Future)
```javascript
// Component test example
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

test('displays user information correctly', () => {
  const mockUser = { name: 'John Doe', role: 'PIONEER' };
  render(<UserCard user={mockUser} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('PIONEER')).toBeInTheDocument();
});
```

### Manual Testing

#### Testing Checklist
- [ ] Component renders correctly in different screen sizes
- [ ] All interactive elements work as expected
- [ ] Loading and error states display properly
- [ ] Accessibility features work correctly
- [ ] No console errors or warnings

#### Browser Testing
Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

#### Responsive Testing
Test at these breakpoints:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🔄 Pull Request Process

### Before Submitting

1. **Self Review**
   - Review your own code changes
   - Test functionality thoroughly
   - Check for console errors/warnings
   - Verify responsive design

2. **Code Quality**
   ```bash
   npm run lint          # Check linting
   npm run build         # Verify build works
   ```

3. **Documentation**
   - Update relevant documentation
   - Add JSDoc comments for new functions
   - Update README if needed

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested on different screen sizes
- [ ] Tested in multiple browsers
- [ ] No console errors/warnings
- [ ] All functionality works as expected

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context about the changes.
```

### Review Process

1. **Automated Checks**
   - ESLint checks must pass
   - Build must succeed

2. **Manual Review**
   - Code quality and standards
   - Functionality verification
   - UI/UX review
   - Performance considerations

3. **Feedback Integration**
   - Address reviewer feedback
   - Make requested changes
   - Re-request review when ready

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome 91, Firefox 89]
- Screen size: [e.g. Mobile, Desktop]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem It Solves**
Explain what problem this feature would solve.

**Proposed Solution**
Describe how you envision this feature working.

**Alternatives Considered**
Any alternative solutions or features you've considered.

**Additional Context**
Add any other context or screenshots about the feature request.
```

### Security Issues

For security-related issues:
- **DO NOT** create a public issue
- Email the maintainers directly
- Provide detailed information about the vulnerability

## 🎨 Design Guidelines

### UI/UX Principles

1. **Consistency**
   - Use established component patterns
   - Follow design system guidelines
   - Maintain visual hierarchy

2. **Accessibility**
   - Ensure color contrast ratios meet WCAG guidelines
   - Provide keyboard navigation
   - Include proper ARIA labels

3. **Performance**
   - Optimize images and assets
   - Use appropriate loading states
   - Minimize layout shifts

### Color Palette

```css
/* Primary Colors */
--primary-yellow: #FFDE59;
--primary-black: #000000;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Gray Scale */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;
```

### Typography

- **Font Family**: Inter (imported from Google Fonts)
- **Headings**: Font weights 600-700
- **Body Text**: Font weight 400
- **Small Text**: Font weight 400, smaller size

## 📚 Resources

### Documentation
- [Setup Guide](./docs/development/setup.md)
- [Component Architecture](./docs/architecture/component-architecture.md)
- [API Documentation](./docs/api/)
- [System Overview](./docs/architecture/system-overview.md)

### Learning Resources
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 💬 Communication

### Getting Help

1. **Documentation First**: Check existing documentation
2. **Search Issues**: Look for similar issues or questions
3. **Create Issue**: If you can't find answers, create a new issue
4. **Be Specific**: Provide detailed information and context

### Community Guidelines

- Be respectful and constructive
- Help others when you can
- Share knowledge and learnings
- Follow the code of conduct

## 📄 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment of any kind
- Discriminatory language or actions
- Personal attacks or trolling
- Publishing private information without permission
- Other conduct inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying standards of acceptable behavior and will take appropriate corrective action in response to unacceptable behavior.

## 🙋‍♂️ Questions?

If you have questions about contributing:

1. Check the [documentation](./docs/)
2. Search existing [issues](https://github.com/your-repo/issues)
3. Create a new issue with the "question" label
4. Reach out to the maintainers

---

Thank you for contributing to OpenLearn! Your efforts help make education more accessible and engaging for everyone. 🚀📚

## 🏷️ Additional Information

### Project Maintainers
- **Chahat Kesharwani** - Lead Developer
  - LinkedIn: [chahatkesharwani](https://linkedin.com/in/chahatkesharwani)
  - GitHub: [chahatkesh](https://github.com/chahatkesh)

### Project Status
- **Current Version**: 0.0.0 (in development)
- **Node.js Requirement**: >=18.0.0
- **License**: MIT
- **Deployment**: Vercel

### Recent Updates
The project is actively developed with recent focus on:
- Enhanced UI/UX improvements
- Admin panel functionality
- Favicon service implementation
- Role-based access control
- Mobile responsiveness

For the latest updates, check the [Updates Page](./src/pages/UpdatesPage.jsx) or recent commits.
