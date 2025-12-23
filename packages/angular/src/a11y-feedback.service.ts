/**
 * Angular service for a11y-feedback
 */

import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import {
  notify,
  configureFeedback,
  getConfig,
  resetConfig,
  dismissVisualFeedback,
  dismissAllVisualFeedback,
  getNotificationHistory,
  getUnreadCount,
  onFeedback,
  confirm,
  prompt,
  createProgressController,
  type FeedbackEvent,
  type FeedbackConfig,
  type FeedbackOptions,
  type FeedbackType,
  type ConfirmOptions,
  type ConfirmResult,
  type PromptOptions,
  type PromptResult,
  type ProgressOptions,
  type ProgressController,
} from '@theaccessibleteam/a11y-feedback'

/**
 * State interface for the service
 */
export interface A11yFeedbackState {
  notifications: readonly FeedbackEvent[]
  unreadCount: number
  config: FeedbackConfig
}

/**
 * Angular service for accessible notifications
 */
@Injectable({
  providedIn: 'root',
})
export class A11yFeedbackService implements OnDestroy {
  private readonly _state = new BehaviorSubject<A11yFeedbackState>({
    notifications: getNotificationHistory(),
    unreadCount: getUnreadCount(),
    config: getConfig(),
  })

  private readonly updateHandler = () => this.updateState()

  /**
   * Observable of the current state
   */
  readonly state$: Observable<A11yFeedbackState> = this._state.asObservable()

  /**
   * Observable of notifications
   */
  get notifications$(): Observable<readonly FeedbackEvent[]> {
    return new Observable(subscriber => {
      const sub = this._state.subscribe(state => {
        subscriber.next(state.notifications)
      })
      return () => sub.unsubscribe()
    })
  }

  /**
   * Observable of unread count
   */
  get unreadCount$(): Observable<number> {
    return new Observable(subscriber => {
      const sub = this._state.subscribe(state => {
        subscriber.next(state.unreadCount)
      })
      return () => sub.unsubscribe()
    })
  }

  constructor() {
    // Subscribe to feedback events
    onFeedback('announced', this.updateHandler)
    onFeedback('dismissed', this.updateHandler)
    onFeedback('replaced', this.updateHandler)
  }

  ngOnDestroy(): void {
    // Cleanup is handled internally by the core library
    // The service is typically a singleton so cleanup is less critical
  }

  private updateState(): void {
    this._state.next({
      notifications: getNotificationHistory(),
      unreadCount: getUnreadCount(),
      config: getConfig(),
    })
  }

  /**
   * Send a notification
   */
  async notify(
    message: string,
    type: FeedbackType,
    options?: FeedbackOptions
  ): Promise<FeedbackEvent> {
    const result = await notify({ message, type, options })
    this.updateState()
    return result
  }

  /**
   * Send a success notification
   */
  async success(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
    const result = await notify.success(message, options)
    this.updateState()
    return result
  }

  /**
   * Send an error notification
   */
  async error(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
    const result = await notify.error(message, options)
    this.updateState()
    return result
  }

  /**
   * Send a warning notification
   */
  async warning(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
    const result = await notify.warning(message, options)
    this.updateState()
    return result
  }

  /**
   * Send an info notification
   */
  async info(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
    const result = await notify.info(message, options)
    this.updateState()
    return result
  }

  /**
   * Send a loading notification
   */
  async loading(message: string, options?: FeedbackOptions): Promise<FeedbackEvent> {
    const result = await notify.loading(message, options)
    this.updateState()
    return result
  }

  /**
   * Show a confirmation dialog
   */
  async confirm(message: string, options?: ConfirmOptions): Promise<ConfirmResult> {
    return confirm(message, options)
  }

  /**
   * Show a prompt dialog
   */
  async prompt(message: string, options?: PromptOptions): Promise<PromptResult> {
    return prompt(message, options)
  }

  /**
   * Create a progress notification
   */
  progress(message: string, options?: ProgressOptions): ProgressController {
    return createProgressController(
      `progress-${Date.now()}`,
      message,
      options
    )
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    dismissVisualFeedback(id)
    this.updateState()
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    dismissAllVisualFeedback()
    this.updateState()
  }

  /**
   * Update configuration
   */
  configure(config: Partial<FeedbackConfig>): void {
    configureFeedback(config)
    this.updateState()
  }

  /**
   * Reset configuration to defaults
   */
  resetConfig(): void {
    resetConfig()
    this.updateState()
  }

  /**
   * Get current configuration
   */
  getConfig(): FeedbackConfig {
    return getConfig()
  }
}

