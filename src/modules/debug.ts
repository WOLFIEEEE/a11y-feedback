/**
 * Debug mode and telemetry for a11y-feedback
 * Provides logging and feedback history tracking
 * @module modules/debug
 */

import type { FeedbackEvent, FeedbackLogEntry, AriaLive } from '../types'
import { configureFeedback, isDebugEnabled } from '../config'
import type { FocusResult } from './focus'

/**
 * Maximum number of log entries to retain
 */
const MAX_LOG_ENTRIES = 100

/**
 * Feedback log storage
 */
const feedbackLog: FeedbackLogEntry[] = []

/**
 * Enable debug mode
 * Turns on verbose console logging for all feedback operations
 *
 * @example
 * ```ts
 * enableFeedbackDebug()
 * // Now all feedback operations will be logged to console
 * ```
 */
export function enableFeedbackDebug(): void {
  configureFeedback({ debug: true })
  console.warn('[a11y-feedback] Debug mode enabled')
}

/**
 * Disable debug mode
 */
export function disableFeedbackDebug(): void {
  configureFeedback({ debug: false })
}

/**
 * Get the feedback log
 * Returns a copy of all logged feedback events
 *
 * @returns Array of log entries
 *
 * @example
 * ```ts
 * const log = getFeedbackLog()
 * console.log('Total announcements:', log.filter(e => e.action === 'announced').length)
 * ```
 */
export function getFeedbackLog(): readonly FeedbackLogEntry[] {
  return [...feedbackLog]
}

/**
 * Clear the feedback log
 */
export function clearFeedbackLog(): void {
  feedbackLog.length = 0
}

/**
 * Log a feedback event with action details
 *
 * @param event - The feedback event
 * @param action - The action taken
 * @param details - Additional details
 */
export function logFeedbackEvent(
  event: FeedbackEvent,
  action: FeedbackLogEntry['action'],
  details: {
    region?: AriaLive | null
    focusResult?: FocusResult
    visualShown?: boolean
  } = {}
): void {
  const entry: FeedbackLogEntry = {
    event,
    action,
    region: details.region ?? null,
    focusMoved: details.focusResult?.moved ?? false,
    focusTarget: details.focusResult?.target ?? null,
    focusBlocked: details.focusResult?.blockedReason ?? null,
    visualShown: details.visualShown ?? false,
  }

  // Add to log
  feedbackLog.push(entry)

  // Trim log if too large
  while (feedbackLog.length > MAX_LOG_ENTRIES) {
    feedbackLog.shift()
  }

  // Log to console if debug mode is enabled
  if (isDebugEnabled()) {
    logToConsole(entry)
  }
}

/**
 * Log entry to console with formatting
 */
function logToConsole(entry: FeedbackLogEntry): void {
  const { event, action, region, focusMoved, focusTarget, focusBlocked, visualShown } = entry

  const styles = getConsoleStyles(event.type)

  console.warn(`%c[a11y-feedback]%c ${action.toUpperCase()}`, styles.badge, styles.action, {
    message: event.message,
    type: event.type,
    id: event.id,
    role: event.role,
    ariaLive: event.ariaLive,
    priority: event.priority,
    region,
    focusMoved,
    focusTarget,
    focusBlocked,
    visualShown,
    timestamp: new Date(event.timestamp).toISOString(),
    deduped: event.deduped,
    replaced: event.replaced,
  })
}

/**
 * Get console styles based on feedback type
 */
function getConsoleStyles(type: string): { badge: string; action: string } {
  const colors: Record<string, string> = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    loading: '#8b5cf6',
  }

  const color = colors[type] ?? '#6b7280'

  return {
    badge: `background: ${color}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    action: `color: ${color}; font-weight: bold;`,
  }
}

/**
 * Get statistics about feedback events
 *
 * @returns Object with feedback statistics
 */
export function getFeedbackStats(): {
  total: number
  byType: Record<string, number>
  byAction: Record<string, number>
  focusMoved: number
  visualShown: number
  deduped: number
  replaced: number
} {
  const byType: Record<string, number> = {}
  const byAction: Record<string, number> = {}
  let focusMoved = 0
  let visualShown = 0
  let deduped = 0
  let replaced = 0

  for (const entry of feedbackLog) {
    // Count by type
    const type = entry.event.type
    byType[type] = (byType[type] ?? 0) + 1

    // Count by action
    const action = entry.action
    byAction[action] = (byAction[action] ?? 0) + 1

    // Count focus movements
    if (entry.focusMoved) {
      focusMoved++
    }

    // Count visual shown
    if (entry.visualShown) {
      visualShown++
    }

    // Count deduped
    if (entry.event.deduped) {
      deduped++
    }

    // Count replaced
    if (entry.event.replaced) {
      replaced++
    }
  }

  return {
    total: feedbackLog.length,
    byType,
    byAction,
    focusMoved,
    visualShown,
    deduped,
    replaced,
  }
}

/**
 * Get recent feedback events (last N)
 *
 * @param count - Number of events to return
 * @returns Array of recent log entries
 */
export function getRecentFeedback(count: number = 10): readonly FeedbackLogEntry[] {
  return feedbackLog.slice(-count)
}

/**
 * Filter feedback log by type
 *
 * @param type - The feedback type to filter by
 * @returns Filtered log entries
 */
export function getFeedbackByType(type: string): readonly FeedbackLogEntry[] {
  return feedbackLog.filter((entry) => entry.event.type === type)
}

/**
 * Filter feedback log by action
 *
 * @param action - The action to filter by
 * @returns Filtered log entries
 */
export function getFeedbackByAction(
  action: FeedbackLogEntry['action']
): readonly FeedbackLogEntry[] {
  return feedbackLog.filter((entry) => entry.action === action)
}

/**
 * Export feedback log as JSON
 *
 * @returns JSON string of the feedback log
 */
export function exportFeedbackLog(): string {
  return JSON.stringify(feedbackLog, null, 2)
}

/**
 * Reset debug module state (for testing)
 */
export function resetDebug(): void {
  clearFeedbackLog()
}
