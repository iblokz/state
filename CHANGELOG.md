# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-01-12

### Added
- **Action Tree Pattern**: New `adapt()` function for auto-dispatching action trees
- **Dynamic Modules**: New `attach()` function for runtime module attachment
- **Convenience Function**: New `createState()` for one-call initialization
- **iblokz-data Integration**: Added dependency for immutable operations
- **Action Stream**: Metadata emission for all action calls
- **Async Support**: Promise handling in action functions
- **Interactive Examples**: 
  - `examples/with-adapt.html` - Action tree pattern demo
  - `examples/with-attach.html` - Dynamic module attachment demo
- **Comprehensive Tests**: 27 tests with 98.95% coverage
- **TypeScript Definitions**: Full type support for new functions
- **Documentation**: Detailed patterns and use cases in README

### Changed
- Updated keywords to include `iblokz`, `iblokz-data`, `action-tree`
- Enhanced README with action tree and attach patterns
- Updated build configuration to externalize `iblokz-data`

## [1.0.1] - 2025-11-11

### Fixed
- Updated Node.js requirement to >=18.12.0 for pnpm 9 compatibility
- Removed Node 16 from CI matrix (EOL)
- Added clear Node.js version requirement to README

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

