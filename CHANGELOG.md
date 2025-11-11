# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-11-11

### Added
- Initial stable release
- Event-driven state management with RxJS
- DOM event-based dispatch/collect mechanism
- localStorage and sessionStorage persistence support
- ESM-first with CommonJS compatibility
- TypeScript definitions
- 100% test coverage
- Interactive examples
- GitHub Actions CI/CD
- Automated release workflow

### Core Features
- `dispatch(change, namespace)` - Dispatch state changes via DOM events
- `collect(namespace)` - Collect state changes as Observable stream
- `init(initial, namespace, storage)` - Initialize state with optional persistence
- Storage utilities for localStorage/sessionStorage

### Developer Experience
- c8 code coverage reporting
- Husky git hooks (pre-commit linting, pre-push testing)
- Auto-generated API documentation
- Comprehensive contributing guidelines

