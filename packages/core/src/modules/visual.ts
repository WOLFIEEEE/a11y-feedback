/**
 * Visual feedback component for a11y-feedback
 * Renders optional visual feedback with motion preferences support
 * @module modules/visual
 */

import type { FeedbackEvent, FeedbackType } from '../types'
import {
  CSS_CLASSES,
  CSS_CLASSES_V2,
  DATA_ATTRIBUTES,
  DEFAULT_TIMEOUTS,
  POSITION_STYLES,
  FEEDBACK_SEMANTICS,
} from '../constants'
import { getConfig, isVisualEnabled, onConfigChange, isGroupingEnabled } from '../config'
import {
  createElement,
  applyStyles,
  removeElement,
  querySelector,
  isDOMAvailable,
  prefersReducedMotion,
} from '../utils/dom'
import { getTranslation, isRTL } from './i18n'
import { isNoAutoDismiss } from '../utils/timing'
import { unregisterEvent } from './dedupe'
import { renderActions, getActionsCSS, cleanupActionState } from './actions'
import { renderProgressBar, getProgressCSS, setProgressElement, hasActiveProgress } from './progress'
import { renderRichContent, getRichContentCSS } from './rich-content'
import { addToGroup, getGroupForNotification, getGroupingCSS } from './grouping'
import { playSound } from './sound'
import { triggerHaptic } from './haptics'
import { registerNotification, unregisterNotification } from './keyboard'
import { addToHistory } from './notification-center'

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
 * Uses CSS custom properties for theming
 */
const VISUAL_STYLES = `
  /* CSS Custom Properties for Theming */
  :root {
    /* Base colors */
    --a11y-feedback-bg: #1f2937;
    --a11y-feedback-text: #f9fafb;
    --a11y-feedback-text-muted: #9ca3af;
    --a11y-feedback-shadow: rgba(0, 0, 0, 0.1);
    
    /* Semantic colors */
    --a11y-feedback-success: #10b981;
    --a11y-feedback-error: #ef4444;
    --a11y-feedback-warning: #f59e0b;
    --a11y-feedback-info: #3b82f6;
    --a11y-feedback-loading: #8b5cf6;
    
    /* Focus and hover states */
    --a11y-feedback-focus-ring: #3b82f6;
    --a11y-feedback-hover-bg: rgba(255, 255, 255, 0.1);
    
    /* Spacing */
    --a11y-feedback-gap: 0.5rem;
    --a11y-feedback-padding: 0.875rem 1rem;
    --a11y-feedback-border-radius: 0.5rem;
    --a11y-feedback-border-width: 4px;
    --a11y-feedback-max-width: 24rem;
    
    /* Typography */
    --a11y-feedback-font-family: system-ui, -apple-system, sans-serif;
    --a11y-feedback-font-size: 0.875rem;
    --a11y-feedback-line-height: 1.4;
    
    /* Animation */
    --a11y-feedback-transition-duration: 0.2s;
    --a11y-feedback-transition-easing: ease;
  }

  /* Light mode overrides */
  @media (prefers-color-scheme: light) {
    :root {
      --a11y-feedback-bg: #ffffff;
      --a11y-feedback-text: #1f2937;
      --a11y-feedback-text-muted: #6b7280;
      --a11y-feedback-hover-bg: rgba(0, 0, 0, 0.05);
    }
  }

  .${CSS_CLASSES.container} {
    position: fixed;
    z-index: var(--a11y-feedback-z-index, 9999);
    display: flex;
    flex-direction: column;
    gap: var(--a11y-feedback-gap);
    max-width: var(--a11y-feedback-max-width);
    pointer-events: none;
  }

  .${CSS_CLASSES.item} {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: var(--a11y-feedback-padding);
    border-radius: var(--a11y-feedback-border-radius);
    background: var(--a11y-feedback-bg);
    color: var(--a11y-feedback-text);
    font-family: var(--a11y-feedback-font-family);
    font-size: var(--a11y-feedback-font-size);
    line-height: var(--a11y-feedback-line-height);
    box-shadow: 0 4px 6px -1px var(--a11y-feedback-shadow), 0 2px 4px -1px var(--a11y-feedback-shadow);
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
    transition: opacity var(--a11y-feedback-transition-duration) var(--a11y-feedback-transition-easing), 
                transform var(--a11y-feedback-transition-duration) var(--a11y-feedback-transition-easing);
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

  /* RTL support */
  [dir="rtl"] .${CSS_CLASSES.item}.${CSS_CLASSES.entering},
  [dir="rtl"] .${CSS_CLASSES.item}.${CSS_CLASSES.exiting} {
    transform: translateX(-1rem);
  }

  .${CSS_CLASSES.itemSuccess} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-success);
  }

  .${CSS_CLASSES.itemError} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-error);
  }

  .${CSS_CLASSES.itemWarning} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-warning);
  }

  .${CSS_CLASSES.itemInfo} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-info);
  }

  .${CSS_CLASSES.itemLoading} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-loading);
  }

  /* RTL border support */
  [dir="rtl"] .${CSS_CLASSES.itemSuccess},
  [dir="rtl"] .${CSS_CLASSES.itemError},
  [dir="rtl"] .${CSS_CLASSES.itemWarning},
  [dir="rtl"] .${CSS_CLASSES.itemInfo},
  [dir="rtl"] .${CSS_CLASSES.itemLoading} {
    border-left: none;
    border-right: var(--a11y-feedback-border-width) solid;
  }

  [dir="rtl"] .${CSS_CLASSES.itemSuccess} { border-right-color: var(--a11y-feedback-success); }
  [dir="rtl"] .${CSS_CLASSES.itemError} { border-right-color: var(--a11y-feedback-error); }
  [dir="rtl"] .${CSS_CLASSES.itemWarning} { border-right-color: var(--a11y-feedback-warning); }
  [dir="rtl"] .${CSS_CLASSES.itemInfo} { border-right-color: var(--a11y-feedback-info); }
  [dir="rtl"] .${CSS_CLASSES.itemLoading} { border-right-color: var(--a11y-feedback-loading); }

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
    color: var(--a11y-feedback-text-muted);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  [dir="rtl"] .${CSS_CLASSES.dismissButton} {
    margin: -0.25rem 0.5rem -0.25rem -0.25rem;
  }

  .${CSS_CLASSES.dismissButton}:hover {
    color: var(--a11y-feedback-text);
    background: var(--a11y-feedback-hover-bg);
  }

  .${CSS_CLASSES.dismissButton}:focus {
    outline: 2px solid var(--a11y-feedback-focus-ring);
    outline-offset: 2px;
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
 * Supports CSP nonce for secure style injection
 */
function injectStyles(): void {
  if (!isDOMAvailable() || styleElement !== null) {
    return
  }

  const config = getConfig()
  styleElement = document.createElement('style')
  styleElement.setAttribute('data-a11y-feedback-styles', '')
  
  // Apply CSP nonce if configured
  if (config.cspNonce !== undefined && config.cspNonce !== '') {
    styleElement.setAttribute('nonce', config.cspNonce)
  }
  
  // Combine all styles (v1 + v2)
  const allStyles = [
    VISUAL_STYLES,
    getActionsCSS(),
    getProgressCSS(),
    getRichContentCSS(),
    getGroupingCSS(),
  ].join('\n')
  
  styleElement.textContent = allStyles
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
    'aria-label': getTranslation('notificationsLabel'),
  })

  // Apply position styles
  const positionStyle = POSITION_STYLES[config.visualPosition]
  applyStyles(container, positionStyle)

  // Add reduced motion class if needed
  if (prefersReducedMotion()) {
    container.classList.add(CSS_CLASSES.reducedMotion)
  }

  // Add RTL class if needed
  if (isRTL()) {
    container.setAttribute('dir', 'rtl')
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

  // Play sound if enabled (v2.0)
  if (event.options.sound !== false) {
    playSound(event.type)
  }

  // Trigger haptic if enabled (v2.0)
  if (event.options.haptic !== false) {
    triggerHaptic(event.type)
  }

  // Add to history (v2.0)
  addToHistory(event)

  // Check for grouping (v2.0)
  if (isGroupingEnabled() && event.options.group) {
    const group = addToGroup(event)
    if (group && group.notifications.length > 1) {
      // Update existing group UI instead of adding new item
      updateGroupUI(group.id)
      return
    }
  }

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

  // Auto-focus first action for errors (v2.0)
  if (event.type === 'error' && event.actions && event.actions.length > 0) {
    const firstAction = item.querySelector<HTMLButtonElement>('[data-autofocus]')
    if (firstAction) {
      setTimeout(() => firstAction.focus(), 100)
    }
  }

  // Set up auto-dismiss if applicable
  setupAutoDismiss(event)
}

/**
 * Update UI for a notification group
 */
function updateGroupUI(groupId: string): void {
  // Find and update existing group element
  const existingGroup = container?.querySelector(`[data-group-id="${groupId}"]`)
  
  if (existingGroup) {
    // Re-render the group
    const group = getGroupForNotification(groupId)
    if (group) {
      // Update badge count
      const badge = existingGroup.querySelector(`.${CSS_CLASSES_V2.groupBadge}`)
      if (badge) {
        badge.textContent = String(group.notifications.length)
      }
    }
  }
}

/**
 * Create a visual feedback item element
 */
function createVisualItem(event: FeedbackEvent): HTMLElement {
  const { type, message, id, options, actions, richContent } = event
  const typeClass = getTypeClass(type)
  const icon = ICONS[type]

  const item = createElement('div', {
    [DATA_ATTRIBUTES.visualItem]: '',
    [DATA_ATTRIBUTES.feedbackId]: id,
    [DATA_ATTRIBUTES.feedbackType]: type,
    class: `${CSS_CLASSES.item} ${typeClass} ${CSS_CLASSES.entering}`,
    role: 'status',
    'aria-live': 'off', // Don't re-announce visually
    tabindex: '-1', // Allow focus for keyboard navigation
  })

  // Make focusable for keyboard navigation
  item.setAttribute('tabindex', '0')

  // Check if we have rich content
  if (richContent) {
    // Use rich content rendering
    const richContentEl = renderRichContent(richContent, message)
    item.appendChild(richContentEl)
  } else {
    // Icon
    const iconWrapper = createElement('span')
    iconWrapper.innerHTML = icon
    item.appendChild(iconWrapper)

    // Content
    const content = createElement('span', {
      'data-content': '',
      class: 'a11y-feedback-content',
    })
    content.textContent = message
    item.appendChild(content)
  }

  // Progress bar for loading type
  if (type === 'loading' && hasActiveProgress(id)) {
    const progressBar = renderProgressBar(id)
    item.appendChild(progressBar)
    setProgressElement(id, item)
  }

  // Action buttons (v2.0)
  const eventActions = actions || options.actions
  if (eventActions && eventActions.length > 0) {
    const actionsContainer = renderActions(
      eventActions,
      id,
      event,
      () => dismissVisualFeedback(id)
    )
    item.appendChild(actionsContainer)
  }

  // Dismiss button (only if no actions or not an error)
  if (!eventActions || eventActions.length === 0 || type !== 'error') {
    const dismissButton = createElement('button', {
      type: 'button',
      class: CSS_CLASSES.dismissButton,
      'aria-label': getTranslation('dismiss'),
    })
    dismissButton.innerHTML = CLOSE_ICON
    dismissButton.addEventListener('click', () => {
      dismissVisualFeedback(id)
    })
    item.appendChild(dismissButton)
  }

  // Add custom class if provided
  if (options.className !== undefined && options.className !== '') {
    item.classList.add(options.className)
  }

  // Register for keyboard navigation
  registerNotification(id)

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

    // V2.0 cleanup
    cleanupActionState(id)
    unregisterNotification(id)

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

