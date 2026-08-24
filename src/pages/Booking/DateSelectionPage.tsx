import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const DateSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const services = [
    { id: '1', name: 'Haircut', duration: 30, price: '50 DH' },
    { id: '2', name: 'Beard Trim', duration: 20, price: '30 DH' },
    { id: '3', name: 'Haircut + Beard', duration: 45, price: '80 DH' },
  ]

  const service = services.find((s) => s.id === params.serviceId)

  const toISO = (d: Date) => d.toISOString().slice(0, 10)

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const todayISO = toISO(today)
  const tomorrowISO = toISO(tomorrow)

  const navigateToTimeSelection = (dateISO: string) => {
    navigate(`/booking/times/${params.serviceId}?date=${dateISO}`)
  }

  // Calendar stub: next 7 days
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() + i)
    return d
  })

  const formatDay = (d: Date) => d.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar-MA' ? 'ar-MA' : 'en-US', { weekday: 'short' })
  const formatDateNum = (d: Date) => d.getDate().toString()

  if (!service) {
    return (
      <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[#A8A8A3] text-[15px]">{t('serviceNotFound')}</p>
          <Button variant="primary" className="w-full mt-6" onClick={() => navigate('/booking')}>
            {t('chooseAService')}
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#F5F5F0] mb-6 leading-tight">{t('chooseADate')}</h1>

        <Card className="p-5 sm:p-6 bg-[#141414] border border-[#242424] rounded-xl">
          <div className="flex flex-row justify-between items-start gap-3 mb-5">
            <div className="flex-1">
              <p className="text-[#A8A8A3] text-[12px] uppercase tracking-wider mb-1">{t('service')}</p>
              <p className="text-[#F5F5F0] font-semibold text-[16px] leading-tight">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[#C9A227] font-semibold text-[16px]">{service.price}</p>
              <p className="text-[#A8A8A3] text-[13px]">{t(`duration${service.duration}`, { duration: service.duration })}</p>
            </div>
          </div>

          <p className="text-[#A8A8A3] text-[14px] mb-5 leading-relaxed">{t('selectDateAvailable') || t('chooseADate')}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="w-full min-h-[44px] border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-colors duration-150"
              onClick={() => navigateToTimeSelection(todayISO)}
            >
              {t('today')}
            </Button>
            <Button
              variant="outline"
              className="w-full min-h-[44px] border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-colors duration-150"
              onClick={() => navigateToTimeSelection(tomorrowISO)}
            >
              {t('tomorrow')}
            </Button>
          </div>

          {/* Calendar stub */}
          <div className="pt-5 border-t border-[#242424]">
            <p className="text-[#F5F5F0] text-[13px] font-semibold tracking-tight mb-3">{t('calendar') || 'Calendar'}</p>
            <div className="grid grid-cols-7 gap-2">
              {nextDays.map((d) => {
                const iso = toISO(d)
                const isToday = iso === todayISO
                return (
                  <button
                    key={iso}
                    onClick={() => navigateToTimeSelection(iso)}
                    className={`flex flex-col items-center justify-center rounded-xl border py-2.5 min-h-[60px] transition-colors duration-150 ${
                      isToday
                        ? 'bg-[#C9A227] border-[#C9A227] text-black'
                        : 'bg-transparent border-[#242424] text-[#F5F5F0] hover:border-[#C9A227]/40 hover:text-[#C9A227]'
                    }`}
                    aria-label={iso}
                  >
                    <span className="text-[11px] uppercase tracking-wider opacity-80">{formatDay(d)}</span>
                    <span className="text-[16px] font-semibold leading-none mt-1">{formatDateNum(d)}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-[#A8A8A3] text-[12px] mt-3 text-center">Tap a date to see available times</p>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default DateSelectionPage
