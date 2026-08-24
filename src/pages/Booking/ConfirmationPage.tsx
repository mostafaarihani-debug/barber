import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const SERVICES: Record<string, { name: string; price: string; duration: number }> = {
  '1': { name: 'Haircut', price: '50 DH', duration: 30 },
  '2': { name: 'Beard Trim', price: '30 DH', duration: 20 },
  '3': { name: 'Haircut + Beard', price: '80 DH', duration: 45 },
}

const BookingConfirmationPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const params = useParams<{ serviceId: string; time: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const search = new URLSearchParams(location.search)
  const service = SERVICES[params.serviceId || '1'] || SERVICES['1']

  const bookingTime = params.time ? decodeURIComponent(params.time) : search.get('time') || '--:--'
  const customerName = search.get('name') || (params as any).name || ''
  const dateParam = search.get('date') || new Date().toISOString().slice(0, 10)

  const bookingDate = useMemo(() => {
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar-MA' ? 'ar-MA' : 'en-US'
      return new Date(dateParam).toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateParam
    }
  }, [dateParam, i18n.language])

  const handleAddToCalendar = () => {
    // Google Calendar template link
    const title = encodeURIComponent(`${service.name} - Barber Booking`)
    const details = encodeURIComponent(`Booking for ${customerName} - ${service.name} (${service.price})`)
    // Build dates: use dateParam + bookingTime as start, add duration
    const pad = (n: number) => String(n).padStart(2, '0')
    const [h, m] = bookingTime.split(':').map(Number)
    if (isNaN(h) || isNaN(m)) {
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`, '_blank')
      return
    }
    const start = new Date(dateParam)
    start.setHours(h, m, 0, 0)
    const end = new Date(start.getTime() + service.duration * 60000)
    const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
    const dates = `${fmt(start)}/${fmt(end)}`
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`
    window.open(url, '_blank')
  }

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-6 sm:p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227] text-black text-2xl font-bold">✓</div>
          <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-[#F5F5F0] mb-1">{t('bookingConfirmed')}</h2>
          <p className="text-[#A8A8A3] text-[14px] mb-8">{t('thankYou', { name: customerName }) || (customerName ? `Thank you, ${customerName}` : '')}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-black/30 border border-[#242424] rounded-xl p-4">
              <p className="text-[#A8A8A3] text-[11px] uppercase tracking-wider mb-1">{t('service')}</p>
              <p className="text-[#F5F5F0] font-semibold text-[16px] leading-tight">{service.name}</p>
              <p className="text-[#A8A8A3] text-[12px] mt-1">{t(`duration${service.duration}`, { duration: service.duration })}</p>
            </div>
            <div className="bg-black/30 border border-[#242424] rounded-xl p-4">
              <p className="text-[#A8A8A3] text-[11px] uppercase tracking-wider mb-1">{t('price')}</p>
              <p className="text-[#C9A227] font-bold text-[18px] leading-none">{service.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="bg-black/30 border border-[#242424] rounded-xl p-4">
              <p className="text-[#A8A8A3] text-[11px] uppercase tracking-wider mb-1">{t('date')}</p>
              <p className="text-[#F5F5F0] font-medium text-[14px] leading-tight capitalize">{bookingDate}</p>
            </div>
            <div className="bg-black/30 border border-[#242424] rounded-xl p-4">
              <p className="text-[#A8A8A3] text-[11px] uppercase tracking-wider mb-1">{t('time')}</p>
              <p className="text-[#F5F5F0] font-semibold text-[18px] leading-none">{bookingTime}</p>
            </div>
          </div>

          {customerName && (
            <div className="bg-black/30 border border-[#242424] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#A8A8A3] text-[11px] uppercase tracking-wider mb-1">{t('customer')}</p>
              <p className="text-[#F5F5F0] font-semibold text-[15px]">{customerName}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#242424] grid gap-3">
            <Button variant="primary" className="w-full min-h-[44px] bg-[#C9A227] text-black hover:bg-[#E0B83F]" onClick={() => navigate('/')}>
              {t('backToBarber')}
            </Button>
            <Button
              variant="outline"
              className="w-full min-h-[44px] border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black"
              onClick={handleAddToCalendar}
            >
              {t('addToCalendar')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default BookingConfirmationPage
