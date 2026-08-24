import React from 'react'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-black py-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 text-center">
        <p className="text-secondary text-sm mb-4">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-secondary hover:text-gold transition-colors">
            {t('instagram')}
          </a>
          <a href="#" className="text-secondary hover:text-gold transition-colors">
            {t('whatsapp')}
          </a>
        </div>
        <p className="text-secondary text-xs mt-4">
          {t('allRightsReserved')}
        </p>
      </div>
    </footer>
  )
}