# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-12-23

### Added
- Live demo site at https://wolfieeee.github.io/npm-extention/
- Interactive examples for all notification types
- Visual feedback toggle demo
- Focus management demonstration
- Event logging in demo
- Logo and branding assets

### Changed
- Enhanced README with better documentation
- Improved package metadata for npm
- Added more keywords for discoverability

### Fixed
- Corrected function exports in UMD build documentation

## [1.0.0] - 2024-12-23

### Added
- Initial release of a11y-feedback
- Core `notify` function with sugar helpers (success, error, warning, info, loading)
- Automatic ARIA live region management
- Semantic feedback type enforcement
- Focus management with safety rules
- Content-based and ID-based deduplication
- Re-announcement engine for screen readers
- Visual feedback component (optional)
- Debug mode with telemetry
- Full TypeScript support
- ESM, CJS, and UMD builds
- WCAG 2.2 compliance features
- Zero dependencies

### Security
- No critical messages auto-dismiss (WCAG 2.2.1 compliance)
- Focus stealing prevention for non-error types

---

[1.0.1]: https://github.com/WOLFIEEEE/npm-extention/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/WOLFIEEEE/npm-extention/releases/tag/v1.0.0
