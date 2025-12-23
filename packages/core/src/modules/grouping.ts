/**
 * Notification Grouping Module for a11y-feedback v2.0
 * Handles grouping similar notifications together
 * @module grouping
 */

import type { FeedbackEvent, NotificationGroup, GroupingConfig } from '../types'
import { CSS_CLASSES_V2 } from '../constants'
import { getConfig, getGroupingConfig } from '../config'
import { announceToRegion } from './regions'

/**
 * Internal state for managing notification groups
 */
interface GroupingState {
  /** All active groups */
  groups: Map<string, NotificationGroup>
  /** Mapping from notification ID to group ID */
  notificationToGroup: Map<string, string>
  /** Group update listeners */
  listeners: Set<GroupListener>
}

/**
 * Group change listener type
 */
type GroupListener = (groups: readonly NotificationGroup[]) => void

/**
 * Module state
 */
const state: GroupingState = {
  groups: new Map(),
  notificationToGroup: new Map(),
  listeners: new Set(),
}

/**
 * Generate a group key for an event
 * Uses custom function if provided, otherwise uses the group option or type
 */
function getGroupKey(event: FeedbackEvent, config: GroupingConfig | undefined): string | null {
  // Use custom groupBy function if provided
  if (config?.groupBy) {
    return config.groupBy(event)
  }

  // Use explicit group key from options
  if (event.options.group) {
    return event.options.group
  }

  // By default, don't auto-group
  return null
}

/**
 * Generate a default summary for a group
 */
function generateSummary(group: NotificationGroup): string {
  const count = group.notifications.length
  const type = group.notifications[0]?.type || 'notification'
  
  if (count === 1) {
    return group.notifications[0]?.message || `1 ${type}`
  }
  
  return `${count} ${type}s`
}

/**
 * Add an event to a group or create a new group
 * 
 * @param event - The feedback event to add
 * @returns The group the event was added to, or null if not grouped
 */
export function addToGroup(event: FeedbackEvent): NotificationGroup | null {
  const config = getGroupingConfig()
  
  if (!config?.enabled) {
    return null
  }

  const groupKey = getGroupKey(event, config)
  
  if (!groupKey) {
    return null
  }

  let group = state.groups.get(groupKey)
  const now = Date.now()

  if (group) {
    // Check if within time threshold for grouping
    const threshold = config.threshold ?? 5000
    const timeSinceUpdate = now - group.updatedAt
    
    if (timeSinceUpdate > threshold) {
      // Too old, create a new group
      group = createGroup(groupKey, event, now)
    } else {
      // Add to existing group
      const maxSize = config.maxGroupSize ?? 10
      
      if (group.notifications.length < maxSize) {
        group = {
          ...group,
          notifications: [...group.notifications, event],
          updatedAt: now,
          summary: config.summarize 
            ? config.summarize({ ...group, notifications: [...group.notifications, event] })
            : generateSummary({ ...group, notifications: [...group.notifications, event] }),
        }
        state.groups.set(groupKey, group)
      }
    }
  } else {
    // Create new group
    group = createGroup(groupKey, event, now)
  }

  // Track notification -> group mapping
  state.notificationToGroup.set(event.id, groupKey)

  // Notify listeners
  notifyListeners()

  // Announce group update
  announceGroupUpdate(group)

  return group
}

/**
 * Create a new group
 */
function createGroup(id: string, event: FeedbackEvent, timestamp: number): NotificationGroup {
  const config = getGroupingConfig()
  
  const group: NotificationGroup = {
    id,
    notifications: [event],
    collapsed: true,
    summary: config?.summarize 
      ? config.summarize({ id, notifications: [event], collapsed: true, summary: '', createdAt: timestamp, updatedAt: timestamp })
      : generateSummary({ id, notifications: [event], collapsed: true, summary: '', createdAt: timestamp, updatedAt: timestamp }),
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  state.groups.set(id, group)
  return group
}

/**
 * Remove an event from its group
 * 
 * @param eventId - The event ID to remove
 */
export function removeFromGroup(eventId: string): void {
  const groupKey = state.notificationToGroup.get(eventId)
  
  if (!groupKey) {
    return
  }

  const group = state.groups.get(groupKey)
  
  if (!group) {
    state.notificationToGroup.delete(eventId)
    return
  }

  const updatedNotifications = group.notifications.filter(n => n.id !== eventId)
  
  if (updatedNotifications.length === 0) {
    // Delete the group
    state.groups.delete(groupKey)
  } else {
    // Update the group
    const config = getGroupingConfig()
    const updatedGroup: NotificationGroup = {
      ...group,
      notifications: updatedNotifications,
      updatedAt: Date.now(),
      summary: config?.summarize 
        ? config.summarize({ ...group, notifications: updatedNotifications })
        : generateSummary({ ...group, notifications: updatedNotifications }),
    }
    state.groups.set(groupKey, updatedGroup)
  }

  state.notificationToGroup.delete(eventId)
  notifyListeners()
}

/**
 * Toggle group collapsed state
 * 
 * @param groupId - The group ID to toggle
 */
export function toggleGroupCollapse(groupId: string): void {
  const group = state.groups.get(groupId)
  
  if (!group) {
    return
  }

  const updatedGroup: NotificationGroup = {
    ...group,
    collapsed: !group.collapsed,
  }
  
  state.groups.set(groupId, updatedGroup)
  notifyListeners()

  // Announce state change
  const stateText = updatedGroup.collapsed ? 'collapsed' : 'expanded'
  void announceToRegion('polite', `Notification group ${stateText}`)
}

/**
 * Get all active groups
 * 
 * @returns Array of all groups
 */
export function getAllGroups(): readonly NotificationGroup[] {
  return Array.from(state.groups.values())
}

/**
 * Get a specific group
 * 
 * @param groupId - The group ID
 * @returns The group or undefined
 */
export function getGroup(groupId: string): NotificationGroup | undefined {
  return state.groups.get(groupId)
}

/**
 * Get the group for a notification
 * 
 * @param eventId - The notification ID
 * @returns The group or undefined
 */
export function getGroupForNotification(eventId: string): NotificationGroup | undefined {
  const groupKey = state.notificationToGroup.get(eventId)
  if (!groupKey) return undefined
  return state.groups.get(groupKey)
}

/**
 * Clear all groups
 */
export function clearAllGroups(): void {
  state.groups.clear()
  state.notificationToGroup.clear()
  notifyListeners()
}

/**
 * Subscribe to group changes
 * 
 * @param listener - Callback for group updates
 * @returns Unsubscribe function
 */
export function onGroupChange(listener: GroupListener): () => void {
  state.listeners.add(listener)
  return () => {
    state.listeners.delete(listener)
  }
}

/**
 * Notify all listeners of group changes
 */
function notifyListeners(): void {
  const groups = getAllGroups()
  state.listeners.forEach(listener => {
    try {
      listener(groups)
    } catch (error) {
      if (getConfig().debug) {
        console.error('[a11y-feedback] Group listener error:', error)
      }
    }
  })
}

/**
 * Announce group update to screen readers
 */
function announceGroupUpdate(group: NotificationGroup): void {
  if (group.notifications.length > 1) {
    void announceToRegion('polite', group.summary)
  }
}

/**
 * Render a group element
 * 
 * @param group - The group to render
 * @param renderItem - Function to render individual items
 * @returns The group element
 */
export function renderGroup(
  group: NotificationGroup,
  renderItem: (event: FeedbackEvent) => HTMLElement
): HTMLElement {
  const container = document.createElement('div')
  container.className = `${CSS_CLASSES_V2.group} ${group.collapsed ? CSS_CLASSES_V2.groupCollapsed : CSS_CLASSES_V2.groupExpanded}`
  container.setAttribute('data-group-id', group.id)
  container.setAttribute('role', 'group')
  container.setAttribute('aria-label', group.summary)

  // Group header
  const header = document.createElement('button')
  header.className = CSS_CLASSES_V2.groupHeader
  header.setAttribute('aria-expanded', String(!group.collapsed))
  header.setAttribute('aria-controls', `group-content-${group.id}`)
  
  // Badge with count
  const badge = document.createElement('span')
  badge.className = CSS_CLASSES_V2.groupBadge
  badge.textContent = String(group.notifications.length)
  badge.setAttribute('aria-hidden', 'true')
  
  // Summary text
  const summaryText = document.createElement('span')
  summaryText.textContent = group.summary
  
  header.appendChild(badge)
  header.appendChild(summaryText)
  
  // Toggle collapse on click
  header.addEventListener('click', () => {
    toggleGroupCollapse(group.id)
  })
  
  container.appendChild(header)

  // Content container
  const content = document.createElement('div')
  content.id = `group-content-${group.id}`
  content.className = 'a11y-feedback-group-content'
  content.hidden = group.collapsed

  // Render individual notifications
  if (!group.collapsed) {
    group.notifications.forEach(event => {
      const item = renderItem(event)
      content.appendChild(item)
    })
  }

  container.appendChild(content)

  return container
}

/**
 * Generate CSS for groups
 */
export function getGroupingCSS(): string {
  return `
    .${CSS_CLASSES_V2.group} {
      border: 1px solid var(--a11y-feedback-group-border, rgba(255, 255, 255, 0.2));
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .${CSS_CLASSES_V2.groupHeader} {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background-color: var(--a11y-feedback-group-header-bg, rgba(255, 255, 255, 0.05));
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.15s ease;
    }

    .${CSS_CLASSES_V2.groupHeader}:hover {
      background-color: var(--a11y-feedback-group-header-hover, rgba(255, 255, 255, 0.1));
    }

    .${CSS_CLASSES_V2.groupHeader}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: -2px;
    }

    .${CSS_CLASSES_V2.groupBadge} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.5rem;
      background-color: var(--a11y-feedback-group-badge-bg, #3b82f6);
      color: var(--a11y-feedback-group-badge-text, #ffffff);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .a11y-feedback-group-content {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .${CSS_CLASSES_V2.groupCollapsed} .a11y-feedback-group-content {
      display: none;
    }

    .${CSS_CLASSES_V2.groupHeader}::before {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(-45deg);
      transition: transform 0.15s ease;
    }

    .${CSS_CLASSES_V2.groupExpanded} .${CSS_CLASSES_V2.groupHeader}::before {
      transform: rotate(45deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.groupHeader},
      .${CSS_CLASSES_V2.groupHeader}::before {
        transition: none;
      }
    }
  `
}

