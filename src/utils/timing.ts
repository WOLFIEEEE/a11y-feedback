/**
 * Timing utility functions for a11y-feedback
 * @module utils/timing
 */

import { ZERO_WIDTH_CHARS } from '../constants'

/**
 * Wait for a microtask to complete
 * Uses queueMicrotask for optimal timing
 *
 * @returns Promise that resolves after microtask
 */
export function waitMicrotask(): Promise<void> {
  return new Promise((resolve) => {
    queueMicrotask(resolve)
  })
}

/**
 * Wait for a specified number of milliseconds
 *
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after timeout
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Wait for the next animation frame
 *
 * @returns Promise that resolves on next frame
 */
export function waitFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve()
    })
  })
}

/**
 * Generate a zero-width character suffix for forcing re-announcements
 * Screen readers may ignore identical consecutive messages, so we append
 * invisible characters to make each message unique
 *
 * @param counter - Counter value to determine which character to use
 * @returns A zero-width character
 */
export function getZeroWidthChar(counter: number): string {
  const index = counter % ZERO_WIDTH_CHARS.length
  const char = ZERO_WIDTH_CHARS[index]
  return char ?? ZERO_WIDTH_CHARS[0] ?? ''
}

/**
 * Generate a unique ID for feedback events
 *
 * @returns Unique string ID
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `a11y-${timestamp}-${random}`
}

/**
 * Create a debounced function
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function debounced(...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Create a throttled function
 *
 * @param fn - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function throttled(...args: Parameters<T>): void {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= limit) {
      lastCall = now
      fn(...args)
    } else if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
        timeoutId = null
      }, limit - timeSinceLastCall)
    }
  }
}

/**
 * Check if a timeout value represents "no auto-dismiss"
 *
 * @param timeout - Timeout value in milliseconds
 * @returns Whether the timeout indicates no auto-dismiss
 */
export function isNoAutoDismiss(timeout: number): boolean {
  return timeout === 0 || timeout === Infinity || !Number.isFinite(timeout)
}
