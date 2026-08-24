import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'

export const Navbar = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gold flex items-center justify-center">
            <span className="text-black text-xl font-bold">B</span>
          </div>
          <h1 className="text-xl font-semibold text-black">{t('dashboard')}</h1>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-secondary text-sm">{user.name}</span>
            <a
              href="#"
              onClick={logout}
              className="text-secondary text-sm hover:underline"
            >
              {t('logout')}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a href="/login" className="text-secondary hover:underline">{t('login')}</a>
            <a href="/register" className="text-secondary hover:underline">{t('register')}</a>
          </div>
        )}
      </div>
    </nav>
  )
}