import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'
import type { Service } from '@/types'

const DateSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = (() => {
      try { return localStorage.getItem('barber:currentBookingSlug') || localStorage.getItem('barber:lastSlug') || 'hamza-barber' } catch { return 'hamza-barber' }
    })()
    apiGetBarber(slug).then(({ services }) => {
      const found = (services as Service[]).find(s => s.id === params.serviceId)
      if (found) setService(found as Service)
      else {
        // fallback to localStorage
        try {
          const raw = localStorage.getItem('barber:services:1')
          if (raw) {
            const local = JSON.parse(raw) as Service[]
            const lf = local.find(s => s.id === params.serviceId)
            if (lf) setService(lf)
          }
        } catch {}
      }
    }).catch(() => {
      try {
        const raw = localStorage.getItem('barber:services:1')
        if (raw) {
          const local = JSON.parse(raw) as Service[]
          const lf = local.find(s => s.id === params.serviceId)
          if (lf) setService(lf)
        }
      } catch {}
    }).finally(() => setLoading(false))
  }, [params.serviceId])

  const toISO = (d: Date) => d.toISOString().slice(0, 10)
  const today = new Date()
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1)
  const todayISO = toISO(today)
  const tomorrowISO = toISO(tomorrow)
  const nextDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(today.getDate() + i); return d })
  const formatDay = (d: Date) => d.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar-MA' ? 'ar-MA' : 'en-US', { weekday: 'short' })
  const formatDateNum = (d: Date) => d.getDate().toString()

  if (loading) {
    return (
      <main dir={dir} className="min-h-screen bg-black px-4 py-6">
        <div className="max-w-[1100px] mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-card border border-border rounded-xl w-48" />
          <div className="h-40 bg-card border border-border rounded-xl" />
        </div>
      </main>
    )
  }

  if (!service) {
    return (
      <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-secondary text-[15px]">{t('serviceNotFound', { defaultValue: 'Service not found' })}</p>
          <Button variant="primary" className="w-full mt-6 min-h-[44px]" onClick={() => navigate('/booking')}>
            {t('chooseAService')}
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-primary mb-6 leading-tight">{t('chooseADate')}</h1>
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-xl">
          <div className="flex flex-row justify-between items-start gap-3 mb-5">
            <div className="flex-1">
              <p className="text-secondary text-[12px] uppercase tracking-wider mb-1">{t('service')}</p>
              <p className="text-primary font-semibold text-[16px] leading-tight">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-gold font-semibold text-[16px]">{service.price}</p>
              <p className="text-secondary text-[13px]">{service.duration} min</p>
            </div>
          </div>
          <p className="text-secondary text-[14px] mb-5 leading-relaxed">{t('selectDateAvailable') || t('chooseADate')}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="w-full min-h-[44px] border-gold text-gold hover:bg-gold hover:text-black" onClick={() => navigate(`/booking/times/${service.id}?date=${todayISO}`)}>
              {t('today')}
            </Button>
            <Button variant="outline" className="w-full min-h-[44px] border-gold text-gold hover:bg-gold hover:text-black" onClick={() => navigate(`/booking/times/${service.id}?date=${tomorrowISO}`)}>
              {t('tomorrow')}
            </Button>
          </div>
          <div className="pt-5 border-t border-border">
            <p className="text-primary text-[13px] font-semibold tracking-tight mb-3">{t('calendar') || 'Calendar'}</p>
            <div className="grid grid-cols-7 gap-2">
              {nextDays.map((d) => {
                const iso = toISO(d)
                const isToday = iso === todayISO
                return (
                  <button key={iso} onClick={() => navigate(`/booking/times/${service.id}?date=${iso}`)} className={`flex flex-col items-center justify-center rounded-xl border py-2.5 min-h-[60px] transition-colors duration-150 ${isToday ? 'bg-gold border-gold text-black' : 'bg-transparent border-border text-primary hover:border-gold/40 hover:text-gold'}`} aria-label={iso}>
                    <span className="text-[11px] uppercase tracking-wider opacity-80">{formatDay(d)}</span>
                    <span className="text-[16px] font-semibold leading-none mt-1">{formatDateNum(d)}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-secondary text-[12px] mt-3 text-center">Tap a date to see available times</p>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default DateSelectionPage
