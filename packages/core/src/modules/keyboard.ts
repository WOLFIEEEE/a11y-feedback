/**
 * Keyboard Navigation Module for a11y-feedback v2.0
 * Handles keyboard shortcuts and navigation for notifications
 * @module keyboard
 */

import type { KeyboardConfig, KeyboardShortcutHandler } from '../types'
import { DEFAULT_KEYBOARD_SHORTCUTS, CSS_CLASSES } from '../constants'
import { getConfig, getKeyboardConfig } from '../config'
import { dismissVisualFeedback } from './visual'
import { announceToRegion } from './regions'

/**
 * Internal state for keyboard manager
 */
interface KeyboardState {
  /** Whether keyboard manager is initialized */
  initialized: boolean
  /** Currently focused notification index */
  focusedIndex: number
  /** All focusable notification IDs */
  notificationIds: string[]
  /** Custom shortcut handlers */
  shortcuts: Map<string, KeyboardShortcutHandler>
  /** Event listener reference for cleanup */
  keydownHandler: ((e: KeyboardEvent) => void) | null
  /** Whether focus trap is active (for dialogs) */
  focusTrapActive: boolean
  /** Focus trap container */
  focusTrapContainer: HTMLElement | null
}

const state: KeyboardState = {
  initialized: false,
  focusedIndex: -1,
  notificationIds: [],
  shortcuts: new Map(),
  keydownHandler: null,
  focusTrapActive: false,
  focusTrapContainer: null,
}

/**
 * Initialize the keyboard manager
 * 
 * @param config - Optional keyboard configuration
 */
export function initKeyboardManager(config?: KeyboardConfig): void {
  if (state.initialized) {
    return
  }

  const keyboardConfig = config || getKeyboardConfig()
  
  if (keyboardConfig?.enabled === false) {
    return
  }

  // Register default shortcuts
  registerDefaultShortcuts(keyboardConfig)

  // Register custom shortcuts
  if (keyboardConfig?.shortcuts) {
    Object.entries(keyboardConfig.shortcuts).forEach(([key, handler]) => {
      registerShortcut(key, handler)
    })
  }

  // Add global keydown listener
  state.keydownHandler = handleKeydown
  document.addEventListener('keydown', state.keydownHandler)

  state.initialized = true

  if (getConfig().debug) {
    console.log('[a11y-feedback] Keyboard manager initialized')
  }
}

/**
 * Register default keyboard shortcuts
 */
function registerDefaultShortcuts(config?: KeyboardConfig): void {
  // Escape to dismiss
  const dismissKey = config?.dismissKey || DEFAULT_KEYBOARD_SHORTCUTS.dismiss
  registerShortcut(dismissKey, () => {
    const focusedId = state.notificationIds[state.focusedIndex]
    if (focusedId) {
      dismissVisualFeedback(focusedId)
    }
  })
}

/**
 * Register a custom keyboard shortcut
 * 
 * @param key - Key combination (e.g., "Escape", "Alt+Shift+N")
 * @param handler - Function to call when shortcut is triggered
 */
export function registerShortcut(key: string, handler: KeyboardShortcutHandler): void {
  state.shortcuts.set(normalizeKeyCombo(key), handler)
}

/**
 * Unregister a keyboard shortcut
 * 
 * @param key - Key combination to remove
 */
export function unregisterShortcut(key: string): void {
  state.shortcuts.delete(normalizeKeyCombo(key))
}

/**
 * Normalize a key combination string
 */
function normalizeKeyCombo(key: string): string {
  return key
    .toLowerCase()
    .split('+')
    .map(k => k.trim())
    .sort((a, b) => {
      // Sort modifiers first
      const modifiers = ['ctrl', 'alt', 'shift', 'meta']
      const aIsModifier = modifiers.includes(a)
      const bIsModifier = modifiers.includes(b)
      if (aIsModifier && !bIsModifier) return -1
      if (!aIsModifier && bIsModifier) return 1
      return a.localeCompare(b)
    })
    .join('+')
}

/**
 * Get the key combination string from a keyboard event
 */
function getKeyComboFromEvent(e: KeyboardEvent): string {
  const parts: string[] = []
  
  if (e.ctrlKey) parts.push('ctrl')
  if (e.altKey) parts.push('alt')
  if (e.shiftKey) parts.push('shift')
  if (e.metaKey) parts.push('meta')
  
  // Don't add modifier keys themselves as the main key
  if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
    parts.push(e.key.toLowerCase())
  }
  
  return parts.sort((a, b) => {
    const modifiers = ['ctrl', 'alt', 'shift', 'meta']
    const aIsModifier = modifiers.includes(a)
    const bIsModifier = modifiers.includes(b)
    if (aIsModifier && !bIsModifier) return -1
    if (!aIsModifier && bIsModifier) return 1
    return a.localeCompare(b)
  }).join('+')
}

/**
 * Handle keydown events
 */
function handleKeydown(e: KeyboardEvent): void {
  // Handle focus trap first
  if (state.focusTrapActive && state.focusTrapContainer) {
    handleFocusTrap(e)
  }

  // Check for registered shortcuts
  const keyCombo = getKeyComboFromEvent(e)
  const handler = state.shortcuts.get(keyCombo)
  
  if (handler) {
    e.preventDefault()
    e.stopPropagation()
    handler()
    return
  }

  // Handle arrow key navigation in notifications
  const config = getKeyboardConfig()
  if (config?.arrowNavigation !== false) {
    handleArrowNavigation(e)
  }
}

/**
 * Handle arrow key navigation between notifications
 */
function handleArrowNavigation(e: KeyboardEvent): void {
  // Only handle if within notification context
  const target = e.target as HTMLElement
  if (!target.closest(`.${CSS_CLASSES.item}`)) {
    return
  }

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      focusNextNotification()
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      focusPreviousNotification()
      break
    case 'Home':
      e.preventDefault()
      focusNotificationByIndex(0)
      break
    case 'End':
      e.preventDefault()
      focusNotificationByIndex(state.notificationIds.length - 1)
      break
  }
}

/**
 * Handle focus trap for dialogs
 */
function handleFocusTrap(e: KeyboardEvent): void {
  if (e.key !== 'Tab' || !state.focusTrapContainer) {
    return
  }

  const focusables = state.focusTrapContainer.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusables.length === 0) {
    return
  }

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (e.shiftKey && document.activeElement === first && last) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last && first) {
    e.preventDefault()
    first.focus()
  }
}

/**
 * Register a notification for keyboard navigation
 * 
 * @param notificationId - The notification ID
 */
export function registerNotification(notificationId: string): void {
  if (!state.notificationIds.includes(notificationId)) {
    state.notificationIds.push(notificationId)
  }
}

/**
 * Unregister a notification from keyboard navigation
 * 
 * @param notificationId - The notification ID
 */
export function unregisterNotification(notificationId: string): void {
  const index = state.notificationIds.indexOf(notificationId)
  if (index > -1) {
    state.notificationIds.splice(index, 1)
    
    // Adjust focused index if needed
    if (state.focusedIndex >= state.notificationIds.length) {
      state.focusedIndex = Math.max(0, state.notificationIds.length - 1)
    }
  }
}

/**
 * Focus a specific notification by ID
 * 
 * @param notificationId - The notification ID to focus
 * @returns Whether focus was successful
 */
export function focusNotification(notificationId: string): boolean {
  const index = state.notificationIds.indexOf(notificationId)
  if (index === -1) {
    return false
  }
  
  return focusNotificationByIndex(index)
}

/**
 * Focus a notification by index
 * 
 * @param index - The index to focus
 * @returns Whether focus was successful
 */
function focusNotificationByIndex(index: number): boolean {
  if (index < 0 || index >= state.notificationIds.length) {
    return false
  }

  const notificationId = state.notificationIds[index]
  const element = document.querySelector<HTMLElement>(
    `[data-feedback-id="${notificationId}"]`
  )

  if (element) {
    element.focus()
    element.classList.add(CSS_CLASSES.item + '--focused')
    state.focusedIndex = index
    
    // Announce position for screen readers
    const position = `${index + 1} of ${state.notificationIds.length}`
    void announceToRegion('polite', `Notification ${position}`)
    
    return true
  }

  return false
}

/**
 * Focus the next notification
 */
export function focusNextNotification(): boolean {
  if (state.notificationIds.length === 0) {
    return false
  }

  const nextIndex = (state.focusedIndex + 1) % state.notificationIds.length
  return focusNotificationByIndex(nextIndex)
}

/**
 * Focus the previous notification
 */
export function focusPreviousNotification(): boolean {
  if (state.notificationIds.length === 0) {
    return false
  }

  const prevIndex = (state.focusedIndex - 1 + state.notificationIds.length) % state.notificationIds.length
  return focusNotificationByIndex(prevIndex)
}

/**
 * Get the currently focused notification ID
 */
export function getFocusedNotificationId(): string | null {
  return state.notificationIds[state.focusedIndex] || null
}

/**
 * Enable focus trap for a container (e.g., for dialogs)
 * 
 * @param container - The container element
 */
export function enableFocusTrap(container: HTMLElement): void {
  state.focusTrapActive = true
  state.focusTrapContainer = container

  // Focus the first focusable element
  const firstFocusable = container.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (firstFocusable) {
    firstFocusable.focus()
  }
}

/**
 * Disable focus trap
 */
export function disableFocusTrap(): void {
  state.focusTrapActive = false
  state.focusTrapContainer = null
}

/**
 * Check if focus trap is active
 */
export function isFocusTrapActive(): boolean {
  return state.focusTrapActive
}

/**
 * Destroy the keyboard manager
 */
export function destroyKeyboardManager(): void {
  if (state.keydownHandler) {
    document.removeEventListener('keydown', state.keydownHandler)
    state.keydownHandler = null
  }

  state.shortcuts.clear()
  state.notificationIds = []
  state.focusedIndex = -1
  state.initialized = false
  state.focusTrapActive = false
  state.focusTrapContainer = null

  if (getConfig().debug) {
    console.log('[a11y-feedback] Keyboard manager destroyed')
  }
}

/**
 * Check if keyboard manager is initialized
 */
export function isKeyboardManagerInitialized(): boolean {
  return state.initialized
}

/**
 * Get all registered notification IDs
 */
export function getRegisteredNotifications(): readonly string[] {
  return [...state.notificationIds]
}

