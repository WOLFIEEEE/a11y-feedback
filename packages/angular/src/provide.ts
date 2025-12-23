/**
 * Standalone provider for a11y-feedback in Angular
 */

import { Provider, makeEnvironmentProviders, EnvironmentProviders } from '@angular/core'
import { configureFeedback, type FeedbackConfig } from '@theaccessibleteam/a11y-feedback'
import { A11yFeedbackService } from './a11y-feedback.service'

/**
 * Options for the standalone provider
 */
export interface A11yFeedbackProviderOptions {
  config?: Partial<FeedbackConfig>
}

/**
 * Provide a11y-feedback for standalone Angular applications
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideA11yFeedback({
 *       config: { visual: true }
 *     })
 *   ]
 * }
 * ```
 */
export function provideA11yFeedback(
  options?: A11yFeedbackProviderOptions
): EnvironmentProviders {
  // Apply initial configuration
  if (options?.config) {
    configureFeedback(options.config)
  }

  return makeEnvironmentProviders([
    A11yFeedbackService,
  ])
}

