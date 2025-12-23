/**
 * Constants and semantic mappings for a11y-feedback
 * @module constants
 */

import type { FeedbackType, FeedbackSemantics, FeedbackConfig } from './types'

/**
 * Enforced semantic mappings for each feedback type
 * These mappings ensure correct ARIA roles and behaviors
 * and are intentionally non-configurable to prevent misuse
 */
export const FEEDBACK_SEMANTICS: Readonly<Record<FeedbackType, FeedbackSemantics>> = {
  success: {
    role: 'status',
    ariaLive: 'polite',
    priority: 'low',
    canMoveFocus: false,
    autoDismiss: true,
  },
  info: {
    role: 'status',
    ariaLive: 'polite',
    priority: 'low',
    canMoveFocus: false,
    autoDismiss: true,
  },
  loading: {
    role: 'status',
    ariaLive: 'polite',
    priority: 'low',
    canMoveFocus: false,
    autoDismiss: false,
  },
  warning: {
    role: 'alert',
    ariaLive: 'assertive',
    priority: 'high',
    canMoveFocus: true,
    autoDismiss: true,
  },
  error: {
    role: 'alert',
    ariaLive: 'assertive',
    priority: 'high',
    canMoveFocus: true,
    autoDismiss: false,
  },
} as const

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Readonly<FeedbackConfig> = {
  visual: false,
  defaultTimeout: 5000,
  visualContainer: null,
  visualPosition: 'top-right',
  maxVisualItems: 5,
  debug: false,
  regionPrefix: 'a11y-feedback',
} as const

/**
 * Timeout values for different feedback types (in milliseconds)
 */
export const DEFAULT_TIMEOUTS: Readonly<Record<FeedbackType, number>> = {
  success: 5000,
  info: 5000,
  loading: 0, // Never auto-dismiss
  warning: 8000,
  error: 0, // Never auto-dismiss
} as const

/**
 * Minimum delay between announcements to the same region (in milliseconds)
 * Prevents rapid-fire announcements that could overwhelm screen readers
 */
export const ANNOUNCEMENT_DEBOUNCE_MS = 100

/**
 * Delay after clearing region before injecting new content (in milliseconds)
 * Ensures screen readers detect the content change
 */
export const REGION_CLEAR_DELAY_MS = 50

/**
 * Zero-width characters used for forcing re-announcements
 * These characters are invisible but create unique content for screen readers
 */
export const ZERO_WIDTH_CHARS = [
  '\u200B', // Zero-width space
  '\u200C', // Zero-width non-joiner
  '\u200D', // Zero-width joiner
  '\uFEFF', // Zero-width no-break space
] as const

/**
 * CSS for visually hidden elements (screen reader only)
 * This ensures elements are accessible to screen readers but not visible
 */
export const VISUALLY_HIDDEN_STYLES = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

/**
 * Live region element IDs
 */
export const REGION_IDS = {
  polite: 'polite',
  assertive: 'assertive',
} as const

/**
 * Data attributes used by the library
 */
export const DATA_ATTRIBUTES = {
  region: 'data-a11y-feedback',
  visual: 'data-a11y-feedback-visual',
  visualItem: 'data-a11y-feedback-item',
  feedbackId: 'data-feedback-id',
  feedbackType: 'data-feedback-type',
} as const

/**
 * CSS class names for visual feedback
 */
export const CSS_CLASSES = {
  container: 'a11y-feedback-container',
  item: 'a11y-feedback-item',
  itemSuccess: 'a11y-feedback-item--success',
  itemError: 'a11y-feedback-item--error',
  itemWarning: 'a11y-feedback-item--warning',
  itemInfo: 'a11y-feedback-item--info',
  itemLoading: 'a11y-feedback-item--loading',
  dismissButton: 'a11y-feedback-dismiss',
  entering: 'a11y-feedback-entering',
  exiting: 'a11y-feedback-exiting',
  reducedMotion: 'a11y-feedback-reduced-motion',
} as const

/**
 * Visual feedback position styles
 */
export const POSITION_STYLES: Record<FeedbackConfig['visualPosition'], string> = {
  'top-left': 'top: 1rem; left: 1rem;',
  'top-right': 'top: 1rem; right: 1rem;',
  'bottom-left': 'bottom: 1rem; left: 1rem;',
  'bottom-right': 'bottom: 1rem; right: 1rem;',
  'top-center': 'top: 1rem; left: 50%; transform: translateX(-50%);',
  'bottom-center': 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
} as const
