/**
 * Haptics Module for a11y-feedback v2.0
 * Handles vibration/haptic feedback for notifications
 * @module haptics
 */

import type { FeedbackType, HapticConfig, VibratePattern } from '../types'
import { DEFAULT_HAPTIC_PATTERNS } from '../constants'
import { getConfig, getHapticConfig } from '../config'

/**
 * Internal state for haptic manager
 */
interface HapticState {
  /** Whether haptics are enabled */
  enabled: boolean
  /** Custom patterns per type */
  patterns: Map<FeedbackType, VibratePattern>
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean
  /** Whether device supports vibration */
  supportsVibration: boolean
}

const state: HapticState = {
  enabled: false,
  patterns: new Map(),
  prefersReducedMotion: false,
  supportsVibration: false,
}

/**
 * Check if the device supports vibration
 */
function checkVibrationSupport(): boolean {
  return 'vibrate' in navigator && typeof navigator.vibrate === 'function'
}

/**
 * Check if user prefers reduced motion
 */
function checkReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Initialize the haptic manager
 * 
 * @param config - Optional haptic configuration
 */
export function initHapticManager(config?: HapticConfig): void {
  const hapticConfig = config || getHapticConfig()

  if (!hapticConfig?.enabled) {
    state.enabled = false
    return
  }

  // Check device support
  state.supportsVibration = checkVibrationSupport()
  
  if (!state.supportsVibration) {
    if (getConfig().debug) {
      console.log('[a11y-feedback] Haptics not supported on this device')
    }
    return
  }

  // Check reduced motion preference
  if (hapticConfig.respectReducedMotion !== false) {
    state.prefersReducedMotion = checkReducedMotion()
    
    if (state.prefersReducedMotion) {
      if (getConfig().debug) {
        console.log('[a11y-feedback] Haptics disabled due to reduced motion preference')
      }
      return
    }

    // Listen for preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      mediaQuery.addEventListener('change', (e) => {
        state.prefersReducedMotion = e.matches
        if (getConfig().debug) {
          console.log('[a11y-feedback] Reduced motion preference changed:', e.matches)
        }
      })
    }
  }

  // Load patterns
  state.patterns.clear()
  
  // Set default patterns
  for (const [type, pattern] of Object.entries(DEFAULT_HAPTIC_PATTERNS)) {
    state.patterns.set(type as FeedbackType, pattern)
  }

  // Override with custom patterns
  if (hapticConfig.patterns) {
    for (const [type, pattern] of Object.entries(hapticConfig.patterns)) {
      if (pattern) {
        state.patterns.set(type as FeedbackType, pattern)
      }
    }
  }

  state.enabled = true

  if (getConfig().debug) {
    console.log('[a11y-feedback] Haptic manager initialized')
  }
}

/**
 * Trigger haptic feedback for a feedback type
 * 
 * @param type - Feedback type
 * @returns Whether haptic was triggered
 */
export function triggerHaptic(type: FeedbackType): boolean {
  if (!state.enabled || !state.supportsVibration || state.prefersReducedMotion) {
    return false
  }

  const pattern = state.patterns.get(type)
  
  if (!pattern) {
    return false
  }

  try {
    navigator.vibrate(pattern as number | number[])
    
    if (getConfig().debug) {
      console.log(`[a11y-feedback] Haptic triggered for ${type}:`, pattern)
    }
    
    return true
  } catch (error) {
    if (getConfig().debug) {
      console.error('[a11y-feedback] Haptic error:', error)
    }
    return false
  }
}

/**
 * Trigger a custom haptic pattern
 * 
 * @param pattern - Vibration pattern
 * @returns Whether haptic was triggered
 */
export function triggerCustomHaptic(pattern: VibratePattern): boolean {
  if (!state.enabled || !state.supportsVibration || state.prefersReducedMotion) {
    return false
  }

  try {
    navigator.vibrate(pattern as number | number[])
    return true
  } catch (error) {
    if (getConfig().debug) {
      console.error('[a11y-feedback] Haptic error:', error)
    }
    return false
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopHaptic(): void {
  if (state.supportsVibration) {
    try {
      navigator.vibrate(0)
    } catch {
      // Ignore errors when stopping
    }
  }
}

/**
 * Set a custom pattern for a feedback type
 * 
 * @param type - Feedback type
 * @param pattern - Vibration pattern
 */
export function setPattern(type: FeedbackType, pattern: VibratePattern): void {
  state.patterns.set(type, pattern)
}

/**
 * Get the pattern for a feedback type
 * 
 * @param type - Feedback type
 * @returns Vibration pattern or undefined
 */
export function getPattern(type: FeedbackType): VibratePattern | undefined {
  return state.patterns.get(type)
}

/**
 * Enable haptics
 */
export function enableHaptics(): void {
  if (state.supportsVibration && !state.prefersReducedMotion) {
    state.enabled = true
    if (getConfig().debug) {
      console.log('[a11y-feedback] Haptics enabled')
    }
  }
}

/**
 * Disable haptics
 */
export function disableHaptics(): void {
  state.enabled = false
  stopHaptic()
  if (getConfig().debug) {
    console.log('[a11y-feedback] Haptics disabled')
  }
}

/**
 * Check if haptics are enabled
 */
export function isHapticsEnabled(): boolean {
  return state.enabled
}

/**
 * Check if device supports vibration
 */
export function supportsVibration(): boolean {
  return state.supportsVibration
}

/**
 * Check if user prefers reduced motion
 */
export function userPrefersReducedMotion(): boolean {
  return state.prefersReducedMotion
}

/**
 * Destroy the haptic manager
 */
export function destroyHapticManager(): void {
  stopHaptic()
  state.enabled = false
  state.patterns.clear()

  if (getConfig().debug) {
    console.log('[a11y-feedback] Haptic manager destroyed')
  }
}

