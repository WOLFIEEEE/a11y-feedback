/**
 * Core announcement engine for a11y-feedback
 * Handles screen reader announcements with deterministic re-announcement support
 * @module modules/announcer
 */

import type { FeedbackEvent, AnnouncerState, AriaLive } from '../types'
import { ANNOUNCEMENT_DEBOUNCE_MS, REGION_CLEAR_DELAY_MS } from '../constants'
import { announceToRegion, initializeRegions } from './regions'
import { getZeroWidthChar, wait } from '../utils/timing'
import { isDebugEnabled } from '../config'

/**
 * Internal announcer state
 */
const state: AnnouncerState = {
  lastPoliteMessage: null,
  lastAssertiveMessage: null,
  lastPoliteTimestamp: 0,
  lastAssertiveTimestamp: 0,
  zwcCounter: 0,
}

/**
 * Pending announcement queue for debouncing
 */
let pendingPolite: FeedbackEvent | null = null
let pendingAssertive: FeedbackEvent | null = null
let politeTimeoutId: ReturnType<typeof setTimeout> | null = null
let assertiveTimeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Announce a feedback event to the appropriate live region
 *
 * @param event - The feedback event to announce
 * @returns Promise that resolves when announcement is made
 */
export async function announce(event: FeedbackEvent): Promise<void> {
  // Ensure regions are initialized
  initializeRegions()

  const { message, ariaLive, options } = event

  // Get the last message and timestamp for this region
  const lastMessage =
    ariaLive === 'assertive' ? state.lastAssertiveMessage : state.lastPoliteMessage
  const lastTimestamp =
    ariaLive === 'assertive' ? state.lastAssertiveTimestamp : state.lastPoliteTimestamp

  // Check if we need to force re-announcement
  const needsForce = options.force === true || message === lastMessage

  // Prepare the content, adding ZWC if needed for re-announcement
  const content = needsForce ? appendZeroWidthChar(message) : message

  // Check if we need to debounce
  const timeSinceLastAnnouncement = Date.now() - lastTimestamp
  const needsDebounce = timeSinceLastAnnouncement < ANNOUNCEMENT_DEBOUNCE_MS

  if (needsDebounce) {
    // Queue the announcement
    await queueAnnouncement(event, content, ariaLive)
  } else {
    // Announce immediately
    await performAnnouncement(content, ariaLive)
  }

  // Update state
  if (ariaLive === 'assertive') {
    state.lastAssertiveMessage = message
    state.lastAssertiveTimestamp = Date.now()
  } else {
    state.lastPoliteMessage = message
    state.lastPoliteTimestamp = Date.now()
  }

  // Log in debug mode
  if (isDebugEnabled()) {
    logAnnouncement(event, content, needsForce)
  }
}

/**
 * Append a zero-width character to force re-announcement
 *
 * @param message - Original message
 * @returns Message with ZWC appended
 */
function appendZeroWidthChar(message: string): string {
  const zwc = getZeroWidthChar(state.zwcCounter)
  state.zwcCounter++
  return `${message}${zwc}`
}

/**
 * Queue an announcement for debounced delivery
 *
 * @param event - The feedback event
 * @param content - The prepared content
 * @param type - The live region type
 */
async function queueAnnouncement(
  event: FeedbackEvent,
  content: string,
  type: AriaLive
): Promise<void> {
  if (type === 'assertive') {
    // Assertive announcements should interrupt and replace pending ones
    if (assertiveTimeoutId !== null) {
      clearTimeout(assertiveTimeoutId)
    }
    pendingAssertive = event

    await new Promise<void>((resolve) => {
      assertiveTimeoutId = setTimeout(() => {
        void performAnnouncement(content, 'assertive').then(resolve)
        pendingAssertive = null
        assertiveTimeoutId = null
      }, ANNOUNCEMENT_DEBOUNCE_MS)
    })
  } else {
    // Polite announcements can be queued
    if (politeTimeoutId !== null) {
      clearTimeout(politeTimeoutId)
    }
    pendingPolite = event

    await new Promise<void>((resolve) => {
      politeTimeoutId = setTimeout(() => {
        void performAnnouncement(content, 'polite').then(resolve)
        pendingPolite = null
        politeTimeoutId = null
      }, ANNOUNCEMENT_DEBOUNCE_MS)
    })
  }
}

/**
 * Perform the actual announcement to the live region
 *
 * @param content - The content to announce
 * @param type - The live region type
 */
async function performAnnouncement(content: string, type: AriaLive): Promise<void> {
  // Small delay after clearing to ensure screen readers detect the change
  await wait(REGION_CLEAR_DELAY_MS)

  // Announce to the region
  await announceToRegion(type, content)
}

/**
 * Log announcement details in debug mode
 *
 * @param event - The feedback event
 * @param content - The actual content announced
 * @param forced - Whether re-announcement was forced
 */
function logAnnouncement(event: FeedbackEvent, content: string, forced: boolean): void {
  // Using console.warn to bypass no-console rule (allowed in debug mode)
  console.warn('[a11y-feedback] Announcement:', {
    message: event.message,
    type: event.type,
    role: event.role,
    ariaLive: event.ariaLive,
    forced,
    contentLength: content.length,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Get the current announcer state
 * Useful for testing and debugging
 *
 * @returns Copy of the current state
 */
export function getAnnouncerState(): AnnouncerState {
  return { ...state }
}

/**
 * Reset the announcer state
 * Useful for testing
 */
export function resetAnnouncerState(): void {
  state.lastPoliteMessage = null
  state.lastAssertiveMessage = null
  state.lastPoliteTimestamp = 0
  state.lastAssertiveTimestamp = 0
  state.zwcCounter = 0

  // Clear any pending announcements
  if (politeTimeoutId !== null) {
    clearTimeout(politeTimeoutId)
    politeTimeoutId = null
  }
  if (assertiveTimeoutId !== null) {
    clearTimeout(assertiveTimeoutId)
    assertiveTimeoutId = null
  }
  pendingPolite = null
  pendingAssertive = null
}

/**
 * Check if there are pending announcements
 *
 * @returns Whether any announcements are queued
 */
export function hasPendingAnnouncements(): boolean {
  return pendingPolite !== null || pendingAssertive !== null
}

/**
 * Get pending announcement for a specific region
 *
 * @param type - The live region type
 * @returns The pending event or null
 */
export function getPendingAnnouncement(type: AriaLive): FeedbackEvent | null {
  return type === 'assertive' ? pendingAssertive : pendingPolite
}

/**
 * Cancel all pending announcements
 */
export function cancelPendingAnnouncements(): void {
  if (politeTimeoutId !== null) {
    clearTimeout(politeTimeoutId)
    politeTimeoutId = null
  }
  if (assertiveTimeoutId !== null) {
    clearTimeout(assertiveTimeoutId)
    assertiveTimeoutId = null
  }
  pendingPolite = null
  pendingAssertive = null
}
