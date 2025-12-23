/**
 * Main notification API for a11y-feedback
 * Provides the public interface for triggering feedback
 * @module notify
 */

import type { FeedbackType, FeedbackOptions, FeedbackEvent } from './types'
import { FEEDBACK_SEMANTICS } from './constants'
import { isVisualEnabled } from './config'
import { generateId } from './utils/timing'
import { announce } from './modules/announcer'
import { initializeRegions } from './modules/regions'
import { processForDedupe, registerEvent, recordMessage } from './modules/dedupe'
import { handleFocus, buildMessageWithFocusExplanation } from './modules/focus'
import { showVisualFeedback, updateVisualFeedback, initializeVisual } from './modules/visual'
import { logFeedbackEvent } from './modules/debug'

/**
 * Base notify function input
 */
interface NotifyInput {
  /** The feedback message */
  message: string
  /** The feedback type */
  type: FeedbackType
  /** Additional options */
  options?: FeedbackOptions | undefined
}

/**
 * Create a feedback event from input
 */
function createFeedbackEvent(
  message: string,
  type: FeedbackType,
  options: FeedbackOptions = {}
): FeedbackEvent {
  const semantics = FEEDBACK_SEMANTICS[type]
  const id = options.id ?? generateId()

  return {
    id,
    message,
    type,
    role: semantics.role,
    ariaLive: semantics.ariaLive,
    priority: semantics.priority,
    options,
    timestamp: Date.now(),
    replaced: false,
    deduped: false,
  }
}

/**
 * Process and dispatch a feedback event
 */
async function processEvent(event: FeedbackEvent): Promise<FeedbackEvent> {
  // Initialize regions on first use
  initializeRegions()

  // Check for deduplication or replacement
  const dedupeResult = processForDedupe(event)

  if (dedupeResult.shouldSkip) {
    // Event was deduped, log and return
    const dedupedEvent: FeedbackEvent = {
      ...event,
      deduped: true,
    }

    logFeedbackEvent(dedupedEvent, 'deduped')
    return dedupedEvent
  }

  // Check if this is a replacement
  const isReplacement = dedupeResult.replacedEvent !== null
  const processedEvent: FeedbackEvent = {
    ...event,
    replaced: isReplacement,
  }

  // Register the event
  registerEvent(processedEvent)

  // Record message for future deduplication
  recordMessage(processedEvent.message, processedEvent.type)

  // Handle focus management
  const focusResult = handleFocus(processedEvent)

  // Build the final message (potentially with focus explanation)
  const finalMessage = buildMessageWithFocusExplanation(
    processedEvent.message,
    processedEvent,
    focusResult
  )

  // Create event with final message for announcement
  const eventWithFinalMessage: FeedbackEvent = {
    ...processedEvent,
    message: finalMessage,
  }

  // Announce to screen readers
  await announce(eventWithFinalMessage)

  // Show visual feedback if enabled
  let visualShown = false
  if (isVisualEnabled()) {
    initializeVisual()
    if (isReplacement) {
      updateVisualFeedback(processedEvent)
    } else {
      showVisualFeedback(processedEvent)
    }
    visualShown = true
  }

  // Log the event
  logFeedbackEvent(processedEvent, isReplacement ? 'replaced' : 'announced', {
    region: processedEvent.ariaLive,
    focusResult,
    visualShown,
  })

  return processedEvent
}

/**
 * Core notify function
 *
 * @param input - Notification input with message, type, and optional options
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * // Using the base function
 * notify({
 *   message: 'Profile saved',
 *   type: 'success'
 * })
 *
 * // With options
 * notify({
 *   message: 'Invalid email',
 *   type: 'error',
 *   options: {
 *     focus: '#email',
 *     explainFocus: true
 *   }
 * })
 * ```
 */
async function notifyBase(input: NotifyInput): Promise<FeedbackEvent> {
  const event = createFeedbackEvent(input.message, input.type, input.options)
  return processEvent(event)
}

/**
 * Notify with success type
 *
 * @param message - The success message
 * @param options - Optional configuration
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * notify.success('Profile updated successfully')
 * ```
 */
async function notifySuccess(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
  return notifyBase({ message, type: 'success', options })
}

/**
 * Notify with error type
 *
 * @param message - The error message
 * @param options - Optional configuration
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * notify.error('Invalid email address', {
 *   focus: '#email',
 *   explainFocus: true
 * })
 * ```
 */
async function notifyError(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
  return notifyBase({ message, type: 'error', options })
}

/**
 * Notify with warning type
 *
 * @param message - The warning message
 * @param options - Optional configuration
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * notify.warning('Your session will expire in 5 minutes')
 * ```
 */
async function notifyWarning(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
  return notifyBase({ message, type: 'warning', options })
}

/**
 * Notify with info type
 *
 * @param message - The info message
 * @param options - Optional configuration
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * notify.info('New features available')
 * ```
 */
async function notifyInfo(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
  return notifyBase({ message, type: 'info', options })
}

/**
 * Notify with loading type
 *
 * @param message - The loading message
 * @param options - Optional configuration (id is recommended for later replacement)
 * @returns Promise resolving to the feedback event
 *
 * @example
 * ```ts
 * // Start loading
 * notify.loading('Saving profile…', { id: 'profile-save' })
 *
 * // Later, replace with success
 * notify.success('Profile saved', { id: 'profile-save' })
 * ```
 */
async function notifyLoading(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
  return notifyBase({ message, type: 'loading', options })
}

/**
 * Main notify function with sugar helpers attached
 *
 * @example
 * ```ts
 * // Base usage
 * notify({ message: 'Hello', type: 'info' })
 *
 * // Sugar helpers
 * notify.success('Saved')
 * notify.error('Failed')
 * notify.warning('Careful')
 * notify.info('FYI')
 * notify.loading('Working…')
 * ```
 */
export const notify = Object.assign(notifyBase, {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  loading: notifyLoading,
})

/**
 * Type for the notify function with helpers
 */
export type NotifyFunction = typeof notify
