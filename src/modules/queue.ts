/**
 * Feedback queue manager for a11y-feedback
 * Handles prioritization and ordering of feedback events
 * @module modules/queue
 */

import type { FeedbackEvent, FeedbackPriority } from '../types'
import { isDebugEnabled } from '../config'

/**
 * Queue entry with additional metadata
 */
interface QueueEntry {
  readonly event: FeedbackEvent
  readonly addedAt: number
}

/**
 * High priority queue for assertive announcements (errors, warnings)
 */
const highPriorityQueue: QueueEntry[] = []

/**
 * Low priority queue for polite announcements (success, info, loading)
 */
const lowPriorityQueue: QueueEntry[] = []

/**
 * Processing state
 */
let isProcessing = false
let processCallback: ((event: FeedbackEvent) => Promise<void>) | null = null

/**
 * Add a feedback event to the appropriate queue
 *
 * @param event - The feedback event to queue
 * @returns The queue position
 */
export function enqueue(event: FeedbackEvent): number {
  const entry: QueueEntry = {
    event,
    addedAt: Date.now(),
  }

  if (event.priority === 'high') {
    highPriorityQueue.push(entry)

    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Enqueued high priority:', {
        id: event.id,
        message: event.message,
        queueLength: highPriorityQueue.length,
      })
    }

    return highPriorityQueue.length
  } else {
    lowPriorityQueue.push(entry)

    if (isDebugEnabled()) {
      console.warn('[a11y-feedback] Enqueued low priority:', {
        id: event.id,
        message: event.message,
        queueLength: lowPriorityQueue.length,
      })
    }

    return lowPriorityQueue.length
  }
}

/**
 * Remove and return the next event from the queue
 * High priority events are processed first
 *
 * @returns The next event or undefined if queue is empty
 */
export function dequeue(): FeedbackEvent | undefined {
  // High priority first (assertive announcements)
  if (highPriorityQueue.length > 0) {
    const entry = highPriorityQueue.shift()
    return entry?.event
  }

  // Then low priority (polite announcements)
  if (lowPriorityQueue.length > 0) {
    const entry = lowPriorityQueue.shift()
    return entry?.event
  }

  return undefined
}

/**
 * Peek at the next event without removing it
 *
 * @returns The next event or undefined if queue is empty
 */
export function peek(): FeedbackEvent | undefined {
  if (highPriorityQueue.length > 0) {
    return highPriorityQueue[0]?.event
  }

  if (lowPriorityQueue.length > 0) {
    return lowPriorityQueue[0]?.event
  }

  return undefined
}

/**
 * Remove a specific event from the queue by ID
 *
 * @param id - The event ID to remove
 * @returns Whether the event was found and removed
 */
export function removeById(id: string): boolean {
  // Check high priority queue
  const highIndex = highPriorityQueue.findIndex((entry) => entry.event.id === id)
  if (highIndex !== -1) {
    highPriorityQueue.splice(highIndex, 1)
    return true
  }

  // Check low priority queue
  const lowIndex = lowPriorityQueue.findIndex((entry) => entry.event.id === id)
  if (lowIndex !== -1) {
    lowPriorityQueue.splice(lowIndex, 1)
    return true
  }

  return false
}

/**
 * Find an event in the queue by ID
 *
 * @param id - The event ID to find
 * @returns The event or undefined if not found
 */
export function findById(id: string): FeedbackEvent | undefined {
  const highEntry = highPriorityQueue.find((entry) => entry.event.id === id)
  if (highEntry !== undefined) {
    return highEntry.event
  }

  const lowEntry = lowPriorityQueue.find((entry) => entry.event.id === id)
  return lowEntry?.event
}

/**
 * Get the total number of items in both queues
 *
 * @returns Total queue length
 */
export function getQueueLength(): number {
  return highPriorityQueue.length + lowPriorityQueue.length
}

/**
 * Get the length of a specific priority queue
 *
 * @param priority - The priority level to check
 * @returns Queue length for that priority
 */
export function getQueueLengthByPriority(priority: FeedbackPriority): number {
  return priority === 'high' ? highPriorityQueue.length : lowPriorityQueue.length
}

/**
 * Check if the queue is empty
 *
 * @returns Whether both queues are empty
 */
export function isQueueEmpty(): boolean {
  return highPriorityQueue.length === 0 && lowPriorityQueue.length === 0
}

/**
 * Clear all items from both queues
 */
export function clearQueue(): void {
  highPriorityQueue.length = 0
  lowPriorityQueue.length = 0

  if (isDebugEnabled()) {
    console.warn('[a11y-feedback] Queue cleared')
  }
}

/**
 * Set the callback function for processing queue items
 *
 * @param callback - Function to call for each dequeued event
 */
export function setProcessCallback(callback: (event: FeedbackEvent) => Promise<void>): void {
  processCallback = callback
}

/**
 * Start processing the queue
 * Will continue until queue is empty
 */
export async function processQueue(): Promise<void> {
  if (isProcessing || processCallback === null) {
    return
  }

  isProcessing = true

  while (!isQueueEmpty()) {
    const event = dequeue()
    if (event !== undefined) {
      try {
        await processCallback(event)
      } catch (error) {
        if (isDebugEnabled()) {
          console.error('[a11y-feedback] Error processing queue item:', error)
        }
      }
    }
  }

  isProcessing = false
}

/**
 * Check if the queue is currently being processed
 *
 * @returns Whether processing is in progress
 */
export function isProcessingQueue(): boolean {
  return isProcessing
}

/**
 * Get all events currently in the queue (for debugging)
 *
 * @returns Array of all queued events
 */
export function getAllQueuedEvents(): readonly FeedbackEvent[] {
  return [
    ...highPriorityQueue.map((entry) => entry.event),
    ...lowPriorityQueue.map((entry) => entry.event),
  ]
}

/**
 * Reset the queue state (useful for testing)
 */
export function resetQueue(): void {
  clearQueue()
  isProcessing = false
  processCallback = null
}
