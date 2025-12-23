/**
 * Simple announce hook for Svelte
 */

import {
  notify,
  type FeedbackOptions,
} from '@theaccessibleteam/a11y-feedback'

/**
 * Announce functions interface
 */
export interface A11yAnnounce {
  success: (message: string, options?: FeedbackOptions) => Promise<void>
  error: (message: string, options?: FeedbackOptions) => Promise<void>
  warning: (message: string, options?: FeedbackOptions) => Promise<void>
  info: (message: string, options?: FeedbackOptions) => Promise<void>
  loading: (message: string, options?: FeedbackOptions) => Promise<void>
}

/**
 * Create simple announce functions for screen readers
 */
export function useA11yAnnounce(): A11yAnnounce {
  return {
    success: async (message: string, options?: FeedbackOptions) => {
      await notify.success(message, options)
    },

    error: async (message: string, options?: FeedbackOptions) => {
      await notify.error(message, options)
    },

    warning: async (message: string, options?: FeedbackOptions) => {
      await notify.warning(message, options)
    },

    info: async (message: string, options?: FeedbackOptions) => {
      await notify.info(message, options)
    },

    loading: async (message: string, options?: FeedbackOptions) => {
      await notify.loading(message, options)
    },
  }
}

