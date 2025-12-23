/**
 * Core type definitions for a11y-feedback
 * @module types
 */

/**
 * Feedback types with enforced semantic mappings
 * These types determine ARIA roles, live region politeness, and focus behavior
 */
export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading'

// ============================================================================
// V2.0 - Action Buttons
// ============================================================================

/**
 * Action button variant for visual styling
 */
export type ActionVariant = 'primary' | 'secondary' | 'danger'

/**
 * Action button configuration for notifications
 */
export interface NotificationAction {
  /** Unique identifier for the action */
  readonly id: string
  /** Button label text */
  readonly label: string
  /** Click handler - can be async */
  readonly onClick: () => void | Promise<void>
  /** Visual style variant */
  readonly variant?: ActionVariant
  /** Optional icon (SVG string or element) */
  readonly icon?: string | SVGElement
  /** Accessible label override for screen readers */
  readonly ariaLabel?: string
  /** Close notification after action */
  readonly closeOnClick?: boolean
}

// ============================================================================
// V2.0 - Progress Notifications
// ============================================================================

/**
 * Options for progress notifications
 */
export interface ProgressOptions extends Omit<FeedbackOptions, 'timeout'> {
  /** Initial progress value (0-100) */
  readonly initialValue?: number
  /** Maximum progress value */
  readonly max?: number
  /** Whether progress is indeterminate (unknown duration) */
  readonly indeterminate?: boolean
  /** Announce progress at specific intervals (percentage) */
  readonly announceAt?: readonly number[]
}

/**
 * Controller returned from progress notifications
 */
export interface ProgressController {
  /** Update progress value */
  readonly update: (value: number, message?: string) => void
  /** Mark as complete with optional success message */
  readonly complete: (message?: string) => void
  /** Mark as failed with optional error message */
  readonly fail: (message?: string) => void
  /** Get current progress value */
  readonly getValue: () => number
  /** Check if still active */
  readonly isActive: () => boolean
  /** Dismiss the progress notification */
  readonly dismiss: () => void
}

// ============================================================================
// V2.0 - Rich Content
// ============================================================================

/**
 * Image configuration for rich content
 */
export interface RichContentImage {
  /** Image source URL */
  readonly src: string
  /** Required alt text for accessibility */
  readonly alt: string
  /** Optional width */
  readonly width?: number
  /** Optional height */
  readonly height?: number
}

/**
 * Link configuration for rich content
 */
export interface RichContentLink {
  /** Link text */
  readonly text: string
  /** Link URL */
  readonly href: string
  /** Open in new tab */
  readonly external?: boolean
  /** Accessible label for screen readers */
  readonly ariaLabel?: string
}

/**
 * Rich content for enhanced notifications
 */
export interface RichContent {
  /** Optional title (displayed prominently) */
  readonly title?: string
  /** Main description/message */
  readonly description?: string
  /** Icon (SVG string, element, or factory function) */
  readonly icon?: string | SVGElement | (() => SVGElement)
  /** Optional image */
  readonly image?: RichContentImage
  /** Optional link */
  readonly link?: RichContentLink
  /** Custom HTML content (sanitized) */
  readonly html?: string
}

// ============================================================================
// V2.0 - Notification Grouping
// ============================================================================

/**
 * A group of related notifications
 */
export interface NotificationGroup {
  /** Unique group identifier */
  readonly id: string
  /** Notifications in this group */
  readonly notifications: readonly FeedbackEvent[]
  /** Whether the group is collapsed */
  readonly collapsed: boolean
  /** Generated summary text */
  readonly summary: string
  /** Group creation timestamp */
  readonly createdAt: number
  /** Last update timestamp */
  readonly updatedAt: number
}

/**
 * Configuration for notification grouping
 */
export interface GroupingConfig {
  /** Enable automatic grouping */
  readonly enabled: boolean
  /** Time window for grouping similar notifications (ms) */
  readonly threshold?: number
  /** Maximum notifications per group */
  readonly maxGroupSize?: number
  /** Custom grouping key function */
  readonly groupBy?: (event: FeedbackEvent) => string | null
  /** Custom summary generator */
  readonly summarize?: (group: NotificationGroup) => string
}

// ============================================================================
// V2.0 - Notification Templates
// ============================================================================

/**
 * Template for reusable notification configurations
 */
export interface NotificationTemplate<T = unknown> {
  /** Base feedback type */
  readonly type: FeedbackType
  /** Default options for this template */
  readonly defaults?: Partial<FeedbackOptions>
  /** Custom render function for rich content */
  readonly render?: (data: T) => RichContent
  /** Default actions for this template */
  readonly actions?: readonly NotificationAction[]
}

/**
 * Created template instance with show methods
 */
export interface TemplateInstance<T = unknown> {
  /** Show notification with message and optional data */
  readonly show: (message: string, data?: T, options?: Partial<FeedbackOptions>) => Promise<FeedbackEvent>
  /** Show notification with data only (uses render function) */
  readonly showWith: (data: T, options?: Partial<FeedbackOptions>) => Promise<FeedbackEvent>
}

// ============================================================================
// V2.0 - Promise-based Dialogs
// ============================================================================

/**
 * Confirm dialog type
 */
export type ConfirmDialogType = 'confirm' | 'destructive'

/**
 * Options for confirm dialogs
 */
export interface ConfirmOptions {
  /** Dialog title */
  readonly title?: string
  /** Confirm button text */
  readonly confirmText?: string
  /** Cancel button text */
  readonly cancelText?: string
  /** Dialog type affecting styling */
  readonly type?: ConfirmDialogType
  /** Icon for the dialog */
  readonly icon?: string | SVGElement
}

/**
 * Result from confirm dialog
 */
export interface ConfirmResult {
  /** Whether user confirmed */
  readonly confirmed: boolean
}

/**
 * Options for prompt dialogs
 */
export interface PromptOptions extends ConfirmOptions {
  /** Placeholder text for input */
  readonly placeholder?: string
  /** Default value for input */
  readonly defaultValue?: string
  /** Input type */
  readonly inputType?: 'text' | 'email' | 'password' | 'number' | 'url'
  /** Validation function */
  readonly validate?: (value: string) => string | null
}

/**
 * Result from prompt dialog
 */
export interface PromptResult {
  /** User input value (null if cancelled) */
  readonly value: string | null
  /** Whether user confirmed */
  readonly confirmed: boolean
}

// ============================================================================
// V2.0 - Sound & Haptics
// ============================================================================

/**
 * Sound configuration for notifications
 */
export interface SoundConfig {
  /** Enable sound notifications */
  readonly enabled: boolean
  /** Master volume (0-1) */
  readonly volume?: number
  /** Custom sounds per feedback type */
  readonly sounds?: Partial<Record<FeedbackType, string | AudioBuffer>>
  /** Respect user's reduced data preference */
  readonly respectReducedData?: boolean
}

/**
 * Vibration pattern type
 */
export type VibratePattern = number | readonly number[]

/**
 * Haptic feedback configuration
 */
export interface HapticConfig {
  /** Enable haptic feedback */
  readonly enabled: boolean
  /** Custom vibration patterns per feedback type */
  readonly patterns?: Partial<Record<FeedbackType, VibratePattern>>
  /** Respect user's reduced motion preference */
  readonly respectReducedMotion?: boolean
}

// ============================================================================
// V2.0 - Keyboard Navigation
// ============================================================================

/**
 * Keyboard shortcut handler
 */
export type KeyboardShortcutHandler = () => void

/**
 * Keyboard navigation configuration
 */
export interface KeyboardConfig {
  /** Enable keyboard navigation */
  readonly enabled: boolean
  /** Key to dismiss focused notification */
  readonly dismissKey?: string
  /** Custom keyboard shortcuts */
  readonly shortcuts?: Readonly<Record<string, KeyboardShortcutHandler>>
  /** Enable arrow key navigation in notification center */
  readonly arrowNavigation?: boolean
  /** Enable focus trap in dialogs */
  readonly focusTrap?: boolean
}

// ============================================================================
// V2.0 - Notification Center
// ============================================================================

/**
 * History/persistence configuration
 */
export interface HistoryConfig {
  /** Enable notification history */
  readonly enabled: boolean
  /** Maximum items to keep in history */
  readonly maxItems?: number
  /** Persist history to localStorage */
  readonly persist?: boolean
  /** Storage key for persistence */
  readonly storageKey?: string
}

/**
 * Notification center state
 */
export interface NotificationCenterState {
  /** All notifications in history */
  readonly notifications: readonly FeedbackEvent[]
  /** Count of unread notifications */
  readonly unreadCount: number
  /** Whether center panel is open */
  readonly isOpen: boolean
  /** Groups if grouping is enabled */
  readonly groups: readonly NotificationGroup[]
}

/**
 * Notification center event types
 */
export type NotificationCenterEventType = 
  | 'open'
  | 'close'
  | 'markRead'
  | 'markAllRead'
  | 'clear'

/**
 * Notification center event listener
 */
export type NotificationCenterEventListener = (
  event: NotificationCenterEventType,
  data?: unknown
) => void

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

  // V2.0 Options

  /**
   * Action buttons to display in the notification
   * @since 2.0.0
   */
  readonly actions?: readonly NotificationAction[]

  /**
   * Rich content for enhanced notification display
   * @since 2.0.0
   */
  readonly richContent?: RichContent

  /**
   * Group key for notification grouping
   * Notifications with the same group key will be grouped together
   * @since 2.0.0
   */
  readonly group?: string

  /**
   * Priority within group (higher = more important)
   * @since 2.0.0
   */
  readonly groupPriority?: number

  /**
   * Whether to persist this notification in history
   * @default true
   * @since 2.0.0
   */
  readonly persist?: boolean

  /**
   * Play sound for this notification (overrides global setting)
   * @since 2.0.0
   */
  readonly sound?: boolean

  /**
   * Trigger haptic feedback (overrides global setting)
   * @since 2.0.0
   */
  readonly haptic?: boolean
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

  // V2.0 Properties

  /** Actions associated with this event */
  readonly actions?: readonly NotificationAction[]
  /** Rich content for enhanced display */
  readonly richContent?: RichContent
  /** Group this event belongs to */
  readonly group?: string
  /** Whether this event has been read (for notification center) */
  readonly read?: boolean
  /** Progress value if this is a progress notification */
  readonly progress?: number
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
 * Visual position options
 */
export type VisualPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'

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
  readonly visualPosition: VisualPosition

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

  /**
   * CSP nonce for style injection
   * Required when using Content Security Policy with style-src restrictions
   * @default undefined
   */
  readonly cspNonce?: string

  /**
   * Locale for feedback messages
   * Used for built-in strings like "Dismiss" button label
   * @default 'en'
   */
  readonly locale?: string

  /**
   * Enable RTL (right-to-left) layout for visual feedback
   * Set to 'auto' to detect from document direction
   * @default 'auto'
   */
  readonly rtl?: boolean | 'auto'

  /**
   * Custom translations for built-in strings
   * Allows overriding default labels and messages
   */
  readonly translations?: FeedbackTranslations

  // V2.0 Configuration Options

  /**
   * Sound notification configuration
   * @since 2.0.0
   */
  readonly sounds?: SoundConfig

  /**
   * Haptic feedback configuration
   * @since 2.0.0
   */
  readonly haptics?: HapticConfig

  /**
   * Keyboard navigation configuration
   * @since 2.0.0
   */
  readonly keyboard?: KeyboardConfig

  /**
   * Notification grouping configuration
   * @since 2.0.0
   */
  readonly grouping?: GroupingConfig

  /**
   * Notification history/center configuration
   * @since 2.0.0
   */
  readonly history?: HistoryConfig
}

/**
 * Translations for customizable strings
 */
export interface FeedbackTranslations {
  /** Label for dismiss button */
  readonly dismiss?: string
  /** Label for notifications region */
  readonly notificationsLabel?: string
  /** Template for focus explanation. Use {label} as placeholder */
  readonly focusMovedTo?: string
  // V2.0 Translations
  /** Title for confirm dialogs */
  readonly confirmTitle?: string
  /** Label for confirm button */
  readonly confirm?: string
  /** Label for cancel button */
  readonly cancel?: string
  /** Label for notification center */
  readonly notificationCenter?: string
  /** Text for no notifications */
  readonly noNotifications?: string
  /** Label for mark all as read button */
  readonly markAllRead?: string
  /** Label for clear all button */
  readonly clearAll?: string
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
    typeof value === 'string' &&
    ['success', 'error', 'warning', 'info', 'loading'].includes(value)
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

