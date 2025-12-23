# Contributing to a11y-feedback

Thank you for your interest in contributing to a11y-feedback! This document provides guidelines and information to help you get started.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

1. **Environment details**: Browser, OS, screen reader (if applicable)
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Code sample**: Minimal reproduction if possible

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has been requested before
2. Explain the use case and why it would benefit users
3. Consider accessibility implications
4. Be specific about the expected behavior

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Write or update tests
5. Update documentation if needed
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/a11y-feedback.git
cd a11y-feedback

# Install dependencies
npm install

# Run tests
npm test

# Start development
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build the library |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint source files |
| `npm run lint:fix` | Fix linting issues |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Code Style

### TypeScript

- Use strict TypeScript settings
- Prefer `readonly` properties
- Use explicit return types
- Document public APIs with JSDoc

### Formatting

We use Prettier for code formatting. Run `npm run format` before committing.

### Linting

We use ESLint with TypeScript rules. All linting errors must be resolved before merging.

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Cover edge cases and error conditions
- Test accessibility features with axe-core
- Aim for meaningful coverage, not just line coverage

### Test Structure

```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  })

  it('should do X when Y', () => {
    // Arrange
    // Act
    // Assert
  })
})
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

### Examples

```
feat(visual): add RTL support for notifications

Add RTL layout support with automatic direction detection.
Includes CSS custom properties for border positioning.

Closes #123
```

```
fix(focus): prevent focus theft for success messages

Success messages were incorrectly moving focus when
the focus option was provided. This change enforces
the semantic rule that only errors and warnings can
move focus.

Fixes #456
```

## Accessibility Guidelines

Since this is an accessibility library, all contributions must:

1. **Maintain WCAG compliance**: All features must meet WCAG 2.1 AA
2. **Test with screen readers**: Test with at least NVDA or VoiceOver
3. **Respect user preferences**: Honor reduced motion, color schemes, etc.
4. **Document accessibility features**: Explain how features benefit AT users

### Accessibility Testing Checklist

- [ ] Screen reader announces content correctly
- [ ] Focus management follows ARIA patterns
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Interactive elements are keyboard accessible
- [ ] Reduced motion preferences are respected
- [ ] RTL layouts work correctly

## Documentation

### Code Documentation

- Add JSDoc comments to all public APIs
- Include `@example` with code samples
- Document parameters with `@param`
- Document return values with `@returns`

### README Updates

When adding features:
1. Update the API reference section
2. Add usage examples
3. Update the feature list if applicable

## Review Process

1. All PRs require at least one approval
2. CI checks must pass
3. Code must be properly documented
4. Tests must cover new functionality
5. Breaking changes require discussion

## Questions?

- Open a [discussion](https://github.com/WOLFIEEEE/a11y-feedback/discussions)
- Email: theaccessibleteam@gmail.com

Thank you for contributing to making the web more accessible!

