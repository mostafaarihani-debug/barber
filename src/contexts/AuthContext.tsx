import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { apiRegister, apiLogin } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: 'customer' | 'barber'
  language: 'en' | 'fr' | 'ar-MA'
}

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
  language: 'en' | 'fr' | 'ar-MA'
  setLanguage: (lang: 'en' | 'fr' | 'ar-MA') => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('barber:auth:user')
        if (raw) return JSON.parse(raw) as User
      } catch {}
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(t)
  }, [])

  const persist = (u: User | null, token?: string | null) => {
    setUser(u)
    try {
      if (u) {
        localStorage.setItem('barber:auth:user', JSON.stringify(u))
        if (token) localStorage.setItem('barber:auth:token', token)
      } else {
        localStorage.removeItem('barber:auth:user')
        localStorage.removeItem('barber:auth:token')
      }
    } catch {}
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user: u, token } = await apiLogin(email, password)
      persist(u as User, token)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true)
    try {
      const { user: u, token } = await apiRegister(name, email, phone, password)
      persist(u as User, token)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    persist(null, null)
  }

  const setLanguage = (lang: 'en' | 'fr' | 'ar-MA') => {
    // changeLanguage(lang)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, language: user?.language ?? 'en', setLanguage }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { User }