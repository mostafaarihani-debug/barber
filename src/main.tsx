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

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </BrowserRouter>
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