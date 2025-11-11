# Contributing to iblokz-state

First off, thank you for considering contributing to iblokz-state! 🎉

## Code of Conduct

Be respectful, inclusive, and collaborative.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Code samples if applicable
- Your environment (Node.js version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Examples of how it would be used
- Why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Follow the existing code style
3. Add tests for any new functionality
4. Ensure all tests pass: `pnpm test`
5. Ensure linting passes: `pnpm lint`
6. Update documentation if needed
7. Write a clear commit message

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/state.git
cd state

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run linter
pnpm lint

# Build
pnpm build

# Watch docs (optional)
pnpm run docs:watch
```

## Project Structure

```
iblokz-state/
├── lib/           # Source code (ESM)
│   ├── core.js    # Core state management
│   └── storage.js # Storage utilities
├── test/          # Test files
├── examples/      # Interactive examples
├── dist/          # Built files (generated)
└── index.js       # Main entry point
```

## Coding Guidelines

### Style Guide

- Use **tabs** for indentation (project standard)
- Follow Google JavaScript Style Guide (enforced by ESLint)
- Keep functions small and focused
- Use descriptive variable names
- Add JSDoc comments for public APIs

### ESM First

- Write all source code in ESM (ES Modules)
- Use `import`/`export` syntax
- CommonJS builds are generated automatically

### Testing

- Write tests for all new features
- Maintain or improve code coverage
- Tests use Mocha + Chai
- Run tests with: `pnpm test`

Example test structure:
```javascript
describe('feature', () => {
  it('should do something', () => {
    // Test implementation
  });
});
```

### Commits

Use conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Build process or tooling changes

Example:
```
feat: add sessionStorage support
fix: handle JSON parse errors in storage
docs: update API examples
```

## Git Hooks

The project uses Husky for git hooks:

- **pre-commit**: Runs linter
- **pre-push**: Runs tests

These ensure code quality before commits/pushes.

## Release Process

Maintainers handle releases:

1. Update CHANGELOG.md
2. Run `npm version [patch|minor|major]`
3. Git hooks automatically:
   - Generate docs
   - Create git tag
   - Push to GitHub
4. CI/CD publishes to npm

## Questions?

Feel free to open an issue for questions or discussions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

