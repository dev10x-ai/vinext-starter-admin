import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { api } from '@/lib/api'

export type OtpPurpose = 'challenge' | 'login'

type AuthState = {
  user: User | null
  token: string | null
  pendingEmail: string | null
  otpPurpose: OtpPurpose | null
  login: (email: string, password: string) => Promise<'ok' | 'otp'>
  requestOtpLogin: (email: string) => Promise<void>
  verifyOtp: (code: string) => Promise<void>
  signup: (input: { name: string; organizationName: string; email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  clearPendingOtp: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      pendingEmail: null,
      otpPurpose: null,
      async login(email, password) {
        if (!email?.trim() || !password) {
          throw new Error('Email and password are required')
        }
        const res = await api.post<{ requiresOtp: boolean; user: User; token: string | null }>(
          '/auth/login',
          { email: email.trim(), password },
        )
        if (res.requiresOtp) {
          set({ pendingEmail: email.trim(), user: null, token: null, otpPurpose: 'challenge' })
          return 'otp'
        }
        set({ user: res.user, token: res.token, pendingEmail: null, otpPurpose: null })
        return 'ok'
      },
      async requestOtpLogin(email) {
        const trimmed = email?.trim()
        if (!trimmed) throw new Error('Email is required')
        await api.post<{ message: string; demoOtp?: string }>('/auth/otp/request', { email: trimmed })
        set({ pendingEmail: trimmed, user: null, token: null, otpPurpose: 'login' })
      },
      async verifyOtp(code) {
        const email = get().pendingEmail
        if (!email) throw new Error('No pending login')
        if (!code?.trim()) throw new Error('OTP code is required')
        const res = await api.post<{ user: User; token: string }>('/auth/otp', {
          email,
          code: code.trim(),
        })
        set({ user: res.user, token: res.token, pendingEmail: null, otpPurpose: null })
      },
      async signup(input) {
        const res = await api.post<{ user: User; token: string }>('/auth/signup', input)
        set({ user: res.user, token: res.token, pendingEmail: null, otpPurpose: null })
      },
      logout() {
        set({ user: null, token: null, pendingEmail: null, otpPurpose: null })
      },
      setUser(user) {
        set({ user })
      },
      clearPendingOtp() {
        set({ pendingEmail: null, otpPurpose: null })
      },
    }),
    {
      name: 'acp-auth',
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        pendingEmail: s.pendingEmail,
        otpPurpose: s.otpPurpose,
      }),
    },
  ),
)
