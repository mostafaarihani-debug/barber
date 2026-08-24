import React from 'react'
import { useTranslation } from 'react-i18next'

export const SidebarDesktop: React.FC = () => {
  const { t } = useTranslation()

  const navItems = [
    { key: 'dashboard', label: t('dashboard'), icon: '📊' },
    { key: 'bookings', label: t('bookings'), icon: '📅' },
    { key: 'calendar', label: t('calendar'), icon: '📌' },
    { key: 'services', label: t('services'), icon: '✂️' },
    { key: 'profile', label: t('profile'), icon: '👤' },
    { key: 'settings', label: t('settings'), icon: '⚙️' },
  ]

  return (
    <nav className="bg-black w-64 h-screen border-r border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-white font-semibold text-sm">{t('dashboard')}</h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-sm text-secondary hover:text-gold hover:bg-gray-800 transition-colors"
              >
                {item.icon} {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </nav>
  )
}

export const Navigations: React.FC = () => {
  return (
    <div>
      <SidebarDesktop />
      <BottomNavMobile />
    </div>
  )
}

export const BottomNavMobile: React.FC = () => {
  const { t } = useTranslation()

  const navItems = [
    { key: 'dashboard', label: t('dashboard'), icon: '📊' },
    { key: 'bookings', label: t('bookings'), icon: '📅' },
    { key: 'calendar', label: t('calendar'), icon: '📌' },
    { key: 'services', label: t('services'), icon: '✂️' },
    { key: 'profile', label: t('profile'), icon: '👤' },
  ]

  return (
    <nav className="bg-black border-t border-border fixed bottom-0 left-0 right-0">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {navItems.map((item) => (
          <a
            key={item.key}
            href="#"
            className="flex flex-col items-center gap-1 text-secondary text-xs font-medium hover:text-gold transition-colors flex-1"
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}