/**
 * Internationalization module for a11y-feedback
 * Provides translations and RTL support
 * @module modules/i18n
 */

import type { FeedbackTranslations } from '../types'
import { getConfig } from '../config'
import { isDOMAvailable } from '../utils/dom'

/**
 * Default translations (English)
 */
const DEFAULT_TRANSLATIONS: Required<FeedbackTranslations> = {
  dismiss: 'Dismiss',
  notificationsLabel: 'Notifications',
  focusMovedTo: 'Focus moved to {label}.',
  // V2.0 translations
  confirmTitle: 'Confirm',
  confirm: 'Confirm',
  cancel: 'Cancel',
  notificationCenter: 'Notification Center',
  noNotifications: 'No notifications',
  markAllRead: 'Mark all as read',
  clearAll: 'Clear all',
}

/**
 * Built-in translations for common locales
 */
const LOCALE_TRANSLATIONS: Record<string, FeedbackTranslations> = {
  en: DEFAULT_TRANSLATIONS,
  es: {
    dismiss: 'Cerrar',
    notificationsLabel: 'Notificaciones',
    focusMovedTo: 'Foco movido a {label}.',
  },
  fr: {
    dismiss: 'Fermer',
    notificationsLabel: 'Notifications',
    focusMovedTo: 'Focus déplacé vers {label}.',
  },
  de: {
    dismiss: 'Schließen',
    notificationsLabel: 'Benachrichtigungen',
    focusMovedTo: 'Fokus verschoben zu {label}.',
  },
  it: {
    dismiss: 'Chiudi',
    notificationsLabel: 'Notifiche',
    focusMovedTo: 'Focus spostato su {label}.',
  },
  pt: {
    dismiss: 'Fechar',
    notificationsLabel: 'Notificações',
    focusMovedTo: 'Foco movido para {label}.',
  },
  ja: {
    dismiss: '閉じる',
    notificationsLabel: '通知',
    focusMovedTo: 'フォーカスが{label}に移動しました。',
  },
  zh: {
    dismiss: '关闭',
    notificationsLabel: '通知',
    focusMovedTo: '焦点已移至{label}。',
  },
  ko: {
    dismiss: '닫기',
    notificationsLabel: '알림',
    focusMovedTo: '포커스가 {label}(으)로 이동됨.',
  },
  ar: {
    dismiss: 'إغلاق',
    notificationsLabel: 'الإشعارات',
    focusMovedTo: 'تم نقل التركيز إلى {label}.',
  },
  he: {
    dismiss: 'סגור',
    notificationsLabel: 'התראות',
    focusMovedTo: 'המיקוד הועבר אל {label}.',
  },
}

/**
 * Get the translation for a specific key
 *
 * @param key - Translation key
 * @returns Translated string
 */
export function getTranslation<K extends keyof FeedbackTranslations>(
  key: K
): string {
  const config = getConfig()
  const locale = config.locale ?? 'en'

  // Priority: custom translations > locale translations > defaults
  if (config.translations?.[key]) {
    return config.translations[key] as string
  }

  const localeTranslations = LOCALE_TRANSLATIONS[locale]
  if (localeTranslations?.[key]) {
    return localeTranslations[key] as string
  }

  return DEFAULT_TRANSLATIONS[key]
}

/**
 * Format a translation with placeholder substitution
 *
 * @param key - Translation key
 * @param params - Key-value pairs for placeholder substitution
 * @returns Formatted string
 *
 * @example
 * ```ts
 * formatTranslation('focusMovedTo', { label: 'Email field' })
 * // Returns: "Focus moved to Email field"
 * ```
 */
export function formatTranslation<K extends keyof FeedbackTranslations>(
  key: K,
  params: Record<string, string>
): string {
  let translation = getTranslation(key)

  for (const [placeholder, value] of Object.entries(params)) {
    translation = translation.replace(`{${placeholder}}`, value)
  }

  return translation
}

/**
 * Check if RTL mode should be enabled
 *
 * @returns Whether RTL mode is enabled
 */
export function isRTL(): boolean {
  const config = getConfig()

  // Explicit configuration
  if (config.rtl === true) {
    return true
  }
  if (config.rtl === false) {
    return false
  }

  // Auto-detect from document direction
  if (config.rtl === 'auto' && isDOMAvailable()) {
    const dir = document.documentElement.dir || document.body.dir
    return dir === 'rtl'
  }

  // Default: check document direction
  if (isDOMAvailable()) {
    const computedDir = window.getComputedStyle(document.documentElement).direction
    return computedDir === 'rtl'
  }

  return false
}

/**
 * Get available locales
 *
 * @returns Array of locale codes with built-in translations
 */
export function getAvailableLocales(): string[] {
  return Object.keys(LOCALE_TRANSLATIONS)
}

/**
 * Register custom translations for a locale
 *
 * @param locale - Locale code (e.g., 'en', 'es', 'fr')
 * @param translations - Partial translations to register
 */
export function registerLocale(
  locale: string,
  translations: FeedbackTranslations
): void {
  LOCALE_TRANSLATIONS[locale] = {
    ...DEFAULT_TRANSLATIONS,
    ...LOCALE_TRANSLATIONS[locale],
    ...translations,
  }
}

