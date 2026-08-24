import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

type NavItem = { key: string; label: string; icon: string; href: string }

export const SidebarDesktop: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems: NavItem[] = [
    { key: 'dashboard', label: t('dashboard'), icon: '📊', href: '/dashboard' },
    { key: 'bookings', label: t('bookings'), icon: '📅', href: '/dashboard' },
    { key: 'calendar', label: t('calendar'), icon: '📌', href: '/dashboard/calendar' },
    { key: 'services', label: t('services'), icon: '✂️', href: '/dashboard/services' },
    { key: 'profile', label: t('profile'), icon: '👤', href: '/dashboard/profile' },
    { key: 'settings', label: t('settings'), icon: '⚙️', href: '/dashboard/settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-black border-r border-white/[0.06] flex-col sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-black font-bold text-sm tracking-tight shrink-0">
          HB
        </div>
        <div className="flex flex-col">
          <span className="text-primary font-semibold text-sm tracking-tight leading-none">Barber</span>
          <span className="text-secondary text-[11px] tracking-widest uppercase">Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.key}>
                <button
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 min-h-[44px] text-left ${
                    active
                      ? 'bg-gold/20 text-gold'
                      : 'text-secondary hover:text-primary hover:bg-white/[0.06]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="text-base leading-none w-5 text-center shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer subtle */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <p className="text-secondary text-xs leading-relaxed">
          Premium booking experience
        </p>
      </div>
    </aside>
  )
}

export const BottomNavMobile: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems: NavItem[] = [
    { key: 'dashboard', label: t('dashboard'), icon: '📊', href: '/dashboard' },
    { key: 'bookings', label: t('bookings'), icon: '📅', href: '/dashboard' },
    { key: 'calendar', label: t('calendar'), icon: '📌', href: '/dashboard/calendar' },
    { key: 'services', label: t('services'), icon: '✂️', href: '/dashboard/services' },
    { key: 'profile', label: t('profile'), icon: '👤', href: '/dashboard/profile' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/[0.06] h-16 z-50 safe-area-pb">
      <div className="max-w-[1100px] mx-auto h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.href)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px] min-w-[56px] rounded-xl mx-1 py-1.5 transition-colors duration-150 ${
                active ? 'text-gold' : 'text-secondary hover:text-primary'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className={`text-lg leading-none ${active ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
              <span className="text-[10px] font-medium tracking-wide leading-none truncate max-w-[64px]">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export const Navigations: React.FC = () => {
  return (
    <>
      <SidebarDesktop />
      <BottomNavMobile />
    </>
  )
}

export default Navigations
