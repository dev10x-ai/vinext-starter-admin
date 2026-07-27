import { create } from 'zustand'

export type ToastTone = 'error' | 'success' | 'info'

export type Toast = {
  id: string
  message: string
  tone: ToastTone
}

const AUTO_DISMISS_MS = 4000

type ToastState = {
  toasts: Toast[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push(message, tone = 'info') {
    if (typeof message !== 'string' || message.trim() === '') {
      throw new Error('toast message is required')
    }
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, message: message.trim(), tone }],
    }))
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
    }, AUTO_DISMISS_MS)
  },
  dismiss(id) {
    if (!id) throw new Error('toast id is required')
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))

export const toast = {
  error(message: string) {
    useToastStore.getState().push(message, 'error')
  },
  success(message: string) {
    useToastStore.getState().push(message, 'success')
  },
  info(message: string) {
    useToastStore.getState().push(message, 'info')
  },
}
