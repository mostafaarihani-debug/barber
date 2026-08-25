import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Card, Button, BackButton } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'
import type { Service } from '@/types'

const TimeSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()
  const [searchParams] = useSearchParams()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'
  const dateISO = searchParams.get('date') || new Date().toISOString().slice(0,10)

  const [service, setService] = useState<Service | null>(null)
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = (() => { try { return localStorage.getItem('barber:currentBookingSlug') || localStorage.getItem('barber:lastSlug') || 'hamza-barber' } catch { return 'hamza-barber' }})()
    apiGetBarber(slug).then(({ services }) => {
      const found = (services as Service[]).find(s => s.id === params.serviceId)
      if (found) setService(found)
      else {
        try {
          const raw = localStorage.getItem('barber:services:1')
          if (raw) {
            const local = JSON.parse(raw) as Service[]
            const lf = local.find(s => s.id === params.serviceId)
            if (lf) setService(lf)
          }
        } catch {}
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [params.serviceId])

  useEffect(() => {
    if (!service) return
    const duration = service.duration || 30
    const startHour = 9
    const endHour = 20
    const slots: Array<{ time: string; available: boolean }> = []
    // Mock existing bookings: 10:00-10:30 blocked (for demo, later fetch real bookings via API)
    const mockBlocked = [{ start: '10:00', end: '10:30' }]
    const toMin = (t: string) => { const [h,m]=t.split(':').map(Number); return h*60+m }
    for (let start = 9*60; start + duration <= 20*60; start += duration) {
      const h = Math.floor(start/60).toString().padStart(2,'0')
      const m = (start%60).toString().padStart(2,'0')
      const time = `${h}:${m}`
      const end = start + duration
      const endTime = `${Math.floor(end/60).toString().padStart(2,'0')}:${(end%60).toString().padStart(2,'0')}`
      const overlapsBlocked = mockBlocked.some(b => !(end <= toMin(b.start) || start >= toMin(b.end)))
      const isAvailable = !overlapsBlocked && Math.random() > 0.2
      slots.push({ time, available: isAvailable })
    }
    setTimeSlots(slots)
  }, [service])

  const selectTime = (time: string) => {
    // persist for next step
    try { localStorage.setItem('barber:currentBookingDate', dateISO); localStorage.setItem('barber:currentBookingTime', time) } catch {}
    navigate(`/booking/customer/${params.serviceId}/${encodeURIComponent(time)}?date=${dateISO}`)
  }

  if (loading) {
    return (
      <main dir={dir} className="min-h-screen bg-black px-4 py-6">
        <div className="max-w-[1100px] mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-card border border-border rounded-xl w-48" />
          <div className="grid grid-cols-2 gap-3">{[0,1,2,3,4,5].map(i=><div key={i} className="h-12 bg-card border border-border rounded-xl" />)}</div>
        </div>
      </main>
    )
  }

  if (!service) {
    return (
      <main dir={dir} className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-secondary">{t('serviceNotFound', { defaultValue: 'Service not found' })}</p>
          <Button className="mt-4" onClick={() => navigate('/booking')}>{t('chooseAService')}</Button>
        </div>
      </main>
    )
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8">
      <div className="max-w-[1100px] mx-auto">
        <BackButton fallback="/booking" />
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-primary mb-1 leading-tight">
          {t('chooseATime')}
        </h1>
        <p className="text-secondary text-sm mb-6">{service.name} • {service.duration} min • {dateISO}</p>

        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={slot.available ? 'outline' : 'secondary'}
              size="sm"
              disabled={!slot.available}
              onClick={() => slot.available && selectTime(slot.time)}
              className={`min-h-[44px] ${!slot.available ? 'opacity-40' : ''}`}
            >
              {slot.time}
            </Button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-secondary text-sm mb-4">Selected date: <span className="text-primary font-medium">{dateISO}</span></p>
        </div>
      </div>
    </main>
  )
}

export default TimeSelectionPage
