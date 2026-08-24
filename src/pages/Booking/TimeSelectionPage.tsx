import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Card, Button } from '@/components/ui'

const SERVICES: Record<string, { duration: number; name: string; price: string }> = {
  '1': { duration: 30, name: 'Haircut', price: '50 DH' },
  '2': { duration: 20, name: 'Beard Trim', price: '30 DH' },
  '3': { duration: 45, name: 'Haircut + Beard', price: '80 DH' },
}

const WORK_START_MIN = 9 * 60
const WORK_END_MIN = 20 * 60

// Mock blocked / bookings for today – 10:00-10:30 blocked
const MOCK_BOOKINGS: Array<{ start: string; end: string }> = [{ start: '10:00', end: '10:30' }]
// Mock breaks: 13:00-14:00 daily
const MOCK_BREAKS: Array<{ start: string; end: string }> = [{ start: '13:00', end: '14:00' }]
// Mock blocked dates (YYYY-MM-DD)
const MOCK_BLOCKED_DATES: string[] = ['2026-12-25', '2026-01-01']

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function minutesToTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart
}

type Slot = { time: string; end: string; available: boolean; reason: 'free' | 'booked' | 'break' | 'blockedDate' }

const TimeSelectionPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ serviceId: string }>()
  const location = useLocation()
  const dir = i18n.language === 'ar-MA' ? 'rtl' : 'ltr'

  const search = new URLSearchParams(location.search)
  const dateParam = search.get('date') || new Date().toISOString().slice(0, 10)

  const service = SERVICES[params.serviceId || '1'] || SERVICES['1']
  const duration = service.duration

  const [selected, setSelected] = useState<string | null>(null)

  const slots: Slot[] = useMemo(() => {
    const isBlockedDate = MOCK_BLOCKED_DATES.includes(dateParam)
    if (isBlockedDate) return []

    const result: Slot[] = []
    for (let start = WORK_START_MIN; start + duration <= WORK_END_MIN; start += duration) {
      const end = start + duration
      const time = minutesToTime(start)
      const endStr = minutesToTime(end)

      // Check bookings
      let reason: Slot['reason'] = 'free'
      let available = true

      for (const b of MOCK_BOOKINGS) {
        if (overlaps(start, end, timeToMinutes(b.start), timeToMinutes(b.end))) {
          reason = 'booked'
          available = false
          break
        }
      }
      if (available) {
        for (const br of MOCK_BREAKS) {
          if (overlaps(start, end, timeToMinutes(br.start), timeToMinutes(br.end))) {
            reason = 'break'
            available = false
            break
          }
        }
      }

      result.push({ time, end: endStr, available, reason })
    }
    return result
  }, [duration, dateParam])

  const handleSelect = (time: string) => {
    setSelected(time)
  }

  const handleConfirm = () => {
    if (!selected) return
    // Spec: /booking/customer/:serviceId?time=HH:MM  (date preserved as query)
    navigate(`/booking/customer/${params.serviceId}?time=${encodeURIComponent(selected)}&date=${encodeURIComponent(dateParam)}`)
  }

  // Display date long
  const displayDate = useMemo(() => {
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar-MA' ? 'ar-MA' : 'en-US'
      return new Date(dateParam).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateParam
    }
  }, [dateParam, i18n.language])

  return (
    <main dir={dir} className="min-h-screen bg-black px-4 py-6 sm:py-8" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#F5F5F0] mb-1 leading-tight">{t('chooseATime')}</h1>
        <p className="text-[#A8A8A3] text-[14px] mb-3">
          {service.name} · {service.price} · {t(`duration${service.duration}`, { duration: service.duration })}
        </p>
        <p className="text-[#A8A8A3] text-[13px] mb-5 capitalize">{displayDate} · {dateParam}</p>

        {slots.length === 0 ? (
          <Card className="p-6 bg-[#141414] border border-[#242424] rounded-xl text-center">
            <p className="text-[#F5F5F0] font-medium">No slots available</p>
            <p className="text-[#A8A8A3] text-sm mt-1">This date is fully booked or blocked.</p>
            <Button variant="outline" className="w-full mt-4 min-h-[44px]" onClick={() => navigate(-1)}>
              {t('chooseADate')}
            </Button>
          </Card>
        ) : (
          <>
            <p className="text-[#F5F5F0] text-[13px] font-semibold tracking-tight mb-3">{t('availableSlots')}</p>
            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => {
                const isSelected = selected === slot.time
                const isAvailable = slot.available

                if (isSelected) {
                  return (
                    <button
                      key={slot.time}
                      onClick={() => handleSelect(slot.time)}
                      className="min-h-[44px] h-11 rounded-xl font-semibold text-[15px] tracking-[-0.01em] transition-colors duration-150 bg-[#C9A227] text-black border border-[#C9A227] shadow-[0_2px_10px_rgba(201,162,39,0.15)]"
                      aria-pressed="true"
                    >
                      {slot.time}
                    </button>
                  )
                }

                if (!isAvailable) {
                  return (
                    <button
                      key={slot.time}
                      disabled
                      className="min-h-[44px] h-11 rounded-xl font-semibold text-[15px] border border-[#242424] text-[#A8A8A3] bg-transparent opacity-40 cursor-not-allowed"
                      aria-disabled="true"
                    >
                      {slot.time}
                    </button>
                  )
                }

                return (
                  <button
                    key={slot.time}
                    onClick={() => handleSelect(slot.time)}
                    className="min-h-[44px] h-11 rounded-xl font-semibold text-[15px] tracking-[-0.01em] transition-colors duration-150 bg-transparent border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[#242424]">
              <Button
                variant="primary"
                className="w-full min-h-[44px] bg-[#C9A227] text-black hover:bg-[#E0B83F] disabled:opacity-40 disabled:pointer-events-none"
                disabled={!selected}
                onClick={handleConfirm}
              >
                {t('confirmBooking')}
              </Button>
              {!selected && <p className="text-[#A8A8A3] text-[12px] text-center mt-2">Select a time to continue</p>}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default TimeSelectionPage
