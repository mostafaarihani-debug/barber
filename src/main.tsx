import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'

import PublicBarberPage from './pages/PublicBarberPage/PublicBarberPage.tsx'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from './hooks/use-i18n'
import './hooks/use-i18n'
import React, { Suspense, lazy } from 'react'

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage.tsx'))

const ServiceSelectionPage = lazy(() => import('./pages/Booking/ServiceSelectionPage.tsx'))
const DateSelectionPage = lazy(() => import('./pages/Booking/DateSelectionPage.tsx'))
const TimeSelectionPage = lazy(() => import('./pages/Booking/TimeSelectionPage.tsx'))
const CustomerInformationPage = lazy(() => import('./pages/Booking/CustomerInformationPage.tsx'))
const ConfirmationPage = lazy(() => import('./pages/Booking/ConfirmationPage.tsx'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage.tsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage.tsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage.tsx'))
const ServicesManagementPage = lazy(() => import('./pages/Dashboard/ServicesManagementPage.tsx'))
const AvailabilityManagementPage = lazy(() => import('./pages/Dashboard/AvailabilityManagementPage.tsx'))
const CalendarPage = lazy(() => import('./pages/Dashboard/CalendarPage.tsx'))
const ProfilePage = lazy(() => import('./pages/Dashboard/ProfilePage.tsx'))
const SetupPage = lazy(() => import('./pages/Setup/SetupPage.tsx'))

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, info: any) {
    console.error('App Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#0B0B0B', color: '#F5F5F0', minHeight: '100vh' }}>
          <h1 style={{ color: '#C9A227' }}>App Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#141414', padding: 16, borderRadius: 8, border: '1px solid #242424' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, opacity: 0.7 }}>
            {String(this.state.error?.stack || '')}
          </pre>
          <p>Check console (F12) for details. URL: {window.location.href}</p>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

function Root() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<'en' | 'fr' | 'ar-MA'>((i18n.language as 'en' | 'fr' | 'ar-MA') || 'en')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language')
      if (savedLang) {
        setCurrentLang(savedLang as 'en' | 'fr' | 'ar-MA')
        changeLanguage(savedLang as 'en' | 'fr' | 'ar-MA')
      }
    }
  }, [])

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar-MA') => {
    setCurrentLang(lang)
    changeLanguage(lang)
  }

  return (
    <>
      <Suspense fallback={
        <main className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4 animate-pulse">
            <div className="h-8 bg-card border border-border rounded-xl" />
            <div className="h-32 bg-card border border-border rounded-xl" />
            <div className="h-12 bg-gold/20 rounded-xl" />
          </div>
        </main>
      }>
      <Routes>
        {/* Landing - main domain */}
        <Route path="/" element={<LandingPage />} />
        {/* Public barber - shareable URL */}
        <Route path="/barber/:slug" element={<PublicBarberPage />} />
        <Route path="/:slug" element={<PublicBarberPage />} />
        <Route path="/booking" element={<ServiceSelectionPage />} />
        <Route path="/booking/confirm/:serviceId" element={<DateSelectionPage />} />
        <Route path="/booking/times/:serviceId" element={<TimeSelectionPage />} />
        <Route path="/booking/customer/:serviceId/:time?" element={<CustomerInformationPage />} />
        <Route path="/booking/confirmation/:serviceId/:time" element={<ConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Barber Setup - separate profile creation */}
        <Route path="/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
        <Route path="/dashboard/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/services" element={<ProtectedRoute><ServicesManagementPage /></ProtectedRoute>} />
        <Route path="/dashboard/availability" element={<ProtectedRoute><AvailabilityManagementPage /></ProtectedRoute>} />
        <Route path="/dashboard/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        {/* 404 */}
        <Route path="*" element={
          <main className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
            <div>
              <h1 className="text-4xl font-bold text-primary">404</h1>
              <p className="text-secondary mt-2">{t('notFound', { defaultValue: 'Page not found' })}</p>
              <a href="/" className="inline-flex mt-6 h-11 px-6 rounded-xl bg-gold text-black font-semibold items-center justify-center">Back to home</a>
            </div>
          </main>
        } />
      </Routes>
      </Suspense>

      <div className="fixed top-4 right-4 flex gap-1.5 z-50 bg-black/70 backdrop-blur border border-white/10 rounded-full p-1">
        {(['en','fr','ar-MA'] as const).map(lng => (
          <button
            key={lng}
            onClick={() => handleLanguageChange(lng)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors min-h-[28px] ${currentLang===lng ? 'bg-gold text-black' : 'text-secondary hover:text-primary'}`}
            style={lng==='ar-MA' ? { direction: 'rtl' } : undefined}
          >
            {lng==='ar-MA' ? 'العربية' : lng.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  )
}