import { createContext, useContext, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string) => {
    setUser({ id: '1', name: 'Barber', email, phone: null, role: 'barber', language: 'en' })
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    setUser({ id: '1', name, email, phone, role: 'barber', language: 'en' })
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
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