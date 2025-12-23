<p align="center">
  <img src="https://raw.githubusercontent.com/WOLFIEEEE/npm-extention/main/docs/assets/logo.svg" alt="a11y-feedback" width="120" height="120">
</p>

<h1 align="center">a11y-feedback</h1>

<p align="center">
  <strong>Production-grade accessibility feedback engine for the web</strong>
</p>

<p align="center">
  Unified screen reader announcements, semantic feedback, focus management, and WCAG-compliant notifications — all in one predictable API.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@theaccessibleteam/a11y-feedback"><img src="https://img.shields.io/npm/v/@theaccessibleteam/a11y-feedback.svg?style=flat-square&color=6366f1" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@theaccessibleteam/a11y-feedback"><img src="https://img.shields.io/npm/dm/@theaccessibleteam/a11y-feedback.svg?style=flat-square&color=22d3ee" alt="npm downloads"></a>
  <a href="https://github.com/WOLFIEEEE/npm-extention/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="License"></a>
  <a href="https://bundlephobia.com/package/@theaccessibleteam/a11y-feedback"><img src="https://img.shields.io/bundlephobia/minzip/@theaccessibleteam/a11y-feedback?style=flat-square&color=10b981" alt="Bundle size"></a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square" alt="TypeScript">
</p>

<p align="center">
  <a href="https://wolfieeee.github.io/npm-extention/"><strong>🔴 Live Demo</strong></a> · 
  <a href="#installation">Installation</a> · 
  <a href="#quick-start">Quick Start</a> · 
  <a href="#api-reference">API</a> · 
  <a href="https://github.com/WOLFIEEEE/npm-extention">GitHub</a>
</p>

---

## Why This Library?

**`aria-live` alone is not enough.**

Most web apps implement feedback using ad-hoc live regions, visual toast libraries, and manual focus hacks. This leads to:

- ❌ Duplicate or missing screen reader announcements
- ❌ Focus being stolen incorrectly
- ❌ Over-announcement and cognitive overload
- ❌ Unintentional WCAG violations

**a11y-feedback** provides a **centralized, accessibility-first feedback layer** that is:

- ✅ **Safe by default** — Correct ARIA semantics enforced
- ✅ **Hard to misuse** — Focus rules prevent common mistakes  
- ✅ **Predictable** — Consistent across all screen readers
- ✅ **Framework-agnostic** — Works with React, Vue, Svelte, or vanilla JS

---

## Installation

```bash
npm install @theaccessibleteam/a11y-feedback
```

<details>
<summary>Other package managers</summary>

```bash
# Yarn
yarn add @theaccessibleteam/a11y-feedback

# pnpm
pnpm add @theaccessibleteam/a11y-feedback
```

</details>

### CDN Usage

```html
<script src="https://unpkg.com/@theaccessibleteam/a11y-feedback/dist/a11y-feedback.umd.js"></script>
<script>
  const { notify } = window.A11yFeedback
  notify.success('Hello from CDN!')
</script>
```

---

## Quick Start

```typescript
import { notify } from '@theaccessibleteam/a11y-feedback'

// Sugar helpers for common patterns
notify.success('Profile updated successfully')
notify.error('Invalid email address')
notify.warning('Session expires in 5 minutes')
notify.info('New features available')
notify.loading('Saving changes...')
```

### Error with Focus Management

```typescript
notify.error('Please enter a valid email', {
  focus: '#email',
  explainFocus: true
})
// Screen reader: "Please enter a valid email. Focus moved to Email field."
```

### Loading → Success Pattern

```typescript
// Start loading
notify.loading('Saving...', { id: 'save-op' })

// Replace with success (same ID)
notify.success('Saved!', { id: 'save-op' })
```

### Enable Visual Toasts

```typescript
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

configureFeedback({
  visual: true,
  visualPosition: 'top-right',
  maxVisualItems: 5
})
```

---

## Semantic Mappings (Enforced)

| Type     | ARIA Role | aria-live   | Can Move Focus | Auto-Dismiss |
|----------|-----------|-------------|----------------|--------------|
| success  | `status`  | `polite`    | ❌ No          | ✅ Yes       |
| info     | `status`  | `polite`    | ❌ No          | ✅ Yes       |
| loading  | `status`  | `polite`    | ❌ No          | ❌ No        |
| warning  | `alert`   | `assertive` | ✅ Yes         | ✅ Yes       |
| error    | `alert`   | `assertive` | ✅ Yes         | ❌ No        |

These mappings are **non-configurable** to prevent accessibility misuse.

---

## API Reference

### notify

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
  id?: string           // Unique ID for deduplication/replacement
  focus?: string        // CSS selector for focus target (error/warning only)
  explainFocus?: boolean // Announce focus movement
  force?: boolean       // Force re-announcement of identical messages
  timeout?: number      // Auto-dismiss timeout in ms
  className?: string    // Custom CSS class for visual feedback
  onDismiss?: () => void // Callback when dismissed
}
```

### configureFeedback

```typescript
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

configureFeedback({
  visual: true,            // Enable visual toasts
  defaultTimeout: 5000,    // Default auto-dismiss (ms)
  visualPosition: 'top-right',
  maxVisualItems: 5,
  debug: false
})
```

### Debug & Telemetry

```typescript
import { 
  enableFeedbackDebug, 
  getFeedbackLog,
  getFeedbackStats 
} from '@theaccessibleteam/a11y-feedback'

enableFeedbackDebug()

const log = getFeedbackLog()
const stats = getFeedbackStats()
```

---

## Features

### Focus Safety Rules

| Rule | Enforced |
|------|----------|
| Success must not move focus | ✅ |
| Info must not move focus | ✅ |
| Loading must not move focus | ✅ |
| Warning may move focus | ✅ |
| Error may move focus | ✅ |

### Content Deduplication

Rapid duplicate messages are automatically skipped:

```typescript
notify.info('Loading data')
notify.info('Loading data') // Skipped (within 500ms)
```

### Re-announcement Engine

Screen readers may ignore repeated identical text. We guarantee announcements using:
- Content clearing
- Microtask delay
- Zero-width character injection

### WCAG 2.2 Compliance

- ✅ No critical message auto-dismisses
- ✅ Configurable timeouts for non-critical feedback  
- ✅ Users can dismiss visual feedback
- ✅ Respects `prefers-reduced-motion`
- ✅ Prevents WCAG 2.2.1 violations

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

---

## Bundle Size

- **ESM**: ~23KB (minified)
- **CJS**: ~19KB (minified)  
- **UMD**: ~19KB (minified)
- **Zero dependencies**

---

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  FeedbackType,
  FeedbackOptions,
  FeedbackEvent,
  FeedbackConfig,
  FeedbackLogEntry
} from '@theaccessibleteam/a11y-feedback'
```

---

## Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/WOLFIEEEE/npm-extention#contributing) for details.

```bash
# Clone and install
git clone https://github.com/WOLFIEEEE/npm-extention.git
cd npm-extention
npm install

# Development commands
npm run build    # Build the library
npm run test     # Run tests
npm run lint     # Lint code
```

---

## License

MIT © [The Accessible Team](https://github.com/WOLFIEEEE)

---

<p align="center">
  <sub>Built with ♿ accessibility in mind</sub>
</p>
