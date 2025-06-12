# 🎓 OpenLearn Platform

A comprehensive learning management system built with React and modern web technologies, featuring role-based education, gamification, and social learning capabilities.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.8-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Overview

OpenLearn is a modern educational platform that combines traditional learning management with gamification elements to create an engaging and effective learning experience. The platform features a hierarchical role system, progress tracking, achievement badges, and social sharing capabilities.

### ✨ Key Features

- **🎯 Role-Based Learning**: Progressive user roles from Pioneer to Grand Pathfinder
- **📚 Structured Content**: Hierarchical organization (Cohorts → Leagues → Weeks → Sections → Resources)
- **🏆 Gamification**: Achievement badges, progress tracking, and leaderboards
- **👥 Social Learning**: Share progress, connect with peers, and celebrate achievements
- **⚡ Modern Tech Stack**: React 19, Vite, Tailwind CSS, and modern JavaScript
- **🛡️ Secure Authentication**: JWT-based auth with role-based access control
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts
- **🎨 Beautiful UI**: Modern design with subtle animations and professional aesthetics

## 🏗️ Architecture

### User Role Hierarchy
```
PIONEER → LUMINARY → PATHFINDER → CHIEF_PATHFINDER → GRAND_PATHFINDER
```

### Learning Structure
```
Platform
├── Cohorts (Programs/Courses)
│   └── Leagues (Subjects/Modules)
│       └── Weeks (Time-based periods)
│           └── Sections (Individual lessons)
│               └── Resources (Learning materials)
│                   └── Assignments (Homework/Projects)
```

### Tech Stack
- **Frontend**: React 19.1.0 + Vite 5.4.10
- **Styling**: Tailwind CSS 4.1.8
- **Routing**: React Router DOM 7.6.2
- **Icons**: Lucide React + React Icons
- **State Management**: React Context API
- **Build Tools**: Vite with ES modules
- **Code Quality**: ESLint 9.25.0

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 8.19.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd openlearn-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code quality checks
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### 🏗️ Architecture & Development
- **[System Overview](./docs/architecture/system-overview.md)** - Platform architecture and design principles
- **[Component Architecture](./docs/architecture/component-architecture.md)** - Component structure and patterns
- **[Development Setup](./docs/development/setup.md)** - Local development environment setup
- **[Data Flow & State Management](./docs/architecture/data-flow.md)** - State management patterns

### 📖 User Guides
- **[Getting Started](./docs/user-guide/getting-started.md)** - New user onboarding guide
- **[Dashboard Overview](./docs/user-guide/dashboard-overview.md)** - Understanding the user dashboard
- **[Learning Progress](./docs/user-guide/learning-progress.md)** - Progress tracking and completion
- **[Achievements & Badges](./docs/user-guide/achievements.md)** - Badge system and social features

### 🔧 Admin Documentation
- **[Admin Panel Overview](./docs/admin-guide/admin-overview.md)** - Administrative interface guide
- **[User Management](./docs/admin-guide/user-management.md)** - Managing users and roles
- **[Content Management](./docs/admin-guide/content-management.md)** - Creating and managing content
- **[Badge Management](./docs/admin-guide/badge-management.md)** - Achievement system administration

### 🔌 API Documentation
- **[Authentication APIs](./docs/api/authentication.md)** - Auth endpoints and JWT handling
- **[Learning Progress APIs](./docs/api/learning-progress.md)** - Enrollment and progress tracking
- **[User Management APIs](./docs/api/user-management.md)** - User administration endpoints
- **[Badge System APIs](./docs/api/badge-system.md)** - Achievement and badge management

## 🎯 Core Features

### 🎓 Learning Management
- **Enrollment System**: Users enroll in Cohort + League combinations
- **Progress Tracking**: Section-by-section completion monitoring
- **Personal Notes**: Add reflections and mark sections for revision
- **Resource Management**: Videos, articles, exercises, and assignments
- **Completion Analytics**: Detailed progress insights and statistics

### 🏆 Gamification System
- **Achievement Badges**: Automatic and manual badge awarding
- **Progress Milestones**: Visual progress indicators with status messages
- **Social Sharing**: Share achievements on Twitter, LinkedIn, Instagram
- **Leaderboards**: Competitive progress tracking and recognition
- **Personal Analytics**: Individual learning journey insights

### 👥 Role-Based Access
- **Progressive Roles**: Natural advancement through platform hierarchy
- **Permission Management**: Role-based feature access and restrictions
- **Admin Controls**: Comprehensive administrative tools for content and user management
- **Approval Workflow**: New user approval process with status management

### 🎨 User Experience
- **Modern UI/UX**: Clean, professional design with subtle animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant design considerations
- **Performance**: Optimized loading times and smooth interactions

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Authorization**: Granular access control based on user roles
- **Protected Routes**: Route-level security with role verification
- **Secure API Communication**: Encrypted data transmission
- **Token Refresh**: Automatic token renewal for seamless sessions

## 🚀 Development

### Project Structure
```
src/
├── components/         # React components organized by feature
│   ├── admin/         # Administrative interface components
│   ├── auth/          # Authentication components
│   ├── common/        # Shared utility components
│   ├── dashboard/     # User dashboard components
│   └── landingPage/   # Public landing page components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components and routing
├── utils/             # Utility functions and API services
└── App.jsx            # Main application component
```

### Component Guidelines
- **Atomic Design**: Reusable, composable component architecture
- **Props-Based Configuration**: Flexible and configurable components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### State Management
- **Global State**: React Context for authentication and user data
- **Local State**: Component-specific state with useState and useEffect
- **Service Layer**: Abstracted API communication with error handling
- **Caching Strategy**: Efficient data fetching and storage patterns

## 🎨 Design System

### Color Palette
- **Primary**: `#FFDE59` (Golden yellow for highlights and CTAs)
- **Secondary**: `#000000` (Black for text and contrast)
- **Success**: `#10B981` (Green for completions and success states)
- **Warning**: `#F59E0B` (Orange for warnings and attention)
- **Error**: `#EF4444` (Red for errors and alerts)

### Typography
- **Headings**: Bold, clear hierarchy with appropriate sizing
- **Body Text**: Readable font sizes with proper line height
- **Interactive Elements**: Clear labeling and visual feedback

### Animations
- **Subtle Transitions**: Smooth hover effects and state changes
- **Loading States**: Engaging loading animations and skeleton screens
- **Micro-Interactions**: Delightful user interaction feedback

## 🤝 Contributing

We welcome contributions to the OpenLearn platform! Please follow these guidelines:

### Development Process
1. **Fork** the repository and create a feature branch
2. **Follow** the established coding standards and component patterns
3. **Test** your changes thoroughly across different devices and browsers
4. **Document** new features and update relevant documentation
5. **Submit** a pull request with clear description of changes

### Coding Standards
- **ES6+ JavaScript**: Modern JavaScript features and syntax
- **React Best Practices**: Functional components, hooks, and proper lifecycle management
- **Tailwind CSS**: Utility-first styling with consistent design patterns
- **ESLint Configuration**: Follow the established linting rules
- **Component Documentation**: Clear prop documentation and usage examples

### Pull Request Guidelines
- Clear, descriptive commit messages
- Reference relevant issues in PR description
- Include screenshots for UI changes
- Ensure all tests pass and linting is clean
- Update documentation as needed

## 📊 Performance

### Optimization Features
- **Code Splitting**: Dynamic imports for efficient bundle loading
- **Lazy Loading**: On-demand component and resource loading
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **Caching Strategy**: Efficient API response caching

### Build Optimization
- **Vite Build System**: Fast development server and optimized production builds
- **Tree Shaking**: Elimination of unused code for smaller bundles
- **Asset Optimization**: Minification and compression for production
- **Source Maps**: Debugging support in development environment

## 🌟 Upcoming Features

### Planned Enhancements
- **📱 Mobile App**: Native mobile applications for iOS and Android
- **🎥 Video Streaming**: Integrated video player with progress tracking
- **💬 Discussion Forums**: Community discussion and Q&A features
- **📊 Advanced Analytics**: Detailed learning analytics and insights
- **🌐 Internationalization**: Multi-language support and localization
- **🔗 API Integrations**: Third-party service integrations and webhooks

### Community Features
- **Study Groups**: Collaborative learning group formation
- **Peer Mentoring**: Connection between experienced and new learners
- **Events & Webinars**: Live learning events and recorded sessions
- **Certification System**: Formal completion certificates and credentials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent frontend framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS Team** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **Open Source Community** for inspiration and best practices

## 📞 Support

### Getting Help
- **📖 Documentation**: Start with our comprehensive [documentation](./docs/)
- **🐛 Issues**: Report bugs and request features via GitHub Issues
- **💬 Discussions**: Join community discussions for questions and ideas
- **📧 Contact**: Reach out to the development team for technical support

### Resources
- **[User Guide](./docs/user-guide/)** - Complete user documentation
- **[Admin Guide](./docs/admin-guide/)** - Administrative documentation
- **[API Documentation](./docs/api/)** - Developer API reference
- **[Development Guide](./docs/development/)** - Setup and contribution guidelines

---

**Built with ❤️ by the OpenLearn Team**

*Empowering learners through technology and community*
