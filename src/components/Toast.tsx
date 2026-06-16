import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastKind = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  kind?: ToastKind
  message: string
  onClose: () => void
  duration?: number
}

const KIND_STYLES: Record<ToastKind, { bg: string; icon: React.ReactNode; ring: string }> = {
  success: {
    bg: 'bg-accent-soft text-primary-deep',
    ring: 'ring-accent/30',
    icon: <CheckCircle2 className="w-5 h-5 text-accent-deep" strokeWidth={2.2} />,
  },
  error: {
    bg: 'bg-red-50 text-red-900',
    ring: 'ring-red-300',
    icon: <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.2} />,
  },
  warning: {
    bg: 'bg-amber-50 text-amber-900',
    ring: 'ring-amber-300',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={2.2} />,
  },
  info: {
    bg: 'bg-blue-50 text-blue-900',
    ring: 'ring-blue-300',
    icon: <Info className="w-5 h-5 text-blue-600" strokeWidth={2.2} />,
  },
}

export default function Toast({ kind = 'info', message, onClose, duration = 2600 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const s = KIND_STYLES[kind]
  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl shadow-paper-lg',
        'ring-1 backdrop-blur-md',
        'anim-fade-up max-w-[calc(100vw-2rem)]',
        s.bg,
        s.ring,
      )}
      role="alert"
    >
      {s.icon}
      <span className="font-medium text-sm">{message}</span>
    </div>
  )
}
