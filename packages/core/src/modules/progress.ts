/**
 * Progress Notifications Module for a11y-feedback v2.0
 * Handles progress bars with ARIA progressbar role for accessibility
 * @module progress
 */

import type { ProgressOptions, ProgressController, FeedbackEvent } from '../types'
import { CSS_CLASSES_V2, DEFAULT_PROGRESS_ANNOUNCE_AT } from '../constants'
import { getConfig } from '../config'
import { announceToRegion } from './regions'

/**
 * Internal state for tracking progress notifications
 */
interface ProgressState {
  /** Current progress value */
  value: number
  /** Maximum value */
  max: number
  /** Whether indeterminate */
  indeterminate: boolean
  /** Last announced percentage */
  lastAnnouncedAt: number
  /** Announce thresholds */
  announceAt: readonly number[]
  /** Whether still active */
  active: boolean
  /** The notification element */
  element: HTMLElement | null
  /** The feedback event */
  event: FeedbackEvent | null
  /** Original message */
  message: string
}

/**
 * Map of progress notification states
 */
const progressStates = new Map<string, ProgressState>()

/**
 * Create a progress notification and return a controller
 * 
 * @param notificationId - Unique ID for this progress notification
 * @param message - Initial message to display
 * @param options - Progress options
 * @returns ProgressController for updating the progress
 */
export function createProgressController(
  notificationId: string,
  message: string,
  options: ProgressOptions = {}
): ProgressController {
  const state: ProgressState = {
    value: options.initialValue ?? 0,
    max: options.max ?? 100,
    indeterminate: options.indeterminate ?? false,
    lastAnnouncedAt: 0,
    announceAt: options.announceAt ?? DEFAULT_PROGRESS_ANNOUNCE_AT,
    active: true,
    element: null,
    event: null,
    message,
  }

  progressStates.set(notificationId, state)

  // Announce initial progress
  if (!state.indeterminate && state.value > 0) {
    announceProgress(notificationId, state)
  }

  const controller: ProgressController = {
    update: (value: number, newMessage?: string) => {
      updateProgress(notificationId, value, newMessage)
    },
    complete: (successMessage?: string) => {
      completeProgress(notificationId, successMessage)
    },
    fail: (errorMessage?: string) => {
      failProgress(notificationId, errorMessage)
    },
    getValue: () => {
      const s = progressStates.get(notificationId)
      return s?.value ?? 0
    },
    isActive: () => {
      const s = progressStates.get(notificationId)
      return s?.active ?? false
    },
    dismiss: () => {
      dismissProgress(notificationId)
    },
  }

  return controller
}

/**
 * Update progress value
 */
function updateProgress(notificationId: string, value: number, message?: string): void {
  const state = progressStates.get(notificationId)
  if (!state || !state.active) return

  // Clamp value
  state.value = Math.max(0, Math.min(state.max, value))
  
  if (message) {
    state.message = message
  }

  // Update visual element
  if (state.element) {
    updateProgressElement(state.element, state)
  }

  // Announce at thresholds
  announceProgressAtThreshold(notificationId, state)
}

/**
 * Complete progress notification (transition to success)
 */
function completeProgress(notificationId: string, message?: string): void {
  const state = progressStates.get(notificationId)
  if (!state || !state.active) return

  state.active = false
  state.value = state.max

  // Update to success state
  if (state.element) {
    const progressBar = state.element.querySelector<HTMLElement>(`.${CSS_CLASSES_V2.progressBar}`)
    if (progressBar) {
      progressBar.style.width = '100%'
    }
    
    // Add success styling
    state.element.classList.remove('a11y-feedback-item--loading')
    state.element.classList.add('a11y-feedback-item--success')
  }

  // Announce completion
  const completeMessage = message || `${state.message} - Complete`
  void announceToRegion('polite', completeMessage)

  // Clean up after delay
  setTimeout(() => {
    cleanupProgress(notificationId)
  }, 5000)
}

/**
 * Fail progress notification (transition to error)
 */
function failProgress(notificationId: string, message?: string): void {
  const state = progressStates.get(notificationId)
  if (!state || !state.active) return

  state.active = false

  // Update to error state
  if (state.element) {
    const progressBar = state.element.querySelector<HTMLElement>(`.${CSS_CLASSES_V2.progressBar}`)
    if (progressBar) {
      progressBar.classList.add('a11y-feedback-progress-bar--error')
    }
    
    // Add error styling
    state.element.classList.remove('a11y-feedback-item--loading')
    state.element.classList.add('a11y-feedback-item--error')
  }

  // Announce failure
  const failMessage = message || `${state.message} - Failed`
  void announceToRegion('assertive', failMessage)
}

/**
 * Dismiss progress notification
 */
function dismissProgress(notificationId: string): void {
  const state = progressStates.get(notificationId)
  if (!state) return

  state.active = false
  cleanupProgress(notificationId)
}

/**
 * Clean up progress state
 */
function cleanupProgress(notificationId: string): void {
  progressStates.delete(notificationId)
}

/**
 * Announce progress at defined thresholds
 */
function announceProgressAtThreshold(notificationId: string, state: ProgressState): void {
  if (state.indeterminate) return

  const percentage = Math.round((state.value / state.max) * 100)

  // Find the next threshold to announce
  for (const threshold of state.announceAt) {
    if (percentage >= threshold && state.lastAnnouncedAt < threshold) {
      state.lastAnnouncedAt = threshold
      announceProgress(notificationId, state)
      break
    }
  }
}

/**
 * Announce current progress to screen readers
 */
function announceProgress(notificationId: string, state: ProgressState): void {
  const percentage = Math.round((state.value / state.max) * 100)
  const announcement = `${state.message}: ${percentage}% complete`
  
  // Use polite announcement for progress updates
  void announceToRegion('polite', announcement)

  if (getConfig().debug) {
    console.log(`[a11y-feedback] Progress ${notificationId}: ${percentage}%`)
  }
}

/**
 * Update the visual progress element
 */
function updateProgressElement(element: HTMLElement, state: ProgressState): void {
  const progressBar = element.querySelector<HTMLElement>(`.${CSS_CLASSES_V2.progressBar}`)
  const messageEl = element.querySelector<HTMLElement>('.a11y-feedback-content')

  if (progressBar && !state.indeterminate) {
    const percentage = (state.value / state.max) * 100
    progressBar.style.width = `${percentage}%`
    progressBar.setAttribute('aria-valuenow', String(state.value))
  }

  if (messageEl) {
    messageEl.textContent = state.message
  }
}

/**
 * Render progress bar element
 * 
 * @param notificationId - The notification ID
 * @param options - Progress options
 * @returns The progress bar element
 */
export function renderProgressBar(
  notificationId: string,
  options: ProgressOptions = {}
): HTMLElement {
  const state = progressStates.get(notificationId)
  const value = state?.value ?? options.initialValue ?? 0
  const max = state?.max ?? options.max ?? 100
  const indeterminate = state?.indeterminate ?? options.indeterminate ?? false

  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.progress
  if (indeterminate) {
    container.classList.add(CSS_CLASSES_V2.progressIndeterminate)
  }

  const bar = document.createElement('div')
  bar.className = CSS_CLASSES_V2.progressBar
  bar.setAttribute('role', 'progressbar')
  bar.setAttribute('aria-valuemin', '0')
  bar.setAttribute('aria-valuemax', String(max))
  
  if (!indeterminate) {
    bar.setAttribute('aria-valuenow', String(value))
    bar.style.width = `${(value / max) * 100}%`
  } else {
    bar.removeAttribute('aria-valuenow')
  }

  container.appendChild(bar)

  // Store reference to element
  if (state) {
    state.element = container.parentElement || container
  }

  return container
}

/**
 * Associate a visual element with a progress state
 */
export function setProgressElement(notificationId: string, element: HTMLElement): void {
  const state = progressStates.get(notificationId)
  if (state) {
    state.element = element
  }
}

/**
 * Check if a notification has active progress
 */
export function hasActiveProgress(notificationId: string): boolean {
  const state = progressStates.get(notificationId)
  return state?.active ?? false
}

/**
 * Get current progress percentage
 */
export function getProgressPercentage(notificationId: string): number {
  const state = progressStates.get(notificationId)
  if (!state) return 0
  return Math.round((state.value / state.max) * 100)
}

/**
 * Generate CSS for progress bars
 */
export function getProgressCSS(): string {
  return `
    .${CSS_CLASSES_V2.progress} {
      width: 100%;
      height: 4px;
      background-color: var(--a11y-feedback-progress-bg, rgba(255, 255, 255, 0.2));
      border-radius: 2px;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .${CSS_CLASSES_V2.progressBar} {
      height: 100%;
      background-color: var(--a11y-feedback-progress-fill, #3b82f6);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .${CSS_CLASSES_V2.progressBar}--error {
      background-color: var(--a11y-feedback-error, #ef4444);
    }

    .${CSS_CLASSES_V2.progressIndeterminate} .${CSS_CLASSES_V2.progressBar} {
      width: 30%;
      animation: a11y-feedback-progress-indeterminate 1.5s ease-in-out infinite;
    }

    @keyframes a11y-feedback-progress-indeterminate {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(200%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.progressBar} {
        transition: none;
      }
      
      .${CSS_CLASSES_V2.progressIndeterminate} .${CSS_CLASSES_V2.progressBar} {
        animation: none;
        width: 100%;
        opacity: 0.5;
      }
    }
  `
}

