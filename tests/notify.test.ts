import { describe, it, expect, beforeEach } from 'vitest'
import { notify } from '../src/notify'
import { resetConfig, configureFeedback } from '../src/config'
import { destroyRegions, getRegion } from '../src/modules/regions'
import { resetAnnouncerState } from '../src/modules/announcer'
import { resetDedupe } from '../src/modules/dedupe'
import { resetDebug, getFeedbackLog } from '../src/modules/debug'
import { resetVisual } from '../src/modules/visual'

describe('notify', () => {
  beforeEach(() => {
    // Reset all state between tests
    resetConfig()
    destroyRegions()
    resetAnnouncerState()
    resetDedupe()
    resetDebug()
    resetVisual()
    document.body.innerHTML = ''
  })

  describe('basic functionality', () => {
    it('should announce a success message', async () => {
      const event = await notify.success('Profile saved')

      expect(event.type).toBe('success')
      expect(event.message).toBe('Profile saved')
      expect(event.role).toBe('status')
      expect(event.ariaLive).toBe('polite')
      expect(event.priority).toBe('low')
    })

    it('should announce an error message', async () => {
      const event = await notify.error('Something went wrong')

      expect(event.type).toBe('error')
      expect(event.message).toBe('Something went wrong')
      expect(event.role).toBe('alert')
      expect(event.ariaLive).toBe('assertive')
      expect(event.priority).toBe('high')
    })

    it('should announce a warning message', async () => {
      const event = await notify.warning('Session expiring soon')

      expect(event.type).toBe('warning')
      expect(event.ariaLive).toBe('assertive')
      expect(event.priority).toBe('high')
    })

    it('should announce an info message', async () => {
      const event = await notify.info('New features available')

      expect(event.type).toBe('info')
      expect(event.ariaLive).toBe('polite')
      expect(event.priority).toBe('low')
    })

    it('should announce a loading message', async () => {
      const event = await notify.loading('Saving...')

      expect(event.type).toBe('loading')
      expect(event.ariaLive).toBe('polite')
      expect(event.priority).toBe('low')
    })
  })

  describe('live regions', () => {
    it('should create polite live region for success', async () => {
      await notify.success('Done')

      const politeRegion = getRegion('polite')
      expect(politeRegion).not.toBeNull()
      expect(politeRegion?.getAttribute('aria-live')).toBe('polite')
      expect(politeRegion?.getAttribute('role')).toBe('status')
    })

    it('should create assertive live region for errors', async () => {
      await notify.error('Error!')

      const assertiveRegion = getRegion('assertive')
      expect(assertiveRegion).not.toBeNull()
      expect(assertiveRegion?.getAttribute('aria-live')).toBe('assertive')
      expect(assertiveRegion?.getAttribute('role')).toBe('alert')
    })

    it('should inject message into the appropriate region', async () => {
      await notify.success('Test message')

      // Wait for the announcement to complete
      await new Promise((resolve) => setTimeout(resolve, 100))

      const politeRegion = getRegion('polite')
      expect(politeRegion?.textContent).toContain('Test message')
    })
  })

  describe('options', () => {
    it('should accept custom id', async () => {
      const event = await notify.success('Saved', { id: 'custom-id' })

      expect(event.id).toBe('custom-id')
    })

    it('should generate id if not provided', async () => {
      const event = await notify.success('Saved')

      expect(event.id).toBeDefined()
      expect(event.id.startsWith('a11y-')).toBe(true)
    })
  })

  describe('base notify function', () => {
    it('should accept input object', async () => {
      const event = await notify({
        message: 'Test',
        type: 'info',
      })

      expect(event.type).toBe('info')
      expect(event.message).toBe('Test')
    })

    it('should accept options in input object', async () => {
      const event = await notify({
        message: 'Test',
        type: 'error',
        options: { id: 'my-id' },
      })

      expect(event.id).toBe('my-id')
    })
  })

  describe('telemetry', () => {
    it('should log events when debug is enabled', async () => {
      configureFeedback({ debug: true })

      await notify.success('Logged event')

      const log = getFeedbackLog()
      expect(log.length).toBeGreaterThan(0)
      expect(log[0]?.event.message).toBe('Logged event')
    })
  })
})
