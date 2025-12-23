/**
 * DOM utility functions for a11y-feedback
 * @module utils/dom
 */

/**
 * Safely query a DOM element by selector
 *
 * @param selector - CSS selector string
 * @param container - Container to search within (defaults to document)
 * @returns The element or null if not found
 */
export function querySelector<T extends HTMLElement>(
  selector: string,
  container: Document | HTMLElement = document
): T | null {
  try {
    return container.querySelector<T>(selector)
  } catch {
    // Invalid selector
    return null
  }
}

/**
 * Safely query all DOM elements by selector
 *
 * @param selector - CSS selector string
 * @param container - Container to search within (defaults to document)
 * @returns NodeList of matching elements (empty if invalid selector)
 */
export function querySelectorAll<T extends HTMLElement>(
  selector: string,
  container: Document | HTMLElement = document
): NodeListOf<T> {
  try {
    return container.querySelectorAll<T>(selector)
  } catch {
    // Return empty NodeList for invalid selector
    return document.querySelectorAll<T>('__invalid_selector_placeholder__')
  }
}

/**
 * Check if an element is focusable
 *
 * @param element - Element to check
 * @returns Whether the element can receive focus
 */
export function isFocusable(element: HTMLElement): boolean {
  // Check if element is disabled
  if ('disabled' in element && (element as HTMLInputElement).disabled) {
    return false
  }

  // Check tabindex
  const tabIndex = element.getAttribute('tabindex')
  if (tabIndex !== null && parseInt(tabIndex, 10) < 0) {
    return false
  }

  // Check if element is naturally focusable
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY']
  if (focusableTags.includes(element.tagName)) {
    // Links need href to be focusable
    if (element.tagName === 'A') {
      return element.hasAttribute('href')
    }
    return true
  }

  // Check contenteditable
  if (element.isContentEditable) {
    return true
  }

  // Check explicit tabindex
  return tabIndex !== null && parseInt(tabIndex, 10) >= 0
}

/**
 * Get the accessible name of an element
 *
 * @param element - Element to get name for
 * @returns The accessible name or empty string
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel !== null && ariaLabel.trim() !== '') {
    return ariaLabel.trim()
  }

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy !== null) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement !== null) {
      const text = labelElement.textContent
      if (text !== null && text.trim() !== '') {
        return text.trim()
      }
    }
  }

  // Check associated label (for form elements)
  if ('labels' in element) {
    const labels = (element as HTMLInputElement).labels
    if (labels !== null && labels.length > 0) {
      const labelText = labels[0]?.textContent
      if (labelText !== null && labelText !== undefined && labelText.trim() !== '') {
        return labelText.trim()
      }
    }
  }

  // Check placeholder (for inputs)
  if ('placeholder' in element) {
    const placeholder = (element as HTMLInputElement).placeholder
    if (placeholder !== '' && placeholder !== undefined) {
      return placeholder
    }
  }

  // Check title attribute
  const title = element.getAttribute('title')
  if (title !== null && title.trim() !== '') {
    return title.trim()
  }

  // Check text content (for buttons, links)
  const textContent = element.textContent
  if (textContent !== null && textContent.trim() !== '') {
    return textContent.trim()
  }

  return ''
}

/**
 * Create an HTML element with attributes
 *
 * @param tag - HTML tag name
 * @param attributes - Object of attribute key-value pairs
 * @returns The created element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

/**
 * Apply inline styles to an element
 *
 * @param element - Element to style
 * @param styles - CSS styles as a string
 */
export function applyStyles(element: HTMLElement, styles: string): void {
  element.setAttribute('style', styles)
}

/**
 * Remove an element from the DOM safely
 *
 * @param element - Element to remove
 */
export function removeElement(element: HTMLElement | null): void {
  element?.parentNode?.removeChild(element)
}

/**
 * Check if the DOM is available (not in SSR)
 *
 * @returns Whether document is available
 */
export function isDOMAvailable(): boolean {
  return typeof document !== 'undefined' && typeof window !== 'undefined'
}

/**
 * Check if reduced motion is preferred
 *
 * @returns Whether user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isDOMAvailable()) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
