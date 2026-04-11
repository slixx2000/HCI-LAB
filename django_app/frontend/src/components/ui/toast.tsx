import { createContext, createElement, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  title: string
  description?: string
  tone?: ToastTone
}

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((current) => [...current, { id, ...toast }])

    window.setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  role="status"
                  aria-live="polite"
                  className={cn(
                    'pointer-events-auto rounded-2xl border bg-card p-4 shadow-lg backdrop-blur-sm transition-all',
                    toast.tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
                    toast.tone === 'error' && 'border-rose-200 bg-rose-50 text-rose-950',
                    toast.tone === 'info' && 'border-sky-200 bg-sky-50 text-sky-950',
                    !toast.tone && 'border-border text-foreground',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{toast.title}</p>
                      {toast.description ? <p className="text-sm opacity-90">{toast.description}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeToast(toast.id)}
                      className="rounded-full px-2 py-1 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100"
                      aria-label="Dismiss notification"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

type ToastToneProps = {
  tone?: ToastTone
}

export function ToastIcon({ tone = 'info' }: ToastToneProps) {
  const iconPath =
    tone === 'success'
      ? 'M12 16.2 8.8 13l-1.4 1.4L12 19.2 21.6 9.6l-1.4-1.4z'
      : tone === 'error'
        ? 'M12 10.6 6.6 5.2 5.2 6.6 10.6 12 5.2 17.4 6.6 18.8 12 13.4 17.4 18.8 18.8 17.4 13.4 12 18.8 6.6 17.4 5.2z'
        : 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z'

  return createElement(
    'svg',
    {
      viewBox: '0 0 24 24',
      className: 'h-5 w-5 shrink-0',
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    createElement('path', { d: iconPath }),
  )
}
