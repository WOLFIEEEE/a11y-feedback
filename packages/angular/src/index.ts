/**
 * @theaccessibleteam/a11y-feedback-angular
 * Angular bindings for the a11y-feedback accessibility notification library
 *
 * @packageDocumentation
 */

export { A11yFeedbackService } from './a11y-feedback.service'
export { A11yFeedbackModule } from './a11y-feedback.module'
export { provideA11yFeedback } from './provide'

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

