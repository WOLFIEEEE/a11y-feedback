# a11y-feedback

A production-grade, framework-agnostic accessibility feedback and announcement engine for the web.

`a11y-feedback` unifies **screen reader announcements**, **semantic feedback (success, error, info, loading)**, **focus management**, and **WCAG-safe timing behavior** under a single, predictable API.

**This library exists because `aria-live` alone is not enough.**

[![npm version](https://img.shields.io/npm/v/a11y-feedback.svg)](https://www.npmjs.com/package/a11y-feedback)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install a11y-feedback
```

```bash
yarn add a11y-feedback
```

```bash
pnpm add a11y-feedback
```

## Quick Start

```typescript
import { notify } from 'a11y-feedback'

// Basic usage with sugar helpers
notify.success('Profile updated successfully')
notify.error('Invalid email address')
notify.warning('Your session will expire in 5 minutes')
notify.info('New features available')
notify.loading('Saving changes...')
```

## Why This Library Exists

Most web applications implement feedback using a combination of:

- ad-hoc `aria-live` regions
- visual toast libraries
- manual focus hacks
- inconsistent timing and dismissal rules

This leads to:

- duplicate or missing screen reader announcements
- focus being stolen incorrectly
- over-announcement and cognitive overload
- WCAG violations introduced unintentionally

`a11y-feedback` provides a **centralized, opinionated, accessibility-first feedback layer** that is:

- safe by default
- hard to misuse
- predictable across screen readers
- framework-agnostic

## Core Principles

1. **Accessibility First** - Screen reader users are the primary audience. Visual UI is optional and secondary.

2. **Single Source of Truth** - One feedback event controls aria-live announcement, visual feedback, focus behavior, timing and dismissal.

3. **Correct Semantics, Enforced** - Developers cannot accidentally announce errors politely or move focus on success.

4. **Minimal, Not Simplistic** - Small API surface with powerful internal behavior.

5. **Framework Agnostic** - No React, Vue, or DOM abstraction assumptions.

## API Reference

### Main Functions

```typescript
import { notify, configureFeedback, enableFeedbackDebug, getFeedbackLog } from 'a11y-feedback'
```

### notify

The main function for triggering feedback:

```typescript
// Base function
notify({
  message: 'Hello',
  type: 'info',
  options: { id: 'my-notification' }
})

// Sugar helpers (recommended)
notify.success(message, options?)
notify.error(message, options?)
notify.warning(message, options?)
notify.info(message, options?)
notify.loading(message, options?)
```

### Options

```typescript
interface FeedbackOptions {
  // Unique identifier for deduplication/replacement
  id?: string

  // CSS selector for focus target (error/warning only)
  focus?: string

  // Announce focus movement to screen readers
  explainFocus?: boolean

  // Force re-announcement of identical messages
  force?: boolean

  // Auto-dismiss timeout in ms (not for errors)
  timeout?: number

  // Custom CSS class for visual feedback
  className?: string

  // Callback when dismissed
  onDismiss?: () => void
}
```

### configureFeedback

Configure global settings:

```typescript
configureFeedback({
  // Enable visual feedback rendering
  visual: true,

  // Default auto-dismiss timeout (ms)
  defaultTimeout: 5000,

  // Visual feedback position
  visualPosition: 'top-right',

  // Max visual items shown
  maxVisualItems: 5,

  // Enable debug logging
  debug: false,
})
```

## Feedback Types & Semantics

| Type    | ARIA Role | aria-live | Priority | Can Move Focus |
| ------- | --------- | --------- | -------- | -------------- |
| success | status    | polite    | low      | No             |
| info    | status    | polite    | low      | No             |
| loading | status    | polite    | low      | No             |
| warning | alert     | assertive | high     | Yes            |
| error   | alert     | assertive | high     | Yes            |

These mappings are **non-configurable** to prevent misuse.

## Usage Examples

### Basic Announcement

```typescript
notify.success('Profile updated successfully')
```

Screen reader: _"Profile updated successfully."_

### Error With Focus Management

```typescript
notify.error('Invalid email address', {
  focus: '#email',
  explainFocus: true,
})
```

Screen reader: _"Invalid email address. Focus moved to Email field."_

Rules enforced:

- Errors may move focus
- Success never steals focus
- Loading never traps focus

### Loading → Success Replacement

```typescript
// Start loading
notify.loading('Saving profile...', { id: 'profile-status' })

// Later, replace with success
notify.success('Profile saved', { id: 'profile-status' })
```

Result:

- Loading announcement is replaced
- No duplicate or overlapping announcements
- Visual and SR feedback stay in sync

### Force Re-announcement

Screen readers often ignore repeated identical text:

```typescript
notify.success('Saved', { force: true })
```

### Content-Based Deduplication

Rapid duplicate messages are automatically skipped:

```typescript
notify.info('Loading data')
notify.info('Loading data') // skipped (within 500ms)
```

## Visual Feedback

By default, the library is **screen-reader-only**. Enable visual feedback:

```typescript
configureFeedback({ visual: true })
```

Visual behavior:

- Minimal, accessible HTML output
- Respects `prefers-reduced-motion`
- Dismissible with keyboard
- Errors never auto-dismiss
- Configurable position and max items

### Dismiss Programmatically

```typescript
import { dismissVisualFeedback, dismissAllVisualFeedback } from 'a11y-feedback'

// Dismiss specific notification
dismissVisualFeedback('notification-id')

// Dismiss all
dismissAllVisualFeedback()
```

## Debug Mode

Enable verbose logging:

```typescript
import { enableFeedbackDebug, getFeedbackLog, getFeedbackStats } from 'a11y-feedback'

enableFeedbackDebug()

// Get event log
const log = getFeedbackLog()

// Get statistics
const stats = getFeedbackStats()
// { total: 10, byType: { success: 5, error: 2 }, ... }
```

## Live Region Management

Live regions are **automatically injected** and managed:

- Exactly two regions exist:
  - polite (`role="status"`, `aria-live="polite"`)
  - assertive (`role="alert"`, `aria-live="assertive"`)
- Regions are visually hidden using screen-reader-only CSS
- `display: none` is never used (breaks screen readers)

### Re-announcement Engine

Screen readers may ignore repeated identical text. `a11y-feedback` guarantees announcements using:

1. Content clearing
2. Microtask delay
3. Zero-width character injection
4. Safe DOM mutation ordering

## Focus Safety Rules (Enforced)

| Rule                            | Enforced |
| ------------------------------- | -------- |
| Success must not move focus     | ✓        |
| Info must not move focus        | ✓        |
| Loading must not move focus     | ✓        |
| Warning may move focus          | ✓        |
| Error may move focus            | ✓        |
| Focus movement can be announced | ✓        |

Attempting to move focus on `success`, `info`, or `loading` will be silently ignored and logged in debug mode.

## WCAG 2.2 Compliance

- No critical message auto-dismisses
- Timeouts are configurable for non-critical feedback
- Users can pause or dismiss visual feedback
- Prevents violations of WCAG 2.2.1 (Timing Adjustable)

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  FeedbackType,
  FeedbackOptions,
  FeedbackEvent,
  FeedbackConfig,
  FeedbackLogEntry,
} from 'a11y-feedback'
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES2020 support. For older browsers, use a transpiler.

## Bundle Size

- ESM: ~8KB (minified)
- CJS: ~8KB (minified)
- No dependencies

## What This Library Intentionally Does NOT Do

- No animations framework
- No CSS framework
- No design system
- No framework bindings in core
- No accessibility auditing

## License

MIT
