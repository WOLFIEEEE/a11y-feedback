import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  shouldDedupeByContent,
  recordMessage,
  checkForReplacement,
  registerEvent,
  unregisterEvent,
  getActiveEvent,
  getAllActiveEvents,
  getActiveEventCount,
  isEventActive,
  processForDedupe,
  clearDedupeCache,
  resetDedupe,
} from '../src/modules/dedupe'
import { resetConfig } from '../src/config'
import type { FeedbackEvent } from '../src/types'

describe('dedupe', () => {
  beforeEach(() => {
    resetConfig()
    resetDedupe()
  })

  const createMockEvent = (overrides: Partial<FeedbackEvent> = {}): FeedbackEvent => ({
    id: 'test-id',
    message: 'Test message',
    type: 'success',
    role: 'status',
    ariaLive: 'polite',
    priority: 'low',
    options: {},
    timestamp: Date.now(),
    replaced: false,
    deduped: false,
    ...overrides,
  })

  describe('content-based deduplication', () => {
    it('should not dedupe first occurrence', () => {
      const shouldDedupe = shouldDedupeByContent('Hello', 'success')

      expect(shouldDedupe).toBe(false)
    })

    it('should dedupe rapid duplicate messages', () => {
      recordMessage('Hello', 'success')

      const shouldDedupe = shouldDedupeByContent('Hello', 'success')

      expect(shouldDedupe).toBe(true)
    })

    it('should not dedupe different messages', () => {
      recordMessage('Hello', 'success')

      const shouldDedupe = shouldDedupeByContent('Goodbye', 'success')

      expect(shouldDedupe).toBe(false)
    })

    it('should not dedupe same message with different type', () => {
      recordMessage('Hello', 'success')

      const shouldDedupe = shouldDedupeByContent('Hello', 'error')

      expect(shouldDedupe).toBe(false)
    })

    it('should allow duplicate after time window', async () => {
      vi.useFakeTimers()

      recordMessage('Hello', 'success')

      // Advance past dedupe window
      vi.advanceTimersByTime(600)

      const shouldDedupe = shouldDedupeByContent('Hello', 'success')

      expect(shouldDedupe).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('ID-based replacement', () => {
    it('should return undefined for unregistered ID', () => {
      const existing = checkForReplacement('nonexistent')

      expect(existing).toBeUndefined()
    })

    it('should return event for registered ID', () => {
      const event = createMockEvent({ id: 'my-id' })
      registerEvent(event)

      const existing = checkForReplacement('my-id')

      expect(existing).toBeDefined()
      expect(existing?.id).toBe('my-id')
    })
  })

  describe('event registration', () => {
    it('should register an event', () => {
      const event = createMockEvent({ id: 'test-1' })

      registerEvent(event)

      expect(isEventActive('test-1')).toBe(true)
    })

    it('should unregister an event', () => {
      const event = createMockEvent({ id: 'test-1' })
      registerEvent(event)

      const result = unregisterEvent('test-1')

      expect(result).toBe(true)
      expect(isEventActive('test-1')).toBe(false)
    })

    it('should return false when unregistering nonexistent event', () => {
      const result = unregisterEvent('nonexistent')

      expect(result).toBe(false)
    })

    it('should get active event by ID', () => {
      const event = createMockEvent({ id: 'test-1', message: 'Specific message' })
      registerEvent(event)

      const retrieved = getActiveEvent('test-1')

      expect(retrieved?.message).toBe('Specific message')
    })

    it('should get all active events', () => {
      const event1 = createMockEvent({ id: 'test-1' })
      const event2 = createMockEvent({ id: 'test-2' })
      registerEvent(event1)
      registerEvent(event2)

      const allEvents = getAllActiveEvents()

      expect(allEvents.length).toBe(2)
    })

    it('should count active events', () => {
      expect(getActiveEventCount()).toBe(0)

      registerEvent(createMockEvent({ id: 'test-1' }))
      expect(getActiveEventCount()).toBe(1)

      registerEvent(createMockEvent({ id: 'test-2' }))
      expect(getActiveEventCount()).toBe(2)
    })
  })

  describe('processForDedupe', () => {
    it('should not skip first occurrence', () => {
      const event = createMockEvent()

      const result = processForDedupe(event)

      expect(result.shouldSkip).toBe(false)
      expect(result.reason).toBe('none')
    })

    it('should skip duplicate content', () => {
      recordMessage('Test message', 'success')
      const event = createMockEvent()

      const result = processForDedupe(event)

      expect(result.shouldSkip).toBe(true)
      expect(result.reason).toBe('content_dedupe')
    })

    it('should not skip when force is true', () => {
      recordMessage('Test message', 'success')
      const event = createMockEvent({ options: { force: true } })

      const result = processForDedupe(event)

      expect(result.shouldSkip).toBe(false)
    })

    it('should detect ID-based replacement', () => {
      const existingEvent = createMockEvent({
        id: 'status-1',
        message: 'Loading...',
        options: { id: 'status-1' },
      })
      registerEvent(existingEvent)

      const newEvent = createMockEvent({
        id: 'status-1',
        message: 'Done!',
        options: { id: 'status-1' },
      })

      const result = processForDedupe(newEvent)

      expect(result.shouldSkip).toBe(false)
      expect(result.reason).toBe('id_replacement')
      expect(result.replacedEvent).toBeDefined()
      expect(result.replacedEvent?.message).toBe('Loading...')
    })
  })

  describe('cache management', () => {
    it('should clear all caches', () => {
      const event = createMockEvent({ id: 'test-1' })
      registerEvent(event)
      recordMessage('Test', 'success')

      clearDedupeCache()

      expect(getActiveEventCount()).toBe(0)
      expect(shouldDedupeByContent('Test', 'success')).toBe(false)
    })

    it('should reset module state', () => {
      registerEvent(createMockEvent({ id: 'test-1' }))

      resetDedupe()

      expect(getActiveEventCount()).toBe(0)
    })
  })
})
