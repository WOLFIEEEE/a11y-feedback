<p align="center">
  <img src="https://raw.githubusercontent.com/WOLFIEEEE/a11y-feedback/main/docs/assets/logo.svg" alt="a11y-feedback" width="120" height="120">
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
  <a href="https://github.com/WOLFIEEEE/a11y-feedback/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="License"></a>
  <a href="https://bundlephobia.com/package/@theaccessibleteam/a11y-feedback"><img src="https://img.shields.io/bundlephobia/minzip/@theaccessibleteam/a11y-feedback?style=flat-square&color=10b981" alt="Bundle size"></a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square" alt="TypeScript">
</p>

<p align="center">
  <a href="https://wolfieeee.github.io/a11y-feedback/"><strong>🔴 Live Demo</strong></a> · 
  <a href="#installation">Installation</a> · 
  <a href="#quick-start">Quick Start</a> · 
  <a href="#api-reference">API</a> · 
  <a href="https://github.com/WOLFIEEEE/a11y-feedback">GitHub</a>
</p>

---

## ✨ What's New in v2.0

- 🎯 **Action Buttons** — Interactive buttons within notifications
- 📊 **Progress Notifications** — Built-in progress bars for uploads/downloads
- 💬 **Accessible Dialogs** — Promise-based `confirm()` and `prompt()`
- 📝 **Notification Templates** — Reusable notification patterns
- 🎨 **Rich Content** — Icons, styled text, and links
- 🔔 **Sound & Haptic Feedback** — Optional audio and vibration
- 📋 **Notification Center** — History panel for past notifications
- ⌨️ **Keyboard Navigation** — Full keyboard support
- 🔗 **Framework Bindings** — React, Vue, Svelte, and Angular packages

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
- ✅ **Framework-agnostic** — Works with React, Vue, Svelte, Angular, or vanilla JS

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

## v2.0 Features

### Action Buttons

```typescript
notify.success('Item deleted', {
  actions: [
    { label: 'Undo', onClick: () => restoreItem(), variant: 'primary' }
  ]
})
```

### Progress Notifications

```typescript
import { notify, updateProgress } from '@theaccessibleteam/a11y-feedback'

notify.info('Uploading...', {
  id: 'upload',
  progress: { value: 0, max: 100 }
})

updateProgress('upload', 50) // 50%
```

### Accessible Dialogs

```typescript
import { confirm, prompt } from '@theaccessibleteam/a11y-feedback'

const confirmed = await confirm({
  title: 'Delete Item?',
  message: 'This action cannot be undone.'
})

const result = await prompt({
  title: 'Rename File',
  defaultValue: 'document.pdf'
})
```

### Sound & Haptics

```typescript
configureFeedback({
  enableSound: true,
  enableHaptics: true
})

notify.error('Error!', { sound: true, haptic: true })
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

## Framework Bindings

| Package | Install |
|---------|---------|
| React | `npm i @theaccessibleteam/a11y-feedback-react` |
| Vue | `npm i @theaccessibleteam/a11y-feedback-vue` |
| Svelte | `npm i @theaccessibleteam/a11y-feedback-svelte` |
| Angular | `npm i @theaccessibleteam/a11y-feedback-angular` |

---

## API Reference

### notify

```typescript
// Base function
notify({ message: 'Hello', type: 'info', options: { id: 'my-id' } })

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
  id?: string                     // Unique ID for deduplication/replacement
  focus?: string                  // CSS selector for focus target
  explainFocus?: boolean          // Announce focus movement
  force?: boolean                 // Force re-announcement
  timeout?: number                // Auto-dismiss timeout in ms
  className?: string              // Custom CSS class
  onDismiss?: () => void          // Callback when dismissed
  actions?: NotificationAction[]  // Action buttons
  progress?: ProgressOptions      // Progress bar
  richContent?: RichContent       // Rich content (icons, links)
  sound?: boolean                 // Play sound
  haptic?: boolean                // Trigger haptic feedback
}
```

### configureFeedback

```typescript
configureFeedback({
  visual: true,
  defaultTimeout: 5000,
  visualPosition: 'top-right',
  maxVisualItems: 5,
  enableSound: false,
  enableHaptics: false,
  locale: 'en',
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

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

---

## Bundle Size

- **ESM**: ~86KB (minified)
- **CJS**: ~72KB (minified)  
- **UMD**: ~72KB (minified)
- **Gzipped**: ~22KB
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
  NotificationAction,
  ProgressOptions,
  RichContent,
  ConfirmOptions,
  PromptOptions
} from '@theaccessibleteam/a11y-feedback'
```

---

## Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/WOLFIEEEE/a11y-feedback/blob/main/CONTRIBUTING.md) for details.

```bash
git clone https://github.com/WOLFIEEEE/a11y-feedback.git
cd a11y-feedback
pnpm install

pnpm build    # Build the library
pnpm test     # Run tests
pnpm lint     # Lint code
```

---

## License

MIT © [The Accessible Team](https://github.com/WOLFIEEEE)

---

<p align="center">
  <sub>Built with ♿ accessibility in mind</sub>
</p>
