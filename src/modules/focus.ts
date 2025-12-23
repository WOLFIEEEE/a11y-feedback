/**
 * Focus management for a11y-feedback
 * Handles focus movement with enforced safety rules
 * @module modules/focus
 */

import type { FeedbackEvent, FeedbackType } from '../types'
import { FEEDBACK_SEMANTICS } from '../constants'
import { isDebugEnabled } from '../config'
import { querySelector, isFocusable, getAccessibleName, isDOMAvailable } from '../utils/dom'

/**
 * Result of a focus operation
 */
export interface FocusResult {
  /** Whether focus was moved */
  readonly moved: boolean
  /** The target element selector */
  readonly target: string | null
  /** The accessible name of the focused element */
  readonly elementName: string | null
  /** Reason if focus was blocked */
  readonly blockedReason: string | null
}

/**
 * Check if a feedback type is allowed to move focus
 *
 * @param type - The feedback type
 * @returns Whether focus movement is allowed
 */
export function canMoveFocus(type: FeedbackType): boolean {
  const semantics = FEEDBACK_SEMANTICS[type]
  return semantics.canMoveFocus
}

/**
 * Attempt to move focus based on the feedback event
 * Enforces focus safety rules:
 * - Success must not move focus
 * - Info must not move focus
 * - Loading must not move focus
 * - Warning may move focus
 * - Error may move focus
 *
 * @param event - The feedback event
 * @returns Result of the focus operation
 */
export function handleFocus(event: FeedbackEvent): FocusResult {
  const { type, options } = event

  // No focus target specified
  if (options.focus === undefined || options.focus === '') {
    return {
      moved: false,
      target: null,
      elementName: null,
      blockedReason: null,
    }
  }

  // Check if this type is allowed to move focus
  if (!canMoveFocus(type)) {
    const reason = `Focus movement blocked: ${type} type cannot move focus`

    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Focus blocked:', {
        type,
        requestedTarget: options.focus,
        reason,
      })
    }

    return {
      moved: false,
      target: options.focus,
      elementName: null,
      blockedReason: reason,
    }
  }

  // Attempt to move focus
  return moveFocus(options.focus)
}

/**
 * Move focus to a specific element
 *
 * @param selector - CSS selector for the target element
 * @returns Result of the focus operation
 */
export function moveFocus(selector: string): FocusResult {
  if (!isDOMAvailable()) {
    return {
      moved: false,
      target: selector,
      elementName: null,
      blockedReason: 'DOM not available',
    }
  }

  const element = querySelector<HTMLElement>(selector)

  if (element === null) {
    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Focus target not found:', selector)
    }

    return {
      moved: false,
      target: selector,
      elementName: null,
      blockedReason: `Element not found: ${selector}`,
    }
  }

  // Check if element is focusable
  if (!isFocusable(element)) {
    // Try to make it focusable by adding tabindex
    element.setAttribute('tabindex', '-1')

    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Added tabindex=-1 to make element focusable:', selector)
    }
  }

  // Get the accessible name before focusing
  const elementName = getAccessibleName(element)

  try {
    // Move focus
    element.focus()

    // Verify focus was moved
    const focusMoved = document.activeElement === element

    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Focus moved:', {
        target: selector,
        elementName,
        success: focusMoved,
      })
    }

    return {
      moved: focusMoved,
      target: selector,
      elementName: elementName !== '' ? elementName : null,
      blockedReason: focusMoved ? null : 'Focus failed to move',
    }
  } catch (error) {
    if (isDebugEnabled()) {
      console.error('[a11y-feedback] Focus error:', error)
    }

    return {
      moved: false,
      target: selector,
      elementName: null,
      blockedReason: 'Focus operation threw an error',
    }
  }
}

/**
 * Generate a focus explanation message for screen readers
 *
 * @param elementName - The accessible name of the focused element
 * @returns The explanation message
 */
export function generateFocusExplanation(elementName: string | null): string {
  if (elementName !== null && elementName !== '') {
    return `Focus moved to ${elementName}.`
  }
  return 'Focus moved.'
}

/**
 * Combine a message with focus explanation if applicable
 *
 * @param message - The original message
 * @param event - The feedback event
 * @param focusResult - The result of the focus operation
 * @returns The combined message
 */
export function buildMessageWithFocusExplanation(
  message: string,
  event: FeedbackEvent,
  focusResult: FocusResult
): string {
  // Only add explanation if:
  // - explainFocus option is true
  // - Focus was actually moved
  if (event.options.explainFocus !== true || !focusResult.moved) {
    return message
  }

  const explanation = generateFocusExplanation(focusResult.elementName)
  return `${message} ${explanation}`
}

/**
 * Save the currently focused element
 *
 * @returns The currently focused element or null
 */
export function saveCurrentFocus(): HTMLElement | null {
  if (!isDOMAvailable()) {
    return null
  }

  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) {
    return activeElement
  }

  return null
}

/**
 * Restore focus to a previously saved element
 *
 * @param element - The element to restore focus to
 * @returns Whether focus was restored
 */
export function restoreFocus(element: HTMLElement | null): boolean {
  if (element === null || !isDOMAvailable()) {
    return false
  }

  try {
    element.focus()
    return document.activeElement === element
  } catch {
    return false
  }
}
