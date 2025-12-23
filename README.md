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
  <a href="https://github.com/WOLFIEEEE/npm-extention"><img src="https://img.shields.io/github/stars/WOLFIEEEE/npm-extention?style=flat-square&color=f59e0b" alt="GitHub stars"></a>
  <a href="https://github.com/WOLFIEEEE/npm-extention/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="License"></a>
  <a href="https://bundlephobia.com/package/@theaccessibleteam/a11y-feedback"><img src="https://img.shields.io/bundlephobia/minzip/@theaccessibleteam/a11y-feedback?style=flat-square&color=10b981" alt="Bundle size"></a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square" alt="TypeScript">
</p>

<p align="center">
  <a href="https://wolfieeee.github.io/npm-extention/"><strong>Live Demo</strong></a> · 
  <a href="#installation">Installation</a> · 
  <a href="#quick-start">Quick Start</a> · 
  <a href="#framework-integration">Frameworks</a> · 
  <a href="#api-reference">API</a> · 
  <a href="https://github.com/WOLFIEEEE/npm-extention">GitHub</a>
</p>

---

## Why This Library?

**`aria-live` alone is not enough.**

Most web apps implement feedback using ad-hoc live regions, visual toast libraries, and manual focus hacks. This leads to:

| Problem | Impact |
|---------|--------|
| Duplicate announcements | Screen reader users hear the same message multiple times |
| Focus theft | Success messages incorrectly steal focus from user's current task |
| Over-announcement | Cognitive overload from too many rapid notifications |
| Missing announcements | Critical errors never reach assistive technology users |
| WCAG violations | Auto-dismissing errors violate 2.2.1 Timing Adjustable |

**a11y-feedback** provides a **centralized, accessibility-first feedback layer** that is:

- **Safe by default** — Correct ARIA semantics enforced, not configurable
- **Hard to misuse** — Focus rules prevent common accessibility mistakes
- **Predictable** — Consistent behavior across all screen readers
- **Framework-agnostic** — Works with React, Vue, Svelte, Angular, or vanilla JS

---

## Installation

```bash
npm install @theaccessibleteam/a11y-feedback
```

<details>
<summary><strong>Other package managers</strong></summary>

```bash
# Yarn
yarn add @theaccessibleteam/a11y-feedback

# pnpm
pnpm add @theaccessibleteam/a11y-feedback

# Bun
bun add @theaccessibleteam/a11y-feedback
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

// Simple notifications with enforced ARIA semantics
notify.success('Profile updated successfully')  // role="status", aria-live="polite"
notify.error('Invalid email address')           // role="alert", aria-live="assertive"
notify.warning('Session expires in 5 minutes')  // role="alert", aria-live="assertive"
notify.info('New features available')           // role="status", aria-live="polite"
notify.loading('Saving changes...')             // role="status", aria-live="polite"
```

### Error with Focus Management

```typescript
// Move focus to the error source (only allowed for error/warning)
notify.error('Please enter a valid email', {
  focus: '#email',
  explainFocus: true
})
// Screen reader announces: "Please enter a valid email. Focus moved to Email field."
```

### Loading → Success Pattern

```typescript
// Start loading (use ID for replacement)
notify.loading('Saving...', { id: 'save-op' })

// Replace with success (same ID = no duplicate announcement)
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

## Framework Integration

### React

Install the React bindings:

```bash
npm install @theaccessibleteam/a11y-feedback @theaccessibleteam/a11y-feedback-react
```

**Using the Hook (Recommended)**

```tsx
import { useA11yFeedback } from '@theaccessibleteam/a11y-feedback-react'
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

// Configure once at app startup
configureFeedback({ visual: true })

function SaveButton() {
  const feedback = useA11yFeedback()

  const handleSave = async () => {
    feedback.loading('Saving...', { id: 'save' })

    try {
      await saveData()
      feedback.success('Saved successfully!', { id: 'save' })
    } catch (error) {
      feedback.error('Failed to save. Please try again.', { 
        id: 'save',
        focus: '#save-btn'
      })
    }
  }

  return <button id="save-btn" onClick={handleSave}>Save</button>
}
```

**Using the Provider**

```tsx
import { A11yFeedbackProvider, useA11yFeedbackContext } from '@theaccessibleteam/a11y-feedback-react'

function App() {
  return (
    <A11yFeedbackProvider config={{ visual: true }} debug>
      <MyApp />
    </A11yFeedbackProvider>
  )
}

function MyComponent() {
  const { success, error } = useA11yFeedbackContext()
  // Use success(), error(), etc.
}
```

### Vue 3

Install the Vue bindings:

```bash
npm install @theaccessibleteam/a11y-feedback @theaccessibleteam/a11y-feedback-vue
```

**Using the Composable**

```vue
<script setup lang="ts">
import { useA11yFeedback } from '@theaccessibleteam/a11y-feedback-vue'
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

// Configure once
configureFeedback({ visual: true })

const feedback = useA11yFeedback()

async function handleSubmit() {
  feedback.loading('Submitting...', { id: 'submit' })

  try {
    await submitForm()
    feedback.success('Form submitted!', { id: 'submit' })
  } catch (e) {
    feedback.error('Submission failed', { id: 'submit' })
  }
}
</script>

<template>
  <button @click="handleSubmit">Submit</button>
</template>
```

**Using the Plugin**

```typescript
// main.ts
import { createApp } from 'vue'
import { a11yFeedbackPlugin } from '@theaccessibleteam/a11y-feedback-vue'
import App from './App.vue'

const app = createApp(App)

app.use(a11yFeedbackPlugin, {
  config: { visual: true, visualPosition: 'top-right' },
  debug: import.meta.env.DEV
})

app.mount('#app')
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://unpkg.com/@theaccessibleteam/a11y-feedback/dist/a11y-feedback.umd.js"></script>
</head>
<body>
  <button id="save-btn">Save</button>
  
  <script>
    const { notify, configureFeedback } = window.A11yFeedback
    
    // Enable visual toasts
    configureFeedback({ visual: true })
    
    document.getElementById('save-btn').addEventListener('click', async () => {
      notify.loading('Saving...', { id: 'save' })
      
      try {
        await fetch('/api/save', { method: 'POST' })
        notify.success('Saved!', { id: 'save' })
      } catch (e) {
        notify.error('Failed to save', { id: 'save' })
      }
    })
  </script>
</body>
</html>
```

---

## Semantic Mappings (Enforced)

These mappings are **non-configurable** to prevent accessibility misuse:

| Type     | ARIA Role | aria-live   | Priority | Can Move Focus | Auto-Dismiss |
|----------|-----------|-------------|----------|----------------|--------------|
| success  | `status`  | `polite`    | Low      | No             | Yes          |
| info     | `status`  | `polite`    | Low      | No             | Yes          |
| loading  | `status`  | `polite`    | Low      | No             | No           |
| warning  | `alert`   | `assertive` | High     | Yes            | Yes          |
| error    | `alert`   | `assertive` | High     | Yes            | No           |

**Why these mappings?**

- **Success/Info**: Non-urgent, should not interrupt. Uses `polite` so screen reader waits.
- **Loading**: Status update, never auto-dismisses (replaced by success/error).
- **Warning**: Important but not critical. Can move focus if needed.
- **Error**: Critical, must not auto-dismiss (WCAG 2.2.1). Can move focus to source.

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

### FeedbackOptions

```typescript
interface FeedbackOptions {
  id?: string           // Unique ID for deduplication/replacement
  focus?: string        // CSS selector for focus target (error/warning only)
  explainFocus?: boolean // Announce "Focus moved to [element]"
  force?: boolean       // Force re-announcement of identical messages
  timeout?: number      // Auto-dismiss timeout in ms (not for errors)
  className?: string    // Custom CSS class for visual feedback
  onDismiss?: () => void // Callback when dismissed
}
```

### configureFeedback

```typescript
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

configureFeedback({
  visual: true,                    // Enable visual toasts
  defaultTimeout: 5000,            // Default auto-dismiss (ms)
  visualPosition: 'top-right',     // Position: top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
  maxVisualItems: 5,               // Max visible toasts
  debug: false,                    // Enable console logging
  cspNonce: 'abc123',              // CSP nonce for style injection
  locale: 'en',                    // i18n locale
  rtl: 'auto',                     // RTL support: true, false, 'auto'
  translations: {                  // Custom translations
    dismiss: 'Close',
    notificationsLabel: 'Alerts'
  }
})
```

### Event System

Subscribe to feedback events for analytics, logging, or custom behavior:

```typescript
import { onFeedback, onAnyFeedback, offFeedback } from '@theaccessibleteam/a11y-feedback'

// Listen to specific event types
const unsubscribe = onFeedback('announced', ({ event, region }) => {
  console.log(`Announced "${event.message}" to ${region} region`)
  analytics.track('feedback', { type: event.type, message: event.message })
})

// Listen to all events
onAnyFeedback((type, payload) => {
  console.log(`Event: ${type}`, payload)
})

// One-time listener
onceFeedback('announced', ({ event }) => {
  console.log('First announcement:', event.message)
})

// Unsubscribe
unsubscribe()

// Remove all listeners for a type
offFeedback('announced')
```

**Available Events:**
- `announced` - Message was announced to screen reader
- `replaced` - Message replaced a previous one (same ID)
- `deduped` - Message was skipped (duplicate)
- `dismissed` - Visual feedback was dismissed
- `focusMoved` - Focus was moved to an element
- `visualShown` - Visual toast was displayed

### Internationalization (i18n)

```typescript
import { 
  configureFeedback, 
  registerLocale, 
  getAvailableLocales,
  isRTL 
} from '@theaccessibleteam/a11y-feedback'

// Use built-in locale (en, es, fr, de, it, pt, ja, zh, ko, ar, he)
configureFeedback({ locale: 'es' })

// Register custom locale
registerLocale('custom', {
  dismiss: 'Fermer',
  notificationsLabel: 'Notifications',
  focusMovedTo: 'Focus déplacé vers {label}.'
})

// Check RTL mode
console.log(isRTL()) // true for ar, he locales

// Get available locales
console.log(getAvailableLocales()) // ['en', 'es', 'fr', ...]
```

### Theming with CSS Custom Properties

```css
:root {
  /* Colors */
  --a11y-feedback-bg: #1f2937;
  --a11y-feedback-text: #f9fafb;
  --a11y-feedback-success: #10b981;
  --a11y-feedback-error: #ef4444;
  --a11y-feedback-warning: #f59e0b;
  --a11y-feedback-info: #3b82f6;
  --a11y-feedback-loading: #8b5cf6;
  
  /* Layout */
  --a11y-feedback-max-width: 24rem;
  --a11y-feedback-padding: 0.875rem 1rem;
  --a11y-feedback-border-radius: 0.5rem;
  --a11y-feedback-gap: 0.5rem;
  
  /* Typography */
  --a11y-feedback-font-family: system-ui, sans-serif;
  --a11y-feedback-font-size: 0.875rem;
  
  /* Animation */
  --a11y-feedback-transition-duration: 0.2s;
}
```

### Debug & Telemetry

```typescript
import { 
  enableFeedbackDebug, 
  disableFeedbackDebug,
  getFeedbackLog,
  getFeedbackStats,
  clearFeedbackLog
} from '@theaccessibleteam/a11y-feedback'

// Enable debug logging
enableFeedbackDebug()

// Get event log
const log = getFeedbackLog()
console.log(log)
// [{ id, message, type, timestamp, region, focusMoved, ... }, ...]

// Get statistics
const stats = getFeedbackStats()
console.log(stats)
// { total: 42, byType: { success: 20, error: 10, ... }, deduped: 5 }

// Clear log
clearFeedbackLog()
```

### Visual Feedback Control

```typescript
import { 
  dismissVisualFeedback, 
  dismissAllVisualFeedback,
  getActiveVisualCount 
} from '@theaccessibleteam/a11y-feedback'

// Dismiss specific notification
dismissVisualFeedback('my-notification-id')

// Dismiss all
dismissAllVisualFeedback()

// Get count
console.log(getActiveVisualCount()) // 3
```

---

## Advanced Patterns

### Form Validation

```typescript
import { notify } from '@theaccessibleteam/a11y-feedback'

async function validateForm(form: HTMLFormElement) {
  const email = form.querySelector<HTMLInputElement>('#email')
  const password = form.querySelector<HTMLInputElement>('#password')
  
  // Validate email
  if (!email?.value.includes('@')) {
    notify.error('Please enter a valid email address', {
      focus: '#email',
      explainFocus: true
    })
    return false
  }
  
  // Validate password
  if ((password?.value.length ?? 0) < 8) {
    notify.error('Password must be at least 8 characters', {
      focus: '#password',
      explainFocus: true
    })
    return false
  }
  
  return true
}
```

### Async Operations with Loading State

```typescript
async function fetchData() {
  const operationId = 'fetch-data'
  
  notify.loading('Loading data...', { id: operationId })
  
  try {
    const response = await fetch('/api/data')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    notify.success(`Loaded ${data.items.length} items`, { id: operationId })
    return data
    
  } catch (error) {
    notify.error('Failed to load data. Please try again.', { 
      id: operationId,
      onDismiss: () => console.log('User acknowledged error')
    })
    throw error
  }
}
```

### Toast Queue with Rate Limiting

```typescript
import { notify, configureFeedback } from '@theaccessibleteam/a11y-feedback'

configureFeedback({
  visual: true,
  maxVisualItems: 3  // Only show 3 at a time
})

// Rapid notifications are automatically deduplicated
for (let i = 0; i < 10; i++) {
  notify.info('Processing item...') // Only announced once
}

// Use force to bypass deduplication
notify.info('Retry attempt', { force: true })
```

### Multi-Step Wizard

```typescript
const wizardSteps = ['Personal Info', 'Address', 'Payment', 'Review']

function goToStep(stepIndex: number) {
  const stepName = wizardSteps[stepIndex]
  
  // Announce step change
  notify.info(`Step ${stepIndex + 1} of ${wizardSteps.length}: ${stepName}`, {
    id: 'wizard-step'  // Replace previous step announcement
  })
  
  // Focus first field
  const firstField = document.querySelector(`#step-${stepIndex} input, #step-${stepIndex} select`)
  firstField?.focus()
}
```

### Real-Time Updates

```typescript
import { notify, onFeedback } from '@theaccessibleteam/a11y-feedback'

// Track announcements for analytics
onFeedback('announced', ({ event }) => {
  gtag('event', 'accessibility_announcement', {
    type: event.type,
    message: event.message.substring(0, 100)
  })
})

// WebSocket message handling
socket.on('message', (data) => {
  switch (data.type) {
    case 'new-order':
      notify.success(`New order #${data.orderId} received`)
      break
    case 'low-stock':
      notify.warning(`Low stock: ${data.product} (${data.quantity} left)`)
      break
    case 'system-error':
      notify.error(data.message, { focus: '#status-panel' })
      break
  }
})
```

### SSR/SSG Compatibility

```typescript
import { notify, configureFeedback } from '@theaccessibleteam/a11y-feedback'

// Safe for server-side rendering
if (typeof window !== 'undefined') {
  configureFeedback({ visual: true })
  
  // Notifications only work client-side
  notify.info('Welcome!')
}
```

---

## Comparison with Alternatives

| Feature | a11y-feedback | react-toastify | sonner | react-hot-toast |
|---------|---------------|----------------|--------|-----------------|
| **Screen Reader Support** | Built-in, enforced | Manual setup | Manual | Manual |
| **Focus Management** | Enforced rules | None | None | None |
| **WCAG Compliance** | Automatic | Manual | Manual | Manual |
| **Deduplication** | Built-in | None | None | None |
| **Framework** | Any | React only | React only | React only |
| **Zero Dependencies** | Yes | No | No | No |
| **Bundle Size** | ~8KB gzip | ~14KB | ~4KB | ~5KB |
| **TypeScript** | Full | Full | Full | Full |
| **RTL Support** | Built-in | Manual | Manual | Manual |
| **i18n** | Built-in | Manual | Manual | Manual |

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

**Screen Reader Tested:**
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- JAWS (Windows)
- TalkBack (Android)

---

## TypeScript Support

Full TypeScript support with strict types:

```typescript
import type {
  FeedbackType,        // 'success' | 'error' | 'warning' | 'info' | 'loading'
  FeedbackOptions,     // Options for notify calls
  FeedbackEvent,       // Event object returned from notify
  FeedbackConfig,      // Configuration options
  FeedbackLogEntry,    // Debug log entry
  FeedbackTranslations // i18n translations
} from '@theaccessibleteam/a11y-feedback'
```

---

## Troubleshooting

### Screen reader not announcing messages

1. **Check for duplicate live regions**: Only one live region per politeness level should exist
2. **Verify timing**: Rapid announcements may be throttled
3. **Test with force option**: `notify.info('Test', { force: true })`

### Visual toasts not appearing

1. **Enable visual mode**: `configureFeedback({ visual: true })`
2. **Check z-index conflicts**: The container uses `z-index: 9999`
3. **Verify CSP**: If using CSP, provide a nonce

### Focus not moving on error

1. **Check focus target exists**: The CSS selector must match an element
2. **Verify focusability**: Element must be focusable (input, button, or tabindex)
3. **Only error/warning can move focus**: Success/info are blocked by design

### CSP blocking styles

```typescript
// Get nonce from your server
const nonce = document.querySelector('meta[name="csp-nonce"]')?.content

configureFeedback({
  visual: true,
  cspNonce: nonce
})
```

---

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone and install
git clone https://github.com/WOLFIEEEE/npm-extention.git
cd npm-extention
npm install

# Development
npm run dev       # Start dev server
npm run build     # Build library
npm run test      # Run tests
npm run lint      # Lint code
```

---

## Security

See our [Security Policy](SECURITY.md) for reporting vulnerabilities.

---

## License

MIT © [The Accessible Team](https://github.com/WOLFIEEEE)

---

<p align="center">
  <sub>Built with accessibility in mind. Making the web usable for everyone.</sub>
</p>
