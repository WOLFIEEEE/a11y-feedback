/**
 * Core type definitions for a11y-feedback
 * @module types
 */

/**
 * Feedback types with enforced semantic mappings
 * These types determine ARIA roles, live region politeness, and focus behavior
 */
export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading'

/**
 * ARIA live region politeness levels
 */
export type AriaLive = 'polite' | 'assertive'

/**
 * ARIA roles used for feedback announcements
 */
export type AriaRole = 'status' | 'alert'

/**
 * Priority levels for feedback queue management
 */
export type FeedbackPriority = 'low' | 'high'

/**
 * Options for configuring individual feedback notifications
 */
export interface FeedbackOptions {
  /**
   * Unique identifier for the feedback
   * Used for deduplication and replacement of existing feedback
   */
  readonly id?: string

  /**
   * Target element selector for focus management
   * Only applicable for error and warning types
   * @example '#email-input'
   */
  readonly focus?: string

  /**
   * Whether to announce the focus movement to screen readers
   * Appends "Focus moved to [element label]" to the announcement
   * @default false
   */
  readonly explainFocus?: boolean

  /**
   * Force re-announcement even if the message is identical to the previous one
   * Uses zero-width character injection to guarantee screen reader announcement
   * @default false
   */
  readonly force?: boolean

  /**
   * Auto-dismiss timeout in milliseconds for visual feedback
   * Set to 0 or Infinity to disable auto-dismiss
   * Errors never auto-dismiss regardless of this setting
   * @default varies by type
   */
  readonly timeout?: number

  /**
   * Custom CSS class to apply to visual feedback element
   */
  readonly className?: string

  /**
   * Callback fired when the feedback is dismissed
   */
  readonly onDismiss?: () => void
}

/**
 * Internal feedback event representation
 */
export interface FeedbackEvent {
  /** Unique identifier for the event */
  readonly id: string
  /** The feedback message content */
  readonly message: string
  /** The semantic feedback type */
  readonly type: FeedbackType
  /** ARIA role determined by type */
  readonly role: AriaRole
  /** Live region politeness determined by type */
  readonly ariaLive: AriaLive
  /** Priority level determined by type */
  readonly priority: FeedbackPriority
  /** Original options passed to notify */
  readonly options: FeedbackOptions
  /** Timestamp when the event was created */
  readonly timestamp: number
  /** Whether this event replaced a previous one with the same ID */
  readonly replaced: boolean
  /** Whether this event was deduplicated (skipped) */
  readonly deduped: boolean
}

/**
 * Log entry for feedback telemetry
 */
export interface FeedbackLogEntry {
  /** The feedback event */
  readonly event: FeedbackEvent
  /** What action was taken */
  readonly action: 'announced' | 'replaced' | 'deduped' | 'queued' | 'dismissed'
  /** Which live region was used */
  readonly region: AriaLive | null
  /** Whether focus was moved */
  readonly focusMoved: boolean
  /** Target element if focus was moved */
  readonly focusTarget: string | null
  /** Reason if focus was blocked */
  readonly focusBlocked: string | null
  /** Visual feedback shown */
  readonly visualShown: boolean
}

/**
 * Global configuration options for a11y-feedback
 */
export interface FeedbackConfig {
  /**
   * Enable visual feedback rendering
   * @default false
   */
  readonly visual: boolean

  /**
   * Default timeout for auto-dismissing visual feedback (in ms)
   * Does not apply to errors
   * @default 5000
   */
  readonly defaultTimeout: number

  /**
   * Container element or selector for visual feedback
   * @default document.body
   */
  readonly visualContainer: HTMLElement | string | null

  /**
   * Position of visual feedback container
   * @default 'top-right'
   */
  readonly visualPosition:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'

  /**
   * Maximum number of visual feedback items to show at once
   * @default 5
   */
  readonly maxVisualItems: number

  /**
   * Enable debug mode logging
   * @default false
   */
  readonly debug: boolean

  /**
   * Custom prefix for live region IDs
   * @default 'a11y-feedback'
   */
  readonly regionPrefix: string
}

/**
 * Semantic mapping for each feedback type
 * These mappings are enforced and non-configurable
 */
export interface FeedbackSemantics {
  readonly role: AriaRole
  readonly ariaLive: AriaLive
  readonly priority: FeedbackPriority
  readonly canMoveFocus: boolean
  readonly autoDismiss: boolean
}

/**
 * Internal state for tracking announcements and deduplication
 */
export interface AnnouncerState {
  /** Last message announced to polite region */
  lastPoliteMessage: string | null
  /** Last message announced to assertive region */
  lastAssertiveMessage: string | null
  /** Timestamp of last polite announcement */
  lastPoliteTimestamp: number
  /** Timestamp of last assertive announcement */
  lastAssertiveTimestamp: number
  /** Counter for zero-width character injection */
  zwcCounter: number
}

/**
 * Type guard for FeedbackType
 */
export function isFeedbackType(value: unknown): value is FeedbackType {
  return (
    typeof value === 'string' && ['success', 'error', 'warning', 'info', 'loading'].includes(value)
  )
}

/**
 * Type guard for FeedbackOptions
 */
export function isFeedbackOptions(value: unknown): value is FeedbackOptions {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const obj = value as Record<string, unknown>
  if (obj['id'] !== undefined && typeof obj['id'] !== 'string') return false
  if (obj['focus'] !== undefined && typeof obj['focus'] !== 'string') return false
  if (obj['explainFocus'] !== undefined && typeof obj['explainFocus'] !== 'boolean') return false
  if (obj['force'] !== undefined && typeof obj['force'] !== 'boolean') return false
  if (obj['timeout'] !== undefined && typeof obj['timeout'] !== 'number') return false
  return true
}
