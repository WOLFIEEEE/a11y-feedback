/**
 * Svelte store for a11y-feedback
 */

import { writable, type Readable } from 'svelte/store'
import {
  notify,
  configureFeedback,
  getConfig,
  getNotificationHistory,
  getUnreadCount,
  onFeedback,
  type FeedbackEvent,
  type FeedbackConfig,
  type FeedbackOptions,
  type FeedbackType,
} from '@theaccessibleteam/a11y-feedback'

/**
 * A11y Feedback store state
 */
export interface A11yFeedbackState {
  notifications: readonly FeedbackEvent[]
  unreadCount: number
  config: FeedbackConfig
}

/**
 * Create a Svelte store for a11y-feedback
 */
export function createA11yFeedbackStore() {
  const { subscribe, set, update } = writable<A11yFeedbackState>({
    notifications: getNotificationHistory(),
    unreadCount: getUnreadCount(),
    config: getConfig(),
  })

  // Subscribe to feedback events
  const handleFeedback = () => {
    update(state => ({
      ...state,
      notifications: getNotificationHistory(),
      unreadCount: getUnreadCount(),
    }))
  }

  onFeedback('announced', handleFeedback)
  onFeedback('dismissed', handleFeedback)

  return {
    subscribe,

    /**
     * Send a notification
     */
    notify: async (message: string, type: FeedbackType, options?: FeedbackOptions) => {
      return notify({ message, type, options })
    },

    /**
     * Send a success notification
     */
    success: async (message: string, options?: FeedbackOptions) => {
      return notify.success(message, options)
    },

    /**
     * Send an error notification
     */
    error: async (message: string, options?: FeedbackOptions) => {
      return notify.error(message, options)
    },

    /**
     * Send a warning notification
     */
    warning: async (message: string, options?: FeedbackOptions) => {
      return notify.warning(message, options)
    },

    /**
     * Send an info notification
     */
    info: async (message: string, options?: FeedbackOptions) => {
      return notify.info(message, options)
    },

    /**
     * Send a loading notification
     */
    loading: async (message: string, options?: FeedbackOptions) => {
      return notify.loading(message, options)
    },

    /**
     * Update configuration
     */
    configure: (config: Partial<FeedbackConfig>) => {
      configureFeedback(config)
      update(state => ({
        ...state,
        config: getConfig(),
      }))
    },

    /**
     * Cleanup subscriptions
     */
    destroy: () => {
      // Note: offFeedback takes the event type and listener ID or just event type
      // For simplicity, we don't track listener IDs here
    },
  }
}

