/**
 * Main hook for a11y-feedback in Svelte
 */

import { writable, derived, type Readable } from 'svelte/store'
import {
  notify,
  dismissVisualFeedback,
  dismissAllVisualFeedback,
  getNotificationHistory,
  getUnreadCount,
  onFeedback,
  type FeedbackEvent,
  type FeedbackOptions,
  type FeedbackType,
} from '@theaccessibleteam/a11y-feedback'

/**
 * A11y Feedback store interface
 */
export interface A11yFeedbackStore extends Readable<{
  notifications: readonly FeedbackEvent[]
  unreadCount: number
}> {
  notify: (message: string, type: FeedbackType, options?: FeedbackOptions) => Promise<FeedbackEvent>
  success: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  error: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  warning: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  info: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  loading: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  dismiss: (id: string) => void
  dismissAll: () => void
  destroy: () => void
}

/**
 * Create the a11y-feedback store for Svelte
 */
export function useA11yFeedback(): A11yFeedbackStore {
  const state = writable({
    notifications: getNotificationHistory(),
    unreadCount: getUnreadCount(),
  })

  // Update state when feedback events occur
  const updateState = () => {
    state.set({
      notifications: getNotificationHistory(),
      unreadCount: getUnreadCount(),
    })
  }

  // Subscribe to events
  onFeedback('announced', updateState)
  onFeedback('dismissed', updateState)
  onFeedback('replaced', updateState)

  return {
    subscribe: state.subscribe,

    notify: async (message: string, type: FeedbackType, options?: FeedbackOptions) => {
      const result = await notify({ message, type, options })
      updateState()
      return result
    },

    success: async (message: string, options?: FeedbackOptions) => {
      const result = await notify.success(message, options)
      updateState()
      return result
    },

    error: async (message: string, options?: FeedbackOptions) => {
      const result = await notify.error(message, options)
      updateState()
      return result
    },

    warning: async (message: string, options?: FeedbackOptions) => {
      const result = await notify.warning(message, options)
      updateState()
      return result
    },

    info: async (message: string, options?: FeedbackOptions) => {
      const result = await notify.info(message, options)
      updateState()
      return result
    },

    loading: async (message: string, options?: FeedbackOptions) => {
      const result = await notify.loading(message, options)
      updateState()
      return result
    },

    dismiss: (id: string) => {
      dismissVisualFeedback(id)
      updateState()
    },

    dismissAll: () => {
      dismissAllVisualFeedback()
      updateState()
    },

    destroy: () => {
      // Cleanup is handled internally by the core library
      // Manual unsubscription not needed for this use case
    },
  }
}

