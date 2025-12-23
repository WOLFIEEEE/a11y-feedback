/**
 * Deduplication and replacement logic for a11y-feedback
 * Prevents duplicate announcements and handles ID-based replacement
 * @module modules/dedupe
 */

import type { FeedbackEvent, FeedbackType } from '../types'
import { isDebugEnabled } from '../config'

/**
 * Time window for content-based deduplication (in milliseconds)
 */
const DEDUPE_WINDOW_MS = 500

/**
 * Cache of recent messages for content-based deduplication
 * Key: hash of message + type, Value: timestamp
 */
const recentMessages: Map<string, number> = new Map()

/**
 * Cache of active events by ID for ID-based replacement
 * Key: event ID, Value: event
 */
const activeEventsById: Map<string, FeedbackEvent> = new Map()

/**
 * Generate a hash key for content-based deduplication
 *
 * @param message - The feedback message
 * @param type - The feedback type
 * @returns Hash key string
 */
function getContentHash(message: string, type: FeedbackType): string {
  return `${type}:${message}`
}

/**
 * Check if a message should be deduplicated based on content
 * Returns true if the same message+type was recently announced
 *
 * @param message - The feedback message
 * @param type - The feedback type
 * @returns Whether to skip this announcement
 */
export function shouldDedupeByContent(message: string, type: FeedbackType): boolean {
  const hash = getContentHash(message, type)
  const lastTimestamp = recentMessages.get(hash)

  if (lastTimestamp === undefined) {
    return false
  }

  const timeSinceLastAnnouncement = Date.now() - lastTimestamp
  return timeSinceLastAnnouncement < DEDUPE_WINDOW_MS
}

/**
 * Record a message for future deduplication checks
 *
 * @param message - The feedback message
 * @param type - The feedback type
 */
export function recordMessage(message: string, type: FeedbackType): void {
  const hash = getContentHash(message, type)
  recentMessages.set(hash, Date.now())

  // Clean up old entries periodically
  cleanupOldEntries()
}

/**
 * Check if an event with the given ID exists and should be replaced
 *
 * @param id - The event ID to check
 * @returns The existing event if it should be replaced, undefined otherwise
 */
export function checkForReplacement(id: string): FeedbackEvent | undefined {
  return activeEventsById.get(id)
}

/**
 * Register an active event by ID
 *
 * @param event - The feedback event to register
 */
export function registerEvent(event: FeedbackEvent): void {
  activeEventsById.set(event.id, event)

  if (isDebugEnabled()) {
    console.warn('[a11y-feedback] Registered event:', {
      id: event.id,
      message: event.message,
      activeCount: activeEventsById.size,
    })
  }
}

/**
 * Unregister an event by ID (e.g., when dismissed)
 *
 * @param id - The event ID to unregister
 * @returns Whether the event was found and removed
 */
export function unregisterEvent(id: string): boolean {
  const existed = activeEventsById.delete(id)

  if (existed && isDebugEnabled()) {
    console.warn('[a11y-feedback] Unregistered event:', {
      id,
      activeCount: activeEventsById.size,
    })
  }

  return existed
}

/**
 * Get an active event by ID
 *
 * @param id - The event ID
 * @returns The event or undefined
 */
export function getActiveEvent(id: string): FeedbackEvent | undefined {
  return activeEventsById.get(id)
}

/**
 * Get all active events
 *
 * @returns Array of all active events
 */
export function getAllActiveEvents(): readonly FeedbackEvent[] {
  return Array.from(activeEventsById.values())
}

/**
 * Get the count of active events
 *
 * @returns Number of active events
 */
export function getActiveEventCount(): number {
  return activeEventsById.size
}

/**
 * Check if an event with the given ID is active
 *
 * @param id - The event ID to check
 * @returns Whether the event is active
 */
export function isEventActive(id: string): boolean {
  return activeEventsById.has(id)
}

/**
 * Process a feedback event for deduplication and replacement
 *
 * @param event - The event to process
 * @returns Object with deduplication result
 */
export function processForDedupe(event: FeedbackEvent): {
  shouldSkip: boolean
  replacedEvent: FeedbackEvent | null
  reason: 'none' | 'content_dedupe' | 'id_replacement'
} {
  // Check for ID-based replacement first
  if (event.options.id !== undefined && event.options.id !== '') {
    const existingEvent = checkForReplacement(event.options.id)
    if (existingEvent !== undefined) {
      // Replace the existing event
      unregisterEvent(event.options.id)

      if (isDebugEnabled()) {
        console.warn('[a11y-feedback] Replacing event:', {
          oldMessage: existingEvent.message,
          newMessage: event.message,
          id: event.options.id,
        })
      }

      return {
        shouldSkip: false,
        replacedEvent: existingEvent,
        reason: 'id_replacement',
      }
    }
  }

  // Check for content-based deduplication (unless force is set)
  if (event.options.force !== true) {
    const shouldDedupe = shouldDedupeByContent(event.message, event.type)

    if (shouldDedupe) {
      if (isDebugEnabled()) {
        console.warn('[a11y-feedback] Deduped event:', {
          message: event.message,
          type: event.type,
        })
      }

      return {
        shouldSkip: true,
        replacedEvent: null,
        reason: 'content_dedupe',
      }
    }
  }

  return {
    shouldSkip: false,
    replacedEvent: null,
    reason: 'none',
  }
}

/**
 * Clean up old entries from the recent messages cache
 */
function cleanupOldEntries(): void {
  const now = Date.now()
  const cutoff = now - DEDUPE_WINDOW_MS * 2

  for (const [hash, timestamp] of recentMessages.entries()) {
    if (timestamp < cutoff) {
      recentMessages.delete(hash)
    }
  }
}

/**
 * Clear all deduplication caches (useful for testing)
 */
export function clearDedupeCache(): void {
  recentMessages.clear()
  activeEventsById.clear()
}

/**
 * Reset the dedupe module state (useful for testing)
 */
export function resetDedupe(): void {
  clearDedupeCache()
}
