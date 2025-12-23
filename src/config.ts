/**
 * Global configuration management for a11y-feedback
 * @module config
 */

import type { FeedbackConfig } from './types'
import { DEFAULT_CONFIG } from './constants'

/**
 * Mutable internal configuration state
 */
let currentConfig: FeedbackConfig = { ...DEFAULT_CONFIG }

/**
 * Configuration change listeners
 */
type ConfigListener = (config: FeedbackConfig) => void
const configListeners: Set<ConfigListener> = new Set()

/**
 * Configure the global feedback settings
 *
 * @param options - Partial configuration options to merge with defaults
 * @returns The updated configuration
 *
 * @example
 * ```ts
 * // Enable visual feedback
 * configureFeedback({ visual: true })
 *
 * // Configure visual feedback position and timeout
 * configureFeedback({
 *   visual: true,
 *   visualPosition: 'bottom-right',
 *   defaultTimeout: 8000
 * })
 * ```
 */
export function configureFeedback(options: Partial<FeedbackConfig>): FeedbackConfig {
  const previousConfig = { ...currentConfig }

  currentConfig = {
    ...currentConfig,
    ...options,
  }

  // Notify listeners of configuration change
  if (hasConfigChanged(previousConfig, currentConfig)) {
    notifyConfigListeners()
  }

  return { ...currentConfig }
}

/**
 * Get the current configuration
 * Returns a copy to prevent external mutation
 *
 * @returns Current configuration object
 */
export function getConfig(): FeedbackConfig {
  return { ...currentConfig }
}

/**
 * Reset configuration to defaults
 * Useful for testing or resetting state
 *
 * @returns The default configuration
 */
export function resetConfig(): FeedbackConfig {
  currentConfig = { ...DEFAULT_CONFIG }
  notifyConfigListeners()
  return { ...currentConfig }
}

/**
 * Subscribe to configuration changes
 *
 * @param listener - Callback function invoked when config changes
 * @returns Unsubscribe function
 */
export function onConfigChange(listener: ConfigListener): () => void {
  configListeners.add(listener)
  return (): void => {
    configListeners.delete(listener)
  }
}

/**
 * Check if a specific config option is enabled
 *
 * @param key - Configuration key to check
 * @returns Value of the configuration option
 */
export function getConfigValue<K extends keyof FeedbackConfig>(key: K): FeedbackConfig[K] {
  return currentConfig[key]
}

/**
 * Check if visual feedback is enabled
 */
export function isVisualEnabled(): boolean {
  return currentConfig.visual
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return currentConfig.debug
}

/**
 * Get the region ID prefix
 */
export function getRegionPrefix(): string {
  return currentConfig.regionPrefix
}

/**
 * Internal: Notify all config listeners of a change
 */
function notifyConfigListeners(): void {
  const configCopy = { ...currentConfig }
  configListeners.forEach((listener) => {
    try {
      listener(configCopy)
    } catch (error) {
      // Silently catch listener errors to prevent breaking the config system
      if (currentConfig.debug) {
        console.error('[a11y-feedback] Config listener error:', error)
      }
    }
  })
}

/**
 * Internal: Check if configuration has changed
 */
function hasConfigChanged(prev: FeedbackConfig, next: FeedbackConfig): boolean {
  const keys = Object.keys(prev) as Array<keyof FeedbackConfig>
  return keys.some((key) => prev[key] !== next[key])
}
