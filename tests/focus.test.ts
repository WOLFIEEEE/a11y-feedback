import { describe, it, expect, beforeEach } from 'vitest'
import {
  canMoveFocus,
  handleFocus,
  moveFocus,
  generateFocusExplanation,
  buildMessageWithFocusExplanation,
  saveCurrentFocus,
  restoreFocus,
} from '../src/modules/focus'
import { resetConfig } from '../src/config'
import type { FeedbackEvent } from '../src/types'

describe('focus', () => {
  beforeEach(() => {
    resetConfig()
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

  describe('canMoveFocus', () => {
    it('should return false for success type', () => {
      expect(canMoveFocus('success')).toBe(false)
    })

    it('should return false for info type', () => {
      expect(canMoveFocus('info')).toBe(false)
    })

    it('should return false for loading type', () => {
      expect(canMoveFocus('loading')).toBe(false)
    })

    it('should return true for error type', () => {
      expect(canMoveFocus('error')).toBe(true)
    })

    it('should return true for warning type', () => {
      expect(canMoveFocus('warning')).toBe(true)
    })
  })

  describe('handleFocus', () => {
    it('should not move focus if no target specified', () => {
      const event = createMockEvent({ type: 'error' })

      const result = handleFocus(event)

      expect(result.moved).toBe(false)
      expect(result.target).toBeNull()
      expect(result.blockedReason).toBeNull()
    })

    it('should block focus for success type', () => {
      const event = createMockEvent({
        type: 'success',
        options: { focus: '#test-input' },
      })

      const result = handleFocus(event)

      expect(result.moved).toBe(false)
      expect(result.blockedReason).toContain('success type cannot move focus')
    })

    it('should block focus for info type', () => {
      const event = createMockEvent({
        type: 'info',
        options: { focus: '#test-input' },
      })

      const result = handleFocus(event)

      expect(result.moved).toBe(false)
      expect(result.blockedReason).toContain('info type cannot move focus')
    })

    it('should block focus for loading type', () => {
      const event = createMockEvent({
        type: 'loading',
        options: { focus: '#test-input' },
      })

      const result = handleFocus(event)

      expect(result.moved).toBe(false)
      expect(result.blockedReason).toContain('loading type cannot move focus')
    })

    it('should allow focus for error type', () => {
      document.body.innerHTML = '<input id="test-input" type="text" />'

      const event = createMockEvent({
        type: 'error',
        options: { focus: '#test-input' },
      })

      const result = handleFocus(event)

      expect(result.moved).toBe(true)
      expect(result.target).toBe('#test-input')
    })

    it('should allow focus for warning type', () => {
      document.body.innerHTML = '<input id="test-input" type="text" />'

      const event = createMockEvent({
        type: 'warning',
        options: { focus: '#test-input' },
      })

      const result = handleFocus(event)

      expect(result.moved).toBe(true)
      expect(result.target).toBe('#test-input')
    })
  })

  describe('moveFocus', () => {
    it('should move focus to a valid element', () => {
      document.body.innerHTML = '<button id="test-button">Click me</button>'

      const result = moveFocus('#test-button')

      expect(result.moved).toBe(true)
      expect(document.activeElement?.id).toBe('test-button')
    })

    it('should return error if element not found', () => {
      const result = moveFocus('#nonexistent')

      expect(result.moved).toBe(false)
      expect(result.blockedReason).toContain('Element not found')
    })

    it('should add tabindex to non-focusable elements', () => {
      document.body.innerHTML = '<div id="test-div">Content</div>'

      moveFocus('#test-div')

      const div = document.getElementById('test-div')
      expect(div?.getAttribute('tabindex')).toBe('-1')
    })

    it('should get accessible name from aria-label', () => {
      document.body.innerHTML = '<button id="test" aria-label="Submit form">Submit</button>'

      const result = moveFocus('#test')

      expect(result.elementName).toBe('Submit form')
    })

    it('should get accessible name from text content', () => {
      document.body.innerHTML = '<button id="test">Click Here</button>'

      const result = moveFocus('#test')

      expect(result.elementName).toBe('Click Here')
    })
  })

  describe('generateFocusExplanation', () => {
    it('should generate explanation with element name', () => {
      const explanation = generateFocusExplanation('Email field')

      expect(explanation).toBe('Focus moved to Email field.')
    })

    it('should generate generic explanation without element name', () => {
      const explanation = generateFocusExplanation(null)

      expect(explanation).toBe('Focus moved.')
    })
  })

  describe('buildMessageWithFocusExplanation', () => {
    it('should append explanation when explainFocus is true and focus moved', () => {
      const event = createMockEvent({
        options: { explainFocus: true },
      })
      const focusResult = {
        moved: true,
        target: '#email',
        elementName: 'Email field',
        blockedReason: null,
      }

      const result = buildMessageWithFocusExplanation('Error occurred', event, focusResult)

      expect(result).toBe('Error occurred Focus moved to Email field.')
    })

    it('should not append explanation when explainFocus is false', () => {
      const event = createMockEvent({
        options: { explainFocus: false },
      })
      const focusResult = {
        moved: true,
        target: '#email',
        elementName: 'Email field',
        blockedReason: null,
      }

      const result = buildMessageWithFocusExplanation('Error occurred', event, focusResult)

      expect(result).toBe('Error occurred')
    })

    it('should not append explanation when focus did not move', () => {
      const event = createMockEvent({
        options: { explainFocus: true },
      })
      const focusResult = {
        moved: false,
        target: '#email',
        elementName: null,
        blockedReason: 'Focus blocked',
      }

      const result = buildMessageWithFocusExplanation('Error occurred', event, focusResult)

      expect(result).toBe('Error occurred')
    })
  })

  describe('saveCurrentFocus and restoreFocus', () => {
    it('should save and restore focus', () => {
      document.body.innerHTML = `
        <button id="button1">Button 1</button>
        <button id="button2">Button 2</button>
      `

      const button1 = document.getElementById('button1') as HTMLButtonElement
      button1.focus()

      const saved = saveCurrentFocus()
      expect(saved).toBe(button1)

      const button2 = document.getElementById('button2') as HTMLButtonElement
      button2.focus()

      const restored = restoreFocus(saved)
      expect(restored).toBe(true)
      expect(document.activeElement).toBe(button1)
    })

    it('should return null when no element is focused', () => {
      document.body.innerHTML = '<div>No focusable elements</div>'

      const saved = saveCurrentFocus()

      // Body or null depending on browser behavior
      expect(saved === null || saved === document.body).toBe(true)
    })

    it('should return false when restoring null', () => {
      const result = restoreFocus(null)

      expect(result).toBe(false)
    })
  })
})
