import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3200)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border-bright bg-surface-raised px-4 py-3 panel-glow animate-in"
      role="status"
    >
      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
      <span className="text-sm text-ink">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-muted hover:text-ink transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
