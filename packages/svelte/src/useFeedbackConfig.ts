/**
 * Configuration hook for Svelte
 */

import { writable, type Readable } from 'svelte/store'
import {
  configureFeedback,
  getConfig,
  resetConfig,
  type FeedbackConfig,
} from '@theaccessibleteam/a11y-feedback'

/**
 * Config store interface
 */
export interface FeedbackConfigStore extends Readable<FeedbackConfig> {
  update: (config: Partial<FeedbackConfig>) => void
  reset: () => void
}

/**
 * Create a config store for a11y-feedback
 */
export function useFeedbackConfig(): FeedbackConfigStore {
  const store = writable<FeedbackConfig>(getConfig())

  return {
    subscribe: store.subscribe,

    update: (config: Partial<FeedbackConfig>) => {
      configureFeedback(config)
      store.set(getConfig())
    },

    reset: () => {
      resetConfig()
      store.set(getConfig())
    },
  }
}

