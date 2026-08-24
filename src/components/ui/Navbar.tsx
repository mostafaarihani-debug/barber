import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <nav className="bg-black border-b border-white/[0.06] sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/80" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center shadow-[0_2px_10px_rgba(201,162,39,0.15)] shrink-0">
            <span className="text-black text-[13px] font-bold tracking-tight">HB</span>
          </div>
          <span className="text-primary font-semibold text-sm tracking-tight">Barber</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-secondary text-sm truncate max-w-[120px]">{user.name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-secondary text-sm hover:text-primary transition-colors min-h-[44px] px-3 rounded-xl hover:bg-white/[0.06]"
            >
              {t('logout', { defaultValue: 'Logout' })}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-secondary hover:text-primary text-sm font-medium min-h-[44px] inline-flex items-center px-3 rounded-xl hover:bg-white/[0.06] transition-colors">
              {t('login', { defaultValue: 'Login' })}
            </Link>
            <Link to="/register" className="bg-gold text-black hover:bg-gold-light text-sm font-semibold min-h-[44px] inline-flex items-center px-4 rounded-xl shadow-[0_2px_10px_rgba(201,162,39,0.15)] transition-colors">
              {t('register', { defaultValue: 'Register' })}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
