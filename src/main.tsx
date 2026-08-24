import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'

import PublicBarberPage from './pages/PublicBarberPage/PublicBarberPage.tsx'
import ServiceSelectionPage from './pages/Booking/ServiceSelectionPage.tsx'
import DateSelectionPage from './pages/Booking/DateSelectionPage.tsx'
import TimeSelectionPage from './pages/Booking/TimeSelectionPage.tsx'
import CustomerInformationPage from './pages/Booking/CustomerInformationPage.tsx'
import ConfirmationPage from './pages/Booking/ConfirmationPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import DashboardPage from './pages/DashboardPage/DashboardPage.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from './hooks/use-i18n'
import './hooks/use-i18n'
import React from 'react'

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
      <Routes>
        <Route path="/" element={<PublicBarberPage />} />
        <Route path="/barber/:slug" element={<PublicBarberPage />} />
        <Route path="/booking" element={<ServiceSelectionPage />} />
        <Route path="/booking/confirm/:serviceId" element={<DateSelectionPage />} />
        <Route path="/booking/times/:serviceId" element={<TimeSelectionPage />} />
        <Route path="/booking/customer/:serviceId/:time?" element={<CustomerInformationPage />} />
        <Route path="/booking/confirmation/:serviceId/:time" element={<ConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>

      {currentLang !== 'en' && (
        <div
          className="fixed top-4 right-4 flex gap-2 z-50"
          style={{ color: 'text-white' }}
        >
          <button
            onClick={() => handleLanguageChange('en')}
            className="px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('fr')}
            className="px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
          >
            FR
          </button>
          <button
            onClick={() => handleLanguageChange('ar-MA')}
            className="px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
            style={{ direction: 'rtl' }}
          >
            AR
          </button>
        </div>
      )}
    </>
  )
}