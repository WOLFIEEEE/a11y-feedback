/**
 * Notification Center Module for a11y-feedback v2.0
 * Provides a centralized history panel for all notifications
 * @module notification-center
 */

import type { 
  FeedbackEvent, 
  NotificationCenterState, 
  NotificationCenterEventType,
  NotificationCenterEventListener,
  FeedbackType
} from '../types'
import { CSS_CLASSES_V2, STORAGE_KEYS } from '../constants'
import { getConfig, getHistoryConfig } from '../config'
import { announceToRegion } from './regions'
import { getAllGroups } from './grouping'
import { registerShortcut, unregisterShortcut } from './keyboard'

/**
 * Internal state for notification center
 */
interface CenterState {
  /** All notifications in history */
  notifications: FeedbackEvent[]
  /** Set of read notification IDs */
  readIds: Set<string>
  /** Whether center panel is open */
  isOpen: boolean
  /** Event listeners */
  listeners: Set<NotificationCenterEventListener>
  /** DOM element reference */
  element: HTMLElement | null
  /** Badge element reference */
  badgeElement: HTMLElement | null
  /** Whether initialized */
  initialized: boolean
}

const state: CenterState = {
  notifications: [],
  readIds: new Set(),
  isOpen: false,
  listeners: new Set(),
  element: null,
  badgeElement: null,
  initialized: false,
}

/**
 * Initialize the notification center
 */
export function initNotificationCenter(): void {
  if (state.initialized) return

  const config = getHistoryConfig()
  
  if (!config?.enabled) {
    return
  }

  // Load persisted history if enabled
  if (config.persist) {
    loadPersistedHistory()
  }

  // Register keyboard shortcut to toggle
  registerShortcut('Alt+Shift+N', toggleCenter)

  state.initialized = true

  if (getConfig().debug) {
    console.log('[a11y-feedback] Notification center initialized')
  }
}

/**
 * Add a notification to history
 * 
 * @param event - The feedback event to add
 */
export function addToHistory(event: FeedbackEvent): void {
  const config = getHistoryConfig()
  
  if (!config?.enabled) return
  if (event.options.persist === false) return

  // Add to beginning of list
  state.notifications.unshift(event)

  // Enforce max items limit
  const maxItems = config.maxItems ?? 100
  if (state.notifications.length > maxItems) {
    state.notifications = state.notifications.slice(0, maxItems)
  }

  // Persist if enabled
  if (config.persist) {
    persistHistory()
  }

  // Update badge
  updateBadge()
}

/**
 * Get notification history
 * 
 * @returns Array of all notifications
 */
export function getNotificationHistory(): readonly FeedbackEvent[] {
  return [...state.notifications]
}

/**
 * Get the current notification center state
 */
export function getNotificationCenterState(): NotificationCenterState {
  return {
    notifications: [...state.notifications],
    unreadCount: getUnreadCount(),
    isOpen: state.isOpen,
    groups: getAllGroups(),
  }
}

/**
 * Get count of unread notifications
 */
export function getUnreadCount(): number {
  return state.notifications.filter(n => !state.readIds.has(n.id)).length
}

/**
 * Mark a notification as read
 * 
 * @param id - Notification ID
 */
export function markAsRead(id: string): void {
  if (state.readIds.has(id)) return

  state.readIds.add(id)
  updateBadge()
  emitEvent('markRead', { id })

  if (getHistoryConfig()?.persist) {
    persistHistory()
  }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  const previousUnread = getUnreadCount()
  
  state.notifications.forEach(n => {
    state.readIds.add(n.id)
  })
  
  updateBadge()
  emitEvent('markAllRead', { count: previousUnread })

  if (getHistoryConfig()?.persist) {
    persistHistory()
  }
}

/**
 * Clear all notification history
 */
export function clearHistory(): void {
  const count = state.notifications.length
  state.notifications = []
  state.readIds.clear()
  
  updateBadge()
  emitEvent('clear', { count })

  if (getHistoryConfig()?.persist) {
    persistHistory()
  }
}

/**
 * Toggle notification center open/close
 */
export function toggleCenter(): void {
  if (state.isOpen) {
    closeCenter()
  } else {
    openCenter()
  }
}

/**
 * Open the notification center
 */
export function openCenter(): void {
  if (state.isOpen) return

  state.isOpen = true
  
  if (state.element) {
    state.element.hidden = false
    state.element.setAttribute('aria-hidden', 'false')
  }

  void announceToRegion('polite', `Notification center opened. ${getUnreadCount()} unread notifications.`)
  emitEvent('open')

  if (getConfig().debug) {
    console.log('[a11y-feedback] Notification center opened')
  }
}

/**
 * Close the notification center
 */
export function closeCenter(): void {
  if (!state.isOpen) return

  state.isOpen = false
  
  if (state.element) {
    state.element.hidden = true
    state.element.setAttribute('aria-hidden', 'true')
  }

  void announceToRegion('polite', 'Notification center closed')
  emitEvent('close')

  if (getConfig().debug) {
    console.log('[a11y-feedback] Notification center closed')
  }
}

/**
 * Check if notification center is open
 */
export function isCenterOpen(): boolean {
  return state.isOpen
}

/**
 * Remove a notification from history
 * 
 * @param id - Notification ID to remove
 */
export function removeFromHistory(id: string): void {
  const index = state.notifications.findIndex(n => n.id === id)
  if (index > -1) {
    state.notifications.splice(index, 1)
    state.readIds.delete(id)
    updateBadge()

    if (getHistoryConfig()?.persist) {
      persistHistory()
    }
  }
}

/**
 * Filter notifications by type
 * 
 * @param type - Feedback type to filter by
 */
export function filterByType(type: FeedbackType): readonly FeedbackEvent[] {
  return state.notifications.filter(n => n.type === type)
}

/**
 * Subscribe to notification center events
 * 
 * @param listener - Event listener
 * @returns Unsubscribe function
 */
export function onCenterEvent(listener: NotificationCenterEventListener): () => void {
  state.listeners.add(listener)
  return () => {
    state.listeners.delete(listener)
  }
}

/**
 * Emit an event to all listeners
 */
function emitEvent(type: NotificationCenterEventType, data?: unknown): void {
  state.listeners.forEach(listener => {
    try {
      listener(type, data)
    } catch (error) {
      if (getConfig().debug) {
        console.error('[a11y-feedback] Center event listener error:', error)
      }
    }
  })
}

/**
 * Update the unread badge
 */
function updateBadge(): void {
  if (!state.badgeElement) return

  const count = getUnreadCount()
  state.badgeElement.textContent = String(count)
  state.badgeElement.hidden = count === 0
  state.badgeElement.setAttribute('aria-label', `${count} unread notifications`)
}

/**
 * Persist history to localStorage
 */
function persistHistory(): void {
  try {
    const config = getHistoryConfig()
    const key = config?.storageKey || STORAGE_KEYS.history
    
    const data = {
      notifications: state.notifications,
      readIds: Array.from(state.readIds),
    }
    
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    if (getConfig().debug) {
      console.error('[a11y-feedback] Failed to persist history:', error)
    }
  }
}

/**
 * Load persisted history from localStorage
 */
function loadPersistedHistory(): void {
  try {
    const config = getHistoryConfig()
    const key = config?.storageKey || STORAGE_KEYS.history
    
    const stored = localStorage.getItem(key)
    if (!stored) return

    const data = JSON.parse(stored)
    
    if (Array.isArray(data.notifications)) {
      state.notifications = data.notifications
    }
    
    if (Array.isArray(data.readIds)) {
      state.readIds = new Set(data.readIds)
    }

    if (getConfig().debug) {
      console.log('[a11y-feedback] Loaded persisted history:', state.notifications.length)
    }
  } catch (error) {
    if (getConfig().debug) {
      console.error('[a11y-feedback] Failed to load persisted history:', error)
    }
  }
}

/**
 * Render the notification center component
 * 
 * @param container - Container element to render into
 * @returns The notification center element
 */
export function renderNotificationCenter(container?: HTMLElement): HTMLElement {
  // Create or get container
  const parentContainer = container || document.body

  // Trigger button
  const trigger = document.createElement('button')
  trigger.className = CSS_CLASSES_V2.centerTrigger
  trigger.setAttribute('aria-label', 'Open notification center')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  `

  // Badge
  const badge = document.createElement('span')
  badge.className = CSS_CLASSES_V2.centerBadge
  badge.setAttribute('aria-label', 'Unread notifications')
  badge.textContent = String(getUnreadCount())
  badge.hidden = getUnreadCount() === 0
  trigger.appendChild(badge)
  state.badgeElement = badge

  // Panel
  const panel = document.createElement('div')
  panel.className = CSS_CLASSES_V2.centerPanel
  panel.id = 'a11y-notification-center'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', 'Notification center')
  panel.setAttribute('aria-hidden', 'true')
  panel.hidden = true

  // Header
  const header = document.createElement('div')
  header.className = CSS_CLASSES_V2.centerHeader
  header.innerHTML = `
    <h2>Notifications</h2>
    <div class="a11y-feedback-center-actions">
      <button class="a11y-feedback-center-mark-read" aria-label="Mark all as read">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      </button>
      <button class="a11y-feedback-center-clear" aria-label="Clear all notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
      <button class="a11y-feedback-center-close" aria-label="Close notification center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `

  // List container
  const list = document.createElement('div')
  list.className = CSS_CLASSES_V2.centerList
  list.setAttribute('role', 'list')

  // Empty state
  const empty = document.createElement('div')
  empty.className = CSS_CLASSES_V2.centerEmpty
  empty.textContent = 'No notifications'

  panel.appendChild(header)
  panel.appendChild(list)
  panel.appendChild(empty)

  // Event handlers
  trigger.addEventListener('click', () => {
    toggleCenter()
    trigger.setAttribute('aria-expanded', String(state.isOpen))
  })

  header.querySelector('.a11y-feedback-center-close')?.addEventListener('click', closeCenter)
  header.querySelector('.a11y-feedback-center-mark-read')?.addEventListener('click', markAllAsRead)
  header.querySelector('.a11y-feedback-center-clear')?.addEventListener('click', () => {
    if (state.notifications.length > 0) {
      clearHistory()
    }
  })

  // Create wrapper
  const wrapper = document.createElement('div')
  wrapper.className = CSS_CLASSES_V2.center
  wrapper.appendChild(trigger)
  wrapper.appendChild(panel)

  state.element = panel
  parentContainer.appendChild(wrapper)

  // Initial render
  updateCenterList(list, empty)

  return wrapper
}

/**
 * Update the notification center list
 */
function updateCenterList(list: HTMLElement, empty: HTMLElement): void {
  list.innerHTML = ''

  if (state.notifications.length === 0) {
    empty.hidden = false
    list.hidden = true
    return
  }

  empty.hidden = true
  list.hidden = false

  state.notifications.forEach(notification => {
    const item = renderNotificationItem(notification)
    list.appendChild(item)
  })
}

/**
 * Render a single notification item for the center
 */
function renderNotificationItem(notification: FeedbackEvent): HTMLElement {
  const item = document.createElement('div')
  item.className = `a11y-feedback-center-item a11y-feedback-center-item--${notification.type}`
  item.setAttribute('role', 'listitem')
  item.setAttribute('data-notification-id', notification.id)

  if (!state.readIds.has(notification.id)) {
    item.classList.add(CSS_CLASSES_V2.unread)
  }

  const content = document.createElement('div')
  content.className = 'a11y-feedback-center-item-content'
  content.textContent = notification.message

  const time = document.createElement('time')
  time.className = 'a11y-feedback-center-item-time'
  time.dateTime = new Date(notification.timestamp).toISOString()
  time.textContent = formatRelativeTime(notification.timestamp)

  const dismiss = document.createElement('button')
  dismiss.className = 'a11y-feedback-center-item-dismiss'
  dismiss.setAttribute('aria-label', 'Remove notification')
  dismiss.innerHTML = '×'
  dismiss.addEventListener('click', (e) => {
    e.stopPropagation()
    removeFromHistory(notification.id)
    item.remove()
  })

  item.appendChild(content)
  item.appendChild(time)
  item.appendChild(dismiss)

  // Mark as read on click
  item.addEventListener('click', () => {
    markAsRead(notification.id)
    item.classList.remove(CSS_CLASSES_V2.unread)
  })

  return item
}

/**
 * Format a timestamp as relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(timestamp).toLocaleDateString()
}

/**
 * Destroy the notification center
 */
export function destroyNotificationCenter(): void {
  unregisterShortcut('Alt+Shift+N')
  
  if (state.element?.parentElement) {
    state.element.parentElement.remove()
  }

  state.element = null
  state.badgeElement = null
  state.initialized = false
  state.notifications = []
  state.readIds.clear()
  state.isOpen = false
  state.listeners.clear()

  if (getConfig().debug) {
    console.log('[a11y-feedback] Notification center destroyed')
  }
}

/**
 * Generate CSS for notification center
 */
export function getNotificationCenterCSS(): string {
  return `
    .${CSS_CLASSES_V2.center} {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
    }

    .${CSS_CLASSES_V2.centerTrigger} {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      border: none;
      background-color: var(--a11y-feedback-center-bg, #374151);
      color: var(--a11y-feedback-center-text, #f9fafb);
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .${CSS_CLASSES_V2.centerTrigger}:hover {
      background-color: var(--a11y-feedback-center-hover, #4b5563);
    }

    .${CSS_CLASSES_V2.centerTrigger}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .${CSS_CLASSES_V2.centerTrigger} svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .${CSS_CLASSES_V2.centerBadge} {
      position: absolute;
      top: -0.25rem;
      right: -0.25rem;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.25rem;
      text-align: center;
      background-color: var(--a11y-feedback-error, #ef4444);
      color: white;
      border-radius: 9999px;
    }

    .${CSS_CLASSES_V2.centerPanel} {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 320px;
      max-height: 400px;
      background-color: var(--a11y-feedback-center-panel-bg, #1f2937);
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .${CSS_CLASSES_V2.centerHeader} {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--a11y-feedback-border, #374151);
    }

    .${CSS_CLASSES_V2.centerHeader} h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .a11y-feedback-center-actions {
      display: flex;
      gap: 0.5rem;
    }

    .a11y-feedback-center-actions button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border: none;
      border-radius: 0.375rem;
      background: transparent;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.15s ease, background-color 0.15s ease;
    }

    .a11y-feedback-center-actions button:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .a11y-feedback-center-actions button svg {
      width: 1rem;
      height: 1rem;
    }

    .${CSS_CLASSES_V2.centerList} {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .a11y-feedback-center-item {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-left: 3px solid transparent;
    }

    .a11y-feedback-center-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .a11y-feedback-center-item--success { border-left-color: var(--a11y-feedback-success, #10b981); }
    .a11y-feedback-center-item--error { border-left-color: var(--a11y-feedback-error, #ef4444); }
    .a11y-feedback-center-item--warning { border-left-color: var(--a11y-feedback-warning, #f59e0b); }
    .a11y-feedback-center-item--info { border-left-color: var(--a11y-feedback-info, #3b82f6); }
    .a11y-feedback-center-item--loading { border-left-color: var(--a11y-feedback-loading, #6366f1); }

    .${CSS_CLASSES_V2.unread} {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .${CSS_CLASSES_V2.unread}::before {
      content: '';
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: var(--a11y-feedback-info, #3b82f6);
    }

    .a11y-feedback-center-item-content {
      flex: 1;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .a11y-feedback-center-item-time {
      font-size: 0.75rem;
      opacity: 0.6;
    }

    .a11y-feedback-center-item-dismiss {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 0.25rem;
      background: transparent;
      color: inherit;
      opacity: 0;
      cursor: pointer;
      font-size: 1rem;
      transition: opacity 0.15s ease;
    }

    .a11y-feedback-center-item:hover .a11y-feedback-center-item-dismiss {
      opacity: 0.5;
    }

    .a11y-feedback-center-item-dismiss:hover {
      opacity: 1 !important;
    }

    .${CSS_CLASSES_V2.centerEmpty} {
      padding: 2rem;
      text-align: center;
      opacity: 0.6;
    }

    @media (max-width: 400px) {
      .${CSS_CLASSES_V2.centerPanel} {
        width: calc(100vw - 2rem);
        right: -0.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.centerTrigger},
      .a11y-feedback-center-item,
      .a11y-feedback-center-actions button,
      .a11y-feedback-center-item-dismiss {
        transition: none;
      }
    }
  `
}

