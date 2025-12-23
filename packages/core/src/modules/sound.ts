/**
 * Sound Module for a11y-feedback v2.0
 * Handles audio notifications with Web Audio API
 * @module sound
 */

import type { FeedbackType, SoundConfig } from '../types'
import { getConfig, getSoundConfig } from '../config'

/**
 * Internal state for sound manager
 */
interface SoundState {
  /** Audio context instance */
  context: AudioContext | null
  /** Preloaded audio buffers */
  buffers: Map<FeedbackType, AudioBuffer>
  /** Whether sounds have been preloaded */
  preloaded: boolean
  /** Whether sound is muted */
  muted: boolean
  /** Master gain node */
  gainNode: GainNode | null
  /** Whether user prefers reduced data */
  prefersReducedData: boolean
}

const state: SoundState = {
  context: null,
  buffers: new Map(),
  preloaded: false,
  muted: false,
  gainNode: null,
  prefersReducedData: false,
}

/**
 * Initialize the sound manager
 * 
 * @param config - Optional sound configuration
 */
export function initSoundManager(config?: SoundConfig): void {
  if (state.context) {
    return // Already initialized
  }

  const soundConfig = config || getSoundConfig()
  
  if (!soundConfig?.enabled) {
    return
  }

  // Check reduced data preference
  if (soundConfig.respectReducedData !== false) {
    // Note: This is not widely supported yet, but future-proofing
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) {
      state.prefersReducedData = true
      if (getConfig().debug) {
        console.log('[a11y-feedback] Sounds disabled due to reduced data preference')
      }
      return
    }
  }

  try {
    state.context = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
    
    // Create master gain node
    state.gainNode = state.context.createGain()
    state.gainNode.gain.value = soundConfig.volume ?? 0.5
    state.gainNode.connect(state.context.destination)

    if (getConfig().debug) {
      console.log('[a11y-feedback] Sound manager initialized')
    }
  } catch (error) {
    if (getConfig().debug) {
      console.error('[a11y-feedback] Failed to initialize audio context:', error)
    }
  }
}

/**
 * Preload sounds for all feedback types
 * 
 * @returns Promise that resolves when all sounds are loaded
 */
export async function preloadSounds(): Promise<void> {
  if (state.preloaded || !state.context) {
    return
  }

  const soundConfig = getSoundConfig()
  if (!soundConfig?.sounds) {
    state.preloaded = true
    return
  }

  const loadPromises: Promise<void>[] = []

  for (const [type, sound] of Object.entries(soundConfig.sounds)) {
    if (!sound) continue

    if (sound instanceof AudioBuffer) {
      state.buffers.set(type as FeedbackType, sound)
    } else if (typeof sound === 'string') {
      loadPromises.push(loadSoundFromURL(type as FeedbackType, sound))
    }
  }

  await Promise.allSettled(loadPromises)
  state.preloaded = true

  if (getConfig().debug) {
    console.log('[a11y-feedback] Sounds preloaded:', state.buffers.size)
  }
}

/**
 * Load a sound from URL
 */
async function loadSoundFromURL(type: FeedbackType, url: string): Promise<void> {
  if (!state.context) return

  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await state.context.decodeAudioData(arrayBuffer)
    state.buffers.set(type, audioBuffer)
  } catch (error) {
    if (getConfig().debug) {
      console.error(`[a11y-feedback] Failed to load sound for ${type}:`, error)
    }
  }
}

/**
 * Play a sound for a feedback type
 * 
 * @param type - Feedback type
 */
export function playSound(type: FeedbackType): void {
  if (!state.context || !state.gainNode || state.muted || state.prefersReducedData) {
    return
  }

  // Resume context if suspended (required for autoplay policy)
  if (state.context.state === 'suspended') {
    void state.context.resume()
  }

  const buffer = state.buffers.get(type)
  
  if (buffer) {
    // Play from preloaded buffer
    const source = state.context.createBufferSource()
    source.buffer = buffer
    source.connect(state.gainNode)
    source.start(0)
  } else {
    // Generate a simple tone as fallback
    playGeneratedTone(type)
  }
}

/**
 * Generate and play a simple tone for a feedback type
 */
function playGeneratedTone(type: FeedbackType): void {
  if (!state.context || !state.gainNode) return

  const oscillator = state.context.createOscillator()
  const envelope = state.context.createGain()

  // Configure based on type
  const configs: Record<FeedbackType, { freq: number; duration: number; waveform: OscillatorType }> = {
    success: { freq: 880, duration: 0.15, waveform: 'sine' },
    info: { freq: 440, duration: 0.1, waveform: 'sine' },
    warning: { freq: 330, duration: 0.2, waveform: 'triangle' },
    error: { freq: 220, duration: 0.3, waveform: 'sawtooth' },
    loading: { freq: 660, duration: 0.05, waveform: 'sine' },
  }

  const config = configs[type]
  oscillator.frequency.value = config.freq
  oscillator.type = config.waveform

  // Envelope for smooth start/end
  const now = state.context.currentTime
  envelope.gain.setValueAtTime(0, now)
  envelope.gain.linearRampToValueAtTime(0.3, now + 0.01)
  envelope.gain.linearRampToValueAtTime(0, now + config.duration)

  oscillator.connect(envelope)
  envelope.connect(state.gainNode)

  oscillator.start(now)
  oscillator.stop(now + config.duration + 0.01)
}

/**
 * Set the master volume
 * 
 * @param volume - Volume level (0-1)
 */
export function setVolume(volume: number): void {
  if (state.gainNode) {
    state.gainNode.gain.value = Math.max(0, Math.min(1, volume))
  }
}

/**
 * Get the current volume
 */
export function getVolume(): number {
  return state.gainNode?.gain.value ?? 0.5
}

/**
 * Mute all sounds
 */
export function muteSounds(): void {
  state.muted = true
  if (getConfig().debug) {
    console.log('[a11y-feedback] Sounds muted')
  }
}

/**
 * Unmute sounds
 */
export function unmuteSounds(): void {
  state.muted = false
  if (getConfig().debug) {
    console.log('[a11y-feedback] Sounds unmuted')
  }
}

/**
 * Check if sounds are muted
 */
export function isMuted(): boolean {
  return state.muted
}

/**
 * Toggle mute state
 */
export function toggleMute(): boolean {
  state.muted = !state.muted
  return state.muted
}

/**
 * Check if sound manager is initialized
 */
export function isSoundManagerInitialized(): boolean {
  return state.context !== null
}

/**
 * Check if sounds are preloaded
 */
export function areSoundsPreloaded(): boolean {
  return state.preloaded
}

/**
 * Destroy the sound manager
 */
export function destroySoundManager(): void {
  if (state.context) {
    void state.context.close()
    state.context = null
  }
  state.gainNode = null
  state.buffers.clear()
  state.preloaded = false
  state.muted = false

  if (getConfig().debug) {
    console.log('[a11y-feedback] Sound manager destroyed')
  }
}

