/**
 * Promise-based Dialogs Module for a11y-feedback v2.0
 * Implements accessible confirm and prompt dialogs
 * @module dialogs
 */

import type { ConfirmOptions, ConfirmResult, PromptOptions, PromptResult } from '../types'
import { CSS_CLASSES_V2 } from '../constants'
import { getConfig } from '../config'
import { enableFocusTrap, disableFocusTrap } from './keyboard'
import { announceToRegion } from './regions'
import { getTranslation } from './i18n'

/**
 * Generate unique ID for dialogs
 */
let dialogCounter = 0
function generateDialogId(): string {
  return `a11y-dialog-${++dialogCounter}`
}

/**
 * Store for active dialogs
 */
const activeDialogs = new Map<string, { 
  element: HTMLElement
  previousFocus: Element | null
  resolve: (value: unknown) => void 
}>()

/**
 * Create the dialog backdrop
 */
function createBackdrop(dialogId: string): HTMLElement {
  const backdrop = document.createElement('div')
  backdrop.className = CSS_CLASSES_V2.dialogBackdrop
  backdrop.setAttribute('data-dialog-id', dialogId)
  backdrop.setAttribute('aria-hidden', 'true')
  
  // Click on backdrop cancels the dialog
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      cancelDialog(dialogId)
    }
  })
  
  return backdrop
}

/**
 * Create the dialog container
 */
function createDialogContainer(
  dialogId: string,
  title: string | undefined,
  message: string,
  icon?: string | SVGElement
): HTMLElement {
  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.dialog
  container.id = dialogId
  container.setAttribute('role', 'alertdialog')
  container.setAttribute('aria-modal', 'true')
  container.setAttribute('aria-labelledby', `${dialogId}-title`)
  container.setAttribute('aria-describedby', `${dialogId}-desc`)

  const content = document.createElement('div')
  content.className = CSS_CLASSES_V2.dialogContent

  // Icon
  if (icon) {
    const iconEl = document.createElement('div')
    iconEl.className = 'a11y-feedback-dialog-icon'
    iconEl.setAttribute('aria-hidden', 'true')
    
    if (typeof icon === 'string') {
      iconEl.innerHTML = icon
    } else {
      iconEl.appendChild(icon.cloneNode(true))
    }
    content.appendChild(iconEl)
  }

  // Title
  const titleEl = document.createElement('h2')
  titleEl.id = `${dialogId}-title`
  titleEl.className = CSS_CLASSES_V2.dialogTitle
  titleEl.textContent = title || getTranslation('confirmTitle') || 'Confirm'
  content.appendChild(titleEl)

  // Message
  const messageEl = document.createElement('p')
  messageEl.id = `${dialogId}-desc`
  messageEl.className = 'a11y-feedback-dialog-message'
  messageEl.textContent = message
  content.appendChild(messageEl)

  container.appendChild(content)

  return container
}

/**
 * Create dialog action buttons
 */
function createDialogActions(
  _dialogId: string, // Reserved for future use (e.g., unique IDs for buttons)
  options: ConfirmOptions,
  onConfirm: () => void,
  onCancel: () => void
): HTMLElement {
  const actions = document.createElement('div')
  actions.className = CSS_CLASSES_V2.dialogActions

  // Cancel button
  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.className = `a11y-feedback-dialog-btn a11y-feedback-dialog-btn--cancel`
  cancelBtn.textContent = options.cancelText || getTranslation('cancel') || 'Cancel'
  cancelBtn.addEventListener('click', onCancel)
  
  // Confirm button
  const confirmBtn = document.createElement('button')
  confirmBtn.type = 'button'
  confirmBtn.className = `a11y-feedback-dialog-btn a11y-feedback-dialog-btn--confirm`
  if (options.type === 'destructive') {
    confirmBtn.classList.add('a11y-feedback-dialog-btn--destructive')
  }
  confirmBtn.textContent = options.confirmText || getTranslation('confirm') || 'Confirm'
  confirmBtn.addEventListener('click', onConfirm)

  // Cancel first for keyboard flow, then confirm
  actions.appendChild(cancelBtn)
  actions.appendChild(confirmBtn)

  return actions
}

/**
 * Show a confirmation dialog
 * 
 * @param message - The message to display
 * @param options - Dialog options
 * @returns Promise that resolves with the user's choice
 * 
 * @example
 * ```ts
 * const { confirmed } = await confirm('Delete this item?', {
 *   title: 'Confirm Deletion',
 *   type: 'destructive'
 * })
 * 
 * if (confirmed) {
 *   deleteItem()
 * }
 * ```
 */
export async function confirm(
  message: string,
  options: ConfirmOptions = {}
): Promise<ConfirmResult> {
  return new Promise((resolve) => {
    const dialogId = generateDialogId()
    const previousFocus = document.activeElement

    // Create dialog elements
    const backdrop = createBackdrop(dialogId)
    const dialog = createDialogContainer(dialogId, options.title, message, options.icon)
    
    const handleConfirm = (): void => {
      closeDialog(dialogId)
      resolve({ confirmed: true })
    }

    const handleCancel = (): void => {
      closeDialog(dialogId)
      resolve({ confirmed: false })
    }

    const actions = createDialogActions(dialogId, options, handleConfirm, handleCancel)
    dialog.querySelector(`.${CSS_CLASSES_V2.dialogContent}`)?.appendChild(actions)

    backdrop.appendChild(dialog)
    document.body.appendChild(backdrop)

    // Store dialog reference
    activeDialogs.set(dialogId, { 
      element: backdrop, 
      previousFocus,
      resolve: (value) => resolve(value as ConfirmResult)
    })

    // Enable focus trap
    enableFocusTrap(dialog)

    // Announce to screen readers
    void announceToRegion('assertive', message)

    // Add escape key handler
    const escapeHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
        document.removeEventListener('keydown', escapeHandler)
      }
    }
    document.addEventListener('keydown', escapeHandler)

    if (getConfig().debug) {
      console.log('[a11y-feedback] Confirm dialog opened:', dialogId)
    }
  })
}

/**
 * Show a prompt dialog with input
 * 
 * @param message - The message to display
 * @param options - Prompt options
 * @returns Promise that resolves with the user's input
 * 
 * @example
 * ```ts
 * const { value, confirmed } = await prompt('Enter your name:', {
 *   title: 'Name Required',
 *   defaultValue: 'Anonymous'
 * })
 * 
 * if (confirmed && value) {
 *   greetUser(value)
 * }
 * ```
 */
export async function prompt(
  message: string,
  options: PromptOptions = {}
): Promise<PromptResult> {
  return new Promise((resolve) => {
    const dialogId = generateDialogId()
    const previousFocus = document.activeElement

    // Create dialog elements
    const backdrop = createBackdrop(dialogId)
    const dialog = createDialogContainer(dialogId, options.title, message, options.icon)
    const content = dialog.querySelector(`.${CSS_CLASSES_V2.dialogContent}`)

    // Create input
    const inputWrapper = document.createElement('div')
    inputWrapper.className = 'a11y-feedback-dialog-input-wrapper'

    const input = document.createElement('input')
    input.type = options.inputType || 'text'
    input.className = CSS_CLASSES_V2.dialogInput
    input.id = `${dialogId}-input`
    input.value = options.defaultValue || ''
    if (options.placeholder) {
      input.placeholder = options.placeholder
    }

    // Validation message
    const validationMsg = document.createElement('div')
    validationMsg.className = 'a11y-feedback-dialog-validation'
    validationMsg.setAttribute('role', 'alert')
    validationMsg.setAttribute('aria-live', 'polite')

    inputWrapper.appendChild(input)
    inputWrapper.appendChild(validationMsg)
    content?.appendChild(inputWrapper)

    // Validation function
    const validateInput = (): boolean => {
      if (options.validate) {
        const error = options.validate(input.value)
        if (error) {
          validationMsg.textContent = error
          input.setAttribute('aria-invalid', 'true')
          input.setAttribute('aria-describedby', validationMsg.id)
          return false
        }
      }
      validationMsg.textContent = ''
      input.removeAttribute('aria-invalid')
      return true
    }

    input.addEventListener('input', validateInput)

    const handleConfirm = (): void => {
      if (!validateInput()) {
        input.focus()
        return
      }
      closeDialog(dialogId)
      resolve({ value: input.value, confirmed: true })
    }

    const handleCancel = (): void => {
      closeDialog(dialogId)
      resolve({ value: null, confirmed: false })
    }

    const actions = createDialogActions(dialogId, options, handleConfirm, handleCancel)
    content?.appendChild(actions)

    backdrop.appendChild(dialog)
    document.body.appendChild(backdrop)

    // Store dialog reference
    activeDialogs.set(dialogId, { 
      element: backdrop, 
      previousFocus,
      resolve: (value) => resolve(value as PromptResult)
    })

    // Focus the input
    setTimeout(() => {
      input.focus()
      input.select()
    }, 50)

    // Enable focus trap
    enableFocusTrap(dialog)

    // Announce to screen readers
    void announceToRegion('assertive', message)

    // Add escape key handler and enter to submit
    const keyHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
        document.removeEventListener('keydown', keyHandler)
      } else if (e.key === 'Enter' && document.activeElement === input) {
        e.preventDefault()
        handleConfirm()
      }
    }
    document.addEventListener('keydown', keyHandler)

    if (getConfig().debug) {
      console.log('[a11y-feedback] Prompt dialog opened:', dialogId)
    }
  })
}

/**
 * Close a dialog by ID
 */
function closeDialog(dialogId: string): void {
  const dialog = activeDialogs.get(dialogId)
  
  if (!dialog) {
    return
  }

  // Remove from DOM
  dialog.element.remove()
  
  // Disable focus trap
  disableFocusTrap()

  // Restore previous focus
  if (dialog.previousFocus instanceof HTMLElement) {
    dialog.previousFocus.focus()
  }

  // Clean up
  activeDialogs.delete(dialogId)

  if (getConfig().debug) {
    console.log('[a11y-feedback] Dialog closed:', dialogId)
  }
}

/**
 * Cancel a dialog (resolve with cancelled state)
 */
function cancelDialog(dialogId: string): void {
  const dialog = activeDialogs.get(dialogId)
  
  if (!dialog) {
    return
  }

  closeDialog(dialogId)
  // The promise was already resolved by the cancel handler
}

/**
 * Close all open dialogs
 */
export function closeAllDialogs(): void {
  for (const dialogId of activeDialogs.keys()) {
    cancelDialog(dialogId)
  }
}

/**
 * Check if any dialogs are open
 */
export function hasOpenDialogs(): boolean {
  return activeDialogs.size > 0
}

/**
 * Get the number of open dialogs
 */
export function getOpenDialogCount(): number {
  return activeDialogs.size
}

/**
 * Generate CSS for dialogs
 */
export function getDialogsCSS(): string {
  return `
    .${CSS_CLASSES_V2.dialogBackdrop} {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 10000;
      animation: a11y-dialog-fade-in 0.15s ease;
    }

    .${CSS_CLASSES_V2.dialog} {
      background-color: var(--a11y-feedback-dialog-bg, #1f2937);
      color: var(--a11y-feedback-dialog-text, #f9fafb);
      border-radius: 0.75rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      max-width: 400px;
      width: calc(100% - 2rem);
      animation: a11y-dialog-scale-in 0.15s ease;
    }

    .${CSS_CLASSES_V2.dialogContent} {
      padding: 1.5rem;
      text-align: center;
    }

    .a11y-feedback-dialog-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .a11y-feedback-dialog-icon svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .${CSS_CLASSES_V2.dialogTitle} {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }

    .a11y-feedback-dialog-message {
      color: var(--a11y-feedback-dialog-text-muted, #9ca3af);
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }

    .a11y-feedback-dialog-input-wrapper {
      margin-bottom: 1rem;
    }

    .${CSS_CLASSES_V2.dialogInput} {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid var(--a11y-feedback-dialog-border, #374151);
      border-radius: 0.5rem;
      background-color: var(--a11y-feedback-dialog-input-bg, #111827);
      color: inherit;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .${CSS_CLASSES_V2.dialogInput}:focus {
      border-color: var(--a11y-feedback-focus-ring, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${CSS_CLASSES_V2.dialogInput}[aria-invalid="true"] {
      border-color: var(--a11y-feedback-error, #ef4444);
    }

    .a11y-feedback-dialog-validation {
      color: var(--a11y-feedback-error, #ef4444);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      min-height: 1.25rem;
    }

    .${CSS_CLASSES_V2.dialogActions} {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .a11y-feedback-dialog-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.1s ease;
      min-width: 100px;
    }

    .a11y-feedback-dialog-btn:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .a11y-feedback-dialog-btn:active {
      transform: scale(0.98);
    }

    .a11y-feedback-dialog-btn--cancel {
      background-color: var(--a11y-feedback-dialog-cancel-bg, #374151);
      color: var(--a11y-feedback-dialog-cancel-text, #f9fafb);
    }

    .a11y-feedback-dialog-btn--cancel:hover {
      background-color: var(--a11y-feedback-dialog-cancel-hover, #4b5563);
    }

    .a11y-feedback-dialog-btn--confirm {
      background-color: var(--a11y-feedback-dialog-confirm-bg, #3b82f6);
      color: var(--a11y-feedback-dialog-confirm-text, #ffffff);
    }

    .a11y-feedback-dialog-btn--confirm:hover {
      background-color: var(--a11y-feedback-dialog-confirm-hover, #2563eb);
    }

    .a11y-feedback-dialog-btn--destructive {
      background-color: var(--a11y-feedback-error, #ef4444);
    }

    .a11y-feedback-dialog-btn--destructive:hover {
      background-color: #dc2626;
    }

    @keyframes a11y-dialog-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes a11y-dialog-scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.dialogBackdrop},
      .${CSS_CLASSES_V2.dialog},
      .a11y-feedback-dialog-btn {
        animation: none;
        transition: none;
      }
    }

    @media (max-width: 480px) {
      .${CSS_CLASSES_V2.dialogActions} {
        flex-direction: column-reverse;
      }

      .a11y-feedback-dialog-btn {
        width: 100%;
      }
    }
  `
}

