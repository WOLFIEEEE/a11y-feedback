import { describe, it, expect, beforeEach } from 'vitest'
import {
  announce,
  getAnnouncerState,
  resetAnnouncerState,
  hasPendingAnnouncements,
  cancelPendingAnnouncements,
} from '../src/modules/announcer'
import { destroyRegions, getRegion } from '../src/modules/regions'
import { resetConfig } from '../src/config'
import type { FeedbackEvent } from '../src/types'

describe('announcer', () => {
  beforeEach(() => {
    resetConfig()
    destroyRegions()
    resetAnnouncerState()
    document.body.innerHTML = ''
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

  describe('announce', () => {
    it('should announce to polite region for polite events', async () => {
      const event = createMockEvent({ ariaLive: 'polite' })

      await announce(event)

      // Wait for announcement to complete
      await new Promise((resolve) => setTimeout(resolve, 200))

      const region = getRegion('polite')
      expect(region?.textContent).toContain('Test message')
    })

    it('should announce to assertive region for assertive events', async () => {
      const event = createMockEvent({
        ariaLive: 'assertive',
        type: 'error',
        role: 'alert',
        priority: 'high',
      })

      await announce(event)

      // Wait for announcement to complete
      await new Promise((resolve) => setTimeout(resolve, 200))

      const region = getRegion('assertive')
      expect(region?.textContent).toContain('Test message')
    })

    it('should update state after announcement', async () => {
      const event = createMockEvent()

      await announce(event)

      const state = getAnnouncerState()
      expect(state.lastPoliteMessage).toBe('Test message')
      expect(state.lastPoliteTimestamp).toBeGreaterThan(0)
    })

    it('should track assertive messages separately', async () => {
      const event = createMockEvent({
        ariaLive: 'assertive',
        message: 'Assertive message',
      })

      await announce(event)

      const state = getAnnouncerState()
      expect(state.lastAssertiveMessage).toBe('Assertive message')
    })
  })

  describe('force re-announcement', () => {
    it('should increment ZWC counter when forcing', async () => {
      const event1 = createMockEvent({ options: { force: true } })
      const event2 = createMockEvent({ options: { force: true } })

      const stateBefore = getAnnouncerState()
      const counterBefore = stateBefore.zwcCounter

      await announce(event1)
      await announce(event2)

      const stateAfter = getAnnouncerState()
      expect(stateAfter.zwcCounter).toBeGreaterThan(counterBefore)
    })

    it('should add ZWC for duplicate messages', async () => {
      const event1 = createMockEvent({ message: 'Same message' })
      const event2 = createMockEvent({ message: 'Same message' })

      await announce(event1)
      const stateAfter1 = getAnnouncerState()

      await announce(event2)
      const stateAfter2 = getAnnouncerState()

      // ZWC counter should have incremented for the second duplicate
      expect(stateAfter2.zwcCounter).toBeGreaterThan(stateAfter1.zwcCounter)
    })
  })

  describe('state management', () => {
    it('should reset state correctly', async () => {
      const event = createMockEvent()
      await announce(event)

      resetAnnouncerState()

      const state = getAnnouncerState()
      expect(state.lastPoliteMessage).toBeNull()
      expect(state.lastAssertiveMessage).toBeNull()
      expect(state.lastPoliteTimestamp).toBe(0)
      expect(state.lastAssertiveTimestamp).toBe(0)
      expect(state.zwcCounter).toBe(0)
    })

    it('should report no pending announcements after completion', async () => {
      const event = createMockEvent()
      await announce(event)

      // Wait for any pending timeouts
      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(hasPendingAnnouncements()).toBe(false)
    })

    it('should cancel pending announcements', () => {
      cancelPendingAnnouncements()
      expect(hasPendingAnnouncements()).toBe(false)
    })
  })
})
