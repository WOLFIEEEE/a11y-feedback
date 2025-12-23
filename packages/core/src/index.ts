/**
 * a11y-feedback
 * A production-grade, framework-agnostic accessibility feedback and announcement engine
 *
 * @packageDocumentation
 */

// Main API
export { notify } from './notify'
export type { NotifyFunction } from './notify'

// Configuration
export { configureFeedback, getConfig, resetConfig } from './config'

// Debug & Telemetry
export {
  enableFeedbackDebug,
  disableFeedbackDebug,
  getFeedbackLog,
  clearFeedbackLog,
  getFeedbackStats,
  getRecentFeedback,
  getFeedbackByType,
  getFeedbackByAction,
  exportFeedbackLog,
} from './modules/debug'

// Visual feedback control
export {
  dismissVisualFeedback,
  dismissAllVisualFeedback,
  getActiveVisualCount,
} from './modules/visual'

// Internationalization
export {
  getTranslation,
  formatTranslation,
  isRTL,
  getAvailableLocales,
  registerLocale,
} from './modules/i18n'

// Event System
export {
  onFeedback,
  onAnyFeedback,
  offFeedback,
  onceFeedback,
  getListenerCount,
  hasListeners,
} from './modules/events'
export type {
  FeedbackEventType,
  FeedbackEventPayloads,
  FeedbackEventListener,
  FeedbackWildcardListener,
} from './modules/events'

// ============================================================================
// V2.0 Exports
// ============================================================================

// Progress Notifications
export {
  createProgressController,
  hasActiveProgress,
  getProgressPercentage,
} from './modules/progress'

// Action Buttons
export {
  focusFirstAction,
  getActionsAnnouncement,
  triggerAction,
} from './modules/actions'

// Promise-based Dialogs
export {
  confirm,
  prompt,
  closeAllDialogs,
  hasOpenDialogs,
} from './modules/dialogs'

// Notification Templates
export {
  createTemplate,
  registerTemplate,
  getTemplate,
  unregisterTemplate,
  showTemplate,
  createUndoTemplate,
  createAsyncTemplate,
  formErrorTemplate,
  networkStatusTemplate,
  fileUploadTemplate,
} from './modules/templates'

// Rich Content
export {
  renderRichContent,
  getRichContentText,
  sanitizeHTML,
  BUILTIN_ICONS,
} from './modules/rich-content'

// Notification Grouping
export {
  addToGroup,
  removeFromGroup,
  toggleGroupCollapse,
  getAllGroups,
  getGroup,
  clearAllGroups,
  onGroupChange,
} from './modules/grouping'

// Keyboard Navigation
export {
  initKeyboardManager,
  registerShortcut,
  unregisterShortcut,
  focusNotification,
  focusNextNotification,
  focusPreviousNotification,
  enableFocusTrap,
  disableFocusTrap,
  destroyKeyboardManager,
} from './modules/keyboard'

// Sound & Haptics
export {
  initSoundManager,
  preloadSounds,
  playSound,
  setVolume,
  getVolume,
  muteSounds,
  unmuteSounds,
  toggleMute,
  destroySoundManager,
} from './modules/sound'

export {
  initHapticManager,
  triggerHaptic,
  triggerCustomHaptic,
  stopHaptic,
  enableHaptics,
  disableHaptics,
  isHapticsEnabled,
  supportsVibration,
  destroyHapticManager,
} from './modules/haptics'

// Notification Center
export {
  initNotificationCenter,
  getNotificationHistory,
  getNotificationCenterState,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  clearHistory,
  toggleCenter,
  openCenter,
  closeCenter,
  isCenterOpen,
  onCenterEvent,
  renderNotificationCenter,
  destroyNotificationCenter,
} from './modules/notification-center'

// Types
export type {
  FeedbackType,
  FeedbackOptions,
  FeedbackEvent,
  FeedbackLogEntry,
  FeedbackConfig,
  FeedbackSemantics,
  FeedbackPriority,
  FeedbackTranslations,
  AriaLive,
  AriaRole,
  // V2.0 Types
  NotificationAction,
  ActionVariant,
  ProgressOptions,
  ProgressController,
  RichContent,
  RichContentImage,
  RichContentLink,
  NotificationGroup,
  GroupingConfig,
  NotificationTemplate,
  TemplateInstance,
  ConfirmOptions,
  ConfirmResult,
  PromptOptions,
  PromptResult,
  SoundConfig,
  HapticConfig,
  VibratePattern,
  KeyboardConfig,
  HistoryConfig,
  NotificationCenterState,
  NotificationCenterEventType,
  NotificationCenterEventListener,
} from './types'

// Type guards
export { isFeedbackType, isFeedbackOptions } from './types'

// Constants (for advanced usage)
export { FEEDBACK_SEMANTICS, DEFAULT_TIMEOUTS } from './constants'

