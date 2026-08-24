import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import arMA from '../i18n/ar-MA.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr,
      'ar-MA': arMA,
    },
    lng: typeof window !== 'undefined' ? localStorage.getItem('language') || (navigator.language.startsWith('ar') ? 'ar-MA' : navigator.language.startsWith('fr') ? 'fr' : 'en') : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
export { useTranslation }
export const changeLanguage = (lng: string) => i18n.changeLanguage(lng)