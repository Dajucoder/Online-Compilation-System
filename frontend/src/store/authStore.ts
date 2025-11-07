import { create } from 'zustand'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (user: User, token: string) => {
    console.log('Auth Store - Login:', { user, token: token?.substring(0, 20) + '...' })
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    console.log('Auth Store - Logout')
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
  setUser: (user: User) => set({ user }),
}))
