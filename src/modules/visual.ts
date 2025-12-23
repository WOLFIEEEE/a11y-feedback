/**
 * Visual feedback component for a11y-feedback
 * Renders optional visual feedback with motion preferences support
 * @module modules/visual
 */

import type { FeedbackEvent, FeedbackType } from '../types'
import {
  CSS_CLASSES,
  DATA_ATTRIBUTES,
  DEFAULT_TIMEOUTS,
  POSITION_STYLES,
  FEEDBACK_SEMANTICS,
} from '../constants'
import { getConfig, isVisualEnabled, onConfigChange } from '../config'
import {
  createElement,
  applyStyles,
  removeElement,
  querySelector,
  isDOMAvailable,
  prefersReducedMotion,
} from '../utils/dom'
import { isNoAutoDismiss } from '../utils/timing'
import { unregisterEvent } from './dedupe'

/**
 * Visual feedback container element
 */
let container: HTMLElement | null = null

/**
 * Active visual items mapped by event ID
 */
const activeItems: Map<string, HTMLElement> = new Map()

/**
 * Timeout IDs for auto-dismiss
 */
const dismissTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map()

/**
 * CSS styles for the visual feedback component
 */
const VISUAL_STYLES = `
  .${CSS_CLASSES.container} {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 24rem;
    pointer-events: none;
  }

  .${CSS_CLASSES.item} {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    background: #1f2937;
    color: #f9fafb;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .${CSS_CLASSES.reducedMotion} .${CSS_CLASSES.item} {
    transition: none;
  }

  .${CSS_CLASSES.item}.${CSS_CLASSES.entering} {
    opacity: 0;
    transform: translateX(1rem);
  }

  .${CSS_CLASSES.item}.${CSS_CLASSES.exiting} {
    opacity: 0;
    transform: translateX(1rem);
  }

  .${CSS_CLASSES.itemSuccess} {
    border-left: 4px solid #10b981;
  }

  .${CSS_CLASSES.itemError} {
    border-left: 4px solid #ef4444;
  }

  .${CSS_CLASSES.itemWarning} {
    border-left: 4px solid #f59e0b;
  }

  .${CSS_CLASSES.itemInfo} {
    border-left: 4px solid #3b82f6;
  }

  .${CSS_CLASSES.itemLoading} {
    border-left: 4px solid #8b5cf6;
  }

  .${CSS_CLASSES.item} [data-icon] {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .${CSS_CLASSES.item} [data-content] {
    flex: 1;
    min-width: 0;
  }

  .${CSS_CLASSES.dismissButton} {
    flex-shrink: 0;
    padding: 0.25rem;
    margin: -0.25rem -0.25rem -0.25rem 0.5rem;
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .${CSS_CLASSES.dismissButton}:hover {
    color: #f9fafb;
    background: rgba(255, 255, 255, 0.1);
  }

  .${CSS_CLASSES.dismissButton}:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @media (prefers-color-scheme: light) {
    .${CSS_CLASSES.item} {
      background: #ffffff;
      color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .${CSS_CLASSES.dismissButton} {
      color: #6b7280;
    }

    .${CSS_CLASSES.dismissButton}:hover {
      color: #1f2937;
      background: rgba(0, 0, 0, 0.05);
    }
  }
`

/**
 * Icons for each feedback type (SVG paths)
 */
const ICONS: Record<FeedbackType, string> = {
  success: `<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #10b981;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>`,
  error: `<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #ef4444;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
  </svg>`,
  warning: `<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #f59e0b;">
    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
  </svg>`,
  info: `<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #3b82f6;">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
  </svg>`,
  loading: `<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #8b5cf6;">
    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
  </svg>`,
}

/**
 * Close icon SVG
 */
const CLOSE_ICON = `<svg viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem;">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
</svg>`

/**
 * Style element for visual feedback
 */
let styleElement: HTMLStyleElement | null = null

/**
 * Initialize the visual feedback system
 */
export function initializeVisual(): void {
  if (!isDOMAvailable() || !isVisualEnabled()) {
    return
  }

  // Inject styles if not already present
  injectStyles()

  // Create container if not exists
  ensureContainer()

  // Listen for config changes
  onConfigChange((config) => {
    if (config.visual) {
      injectStyles()
      ensureContainer()
    } else {
      destroyVisual()
    }
  })
}

/**
 * Inject the CSS styles for visual feedback
 */
function injectStyles(): void {
  if (!isDOMAvailable() || styleElement !== null) {
    return
  }

  styleElement = document.createElement('style')
  styleElement.setAttribute('data-a11y-feedback-styles', '')
  styleElement.textContent = VISUAL_STYLES
  document.head.appendChild(styleElement)
}

/**
 * Ensure the container element exists
 */
function ensureContainer(): void {
  if (!isDOMAvailable() || container !== null) {
    return
  }

  const config = getConfig()

  // Create container
  container = createElement('div', {
    [DATA_ATTRIBUTES.visual]: '',
    class: CSS_CLASSES.container,
    role: 'region',
    'aria-label': 'Notifications',
  })

  // Apply position styles
  const positionStyle = POSITION_STYLES[config.visualPosition]
  applyStyles(container, positionStyle)

  // Add reduced motion class if needed
  if (prefersReducedMotion()) {
    container.classList.add(CSS_CLASSES.reducedMotion)
  }

  // Append to configured container or body
  const targetContainer = resolveContainer(config.visualContainer)
  targetContainer.appendChild(container)
}

/**
 * Resolve the container element from config
 */
function resolveContainer(containerOption: HTMLElement | string | null): HTMLElement {
  if (containerOption === null) {
    return document.body
  }

  if (typeof containerOption === 'string') {
    const element = querySelector<HTMLElement>(containerOption)
    return element ?? document.body
  }

  return containerOption
}

/**
 * Show visual feedback for an event
 *
 * @param event - The feedback event
 */
export function showVisualFeedback(event: FeedbackEvent): void {
  if (!isVisualEnabled()) {
    return
  }

  // Initialize if needed
  initializeVisual()

  if (container === null) {
    return
  }

  const config = getConfig()

  // Check if we need to remove old items to stay within limit
  while (activeItems.size >= config.maxVisualItems) {
    const firstKey = activeItems.keys().next().value
    if (firstKey !== undefined && typeof firstKey === 'string') {
      dismissVisualFeedback(firstKey)
    }
  }

  // Create the visual item
  const item = createVisualItem(event)

  // Add to container and track
  container.appendChild(item)
  activeItems.set(event.id, item)

  // Trigger enter animation
  requestAnimationFrame(() => {
    item.classList.remove(CSS_CLASSES.entering)
  })

  // Set up auto-dismiss if applicable
  setupAutoDismiss(event)
}

/**
 * Create a visual feedback item element
 */
function createVisualItem(event: FeedbackEvent): HTMLElement {
  const { type, message, id } = event
  const typeClass = getTypeClass(type)
  const icon = ICONS[type]

  const item = createElement('div', {
    [DATA_ATTRIBUTES.visualItem]: '',
    [DATA_ATTRIBUTES.feedbackId]: id,
    [DATA_ATTRIBUTES.feedbackType]: type,
    class: `${CSS_CLASSES.item} ${typeClass} ${CSS_CLASSES.entering}`,
    role: 'status',
    'aria-live': 'off', // Don't re-announce visually
  })

  // Icon
  const iconWrapper = createElement('span')
  iconWrapper.innerHTML = icon
  item.appendChild(iconWrapper)

  // Content
  const content = createElement('span', {
    'data-content': '',
  })
  content.textContent = message
  item.appendChild(content)

  // Dismiss button
  const dismissButton = createElement('button', {
    type: 'button',
    class: CSS_CLASSES.dismissButton,
    'aria-label': 'Dismiss',
  })
  dismissButton.innerHTML = CLOSE_ICON
  dismissButton.addEventListener('click', () => {
    dismissVisualFeedback(id)
  })
  item.appendChild(dismissButton)

  // Add custom class if provided
  if (event.options.className !== undefined && event.options.className !== '') {
    item.classList.add(event.options.className)
  }

  return item
}

/**
 * Get the CSS class for a feedback type
 */
function getTypeClass(type: FeedbackType): string {
  const classMap: Record<FeedbackType, string> = {
    success: CSS_CLASSES.itemSuccess,
    error: CSS_CLASSES.itemError,
    warning: CSS_CLASSES.itemWarning,
    info: CSS_CLASSES.itemInfo,
    loading: CSS_CLASSES.itemLoading,
  }
  return classMap[type]
}

/**
 * Set up auto-dismiss for a feedback item
 */
function setupAutoDismiss(event: FeedbackEvent): void {
  const semantics = FEEDBACK_SEMANTICS[event.type]

  // Never auto-dismiss errors or items marked as no auto-dismiss
  if (!semantics.autoDismiss) {
    return
  }

  // Get timeout from options or defaults
  const config = getConfig()
  const timeout = event.options.timeout ?? DEFAULT_TIMEOUTS[event.type] ?? config.defaultTimeout

  if (isNoAutoDismiss(timeout)) {
    return
  }

  // Set up the timeout
  const timeoutId = setTimeout(() => {
    dismissVisualFeedback(event.id)
  }, timeout)

  dismissTimeouts.set(event.id, timeoutId)
}

/**
 * Dismiss a visual feedback item
 *
 * @param id - The event ID to dismiss
 */
export function dismissVisualFeedback(id: string): void {
  const item = activeItems.get(id)

  if (item === undefined) {
    return
  }

  // Clear any pending auto-dismiss timeout
  const timeoutId = dismissTimeouts.get(id)
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId)
    dismissTimeouts.delete(id)
  }

  // Trigger exit animation
  item.classList.add(CSS_CLASSES.exiting)

  // Remove after animation (or immediately if reduced motion)
  const removeDelay = prefersReducedMotion() ? 0 : 200

  setTimeout(() => {
    removeElement(item)
    activeItems.delete(id)

    // Also unregister from dedupe
    unregisterEvent(id)

    // Call onDismiss callback if provided
    // Note: We need to find the event to get the callback
    // This is a limitation - we'd need to store the event reference
  }, removeDelay)
}

/**
 * Update a visual feedback item (for replacement)
 *
 * @param event - The new event data
 */
export function updateVisualFeedback(event: FeedbackEvent): void {
  const item = activeItems.get(event.id)

  if (item === undefined) {
    // Item doesn't exist, create it instead
    showVisualFeedback(event)
    return
  }

  // Update content
  const content = item.querySelector('[data-content]')
  if (content !== null) {
    content.textContent = event.message
  }

  // Update type class if changed
  const currentType = item.getAttribute(DATA_ATTRIBUTES.feedbackType)
  if (currentType !== event.type) {
    // Remove old type class
    if (currentType !== null) {
      const oldClass = getTypeClass(currentType as FeedbackType)
      item.classList.remove(oldClass)
    }

    // Add new type class
    const newClass = getTypeClass(event.type)
    item.classList.add(newClass)
    item.setAttribute(DATA_ATTRIBUTES.feedbackType, event.type)

    // Update icon
    const iconWrapper = item.querySelector('[data-icon]')?.parentElement
    if (iconWrapper !== null && iconWrapper !== undefined) {
      iconWrapper.innerHTML = ICONS[event.type]
    }
  }

  // Reset auto-dismiss timer
  const existingTimeout = dismissTimeouts.get(event.id)
  if (existingTimeout !== undefined) {
    clearTimeout(existingTimeout)
    dismissTimeouts.delete(event.id)
  }
  setupAutoDismiss(event)
}

/**
 * Dismiss all visual feedback items
 */
export function dismissAllVisualFeedback(): void {
  for (const id of activeItems.keys()) {
    dismissVisualFeedback(id)
  }
}

/**
 * Get the count of active visual items
 */
export function getActiveVisualCount(): number {
  return activeItems.size
}

/**
 * Destroy the visual feedback system
 */
export function destroyVisual(): void {
  // Dismiss all items
  dismissAllVisualFeedback()

  // Remove container
  removeElement(container)
  container = null

  // Remove styles
  removeElement(styleElement)
  styleElement = null

  // Clear all timeouts
  for (const timeoutId of dismissTimeouts.values()) {
    clearTimeout(timeoutId)
  }
  dismissTimeouts.clear()
}

/**
 * Reset visual module state (for testing)
 */
export function resetVisual(): void {
  destroyVisual()
  activeItems.clear()
}
