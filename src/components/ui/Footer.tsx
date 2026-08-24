import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-black border-t border-white/[0.06] py-8 mt-auto" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-black text-xs font-bold">HB</span>
          </div>
          <span className="text-primary text-sm font-semibold tracking-tight">Barber</span>
        </div>
        <p className="text-secondary text-sm">
          {t('copyright', { defaultValue: `© ${new Date().getFullYear()} Barber` })}
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="text-secondary hover:text-gold text-sm transition-colors min-h-[44px] inline-flex items-center">
            {t('instagram', { defaultValue: 'Instagram' })}
          </a>
          <a href="#" className="text-secondary hover:text-gold text-sm transition-colors min-h-[44px] inline-flex items-center">
            {t('whatsapp', { defaultValue: 'WhatsApp' })}
          </a>
        </div>
        <p className="text-secondary/70 text-xs mt-4">{t('allRightsReserved', { defaultValue: 'All rights reserved' })}</p>
      </div>
    </footer>
  )
}
