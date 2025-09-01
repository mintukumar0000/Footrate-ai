# 🤝 Contributing to FootRate AI

Thank you for your interest in contributing to FootRate AI! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** your changes
6. **Submit** a pull request

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and open to feedback
- **Be professional** in all interactions
- **Be constructive** in criticism and suggestions

## 🎯 How Can I Contribute?

### 🐛 Bug Reports
- Use the GitHub issue template
- Provide detailed reproduction steps
- Include screenshots if applicable
- Specify your environment (OS, browser, etc.)

### ✨ Feature Requests
- Describe the feature clearly
- Explain the use case and benefits
- Consider implementation complexity
- Check if it aligns with project goals

### 💻 Code Contributions
- **Frontend**: React components, styling, UX improvements
- **Backend**: API endpoints, database optimizations
- **AI**: Analysis improvements, new features
- **Documentation**: README updates, code comments
- **Testing**: Unit tests, integration tests

### 🎨 UI/UX Improvements
- **Design**: Better layouts, responsive design
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Loading optimizations, bundle size
- **User Experience**: Better flows, error handling

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/footrate-ai.git
   cd footrate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries

### Styling
- Use Tailwind CSS classes
- Follow responsive design principles
- Maintain consistent spacing and colors
- Use semantic HTML

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for functions

## 🧪 Testing

### Test Types
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Accessibility Tests**: Screen reader compatibility

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Writing Tests
- Test both success and error cases
- Mock external dependencies
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## 🔄 Pull Request Process

### Before Submitting
1. **Test** your changes thoroughly
2. **Update** documentation if needed
3. **Add** tests for new features
4. **Check** code style and formatting
5. **Ensure** all tests pass

### PR Guidelines
1. **Title**: Clear, descriptive title
2. **Description**: Explain what and why (not how)
3. **Fixes**: Link to related issues
4. **Screenshots**: For UI changes
5. **Tests**: Include test coverage

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Reporting Bugs

### Bug Report Template
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
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

## Additional Context
Any other context, screenshots, or logs
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
How would this feature be used?

## Benefits
What benefits would this provide?

## Implementation Ideas
Any thoughts on how to implement?

## Alternatives Considered
What other approaches were considered?
```

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general help
- **Email**: [heyquixy@gmail.com](mailto:heyquixy@gmail.com)
- **Twitter**: [@Mintu_aa](https://x.com/Mintu_aa)

## 🙏 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to FootRate AI!** 🚀

*Together, we're building the future of AI-powered foot analysis.* 🦶
