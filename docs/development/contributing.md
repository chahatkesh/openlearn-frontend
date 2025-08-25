# Contributing to OpenLearn Frontend

We welcome contributions to OpenLearn! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 8.19.0
- Git
- Familiarity with React, JavaScript, and Tailwind CSS

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/openlearn-frontend.git
   cd openlearn-frontend
   ```

2. **Set Up Local Development**
   ```bash
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/openlearnnitj/openlearn-frontend.git
   ```

## 🔄 Development Workflow

### Creating a Feature Branch
```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes
1. **Follow Code Standards**: Check our [coding standards](./standards.md)
2. **Write Tests**: Add tests for new functionality
3. **Update Documentation**: Keep docs current with changes
4. **Test Thoroughly**: Test on different devices and browsers

### Committing Changes
Use conventional commit format:
```bash
git commit -m "feat: add user dashboard search functionality"
git commit -m "fix: resolve mobile navigation issue"
git commit -m "docs: update installation guide"
```

### Submitting a Pull Request
1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and create a PR from your fork
   - Use the PR template
   - Include screenshots for UI changes
   - Reference related issues

## 📋 Contribution Types

### 🐛 Bug Reports
Before submitting a bug report:
- Check existing issues
- Reproduce the bug
- Gather system information

**Bug Report Template:**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 12.6]
- Browser: [e.g., Chrome 104]
- Node.js: [e.g., 18.15.0]
- Device: [e.g., iPhone 13, Desktop]

## Screenshots
If applicable, add screenshots
```

### ✨ Feature Requests
**Feature Request Template:**
```markdown
## Feature Description
Clear description of the feature

## Problem/Use Case
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Mockups, examples, or related issues
```

### 🔧 Code Contributions

#### Types of Contributions
- **Bug fixes**: Fix reported issues
- **New features**: Add functionality
- **Performance improvements**: Optimize existing code
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Refactoring**: Improve code structure

#### Before Starting
- Check existing issues and PRs
- Discuss large changes in an issue first
- Ensure the feature aligns with project goals

## 🧪 Testing Guidelines

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Add tests for new components and functions
- Follow existing test patterns
- Ensure good test coverage
- Test both happy paths and edge cases

### Test Structure
```jsx
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

## 📝 Documentation Guidelines

### Types of Documentation
- **Code Comments**: For complex logic
- **Component Documentation**: Props and usage
- **API Documentation**: Endpoint specifications
- **User Guides**: Feature explanations
- **Developer Guides**: Setup and architecture

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep examples up to date
- Use proper markdown formatting

## 🎨 Design Guidelines

### UI/UX Considerations
- Follow existing design patterns
- Ensure mobile responsiveness
- Consider accessibility (WCAG guidelines)
- Test on multiple browsers and devices

### Design Review Process
- Include screenshots in PRs
- Test responsive behavior
- Verify accessibility features
- Check color contrast ratios

## 🔍 Code Review Process

### Submitting for Review
- Ensure CI checks pass
- Update relevant documentation
- Add tests for new functionality
- Follow the PR template

### Review Criteria
- **Functionality**: Does it work as expected?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Is it optimized?
- **Security**: Are there security concerns?
- **Tests**: Is there adequate test coverage?
- **Documentation**: Is documentation updated?

### Addressing Feedback
- Respond to review comments promptly
- Make requested changes
- Ask for clarification if needed
- Update PR description if scope changes

## 🏷️ Issue Labels

### Priority Labels
- `priority: high` - Critical issues needing immediate attention
- `priority: medium` - Important issues for next release
- `priority: low` - Nice-to-have improvements

### Type Labels
- `bug` - Something isn't working correctly
- `feature` - New functionality request
- `enhancement` - Improvement to existing feature
- `documentation` - Documentation improvements
- `question` - Request for information

### Status Labels
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `in progress` - Currently being worked on
- `needs review` - Ready for review

## 🚦 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Security review completed

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Follow community guidelines

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Pull Requests**: Code review and collaboration

### Getting Help
- Check existing documentation
- Search GitHub issues
- Ask questions in discussions
- Reach out to maintainers

## 🏆 Recognition

### Contributors
- All contributors are recognized in our changelog
- Significant contributors may be invited as maintainers
- We celebrate contributions in our community channels

### Hacktoberfest
We participate in Hacktoberfest! Look for `hacktoberfest` labeled issues during October.

## 📞 Contact

- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Email**: For security issues or sensitive matters

Thank you for contributing to OpenLearn! Your efforts help make education more accessible and engaging for everyone.
