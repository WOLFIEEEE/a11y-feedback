# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-23

### Added
- **Action Buttons**: Interactive buttons in notifications with click handlers, loading states, and variants (primary/secondary/danger)
- **Progress Notifications**: Real-time progress tracking with ARIA progressbar, automatic announcements at thresholds
- **Notification Grouping**: Group similar notifications together with customizable grouping logic
- **Keyboard Navigation**: Full keyboard support with customizable shortcuts (Escape to dismiss, Alt+Shift+N for center)
- **Promise-based Dialogs**: Accessible `confirm()` and `prompt()` dialogs with focus trapping
- **Notification Templates**: Reusable notification configurations with render functions
- **Rich Content**: Support for titles, descriptions, icons, images, and links in notifications
- **Sound Manager**: Web Audio API integration for audio feedback per notification type
- **Haptic Manager**: Vibration patterns for mobile devices with reduced motion support
- **Notification Center**: Persistent history panel with unread counts, mark as read, and filters
- **Svelte Bindings**: New `@theaccessibleteam/a11y-feedback-svelte` package with reactive stores
- **Angular Bindings**: New `@theaccessibleteam/a11y-feedback-angular` package with injectable service

### Changed
- All framework bindings updated to v2.0.0
- Extended `FeedbackOptions` with new v2.0 options (actions, richContent, group, sound, haptic)
- Extended `FeedbackConfig` with new configuration (sounds, haptics, keyboard, grouping, history)
- Visual module now integrates with all v2.0 features
- i18n module extended with dialog translations

### Migration Guide
- The library is backwards compatible - existing v1.x code will continue to work
- New features are opt-in via configuration or explicit API calls

## [1.1.0] - 2024-12-23

### Added
- Comprehensive demo site enhancements with mobile navigation
- Interactive API playground with live code execution
- Screen reader simulation panel showing real-time announcements
- Form validation demo with accessible error handling
- Framework integration examples (React, Vue, Vanilla JS)
- Advanced patterns and recipes documentation
- Comparison table with other notification libraries
- Event system API (`onFeedback`, `onAnyFeedback`, `offFeedback`)
- Internationalization support (i18n) with locale configuration
- CSS theming system with custom properties
- CSP nonce support for style injection
- React bindings package (`@theaccessibleteam/a11y-feedback-react`)
- Vue bindings package (`@theaccessibleteam/a11y-feedback-vue`)
- Monorepo structure with pnpm workspaces

### Changed
- Repository renamed from `npm-extention` to `a11y-feedback` for clarity
- Updated all documentation and links to reflect new repository name
- Enhanced README with framework integration examples
- Improved demo site with better visual hierarchy and styling

### Fixed
- Demo site functionality issues with library loading
- HTML attribute encoding in code examples
- Script tag execution errors in documentation

## [1.0.1] - 2024-12-23

### Added
- Live demo site at https://wolfieeee.github.io/a11y-feedback/
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

[2.0.0]: https://github.com/WOLFIEEEE/a11y-feedback/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/WOLFIEEEE/a11y-feedback/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/WOLFIEEEE/a11y-feedback/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/WOLFIEEEE/a11y-feedback/releases/tag/v1.0.0
