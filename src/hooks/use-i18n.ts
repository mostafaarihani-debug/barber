import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import arMA from '../i18n/ar-MA.json'

const getInitialLang = () => {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('language')
  if (saved && ['en','fr','ar-MA'].includes(saved)) return saved
  const nav = navigator.language || 'en'
  if (nav.startsWith('ar')) return 'ar-MA'
  if (nav.startsWith('fr')) return 'fr'
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      'ar-MA': { translation: arMA },
    },
    lng: getInitialLang(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

// RTL + persist
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    const dir = lng === 'ar-MA' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lng
    localStorage.setItem('language', lng)
  }
})
// init dir on load
if (typeof document !== 'undefined') {
  const dir = (i18n.language === 'ar-MA') ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = i18n.language
}

export default i18n
export { useTranslation }
export const changeLanguage = (lng: string) => i18n.changeLanguage(lng)
