import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'
import type { Service } from '@/types'

const ServiceSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const [services, setServices] = useState<Service[] | null>(null)
  const [barberName, setBarberName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const slug = (() => {
      try {
        return localStorage.getItem('barber:currentBookingSlug') || localStorage.getItem('barber:lastSlug') || 'hamza-barber'
      } catch { return 'hamza-barber' }
    })()
    // try D1 first
    apiGetBarber(slug).then(({ profile, services }) => {
      setBarberName(profile.displayName)
      setServices(services as Service[])
    }).catch(() => {
      // fallback to localStorage services
      try {
        const raw = localStorage.getItem('barber:services:1')
        if (raw) {
          const local = JSON.parse(raw) as Service[]
          setServices(local.filter(s => s.active !== false))
          const pRaw = localStorage.getItem('barber:profile:1')
          if (pRaw) setBarberName(JSON.parse(pRaw).displayName)
          return
        }
      } catch {}
      // final fallback: empty to show empty state, not mock
      setServices([])
    }).finally(() => setLoading(false))
  }, [])

  const selectService = (service: Service) => {
    try { localStorage.setItem('barber:currentBookingServiceId', service.id) } catch {}
    navigate(`/booking/confirm/${service.id}`)
  }

  if (loading) {
    return (
      <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8">
        <div className="max-w-[1100px] mx-auto space-y-4 animate-pulse">
          <div className="h-8 bg-card border border-border rounded-xl w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0,1,2].map(i => <div key={i} className="h-[140px] bg-card border border-border rounded-xl" />)}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main dir={dir} className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-red-400">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </main>
    )
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-primary mb-2 leading-tight">
          {t('chooseAService')}
        </h1>
        {barberName && <p className="text-secondary text-sm mb-6">{barberName} • {t('availableSlots')}</p>}

        {services && services.length === 0 ? (
          <Card className="p-8 sm:p-10 text-center">
            <p className="text-primary font-semibold">{t('noServices')}</p>
            <p className="text-secondary text-sm mt-2">No services available for this barber yet.</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate('/')}>Back to barber</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(services || []).map((service) => (
              <Card
                key={service.id}
                onClick={() => selectService(service)}
                className="p-6 text-center bg-card border border-border rounded-xl hover:border-gold/20 transition-colors duration-150 cursor-pointer select-none min-h-[140px] flex flex-col items-center justify-center"
              >
                <div className="text-[32px] font-bold tracking-tight text-gold mb-2 leading-none">{service.price}</div>
                <h3 className="text-primary font-semibold text-[17px] leading-tight mb-1">{service.name}</h3>
                <p className="text-secondary text-[13px]">{service.duration} min</p>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-[15px] font-semibold tracking-tight text-primary mb-2">{t('availableSlots')}</h2>
          <p className="text-secondary text-[14px] leading-relaxed">{t('chooseAService')}</p>
        </div>
      </div>
    </main>
  )
}

export default ServiceSelectionPage
