/**
 * a11y-feedback
 * A production-grade, framework-agnostic accessibility feedback and announcement engine
 *
 * @packageDocumentation
 */

// Main API
export { notify } from './notify'
export type { NotifyFunction } from './notify'

// Configuration
export { configureFeedback, getConfig, resetConfig } from './config'

// Debug & Telemetry
export {
  enableFeedbackDebug,
  disableFeedbackDebug,
  getFeedbackLog,
  clearFeedbackLog,
  getFeedbackStats,
  getRecentFeedback,
  getFeedbackByType,
  getFeedbackByAction,
  exportFeedbackLog,
} from './modules/debug'

// Visual feedback control
export {
  dismissVisualFeedback,
  dismissAllVisualFeedback,
  getActiveVisualCount,
} from './modules/visual'

// Types
export type {
  FeedbackType,
  FeedbackOptions,
  FeedbackEvent,
  FeedbackLogEntry,
  FeedbackConfig,
  FeedbackSemantics,
  FeedbackPriority,
  AriaLive,
  AriaRole,
} from './types'

// Type guards
export { isFeedbackType, isFeedbackOptions } from './types'

// Constants (for advanced usage)
export { FEEDBACK_SEMANTICS, DEFAULT_TIMEOUTS } from './constants'
