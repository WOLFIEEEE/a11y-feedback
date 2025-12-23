/**
 * Notification Templates Module for a11y-feedback v2.0
 * Provides reusable notification configurations
 * @module templates
 */

import type { 
  NotificationTemplate, 
  TemplateInstance, 
  FeedbackType, 
  FeedbackOptions,
  FeedbackEvent
} from '../types'
import { notify } from '../notify'
import { getConfig } from '../config'

/**
 * Registry for named templates
 */
const templateRegistry = new Map<string, NotificationTemplate>()

/**
 * Create a reusable notification template
 * 
 * @param config - Template configuration
 * @returns Template instance with show methods
 * 
 * @example
 * ```ts
 * // Create a template for network errors
 * const networkError = createTemplate({
 *   type: 'error',
 *   defaults: {
 *     timeout: 0,
 *     actions: [
 *       { id: 'retry', label: 'Retry', variant: 'primary' }
 *     ]
 *   },
 *   render: (error) => ({
 *     title: 'Network Error',
 *     description: error.message
 *   })
 * })
 * 
 * // Use the template
 * networkError.show('Failed to connect')
 * networkError.showWith({ message: 'Timeout' })
 * ```
 */
export function createTemplate<T = unknown>(
  config: NotificationTemplate<T>
): TemplateInstance<T> {
  const { type, defaults = {}, render, actions } = config

  const show = async (
    message: string,
    data?: T,
    options?: Partial<FeedbackOptions>
  ): Promise<FeedbackEvent> => {
    const richContent = data && render ? render(data) : undefined
    
    // Build merged options, only including defined values
    const mergedOptions: FeedbackOptions = {
      ...defaults,
      ...options,
    }
    
    // Add richContent if available
    if (richContent || options?.richContent) {
      (mergedOptions as { richContent?: typeof richContent }).richContent = richContent || options?.richContent
    }
    
    // Add actions if available
    const finalActions = options?.actions || actions
    if (finalActions) {
      (mergedOptions as { actions?: typeof finalActions }).actions = finalActions
    }

    // Use notify with object format
    return notify({
      message,
      type,
      options: mergedOptions,
    })
  }

  const showWith = async (
    data: T,
    options?: Partial<FeedbackOptions>
  ): Promise<FeedbackEvent> => {
    if (!render) {
      throw new Error('[a11y-feedback] Template has no render function')
    }

    const richContent = render(data)
    const message = richContent.title || richContent.description || ''

    return show(message, data, options)
  }

  return {
    show,
    showWith,
  }
}

/**
 * Register a named template for global access
 * 
 * @param name - Template name
 * @param config - Template configuration
 */
export function registerTemplate<T = unknown>(
  name: string,
  config: NotificationTemplate<T>
): void {
  templateRegistry.set(name, config as NotificationTemplate)

  if (getConfig().debug) {
    console.log(`[a11y-feedback] Template registered: ${name}`)
  }
}

/**
 * Get a registered template by name
 * 
 * @param name - Template name
 * @returns Template configuration or undefined
 */
export function getTemplate<T = unknown>(
  name: string
): NotificationTemplate<T> | undefined {
  return templateRegistry.get(name) as NotificationTemplate<T> | undefined
}

/**
 * Unregister a template
 * 
 * @param name - Template name
 */
export function unregisterTemplate(name: string): void {
  templateRegistry.delete(name)
}

/**
 * Get all registered template names
 */
export function getRegisteredTemplates(): readonly string[] {
  return Array.from(templateRegistry.keys())
}

/**
 * Clear all registered templates
 */
export function clearTemplates(): void {
  templateRegistry.clear()
}

/**
 * Show a notification using a registered template
 * 
 * @param templateName - Name of the registered template
 * @param message - Message to display
 * @param data - Optional data for the render function
 * @param options - Additional options
 */
export async function showTemplate<T = unknown>(
  templateName: string,
  message: string,
  data?: T,
  options?: Partial<FeedbackOptions>
): Promise<FeedbackEvent> {
  const template = getTemplate<T>(templateName)
  
  if (!template) {
    throw new Error(`[a11y-feedback] Template not found: ${templateName}`)
  }

  const instance = createTemplate(template)
  return instance.show(message, data, options)
}

// ============================================================================
// Built-in Templates
// ============================================================================

/**
 * Built-in template for form validation errors
 */
export const formErrorTemplate = createTemplate<{ field: string; message: string }>({
  type: 'error',
  defaults: {
    timeout: 0,
  },
  render: (data) => ({
    title: 'Validation Error',
    description: `${data.field}: ${data.message}`,
  }),
})

/**
 * Built-in template for async operations
 */
export const asyncOperationTemplate = createTemplate<{ 
  loading: string
  success: string
  error: string 
}>({
  type: 'loading',
  render: (data) => ({
    description: data.loading,
  }),
})

/**
 * Built-in template for undo actions
 */
export const undoTemplate = createTemplate<{ 
  action: string
  onUndo: () => void 
}>({
  type: 'info',
  defaults: {
    timeout: 8000,
  },
  render: (data) => ({
    description: data.action,
  }),
  actions: [
    {
      id: 'undo',
      label: 'Undo',
      variant: 'secondary',
      onClick: () => {
        // This will be overwritten when using the template
      },
    },
  ],
})

/**
 * Built-in template for network status
 */
export const networkStatusTemplate = createTemplate<{ online: boolean }>({
  type: 'info',
  render: (data) => ({
    title: data.online ? 'Back Online' : 'Offline',
    description: data.online 
      ? 'Your connection has been restored'
      : 'You appear to be offline. Some features may not work.',
    icon: data.online 
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
  }),
})

/**
 * Built-in template for file upload progress
 */
export const fileUploadTemplate = createTemplate<{
  fileName: string
  progress?: number
  status: 'uploading' | 'complete' | 'failed'
}>({
  type: 'loading',
  render: (data) => {
    const statusMessages = {
      uploading: `Uploading ${data.fileName}...`,
      complete: `${data.fileName} uploaded successfully`,
      failed: `Failed to upload ${data.fileName}`,
    }
    
    return {
      title: data.fileName,
      description: statusMessages[data.status],
    }
  },
})

/**
 * Built-in template for permission requests
 */
export const permissionTemplate = createTemplate<{
  permission: string
  reason: string
  onAllow: () => void
  onDeny: () => void
}>({
  type: 'warning',
  defaults: {
    timeout: 0,
  },
  render: (data) => ({
    title: `${data.permission} Permission Required`,
    description: data.reason,
  }),
  actions: [
    {
      id: 'deny',
      label: 'Deny',
      variant: 'secondary',
      onClick: () => {},
    },
    {
      id: 'allow',
      label: 'Allow',
      variant: 'primary',
      onClick: () => {},
    },
  ],
})

/**
 * Create a template with undo action
 * 
 * @param type - Feedback type
 * @param undoHandler - Function to call on undo
 * @param timeout - Auto-dismiss timeout (default 8000ms)
 */
export function createUndoTemplate(
  type: FeedbackType,
  undoHandler: () => void | Promise<void>,
  timeout = 8000
): TemplateInstance<void> {
  return createTemplate({
    type,
    defaults: {
      timeout,
      actions: [
        {
          id: 'undo',
          label: 'Undo',
          variant: 'secondary',
          onClick: undoHandler,
        },
      ],
    },
  })
}

/**
 * Create a template for async operations with loading -> success/error transition
 */
export function createAsyncTemplate<TSuccess, TError = Error>(config: {
  loadingMessage: string
  successMessage: (result: TSuccess) => string
  errorMessage: (error: TError) => string
  successTimeout?: number
}): {
  execute: <T extends TSuccess>(operation: Promise<T>) => Promise<T>
} {
  let currentNotificationId: string | null = null

  return {
    execute: async <T extends TSuccess>(operation: Promise<T>): Promise<T> => {
      // Show loading
      const loadingEvent = await notify.loading(config.loadingMessage)
      currentNotificationId = loadingEvent.id

      try {
        const result = await operation
        
        // Show success
        await notify.success(config.successMessage(result), {
          id: currentNotificationId,
          timeout: config.successTimeout ?? 5000,
        })
        
        return result
      } catch (error) {
        // Show error
        await notify.error(config.errorMessage(error as TError), {
          id: currentNotificationId,
        })
        
        throw error
      }
    },
  }
}

