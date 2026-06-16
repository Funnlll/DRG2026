import { useState, useCallback } from 'react'
import Toast, { type ToastKind } from '@/components/Toast'

interface ToastState {
  id: number
  kind: ToastKind
  message: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const show = useCallback((kind: ToastKind, message: string) => {
    setToast({ id: Date.now(), kind, message })
  }, [])

  const close = useCallback(() => setToast(null), [])

  const node = toast ? (
    <Toast key={toast.id} kind={toast.kind} message={toast.message} onClose={close} />
  ) : null

  return {
    show,
    success: (msg: string) => show('success', msg),
    error: (msg: string) => show('error', msg),
    warning: (msg: string) => show('warning', msg),
    info: (msg: string) => show('info', msg),
    node,
  }
}
