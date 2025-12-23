/**
 * React Context Provider for a11y-feedback
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import {
  notify,
  configureFeedback,
  resetConfig,
  enableFeedbackDebug,
  disableFeedbackDebug,
  getFeedbackLog,
  clearFeedbackLog,
  dismissAllVisualFeedback,
  type FeedbackConfig,
  type FeedbackOptions,
  type FeedbackEvent,
  type FeedbackLogEntry,
} from '@theaccessibleteam/a11y-feedback'

/**
 * Context value interface
 */
export interface A11yFeedbackContextValue {
  /** Send a success notification */
  success: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  /** Send an error notification */
  error: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  /** Send a warning notification */
  warning: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  /** Send an info notification */
  info: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  /** Send a loading notification */
  loading: (message: string, options?: FeedbackOptions) => Promise<FeedbackEvent>
  /** Generic notify function */
  notify: typeof notify
  /** Dismiss all visual feedback */
  dismissAll: () => void
  /** Get the feedback log (when debug is enabled) */
  getLog: () => FeedbackLogEntry[]
  /** Clear the feedback log */
  clearLog: () => void
}

/**
 * Provider props
 */
export interface A11yFeedbackProviderProps {
  /** React children */
  children: ReactNode
  /** Configuration options */
  config?: Partial<FeedbackConfig>
  /** Enable debug mode */
  debug?: boolean
}

/**
 * React Context for a11y-feedback
 */
const A11yFeedbackContext = createContext<A11yFeedbackContextValue | null>(null)

/**
 * Provider component for a11y-feedback
 *
 * @example
 * ```tsx
 * import { A11yFeedbackProvider } from '@theaccessibleteam/a11y-feedback-react'
 *
 * function App() {
 *   return (
 *     <A11yFeedbackProvider config={{ visual: true }}>
 *       <MyApp />
 *     </A11yFeedbackProvider>
 *   )
 * }
 * ```
 */
export function A11yFeedbackProvider({
  children,
  config,
  debug = false,
}: A11yFeedbackProviderProps): JSX.Element {
  // Initialize configuration on mount
  useEffect(() => {
    if (config) {
      configureFeedback(config)
    }

    if (debug) {
      enableFeedbackDebug()
    }

    return () => {
      // Cleanup on unmount
      resetConfig()
      disableFeedbackDebug()
      dismissAllVisualFeedback()
    }
  }, []) // Only run on mount/unmount

  // Update config when props change
  useEffect(() => {
    if (config) {
      configureFeedback(config)
    }
  }, [config])

  // Update debug mode when prop changes
  useEffect(() => {
    if (debug) {
      enableFeedbackDebug()
    } else {
      disableFeedbackDebug()
    }
  }, [debug])

  // Memoized context value
  const contextValue = useMemo<A11yFeedbackContextValue>(
    () => ({
      success: (message: string, options?: FeedbackOptions) =>
        notify.success(message, options),
      error: (message: string, options?: FeedbackOptions) =>
        notify.error(message, options),
      warning: (message: string, options?: FeedbackOptions) =>
        notify.warning(message, options),
      info: (message: string, options?: FeedbackOptions) =>
        notify.info(message, options),
      loading: (message: string, options?: FeedbackOptions) =>
        notify.loading(message, options),
      notify,
      dismissAll: dismissAllVisualFeedback,
      getLog: () => [...getFeedbackLog()],
      clearLog: clearFeedbackLog,
    }),
    []
  )

  return (
    <A11yFeedbackContext.Provider value={contextValue}>
      {children}
    </A11yFeedbackContext.Provider>
  )
}

/**
 * Hook to access the a11y-feedback context
 *
 * @throws Error if used outside of A11yFeedbackProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { success, error } = useA11yFeedbackContext()
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData()
 *       success('Data saved successfully')
 *     } catch (e) {
 *       error('Failed to save data')
 *     }
 *   }
 *
 *   return <button onClick={handleSave}>Save</button>
 * }
 * ```
 */
export function useA11yFeedbackContext(): A11yFeedbackContextValue {
  const context = useContext(A11yFeedbackContext)

  if (context === null) {
    throw new Error(
      'useA11yFeedbackContext must be used within an A11yFeedbackProvider'
    )
  }

  return context
}

