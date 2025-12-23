import { beforeEach, afterEach } from 'vitest'

/**
 * Global test setup for a11y-feedback
 * Configures JSDOM environment and cleans up between tests
 */

// Mock window.matchMedia for jsdom (not supported by default)
window.matchMedia = function matchMedia(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {
      return false
    },
  } as MediaQueryList
}

beforeEach(() => {
  // Clean up any existing live regions from previous tests
  const existingRegions = document.querySelectorAll('[data-a11y-feedback]')
  existingRegions.forEach((region) => region.remove())

  // Clean up any visual feedback containers
  const visualContainers = document.querySelectorAll('[data-a11y-feedback-visual]')
  visualContainers.forEach((container) => container.remove())

  // Reset document body
  document.body.innerHTML = ''
})

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = ''
})
