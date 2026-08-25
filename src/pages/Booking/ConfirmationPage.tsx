import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { apiGetBarber } from '@/lib/api'
import type { Service } from '@/types'

const BookingConfirmationPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const params = useParams<{ serviceId: string; time: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const [service, setService] = useState<Service | null>(null)
  const [barberName, setBarberName] = useState('Hamza Barber')
  const [loading, setLoading] = useState(true)

  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''
  const dateISO = searchParams.get('date') || (()=>{ try{return localStorage.getItem('barber:currentBookingDate')||''}catch{return ''}})()
  const time = params.time ? decodeURIComponent(params.time) : ''

  useEffect(() => {
    const slug = (()=>{ try{return localStorage.getItem('barber:currentBookingSlug') || localStorage.getItem('barber:lastSlug') || 'hamza-barber'}catch{return 'hamza-barber'}})()
    apiGetBarber(slug).then(({ profile, services }) => {
      if (profile) setBarberName(profile.displayName)
      const found = (services as Service[]).find(s=>s.id===params.serviceId)
      if (found) setService(found)
      else {
        try {
          const raw = localStorage.getItem('barber:services:1')
          if (raw) {
            const local = JSON.parse(raw) as Service[]
            const lf = local.find(s=>s.id===params.serviceId)
            if (lf) setService(lf)
            if (!profile) {
              const pRaw = localStorage.getItem('barber:profile:1')
              if (pRaw) setBarberName(JSON.parse(pRaw).displayName)
            }
          }
        } catch {}
      }
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [params.serviceId])

  const bookingDate = (() => {
    try {
      if (dateISO) return new Date(dateISO).toLocaleDateString(i18n.language==='fr'?'fr-FR':i18n.language==='ar-MA'?'ar-MA':'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      return new Date().toLocaleDateString(i18n.language==='fr'?'fr-FR':i18n.language==='ar-MA'?'ar-MA':'en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    } catch { return dateISO || new Date().toLocaleDateString() }
  })()

  const handleAddToCalendar = () => {
    if (!service) return
    const title = encodeURIComponent(`${barberName} — ${service.name}`)
    const details = encodeURIComponent(`Booking with ${barberName}, ${service.name} ${service.price} for ${name} (${phone})`)
    // Google Calendar template: dates=YYYYMMDDTHHmmSS/YYYYMMDDTHHmmSS
    const start = dateISO && time ? `${dateISO.replace(/-/g,'')}T${time.replace(':','')}00` : ''
    const endDate = new Date(`${dateISO}T${time}:00`)
    if (!isNaN(endDate.getTime())) endDate.setMinutes(endDate.getMinutes() + (service.duration || 30))
    const end = endDate.toISOString().replace(/[-:]/g,'').slice(0,15)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <main dir={dir} className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="h-32 w-full max-w-md bg-card border border-border rounded-xl animate-pulse" />
      </main>
    )
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8">
      <div className="max-w-[600px] mx-auto">
        <Card className="p-8 text-center bg-card border border-border rounded-xl">
          <div className="w-16 h-16 rounded-full bg-gold text-black flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
          <h2 className="text-2xl font-bold text-primary mt-4 tracking-tight">{t('bookingConfirmed')}</h2>
          <p className="text-secondary text-sm mt-2">{t('thankYou', { name: name || '—', defaultValue: `Thank you${name ? `, ${name}` : ''}` })}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
              <p className="text-secondary text-[11px] uppercase tracking-widest mb-1">{t('service')}</p>
              <p className="text-primary font-semibold">{service?.name || t('hairservice')}</p>
              <p className="text-gold text-sm font-bold mt-1">{service?.price || ''}</p>
              <p className="text-secondary text-xs">{service?.duration ? `${service.duration} min` : ''}</p>
            </div>
            <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
              <p className="text-secondary text-[11px] uppercase tracking-widest mb-1">{t('barber', { defaultValue: 'Barber' })}</p>
              <p className="text-primary font-semibold truncate">{barberName}</p>
              <p className="text-secondary text-xs mt-1">★ 4.9</p>
            </div>
            <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
              <p className="text-secondary text-[11px] uppercase tracking-widest mb-1">{t('date')}</p>
              <p className="text-primary font-medium text-sm leading-tight">{bookingDate}</p>
            </div>
            <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4">
              <p className="text-secondary text-[11px] uppercase tracking-widest mb-1">{t('time')}</p>
              <p className="text-primary font-bold text-lg leading-none">{time || '—'}</p>
            </div>
          </div>

          <div className="mt-6 bg-black/40 border border-white/[0.06] rounded-xl p-4 text-left">
            <p className="text-secondary text-[11px] uppercase tracking-widest mb-1">{t('customer')}</p>
            <p className="text-primary font-medium">{name || '—'}</p>
            <p className="text-secondary text-xs mt-1">{phone || ''}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
            <Button variant="outline" className="w-full min-h-[44px]" onClick={handleAddToCalendar}>{t('addToCalendar')}</Button>
            <Button variant="primary" className="w-full min-h-[44px]" onClick={() => navigate('/')}>{t('backToBarber')}</Button>
          </div>
          <p className="text-xs text-muted mt-4">A confirmation has been sent • {barberName} will see your booking in Dashboard → Bookings</p>
        </Card>
      </div>
    </main>
  )
}

export default BookingConfirmationPage
