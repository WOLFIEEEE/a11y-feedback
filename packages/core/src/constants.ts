/**
 * Constants and semantic mappings for a11y-feedback
 * @module constants
 */

import type { FeedbackType, FeedbackSemantics, FeedbackConfig, VisualPosition, VibratePattern } from './types'

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
export const POSITION_STYLES: Record<VisualPosition, string> = {
  'top-left': 'top: 1rem; left: 1rem;',
  'top-right': 'top: 1rem; right: 1rem;',
  'bottom-left': 'bottom: 1rem; left: 1rem;',
  'bottom-right': 'bottom: 1rem; right: 1rem;',
  'top-center': 'top: 1rem; left: 50%; transform: translateX(-50%);',
  'bottom-center': 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
} as const

// ============================================================================
// V2.0 Constants
// ============================================================================

/**
 * Default keyboard shortcuts
 */
export const DEFAULT_KEYBOARD_SHORTCUTS = {
  dismiss: 'Escape',
  toggleCenter: 'Alt+Shift+N',
  focusNext: 'Tab',
  focusPrev: 'Shift+Tab',
  activate: 'Enter',
  activateAlt: 'Space',
} as const

/**
 * Default haptic patterns for each feedback type
 */
export const DEFAULT_HAPTIC_PATTERNS: Readonly<Record<FeedbackType, VibratePattern>> = {
  success: [50],
  info: [30],
  loading: [20, 50, 20],
  warning: [100, 50, 100],
  error: [200, 100, 200],
} as const

/**
 * Progress announcement intervals (percentage)
 */
export const DEFAULT_PROGRESS_ANNOUNCE_AT = [25, 50, 75, 100] as const

/**
 * CSS classes for v2.0 features
 */
export const CSS_CLASSES_V2 = {
  // Actions
  actions: 'a11y-feedback-actions',
  actionButton: 'a11y-feedback-action',
  actionPrimary: 'a11y-feedback-action--primary',
  actionSecondary: 'a11y-feedback-action--secondary',
  actionDanger: 'a11y-feedback-action--danger',
  
  // Progress
  progress: 'a11y-feedback-progress',
  progressBar: 'a11y-feedback-progress-bar',
  progressIndeterminate: 'a11y-feedback-progress--indeterminate',
  
  // Rich content
  richContent: 'a11y-feedback-rich',
  richTitle: 'a11y-feedback-rich-title',
  richDescription: 'a11y-feedback-rich-description',
  richIcon: 'a11y-feedback-rich-icon',
  richImage: 'a11y-feedback-rich-image',
  richLink: 'a11y-feedback-rich-link',
  
  // Grouping
  group: 'a11y-feedback-group',
  groupHeader: 'a11y-feedback-group-header',
  groupBadge: 'a11y-feedback-group-badge',
  groupCollapsed: 'a11y-feedback-group--collapsed',
  groupExpanded: 'a11y-feedback-group--expanded',
  
  // Notification center
  center: 'a11y-feedback-center',
  centerTrigger: 'a11y-feedback-center-trigger',
  centerBadge: 'a11y-feedback-center-badge',
  centerPanel: 'a11y-feedback-center-panel',
  centerHeader: 'a11y-feedback-center-header',
  centerList: 'a11y-feedback-center-list',
  centerEmpty: 'a11y-feedback-center-empty',
  
  // Dialogs
  dialog: 'a11y-feedback-dialog',
  dialogBackdrop: 'a11y-feedback-dialog-backdrop',
  dialogContent: 'a11y-feedback-dialog-content',
  dialogTitle: 'a11y-feedback-dialog-title',
  dialogInput: 'a11y-feedback-dialog-input',
  dialogActions: 'a11y-feedback-dialog-actions',
  
  // States
  focused: 'a11y-feedback-focused',
  unread: 'a11y-feedback-unread',
} as const

/**
 * Default sounds (base64 encoded short beeps)
 * These are placeholder - actual sounds should be provided by user
 */
export const DEFAULT_SOUNDS: Readonly<Record<FeedbackType, string | null>> = {
  success: null, // Users should provide their own
  info: null,
  loading: null,
  warning: null,
  error: null,
} as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  history: 'a11y-feedback-history',
  preferences: 'a11y-feedback-prefs',
} as const

