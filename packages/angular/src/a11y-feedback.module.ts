/**
 * Angular module for a11y-feedback
 */

import { NgModule, ModuleWithProviders } from '@angular/core'
import { A11yFeedbackService } from './a11y-feedback.service'
import type { FeedbackConfig } from '@theaccessibleteam/a11y-feedback'

/**
 * Configuration options for the module
 */
export interface A11yFeedbackModuleConfig {
  config?: Partial<FeedbackConfig>
}

/**
 * Angular module for accessible notifications
 *
 * @example
 * ```typescript
 * @NgModule({
 *   imports: [
 *     A11yFeedbackModule.forRoot({
 *       config: { visual: true }
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({})
export class A11yFeedbackModule {
  /**
   * Configure the module with options
   */
  static forRoot(
    options?: A11yFeedbackModuleConfig
  ): ModuleWithProviders<A11yFeedbackModule> {
    return {
      ngModule: A11yFeedbackModule,
      providers: [
        {
          provide: A11yFeedbackService,
          useFactory: () => {
            const service = new A11yFeedbackService()
            if (options?.config) {
              service.configure(options.config)
            }
            return service
          },
        },
      ],
    }
  }
}

