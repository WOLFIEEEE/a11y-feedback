/**
 * @theaccessibleteam/a11y-feedback-svelte
 * Svelte bindings for the a11y-feedback accessibility notification library
 *
 * @packageDocumentation
 */

export { useA11yFeedback, type A11yFeedbackStore } from './useA11yFeedback'
export { useA11yAnnounce } from './useA11yAnnounce'
export { useFeedbackConfig } from './useFeedbackConfig'
export { createA11yFeedbackStore } from './store'

// Re-export types from core
export type {
  FeedbackType,
  FeedbackOptions,
  FeedbackEvent,
  FeedbackConfig,
  NotificationAction,
  ProgressOptions,
  ProgressController,
  RichContent,
  ConfirmOptions,
  PromptOptions,
} from '@theaccessibleteam/a11y-feedback'

