/**
 * Live region management for a11y-feedback
 * Handles creation, injection, and content management of ARIA live regions
 * @module modules/regions
 */

import type { AriaLive } from '../types'
import { VISUALLY_HIDDEN_STYLES, DATA_ATTRIBUTES, REGION_IDS } from '../constants'
import { getRegionPrefix } from '../config'
import { createElement, applyStyles, removeElement, isDOMAvailable } from '../utils/dom'
import { waitMicrotask } from '../utils/timing'

/**
 * Cache for live region elements
 */
let politeRegion: HTMLElement | null = null
let assertiveRegion: HTMLElement | null = null
let regionsInitialized = false

/**
 * Initialize live regions in the DOM
 * Creates exactly two regions: one polite and one assertive
 * Regions are visually hidden but accessible to screen readers
 *
 * @returns Whether initialization was successful
 */
export function initializeRegions(): boolean {
  if (!isDOMAvailable()) {
    return false
  }

  if (regionsInitialized && politeRegion !== null && assertiveRegion !== null) {
    // Regions already exist
    return true
  }

  const prefix = getRegionPrefix()

  // Check if regions already exist in DOM (e.g., from previous initialization)
  const existingPolite = document.getElementById(`${prefix}-${REGION_IDS.polite}`)
  const existingAssertive = document.getElementById(`${prefix}-${REGION_IDS.assertive}`)

  if (existingPolite !== null && existingAssertive !== null) {
    politeRegion = existingPolite
    assertiveRegion = existingAssertive
    regionsInitialized = true
    return true
  }

  // Create polite region (role="status", aria-live="polite")
  politeRegion = createLiveRegion('polite', `${prefix}-${REGION_IDS.polite}`)

  // Create assertive region (role="alert", aria-live="assertive")
  assertiveRegion = createLiveRegion('assertive', `${prefix}-${REGION_IDS.assertive}`)

  // Append to document body
  document.body.appendChild(politeRegion)
  document.body.appendChild(assertiveRegion)

  regionsInitialized = true
  return true
}

/**
 * Create a live region element with proper ARIA attributes
 *
 * @param type - The politeness level ('polite' or 'assertive')
 * @param id - The ID for the element
 * @returns The created live region element
 */
function createLiveRegion(type: AriaLive, id: string): HTMLElement {
  const region = createElement('div', {
    id,
    [DATA_ATTRIBUTES.region]: type,
    'aria-live': type,
    'aria-atomic': 'true',
    role: type === 'assertive' ? 'alert' : 'status',
  })

  // Apply visually hidden styles
  // Using inline styles to avoid CSS dependency
  applyStyles(region, VISUALLY_HIDDEN_STYLES)

  return region
}

/**
 * Get a live region by politeness level
 *
 * @param type - The politeness level
 * @returns The live region element or null
 */
export function getRegion(type: AriaLive): HTMLElement | null {
  // Ensure regions are initialized
  if (!regionsInitialized) {
    initializeRegions()
  }

  return type === 'assertive' ? assertiveRegion : politeRegion
}

/**
 * Announce content to a live region
 * Uses a clear-wait-inject pattern to ensure screen readers detect changes
 *
 * @param type - The politeness level
 * @param content - The content to announce
 * @returns Promise that resolves when content is injected
 */
export async function announceToRegion(type: AriaLive, content: string): Promise<void> {
  const region = getRegion(type)

  if (region === null) {
    return
  }

  // Clear the region first
  region.textContent = ''

  // Wait for microtask to ensure browser processes the clear
  await waitMicrotask()

  // Inject the new content
  region.textContent = content
}

/**
 * Clear a live region's content
 *
 * @param type - The politeness level
 */
export function clearRegion(type: AriaLive): void {
  const region = getRegion(type)

  if (region !== null) {
    region.textContent = ''
  }
}

/**
 * Clear all live regions
 */
export function clearAllRegions(): void {
  clearRegion('polite')
  clearRegion('assertive')
}

/**
 * Get the current content of a live region
 *
 * @param type - The politeness level
 * @returns The current text content or null
 */
export function getRegionContent(type: AriaLive): string | null {
  const region = getRegion(type)
  return region?.textContent ?? null
}

/**
 * Destroy live regions and clean up
 * Useful for testing or when unmounting the library
 */
export function destroyRegions(): void {
  removeElement(politeRegion)
  removeElement(assertiveRegion)

  politeRegion = null
  assertiveRegion = null
  regionsInitialized = false
}

/**
 * Check if regions are initialized
 *
 * @returns Whether regions have been created
 */
export function areRegionsInitialized(): boolean {
  return regionsInitialized
}

/**
 * Force re-initialization of regions
 * Destroys existing regions and creates new ones
 *
 * @returns Whether re-initialization was successful
 */
export function reinitializeRegions(): boolean {
  destroyRegions()
  return initializeRegions()
}
