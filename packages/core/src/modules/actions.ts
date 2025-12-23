/**
 * Action Buttons Module for a11y-feedback v2.0
 * Handles rendering and accessibility of action buttons in notifications
 * @module actions
 */

import type { NotificationAction, ActionVariant, FeedbackEvent } from '../types'
import { CSS_CLASSES_V2 } from '../constants'
import { getConfig } from '../config'

/**
 * Internal state for tracking action button interactions
 */
interface ActionState {
  /** Currently focused action index */
  focusedIndex: number
  /** Whether actions are being processed */
  processing: boolean
  /** Map of action IDs to their processing state */
  processingActions: Map<string, boolean>
}

/**
 * Action state per notification
 */
const actionStates = new Map<string, ActionState>()

/**
 * Get or create action state for a notification
 */
function getActionState(notificationId: string): ActionState {
  let state = actionStates.get(notificationId)
  if (!state) {
    state = {
      focusedIndex: -1,
      processing: false,
      processingActions: new Map(),
    }
    actionStates.set(notificationId, state)
  }
  return state
}

/**
 * Clean up action state for a notification
 */
export function cleanupActionState(notificationId: string): void {
  actionStates.delete(notificationId)
}

/**
 * Get variant CSS class for an action button
 */
function getVariantClass(variant: ActionVariant = 'secondary'): string {
  switch (variant) {
    case 'primary':
      return CSS_CLASSES_V2.actionPrimary
    case 'danger':
      return CSS_CLASSES_V2.actionDanger
    case 'secondary':
    default:
      return CSS_CLASSES_V2.actionSecondary
  }
}

/**
 * Create an accessible action button element
 */
function createActionButton(
  action: NotificationAction,
  notificationId: string,
  onDismiss?: () => void
): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `${CSS_CLASSES_V2.actionButton} ${getVariantClass(action.variant)}`
  button.setAttribute('data-action-id', action.id)
  button.setAttribute('data-notification-id', notificationId)

  // Accessibility
  if (action.ariaLabel) {
    button.setAttribute('aria-label', action.ariaLabel)
  }

  // Icon support
  if (action.icon) {
    const iconSpan = document.createElement('span')
    iconSpan.className = 'a11y-feedback-action-icon'
    iconSpan.setAttribute('aria-hidden', 'true')
    
    if (typeof action.icon === 'string') {
      iconSpan.innerHTML = action.icon
    } else if (action.icon instanceof SVGElement) {
      iconSpan.appendChild(action.icon.cloneNode(true))
    }
    button.appendChild(iconSpan)
  }

  // Label
  const labelSpan = document.createElement('span')
  labelSpan.className = 'a11y-feedback-action-label'
  labelSpan.textContent = action.label
  button.appendChild(labelSpan)

  // Click handler with loading state
  button.addEventListener('click', async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const state = getActionState(notificationId)
    
    // Prevent double-clicks
    if (state.processingActions.get(action.id)) {
      return
    }

    state.processingActions.set(action.id, true)
    button.setAttribute('aria-busy', 'true')
    button.disabled = true

    try {
      const result = action.onClick()
      if (result instanceof Promise) {
        await result
      }

      // Close notification if configured
      if (action.closeOnClick !== false && onDismiss) {
        onDismiss()
      }
    } catch (error) {
      // Re-enable button on error
      if (getConfig().debug) {
        console.error('[a11y-feedback] Action error:', error)
      }
    } finally {
      state.processingActions.set(action.id, false)
      button.setAttribute('aria-busy', 'false')
      button.disabled = false
    }
  })

  // Keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      button.click()
    }
  })

  return button
}

/**
 * Render action buttons container for a notification
 * 
 * @param actions - Array of action configurations
 * @param notificationId - The notification ID
 * @param event - The feedback event (for context)
 * @param onDismiss - Optional dismiss callback
 * @returns The actions container element
 */
export function renderActions(
  actions: readonly NotificationAction[],
  notificationId: string,
  event: FeedbackEvent,
  onDismiss?: () => void
): HTMLElement {
  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.actions
  container.setAttribute('role', 'group')
  container.setAttribute('aria-label', 'Notification actions')

  // Create action buttons
  actions.forEach((action, index) => {
    const button = createActionButton(action, notificationId, onDismiss)
    
    // Auto-focus first action on errors for immediate recovery
    if (index === 0 && event.type === 'error') {
      button.setAttribute('data-autofocus', 'true')
    }
    
    container.appendChild(button)
  })

  // Setup keyboard navigation between actions
  setupActionKeyboardNav(container, notificationId)

  return container
}

/**
 * Setup keyboard navigation for action buttons
 */
function setupActionKeyboardNav(container: HTMLElement, notificationId: string): void {
  const buttons = container.querySelectorAll<HTMLButtonElement>('button')
  if (buttons.length === 0) return

  const state = getActionState(notificationId)

  container.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement
    if (!target.matches('button')) return

    const currentIndex = Array.from(buttons).indexOf(target as HTMLButtonElement)

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        {
          const nextIndex = (currentIndex + 1) % buttons.length
          const nextBtn = buttons[nextIndex]
          if (nextBtn) {
            nextBtn.focus()
            state.focusedIndex = nextIndex
          }
        }
        break

      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        {
          const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length
          const prevBtn = buttons[prevIndex]
          if (prevBtn) {
            prevBtn.focus()
            state.focusedIndex = prevIndex
          }
        }
        break

      case 'Home':
        e.preventDefault()
        {
          const firstBtn = buttons[0]
          if (firstBtn) {
            firstBtn.focus()
            state.focusedIndex = 0
          }
        }
        break

      case 'End':
        e.preventDefault()
        {
          const lastBtn = buttons[buttons.length - 1]
          if (lastBtn) {
            lastBtn.focus()
            state.focusedIndex = buttons.length - 1
          }
        }
        break
    }
  })
}

/**
 * Focus the first action button in a notification
 */
export function focusFirstAction(notificationId: string): boolean {
  const container = document.querySelector(
    `[data-notification-id="${notificationId}"] .${CSS_CLASSES_V2.actions}`
  )
  
  if (!container) return false

  const firstButton = container.querySelector<HTMLButtonElement>('button')
  if (firstButton) {
    firstButton.focus()
    const state = getActionState(notificationId)
    state.focusedIndex = 0
    return true
  }

  return false
}

/**
 * Get announcement text for available actions
 * This is announced to screen readers when a notification with actions appears
 */
export function getActionsAnnouncement(actions: readonly NotificationAction[]): string {
  if (actions.length === 0) return ''
  
  const firstAction = actions[0]
  if (actions.length === 1 && firstAction) {
    return `Action available: ${firstAction.label}`
  }
  
  const labels = actions.map(a => a.label).join(', ')
  return `${actions.length} actions available: ${labels}`
}

/**
 * Check if any action in a notification is currently processing
 */
export function isActionProcessing(notificationId: string): boolean {
  const state = actionStates.get(notificationId)
  if (!state) return false
  
  for (const processing of state.processingActions.values()) {
    if (processing) return true
  }
  
  return false
}

/**
 * Trigger an action programmatically
 * 
 * @param notificationId - The notification ID
 * @param actionId - The action ID to trigger
 * @returns Promise that resolves when action completes
 */
export async function triggerAction(
  notificationId: string,
  actionId: string
): Promise<void> {
  const button = document.querySelector<HTMLButtonElement>(
    `[data-notification-id="${notificationId}"] [data-action-id="${actionId}"]`
  )
  
  if (button) {
    button.click()
  }
}

/**
 * Generate CSS for action buttons
 */
export function getActionsCSS(): string {
  return `
    .${CSS_CLASSES_V2.actions} {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .${CSS_CLASSES_V2.actionButton} {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.375rem;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
      font-family: inherit;
      line-height: 1.4;
    }

    .${CSS_CLASSES_V2.actionButton}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .${CSS_CLASSES_V2.actionButton}:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .${CSS_CLASSES_V2.actionButton}[aria-busy="true"] {
      position: relative;
    }

    .${CSS_CLASSES_V2.actionButton}[aria-busy="true"]::after {
      content: '';
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: a11y-feedback-spin 0.6s linear infinite;
    }

    .${CSS_CLASSES_V2.actionPrimary} {
      background-color: var(--a11y-feedback-action-primary-bg, #3b82f6);
      color: var(--a11y-feedback-action-primary-text, #ffffff);
    }

    .${CSS_CLASSES_V2.actionPrimary}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-primary-hover, #2563eb);
    }

    .${CSS_CLASSES_V2.actionSecondary} {
      background-color: var(--a11y-feedback-action-secondary-bg, transparent);
      color: var(--a11y-feedback-action-secondary-text, currentColor);
      border-color: var(--a11y-feedback-action-secondary-border, currentColor);
    }

    .${CSS_CLASSES_V2.actionSecondary}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-secondary-hover, rgba(255, 255, 255, 0.1));
    }

    .${CSS_CLASSES_V2.actionDanger} {
      background-color: var(--a11y-feedback-action-danger-bg, #ef4444);
      color: var(--a11y-feedback-action-danger-text, #ffffff);
    }

    .${CSS_CLASSES_V2.actionDanger}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-danger-hover, #dc2626);
    }

    .a11y-feedback-action-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
    }

    .a11y-feedback-action-icon svg {
      width: 100%;
      height: 100%;
    }

    @keyframes a11y-feedback-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.actionButton}[aria-busy="true"]::after {
        animation: none;
        border-style: dotted;
      }
    }
  `
}

